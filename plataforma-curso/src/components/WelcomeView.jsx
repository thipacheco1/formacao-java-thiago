import React, { useEffect, useMemo, useState } from 'react';
import CertificateModal from './CertificateModal';
import AdminReport from './AdminReport';
import AdminAnalytics from './AdminAnalytics';
import BrandMark from './BrandMark';
import CourseShare from './CourseShare';
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Box,
  CheckCircle2,
  CheckSquare,
  Clock,
  Cpu,
  Database,
  Globe,
  Layers,
  Play,
  Settings,
  Shield,
  Sparkles,
  Terminal,
  Trophy,
  UserCheck,
  Zap
} from 'lucide-react';
import {
  COURSE_MODULES,
  COURSE_MODULE_COUNT,
  COURSE_PHASES,
  COURSE_TOTAL_LESSONS,
  getModuleFromLessonTitle,
  getPhaseForModule
} from '../data/coursePlan';

const moduleIcons = {
  P0: Zap,
  M0: Settings,
  M1: BookOpen,
  M2: Cpu,
  M3: Terminal,
  M4: Layers,
  M5: Layers,
  M6: CheckSquare,
  M7: Activity,
  M8: Shield,
  M9: Award,
  M10: Cpu,
  M11: Settings,
  M12: Database,
  M13: Database,
  M14: Globe,
  M15: Shield,
  M16: Globe,
  M17: Box,
  M18: Activity,
  M19: Cpu,
  M20: UserCheck
};

const getPhaseRangeLabel = (modules) => {
  if (!modules.length) return '';

  const firstStart = modules[0].range.split('-')[0];
  const lastRangeParts = modules[modules.length - 1].range.split('-');
  const lastEnd = lastRangeParts[lastRangeParts.length - 1];

  return `${firstStart}-${lastEnd}`;
};

const formatLessonDisplayTitle = (lesson) => {
  if (!lesson?.title) return 'Aula de abertura';

  const title = lesson.title.replace(/\.md$/i, '');
  const parts = title.split('_');
  const readableTitle = title.startsWith('000_')
    ? parts.slice(1).join(' ')
    : (parts.length >= 4 ? parts.slice(3).join(' ') : title.replace(/_/g, ' '));

  return readableTitle
    .replace(/\s+OFICIAL$/i, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/(?:^|\s)\p{L}/gu, letter => letter.toLocaleUpperCase('pt-BR'));
};

