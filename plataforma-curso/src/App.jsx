import React, { useState, useEffect } from 'react';
import { loadLessons } from './utils/lessonLoader';
import Sidebar from './components/Sidebar';
import MarkdownViewer from './components/MarkdownViewer';
import WelcomeView from './components/WelcomeView';
import AuthModal from './components/AuthModal';
import { Menu, ChevronRight } from 'lucide-react';

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

const readStoredProgress = (user) => {
  const progressKey = getProgressStorageKey(user);
  if (!progressKey) return {};

  try {
    const saved = localStorage.getItem(progressKey);
    const parsed = saved ? JSON.parse(saved) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
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

  // State for completed lessons using user-specific localStorage key
  const [completedLessons, setCompletedLessons] = useState(() => readStoredProgress(readStoredUser()));

  // Remove data created by the discontinued visitor mode.
  useEffect(() => {
    localStorage.removeItem(LEGACY_VISITOR_PROGRESS_KEY);
  }, []);

  // Force migration of old localStorage users to central DB
  useEffect(() => {
    const migrationKey = 'db_migration_v1_done';
    if (!localStorage.getItem(migrationKey)) {
      // Clear old local users list and force logout
      localStorage.removeItem('users');
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      setCompletedLessons({});
      localStorage.setItem(migrationKey, 'true');
    }
  }, []);

  // Load progress from API when currentUser is set
  useEffect(() => {
    if (!currentUser) return;
    
    const loadProgress = async () => {
      try {
        const res = await fetch(`/api/progress?email=${currentUser.email}`);
        if (res.ok) {
          const dbProgress = await res.json();
          setCompletedLessons(dbProgress || {});
        }
      } catch (e) {
        console.error("Failed to load progress from Vercel KV:", e);
      }
    };
    
    loadProgress();
  }, [currentUser]);

  // Save to localStorage and database whenever it changes, linked to the active user profile
  useEffect(() => {
    if (!currentUser) return;

    const progressKey = getProgressStorageKey(currentUser);
    if (!progressKey) return;
    localStorage.setItem(progressKey, JSON.stringify(completedLessons));

    const syncProgress = async () => {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUser.email,
            completedLessons
          })
        });
      } catch (e) {
        console.error("Failed to sync progress with Vercel KV:", e);
      }
    };
    syncProgress();
  }, [completedLessons, currentUser]);

  const toggleLessonCompleted = (lessonId) => {
    setCompletedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Quick local preview
    setCompletedLessons(readStoredProgress(user));

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
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCompletedLessons({});
    
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
