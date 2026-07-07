import React, { useState, useEffect } from 'react';
import { loadLessons } from './utils/lessonLoader';
import Sidebar from './components/Sidebar';
import MarkdownViewer from './components/MarkdownViewer';
import WelcomeView from './components/WelcomeView';
import { Menu, ChevronRight } from 'lucide-react';

function App() {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  
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

  // State for completed lessons using localStorage
  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem('completedLessons');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const toggleLessonCompleted = (lessonId) => {
    setCompletedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
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
                />
              )}
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
