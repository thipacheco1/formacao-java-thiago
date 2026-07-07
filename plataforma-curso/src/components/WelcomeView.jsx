import React from 'react';
import javaLogo from '../assets/java_logo.png';
import { 
  Play, BookOpen, Award, Zap, Shield, Database, Cpu, 
  Globe, Terminal, Box, UserCheck, Settings, CheckSquare, Activity
} from 'lucide-react';

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
    let module;
    // Special case: the 000 opening lesson belongs to the P0 module
    if (lesson.title.startsWith('000_')) {
      module = 'P0';
    } else {
      const parts = lesson.title.split('_');
      module = parts.length >= 4 ? parts[1] : 'Outros'; // e.g. M0, M1
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
      topics: ['Por que esta formação existe', 'Como estudar sem virar colecionador de aulas', 'Pacto da Mentoria', 'Uso correto de IA (sem terceirizar raciocínio)', 'Diário de Bordo e rastreabilidade', 'Critérios Junior → Engenheiro → Arquiteto']
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
      topics: ['Tipos de Variáveis', 'Lógica & Estruturas Condicionais', 'Loops (while, do-while, for)', 'Arrays & Matrizes', 'Métodos & Sobrecarga', 'Mini-projeto Calculadora']
    },
    { 
      id: 'M2', 
      title: 'M2: Java Core Profundo', 
      description: 'Arquitetura interna da JVM, alocação de memória (Stack/Heap), referências, Garbage Collector e String Pool.', 
      icon: Cpu,
      topics: ['JVM por baixo (Stack/Heap)', 'Garbage Collector & String Pool', 'BigDecimal & Java Time API', 'Records, Enums & Sealed Classes', 'Exceptions por baixo', 'I/O & Pacotes']
    },
    { 
      id: 'M3', 
      title: 'M3: Organização Procedural', 
      description: 'Quebra de responsabilidades em funções pequenas, modularização e projetos práticos console.', 
      icon: Terminal,
      topics: ['Assinaturas de Métodos Coesas', 'Evitando Parâmetros Excessivos', 'Refatoração no IntelliJ', 'Mini-arquitetura Procedural', 'Projeto OS Console']
    },
    { 
      id: 'M4', 
      title: 'M4: Orientação a Objetos', 
      description: 'Modelagem orientada a objetos profissional, encapsulamento forte, construtores e objetos válidos.', 
      icon: Code,
      topics: ['Classes, Objetos & Construtores', 'Encapsulamento & Imutabilidade', 'Polimorfismo & Interfaces', 'Services & Repositories em memória', 'Projeto Pedidos OO']
    },
    { 
      id: 'M5', 
      title: 'M5: Collections & Java Moderno', 
      description: 'Generics, estruturas de dados, API de Streams, expressões lambda, record classes e performance.', 
      icon: Award,
      topics: ['List, Set & Map (Big O)', 'Generics & Wildcards', 'Optional com Critério', 'Stream API (Filter, Map, Collect, Reduce)', 'Concurrent Collections']
    },
    { 
      id: 'M6', 
      title: 'M6: SOLID & Design Patterns', 
      description: 'Refatoração, Clean Code, princípios SOLID fundamentais e padrões de projeto aplicados.', 
      icon: Award,
      topics: ['Clean Code & Code Smells', 'Princípios SOLID de A a Z', 'Design Patterns GoF', 'Mappers Manuais & DTOs', 'Padrão Strategy, Factory & Builder']
    },
    { 
      id: 'M7', 
      title: 'M7: Build & Ferramentas', 
      description: 'Maven, Gradle, gestão de dependências, empacotamento, qualidade estática e linting.', 
      icon: Settings,
      topics: ['Maven Lifecycle & POM.xml', 'Projetos Multi-módulo', 'Git Flow & Branching Profissional', 'Conventional Commits & PRs', 'Qualidade Estática (Sonar & Linter)']
    },
    { 
      id: 'M8', 
      title: 'M8: Testes Profissionais', 
      description: 'Testes unitários e de integração utilizando JUnit 5, Mockito e boas práticas de TDD.', 
      icon: CheckSquare,
      topics: ['JUnit 5 & AssertJ', 'Mockito para Mocks Seguros', 'TDD Pragmático', 'Cobertura JaCoCo & Testes de Mutação', 'Testcontainers, WireMock & ArchUnit']
    },
    { 
      id: 'M9', 
      title: 'M9: SQL & Banco de Dados', 
      description: 'Modelagem relacional, consultas SQL, joins, transações e performance em PostgreSQL.', 
      icon: Database,
      topics: ['Modelagem Relacional & DDL/DML', 'Joins, Subqueries & CTEs', 'Índices & Otimização (Explain Analyze)', 'Transações ACID, Isolamento & Locks', 'Paginação SQL']
    },
    { 
      id: 'M10', 
      title: 'M10: Persistência com JPA/Hibernate', 
      description: 'Mapeamento objeto-relacional de verdade, JDBC, ciclo de vida do JPA e otimizações com Spring Data.', 
      icon: Database,
      topics: ['JDBC puro vs JPA/Hibernate', 'Mapeamento de Entidades & Flyway', 'Performance: N+1 & Fetch Strategy', 'JPQL, Criteria & Projections', 'Lock Otimista e Pessimista']
    },
    { 
      id: 'M11', 
      title: 'M11: Spring Boot REST APIs', 
      description: 'Construção de APIs corporativas, injeção de dependência, DTOs, controllers, tratamento global de erros.', 
      icon: Globe,
      topics: ['Beans & Injeção de Dependências', 'Validações com Bean Validation', 'Tratamento de Erros Global', 'Redis Caching & Rate Limiting', 'Documentação com OpenAPI/Swagger', 'Versionamento de APIs']
    },
    { 
      id: 'M12', 
      title: 'M12: Segurança de Aplicações', 
      description: 'Autenticação e autorização com Spring Security, JWT, OAuth2, LGPD e práticas contra ataques OWASP.', 
      icon: Shield,
      topics: ['OWASP Top 10 Aplicado', 'Spring Security & Filtros', 'JWT & Refresh Tokens', 'OAuth2, OIDC & Keycloak', 'LGPD & Secrets Management']
    },
    { 
      id: 'M13', 
      title: 'M13: Integrações & Mensageria', 
      description: 'Webhooks, APIs externas, eventos assíncronos com Message Queues (RabbitMQ/Kafka) e resiliência.', 
      icon: Globe,
      topics: ['Resiliência (Circuit Breaker & Retry)', 'RabbitMQ vs Apache Kafka', 'Dlq, Retry & Poison Message', 'Transactional Outbox & Inbox Patterns', 'Consistência com Padrão SAGA']
    },
    { 
      id: 'M14', 
      title: 'M14: Docker & CI/CD Pipelines', 
      description: 'Containerização, orquestração Kubernetes, pipelines do GitHub Actions e deploy em nuvem.', 
      icon: Box,
      topics: ['Dockerfile Multi-stage & Imagens Seguras', 'Docker Compose Multi-serviços', 'Kubernetes (Probes, HPA, ConfigMaps)', 'GitHub Actions CI/CD Pipelines', 'Deploy na AWS & RDS/SQS']
    },
    { 
      id: 'M15', 
      title: 'M15: Observabilidade & Produção', 
      description: 'Métricas, logs centralizados, tracing de requisições, concorrência no Java e JVM tuning.', 
      icon: Activity,
      topics: ['Logs Estruturados & Trace ID', 'Métricas com Prometheus & Grafana', 'OpenTelemetry Tracing', 'Virtual Threads & Concorrência Moderna', 'Análise de Thread/Heap Dump & JVM Tuning']
    },
    { 
      id: 'M16', 
      title: 'M16: Arquitetura & DDD', 
      description: 'Arquitetura Hexagonal, Clean Architecture, princípios DDD de modelagem de domínio e sistemas distribuídos.', 
      icon: Cpu,
      topics: ['Clean, Hexagonal & Camadas', 'Monólitos Modulares', 'Domain-Driven Design (DDD)', 'CQRS & Event Sourcing', 'Desenho de Sistemas Distribuídos & CAP']
    },
    { 
      id: 'M17', 
      title: 'M17: Projeto Final & Carreira', 
      description: 'Desenvolvimento do projeto final da formação, defesa técnica, portfólio profissional e preparação de entrevistas.', 
      icon: UserCheck,
      topics: ['Desenvolvimento do Projeto Final', 'Modelagem DDD & Banco de Dados', 'Banca Técnica com Engenheiros', 'Preparação para Entrevistas Java/Spring', 'LinkedIn, Currículo & Portfólio']
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
        <p className="welcome-subtitle">Uma jornada profunda do zero ao nível de Engenheiro e Arquiteto de Sistemas</p>
        
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
            const stats = moduleStats[mod.id] || { total: 0, completed: 0 };
            const isModuleCompleted = stats.total > 0 && stats.completed === stats.total;
            
            let badgeText = 'Em Breve';
            let badgeClass = 'coming-soon';
            
            if (stats.total > 0) {
              if (isModuleCompleted) {
                badgeText = 'Concluído';
                badgeClass = 'completed';
              } else if (stats.completed > 0) {
                badgeText = `${stats.completed}/${stats.total} Aulas`;
                badgeClass = 'in-progress';
              } else {
                badgeText = `${stats.total} Aulas`;
                badgeClass = 'new';
              }
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

// Simple custom replacement for lucide Code icon if import issues arise
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
