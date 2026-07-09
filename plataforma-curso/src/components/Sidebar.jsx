import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, ChevronDown, X, Search, Lock } from 'lucide-react';
import javaLogo from '../assets/java_logo.png';
import {
  COURSE_MODULES,
  COURSE_MODULE_COUNT,
  COURSE_PHASES,
  COURSE_TOTAL_LESSONS,
  getModuleFromLessonTitle
} from '../data/coursePlan';

const moduleTitles = COURSE_MODULES.reduce((acc, module) => {
  acc[module.id] = module.id === 'P0' ? module.title : `${module.label}: ${module.shortTitle}`;
  return acc;
}, { Outros: 'Outros' });

const phases = COURSE_PHASES.map((phase, index) => ({
  id: phase.id,
  name: phase.name,
  modules: index === 0 ? [...phase.modules, 'Outros'] : phase.modules
}));

const parseModuleHeader = (module, rawTitle) => {
  if (module === 'P0') {
    return { badge: 'Start', title: rawTitle || 'Aula de Abertura' };
  }
  if (module === 'Outros') {
    return { badge: 'Extra', title: 'Outros' };
  }
  
  const titleText = rawTitle || `Módulo ${module.replace('M', '')}`;
  if (titleText.includes(': ')) {
    const parts = titleText.split(': ');
    return { badge: parts[0], title: parts.slice(1).join(': ') };
  }
  
  return { badge: module, title: titleText };
};

const getSearchSnippet = (content, term) => {
  if (!content || !term) return null;
  const cleanTerm = term.trim().toLowerCase();
  if (!cleanTerm) return null;
  const index = content.toLowerCase().indexOf(cleanTerm);
  if (index === -1) return null;
  
  const start = Math.max(0, index - 25);
  const end = Math.min(content.length, index + cleanTerm.length + 35);
  let snippet = content.substring(start, end).replace(/\s+/g, ' ');
  
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';
  
  return snippet;
};

