import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BarChart2,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  Phone,
  Search,
  Trash2,
  UserCheck,
  Users
} from 'lucide-react';
import {
  COURSE_TOTAL_LESSONS,
  getModuleFromLessonTitle,
  getModulePlan,
  sortModulesByPlan
} from '../data/coursePlan';

const AdminReport = ({ lessons }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedUser, setExpandedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [loadWarning, setLoadWarning] = useState('');
  const [deletingEmail, setDeletingEmail] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [pendingDeleteUser, setPendingDeleteUser] = useState(null);

  const availableLessonsCount = lessons.length;

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    setLoadWarning('');

    try {
      const res = await fetch('/api/users', {
        credentials: 'same-origin',
        cache: 'no-store'
      });
      if (!res.ok) {
        let message = res.status === 401
          ? 'Sua sessão administrativa expirou. Saia e entre novamente para atualizar o painel.'
          : `Falha ao carregar alunos (${res.status}).`;

        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // Keep the status-based message when the server did not return JSON.
        }

        throw new Error(message);
      }

      const usersList = await res.json();
      if (!Array.isArray(usersList)) {
        throw new Error('A resposta de alunos veio em um formato inesperado.');
      }

      const usersWithProgress = await Promise.all(usersList.map(async user => {
        const email = String(user.email || '');

        try {
          const progressRes = await fetch(`/api/progress?email=${encodeURIComponent(email)}`, {
            credentials: 'same-origin',
            cache: 'no-store'
          });
          if (!progressRes.ok) {
            throw new Error(`Falha ao carregar progresso (${progressRes.status}).`);
          }

          const progress = await progressRes.json();
          if (!progress || typeof progress !== 'object' || Array.isArray(progress)) {
            throw new Error('O progresso veio em um formato inesperado.');
          }

          return {
            ...user,
            completedLessons: progress,
            progressLoadFailed: false,
            progressFromLocalCache: false
          };
        } catch (progressError) {
          console.warn('Failed to load progress for an admin user', progressError);

          return {
            ...user,
            completedLessons: {},
            progressLoadFailed: true
          };
        }
      }));

      const unavailableProgressCount = usersWithProgress.filter(user => user.progressLoadFailed).length;

      setUsers(usersWithProgress);

      if (unavailableProgressCount > 0) {
        setLoadWarning(
          unavailableProgressCount === 1
            ? 'O progresso de 1 aluno não pôde ser carregado. Esse dado não entra nas métricas.'
            : `O progresso de ${unavailableProgressCount} alunos não pôde ser carregado. Esses dados não entram nas métricas.`
        );
      }
    } catch (error) {
      console.warn('Failed to load the central admin report', error);
      setUsers([]);
      setLoadError(
        error?.message || 'Não foi possível carregar os alunos. Verifique a conexão com o servidor e tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!pendingDeleteUser) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !deletingEmail) {
        setPendingDeleteUser(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [pendingDeleteUser, deletingEmail]);

  const handleDeleteUser = async (email) => {
    setDeletingEmail(email);
    setActionFeedback(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', email })
      });

      if (res.ok) {
        setUsers(prev => prev.filter(user => user.email.toLowerCase() !== email.toLowerCase()));
        if (expandedUser === email) setExpandedUser(null);
        setActionFeedback({ type: 'success', message: 'Aluno removido com sucesso.' });
        return;
      }

      const data = await res.json().catch(() => ({}));
      setActionFeedback({ type: 'error', message: data.error || 'Não foi possível remover o aluno.' });
    } catch (deleteError) {
      console.warn('Failed to remove the user from the central database', deleteError);
      setActionFeedback({ type: 'error', message: 'Não foi possível remover o aluno. Tente novamente.' });
    } finally {
      setDeletingEmail(null);
      setPendingDeleteUser(null);
    }
  };

  const groupedLessonsByModule = useMemo(() => (
    lessons.reduce((acc, lesson) => {
      const moduleId = getModuleFromLessonTitle(lesson.title);
      if (!acc[moduleId]) acc[moduleId] = [];
      acc[moduleId].push(lesson);
      return acc;
    }, {})
  ), [lessons]);

  const processedUsers = users.map(user => {
    const completedLessons = user.completedLessons || {};
    const completedCount = Object.keys(completedLessons).filter(id => completedLessons[id]).length;
    const fullProgressPercent = COURSE_TOTAL_LESSONS > 0
      ? Math.min(100, Math.round((completedCount / COURSE_TOTAL_LESSONS) * 100))
      : 0;
    const availableProgressPercent = availableLessonsCount > 0
      ? Math.min(100, Math.round((completedCount / availableLessonsCount) * 100))
      : 0;

    let studyStatus = 'not-started';
    let studyStatusText = 'Não iniciou';

    if (user.progressLoadFailed) {
      studyStatus = 'unavailable';
      studyStatusText = 'Indisponível';
    } else if (completedCount >= COURSE_TOTAL_LESSONS) {
      studyStatus = 'completed';
      studyStatusText = 'Concluído';
    } else if (completedCount > 0) {
      studyStatus = 'active';
      studyStatusText = 'Em andamento';
    }

    return {
      ...user,
      completedCount,
      fullProgressPercent,
      availableProgressPercent,
      studyStatus,
      studyStatusText,
      completedLessons
    };
  });

  const filteredUsers = processedUsers.filter(user => {
    const normalizedTerm = searchTerm.toLowerCase().trim();
    const normalizedName = String(user.name || '').toLowerCase();
    const normalizedEmail = String(user.email || '').toLowerCase();
    const normalizedPhone = String(user.phone || '').toLowerCase();
    const matchesSearch =
      !normalizedTerm ||
      normalizedName.includes(normalizedTerm) ||
      normalizedEmail.includes(normalizedTerm) ||
      normalizedPhone.includes(normalizedTerm);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.studyStatus === 'active') ||
      (statusFilter === 'completed' && user.studyStatus === 'completed') ||
      (statusFilter === 'inactive' && user.studyStatus === 'not-started');

    return matchesSearch && matchesStatus;
  });

  const totalUsers = processedUsers.length;
  const activeUsers = processedUsers.filter(user => user.studyStatus === 'active').length;
  const completedUsers = processedUsers.filter(user => user.studyStatus === 'completed').length;
  const notStartedUsers = processedUsers.filter(user => user.studyStatus === 'not-started').length;
  const usersWithAvailableProgress = processedUsers.filter(user => !user.progressLoadFailed);
  const averageProgress = usersWithAvailableProgress.length > 0
    ? Math.round(
      usersWithAvailableProgress.reduce((sum, user) => sum + user.fullProgressPercent, 0)
      / usersWithAvailableProgress.length
    )
    : 0;

  const generatedProgress = COURSE_TOTAL_LESSONS > 0
    ? Math.round((availableLessonsCount / COURSE_TOTAL_LESSONS) * 100)
    : 0;

  const toggleExpandUser = (email) => {
    setExpandedUser(prev => prev === email ? null : email);
  };

  const formatLessonTitle = (title) => {
    if (!title) return '';

    const parts = title.split('_');
    if (parts.length >= 4) {
      const moduleStr = parts[1] + '.' + parts[2];
      const text = parts.slice(3).join(' ').replace(/\.md$/, '');
      return `${moduleStr} - ${text.toLowerCase().replace(/(?:^|\s)\S/g, letter => letter.toUpperCase())}`;
    }

    return title.replace(/_/g, ' ').replace(/\.md$/, '');
  };

  const getUserModuleRows = (user) => (
    Object.keys(groupedLessonsByModule)
      .sort(sortModulesByPlan)
      .map(moduleId => {
        const moduleLessons = groupedLessonsByModule[moduleId] || [];
        const plan = getModulePlan(moduleId);
        const completedLessons = moduleLessons.filter(lesson => user.completedLessons[lesson.id]);
        const availablePercent = moduleLessons.length > 0
          ? Math.round((completedLessons.length / moduleLessons.length) * 100)
          : 0;

        return {
          moduleId,
          title: plan ? plan.shortTitle : moduleId,
          planned: plan ? plan.lessons : moduleLessons.length,
          available: moduleLessons.length,
          completed: completedLessons.length,
          availablePercent,
          lessons: moduleLessons.map(lesson => ({
            ...lesson,
            completed: !!user.completedLessons[lesson.id]
          }))
        };
      })
  );

  return (
    <div className="admin-report-container" aria-busy={isLoading}>
      <div className="admin-header-section">
        <div>
          <span className="admin-eyebrow">Painel administrativo</span>
          <h2 className="admin-title">Relatório de alunos</h2>
          <p className="admin-subtitle">
            Acompanhe alunos cadastrados, progresso geral e aulas concluídas por módulo.
          </p>
        </div>
        <div className="admin-course-health" aria-label={`${availableLessonsCount} de ${COURSE_TOTAL_LESSONS} aulas liberadas, ${generatedProgress}% do curso disponível`}>
          <BookOpen size={16} />
          <span>{availableLessonsCount}/{COURSE_TOTAL_LESSONS} aulas liberadas</span>
          <strong>{generatedProgress}%</strong>
        </div>
      </div>

      <div className="admin-metrics-grid">
        <div className="metric-card-admin">
          <div className="metric-icon-bg">
            <Users size={20} className="metric-icon" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Alunos</span>
            <span className="metric-value">{isLoading || loadError ? '—' : totalUsers}</span>
          </div>
        </div>

        <div className="metric-card-admin">
          <div className="metric-icon-bg active">
            <UserCheck size={20} className="metric-icon active" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Em andamento</span>
            <span className="metric-value">{isLoading || loadError ? '—' : activeUsers}</span>
          </div>
        </div>

        <div className="metric-card-admin">
          <div className="metric-icon-bg completed">
            <CheckCircle2 size={20} className="metric-icon completed" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Concluídos</span>
            <span className="metric-value">{isLoading || loadError ? '—' : completedUsers}</span>
          </div>
        </div>

        <div className="metric-card-admin">
          <div className="metric-icon-bg progress-icon">
            <BarChart2 size={20} className="metric-icon progress-icon" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Média geral</span>
            <span className="metric-value">{isLoading || loadError ? '—' : `${averageProgress}%`}</span>
          </div>
        </div>
      </div>

      {loadWarning && (
        <div className="admin-data-notice" role="status" aria-live="polite">
          <span>{loadWarning}</span>
          <button type="button" onClick={loadUsers} disabled={isLoading}>
            Tentar sincronizar novamente
          </button>
        </div>
      )}

      {actionFeedback && (
        <div
          className={`admin-action-feedback ${actionFeedback.type}`}
          role={actionFeedback.type === 'error' ? 'alert' : 'status'}
          aria-live={actionFeedback.type === 'error' ? 'assertive' : 'polite'}
        >
          <span>{actionFeedback.message}</span>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            aria-label="Fechar aviso"
          >
            Fechar
          </button>
        </div>
      )}

      <div className="admin-filter-bar">
        <div className="search-input-wrapper-admin">
          <Search size={16} className="search-icon-admin" />
          <input
            type="search"
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="search-input-admin"
            aria-label="Buscar alunos por nome, e-mail ou telefone"
            disabled={isLoading || !!loadError || users.length === 0}
          />
        </div>

        <div className="status-tabs-admin" role="group" aria-label="Filtrar alunos por situação">
          <button
            type="button"
            className={`status-tab-btn-admin ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
            aria-pressed={statusFilter === 'all'}
            disabled={isLoading || !!loadError || users.length === 0}
          >
            Todos ({processedUsers.length})
          </button>
          <button
            type="button"
            className={`status-tab-btn-admin ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
            aria-pressed={statusFilter === 'active'}
            disabled={isLoading || !!loadError || users.length === 0}
          >
            Ativos ({activeUsers})
          </button>
          <button
            type="button"
            className={`status-tab-btn-admin ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
            aria-pressed={statusFilter === 'completed'}
            disabled={isLoading || !!loadError || users.length === 0}
          >
            Concluídos ({completedUsers})
          </button>
          <button
            type="button"
            className={`status-tab-btn-admin ${statusFilter === 'inactive' ? 'active' : ''}`}
            onClick={() => setStatusFilter('inactive')}
            aria-pressed={statusFilter === 'inactive'}
            disabled={isLoading || !!loadError || users.length === 0}
          >
            Não iniciaram ({notStartedUsers})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="admin-empty-state" role="status" aria-live="polite">
          <p>Carregando alunos e progresso...</p>
        </div>
      ) : loadError ? (
        <div className="admin-empty-state admin-load-error" role="alert">
          <p>{loadError}</p>
          <button type="button" onClick={loadUsers}>
            Tentar novamente
          </button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="admin-empty-state">
          <p>
            {users.length === 0
              ? 'Ainda não há alunos cadastrados.'
              : 'Nenhum aluno encontrado para os filtros aplicados.'}
          </p>
        </div>
      ) : (
        <div className="admin-student-list" aria-label="Lista de alunos">
          <div className="admin-student-list-header">
            <span>Aluno</span>
            <span>Contato principal</span>
            <span>Progresso</span>
            <span>Ações</span>
          </div>

          {filteredUsers.map((user, userIndex) => {
            const isExpanded = expandedUser === user.email;
            const moduleRows = isExpanded ? getUserModuleRows(user) : [];
            const detailsId = `student-details-${userIndex}`;

            return (
              <article key={user.email} className={`admin-student-card ${isExpanded ? 'expanded' : ''}`}>
                <div className="student-card-main">
                  <div className="student-identity">
                    <div className="user-avatar-admin">
                      {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="user-name-wrapper">
                      <span className="user-name-title">{user.name}</span>
                      <span className="user-role-label">Aluno cadastrado</span>
                    </div>
                  </div>

                  <div className="student-contact-panel">
                    <span className="contact-line contact-email" title={user.email}>
                      <Mail size={13} />
                      <span>{user.email}</span>
                    </span>

                    <div className="contact-inline-row">
                      <span className="contact-line">
                        <Phone size={13} />
                        <span>{user.phone || 'Sem telefone'}</span>
                      </span>
                      <span className="contact-line">
                        <Calendar size={13} />
                        <span>{user.age ? `${user.age} anos` : 'Idade nao informada'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="student-progress-panel">
                    {user.progressLoadFailed ? (
                      <span className="student-progress-note" role="status">
                        Progresso não carregado
                      </span>
                    ) : (
                      <>
                        <div className="progress-text-row">
                          <span className="progress-percentage">{user.fullProgressPercent}% do roteiro</span>
                          <span className="progress-ratio">{user.completedCount}/{COURSE_TOTAL_LESSONS}</span>
                        </div>
                        <div
                          className="progress-bar-admin-bg"
                          role="progressbar"
                          aria-label={`Progresso de ${user.name || 'aluno'}`}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-valuenow={user.fullProgressPercent}
                        >
                          <div className="progress-bar-admin-fill" style={{ width: `${user.fullProgressPercent}%` }} />
                        </div>
                        <span className="student-progress-note">
                          {user.availableProgressPercent}% das aulas já liberadas
                        </span>
                      </>
                    )}
                  </div>

                  <div className="student-actions">
                    <span className={`status-badge-admin ${user.studyStatus}`}>{user.studyStatusText}</span>
                    <button
                      type="button"
                      className={`toggle-details-btn ${isExpanded ? 'active' : ''}`}
                      onClick={() => toggleExpandUser(user.email)}
                      title={isExpanded ? 'Recolher detalhes' : 'Ver progresso por módulo'}
                      aria-label={`${isExpanded ? 'Recolher' : 'Exibir'} progresso por módulo de ${user.name || 'aluno'}`}
                      aria-expanded={isExpanded}
                      aria-controls={detailsId}
                      disabled={user.progressLoadFailed}
                    >
                      <span>Módulos</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button
                      type="button"
                      className="delete-user-btn"
                      onClick={() => setPendingDeleteUser(user)}
                      title="Remover aluno"
                      aria-label={`Remover ${user.name || 'aluno'}`}
                      disabled={deletingEmail !== null}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div
                    id={detailsId}
                    className="student-details-panel"
                    role="region"
                    aria-label={`Detalhes do progresso de ${user.name || 'aluno'}`}
                  >
                    {user.completedCount === 0 ? (
                      <p className="no-progress-text">O aluno ainda não marcou nenhuma aula como concluída.</p>
                    ) : (
                      <>
                        <div className="details-section-heading">
                          <Clock size={15} />
                          <span>Progresso por módulo liberado</span>
                        </div>

                        <div className="admin-module-progress-list">
                          {moduleRows.map(module => (
                            <div key={module.moduleId} className="admin-module-progress-row">
                              <div className="module-info-admin">
                                <span className="details-module-badge">{module.moduleId}</span>
                                <span className="details-module-title">{module.title}</span>
                              </div>
                              <div className="module-progress-admin">
                                <span>{module.completed}/{module.available} liberadas</span>
                                <div
                                  className="progress-bar-admin-bg compact"
                                  role="progressbar"
                                  aria-label={`Progresso no ${module.moduleId}: ${module.title}`}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                  aria-valuenow={module.availablePercent}
                                >
                                  <div className="progress-bar-admin-fill" style={{ width: `${module.availablePercent}%` }} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="details-lessons-summary">
                          {moduleRows
                            .filter(module => module.completed > 0)
                            .map(module => (
                              <div key={`${module.moduleId}-lessons`} className="details-lessons-group">
                                <span className="details-lessons-group-title">{module.moduleId} - {module.title}</span>
                                <ul className="details-lessons-list">
                                  {module.lessons.filter(lesson => lesson.completed).map(lesson => (
                                    <li key={lesson.id} className="details-lesson-item completed">
                                      <CheckCircle2 size={13} className="done-icon" />
                                      <span className="details-lesson-title-text">{formatLessonTitle(lesson.title)}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {pendingDeleteUser && (
        <div
          className="admin-confirm-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deletingEmail) {
              setPendingDeleteUser(null);
            }
          }}
        >
          <div
            className="admin-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-confirm-title"
            aria-describedby="admin-confirm-description"
          >
            <div className="admin-confirm-icon" aria-hidden="true">
              <Trash2 size={20} />
            </div>
            <div>
              <span className="admin-confirm-eyebrow">Ação permanente</span>
              <h3 id="admin-confirm-title">Remover este aluno?</h3>
              <p id="admin-confirm-description">
                O perfil de <strong>{pendingDeleteUser.name || pendingDeleteUser.email}</strong> e todo o progresso associado serão apagados.
              </p>
            </div>
            <div className="admin-confirm-actions">
              <button
                type="button"
                className="admin-confirm-cancel"
                onClick={() => setPendingDeleteUser(null)}
                disabled={Boolean(deletingEmail)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="admin-confirm-delete"
                onClick={() => handleDeleteUser(pendingDeleteUser.email)}
                disabled={Boolean(deletingEmail)}
              >
                {deletingEmail ? 'Removendo...' : 'Remover aluno'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReport;
