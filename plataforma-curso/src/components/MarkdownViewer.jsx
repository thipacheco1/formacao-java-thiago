import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckCircle2, Copy, Check, Play, Pause, ChevronRight, ChevronLeft, Clock, BookOpen, ListChecks, Menu } from 'lucide-react';

const CodeBlockWithCopy = ({ match, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');
  const lang = match ? match[1] : 'code';

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-window">
      <div className="code-block-window-header">
        <div className="window-dots" aria-hidden="true">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot blue"></span>
        </div>
        <span className="window-title">{lang.toUpperCase()}</span>
        <button type="button" className="copy-button-window" onClick={handleCopy} title="Copiar código" aria-label="Copiar código">
          {copied ? <Check size={14} className="copy-icon-success" /> : <Copy size={14} className="copy-icon" />}
        </button>
      </div>
      <div className="code-block-wrapper">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={lang}
          PreTag="div"
          className="code-block-highlighter"
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const getFenceMarker = (line) => {
  const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
  return marker || null;
};

const isFenceClosingLine = (line, character, minimumLength) => {
  const trimmed = line.trim();
  const marker = getFenceMarker(trimmed);

  return Boolean(
    marker
    && marker[0] === character
    && marker.length >= minimumLength
    && trimmed.slice(marker.length).trim() === ''
  );
};

// Split Markdown into sections by level-two headings, ignoring headings inside code fences.
const parseMarkdownIntoSections = (markdown) => {
  if (!markdown) return { mainTitle: '', sections: [] };

  const cleanMd = markdown.replace(/\r\n/g, '\n');
  const lines = cleanMd.split('\n');
  const sections = [];
  let mainTitle = 'Introdução';
  let foundMainTitle = false;
  let currentTitle = 'Introdução';
  let currentLines = [];
  let fenceCharacter = null;
  let fenceLength = 0;

  const shouldSkipSection = (title) => {
    const cleanTitle = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return cleanTitle.includes('cobertura da grade operacional')
      || cleanTitle.includes('progresso geral do curso');
  };

  const pushCurrentSection = () => {
    const content = currentLines.join('\n').trim();
    if ((currentTitle || content) && !shouldSkipSection(currentTitle)) {
      sections.push({ title: currentTitle, content });
    }
    currentLines = [];
  };

  for (const line of lines) {
    if (fenceCharacter) {
      if (isFenceClosingLine(line, fenceCharacter, fenceLength)) {
        fenceCharacter = null;
        fenceLength = 0;
      }
      currentLines.push(line);
      continue;
    }

    const marker = getFenceMarker(line);
    if (marker) {
      fenceCharacter = marker[0];
      fenceLength = marker.length;
      currentLines.push(line);
      continue;
    }

    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match && !foundMainTitle) {
      mainTitle = h1Match[1].trim();
      foundMainTitle = true;
      continue;
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      if (currentLines.some(currentLine => currentLine.trim())) {
        pushCurrentSection();
      }
      currentTitle = h2Match[1].trim();
      continue;
    }

    currentLines.push(line);
  }

  if (currentLines.some(line => line.trim())) {
    pushCurrentSection();
  }

  return { mainTitle, sections };
};

const isComplementHeading = (title) => {
  return /^(material complementar|complementos|registro r[aá]pido|perguntas? de revis[aã]o|perguntas?|simulado|gabarito|desafio extra|desafios? opcionais?|exerc[ií]cios complementares|checklist da aula|checkpoint final|crit[eé]rios? de aceite|crit[eé]rio de conclus[aã]o|anota[cç][oõ]es|relat[oó]rio|material de apoio)/i.test(title) ||
    /\b(simulado|gabarito|desafio extra|perguntas de revis[aã]o|registro r[aá]pido|material complementar)\b/i.test(title);
};

const isMainResumeHeading = (title) => {
  return /^(commit recomendado|fechamento|fechamento da aula|exerc[ií]cio pr[aá]tico principal|atividade guiada|m[aã]o na massa guiada|laborat[oó]rio guiado)/i.test(title);
};

const splitLessonContent = (rawMarkdown) => {
  const lines = rawMarkdown.split(/\r?\n/);
  const explicitIndex = lines.findIndex(line => /^#{1,2}\s+Material complementar\s*$/i.test(line.trim()));

  if (explicitIndex !== -1) {
    return {
      main: lines.slice(0, explicitIndex).join('\n').trim(),
      complement: lines.slice(explicitIndex + 1).join('\n').trim()
    };
  }

  const main = [];
  const complement = [];
  let target = 'main';
  let complementLevel = Number.POSITIVE_INFINITY;
  let fenceCharacter = null;
  let fenceLength = 0;

  for (const line of lines) {
    if (fenceCharacter) {
      (target === 'complement' ? complement : main).push(line);
      if (isFenceClosingLine(line, fenceCharacter, fenceLength)) {
        fenceCharacter = null;
        fenceLength = 0;
      }
      continue;
    }

    const marker = getFenceMarker(line);
    if (marker) {
      fenceCharacter = marker[0];
      fenceLength = marker.length;
      (target === 'complement' ? complement : main).push(line);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const title = heading[2].trim();

      if (isComplementHeading(title)) {
        target = 'complement';
        complementLevel = level;
      } else if (isMainResumeHeading(title) || (target === 'complement' && level <= complementLevel)) {
        target = 'main';
        complementLevel = Number.POSITIVE_INFINITY;
      }
    }

    (target === 'complement' ? complement : main).push(line);
  }

  return {
    main: main.join('\n').trim(),
    complement: complement.join('\n').trim()
  };
};

const getSectionId = (title = 'topico', index = 0) => {
  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72);

  return `topico-${index + 1}-${slug || 'conteudo'}`;
};

const getLessonIdentity = (lesson) => {
  const title = lesson?.title || '';
  const sequence = title.match(/^(\d{3})_/)?.[1] || '000';
  const moduleMatch = title.match(/^\d{3}_(M\d+)_([0-9]+)_/i);

  if (!moduleMatch) {
    return { sequence, module: 'Abertura', lessonNumber: 'Boas-vindas' };
  }

  return {
    sequence,
    module: `Módulo ${moduleMatch[1].replace(/M/i, '')}`,
    lessonNumber: `Aula ${moduleMatch[2]}`
  };
};

const markdownRenderers = {
  pre({ node: _node, children, ...props }) {
    const childElements = React.Children.toArray(children);
    const codeElement = childElements.find(child => React.isValidElement(child));

    if (codeElement) {
      const className = codeElement.props.className || '';
      const match = /language-(\w+)/.exec(className);
      return (
        <CodeBlockWithCopy match={match} {...props}>
          {codeElement.props.children}
        </CodeBlockWithCopy>
      );
    }

    return <pre {...props}>{children}</pre>;
  },
  code({ node: _node, className, children, ...props }) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  table({ node: _node, children, ...props }) {
    return (
      <div className="markdown-table-scroll" role="region" aria-label="Tabela com rolagem horizontal" tabIndex={0}>
        <table {...props}>{children}</table>
      </div>
    );
  }
};

const MarkdownSections = ({ sections }) => (
  <>
    {sections.map((sec, idx) => (
      <section
        id={getSectionId(sec.title, idx)}
        key={`${sec.title}-${idx}`}
        className="continuous-section-wrapper"
      >
        {sec.title && sec.title !== 'Introdução' && <h2 className="section-step-title">{sec.title}</h2>}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownRenderers}
        >
          {sec.content}
        </ReactMarkdown>
      </section>
    ))}
  </>
);