const estimateReadingTime = (content) => {
  if (!content) return 5;
  const cleanContent = content.replace(/[#*`\-_[\]()|]/g, ' ');
  const words = cleanContent.trim().split(/\s+/).filter(w => w.length > 0).length;
  const wpm = 110; 
  const minutes = Math.ceil(words / wpm);
  return Math.max(2, minutes);
};

const formatDurationForModule = (totalMinutes) => {
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours} h ${minutes} min` : `${hours} h`;
};

const formatDurationForCourse = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

const Sidebar = ({ 
  lessons, 
  selectedLesson, 
  onSelectLesson, 
  completedLessons,
  sidebarWidth,
  setSidebarWidth,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  currentUser,
  onLogout,
  onOpenAuthModal
}) => {
  const [openPhase, setOpenPhase] = useState(COURSE_PHASES[0].id);
  const [openGroup, setOpenGroup] = useState(null);
  const lessonRefs = useRef({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isResizing, setIsResizing] = useState(false);

  const isAuthorizedAdmin = currentUser && currentUser.email && currentUser.email.toLowerCase() === 'thipacheco1@gmail.com';

  const getGlobalLessonIndex = (lessonId) => {
    return lessons.findIndex(l => l.id === lessonId);
  };

  const isLessonUnlocked = (lessonId) => {
    if (!currentUser) return true; // Let App.jsx handle the prompt
    if (isAuthorizedAdmin) return true;
    const globalIdx = getGlobalLessonIndex(lessonId);
    if (globalIdx <= 0) return true;
    const prevLesson = lessons[globalIdx - 1];
    return !!completedLessons[prevLesson.id];
  };

  // Calculate Progress Stats
  const availableLessonsCount = lessons.length;
  const totalCount = COURSE_TOTAL_LESSONS;
  const completedCount = Object.keys(completedLessons).filter(id => completedLessons[id]).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Calculate course duration and section count
  const totalCourseMinutes = lessons.reduce((acc, lesson) => {
    return acc + estimateReadingTime(lesson.content);
  }, 0);
  
  const availableSectionsCount = Object.keys(lessons.reduce((acc, lesson) => {
    const module = getModuleFromLessonTitle(lesson.title);
    acc[module] = true;
    return acc;
  }, {})).length;

  // Filter lessons based on search (in title or content)
  const filteredLessons = lessons.filter(lesson => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const matchesTitle = lesson.title.replace(/_/g, ' ').toLowerCase().includes(term);
    const matchesContent = lesson.content && lesson.content.toLowerCase().includes(term);
    return matchesTitle || matchesContent;
  });

  // Group filtered lessons by module
  const groupedLessons = filteredLessons.reduce((acc, lesson) => {
    const module = getModuleFromLessonTitle(lesson.title);
    
    if (!acc[module]) acc[module] = [];
    acc[module].push(lesson);
    return acc;
  }, {});

  // Auto-open phase and module when a lesson is selected
  useEffect(() => {
    if (selectedLesson) {
      const module = getModuleFromLessonTitle(selectedLesson.title);
      setOpenGroup(module);
      
      const parentPhase = phases.find(p => p.modules.includes(module));
      if (parentPhase) {
        setOpenPhase(parentPhase.id);
      }
    }
  }, [selectedLesson]);

  const toggleGroup = (module) => {
    setOpenGroup(prev => prev === module ? null : module);
  };

  // Auto-scroll when a group is opened
  useEffect(() => {
    if (openGroup && groupedLessons[openGroup]) {
      const groupLessons = groupedLessons[openGroup];
      
      let targetLesson = groupLessons.find(l => selectedLesson?.id === l.id);
      
      if (!targetLesson) {
        targetLesson = groupLessons.find(l => !completedLessons[l.id]);
      }
      
      if (!targetLesson && groupLessons.length > 0) {
        targetLesson = groupLessons[0];
      }

      if (targetLesson && lessonRefs.current[targetLesson.id]) {
        setTimeout(() => {
          lessonRefs.current[targetLesson.id]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }, 150);
      }
    }
  }, [openGroup, groupedLessons, selectedLesson, completedLessons]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseMove = (e) => {
    const newWidth = e.clientX;
    if (newWidth > 240 && newWidth < 480) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = (e) => {
    setIsResizing(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    const finalWidth = e.clientX;
    if (finalWidth > 240 && finalWidth < 480) {
      localStorage.setItem('sidebarWidth', finalWidth);
    }
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const formatTitle = (lesson) => {
    const title = lesson.title;
    const term = searchTerm.trim();
    const snippet = term ? getSearchSnippet(lesson.content, term) : null;
    const isTitleMatch = term ? title.replace(/_/g, ' ').toLowerCase().includes(term.toLowerCase()) : true;
    const isContentMatch = snippet && !isTitleMatch;
    
    const parts = title.split('_');
    if (parts.length >= 4) {
      const moduleStr = parts[1] + '.' + parts[2];
      const text = parts.slice(3).join(' '); 
      const prettyText = text.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
      return (
        <span className="lesson-item-text">
          <span className="lesson-item-badge">{moduleStr}</span>
          <span className="lesson-item-title">{prettyText}</span>
          {isContentMatch && (
            <span className="lesson-search-snippet">{snippet}</span>
          )}
        </span>
      );
    }
    
    const prettyText = title.replace(/_/g, ' ');
    return (
      <span className="lesson-item-text">
        <span className="lesson-item-title">{prettyText}</span>
        {isContentMatch && (
          <span className="lesson-search-snippet">{snippet}</span>
        )}
      </span>
    );
  };

  return (
    <aside 
      className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''} ${isResizing ? 'is-resizing' : ''}`}
      style={{ width: isCollapsed ? 0 : sidebarWidth }}
    >
      <div className="sidebar-header">
        <div 
          className="logo-container" 
          onClick={() => {
            onSelectLesson(null);
            setIsMobileOpen(false);
          }}
          style={{ cursor: 'pointer' }}
          title="Ir para a página inicial"
        >
          <img src={javaLogo} alt="Java Logo" className="logo-image-sidebar" />
          <div>
            <h1 className="logo-text">Java</h1>
            <p className="subtitle">Formação Completa</p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="collapse-sidebar-btn desktop-only" 
            onClick={() => setIsCollapsed(true)}
            title="Recolher menu lateral"
          >
            <ChevronLeft size={16} />
          </button>

          <button 
            className="close-sidebar-btn mobile-only" 
            onClick={() => setIsMobileOpen(false)}
            title="Fechar menu lateral"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="sidebar-progress">
        <div className="progress-header">
          <span>Progresso Geral</span>
          <span>{completedCount}/{totalCount} ({progressPercent}%)</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="progress-stats-footer">
          <span>{availableSectionsCount}/{COURSE_MODULE_COUNT} modulos com aulas - {availableLessonsCount} liberadas - Duracao liberada: {formatDurationForCourse(totalCourseMinutes)}</span>
        </div>
      </div>

      <div className="sidebar-search">
        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input 
            type="text" 
            placeholder="Pesquisar aula..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="sidebar-content">
        {phases.map(phase => {
          const phaseModules = phase.modules.filter(mod => groupedLessons[mod] && groupedLessons[mod].length > 0);
          
          if (phaseModules.length === 0) return null;
          
          const isPhaseOpen = openPhase === phase.id || searchTerm.trim() !== '';
          
          let totalPhaseCount = 0;
          let completedPhaseCount = 0;
          phaseModules.forEach(mod => {
            totalPhaseCount += groupedLessons[mod].length;
            completedPhaseCount += groupedLessons[mod].filter(l => completedLessons[l.id]).length;
          });
          const isPhaseCompleted = totalPhaseCount > 0 && completedPhaseCount === totalPhaseCount;

          return (
            <div key={phase.id} className={`phase-accordion-group ${isPhaseOpen ? 'is-open' : ''} ${isPhaseCompleted ? 'is-completed' : ''}`}>
              <button 
                className={`phase-accordion-header ${isPhaseOpen ? 'active' : ''} ${isPhaseCompleted ? 'completed' : ''}`}
                onClick={() => setOpenPhase(prev => prev === phase.id ? null : phase.id)}
              >
                <span className="phase-title">{phase.name}</span>
                <div className="phase-header-actions">
                  <span className="phase-progress-text">{completedPhaseCount}/{totalPhaseCount}</span>
                  <ChevronDown size={14} className={`phase-chevron ${!isPhaseOpen ? 'collapsed' : ''}`} />
                </div>
              </button>
              
              <div className={`phase-modules-container ${!isPhaseOpen ? 'hidden' : ''}`}>
                {phaseModules.map(module => {
                  const { badge, title } = parseModuleHeader(module, moduleTitles[module]);
                  const moduleLessons = groupedLessons[module];
                  const completedModuleCount = moduleLessons.filter(l => completedLessons[l.id]).length;
                  const totalModuleCount = moduleLessons.length;
                  const isModuleCompleted = completedModuleCount === totalModuleCount;
                  
                  const isModuleOpen = openGroup === module || searchTerm.trim() !== '';

                  const totalModuleMinutes = moduleLessons.reduce((acc, lesson) => {
                    return acc + estimateReadingTime(lesson.content);
                  }, 0);

                  return (
                    <div 
                      key={module} 
                      className={`module-group ${isModuleOpen ? 'is-open' : ''} ${isModuleCompleted ? 'is-completed' : ''}`}
                    >
                      <button 
                        className={`module-group-header ${isModuleOpen ? 'active' : ''} ${isModuleCompleted ? 'completed' : ''}`} 
                        onClick={() => toggleGroup(module)}
                        title={title}
                        aria-expanded={isModuleOpen}
                      >
                        <div className="module-info-container">
                          <span className={`module-badge ${module === 'P0' ? 'start-badge' : ''} ${module === 'Outros' ? 'extra-badge' : ''}`}>
                            {badge}
                          </span>
                          <h3 className="section-title">
                            {title}
                          </h3>
                        </div>
                        
                        <div className="module-header-actions">
                          <span className="module-stats-right">
                            {totalModuleCount} {totalModuleCount === 1 ? 'aula' : 'aulas'} • {formatDurationForModule(totalModuleMinutes)}
                          </span>
                          {isModuleCompleted ? (
                            <CheckCircle2 className="module-check-icon" size={14} />
                          ) : completedModuleCount > 0 ? (
                            <span className="module-progress-text">{completedModuleCount}/{totalModuleCount}</span>
                          ) : null}
                          <ChevronDown 
                            size={14} 
                            className={`module-chevron ${!isModuleOpen ? 'collapsed' : ''}`} 
                          />
                        </div>
                      </button>
                      
                      <div className={`module-lessons ${!isModuleOpen ? 'hidden' : ''}`}>
                        <ul className="lesson-list">
                          {moduleLessons.map((lesson) => {
                            const isCompleted = !!completedLessons[lesson.id];
                            const isActive = selectedLesson?.id === lesson.id;
                            const isUnlocked = isLessonUnlocked(lesson.id);
                            
                            return (
                              <li key={lesson.id} className="lesson-item-container" ref={el => lessonRefs.current[lesson.id] = el}>
                                <button
                                  className={`lesson-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
                                  title={lesson.title.replace(/_/g, ' ').replace(/\.md$/, '')}
                                  onClick={() => {
                                    if (!isUnlocked) {
                                      alert("Atenção: Você precisa concluir as aulas anteriores para acessar esta aula!");
                                      return;
                                    }
                                    onSelectLesson(lesson);
                                  }}
                                >
                                  {formatTitle(lesson)}
                                  
                                  <div className="lesson-item-actions">
                                    <span className="lesson-duration-badge">{estimateReadingTime(lesson.content)} min</span>
                                    {isCompleted && <CheckCircle2 className="check-icon" size={14} />}
                                    {!isUnlocked ? (
                                      <Lock className="lock-icon-sidebar" size={12} />
                                    ) : (
                                      <ChevronRight className="chevron-icon" size={14} />
                                    )}
                                  </div>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {filteredLessons.length === 0 && (
          <div className="empty-state" style={{ padding: '20px 0' }}>
            <p style={{ fontSize: '0.85rem' }}>Nenhuma aula encontrada.</p>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="sidebar-footer">
          {currentUser ? (
            <div className="user-profile-card">
              <div className="user-avatar" title={currentUser.name}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{currentUser.name}</span>
                <span className="user-email">{currentUser.email}</span>
              </div>
              <button onClick={onLogout} className="logout-btn" title="Sair da conta">
                Sair
              </button>
            </div>
          ) : (
            <div className="auth-prompt-card">
              <p className="auth-prompt-text">Salve seu progresso de estudos.</p>
              <button onClick={onOpenAuthModal} className="login-trigger-btn">
                Entrar / Cadastrar
              </button>
            </div>
          )}
        </div>
      )}

      {!isCollapsed && (
        <div 
          className="sidebar-resizer" 
          onMouseDown={handleMouseDown}
        />
      )}
    </aside>
  );
};

export default Sidebar;
