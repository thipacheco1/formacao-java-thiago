import React from 'react';
import javaLogo from '../assets/java_logo.png';
import { Play, BookOpen, Award, Zap } from 'lucide-react';

const WelcomeView = ({ lessons, completedLessons, onSelectLesson }) => {
  const totalCount = lessons.length;
  const completedCount = Object.keys(completedLessons).filter(id => completedLessons[id]).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleStart = () => {
    if (lessons.length === 0) return;
    const nextLesson = lessons.find(l => !completedLessons[l.id]) || lessons[0];
    onSelectLesson(nextLesson);
  };

  // Group lessons by module to count how many lessons per module are completed
  const moduleStats = lessons.reduce((acc, lesson) => {
    const parts = lesson.title.split('_');
    const module = parts.length >= 4 ? parts[1] : 'Outros';
    
    if (!acc[module]) {
      acc[module] = { total: 0, completed: 0 };
    }
    acc[module].total += 1;
    if (completedLessons[lesson.id]) {
      acc[module].completed += 1;
    }
    return acc;
  }, {});

  const modulesList = [
    {
      id: '0',
      title: 'Módulo 0: Preparação do Ambiente',
      description: 'Instalação do JDK, Git, GitHub, IntelliJ IDEA, PostgreSQL, Docker e WSL2.',
      icon: Zap
    },
    {
      id: '1',
      title: 'Módulo 1: Fundamentos da Linguagem',
      description: 'Tipos primitivos, operadores, estruturas condicionais/repetição, arrays e métodos.',
      icon: BookOpen
    },
    {
      id: '2',
      title: 'Módulo 2: Arquitetura da JVM e Avançado',
      description: 'Funcionamento de Stack vs Heap, Referências, Coletor de Lixo e String Pool.',
      icon: Award
    }
  ];

  return (
    <div className="welcome-view-container">
      <div className="welcome-hero">
        <div className="welcome-logo-wrapper">
          <img src={javaLogo} alt="Java Logo" className="welcome-logo-img" />
          <div className="logo-glow"></div>
        </div>
        <h1 className="welcome-title">Formação Java Completa</h1>
        <p className="welcome-subtitle">Aprenda programação moderna orientada a objetos com Thiago Pacheco</p>
        
        <button className="welcome-start-btn" onClick={handleStart}>
          <Play size={20} fill="currentColor" />
          <span>{completedCount > 0 ? 'Continuar Estudando' : 'Iniciar Formação'}</span>
        </button>
      </div>

      <div className="welcome-stats-row">
        <div className="welcome-stat-card">
          <span className="stat-label">Progresso do Curso</span>
          <div className="stat-progress-container">
            <span className="stat-value">{progressPercent}%</span>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
          <span className="stat-subtext">{completedCount} de {totalCount} aulas concluídas</span>
        </div>
      </div>

      <div className="welcome-modules-section">
        <h2 className="section-heading">Grade Curricular da Formação</h2>
        <div className="modules-grid">
          {modulesList.map((mod) => {
            const IconComponent = mod.icon;
            const stats = moduleStats[`M${mod.id}`] || { total: 0, completed: 0 };
            const isModuleCompleted = stats.total > 0 && stats.completed === stats.total;
            
            let badgeText = 'Novo';
            let badgeClass = 'new';
            
            if (isModuleCompleted) {
              badgeText = 'Concluído';
              badgeClass = 'completed';
            } else if (stats.completed > 0) {
              badgeText = `${stats.completed}/${stats.total} Aulas`;
              badgeClass = 'in-progress';
            }
            
            return (
              <div key={mod.id} className="module-card">
                <div className="module-card-header">
                  <div className="module-icon-wrapper">
                    <IconComponent size={24} />
                  </div>
                  <span className={`module-badge ${badgeClass}`}>{badgeText}</span>
                </div>
                <div className="module-card-body">
                  <h3 className="module-title">{mod.title}</h3>
                  <p className="module-desc">{mod.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WelcomeView;
