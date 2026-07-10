import React, { useCallback, useEffect, useRef, useState } from 'react';
import { loadLessons } from './utils/lessonLoader';
import Sidebar from './components/Sidebar';
import MarkdownViewer from './components/MarkdownViewer';
import WelcomeView from './components/WelcomeView';
import AuthModal from './components/AuthModal';
import { Menu, ChevronRight } from 'lucide-react';
import { trackPageView, trackPresence } from './utils/analytics';

const LEGACY_VISITOR_EMAIL = 'visitante@preview.local';
const LEGACY_VISITOR_PROGRESS_KEY = 'completedLessons_visitor';

const readStoredUser = () => {
  const saved = localStorage.getItem('currentUser');
  if (!saved) return null;

  try {
    const user = JSON.parse(saved);
    const isLegacyVisitor = user?.isVisitor
      || user?.email?.toLowerCase() === LEGACY_VISITOR_EMAIL;

    if (!user?.email || isLegacyVisitor) {
      localStorage.removeItem('currentUser');
      return null;
    }

    return user;
  } catch {
    localStorage.removeItem('currentUser');
    return null;
  }
};

const getProgressStorageKey = (user) => (
  user?.email ? `completedLessons_${user.email.toLowerCase()}` : null
);

const normalizeProgress = (progress) => {
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) return {};

  return Object.fromEntries(
    Object.entries(progress).filter(([lessonId, completed]) => (
      completed === true && /^[A-Za-z0-9_.-]{1,220}$/.test(lessonId)
    ))
  );
};

const readStoredProgress = (user) => {
  const progressKey = getProgressStorageKey(user);
  if (!progressKey) return {};

  try {
    const saved = localStorage.getItem(progressKey);
    const parsed = saved ? JSON.parse(saved) : {};
    return normalizeProgress(parsed);
  } catch {
    return {};
  }
};

const getProgressMutationKey = (email) => `progressMutations_${email.toLowerCase()}`;
const getProgressMigrationKey = (email) => `progressCentralMigrationV2_${email.toLowerCase()}`;

const readProgressMutations = (email) => {
  try {
    const saved = localStorage.getItem(getProgressMutationKey(email));
    const parsed = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(mutation => (
      mutation
      && typeof mutation.id === 'string'
      && /^[A-Za-z0-9_.-]{1,220}$/.test(String(mutation.lessonId || ''))
      && typeof mutation.completed === 'boolean'
    ));
  } catch {
    return [];
  }
};

const writeProgressMutations = (email, mutations) => {
  const key = getProgressMutationKey(email);
  if (mutations.length === 0) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(mutations));
};

const enqueueProgressMutation = (email, lessonId, completed) => {
  const mutations = readProgressMutations(email)
    .filter(mutation => mutation?.lessonId !== lessonId);
  const mutation = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    lessonId,
    completed,
    createdAt: new Date().toISOString()
  };
  mutations.push(mutation);
  writeProgressMutations(email, mutations);
  return mutation;
};

