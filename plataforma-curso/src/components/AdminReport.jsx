import React, { useEffect, useMemo, useState } from 'react';
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

  const availableLessonsCount = lessons.length;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const usersList = await res.json();
        setUsers(usersList);

        usersList.forEach(async (user) => {
          try {
            const progressRes = await fetch(`/api/progress?email=${user.email}`);
            if (progressRes.ok) {
              const progress = await progressRes.json();
              setUsers(prevUsers => prevUsers.map(currentUser =>
                currentUser.email.toLowerCase() === user.email.toLowerCase()
                  ? { ...currentUser, completedLessons: progress }
                  : currentUser
              ));
            }
          } catch (progressError) {
            console.error('Failed to load progress for admin user', user.email, progressError);
          }
        });
        return;
      }

      const data = await res.json();
      if (data.error && data.error.includes('Database environment variables not configured')) {
        throw new Error('KV_NOT_CONFIGURED');
      }
    } catch (loadError) {
      console.warn('Using local users fallback for admin report', loadError);
      const storedUsers = localStorage.getItem('users');
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];

      const usersWithLocalProgress = usersList.map(user => {
        const progressKey = `completedLessons_${user.email.toLowerCase()}`;
        const saved = localStorage.getItem(progressKey);
        return {
          ...user,
          completedLessons: saved ? JSON.parse(saved) : {}
        };
      });
      setUsers(usersWithLocalProgress);
    }
  };

  const handleDeleteUser = async (email) => {
    if (!window.confirm(`Tem certeza de que deseja remover o usuario ${email}? Isso apagara tambem seu progresso.`)) {
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', email })
      });

      if (res.ok) {
        setUsers(prev => prev.filter(user => user.email.toLowerCase() !== email.toLowerCase()));
        if (expandedUser === email) setExpandedUser(null);
        return;
      }

      const data = await res.json();
      if (data.error && data.error.includes('Database environment variables not configured')) {
        throw new Error('KV_NOT_CONFIGURED');
      }
      alert(data.error || 'Erro ao remover usuario.');
    } catch (deleteError) {
      console.warn('Removing user from local fallback only', deleteError);
      const storedUsers = localStorage.getItem('users');
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];
      const updatedUsers = usersList.filter(user => user.email.toLowerCase() !== email.toLowerCase());

      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.removeItem(`completedLessons_${email.toLowerCase()}`);
      setUsers(prev => prev.filter(user => user.email.toLowerCase() !== email.toLowerCase()));
      if (expandedUser === email) setExpandedUser(null);
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
    let studyStatusText = 'Nao iniciou';

    if (completedCount >= COURSE_TOTAL_LESSONS) {
      studyStatus = 'completed';
      studyStatusText = 'Concluido';
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
    const matchesSearch =
      !normalizedTerm ||
      user.name.toLowerCase().includes(normalizedTerm) ||
      user.email.toLowerCase().includes(normalizedTerm) ||
      (user.phone && user.phone.includes(normalizedTerm));

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
  const averageProgress = totalUsers > 0
    ? Math.round(processedUsers.reduce((sum, user) => sum + user.fullProgressPercent, 0) / totalUsers)
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
    <div className="admin-report-container">
      <div className="admin-header-section">
        <div>
          <span className="admin-eyebrow">Painel administrativo</span>
          <h2 className="admin-title">Relatorio de alunos</h2>
          <p className="admin-subtitle">
            Acompanhe alunos cadastrados, progresso geral e aulas concluidas por modulo.
          </p>
        </div>
        <div className="admin-course-health">
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
            <span className="metric-value">{totalUsers}</span>
          </div>
        </div>

        <div className="metric-card-admin">
          <div className="metric-icon-bg active">
            <UserCheck size={20} className="metric-icon active" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Em andamento</span>
            <span className="metric-value">{activeUsers}</span>
          </div>
        </div>

        <div className="metric-card-admin">
          <div className="metric-icon-bg completed">
            <CheckCircle2 size={20} className="metric-icon completed" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Concluidos</span>
            <span className="metric-value">{completedUsers}</span>
          </div>
        </div>

        <div className="metric-card-admin">
          <div className="metric-icon-bg progress-icon">
            <BarChart2 size={20} className="metric-icon progress-icon" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Media geral</span>
            <span className="metric-value">{averageProgress}%</span>
          </div>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="search-input-wrapper-admin">
          <Search size={16} className="search-icon-admin" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="search-input-admin"
          />
        </div>

        <div className="status-tabs-admin">
          <button className={`status-tab-btn-admin ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
            Todos ({processedUsers.length})
          </button>
          <button className={`status-tab-btn-admin ${statusFilter === 'active' ? 'active' : ''}`} onClick={() => setStatusFilter('active')}>
            Ativos ({activeUsers})
          </button>
          <button className={`status-tab-btn-admin ${statusFilter === 'completed' ? 'active' : ''}`} onClick={() => setStatusFilter('completed')}>
            Concluidos ({completedUsers})
          </button>
          <button className={`status-tab-btn-admin ${statusFilter === 'inactive' ? 'active' : ''}`} onClick={() => setStatusFilter('inactive')}>
            Nao iniciaram ({notStartedUsers})
          </button>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="admin-empty-state">
          <p>Nenhum aluno encontrado para os filtros aplicados.</p>
        </div>
      ) : (
        <div className="admin-student-list">
          <div className="admin-student-list-header">
            <span>Aluno</span>
            <span>Contato principal</span>
            <span>Progresso</span>
            <span>Acoes</span>
          </div>

          {filteredUsers.map(user => {
            const isExpanded = expandedUser === user.email;
            const moduleRows = isExpanded ? getUserModuleRows(user) : [];

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
                    <div className="progress-text-row">
                      <span className="progress-percentage">{user.fullProgressPercent}% do roteiro</span>
                      <span className="progress-ratio">{user.completedCount}/{COURSE_TOTAL_LESSONS}</span>
                    </div>
                    <div className="progress-bar-admin-bg">
                      <div className="progress-bar-admin-fill" style={{ width: `${user.fullProgressPercent}%` }} />
                    </div>
                    <span className="student-progress-note">
                      {user.availableProgressPercent}% das aulas ja liberadas
                    </span>
                  </div>

                  <div className="student-actions">
                    <span className={`status-badge-admin ${user.studyStatus}`}>{user.studyStatusText}</span>
                    <button
                      className={`toggle-details-btn ${isExpanded ? 'active' : ''}`}
                      onClick={() => toggleExpandUser(user.email)}
                      title={isExpanded ? 'Recolher detalhes' : 'Ver progresso por modulo'}
                    >
                      <span>Modulos</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button
                      className="delete-user-btn"
                      onClick={() => handleDeleteUser(user.email)}
                      title="Remover aluno"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="student-details-panel">
                    {user.completedCount === 0 ? (
                      <p className="no-progress-text">O aluno ainda nao marcou nenhuma aula como concluida.</p>
                    ) : (
                      <>
                        <div className="details-section-heading">
                          <Clock size={15} />
                          <span>Progresso por modulo liberado</span>
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
                                <div className="progress-bar-admin-bg compact">
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
    </div>
  );
};

export default AdminReport;
