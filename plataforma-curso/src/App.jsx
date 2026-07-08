import React, { useState, useEffect } from 'react';
import { loadLessons } from './utils/lessonLoader';
import Sidebar from './components/Sidebar';
import MarkdownViewer from './components/MarkdownViewer';
import WelcomeView from './components/WelcomeView';
import AuthModal from './components/AuthModal';
import { Menu, ChevronRight } from 'lucide-react';

function App() {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  // State for sidebar width & collapse
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? parseInt(saved, 10) : 320;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('isSidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // State for completed lessons using user-specific localStorage key
  const [completedLessons, setCompletedLessons] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    const user = savedUser ? JSON.parse(savedUser) : null;
    const progressKey = user 
      ? `completedLessons_${user.email.toLowerCase()}` 
      : 'completedLessons_visitor';
    const saved = localStorage.getItem(progressKey);
    return saved ? JSON.parse(saved) : {};
  });

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
    const progressKey = currentUser 
      ? `completedLessons_${currentUser.email.toLowerCase()}` 
      : 'completedLessons_visitor';
    localStorage.setItem(progressKey, JSON.stringify(completedLessons));

    if (currentUser) {
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
    }
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
    const progressKey = `completedLessons_${user.email.toLowerCase()}`;
    const saved = localStorage.getItem(progressKey);
    setCompletedLessons(saved ? JSON.parse(saved) : {});
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    
    // Load visitor progress
    const saved = localStorage.getItem('completedLessons_visitor');
    setCompletedLessons(saved ? JSON.parse(saved) : {});
    
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

  useEffect(() => {
    loadLessons().then(loadedLessons => {
      setLessons(loadedLessons);
      // Keep selectedLesson as null to show the WelcomeScreen initially
      setLoading(false);

      // Preload all lesson contents in the background for search index
      Promise.all(
        loadedLessons.map(async (lesson) => {
          try {
            const content = await lesson.loadContent();
            lesson.content = content;
          } catch (e) {
            console.error("Failed to load content for search index:", lesson.title, e);
          }
        })
      ).then(() => {
        // Trigger a state update once all contents are cached
        setLessons([...loadedLessons]);
      });
    });
  }, []);

  const formatNavbarTitle = (title) => {
    if (!title) return '';
    const parts = title.split('_');
    if (parts.length >= 4) {
      const moduleStr = parts[1] + '.' + parts[2];
      const text = parts.slice(3).join(' ').replace(/\.md$/, '');
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
                setIsAuthModalOpen(true);
                return;
              }
              setSelectedLesson(lesson);
              setIsMobileSidebarOpen(false); // Close sidebar on mobile after selecting
            }}
            completedLessons={completedLessons}
            sidebarWidth={sidebarWidth}
            setSidebarWidth={setSidebarWidth}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={(collapsed) => {
              setIsSidebarCollapsed(collapsed);
              localStorage.setItem('isSidebarCollapsed', JSON.stringify(collapsed));
            }}
            isMobileOpen={isMobileSidebarOpen}
            setIsMobileOpen={setIsMobileSidebarOpen}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
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

            <div className="content-scroll-area">
              {selectedLesson ? (
                <MarkdownViewer 
                  lesson={selectedLesson} 
                  isCompleted={!!completedLessons[selectedLesson.id]}
                  onToggleCompleted={() => toggleLessonCompleted(selectedLesson.id)}
                  onNextLesson={goToNextLesson}
                  onPrevLesson={goToPrevLesson}
                  hasNextLesson={hasNextLesson}
                  hasPrevLesson={hasPrevLesson}
                />
              ) : (
                <WelcomeView 
                  lessons={lessons}
                  completedLessons={completedLessons}
                  onSelectLesson={setSelectedLesson}
                  currentUser={currentUser}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                />
              )}
            </div>
          </main>

          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
            onLoginSuccess={handleLoginSuccess}
          />
        </>
      )}
    </div>
  );
}

export default App;
