import React, { useEffect, useMemo, useState } from 'react';
import javaLogo from '../assets/java_logo.png';
import CertificateModal from './CertificateModal';
import AdminReport from './AdminReport';
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

const WelcomeView = ({ lessons, completedLessons, onSelectLesson, currentUser, onOpenAuthModal }) => {
  const availableCount = lessons.length;
  const completedCount = Object.keys(completedLessons).filter(id => completedLessons[id]).length;
  const fullCourseProgress = COURSE_TOTAL_LESSONS > 0
    ? Math.min(100, Math.round((completedCount / COURSE_TOTAL_LESSONS) * 100))
    : 0;
  const availableProgress = availableCount > 0
    ? Math.min(100, Math.round((completedCount / availableCount) * 100))
    : 0;
  const generatedProgress = COURSE_TOTAL_LESSONS > 0
    ? Math.min(100, Math.round((availableCount / COURSE_TOTAL_LESSONS) * 100))
    : 0;

  const [activePhaseId, setActivePhaseId] = useState(COURSE_PHASES[0].id);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isCertPreviewMode, setIsCertPreviewMode] = useState(false);
  const [currentTab, setCurrentTab] = useState('course');

  const isAuthorizedAdmin = currentUser && currentUser.email && currentUser.email.toLowerCase() === 'thipacheco1@gmail.com';
  const showCertificateBanner = completedCount >= COURSE_TOTAL_LESSONS && isAuthorizedAdmin;

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

  const handleOpenCertificate = (preview = false) => {
    if (!isAuthorizedAdmin) return;
    setIsCertPreviewMode(preview);
    setIsCertModalOpen(true);
  };

  const handleStart = () => {
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    if (lessons.length === 0) return;
    const nextLesson = lessons.find(lesson => !completedLessons[lesson.id]) || lessons[0];
    onSelectLesson(nextLesson);
  };

  return (
    <div className="welcome-view-container">
      {isAuthorizedAdmin && (
        <div className="admin-tab-header">
          <button
            className={`admin-tab-btn ${currentTab === 'course' ? 'active' : ''}`}
            onClick={() => setCurrentTab('course')}
          >
            <BookOpen size={16} />
            <span>Painel do Aluno</span>
          </button>
          <button
            className={`admin-tab-btn ${currentTab === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentTab('admin')}
          >
            <Shield size={16} />
            <span>Relatorio de Alunos</span>
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
                <span>FORMACAO JAVA BACKEND COMPLETA</span>
              </div>

              <h1 className="welcome-title">Do zero ao engenheiro backend Java</h1>
              <p className="welcome-subtitle">
                Uma formacao completa e progressiva para dominar Java, backend profissional,
                bancos de dados, Spring, seguranca, DevOps, producao, arquitetura e DDD.
              </p>

              <div className="hero-actions-row">
                <button className="welcome-start-btn" onClick={handleStart}>
                  <Play size={18} fill="currentColor" />
                  <span>{completedCount > 0 ? 'Continuar estudos' : 'Iniciar formacao'}</span>
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
              <div className="hero-logo-compact">
                <img src={javaLogo} alt="Java Logo" className="welcome-logo-img" />
              </div>

              <div className="course-kpi-grid">
                <div className="course-kpi-card primary">
                  <span className="course-kpi-value">{COURSE_TOTAL_LESSONS}</span>
                  <span className="course-kpi-label">aulas no roteiro</span>
                </div>
                <div className="course-kpi-card">
                  <span className="course-kpi-value">{COURSE_MODULE_COUNT}</span>
                  <span className="course-kpi-label">modulos no roteiro</span>
                </div>
                <div className="course-kpi-card">
                  <span className="course-kpi-value">{availableCount}</span>
                  <span className="course-kpi-label">aulas liberadas</span>
                </div>
                <div className="course-kpi-card">
                  <span className="course-kpi-value">{generatedProgress}%</span>
                  <span className="course-kpi-label">conteudo publicado</span>
                </div>
              </div>
            </div>
          </section>

          <section className={`welcome-dashboard ${showCertificateBanner ? 'completed-dashboard' : ''}`}>
            <div className="dashboard-content">
              <div className="dashboard-left">
                <div className="dashboard-badge">
                  <Trophy size={13} className="dashboard-badge-icon" />
                  <span>{showCertificateBanner ? 'FORMACAO CONCLUIDA' : 'PROGRESSO DO ALUNO'}</span>
                </div>

                <h2 className="dashboard-title">
                  {showCertificateBanner ? (
                    <>Voce concluiu <strong>100%</strong> da formacao.</>
                  ) : (
                    <>Voce concluiu <strong>{fullCourseProgress}%</strong> do roteiro completo.</>
                  )}
                </h2>

                <p className="dashboard-subtext">
                  {completedCount} aulas concluidas de {COURSE_TOTAL_LESSONS} planejadas.
                  {' '}Das aulas ja liberadas, seu progresso e {availableProgress}%.
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
                        <span className="metric-num">{COURSE_TOTAL_LESSONS - completedCount}</span>
                        <span className="metric-lbl">faltam</span>
                      </div>
                    </div>
                    <button className="dashboard-resume-btn" onClick={handleStart}>
                      <span>Ir para a proxima aula</span>
                      <ArrowRight size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="dashboard-progress-stack">
              <div className="dashboard-progress-line">
                <span>Roteiro completo</span>
                <strong>{fullCourseProgress}%</strong>
              </div>
              <div className="dashboard-progress-track">
                <div className="dashboard-progress-fill" style={{ width: `${fullCourseProgress}%` }} />
              </div>
            </div>
          </section>

          <section className="welcome-modules-section">
            <div className="curriculum-header">
              <div>
                <h2 className="section-heading">Grade curricular oficial</h2>
                <p className="section-subheading">
                  Uma visao objetiva da jornada completa: fundamentos, backend profissional,
                  producao, arquitetura e projeto final.
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
                  <article key={module.id} className={`curriculum-row ${badgeClass} ${stats.completed > 0 ? 'has-progress' : ''}`}>
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
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}

      {isAuthorizedAdmin && (
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
