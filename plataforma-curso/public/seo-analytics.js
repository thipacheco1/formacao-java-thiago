(() => {
  'use strict';

  const VISITOR_KEY = 'course_analytics_visitor_v1';
  const SESSION_KEY = 'course_analytics_session_v1';
  const ATTRIBUTION_KEY = 'course_analytics_attribution_v1';
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
  const HEARTBEAT_INTERVAL_MS = 50 * 1000;
  const script = document.currentScript;
  const pageId = script?.dataset?.page;

  if (!pageId || navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;

  const createId = (prefix) => {
    const randomPart = globalThis.crypto?.randomUUID?.()
      || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
    return `${prefix}_${randomPart}`;
  };

  const readJson = (storage, key) => {
    try {
      const value = storage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  const writeJson = (storage, key, value) => {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {
      // Metrics must never affect access to the public course pages.
    }
  };

  const getVisitorId = () => {
    try {
      const stored = localStorage.getItem(VISITOR_KEY);
      if (stored) return stored;
      const visitorId = createId('v');
      localStorage.setItem(VISITOR_KEY, visitorId);
      return visitorId;
    } catch {
      return createId('v');
    }
  };

  const visitorId = getVisitorId();

  const getSessionId = () => {
    const now = Date.now();
    const stored = readJson(sessionStorage, SESSION_KEY);
    const active = stored?.id && now - Number(stored.lastSeen || 0) < SESSION_TIMEOUT_MS;
    const session = active ? stored : { id: createId('s'), lastSeen: now };
    session.lastSeen = now;
    writeJson(sessionStorage, SESSION_KEY, session);
    return session.id;
  };

  const normalizeSlug = (value, fallback = '') => String(value || fallback)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  const sourceBucket = (utmSource, referrerHost) => {
    const source = normalizeSlug(utmSource);
    const host = String(referrerHost || '').toLowerCase();

    if (source) {
      if (source.includes('google')) return 'google';
      if (source.includes('bing')) return 'bing';
      if (source.includes('github')) return 'github';
      if (source.includes('linkedin')) return 'linkedin';
      if (source.includes('whatsapp')) return 'whatsapp';
      if (source.includes('instagram')) return 'instagram';
      if (source.includes('facebook')) return 'facebook';
      return 'other';
    }

    if (!host) return 'direct';
    if (host.includes('google.')) return 'google';
    if (host.includes('bing.com')) return 'bing';
    if (host.includes('github.com')) return 'github';
    if (host.includes('linkedin.com') || host.includes('lnkd.in')) return 'linkedin';
    if (host.includes('whatsapp.com') || host.includes('wa.me')) return 'whatsapp';
    if (host.includes('instagram.com')) return 'instagram';
    if (host.includes('facebook.com') || host.includes('fb.com')) return 'facebook';
    return 'other';
  };

  const getAttribution = () => {
    const stored = readJson(localStorage, ATTRIBUTION_KEY);
    if (stored?.source) return stored;

    const params = new URLSearchParams(window.location.search);
    let referrerHost = '';
    try {
      referrerHost = document.referrer ? new URL(document.referrer).hostname : '';
    } catch {
      referrerHost = '';
    }

    const attribution = {
      source: sourceBucket(params.get('utm_source'), referrerHost),
      campaign: normalizeSlug(params.get('utm_campaign'), 'none') || 'none'
    };
    writeJson(localStorage, ATTRIBUTION_KEY, attribution);
    return attribution;
  };

  const attribution = getAttribution();

  const send = (type) => {
    const payload = {
      type,
      eventId: createId(type === 'pageview' ? 'e' : 'h'),
      visitorId,
      sessionId: getSessionId(),
      pageId,
      source: attribution.source,
      campaign: attribution.campaign
    };

    try {
      fetch('/api/analytics', {
        method: 'POST',
        credentials: 'same-origin',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch {
      // The static content remains fully usable if analytics is unavailable.
    }
  };

  send('pageview');

  const heartbeat = window.setInterval(() => {
    if (document.visibilityState === 'visible') send('heartbeat');
  }, HEARTBEAT_INTERVAL_MS);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') send('heartbeat');
  });
  window.addEventListener('pagehide', () => window.clearInterval(heartbeat), { once: true });
})();
