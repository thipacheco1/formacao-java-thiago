import React, { useEffect, useMemo, useState } from 'react';
import CertificateModal from './CertificateModal';
import AdminReport from './AdminReport';
import AdminAnalytics from './AdminAnalytics';
import CourseShare from './CourseShare';
import './welcomeElegance.css';
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
  const journeyPhases = COURSE_PHASES.map((phase, index) => {
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
      moduleCount: phaseModules.length,
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
                <span>FORMAÇÃO GRATUITA • JAVA BACKEND</span>
              </div>

              <h1 className="welcome-title">
                Java Backend, do primeiro código à <span>arquitetura de sistemas.</span>
              </h1>
              <p className="welcome-subtitle">
                Uma jornada guiada e progressiva para dominar Java, Spring, dados, segurança,
                produção e decisões de arquitetura — com base sólida e prática aplicada.
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
                  <strong>Cinco fases, uma evolução contínua</strong>
                </div>
                <span className="publication-pill">{availableCount} aulas disponíveis</span>
              </div>

              <div className="phase-journey" aria-label="Mapa das cinco fases da formação">
                {journeyPhases.map((phase) => (
                  <button
                    key={phase.id}
                    type="button"
                    className={`phase-journey-step ${activePhaseId === phase.id ? 'is-active' : ''} ${phase.isDone ? 'is-complete' : ''}`}
                    onClick={() => {
                      setActivePhaseId(phase.id);
                      document.querySelector('.welcome-modules-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    aria-current={activePhaseId === phase.id ? 'step' : undefined}
                    title={`Abrir ${phase.name}`}
                  >
                    <span className="phase-journey-marker" aria-hidden="true">
                      {phase.isDone ? <CheckCircle2 size={16} /> : phase.number}
                    </span>
                    <span className="phase-journey-copy">
                      <strong>{phase.shortName}</strong>
                      <small>{phase.moduleCount} módulos · {phase.availableLessons} aulas</small>
                    </span>
                    <ArrowRight className="phase-journey-arrow" size={15} aria-hidden="true" />
                  </button>
                ))}
              </div>

              <div className="phase-journey-summary" aria-label="Dimensão da formação">
                <span><strong>{COURSE_MODULE_COUNT}</strong> módulos conectados</span>
                <i aria-hidden="true" />
                <span><strong>{COURSE_TOTAL_LESSONS}</strong> aulas no roteiro</span>
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
