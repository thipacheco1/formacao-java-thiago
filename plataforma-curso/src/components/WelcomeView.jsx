import React, { useEffect, useMemo, useState } from 'react';
import CertificateModal from './CertificateModal';
import AdminReport from './AdminReport';
import BrandMark from './BrandMark';
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

const WelcomeView = ({ lessons, completedLessons, onSelectLesson, currentUser, onOpenAuthModal }) => {
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
    currentUser
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
            <span>Relatório de alunos</span>
          </button>
        </div>
      )}

      {currentTab === 'admin' && isAuthorizedAdmin ? (
        <AdminReport lessons={lessons} />
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
                    <linearGradient id="constellation-orbit-gradient" x1="62" y1="55" x2="468" y2="229" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#A9C1FF" stopOpacity="0.18" />
                      <stop offset="0.5" stopColor="#7EA2F4" stopOpacity="0.78" />
                      <stop offset="1" stopColor="#A9C1FF" stopOpacity="0.12" />
                    </linearGradient>
                    <radialGradient id="constellation-core-glow">
                      <stop stopColor="#7FA5FF" stopOpacity="0.32" />
                      <stop offset="1" stopColor="#7FA5FF" stopOpacity="0" />
                    </radialGradient>
                    <pattern id="constellation-stars" width="32" height="32" patternUnits="userSpaceOnUse">
                      <circle cx="4" cy="7" r="1" fill="#C8D7FF" fillOpacity="0.28" />
                      <circle cx="24" cy="22" r="0.7" fill="#8CA9E8" fillOpacity="0.3" />
                    </pattern>
                  </defs>
                  <rect width="520" height="280" fill="url(#constellation-stars)" />
                  <circle cx="260" cy="140" r="106" fill="url(#constellation-core-glow)" />
                  <ellipse className="constellation-orbit constellation-orbit-a" cx="260" cy="140" rx="205" ry="83" fill="none" stroke="url(#constellation-orbit-gradient)" strokeWidth="1.5" />
                  <ellipse className="constellation-orbit constellation-orbit-b" cx="260" cy="140" rx="164" ry="112" fill="none" stroke="#89A9F0" strokeOpacity="0.28" strokeWidth="1.2" strokeDasharray="5 8" />
                  <path className="constellation-path" d="M73 144C126 54 201 35 271 53C354 74 415 90 454 139C417 214 342 241 262 226C179 211 117 198 73 144Z" fill="none" stroke="#A9C1FF" strokeOpacity="0.2" strokeWidth="1" />
                  <path d="M117 188L181 74L337 67L435 151L302 234" fill="none" stroke="#7297E8" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 7" />
                </svg>

                <div className="constellation-core">
                  <span className="constellation-core-halo" aria-hidden="true" />
                  <BrandMark size={62} decorative />
                  <span className="constellation-core-label">JAVA BACKEND</span>
                  <small>{COURSE_MODULE_COUNT} módulos conectados</small>
                </div>

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
