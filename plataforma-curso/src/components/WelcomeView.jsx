import React, { useState, useEffect } from 'react';
import javaLogo from '../assets/java_logo.png';
import { 
  Play, BookOpen, Award, Zap, Shield, Database, Cpu, 
  Globe, Terminal, Box, UserCheck, Settings, CheckSquare, Activity,
  Layers, ArrowRight, Clock, Sparkles, Trophy, CheckCircle2
} from 'lucide-react';

const WelcomeView = ({ lessons, completedLessons, onSelectLesson }) => {
  const totalCount = lessons.length;
  const completedCount = Object.keys(completedLessons).filter(id => completedLessons[id]).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const [activePhase, setActivePhase] = useState(1);

  const handleStart = () => {
    if (lessons.length === 0) return;
    const nextLesson = lessons.find(l => !completedLessons[l.id]) || lessons[0];
    onSelectLesson(nextLesson);
  };

  const phases = [
    {
      id: 1,
      name: 'Fase 1: Fundações & Core',
      shortName: 'Fase 1',
      subtitle: 'Do zero aos segredos da JVM, Orientação a Objetos, Coleções e Padrões de Projeto.',
      modules: ['P0', 'M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6']
    },
    {
      id: 2,
      name: 'Fase 2: Testes & Spring Boot',
      shortName: 'Fase 2',
      subtitle: 'Qualidade com testes automatizados, modelagem SQL profunda e APIs REST seguras.',
      modules: ['M7', 'M8', 'M9', 'M10', 'M11', 'M12']
    },
    {
      id: 3,
      name: 'Fase 3: DevOps & Arquitetura',
      shortName: 'Fase 3',
      subtitle: 'Escalabilidade com Docker/Kubernetes, tracing distribuído, DDD e projeto final.',
      modules: ['M13', 'M14', 'M15', 'M16', 'M17']
    }
  ];

  useEffect(() => {
    if (completedCount > 0 && lessons.length > 0) {
      const nextLesson = lessons.find(l => !completedLessons[l.id]);
      if (nextLesson) {
        let currentModule;
        if (nextLesson.title.startsWith('000_')) {
          currentModule = 'P0';
        } else {
          const parts = nextLesson.title.split('_');
          currentModule = parts.length >= 4 ? parts[1] : 'Outros';
        }
        
        const phaseIndex = phases.findIndex(p => p.modules.includes(currentModule));
        if (phaseIndex !== -1) {
          setActivePhase(phases[phaseIndex].id);
        }
      }
    }
  }, [lessons, completedLessons, completedCount]);

  const moduleStats = lessons.reduce((acc, lesson) => {
    let module;
    if (lesson.title.startsWith('000_')) {
      module = 'P0';
    } else {
      const parts = lesson.title.split('_');
      module = parts.length >= 4 ? parts[1] : 'Outros';
    }
    
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
      id: 'P0', 
      title: 'Aula de Abertura', 
      description: 'O caminho completo para se tornar Engenheiro Java Backend e Arquiteto de Sistemas — mentalidade, método e visão de carreira.', 
      icon: Zap,
      topics: ['Por que esta formação existe', 'Como estudar sem virar colecionador de aulas', 'Pacto da Mentoria', 'Uso correto de IA', 'Diário de Bordo', 'Critérios Junior → Engenheiro → Arquiteto']
    },
    { 
      id: 'M0', 
      title: 'M0: Ambiente e Método', 
      description: 'Preparação do ambiente completo (JDK, Git, GitHub, Docker, WSL2) e organização de rotina.', 
      icon: Settings,
      topics: ['JDK LTS & javac', 'IntelliJ & Debug', 'Git & GitHub do zero', 'Maven', 'Docker & WSL2', 'PostgreSQL & DBeaver']
    },
    { 
      id: 'M1', 
      title: 'M1: Fundamentos Absolutos', 
      description: 'Sintaxe Java de alto nível, variáveis primitivas, lógica aplicada, arrays, laços e métodos.', 
      icon: BookOpen,
      topics: ['Tipos de Variáveis', 'Lógica & Condicionais', 'Loops (while, for)', 'Arrays & Matrizes', 'Métodos & Sobrecarga', 'Projeto Calculadora']
    },
    { 
      id: 'M2', 
      title: 'M2: Java Core Profundo', 
      description: 'Arquitetura interna da JVM, alocação de memória (Stack/Heap), referências, Garbage Collector e String Pool.', 
      icon: Cpu,
      topics: ['JVM por baixo (Stack/Heap)', 'Garbage Collector', 'BigDecimal & Java Time API', 'Records, Enums & Sealed', 'Exceptions', 'I/O & Pacotes']
    },
    { 
      id: 'M3', 
      title: 'M3: Organização Procedural', 
      description: 'Quebra de responsabilidades em funções pequenas, modularização e projetos práticos console.', 
      icon: Terminal,
      topics: ['Assinaturas Coesas', 'Evitando Parâmetros Excessivos', 'Refatoração no IntelliJ', 'Mini-arquitetura Procedural', 'Projeto OS Console']
    },
    { 
      id: 'M4', 
      title: 'M4: Orientação a Objetos', 
      description: 'Modelagem orientada a objetos profissional, encapsulamento forte, construtores e objetos válidos.', 
      icon: Code,
      topics: ['Classes & Objetos', 'Encapsulamento & Imutabilidade', 'Polimorfismo & Interfaces', 'Services & Repositories', 'Projeto Pedidos OO']
    },
    { 
      id: 'M5', 
      title: 'M5: Collections & Java Moderno', 
      description: 'Generics, estruturas de dados, API de Streams, expressões lambda, record classes e performance.', 
      icon: Layers,
      topics: ['List, Set & Map (Big O)', 'Generics & Wildcards', 'Optional com Critério', 'Stream API (Filter, Map, Collect)', 'Concurrent Collections']
    },
    { 
      id: 'M6', 
      title: 'M6: SOLID & Design Patterns', 
      description: 'Refatoração, Clean Code, princípios SOLID fundamentais e padrões de projeto aplicados.', 
      icon: Award,
      topics: ['Clean Code & Smell', 'SOLID de A a Z', 'Design Patterns GoF', 'Mappers Manuais & DTOs', 'Strategy, Factory & Builder']
    },
    { 
      id: 'M7', 
      title: 'M7: Build & Ferramentas', 
      description: 'Maven, Gradle, gestão de dependências, empacotamento, qualidade estática e linting.', 
      icon: Settings,
      topics: ['Maven Lifecycle & POM', 'Projetos Multi-módulo', 'Git Flow & Branching', 'Conventional Commits', 'Sonar & Linter']
    },
    { 
      id: 'M8', 
      title: 'M8: Testes Profissionais', 
      description: 'Testes unitários e de integração utilizando JUnit 5, Mockito e boas práticas de TDD.', 
      icon: CheckSquare,
      topics: ['JUnit 5 & AssertJ', 'Mockito Mocks', 'TDD Pragmático', 'Cobertura JaCoCo', 'Testcontainers & WireMock']
    },
    { 
      id: 'M9', 
      title: 'M9: SQL & Banco de Dados', 
      description: 'Modelagem relacional, consultas SQL, joins, transações e performance em PostgreSQL.', 
      icon: Database,
      topics: ['Modelagem Relacional', 'Joins & CTEs', 'Índices & Explain Analyze', 'Transações ACID & Locks', 'Paginação SQL']
    },
    { 
      id: 'M10', 
      title: 'M10: Persistência com JPA/Hibernate', 
      description: 'Mapeamento objeto-relacional de verdade, JDBC, ciclo de vida do JPA e otimizações com Spring Data.', 
      icon: Database,
      topics: ['JDBC vs JPA/Hibernate', 'Mapeamento & Flyway', 'Performance N+1', 'JPQL & Criteria', 'Locks Otimista/Pessimista']
    },
    { 
      id: 'M11', 
      title: 'M11: Spring Boot REST APIs', 
      description: 'Construção de APIs corporativas, injeção de dependência, DTOs, controllers, tratamento global de erros.', 
      icon: Globe,
      topics: ['DI & Injeção de Beans', 'Bean Validation', 'Tratamento de Erros Global', 'Redis Caching & Rate Limit', 'OpenAPI/Swagger']
    },
    { 
      id: 'M12', 
      title: 'M12: Segurança de Aplicações', 
      description: 'Autenticação e autorização com Spring Security, JWT, OAuth2, LGPD e práticas contra ataques OWASP.', 
      icon: Shield,
      topics: ['OWASP Top 10', 'Spring Security & Filters', 'JWT & Refresh Tokens', 'OAuth2 & Keycloak', 'Secrets Management']
    },
    { 
      id: 'M13', 
      title: 'M13: Integrações & Mensageria', 
      description: 'Webhooks, APIs externas, eventos assíncronos com Message Queues (RabbitMQ/Kafka) e resiliência.', 
      icon: Globe,
      topics: ['Circuit Breaker & Retry', 'RabbitMQ vs Apache Kafka', 'DLQ & Poison Message', 'Outbox & Inbox Patterns', 'Padrão SAGA']
    },
    { 
      id: 'M14', 
      title: 'M14: Docker & CI/CD Pipelines', 
      description: 'Containerização, orquestração Kubernetes, pipelines do GitHub Actions e deploy em nuvem.', 
      icon: Box,
      topics: ['Dockerfile Multi-stage', 'Docker Compose', 'Kubernetes Probes & Pods', 'GitHub Actions CI/CD', 'Deploy na AWS']
    },
    { 
      id: 'M15', 
      title: 'M15: Observabilidade & Produção', 
      description: 'Métricas, logs centralizados, tracing de requisições, concorrência no Java e JVM tuning.', 
      icon: Activity,
      topics: ['Logs & Trace ID', 'Prometheus & Grafana', 'OpenTelemetry Tracing', 'Virtual Threads', 'Thread/Heap Dumps']
    },
    { 
      id: 'M16', 
      title: 'M16: Arquitetura & DDD', 
      description: 'Arquitetura Hexagonal, Clean Architecture, princípios DDD de modelagem de domínio e sistemas distribuídos.', 
      icon: Cpu,
      topics: ['Clean & Hexagonal', 'Monólitos Modulares', 'Domain-Driven Design (DDD)', 'CQRS & Event Sourcing', 'Sistemas Distribuídos & CAP']
    },
    { 
      id: 'M17', 
      title: 'M17: Projeto Final & Carreira', 
      description: 'Desenvolvimento do projeto final da formação, defesa técnica, portfólio profissional e preparação de entrevistas.', 
      icon: UserCheck,
      topics: ['Projeto Final Real', 'Defesa / Banca Técnica', 'Mock Interviews Java/Spring', 'LinkedIn & Currículo', 'Construção de Portfólio']
    }
  ];

  return (
    <div className="welcome-view-container">
      <div className="welcome-hero">
        <div className="hero-text-col">
          <div className="hero-tag-badge">
            <Sparkles size={12} className="tag-icon" />
            <span>FORMAÇÃO PREMIUM</span>
          </div>
          <h1 className="welcome-title">Formação Java Backend</h1>
          <p className="welcome-subtitle">
            Uma jornada profunda do zero ao nível de Engenheiro e Arquiteto de Sistemas backend de nível corporativo.
          </p>
          
          <div className="hero-features-list">
            <div className="feature-item">
              <div className="feature-icon-bullet">
                <Layers size={14} />
              </div>
              <div className="feature-text">
                <strong>18 Módulos Completos:</strong> Da lógica aos microsserviços.
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-bullet">
                <Shield size={14} />
              </div>
              <div className="feature-text">
                <strong>Qualidade Enterprise:</strong> Testes automatizados (TDD), SOLID e OWASP.
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-bullet">
                <Cpu size={14} />
              </div>
              <div className="feature-text">
                <strong>Alta Escalabilidade:</strong> Kafka, Docker/K8s, Observabilidade e DDD.
              </div>
            </div>
          </div>

          {completedCount === 0 && (
            <button className="welcome-start-btn" onClick={handleStart}>
              <Play size={18} fill="currentColor" />
              <span>Iniciar Formação</span>
            </button>
          )}
        </div>

        <div className="hero-logo-col">
          <div className="welcome-logo-wrapper">
            <img src={javaLogo} alt="Java Logo" className="welcome-logo-img" />
            <div className="logo-glow"></div>
          </div>
        </div>
      </div>

      {completedCount > 0 && (
        <div className="welcome-dashboard">
          <div className="dashboard-content">
            <div className="dashboard-left">
              <div className="dashboard-badge">
                <Trophy size={13} className="dashboard-badge-icon" />
                <span>SEU PROGRESSO ATUAL</span>
              </div>
              <h2 className="dashboard-title">
                Você concluiu <strong>{progressPercent}%</strong> da formação!
              </h2>
              <p className="dashboard-subtext">
                Roteiro avançado com foco prático e arquitetura de nível enterprise.
              </p>
            </div>
            <div className="dashboard-right">
              <div className="dashboard-metrics">
                <div className="metric-box">
                  <span className="metric-num">{completedCount}</span>
                  <span className="metric-lbl">Aulas Feitas</span>
                </div>
                <div className="metric-box">
                  <span className="metric-num">{totalCount - completedCount}</span>
                  <span className="metric-lbl">Aulas Restantes</span>
                </div>
              </div>
              <button className="dashboard-resume-btn" onClick={handleStart}>
                <span>Continuar de Onde Parou</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
          <div className="dashboard-progress-track">
            <div className="dashboard-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      )}

      <div className="welcome-modules-section">
        <div className="curriculum-header">
          <h2 className="section-heading">Grade Curricular da Formação</h2>
          <p className="section-subheading">
            Dividida em 3 fases estratégicas para organizar seus estudos e focar nos seus objetivos.
          </p>
        </div>

        <div className="phase-tabs-container">
          {phases.map((p) => {
            const phaseLessons = lessons.filter(lesson => {
              let module;
              if (lesson.title.startsWith('000_')) {
                module = 'P0';
              } else {
                const parts = lesson.title.split('_');
                module = parts.length >= 4 ? parts[1] : 'Outros';
              }
              return p.modules.includes(module);
            });
            
            const totalPhase = phaseLessons.length;
            const completedPhase = phaseLessons.filter(l => completedLessons[l.id]).length;
            const isPhaseDone = totalPhase > 0 && completedPhase === totalPhase;
            
            return (
              <button
                key={p.id}
                className={`phase-tab-btn ${activePhase === p.id ? 'active' : ''} ${isPhaseDone ? 'completed' : ''}`}
                onClick={() => setActivePhase(p.id)}
              >
                <div className="tab-btn-title">
                  <span>{p.shortName}</span>
                  {isPhaseDone && <CheckCircle2 size={12} className="tab-done-icon" />}
                </div>
                <span className="tab-btn-lbl">
                  {completedPhase > 0 ? `${completedPhase}/${totalPhase} Aulas` : `${totalPhase} Aulas`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="phase-info-banner">
          <h3 className="phase-info-title">{phases[activePhase - 1].name}</h3>
          <p className="phase-info-desc">{phases[activePhase - 1].subtitle}</p>
        </div>

        <div className="modules-grid">
          {modulesList
            .filter(mod => phases[activePhase - 1].modules.includes(mod.id))
            .map((mod) => {
              const IconComponent = mod.icon;
              const stats = moduleStats[mod.id] || { total: 0, completed: 0 };
              const isModuleCompleted = stats.total > 0 && stats.completed === stats.total;
              const isModuleStarted = stats.completed > 0;
              const moduleProgressPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
              
              let badgeText = 'Em Breve';
              let badgeClass = 'coming-soon';
              
              if (stats.total > 0) {
                if (isModuleCompleted) {
                  badgeText = 'Concluído';
                  badgeClass = 'completed';
                } else if (isModuleStarted) {
                  badgeText = `${stats.completed}/${stats.total} Aulas`;
                  badgeClass = 'in-progress';
                } else {
                  badgeText = `${stats.total} Aulas`;
                  badgeClass = 'new';
                }
              }
              
              return (
                <div key={mod.id} className={`module-card ${isModuleCompleted ? 'completed' : ''} ${isModuleStarted && !isModuleCompleted ? 'in-progress' : ''}`}>
                  <div className="module-card-header">
                    <div className="module-icon-wrapper">
                      <IconComponent size={20} />
                    </div>
                    <span className={`module-badge ${badgeClass}`}>{badgeText}</span>
                  </div>
                  <div className="module-card-body">
                    <h3 className="module-title">{mod.title}</h3>
                    <p className="module-desc">{mod.description}</p>
                    
                    {stats.total > 0 && isModuleStarted && !isModuleCompleted && (
                      <div className="card-progress-section">
                        <div className="card-progress-bar">
                          <div className="card-progress-fill" style={{ width: `${moduleProgressPercent}%` }}></div>
                        </div>
                      </div>
                    )}
                    
                    {mod.topics && mod.topics.length > 0 && (
                      <div className="module-topics">
                        {mod.topics.map((topic, idx) => (
                          <span key={idx} className="topic-chip">{topic}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

const Code = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export default WelcomeView;
