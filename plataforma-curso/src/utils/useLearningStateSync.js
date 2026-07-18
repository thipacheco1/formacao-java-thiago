import { useCallback, useEffect, useRef, useState } from 'react';

const OWNER_KEY = 'guidedProgressOwnerEmail';
const STEP_STORAGE_KEY_PATTERN = /^guided-[a-z0-9-]+-lesson-(\d{3})-progress$/;
const LESSON_ID_PATTERN = /^[A-Za-z0-9_.-]{1,220}$/;

const emptyState = () => ({ version: 1, lastLessonId: null, lessons: {} });
const cacheKey = email => `learningStateCache_${email}`;
const mutationKey = email => `learningStateMutations_${email}`;

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeStepIds(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(item => typeof item === 'string' && /^[A-Za-z0-9_.-]{1,100}$/.test(item)))].slice(0, 64);
}

function normalizeState(value) {
  const state = emptyState();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return state;
  if (typeof value.lastLessonId === 'string' && LESSON_ID_PATTERN.test(value.lastLessonId)) {
    state.lastLessonId = value.lastLessonId;
  }
  if (!value.lessons || typeof value.lessons !== 'object' || Array.isArray(value.lessons)) return state;
  for (const [lessonId, snapshot] of Object.entries(value.lessons)) {
    const number = lessonId.match(/^(\d{3})_/)?.[1];
    if (!number || !LESSON_ID_PATTERN.test(lessonId) || !snapshot || typeof snapshot !== 'object') continue;
    const key = typeof snapshot.stepStorageKey === 'string' ? snapshot.stepStorageKey : '';
    const activeStepIndex = Number.isInteger(snapshot.activeStepIndex) ? snapshot.activeStepIndex : 0;
    if (!STEP_STORAGE_KEY_PATTERN.test(key) || !key.includes(`-lesson-${number}-`) || activeStepIndex < 0 || activeStepIndex > 63) continue;
    state.lessons[lessonId] = {
      stepStorageKey: key,
      completedStepIds: normalizeStepIds(snapshot.completedStepIds),
      activeStepIndex,
      updatedAt: typeof snapshot.updatedAt === 'string' ? snapshot.updatedAt : null
    };
  }
  return state;
}

function readMutations(email) {
  const value = readJson(mutationKey(email), []);
  return Array.isArray(value) ? value.filter(item => item && typeof item === 'object') : [];
}

function writeMutations(email, mutations) {
  if (mutations.length === 0) localStorage.removeItem(mutationKey(email));
  else localStorage.setItem(mutationKey(email), JSON.stringify(mutations));
}

