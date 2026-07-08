import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, BookOpen, Search, CheckCircle2, ChevronDown, 
  ChevronUp, Trash2, Mail, Phone, Calendar, Clock, BarChart2 
} from 'lucide-react';

const AdminReport = ({ lessons }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [expandedUser, setExpandedUser] = useState(null); // email of expanded user

  const totalLessonsCount = lessons.length;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers([]);
    }
  };

  const getCompletedLessonsForUser = (email) => {
    const progressKey = `completedLessons_${email.toLowerCase()}`;
    const saved = localStorage.getItem(progressKey);
    return saved ? JSON.parse(saved) : {};
  };

  const handleDeleteUser = (email) => {
    if (window.confirm(`Tem certeza de que deseja remover o usuário ${email}? Isso apagará também seu progresso.`)) {
      const updatedUsers = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.removeItem(`completedLessons_${email.toLowerCase()}`);
      setUsers(updatedUsers);
      if (expandedUser === email) {
        setExpandedUser(null);
      }
    }
  };

  // Group lessons by module helper
  const groupLessonsByModule = (userCompleted) => {
    return lessons.reduce((acc, lesson) => {
      let module;
      if (lesson.title.startsWith('000_')) {
        module = 'P0';
      } else {
        const parts = lesson.title.split('_');
        module = parts.length >= 4 ? parts[1] : 'Outros';
      }
      
      if (!acc[module]) {
        acc[module] = {
          id: module,
          lessons: [],
          completedCount: 0
        };
      }
      
      const isCompleted = !!userCompleted[lesson.id];
      acc[module].lessons.push({
        ...lesson,
        completed: isCompleted
      });
      
      if (isCompleted) {
        acc[module].completedCount += 1;
      }
      
      return acc;
    }, {});
  };

  const moduleTitles = {
    'P0': 'Aula de Abertura',
    'M0': 'M0: Ambiente e Método',
    'M1': 'M1: Fundamentos Absolutos',
    'M2': 'M2: Java Core Profundo',
    'M3': 'M3: Organização Procedural',
    'M4': 'M4: Orientação a Objetos',
    'M5': 'M5: Collections & Java Moderno',
    'M6': 'M6: SOLID & Design Patterns',
    'M7': 'M7: Build & Ferramentas',
    'M8': 'M8: Testes Profissionais',
    'M9': 'M9: SQL & Banco de Dados',
    'M10': 'M10: Persistência com JPA/Hibernate',
    'M11': 'M11: Spring Boot REST APIs',
    'M12': 'M12: Segurança de Aplicações',
    'M13': 'M13: Integrações & Mensageria',
    'M14': 'M14: Docker & CI/CD Pipelines',
    'M15': 'M15: Observabilidade & Produção',
    'M16': 'M16: Arquitetura & DDD',
    'M17': 'M17: Projeto Final & Carreira',
    'Outros': 'Outros'
  };

  // Process users data
  const processedUsers = users.map(user => {
    const completedLessons = getCompletedLessonsForUser(user.email);
    const completedCount = Object.keys(completedLessons).filter(id => completedLessons[id]).length;
    const progressPercent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;
    const isActive = completedCount > 0;

    return {
      ...user,
      completedCount,
      progressPercent,
      isActive,
      completedLessons
    };
  });

  // Filter users
  const filteredUsers = processedUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesStatus;
  });

  // Calculate global dashboard metrics
  const totalUsers = processedUsers.length;
  const activeUsers = processedUsers.filter(u => u.isActive).length;
  const averageProgress = totalUsers > 0 
    ? Math.round(processedUsers.reduce((sum, u) => sum + u.progressPercent, 0) / totalUsers) 
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
      return `${moduleStr} - ${text.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase())}`;
    }
    return title.replace(/_/g, ' ').replace(/\.md$/, '');
  };

  return (
    <div className="admin-report-container">
      <div className="admin-header-section">
        <h2 className="admin-title">Relatório de Alunos Cadastrados</h2>
        <p className="admin-subtitle">Acompanhe quem está estudando, o progresso no curso e as aulas concluídas.</p>
      </div>

      {/* KPI Stats Cards */}
      <div className="admin-metrics-grid">
        <div className="metric-card-admin">
          <div className="metric-icon-bg">
            <Users size={22} className="metric-icon" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total de Alunos</span>
            <span className="metric-value">{totalUsers}</span>
          </div>
        </div>

        <div className="metric-card-admin">
          <div className="metric-icon-bg active">
            <UserCheck size={22} className="metric-icon active" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Alunos Ativos</span>
            <span className="metric-value">{activeUsers}</span>
          </div>
        </div>

        <div className="metric-card-admin">
          <div className="metric-icon-bg progress-icon">
            <BarChart2 size={22} className="metric-icon progress-icon" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Média de Progresso</span>
            <span className="metric-value">{averageProgress}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="search-input-wrapper-admin">
          <Search size={16} className="search-icon-admin" />
          <input 
            type="text" 
            placeholder="Buscar por nome, e-mail ou telefone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-admin"
          />
        </div>
        <div className="status-tabs-admin">
          <button 
            className={`status-tab-btn-admin ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Todos ({processedUsers.length})
          </button>
          <button 
            className={`status-tab-btn-admin ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Ativos ({processedUsers.filter(u => u.isActive).length})
          </button>
          <button 
            className={`status-tab-btn-admin ${statusFilter === 'inactive' ? 'active' : ''}`}
            onClick={() => setStatusFilter('inactive')}
          >
            Inativos ({processedUsers.filter(u => !u.isActive).length})
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="admin-users-table-container">
        {filteredUsers.length === 0 ? (
          <div className="admin-empty-state">
            <p>Nenhum aluno encontrado correspondente aos filtros aplicados.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Contato</th>
                  <th>Idade</th>
                  <th>Progresso Geral</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isExpanded = expandedUser === user.email;
                  const groupedModules = isExpanded ? groupLessonsByModule(user.completedLessons) : {};

                  return (
                    <React.Fragment key={user.email}>
                      <tr className={`user-row ${isExpanded ? 'expanded' : ''}`}>
                        <td>
                          <div className="user-profile-cell">
                            <div className="user-avatar-admin">
                              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="user-name-wrapper">
                              <span className="user-name-title">{user.name}</span>
                              <span className="user-role-label">Aluno</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="user-contact-info">
                            <div className="contact-item">
                              <Mail size={12} />
                              <span>{user.email}</span>
                            </div>
                            <div className="contact-item">
                              <Phone size={12} />
                              <span>{user.phone || 'Sem telefone'}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="user-age-badge">{user.age ? `${user.age} anos` : '-'}</span>
                        </td>
                        <td>
                          <div className="user-progress-column">
                            <div className="progress-text-row">
                              <span className="progress-percentage">{user.progressPercent}%</span>
                              <span className="progress-ratio">{user.completedCount} de {totalLessonsCount} aulas</span>
                            </div>
                            <div className="progress-bar-admin-bg">
                              <div 
                                className="progress-bar-admin-fill" 
                                style={{ width: `${user.progressPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge-admin ${user.isActive ? 'active' : 'inactive'}`}>
                            {user.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td>
                          <div className="user-actions-cell">
                            <button 
                              className={`toggle-details-btn ${isExpanded ? 'active' : ''}`}
                              onClick={() => toggleExpandUser(user.email)}
                              title={isExpanded ? 'Recolher detalhes' : 'Ver aulas concluídas'}
                            >
                              <span>Aulas</span>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            <button 
                              className="delete-user-btn"
                              onClick={() => handleDeleteUser(user.email)}
                              title="Remover Aluno"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable row for lesson details */}
                      {isExpanded && (
                        <tr className="details-row">
                          <td colSpan="6">
                            <div className="details-expanded-container">
                              <h4 className="details-section-title">Aulas Concluídas por Módulo</h4>
                              {user.completedCount === 0 ? (
                                <p className="no-progress-text">O aluno ainda não iniciou o curso (nenhuma aula marcada como concluída).</p>
                              ) : (
                                <div className="details-modules-grid">
                                  {Object.keys(groupedModules).sort((a, b) => {
                                    if (a === 'P0') return -1;
                                    if (b === 'P0') return 1;
                                    if (a === 'Outros') return 1;
                                    if (b === 'Outros') return -1;
                                    const numA = parseInt(a.replace('M', ''), 10);
                                    const numB = parseInt(b.replace('M', ''), 10);
                                    return numA - numB;
                                  }).map(moduleId => {
                                    const moduleData = groupedModules[moduleId];
                                    const title = moduleTitles[moduleId] || moduleId;
                                    const completedPercent = moduleData.lessons.length > 0 
                                      ? Math.round((moduleData.completedCount / moduleData.lessons.length) * 100) 
                                      : 0;

                                    return (
                                      <div key={moduleId} className="details-module-card">
                                        <div className="details-module-header">
                                          <div className="module-info-admin">
                                            <span className="details-module-badge">{moduleId}</span>
                                            <span className="details-module-title">{title}</span>
                                          </div>
                                          <span className="details-module-progress">
                                            {moduleData.completedCount}/{moduleData.lessons.length} ({completedPercent}%)
                                          </span>
                                        </div>
                                        <ul className="details-lessons-list">
                                          {moduleData.lessons.map(lesson => (
                                            <li key={lesson.id} className={`details-lesson-item ${lesson.completed ? 'completed' : ''}`}>
                                              <div className="lesson-status-indicator">
                                                {lesson.completed ? (
                                                  <CheckCircle2 size={13} className="done-icon" />
                                                ) : (
                                                  <span className="todo-bullet"></span>
                                                )}
                                              </div>
                                              <span className="details-lesson-title-text">
                                                {formatLessonTitle(lesson.title)}
                                              </span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReport;
