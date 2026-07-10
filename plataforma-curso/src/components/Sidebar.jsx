import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, ChevronDown, X, Search, Lock } from 'lucide-react';
import BrandMark from './BrandMark';
import {
  COURSE_MODULES,
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
  shortName: phase.shortName,
  number: String(index + 1).padStart(2, '0'),
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
  const wpm = 180;
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

const getSidebarWidthLimit = () => {
  const viewportWidth = typeof window === 'undefined' ? 1200 : window.innerWidth;
  return Math.min(480, Math.max(240, viewportWidth - 420));
};

const clampSidebarWidth = (width) => Math.min(getSidebarWidthLimit(), Math.max(240, width));

const Sidebar = ({ 
  lessons, 
  selectedLesson, 
  onSelectLesson, 
  completedLessons,
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
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const savedWidth = Number.parseInt(localStorage.getItem('sidebarWidth'), 10);
    return clampSidebarWidth(Number.isFinite(savedWidth) ? savedWidth : 320);
  });
  const sidebarRef = useRef(null);
  const resizeFrameRef = useRef(0);
  const pendingWidthRef = useRef(sidebarWidth);

  const isAuthorizedAdmin = currentUser && currentUser.email && currentUser.email.toLowerCase() === 'thipacheco1@gmail.com';

  const lessonMeta = useMemo(() => {
    const indexById = new Map();
    const minutesById = new Map();
    const minutesByModule = new Map();
    let totalMinutes = 0;

    lessons.forEach((lesson, index) => {
      const minutes = estimateReadingTime(lesson.content);
      const module = getModuleFromLessonTitle(lesson.title);

      indexById.set(lesson.id, index);
      minutesById.set(lesson.id, minutes);
      minutesByModule.set(module, (minutesByModule.get(module) || 0) + minutes);
      totalMinutes += minutes;
    });

    return { indexById, minutesById, minutesByModule, totalMinutes };
  }, [lessons]);

  const isLessonUnlocked = (lessonId) => {
    if (!currentUser) return true; // Let App.jsx handle the prompt
    if (isAuthorizedAdmin) return true;
    const globalIdx = lessonMeta.indexById.get(lessonId) ?? -1;
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
  const totalCourseMinutes = lessonMeta.totalMinutes;
  
  // Filter lessons based on search (in title or content)
  const filteredLessons = useMemo(() => lessons.filter(lesson => {
    const term = deferredSearchTerm.trim().toLowerCase();
    if (!term) return true;
    const matchesTitle = lesson.title.replace(/_/g, ' ').toLowerCase().includes(term);
    const matchesContent = lesson.content && lesson.content.toLowerCase().includes(term);
    return matchesTitle || matchesContent;
  }), [deferredSearchTerm, lessons]);

  // Group filtered lessons by module
  const groupedLessons = useMemo(() => filteredLessons.reduce((acc, lesson) => {
    const module = getModuleFromLessonTitle(lesson.title);

    if (!acc[module]) acc[module] = [];
    acc[module].push(lesson);
    return acc;
  }, {}), [filteredLessons]);

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

      if (targetLesson) {
        const timer = window.setTimeout(() => {
          lessonRefs.current[targetLesson.id]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }, 150);

        return () => window.clearTimeout(timer);
      }
    }
    return undefined;
  }, [openGroup, groupedLessons, selectedLesson?.id, completedLessons]);

  const paintSidebarWidth = () => {
    sidebarRef.current?.style.setProperty('--sidebar-width', `${pendingWidthRef.current}px`);
    resizeFrameRef.current = 0;
  };

  const handlePointerDown = (event) => {
    event.preventDefault();
    pendingWidthRef.current = sidebarRef.current?.getBoundingClientRect().width || sidebarWidth;
    setIsResizing(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  };

  const handlePointerMove = (event) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

    pendingWidthRef.current = clampSidebarWidth(event.clientX);
    if (!resizeFrameRef.current) {
      resizeFrameRef.current = window.requestAnimationFrame(paintSidebarWidth);
    }
  };

  const finishResize = (event) => {
    if (resizeFrameRef.current) {
      window.cancelAnimationFrame(resizeFrameRef.current);
    }
    paintSidebarWidth();
    setIsResizing(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    setSidebarWidth(pendingWidthRef.current);
    localStorage.setItem('sidebarWidth', String(pendingWidthRef.current));

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  useEffect(() => () => {
    if (resizeFrameRef.current) {
      window.cancelAnimationFrame(resizeFrameRef.current);
    }
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  const formatTitle = (lesson) => {
    const title = lesson.title;
    const term = deferredSearchTerm.trim();
    const snippet = term ? getSearchSnippet(lesson.content, term) : null;
    const isTitleMatch = term ? title.replace(/_/g, ' ').toLowerCase().includes(term.toLowerCase()) : true;
    const isContentMatch = snippet && !isTitleMatch;
    
    const parts = title.split('_');
    if (parts.length >= 4) {
      const titleParts = parts.slice(3);
      if (titleParts.at(-1)?.replace(/\.md$/i, '').toUpperCase() === 'OFICIAL') {
        titleParts.pop();
      }
      const text = titleParts.join(' ');
      const prettyText = text.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
      return (
        <span className="lesson-item-text">
          <span className="lesson-item-badge">{parts[0]}</span>
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
      ref={sidebarRef}
      className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''} ${isResizing ? 'is-resizing' : ''}`}
      style={{ '--sidebar-width': `${sidebarWidth}px` }}
    >
      <div className="sidebar-header">
        <button
          type="button"
          className="logo-container" 
          onClick={() => {
            onSelectLesson(null);
            setIsMobileOpen(false);
          }}
          title="Ir para a página inicial"
          aria-label="Ir para a página inicial"
        >
          <span className="sidebar-brand-mark">
            <BrandMark size={42} decorative />
          </span>
          <div className="sidebar-brand-copy">
            <span className="logo-text">Java Backend</span>
            <span className="subtitle">Formação profissional</span>
          </div>
        </button>

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
          <div className="progress-title-group">
            <span className="progress-eyebrow">Sua jornada</span>
            <strong>Progresso geral</strong>
          </div>
          <strong className="progress-percentage">{progressPercent}%</strong>
        </div>
        <div
          className="progress-bar-container"
          role="progressbar"
          aria-label="Progresso geral da formação"
          aria-valuemin="0"
          aria-valuemax={totalCount}
          aria-valuenow={completedCount}
        >
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="progress-stats-footer">
          <span><strong>{completedCount}</strong> concluídas</span>
          <span><strong>{availableLessonsCount}</strong> disponíveis</span>
          <span><strong>{formatDurationForCourse(totalCourseMinutes)}</strong> leitura</span>
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
            aria-label="Pesquisar nas aulas"
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Limpar pesquisa"
              title="Limpar pesquisa"
            >
              <X size={13} />
            </button>
          )}
        </div>
        {searchTerm.trim() && (
          <span className="search-result-count">
            {filteredLessons.length} {filteredLessons.length === 1 ? 'aula encontrada' : 'aulas encontradas'}
          </span>
        )}
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
                aria-expanded={isPhaseOpen}
                title={phase.name}
              >
                <span className="phase-heading-copy">
                  <span className="phase-number">{phase.number}</span>
                  <span className="phase-title">{phase.shortName}</span>
                </span>
                <div className="phase-header-actions">
                  <span className="phase-progress-text">{completedPhaseCount}/{totalPhaseCount}</span>
                  <ChevronDown size={14} className={`phase-chevron ${!isPhaseOpen ? 'collapsed' : ''}`} />
                </div>
              </button>
              
              {isPhaseOpen && <div className="phase-modules-container">
                {phaseModules.map(module => {
                  const { badge, title } = parseModuleHeader(module, moduleTitles[module]);
                  const moduleLessons = groupedLessons[module];
                  const completedModuleCount = moduleLessons.filter(l => completedLessons[l.id]).length;
                  const totalModuleCount = moduleLessons.length;
                  const isModuleCompleted = completedModuleCount === totalModuleCount;
                  
                  const isModuleOpen = openGroup === module || searchTerm.trim() !== '';

                  const totalModuleMinutes = lessonMeta.minutesByModule.get(module) || 0;

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
                            {totalModuleCount} {totalModuleCount === 1 ? 'aula' : 'aulas'}
                          </span>
                          <span className="module-duration">{formatDurationForModule(totalModuleMinutes)}</span>
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
                      
                      {isModuleOpen && <div className="module-lessons">
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
                                  aria-current={isActive ? 'page' : undefined}
                                  onClick={() => {
                                    if (!isUnlocked) {
                                      alert("Atenção: você precisa concluir as aulas anteriores para acessar esta aula!");
                                      return;
                                    }
                                    onSelectLesson(lesson);
                                  }}
                                >
                                  {formatTitle(lesson)}
                                  
                                  <div className="lesson-item-actions">
                                    <span className="lesson-duration-badge">{lessonMeta.minutesById.get(lesson.id) || 2} min</span>
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
                      </div>}
                    </div>
                  );
                })}
              </div>}
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
          role="separator"
          aria-label="Redimensionar menu lateral"
          aria-orientation="vertical"
          aria-valuemin={240}
          aria-valuemax={getSidebarWidthLimit()}
          aria-valuenow={sidebarWidth}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishResize}
          onPointerCancel={finishResize}
        />
      )}
    </aside>
  );
};

export default Sidebar;