const WelcomeView = ({ lessons, completedLessons, onSelectLesson, currentUser, onOpenAuthModal, onLogout }) => {
  const availableCount = lessons.length;
  const completedCount = Object.keys(completedLessons).filter(id => completedLessons[id]).length;
  const availableProgress = availableCount > 0
    ? Math.min(100, Math.round((completedCount / availableCount) * 100))
    : 0;
  const nextLesson = lessons.find(lesson => !completedLessons[lesson.id]) || lessons[0];
  const nextLessonTitle = formatLessonDisplayTitle(nextLesson);

  const [activePhaseId, setActivePhaseId] = useState(COURSE_PHASES[0].id);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isCertPreviewMode, setIsCertPreviewMode] = useState(false);
  const [currentTab, setCurrentTab] = useState('course');

  const isAuthorizedAdmin = currentUser && currentUser.email && currentUser.email.toLowerCase() === 'thipacheco1@gmail.com';
  const hasEarnedCertificate = Boolean(
    isAuthorizedAdmin
    && completedCount >= COURSE_TOTAL_LESSONS
  );
  const showCertificateBanner = hasEarnedCertificate;

  useEffect(() => {
    if (!isAuthorizedAdmin) {
      setCurrentTab('course');
    }
  }, [isAuthorizedAdmin]);

  useEffect(() => {
    if (lessons.length === 0) return;

    const nextLesson = lessons.find(lesson => !completedLessons[lesson.id]) || lessons[0];
    const moduleId = getModuleFromLessonTitle(nextLesson.title);
    const phase = getPhaseForModule(moduleId);

    if (phase) {
      setActivePhaseId(phase.id);
    }
  }, [lessons, completedLessons]);

  const moduleStats = useMemo(() => (
    lessons.reduce((acc, lesson) => {
      const moduleId = getModuleFromLessonTitle(lesson.title);

      if (!acc[moduleId]) {
        acc[moduleId] = { available: 0, completed: 0 };
      }

      acc[moduleId].available += 1;
      if (completedLessons[lesson.id]) {
        acc[moduleId].completed += 1;
      }

      return acc;
    }, {})
  ), [lessons, completedLessons]);

  const activePhase = COURSE_PHASES.find(phase => phase.id === activePhaseId) || COURSE_PHASES[0];
  const activeModules = COURSE_MODULES.filter(module => activePhase.modules.includes(module.id));
  const activePhasePlannedLessons = activeModules.reduce((sum, module) => sum + module.lessons, 0);
  const activePhaseAvailableLessons = activeModules.reduce((sum, module) => sum + (moduleStats[module.id]?.available || 0), 0);
  const activePhaseRange = getPhaseRangeLabel(activeModules);
  const constellationPhases = COURSE_PHASES.map((phase, index) => {
    const phaseModules = COURSE_MODULES.filter(module => phase.modules.includes(module.id));
    const plannedLessons = phaseModules
      .reduce((sum, module) => sum + module.lessons, 0);
    const availableLessons = phaseModules
      .reduce((sum, module) => sum + (moduleStats[module.id]?.available || 0), 0);
    const completedLessonsCount = phaseModules
      .reduce((sum, module) => sum + (moduleStats[module.id]?.completed || 0), 0);

    return {
      ...phase,
      number: String(index + 1).padStart(2, '0'),
      plannedLessons,
      availableLessons,
      completedLessonsCount,
      isDone: plannedLessons > 0 && completedLessonsCount >= plannedLessons
    };
  });

  const handleOpenCertificate = (preview = false) => {
    if ((preview && !isAuthorizedAdmin) || (!preview && !hasEarnedCertificate)) return;
    setIsCertPreviewMode(preview);
    setIsCertModalOpen(true);
  };

  const handleStart = () => {
    if (!currentUser) {
      onOpenAuthModal(nextLesson);
      return;
    }

    if (lessons.length === 0) return;
    const lessonToOpen = lessons.find(lesson => !completedLessons[lesson.id]) || lessons[0];
    onSelectLesson(lessonToOpen);
  };

  return (
    <div className="welcome-view-container">
      {isAuthorizedAdmin && (
        <div className="admin-tab-header">
          <button
            className={`admin-tab-btn ${currentTab === 'course' ? 'active' : ''}`}
            onClick={() => setCurrentTab('course')}
            aria-pressed={currentTab === 'course'}
          >
            <BookOpen size={16} />
            <span>Painel do Aluno</span>
          </button>
          <button
            className={`admin-tab-btn ${currentTab === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentTab('admin')}
            aria-pressed={currentTab === 'admin'}
          >
            <Shield size={16} />
            <span>Alunos</span>
          </button>
          <button
            className={`admin-tab-btn ${currentTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentTab('analytics')}
            aria-pressed={currentTab === 'analytics'}
          >
            <Activity size={16} />
            <span>Acessos</span>
          </button>
        </div>
      )}

      {currentTab === 'admin' && isAuthorizedAdmin ? (
        <AdminReport lessons={lessons} />
      ) : currentTab === 'analytics' && isAuthorizedAdmin ? (
        <AdminAnalytics
          onRelogin={() => {
            if (onLogout) onLogout();
            window.setTimeout(() => onOpenAuthModal && onOpenAuthModal(), 80);
          }}
        />
      ) : (
        <>
          <section className="welcome-hero">
            <div className="hero-text-col">
              <div className="hero-tag-badge">
                <Sparkles size={12} className="tag-icon" />
                <span>CURSO GRATUITO • FORMAÇÃO PROFISSIONAL EM JAVA BACKEND</span>
              </div>

              <h1 className="welcome-title">
                Curso de Java Backend: do primeiro código à <span>arquitetura de sistemas.</span>
              </h1>
              <p className="welcome-subtitle">
                Uma formação 100% gratuita, guiada e progressiva para você dominar Java, backend profissional,
                Spring, dados, segurança, produção e decisões de arquitetura.
              </p>

              <div className="hero-proof-row" aria-label="Diferenciais da formação">
                <span><CheckCircle2 size={15} /> Base sem atalhos</span>
                <span><CheckCircle2 size={15} /> Prática aplicada</span>
                <span><CheckCircle2 size={15} /> Visão de carreira</span>
              </div>

              <div className="hero-actions-row">
                <button className="welcome-start-btn" onClick={handleStart}>
                  <Play size={18} fill="currentColor" />
                  <span>{completedCount > 0 ? 'Continuar estudando' : 'Começar a formação'}</span>
                  <ArrowRight size={17} />
                </button>

                {isAuthorizedAdmin && (
                  <button className="welcome-secondary-btn" onClick={() => handleOpenCertificate(true)}>
                    <Award size={18} />
                    <span>Modelo de certificado</span>
                  </button>
                )}
              </div>
            </div>

            <div className="hero-course-panel">
              <div className="hero-panel-topbar">
                <div>
                  <span className="hero-panel-kicker">Seu mapa de evolução</span>
                  <strong>Uma trilha, cinco grandes fases</strong>
                </div>
                <span className="publication-pill">{availableCount} aulas disponíveis</span>
              </div>

              <div className="hero-constellation" aria-label="Mapa das cinco fases da formação">
                <svg className="constellation-art" viewBox="0 0 520 280" aria-hidden="true">
                  <defs>
                    <radialGradient id="constellation-core-glow">
                      <stop stopColor="#6366f1" stopOpacity="0.25" />
                      <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
                    </radialGradient>
                    <pattern id="tech-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="1"/>
                      <circle cx="24" cy="0" r="1.2" fill="rgba(99, 102, 241, 0.15)"/>
                    </pattern>
                  </defs>
                  
                  {/* Technology blueprint grid background */}
                  <rect width="520" height="280" fill="url(#tech-grid)" />
                  
                  {/* Glowing background */}
                  <circle cx="260" cy="140" r="130" fill="url(#constellation-core-glow)" />

                  {/* Elegant Java Logo Watermark in the Center Background */}
                  <g transform="translate(196, 76) scale(0.98)" opacity="0.06" style={{ pointerEvents: 'none' }}>
                    <path fill="#0074BD" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"/>
                    <path fill="#0074BD" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"/>
                    <path fill="#0074BD" d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z"/>
                    <path fill="#EA2D2E" d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"/>
                    <path fill="#EA2D2E" d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"/>
                  </g>

                  {/* Horizontal CI/CD Pipeline flow connection line */}
                  <line x1="30" y1="102.5" x2="490" y2="102.5" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="3" strokeLinecap="round" />
                  <line className="tech-pipeline-flow" x1="30" y1="102.5" x2="490" y2="102.5" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" strokeDasharray="16 20" />
                </svg>

                {constellationPhases.map((phase, index) => (
                  <button
                    key={phase.id}
                    type="button"
                    className={`constellation-phase constellation-phase-${index + 1} ${activePhaseId === phase.id ? 'is-active' : ''} ${phase.isDone ? 'is-complete' : ''}`}
                    onClick={() => {
                      setActivePhaseId(phase.id);
                      document.querySelector('.welcome-modules-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    aria-current={activePhaseId === phase.id ? 'step' : undefined}
                    title={`Abrir ${phase.name}`}
                  >
                    <span className="constellation-planet">
                      <span>{phase.number}</span>
                    </span>
                    <span className="constellation-phase-copy">
                      <strong>{phase.shortName}</strong>
                      <small>{phase.availableLessons}/{phase.plannedLessons} liberadas</small>
                    </span>
                  </button>
                ))}

                <div className="constellation-caption">
                  <span>DO FUNDAMENTO</span>
                  <i aria-hidden="true" />
                  <span>À ARQUITETURA</span>
                </div>
              </div>

              <div className="course-kpi-grid">
                <div className="course-kpi-card primary">
                  <span className="course-kpi-value">5</span>
                  <span className="course-kpi-label">grandes fases</span>
                </div>
                <div className="course-kpi-card">
                  <span className="course-kpi-value">{COURSE_MODULE_COUNT}</span>
                  <span className="course-kpi-label">módulos</span>
                </div>
                <div className="course-kpi-card">
                  <span className="course-kpi-value">{COURSE_TOTAL_LESSONS}</span>
                  <span className="course-kpi-label">aulas no roteiro</span>
                </div>
              </div>
            </div>
          </section>

          <CourseShare />

          <section className={`welcome-dashboard ${showCertificateBanner ? 'completed-dashboard' : ''}`}>
            <div className="dashboard-content">
              <div className="dashboard-left">
                <div className="dashboard-badge">
                  <Trophy size={13} className="dashboard-badge-icon" />
                  <span>{showCertificateBanner ? 'FORMAÇÃO CONCLUÍDA' : 'SEU PRÓXIMO PASSO'}</span>
                </div>

                <h2 className="dashboard-title">
                  {showCertificateBanner ? (
                    <>Você concluiu <strong>100%</strong> da formação.</>
                  ) : (
                    <>{completedCount > 0 ? 'Continue de onde parou.' : 'Tudo pronto para começar.'}</>
                  )}
                </h2>

                <p className="dashboard-subtext">
                  Próxima aula: <strong className="next-lesson-name">{nextLessonTitle}</strong>
                </p>
              </div>

              <div className="dashboard-right">
                {showCertificateBanner ? (
                  <button className="dashboard-resume-btn certificate-ready" onClick={() => handleOpenCertificate(false)}>
                    <Award size={16} />
                    <span>Emitir certificado</span>
                  </button>
                ) : (
                  <>
                    <div className="dashboard-metrics">
                      <div className="metric-box">
                        <span className="metric-num">{completedCount}</span>
                        <span className="metric-lbl">feitas</span>
                      </div>
                      <div className="metric-box">
                        <span className="metric-num">{availableCount}</span>
                        <span className="metric-lbl">liberadas</span>
                      </div>
                    </div>
                    <button className="dashboard-resume-btn" onClick={handleStart}>
                      <span>{completedCount > 0 ? 'Retomar aula' : 'Abrir primeira aula'}</span>
                      <ArrowRight size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="dashboard-progress-stack">
              <div className="dashboard-progress-line">
                <span>{completedCount} de {availableCount} aulas liberadas concluídas</span>
                <strong>{availableProgress}% concluído</strong>
              </div>
              <div className="dashboard-progress-track">
                <div className="dashboard-progress-fill" style={{ width: `${availableProgress}%` }} />
              </div>
            </div>
          </section>

          <section className="welcome-modules-section">
            <div className="curriculum-header">
              <div>
                <h2 className="section-heading">Grade curricular oficial</h2>
                <p className="section-subheading">
                  Explore a jornada por fases. Cada etapa foi pensada para transformar conhecimento
                  em repertório técnico e segurança profissional.
                </p>
                <a className="public-curriculum-link" href="/trilhas">
                  Conheça a grade pública do curso
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
              <div className="curriculum-summary-pill">
                <Clock size={15} />
                <span>{activePhaseAvailableLessons}/{activePhasePlannedLessons} aulas desta fase liberadas</span>
              </div>
            </div>

            <div className="phase-tabs-container">
              {COURSE_PHASES.map(phase => {
                const phaseModules = COURSE_MODULES.filter(module => phase.modules.includes(module.id));
                const planned = phaseModules.reduce((sum, module) => sum + module.lessons, 0);
                const available = phaseModules.reduce((sum, module) => sum + (moduleStats[module.id]?.available || 0), 0);
                const completed = phaseModules.reduce((sum, module) => sum + (moduleStats[module.id]?.completed || 0), 0);
                const isDone = planned > 0 && completed >= planned;

                return (
                  <button
                    key={phase.id}
                    className={`phase-tab-btn ${activePhaseId === phase.id ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                    onClick={() => setActivePhaseId(phase.id)}
                  >
                    <span className="tab-btn-title">
                      <span>{phase.shortName}</span>
                      {isDone && <CheckCircle2 size={12} className="tab-done-icon" />}
                    </span>
                    <span className="tab-btn-lbl">{available}/{planned} liberadas</span>
                  </button>
                );
              })}
            </div>

            <div className="phase-info-banner">
              <div>
                <h3 className="phase-info-title">{activePhase.name}</h3>
                <p className="phase-info-desc">{activePhase.subtitle}</p>
              </div>
              <span className="phase-range-badge">{activePhaseRange}</span>
            </div>

            <div className="curriculum-roadmap">
              {activeModules.map(module => {
                const IconComponent = moduleIcons[module.id] || BookOpen;
                const stats = moduleStats[module.id] || { available: 0, completed: 0 };
                const moduleLessons = lessons.filter(lesson => getModuleFromLessonTitle(lesson.title) === module.id);
                const moduleNextLesson = moduleLessons.find(lesson => !completedLessons[lesson.id]) || moduleLessons[0];
                const availablePercent = module.lessons > 0 ? Math.min(100, Math.round((stats.available / module.lessons) * 100)) : 0;
                const studentPercent = stats.available > 0 ? Math.min(100, Math.round((stats.completed / stats.available) * 100)) : 0;

                let badgeText = 'No roteiro';
                let badgeClass = 'coming-soon';

                if (stats.available >= module.lessons) {
                  badgeText = 'Liberado';
                  badgeClass = 'new';
                } else if (stats.available > 0) {
                  badgeText = `${stats.available}/${module.lessons}`;
                  badgeClass = 'in-progress';
                }

                if (stats.available > 0 && stats.completed === stats.available) {
                  badgeText = 'Concluido';
                  badgeClass = 'completed';
                }

                return (
                  <button
                    type="button"
                    key={module.id}
                    className={`curriculum-row ${badgeClass} ${stats.completed > 0 ? 'has-progress' : ''}`}
                    disabled={!moduleNextLesson}
                    onClick={() => {
                      if (!moduleNextLesson) return;
                      if (!currentUser) {
                        onOpenAuthModal(moduleNextLesson);
                        return;
                      }
                      onSelectLesson(moduleNextLesson);
                    }}
                    title={moduleNextLesson ? `Abrir ${module.shortTitle}` : `${module.shortTitle} ainda não disponível`}
                  >
                    <div className="curriculum-row-icon">
                      <IconComponent size={17} />
                    </div>

                    <div className="curriculum-row-main">
                      <div className="curriculum-row-titleline">
                        <span className="module-code-label">{module.label}</span>
                        <h3>{module.shortTitle}</h3>
                        <span className={`module-badge ${badgeClass}`}>{badgeText}</span>
                      </div>

                      <p>{module.focus}</p>

                      <div className="curriculum-row-meta">
                        <span>{module.range}</span>
                        <span>{module.lessons} aulas</span>
                        <span>{stats.available} liberadas</span>
                      </div>
                    </div>

                    <div className="curriculum-row-progress">
                      <div className="card-progress-row">
                        <span>Publicado</span>
                        <strong>{availablePercent}%</strong>
                      </div>
                      <div className="card-progress-bar">
                        <div className="card-progress-fill" style={{ width: `${availablePercent}%` }} />
                      </div>

                      {stats.available > 0 && (
                        <>
                          <div className="card-progress-row student-row">
                            <span>Aluno</span>
                            <strong>{studentPercent}%</strong>
                        </div>
                          <div className="card-progress-bar student-bar">
                            <div className="card-progress-fill student" style={{ width: `${studentPercent}%` }} />
                          </div>
                        </>
                      )}
                      {moduleNextLesson && (
                        <span className="curriculum-row-open">
                          {stats.completed > 0 ? 'Continuar módulo' : 'Explorar módulo'}
                          <ArrowRight size={14} />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </>
      )}

      {(isAuthorizedAdmin || hasEarnedCertificate) && (
        <CertificateModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          currentUser={currentUser}
          isPreviewMode={isCertPreviewMode}
        />
      )}
    </div>
  );
};

export default WelcomeView;