function App() {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingLesson, setPendingLesson] = useState(null);
  
  // User Authentication State
  const [currentUser, setCurrentUser] = useState(readStoredUser);
  
  // State for sidebar collapse
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('isSidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const analyticsPageId = selectedLesson ? `lesson:${selectedLesson.id}` : 'home';
  const isAdminUser = currentUser?.email?.toLowerCase() === 'thipacheco1@gmail.com';

  // State for completed lessons using user-specific localStorage key
  const [completedLessons, setCompletedLessons] = useState(() => readStoredProgress(readStoredUser()));
  const progressRef = useRef(completedLessons);
  const progressMutationVersionRef = useRef(0);
  const progressSyncChainRef = useRef(Promise.resolve());
  const progressMutatedLessonsRef = useRef(new Map());
  const activeUserEmailRef = useRef(currentUser?.email?.toLowerCase() || null);

  const applyProgressState = useCallback((progress, user = null) => {
    const normalizedProgress = normalizeProgress(progress);
    progressRef.current = normalizedProgress;
    setCompletedLessons(normalizedProgress);

    const progressKey = getProgressStorageKey(user);
    if (progressKey) {
      localStorage.setItem(progressKey, JSON.stringify(normalizedProgress));
    }
  }, []);

  const queueProgressTask = useCallback((task) => {
    const queuedTask = progressSyncChainRef.current
      .catch(() => undefined)
      .then(task);

    progressSyncChainRef.current = queuedTask;
    return queuedTask;
  }, []);

  const flushProgressMutations = useCallback((email) => queueProgressTask(async () => {
    while (true) {
      const [mutation] = readProgressMutations(email);
      if (!mutation) return;

      const response = await fetch('/api/progress', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          lessonId: mutation.lessonId,
          completed: mutation.completed
        })
      });

      if (!response.ok) {
        throw new Error(`Progress update failed (${response.status})`);
      }

      const remainingMutations = readProgressMutations(email)
        .filter(pendingMutation => pendingMutation.id !== mutation.id);
      writeProgressMutations(email, remainingMutations);
    }
  }), [queueProgressTask]);

  const migrateLegacyProgress = useCallback(async (user) => {
    const email = user?.email?.toLowerCase();
    if (!email || localStorage.getItem(getProgressMigrationKey(email))) return;

    const changedLessons = progressMutatedLessonsRef.current.get(email) || new Set();
    const legacyProgress = Object.fromEntries(
      Object.entries(readStoredProgress(user))
        .filter(([lessonId, completed]) => completed === true && !changedLessons.has(lessonId))
    );

    if (Object.keys(legacyProgress).length === 0) {
      localStorage.setItem(getProgressMigrationKey(email), 'true');
      return;
    }

    await queueProgressTask(async () => {
      const response = await fetch('/api/progress', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, completedLessons: legacyProgress })
      });

      if (!response.ok) {
        throw new Error(`Legacy progress migration failed (${response.status})`);
      }
    });

    localStorage.setItem(getProgressMigrationKey(email), 'true');
  }, [queueProgressTask]);

  const reconcileProgress = useCallback(async (user, signal) => {
    const email = user?.email?.toLowerCase();
    if (!email) return;

    await migrateLegacyProgress(user);

    // A toggle can happen while the GET is in flight. Retrying after the queued
    // writes guarantees that an older response never replaces a newer click.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await flushProgressMutations(email);
      const mutationVersion = progressMutationVersionRef.current;
      const response = await fetch(`/api/progress?email=${encodeURIComponent(email)}`, {
        credentials: 'same-origin',
        cache: 'no-store',
        signal
      });

      if (!response.ok) {
        throw new Error(`Progress request failed (${response.status})`);
      }

      const serverProgress = normalizeProgress(await response.json());
      const isStillCurrentUser = activeUserEmailRef.current === email;
      const hasNewerMutation = mutationVersion !== progressMutationVersionRef.current
        || readProgressMutations(email).length > 0;

      if (isStillCurrentUser && !hasNewerMutation) {
        applyProgressState(serverProgress, user);
        return;
      }
    }
  }, [applyProgressState, flushProgressMutations, migrateLegacyProgress]);

  // Remove data created by the discontinued visitor mode.
  useEffect(() => {
    localStorage.removeItem(LEGACY_VISITOR_PROGRESS_KEY);
  }, []);

  useEffect(() => {
    activeUserEmailRef.current = currentUser?.email?.toLowerCase() || null;
  }, [currentUser]);

  useEffect(() => {
    if (loading || isAdminUser) return;
    void trackPageView(analyticsPageId);
  }, [analyticsPageId, isAdminUser, loading]);

  useEffect(() => {
    if (loading || isAdminUser) return undefined;

    const sendPresence = () => {
      if (document.visibilityState === 'visible') {
        void trackPresence(analyticsPageId);
      }
    };

    sendPresence();
    const interval = window.setInterval(sendPresence, 50_000);
    document.addEventListener('visibilitychange', sendPresence);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', sendPresence);
    };
  }, [analyticsPageId, isAdminUser, loading]);

  // Force migration of old localStorage users to central DB
  useEffect(() => {
    const migrationKey = 'db_migration_v1_done';
    if (!localStorage.getItem(migrationKey)) {
      // Clear old local users list and force logout
      localStorage.removeItem('users');
      localStorage.removeItem('currentUser');
      activeUserEmailRef.current = null;
      setCurrentUser(null);
      applyProgressState({});
      localStorage.setItem(migrationKey, 'true');
    }
  }, [applyProgressState]);

  // The central store is authoritative. Pending offline mutations are replayed
  // in order before applying the latest server state.
  useEffect(() => {
    if (!currentUser) return undefined;

    const abortController = new AbortController();
    void reconcileProgress(currentUser, abortController.signal).catch(error => {
      if (error.name !== 'AbortError') {
        console.error('Failed to synchronize progress with the central database:', error);
      }
    });

    return () => {
      abortController.abort();
    };
  }, [currentUser, reconcileProgress]);

  // Retry offline changes and pull progress completed on another device when
  // the app returns to the foreground or the connection comes back.
  useEffect(() => {
    if (!currentUser) return undefined;

    let activeController = null;
    const synchronize = () => {
      if (document.visibilityState !== 'visible') return;
      activeController?.abort();
      activeController = new AbortController();
      void reconcileProgress(currentUser, activeController.signal).catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Failed to retry progress synchronization:', error);
        }
      });
    };

    window.addEventListener('online', synchronize);
    window.addEventListener('focus', synchronize);
    document.addEventListener('visibilitychange', synchronize);

    return () => {
      activeController?.abort();
      window.removeEventListener('online', synchronize);
      window.removeEventListener('focus', synchronize);
      document.removeEventListener('visibilitychange', synchronize);
    };
  }, [currentUser, reconcileProgress]);

  // Keep an offline cache. Database writes are sent per lesson by
  // toggleLessonCompleted, avoiding whole-object last-write-wins conflicts.
  useEffect(() => {
    if (!currentUser) return;

    const progressKey = getProgressStorageKey(currentUser);
    if (!progressKey) return;
    localStorage.setItem(progressKey, JSON.stringify(completedLessons));
  }, [completedLessons, currentUser]);

  const toggleLessonCompleted = (lessonId) => {
    const completed = !progressRef.current[lessonId];
    const nextProgress = { ...progressRef.current };

    if (completed) nextProgress[lessonId] = true;
    else delete nextProgress[lessonId];

    applyProgressState(nextProgress, currentUser);

    if (!currentUser?.email) return;
    const email = currentUser.email.toLowerCase();
    progressMutationVersionRef.current += 1;

    const changedLessons = progressMutatedLessonsRef.current.get(email) || new Set();
    changedLessons.add(lessonId);
    progressMutatedLessonsRef.current.set(email, changedLessons);

    enqueueProgressMutation(email, lessonId, completed);
    void flushProgressMutations(email).catch(error => {
      // The mutation remains in localStorage and will be replayed on reconnect.
      console.error('Lesson progress queued for a later retry:', error);
    });
  };

  const handleLoginSuccess = (user) => {
    activeUserEmailRef.current = user?.email?.toLowerCase() || null;
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Quick local preview
    applyProgressState(readStoredProgress(user), user);

    if (pendingLesson) {
      setSelectedLesson(pendingLesson);
      setPendingLesson(null);
      return;
    }

    // Redirect to the lesson in URL if present and lessons loaded
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('aula');
    if (lessonId && lessons.length > 0) {
      const found = lessons.find(l => l.id === lessonId);
      if (found) {
        setSelectedLesson(found);
      }
    }
  };

  const handleLogout = () => {
    void fetch('/api/users', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    }).catch(() => {
      // Local logout must still succeed if the API is temporarily unavailable.
    });

    activeUserEmailRef.current = null;
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    applyProgressState({});
    
    // Return to landing page on logout
    setSelectedLesson(null);
  };

  const selectedLessonIndex = selectedLesson ? lessons.findIndex(l => l.id === selectedLesson.id) : -1;
  const hasPrevLesson = selectedLessonIndex > 0;
  const hasNextLesson = selectedLessonIndex !== -1 && selectedLessonIndex < lessons.length - 1;

  const goToNextLesson = () => {
    if (hasNextLesson) {
      setSelectedLesson(lessons[selectedLessonIndex + 1]);
    }
  };

  const goToPrevLesson = () => {
    if (hasPrevLesson) {
      setSelectedLesson(lessons[selectedLessonIndex - 1]);
    }
  };

  // Sync selectedLesson state with the URL query parameter
  useEffect(() => {
    if (loading || lessons.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const currentParam = params.get('aula');
    
    if (selectedLesson) {
      if (currentParam !== selectedLesson.id) {
        params.set('aula', selectedLesson.id);
        window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
      }
    } else {
      if (currentParam) {
        params.delete('aula');
        const search = params.toString();
        const suffix = search ? `?${search}` : '';
        window.history.pushState({}, '', `${window.location.pathname}${suffix}`);
      }
    }
  }, [selectedLesson, loading, lessons.length]);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (lessons.length === 0) return;
      const params = new URLSearchParams(window.location.search);
      const lessonId = params.get('aula');
      if (lessonId) {
        const found = lessons.find(l => l.id === lessonId);
        if (found) {
          if (!currentUser) {
            setIsAuthModalOpen(true);
            setSelectedLesson(null);
          } else {
            setSelectedLesson(found);
          }
        } else {
          setSelectedLesson(null);
        }
      } else {
        setSelectedLesson(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [lessons, currentUser]);

  useEffect(() => {
    let cancelled = false;

    const waitForBrowserIdle = () => new Promise(resolve => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(resolve, { timeout: 800 });
      } else {
        window.setTimeout(resolve, 50);
      }
    });

    const initializeLessons = async () => {
      const loadedLessons = await loadLessons();
      if (cancelled) return;

      setLessons(loadedLessons);
      setLoading(false);

      // Check URL on initial load to restore the correct lesson if user is logged in
      const savedUser = localStorage.getItem('currentUser');
      const user = savedUser ? JSON.parse(savedUser) : null;
      const params = new URLSearchParams(window.location.search);
      const lessonId = params.get('aula');
      if (lessonId) {
        const found = loadedLessons.find(l => l.id === lessonId);
        if (found) {
          if (!user) {
            // User is not logged in, prompt for authentication
            setIsAuthModalOpen(true);
          } else {
            setSelectedLesson(found);
          }
        }
      }

      // Build the full-text search index gradually, without flooding the browser
      // with hundreds of requests during the first render.
      const preloadSearchIndex = async () => {
        await new Promise(resolve => window.setTimeout(resolve, 700));

        const batchSize = 6;
        for (let index = 0; index < loadedLessons.length; index += batchSize) {
          if (cancelled) return;

          const batch = loadedLessons.slice(index, index + batchSize);
          await Promise.all(batch.map(async (lesson) => {
            try {
              const content = await lesson.loadContent();
              lesson.content = content;
            } catch (e) {
              console.error("Failed to load content for search index:", lesson.title, e);
            }
          }));

          await waitForBrowserIdle();
        }

        if (!cancelled) {
          // One update after indexing avoids rebuilding the navigation per batch.
          setLessons([...loadedLessons]);
        }
      };

      void preloadSearchIndex();
    };

    initializeLessons().catch(error => {
      console.error('Failed to initialize lessons:', error);
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const formatNavbarTitle = (title) => {
    if (!title) return '';
    if (title.startsWith('000_')) return 'Aula de abertura';
    const parts = title.split('_');
    if (parts.length >= 4) {
      const moduleStr = parts[1] + '.' + parts[2];
      const text = parts.slice(3).join(' ').replace(/_?OFICIAL(?:\.md)?$/i, '').replace(/\.md$/, '').trim();
      const prettyText = text.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
      return `${moduleStr} - ${prettyText}`;
    }
    return title.replace(/_/g, ' ').replace(/\.md$/, '');
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isMobileSidebarOpen ? 'mobile-sidebar-open' : ''}`}>
      {loading ? (
        <div className="app-loader">
          <div className="loader"></div>
          <h2>Inicializando Plataforma...</h2>
        </div>
      ) : (
        <>
          {/* Mobile Overlay Backdrop */}
          {isMobileSidebarOpen && (
            <div className="sidebar-backdrop" onClick={() => setIsMobileSidebarOpen(false)}></div>
          )}

          <Sidebar 
            lessons={lessons} 
            selectedLesson={selectedLesson} 
            onSelectLesson={(lesson) => {
              if (lesson && !currentUser) {
                setPendingLesson(lesson);
                setIsAuthModalOpen(true);
                return;
              }
              setSelectedLesson(lesson);
              setIsMobileSidebarOpen(false); // Close sidebar on mobile after selecting
            }}
            completedLessons={completedLessons}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={(collapsed) => {
              setIsSidebarCollapsed(collapsed);
              localStorage.setItem('isSidebarCollapsed', JSON.stringify(collapsed));
            }}
            isMobileOpen={isMobileSidebarOpen}
            setIsMobileOpen={setIsMobileSidebarOpen}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenAuthModal={() => {
              setPendingLesson(null);
              setIsAuthModalOpen(true);
            }}
          />
          <main className="main-content">
            {/* Mobile Header Navbar */}
            <header className="mobile-navbar">
              <button className="menu-toggle-btn" onClick={() => setIsMobileSidebarOpen(true)} title="Abrir menu">
                <Menu size={24} />
              </button>
              <h2 className="mobile-navbar-title">
                {selectedLesson ? formatNavbarTitle(selectedLesson.title) : 'Formação Java'}
              </h2>
            </header>

            {/* Expand Sidebar Floating Button for Desktop */}
            {isSidebarCollapsed && (
              <button 
                className="expand-sidebar-btn" 
                onClick={() => {
                  setIsSidebarCollapsed(false);
                  localStorage.setItem('isSidebarCollapsed', 'false');
                }} 
                title="Expandir menu lateral"
              >
                <ChevronRight size={18} />
              </button>
            )}

            <div className={`content-scroll-area ${selectedLesson ? 'lesson-reading-scroll' : 'home-scroll'}`}>
              {selectedLesson ? (
                <MarkdownViewer 
                  lesson={selectedLesson} 
                  isCompleted={!!completedLessons[selectedLesson.id]}
                  onToggleCompleted={() => toggleLessonCompleted(selectedLesson.id)}
                  onNextLesson={goToNextLesson}
                  onPrevLesson={goToPrevLesson}
                  hasNextLesson={hasNextLesson}
                  hasPrevLesson={hasPrevLesson}
                  isNavigationOverlayOpen={isMobileSidebarOpen}
                  onOpenNavigation={() => setIsMobileSidebarOpen(true)}
                />
              ) : (
                <WelcomeView 
                  lessons={lessons}
                  completedLessons={completedLessons}
                  onSelectLesson={setSelectedLesson}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onOpenAuthModal={(lesson = null) => {
                    setPendingLesson(lesson);
                    setIsAuthModalOpen(true);
                  }}
                />
              )}
            </div>
          </main>

          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => {
              setIsAuthModalOpen(false);
              setPendingLesson(null);
            }}
            onLoginSuccess={handleLoginSuccess}
          />
        </>
      )}
    </div>
  );
}

export default App;
