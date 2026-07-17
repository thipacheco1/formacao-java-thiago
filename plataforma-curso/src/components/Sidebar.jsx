import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Layers3,
  ListFilter,
  Lock,
  Play,
  Search,
  Sparkles,
  Trophy,
  X
} from 'lucide-react';
import BrandMark from './BrandMark';
import './sidebarNavigator.css';
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

const clampSidebarWidth = (width) => Math.min(getSidebarWidthLimit(), Math.max(280, width));

const getPrettyLessonTitle = (title = '') => {
  const parts = title.replace(/\.md$/i, '').split('_');
  const contentParts = title.startsWith('000_') ? parts.slice(1) : parts.length >= 4 ? parts.slice(3) : parts;
  if (contentParts.at(-1)?.toUpperCase() === 'OFICIAL') contentParts.pop();
  return contentParts.join(' ').toLowerCase().replace(/(?:^|\s)\S/g, letter => letter.toUpperCase());
};

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
  const [lessonFilter, setLessonFilter] = useState('all');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const savedWidth = Number.parseInt(localStorage.getItem('sidebarWidth'), 10);
    return clampSidebarWidth(Number.isFinite(savedWidth) ? savedWidth : 360);
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
  const remainingCount = Math.max(0, availableLessonsCount - completedCount);

  // Calculate course duration and section count
  const totalCourseMinutes = lessonMeta.totalMinutes;
  
  // Filter lessons based on search (in title or content)
  const filteredLessons = useMemo(() => lessons.filter(lesson => {
    if (lessonFilter === 'pending' && completedLessons[lesson.id]) return false;
    if (lessonFilter === 'completed' && !completedLessons[lesson.id]) return false;

    const term = deferredSearchTerm.trim().toLowerCase();
    if (!term) return true;
    const matchesTitle = lesson.title.replace(/_/g, ' ').toLowerCase().includes(term);
    const matchesContent = lesson.content && lesson.content.toLowerCase().includes(term);
    return matchesTitle || matchesContent;
  }), [completedLessons, deferredSearchTerm, lessonFilter, lessons]);

  const continueLesson = useMemo(() => {
    if (selectedLesson && !completedLessons[selectedLesson.id]) return selectedLesson;
    return lessons.find(lesson => !completedLessons[lesson.id]) || null;
  }, [completedLessons, lessons, selectedLesson]);

  // Group filtered lessons by module
  const groupedLessons = useMemo(() => filteredLessons.reduce((acc, lesson) => {
    const module = getModuleFromLessonTitle(lesson.title);

    if (!acc[module]) acc[module] = [];
    acc[module].push(lesson);
    return acc;
  }, {}), [filteredLessons]);

  const allGroupedLessons = useMemo(() => lessons.reduce((acc, lesson) => {
    const module = getModuleFromLessonTitle(lesson.title);
    if (!acc[module]) acc[module] = [];
    acc[module].push(lesson);
    return acc;
  }, {}), [lessons]);

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
      const prettyText = getPrettyLessonTitle(title);
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
    
    const prettyText = getPrettyLessonTitle(title);
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
      className={`sidebar course-navigator ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''} ${isResizing ? 'is-resizing' : ''}`}
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
            <span className="sidebar-brand-kicker"><Sparkles size={11} /> Formação completa</span>
            <span className="logo-text">Java Backend</span>
            <span className="subtitle">Do zero à arquitetura</span>
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
        <div className="sidebar-progress-overview">
          <div className="sidebar-progress-ring" style={{ '--course-progress': `${progressPercent * 3.6}deg` }} aria-hidden="true">
            <span>{progressPercent}%</span>
          </div>
          <div className="progress-title-group">
            <span className="progress-eyebrow">Sua jornada</span>
            <strong>{completedCount > 0 ? 'Continue avançando' : 'Comece sua formação'}</strong>
            <span>{completedCount} de {totalCount} aulas concluídas</span>
          </div>
        </div>
        <div className="progress-stats-footer">
          <span><CheckCircle2 size={13} /><span><strong>{completedCount}</strong> concluídas</span></span>
          <span><BookOpen size={13} /><span><strong>{remainingCount}</strong> restantes</span></span>
          <span><Clock3 size={13} /><span><strong>{formatDurationForCourse(totalCourseMinutes)}</strong> estimadas</span></span>
        </div>
        <div className="sidebar-progress-sr" role="progressbar" aria-label="Progresso geral da formação" aria-valuemin="0" aria-valuemax={totalCount} aria-valuenow={completedCount} />
      </div>

      {continueLesson ? (
        <button type="button" className="sidebar-continue-card" onClick={() => onSelectLesson(continueLesson)}>
          <span className="continue-icon"><Play size={15} fill="currentColor" /></span>
          <span className="continue-copy">
            <small>{selectedLesson?.id === continueLesson.id ? 'Você está estudando' : 'Continuar jornada'}</small>
            <strong>{getPrettyLessonTitle(continueLesson.title)}</strong>
          </span>
          <ChevronRight size={16} />
        </button>
      ) : (
        <div className="sidebar-course-complete"><Trophy size={18} /><span><strong>Formação concluída</strong><small>721 aulas finalizadas</small></span></div>
      )}

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
        <div className="sidebar-filters" aria-label="Filtrar aulas">
          <ListFilter size={13} aria-hidden="true" />
          {[
            ['all', 'Todas'],
            ['pending', 'Pendentes'],
            ['completed', 'Concluídas']
          ].map(([value, label]) => (
            <button type="button" key={value} className={lessonFilter === value ? 'active' : ''} aria-pressed={lessonFilter === value} onClick={() => setLessonFilter(value)}>{label}</button>
          ))}
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
            const allModuleLessons = allGroupedLessons[mod] || [];
            totalPhaseCount += allModuleLessons.length;
            completedPhaseCount += allModuleLessons.filter(l => completedLessons[l.id]).length;
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
                  <span className="phase-number"><Layers3 size={13} /> {phase.number}</span>
                  <span className="phase-heading-text">
                    <span className="phase-kicker">Fase {Number(phase.number)}</span>
                    <span className="phase-title">{phase.shortName}</span>
                  </span>
                </span>
                <div className="phase-header-actions">
                  <span className="phase-progress-text">{Math.round((completedPhaseCount / totalPhaseCount) * 100)}%</span>
                  <ChevronDown size={14} className={`phase-chevron ${!isPhaseOpen ? 'collapsed' : ''}`} />
                </div>
                <span className="phase-progress-track" aria-hidden="true"><span style={{ width: `${(completedPhaseCount / totalPhaseCount) * 100}%` }} /></span>
              </button>
              
              {isPhaseOpen && <div className="phase-modules-container">
                {phaseModules.map(module => {
                  const { badge, title } = parseModuleHeader(module, moduleTitles[module]);
                  const moduleLessons = groupedLessons[module];
                  const allModuleLessons = allGroupedLessons[module] || moduleLessons;
                  const completedModuleCount = allModuleLessons.filter(l => completedLessons[l.id]).length;
                  const totalModuleCount = allModuleLessons.length;
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
                          <span className="module-heading-copy">
                            <h3 className="section-title">{title}</h3>
                            <small>{completedModuleCount} de {totalModuleCount} concluídas · {formatDurationForModule(totalModuleMinutes)}</small>
                          </span>
                        </div>
                        
                        <div className="module-header-actions">
                          {isModuleCompleted ? (
                            <CheckCircle2 className="module-check-icon" size={14} />
                          ) : completedModuleCount > 0 ? (
                            <span className="module-progress-text">{Math.round((completedModuleCount / totalModuleCount) * 100)}%</span>
                          ) : null}
                          <ChevronDown 
                            size={14} 
                            className={`module-chevron ${!isModuleOpen ? 'collapsed' : ''}`} 
                          />
                        </div>
                        <span className="module-progress-track" aria-hidden="true"><span style={{ width: `${(completedModuleCount / totalModuleCount) * 100}%` }} /></span>
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
                                  <span className="lesson-state-marker" aria-hidden="true">
                                    {isCompleted ? <CheckCircle2 size={16} /> : !isUnlocked ? <Lock size={14} /> : isActive ? <Play size={13} fill="currentColor" /> : <Circle size={14} />}
                                  </span>
                                  {formatTitle(lesson)}
                                  
                                  <div className="lesson-item-actions">
                                    <span className="lesson-duration-badge">{lessonMeta.minutesById.get(lesson.id) || 2} min</span>
                                    <ChevronRight className="chevron-icon" size={14} />
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
          <div className="sidebar-empty-state">
            <Search size={20} />
            <strong>Nenhuma aula encontrada</strong>
            <p>Tente outro termo ou altere o filtro.</p>
            <button type="button" onClick={() => { setSearchTerm(''); setLessonFilter('all'); }}>Limpar filtros</button>
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
          aria-valuemin={280}
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