const LegacyMarkdownViewer = ({ 
  lesson, 
  isCompleted, 
  onToggleCompleted,
  onNextLesson,
  onPrevLesson,
  hasNextLesson,
  hasPrevLesson
}) => {
  const [parsedData, setParsedData] = useState({ mainTitle: '', sections: [] });
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isContinuousMode, setIsContinuousMode] = useState(() => {
    const saved = localStorage.getItem('isContinuousMode');
    return saved ? JSON.parse(saved) : true;
  });
  
  // Auto-scroll and Sticky Header states
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1.0);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const scrollIntervalRef = useRef(null);

  const toggleViewMode = (mode) => {
    setIsContinuousMode(mode);
    localStorage.setItem('isContinuousMode', JSON.stringify(mode));
  };

  // Listen to scroll to toggle sticky thin header
  useEffect(() => {
    const scrollContainer = document.querySelector('.content-scroll-area');
    if (!scrollContainer) return;
    
    const handleScroll = () => {
      if (scrollContainer.scrollTop > 180) {
        setShowStickyHeader(true);
      } else {
        setShowStickyHeader(false);
      }
    };
    
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Manage Auto-scroll speed and interval
  useEffect(() => {
    if (isAutoScrolling) {
      const scrollContainer = document.querySelector('.content-scroll-area');
      if (!scrollContainer) return;
      
      const delay = Math.round(35 / (scrollSpeed || 1.0));

      scrollIntervalRef.current = setInterval(() => {
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        if (scrollContainer.scrollTop >= maxScroll - 2) {
          setIsAutoScrolling(false);
        } else {
          scrollContainer.scrollTop += 1;
        }
      }, delay);
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    }
    
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isAutoScrolling, scrollSpeed]);

  // Toggle .autoscrolling-active class on scroll container when auto scroll changes
  useEffect(() => {
    const scrollContainer = document.querySelector('.content-scroll-area');
    if (!scrollContainer) return;
    if (isAutoScrolling) {
      scrollContainer.classList.add('autoscrolling-active');
    } else {
      scrollContainer.classList.remove('autoscrolling-active');
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.classList.remove('autoscrolling-active');
      }
    };
  }, [isAutoScrolling]);

  // Reset scroll to top when content loads and renders (bypasses mobile scroll anchoring)
  useEffect(() => {
    if (!loading && parsedData.mainTitle) {
      const handleScrollReset = () => {
        const scrollContainer = document.querySelector('.content-scroll-area');
        if (scrollContainer) {
          scrollContainer.scrollTop = 0;
        }
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      };

      handleScrollReset();
      
      // Run again shortly after to ensure layout reflow and scroll-anchoring are bypassed
      const timer = setTimeout(handleScrollReset, 60);
      return () => clearTimeout(timer);
    }
  }, [loading, parsedData]);

  useEffect(() => {
    if (lesson) {
      setLoading(true);
      setCurrentSectionIdx(0);
      setIsAutoScrolling(false); // Reset auto scroll on lesson change
      
      // Reset scroll position to top when lesson changes
      const scrollContainer = document.querySelector('.content-scroll-area');
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }

      lesson.loadContent().then((text) => {
        const parsed = parseMarkdownIntoSections(text);
        setParsedData(parsed);
        setLoading(false);
      }).catch(err => {
        console.error("Failed to load lesson content", err);
        setParsedData({ mainTitle: 'Erro', sections: [{ title: 'Erro', content: '### Erro ao carregar o conteúdo.' }] });
        setLoading(false);
      });
    } else {
      setParsedData({ mainTitle: '', sections: [] });
    }
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📚</div>
        <h2>Selecione uma aula</h2>
        <p>Escolha um tópico no menu lateral para começar a estudar.</p>
      </div>
    );
  }

  const { mainTitle, sections } = parsedData;
  const activeSection = sections[currentSectionIdx];

  // Calculate estimated reading time (approx. 180 words per minute)
  const getReadingTime = (text) => {
    if (!text) return 1;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 180));
  };

  const handleNextSection = () => {
    if (currentSectionIdx < sections.length - 1) {
      setCurrentSectionIdx(prev => prev + 1);
      // Scroll content area back to top
      const scrollContainer = document.querySelector('.content-scroll-area');
      if (scrollContainer) scrollContainer.scrollTop = 0;
    } else {
      // Completed last step -> Mark lesson as complete
      if (!isCompleted) {
        onToggleCompleted();
      }
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIdx > 0) {
      setCurrentSectionIdx(prev => prev - 1);
      const scrollContainer = document.querySelector('.content-scroll-area');
      if (scrollContainer) scrollContainer.scrollTop = 0;
    }
  };

  const fullLessonText = sections.map(s => s.content).join('\n');

  return (
    <div className="markdown-viewer-container">
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Carregando aula...</p>
        </div>
      ) : (
        <>
          {/* Sticky Thin Header */}
          {showStickyHeader && (
            <div className="sticky-lesson-header">
              <div className="sticky-header-left">
                <span className="sticky-lesson-title">{mainTitle}</span>
                {sections.length > 1 && !isContinuousMode && (
                  <span className="sticky-lesson-step">Tópico {currentSectionIdx + 1}/{sections.length}</span>
                )}
              </div>
              
              <div className="sticky-header-right">
                {/* Auto Scroll Widget */}
                <div className="auto-scroll-widget">
                  <span className="widget-label">Rolagem Auto</span>
                  <button 
                    className={`auto-scroll-play-btn ${isAutoScrolling ? 'active' : ''}`}
                    onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                    title={isAutoScrolling ? 'Pausar rolagem' : 'Iniciar rolagem'}
                  >
                    {isAutoScrolling ? <Pause size={12} /> : <Play size={12} className="play-icon-fix" />}
                  </button>
                  <select
                    value={scrollSpeed}
                    onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
                    className="auto-scroll-speed-select"
                  >
                    <option value={0.2}>0.2x</option>
                    <option value={0.3}>0.3x</option>
                    <option value={0.4}>0.4x</option>
                    <option value={0.5}>0.5x</option>
                    <option value={0.6}>0.6x</option>
                    <option value={0.8}>0.8x</option>
                    <option value={1.0}>1.0x</option>
                    <option value={1.2}>1.2x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2.0}>2.0x</option>
                  </select>
                </div>

                <div className={`sticky-status-badge ${isCompleted ? 'completed' : ''}`}>
                  {isCompleted ? 'Concluída' : 'Lendo'}
                </div>
              </div>
            </div>
          )}

          {/* Header Dashboard */}
          <header className="lesson-dashboard">
            <h1 className="lesson-main-title">{mainTitle}</h1>
            <div className="lesson-meta-bar">
              {isContinuousMode ? (
                <div className="meta-item">
                  <BookOpen size={16} />
                  <span>Aula Completa ({sections.length} tópicos)</span>
                </div>
              ) : (
                <div className="meta-item">
                  <BookOpen size={16} />
                  <span>Tópico {currentSectionIdx + 1} de {sections.length}</span>
                </div>
              )}
              
              <div className="meta-item">
                <Clock size={16} />
                <span>
                  Leitura: ~{isContinuousMode 
                    ? getReadingTime(fullLessonText) 
                    : getReadingTime(activeSection?.content)} min
                </span>
              </div>
              
              <div className={`meta-status-badge ${isCompleted ? 'completed' : ''}`}>
                {isCompleted ? 'Concluída' : 'Em Andamento'}
              </div>

              {/* Auto Scroll Widget */}
              <div className="auto-scroll-widget">
                <span className="widget-label">Rolagem Auto</span>
                <button 
                  className={`auto-scroll-play-btn ${isAutoScrolling ? 'active' : ''}`}
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                  title={isAutoScrolling ? 'Pausar rolagem' : 'Iniciar rolagem'}
                >
                  {isAutoScrolling ? <Pause size={12} /> : <Play size={12} className="play-icon-fix" />}
                </button>
                <select
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
                  className="auto-scroll-speed-select"
                >
                  <option value={0.2}>0.2x</option>
                  <option value={0.3}>0.3x</option>
                  <option value={0.4}>0.4x</option>
                  <option value={0.5}>0.5x</option>
                  <option value={0.6}>0.6x</option>
                  <option value={0.8}>0.8x</option>
                  <option value={1.0}>1.0x</option>
                  <option value={1.2}>1.2x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2.0}>2.0x</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="view-mode-toggle">
                <button 
                  className={`view-mode-btn ${isContinuousMode ? 'active' : ''}`}
                  onClick={() => toggleViewMode(true)}
                  title="Ler a aula inteira em uma única página"
                >
                  Página Única
                </button>
                <button 
                  className={`view-mode-btn ${!isContinuousMode ? 'active' : ''}`}
                  onClick={() => toggleViewMode(false)}
                  title="Dividir a aula por tópicos navegáveis"
                >
                  Tópicos
                </button>
              </div>
            </div>
            
            {/* Step Tabs / Timeline (Only in Topic Mode) */}
            {!isContinuousMode && (
              <div className="topic-tabs">
                {sections.map((sec, idx) => (
                  <button
                    key={idx}
                    className={`topic-tab-btn ${currentSectionIdx === idx ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentSectionIdx(idx);
                      const scrollContainer = document.querySelector('.content-scroll-area');
                      if (scrollContainer) scrollContainer.scrollTop = 0;
                    }}
                  >
                    <span className="tab-number">{idx + 1}</span>
                    <span className="tab-text">{sec.title}</span>
                  </button>
                ))}
              </div>
            )}
          </header>

          <div className="markdown-viewer">
            {isContinuousMode ? (
              <>
                {sections.map((sec, idx) => (
                  <div key={idx} className="continuous-section-wrapper">
                    {idx > 0 && sec.title && <h2 className="section-step-title">{sec.title}</h2>}
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node: _node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <CodeBlockWithCopy match={match} {...props}>{children}</CodeBlockWithCopy>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {sec.content}
                    </ReactMarkdown>
                  </div>
                ))}
              </>
            ) : (
              activeSection && (
                <>
                  {/* Section Title as a H2 */}
                  {currentSectionIdx > 0 && <h2 className="section-step-title">{activeSection.title}</h2>}
                  
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node: _node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <CodeBlockWithCopy match={match} {...props}>{children}</CodeBlockWithCopy>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {activeSection.content}
                  </ReactMarkdown>
                </>
              )
            )}
          </div>
          
          {/* Footer Navigation */}
          {isContinuousMode ? (
            <div className="lesson-footer-nav">
              <button
                onClick={onPrevLesson}
                disabled={!hasPrevLesson}
                className="nav-step-btn prev"
                title="Aula Anterior"
              >
                <ChevronLeft size={18} />
                <span>Aula Anterior</span>
              </button>

              <button
                onClick={onToggleCompleted}
                className="nav-step-btn next finish"
                style={{ minWidth: '180px', justifyContent: 'center' }}
              >
                {isCompleted ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={18} />
                    Aula Concluída
                  </span>
                ) : (
                  <span>Concluir Aula</span>
                )}
              </button>

              <button
                onClick={onNextLesson}
                disabled={!hasNextLesson}
                className="nav-step-btn next"
                title="Próxima Aula"
              >
                <span>Próxima Aula</span>
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div className="lesson-footer-nav">
              <button
                onClick={handlePrevSection}
                disabled={currentSectionIdx === 0}
                className="nav-step-btn prev"
              >
                <ChevronLeft size={18} />
                <span>Tópico Anterior</span>
              </button>

              <button
                onClick={handleNextSection}
                className={`nav-step-btn next ${currentSectionIdx === sections.length - 1 ? 'finish' : ''}`}
              >
                <span>
                  {currentSectionIdx === sections.length - 1 
                    ? (isCompleted ? 'Aula Concluída' : 'Concluir Aula') 
                    : 'Próximo Tópico'}
                </span>
                {currentSectionIdx < sections.length - 1 && <ChevronRight size={18} />}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

void LegacyMarkdownViewer;

const MarkdownViewerV2 = ({
  lesson,
  isCompleted,
  onToggleCompleted,
  onNextLesson,
  onPrevLesson,
  hasNextLesson,
  hasPrevLesson,
  isNavigationOverlayOpen = false,
  onOpenNavigation
}) => {
  const [parsedData, setParsedData] = useState({ mainTitle: '', sections: [] });
  const [complementData, setComplementData] = useState({ mainTitle: 'Material complementar', sections: [] });
  const [hasComplement, setHasComplement] = useState(false);
  const [activeContentTab, setActiveContentTab] = useState('lesson');
  const [loading, setLoading] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1.0);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const scrollIntervalRef = useRef(null);

  const resetContentScroll = () => {
    const scrollContainer = document.querySelector('.content-scroll-area');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  };

  const changeContentTab = (tab) => {
    setActiveContentTab(tab);
    setIsAutoScrolling(false);
    setTimeout(resetContentScroll, 0);
  };

  const scrollToSection = (section, index) => {
    const scrollContainer = document.querySelector('.content-scroll-area');
    const target = document.getElementById(getSectionId(section.title, index));
    if (!scrollContainer || !target) return;

    const targetTop = target.getBoundingClientRect().top
      - scrollContainer.getBoundingClientRect().top
      + scrollContainer.scrollTop
      - 24;

    scrollContainer.scrollTo({ top: targetTop, behavior: 'smooth' });
  };

  useEffect(() => {
    const scrollContainer = document.querySelector('.content-scroll-area');
    if (!scrollContainer) return undefined;

    const handleScroll = () => {
      const pageScrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const containerScrollTop = scrollContainer.scrollTop || 0;
      setShowStickyHeader(Math.max(pageScrollTop, containerScrollTop) > 180);

      const maxScroll = Math.max(1, scrollContainer.scrollHeight - scrollContainer.clientHeight);
      setReadingProgress(Math.min(100, Math.max(0, (containerScrollTop / maxScroll) * 100)));
    };

    handleScroll();
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isAutoScrolling) {
      const scrollContainer = document.querySelector('.content-scroll-area');
      if (!scrollContainer) return undefined;

      const delay = Math.round(35 / (scrollSpeed || 1.0));
      scrollIntervalRef.current = setInterval(() => {
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        if (scrollContainer.scrollTop >= maxScroll - 2) {
          setIsAutoScrolling(false);
        } else {
          scrollContainer.scrollTop += 1;
        }
      }, delay);
    } else if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isAutoScrolling, scrollSpeed]);

  useEffect(() => {
    const scrollContainer = document.querySelector('.content-scroll-area');
    if (!scrollContainer) return undefined;

    if (isAutoScrolling) {
      scrollContainer.classList.add('autoscrolling-active');
    } else {
      scrollContainer.classList.remove('autoscrolling-active');
    }

    return () => {
      scrollContainer.classList.remove('autoscrolling-active');
    };
  }, [isAutoScrolling]);

  useEffect(() => {
    if (isNavigationOverlayOpen) {
      setIsAutoScrolling(false);
    }
  }, [isNavigationOverlayOpen]);

  useEffect(() => {
    if (!loading && parsedData.mainTitle) {
      resetContentScroll();
      const timer = setTimeout(resetContentScroll, 60);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [loading, parsedData.mainTitle, activeContentTab]);

  useEffect(() => {
    if (!lesson) {
      setParsedData({ mainTitle: '', sections: [] });
      setComplementData({ mainTitle: 'Material complementar', sections: [] });
      setHasComplement(false);
      return;
    }

    setLoading(true);
    setActiveContentTab('lesson');
    setIsAutoScrolling(false);
    resetContentScroll();

    lesson.loadContent().then((text) => {
      const split = splitLessonContent(text);
      const complementMarkdown = split.complement.trim();

      setParsedData(parseMarkdownIntoSections(split.main || text));
      setHasComplement(Boolean(complementMarkdown));
      setComplementData(
        complementMarkdown
          ? parseMarkdownIntoSections(`# Material complementar\n\n${complementMarkdown}`)
          : { mainTitle: 'Material complementar', sections: [] }
      );
      setLoading(false);
    }).catch((err) => {
      console.error("Failed to load lesson content", err);
      setParsedData({ mainTitle: 'Erro', sections: [{ title: 'Erro', content: '### Erro ao carregar o conteúdo.' }] });
      setComplementData({ mainTitle: 'Material complementar', sections: [] });
      setHasComplement(false);
      setLoading(false);
    });
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📚</div>
        <h2>Selecione uma aula</h2>
        <p>Escolha um tópico no menu lateral para começar a estudar.</p>
      </div>
    );
  }

  const { mainTitle, sections } = parsedData;
  const activeSections = activeContentTab === 'complement' ? complementData.sections : sections;
  const activeText = activeSections.map(section => section.content).join('\n');

  const getReadingTime = (text) => {
    if (!text) return 1;
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 180));
  };

  const activeTitle = activeContentTab === 'lesson'
    ? mainTitle
    : `${mainTitle} - Material complementar`;

  const metaLabel = activeContentTab === 'lesson'
    ? `Aula (${sections.length} tópicos)`
    : (hasComplement ? `Complementar (${complementData.sections.length} tópicos)` : 'Complementar vazio');
  const lessonIdentity = getLessonIdentity(lesson);

  return (
    <div className="markdown-viewer-container">
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Carregando aula...</p>
        </div>
      ) : (
        <>
          {(showStickyHeader || isAutoScrolling) && !isNavigationOverlayOpen && (
            <div className="sticky-lesson-header">
              <button
                type="button"
                className="sticky-mobile-menu"
                onClick={onOpenNavigation}
                aria-label="Abrir menu de aulas"
                title="Abrir menu de aulas"
              >
                <Menu size={19} />
              </button>
              <div className="sticky-header-left">
                <span className="sticky-lesson-title">{activeTitle}</span>
                <span className="sticky-lesson-step">{metaLabel}</span>
              </div>

              <div className="sticky-header-right">
                <div className="auto-scroll-widget">
                  <span className="widget-label">Rolagem automática</span>
                  <button
                    className={`auto-scroll-play-btn ${isAutoScrolling ? 'active' : ''}`}
                    onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                    title={isAutoScrolling ? 'Pausar rolagem' : 'Iniciar rolagem'}
                    aria-label={isAutoScrolling ? 'Pausar rolagem automática' : 'Iniciar rolagem automática'}
                    aria-pressed={isAutoScrolling}
                  >
                    {isAutoScrolling ? <Pause size={12} /> : <Play size={12} className="play-icon-fix" />}
                  </button>
                  <select
                    value={scrollSpeed}
                    onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
                    className="auto-scroll-speed-select"
                    aria-label="Velocidade da rolagem automática"
                  >
                    <option value={0.2}>0.2x</option>
                    <option value={0.3}>0.3x</option>
                    <option value={0.4}>0.4x</option>
                    <option value={0.5}>0.5x</option>
                    <option value={0.6}>0.6x</option>
                    <option value={0.8}>0.8x</option>
                    <option value={1.0}>1.0x</option>
                    <option value={1.2}>1.2x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2.0}>2.0x</option>
                  </select>
                </div>

                <div className={`sticky-status-badge ${isCompleted ? 'completed' : ''}`}>
                  {isCompleted ? 'Concluída' : 'Lendo'}
                </div>
              </div>
              <div className="sticky-reading-progress" aria-hidden="true">
                <span style={{ width: `${readingProgress}%` }} />
              </div>
            </div>
          )}

          <article className="lesson-reading-surface">
            <header className="lesson-dashboard">
              <div className="lesson-title-block">
                <div className="lesson-eyebrow">
                  <span className="lesson-sequence">{lessonIdentity.sequence}</span>
                  <span>{lessonIdentity.module}</span>
                  <span aria-hidden="true">•</span>
                  <span>{lessonIdentity.lessonNumber}</span>
                </div>
                <h1 className="lesson-main-title">{mainTitle}</h1>
              </div>

              <div className="lesson-meta-bar">
                <div className="lesson-meta-summary">
                  <div className="meta-item">
                    <BookOpen size={16} />
                    <span>{activeSections.length} tópicos</span>
                  </div>

                  <div className="meta-item">
                    <Clock size={16} />
                    <span>~{getReadingTime(activeText)} min de leitura</span>
                  </div>

                  <div className={`meta-status-badge ${isCompleted ? 'completed' : ''}`}>
                    {isCompleted ? 'Concluída' : 'Em andamento'}
                  </div>
                </div>

                <div className="lesson-reader-tools">
                  <div className="auto-scroll-widget">
                    <span className="widget-label">Rolagem automática</span>
                    <button
                      className={`auto-scroll-play-btn ${isAutoScrolling ? 'active' : ''}`}
                      onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                      title={isAutoScrolling ? 'Pausar rolagem' : 'Iniciar rolagem'}
                      aria-label={isAutoScrolling ? 'Pausar rolagem automática' : 'Iniciar rolagem automática'}
                      aria-pressed={isAutoScrolling}
                    >
                      {isAutoScrolling ? <Pause size={12} /> : <Play size={12} className="play-icon-fix" />}
                    </button>
                    <select
                      value={scrollSpeed}
                      onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
                      className="auto-scroll-speed-select"
                      aria-label="Velocidade da rolagem automática"
                    >
                      <option value={0.2}>0.2x</option>
                      <option value={0.3}>0.3x</option>
                      <option value={0.4}>0.4x</option>
                      <option value={0.5}>0.5x</option>
                      <option value={0.6}>0.6x</option>
                      <option value={0.8}>0.8x</option>
                      <option value={1.0}>1.0x</option>
                      <option value={1.2}>1.2x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2.0}>2.0x</option>
                    </select>
                  </div>

                  <div className="view-mode-toggle" role="tablist" aria-label="Conteúdo da aula">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeContentTab === 'lesson'}
                      className={`view-mode-btn ${activeContentTab === 'lesson' ? 'active' : ''}`}
                      onClick={() => changeContentTab('lesson')}
                      title="Ver apenas a aula principal"
                    >
                      <BookOpen size={13} />
                      <span>Aula</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeContentTab === 'complement'}
                      className={`view-mode-btn ${activeContentTab === 'complement' ? 'active' : ''}`}
                      onClick={() => changeContentTab('complement')}
                      title="Ver checklists, simulados, gabaritos e materiais de apoio"
                    >
                      <ListChecks size={13} />
                      <span>Complementar</span>
                    </button>
                  </div>
                </div>
              </div>

              {activeSections.length > 1 && (
                <details className="lesson-outline">
                  <summary>
                    <span><ListChecks size={17} /> Sumário da aula</span>
                    <span>{activeSections.length} tópicos <ChevronRight size={16} /></span>
                  </summary>
                  <ol>
                    {activeSections.map((section, index) => (
                      <li key={`${section.title}-${index}`}>
                        <a
                          href={`#${getSectionId(section.title, index)}`}
                          onClick={(event) => {
                            event.preventDefault();
                            scrollToSection(section, index);
                          }}
                        >
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          {section.title || `Tópico ${index + 1}`}
                        </a>
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </header>

            <div className="markdown-viewer">
              {activeContentTab === 'lesson' && <MarkdownSections sections={sections} />}

              {activeContentTab === 'complement' && (
                hasComplement ? (
                  <MarkdownSections sections={complementData.sections} />
                ) : (
                  <div className="lesson-empty-panel">
                    <ListChecks size={34} />
                    <h3>Nenhum material complementar separado nesta aula</h3>
                    <p>Quando houver checklist, simulado, gabarito, perguntas, anotações ou desafios extras, eles aparecerão aqui sem interromper a aula principal.</p>
                  </div>
                )
              )}
            </div>
          </article>

          <nav className="lesson-footer-nav" aria-label="Navegação entre aulas">
            <button
              type="button"
              onClick={onPrevLesson}
              disabled={!hasPrevLesson}
              className="nav-step-btn prev"
              title="Aula Anterior"
            >
              <ChevronLeft size={18} />
              <span>Aula Anterior</span>
            </button>

            <button
              type="button"
              onClick={onToggleCompleted}
              className={`nav-step-btn lesson-complete-btn ${isCompleted ? 'is-completed' : ''}`}
              aria-pressed={isCompleted}
            >
              {isCompleted ? (
                <span className="complete-button-label">
                  <CheckCircle2 size={18} />
                  Aula Concluída
                </span>
              ) : (
                <span>Concluir Aula</span>
              )}
            </button>

            <button
              type="button"
              onClick={onNextLesson}
              disabled={!hasNextLesson}
              className="nav-step-btn next"
              title="Próxima Aula"
            >
              <span>Próxima Aula</span>
              <ChevronRight size={18} />
            </button>
          </nav>
        </>
      )}
    </div>
  );
};

export default MarkdownViewerV2;