function enqueueMutation(email, mutation) {
  const mutations = readMutations(email).filter(item => (
    mutation.type === 'lastLesson'
      ? item.type !== 'lastLesson'
      : !(item.type === 'lesson' && item.lessonId === mutation.lessonId)
  ));
  mutations.push({ ...mutation, id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}` });
  writeMutations(email, mutations);
}

function guidedStorageKeys() {
  const keys = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && STEP_STORAGE_KEY_PATTERN.test(key)) keys.push(key);
  }
  return keys;
}

function clearGuidedStorage() {
  for (const key of guidedStorageKeys()) localStorage.removeItem(key);
}

function collectLocalSnapshots(lessons, cachedState) {
  const snapshots = {};
  for (const key of guidedStorageKeys()) {
    const lessonNumber = key.match(STEP_STORAGE_KEY_PATTERN)?.[1];
    const lesson = lessons.find(item => item.id?.startsWith(`${lessonNumber}_`));
    if (!lesson) continue;
    const completedStepIds = normalizeStepIds(readJson(key, []));
    snapshots[lesson.id] = {
      stepStorageKey: key,
      completedStepIds,
      activeStepIndex: cachedState.lessons[lesson.id]?.activeStepIndex || 0
    };
  }
  return snapshots;
}

function applyStateToStorage(state) {
  clearGuidedStorage();
  for (const snapshot of Object.values(state.lessons)) {
    localStorage.setItem(snapshot.stepStorageKey, JSON.stringify(snapshot.completedStepIds));
  }
}

export function useLearningStateSync({ currentUser, selectedLesson, lessons, setSelectedLesson, onSessionExpired }) {
  const email = currentUser?.email?.toLowerCase() || null;
  const stateRef = useRef(emptyState());
  const chainRef = useRef(Promise.resolve());
  const activeEmailRef = useRef(email);
  const [readyEmail, setReadyEmail] = useState(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => { activeEmailRef.current = email; }, [email]);

  const queueTask = useCallback((task) => {
    const next = chainRef.current.catch(() => undefined).then(task);
    chainRef.current = next;
    return next;
  }, []);

  const flushMutations = useCallback(emailToFlush => queueTask(async () => {
    while (activeEmailRef.current === emailToFlush) {
      const [mutation] = readMutations(emailToFlush);
      if (!mutation) return;
      const body = mutation.type === 'lastLesson'
        ? { email: emailToFlush, lastLessonId: mutation.lastLessonId }
        : {
            email: emailToFlush,
            lessonId: mutation.lessonId,
            stepStorageKey: mutation.stepStorageKey,
            completedStepIds: mutation.completedStepIds,
            activeStepIndex: mutation.activeStepIndex
          };
      const response = await fetch('/api/learning-state', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      if (!response.ok) {
        if (response.status === 401) onSessionExpired?.();
        throw new Error(`Learning state update failed (${response.status})`);
      }
      writeMutations(emailToFlush, readMutations(emailToFlush).filter(item => item.id !== mutation.id));
    }
  }), [onSessionExpired, queueTask]);

  const persistCache = useCallback((emailToSave, state) => {
    stateRef.current = state;
    localStorage.setItem(cacheKey(emailToSave), JSON.stringify(state));
  }, []);

  const reconcile = useCallback(async (emailToSync, signal) => {
    const cached = normalizeState(readJson(cacheKey(emailToSync), emptyState()));
    stateRef.current = cached;
    const previousOwner = localStorage.getItem(OWNER_KEY);
    const mayMigrateLocal = !previousOwner || previousOwner === emailToSync;
    const localSnapshots = mayMigrateLocal ? collectLocalSnapshots(lessons, cached) : {};
    if (previousOwner && previousOwner !== emailToSync) clearGuidedStorage();
    localStorage.setItem(OWNER_KEY, emailToSync);

    await flushMutations(emailToSync);
    const getState = async () => {
      const response = await fetch(`/api/learning-state?email=${encodeURIComponent(emailToSync)}`, {
        credentials: 'same-origin', cache: 'no-store', signal
      });
      if (!response.ok) {
        if (response.status === 401) onSessionExpired?.();
        throw new Error(`Learning state request failed (${response.status})`);
      }
      return normalizeState(await response.json());
    };

    let serverState = await getState();
    let migrated = false;
    for (const [lessonId, snapshot] of Object.entries(localSnapshots)) {
      if (serverState.lessons[lessonId]) continue;
      enqueueMutation(emailToSync, { type: 'lesson', lessonId, ...snapshot });
      migrated = true;
    }
    if (!serverState.lastLessonId && selectedLesson?.id) {
      enqueueMutation(emailToSync, { type: 'lastLesson', lastLessonId: selectedLesson.id });
      migrated = true;
    }
    if (migrated) {
      await flushMutations(emailToSync);
      serverState = await getState();
    }

    if (activeEmailRef.current !== emailToSync) return;
    applyStateToStorage(serverState);
    persistCache(emailToSync, serverState);
    setReadyEmail(emailToSync);
    setRevision(value => value + 1);
  }, [flushMutations, lessons, onSessionExpired, persistCache, selectedLesson?.id]);

  useEffect(() => {
    if (!email || lessons.length === 0) {
      stateRef.current = emptyState();
      setReadyEmail(null);
      return undefined;
    }
    let cancelled = false;
    void reconcile(email).catch(error => {
      if (cancelled) return;
      console.error('Failed to synchronize detailed learning state:', error);
      stateRef.current = normalizeState(readJson(cacheKey(email), emptyState()));
      setReadyEmail(email);
    });
    return () => { cancelled = true; };
  }, [email, lessons.length, reconcile]);

  useEffect(() => {
    if (!email || readyEmail !== email) return undefined;
    let controller = null;
    const synchronize = () => {
      if (document.visibilityState !== 'visible') return;
      controller?.abort();
      controller = new AbortController();
      void reconcile(email, controller.signal).catch(error => {
        if (error.name !== 'AbortError') console.error('Failed to refresh detailed learning state:', error);
      });
    };
    window.addEventListener('online', synchronize);
    window.addEventListener('focus', synchronize);
    document.addEventListener('visibilitychange', synchronize);
    return () => {
      controller?.abort();
      window.removeEventListener('online', synchronize);
      window.removeEventListener('focus', synchronize);
      document.removeEventListener('visibilitychange', synchronize);
    };
  }, [email, readyEmail, reconcile]);

  useEffect(() => {
    if (!email || readyEmail !== email || selectedLesson || lessons.length === 0) return;
    if (new URLSearchParams(window.location.search).get('aula')) return;
    const lastLesson = lessons.find(item => item.id === stateRef.current.lastLessonId);
    if (lastLesson) setSelectedLesson(lastLesson);
  }, [email, lessons, readyEmail, selectedLesson, setSelectedLesson]);

  useEffect(() => {
    if (!email || readyEmail !== email || !selectedLesson) return undefined;
    const lessonId = selectedLesson.id;
    if (stateRef.current.lastLessonId !== lessonId) {
      const nextState = { ...stateRef.current, lastLessonId: lessonId };
      persistCache(email, nextState);
      enqueueMutation(email, { type: 'lastLesson', lastLessonId: lessonId });
      void flushMutations(email).catch(error => console.error('Last lesson queued for retry:', error));
    }

    let observer;
    let timer;
    let attempts = 0;
    const connect = () => {
      const nav = document.querySelector('.guided-step-nav');
      if (!nav) {
        attempts += 1;
        if (attempts < 20) timer = window.setTimeout(connect, 50);
        return;
      }
      const buttons = [...nav.querySelectorAll(':scope > button')];
      const saved = stateRef.current.lessons[lessonId];
      let restoring = true;
      if (saved && buttons[saved.activeStepIndex] && !buttons[saved.activeStepIndex].classList.contains('active')) {
        buttons[saved.activeStepIndex].click();
      }

      const capture = () => {
        const currentButtons = [...nav.querySelectorAll(':scope > button')];
        const activeStepIndex = Math.max(0, currentButtons.findIndex(button => button.classList.contains('active')));
        const lessonNumber = lessonId.match(/^(\d{3})_/)?.[1];
        const stepStorageKey = guidedStorageKeys().find(key => key.includes(`-lesson-${lessonNumber}-`));
        if (!stepStorageKey) return;
        const snapshot = {
          stepStorageKey,
          completedStepIds: normalizeStepIds(readJson(stepStorageKey, [])),
          activeStepIndex
        };
        const previous = stateRef.current.lessons[lessonId];
        if (previous
          && previous.stepStorageKey === snapshot.stepStorageKey
          && previous.activeStepIndex === snapshot.activeStepIndex
          && JSON.stringify(previous.completedStepIds) === JSON.stringify(snapshot.completedStepIds)) return;
        const nextState = { ...stateRef.current, lessons: { ...stateRef.current.lessons, [lessonId]: snapshot } };
        persistCache(email, nextState);
        enqueueMutation(email, { type: 'lesson', lessonId, ...snapshot });
        void flushMutations(email).catch(error => console.error('Step progress queued for retry:', error));
      };

      timer = window.setTimeout(() => { restoring = false; capture(); }, 80);
      observer = new MutationObserver(() => {
        if (restoring) return;
        window.clearTimeout(timer);
        timer = window.setTimeout(capture, 120);
      });
      observer.observe(nav, { attributes: true, subtree: true, attributeFilter: ['class'] });
    };
    connect();
    return () => { window.clearTimeout(timer); observer?.disconnect(); };
  }, [email, flushMutations, persistCache, readyEmail, revision, selectedLesson]);

  return { learningStateReady: readyEmail === email, learningStateRevision: revision };
}
