import React, { useState } from 'react';
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle2, ChevronDown, X } from 'lucide-react';
import javaLogo from '../assets/java_logo.png';

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
  setIsMobileOpen
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isResizing, setIsResizing] = useState(false);

  // Calculate Progress Stats
  const totalCount = lessons.length;
  const completedCount = Object.keys(completedLessons).filter(id => completedLessons[id]).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter lessons based on search
  const filteredLessons = lessons.filter(lesson => 
    lesson.title.replace(/_/g, ' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group filtered lessons by module
  const groupedLessons = filteredLessons.reduce((acc, lesson) => {
    const parts = lesson.title.split('_');
    const module = parts.length >= 4 ? parts[1] : 'Outros'; // e.g. M0
    
    if (!acc[module]) acc[module] = [];
    acc[module].push(lesson);
    return acc;
  }, {});

  const toggleGroup = (module) => {
    setCollapsedGroups(prev => ({ ...prev, [module]: !prev[module] }));
  };

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

  const formatTitle = (title) => {
    const parts = title.split('_');
    if (parts.length >= 4) {
      const moduleStr = parts[1] + '.' + parts[2]; // M0.01
      const text = parts.slice(3).join(' '); 
      const prettyText = text.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
      return (
        <span className="lesson-item-text">
          <span className="lesson-item-badge">{moduleStr}</span>
          <span className="lesson-item-title">{prettyText}</span>
        </span>
      );
    }
    return title.replace(/_/g, ' ');
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
          {/* Desktop Collapse Button */}
          <button 
            className="collapse-sidebar-btn desktop-only" 
            onClick={() => setIsCollapsed(true)}
            title="Recolher menu lateral"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Mobile Close Button */}
          <button 
            className="close-sidebar-btn mobile-only" 
            onClick={() => setIsMobileOpen(false)}
            title="Fechar menu lateral"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Progress Bar Widget */}
      <div className="sidebar-progress">
        <div className="progress-header">
          <span>Progresso Geral</span>
          <span>{completedCount}/{totalCount} ({progressPercent}%)</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Search Input Widget */}
      <div className="sidebar-search">
        <input 
          type="text" 
          placeholder="Pesquisar aula..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="sidebar-content">
        {Object.keys(groupedLessons).sort().map(module => (
          <div key={module} className="module-group">
            <button 
              className="module-group-header" 
              onClick={() => toggleGroup(module)}
            >
              <h3 className="section-title">Módulo {module.replace('M', '')}</h3>
              <ChevronDown 
                size={14} 
                className={`module-chevron ${collapsedGroups[module] ? 'collapsed' : ''}`} 
              />
            </button>
            
            <div className={`module-lessons ${collapsedGroups[module] ? 'hidden' : ''}`}>
              <ul className="lesson-list">
                {groupedLessons[module].map((lesson) => {
                  const isCompleted = !!completedLessons[lesson.id];
                  const isActive = selectedLesson?.id === lesson.id;
                  return (
                    <li key={lesson.id} className="lesson-item-container">
                      <button
                        className={`lesson-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                        onClick={() => onSelectLesson(lesson)}
                      >
                        {formatTitle(lesson.title)}
                        
                        <div className="lesson-item-actions">
                          {isCompleted && <CheckCircle2 className="check-icon" size={14} />}
                          <ChevronRight className="chevron-icon" size={14} />
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
        {filteredLessons.length === 0 && (
          <div className="empty-state" style={{ padding: '20px 0' }}>
            <p style={{ fontSize: '0.85rem' }}>Nenhuma aula encontrada.</p>
          </div>
        )}
      </div>

      {/* Resizer bar */}
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
