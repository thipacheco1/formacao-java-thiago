import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckCircle2, Copy, Check, Play, Pause, ChevronRight, ChevronLeft, Clock, BookOpen, ListChecks } from 'lucide-react';

const CodeBlockWithCopy = ({ match, className, children, ...props }) => {
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
        <div className="window-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <span className="window-title">{lang.toUpperCase()}</span>
        <button className="copy-button-window" onClick={handleCopy} title="Copiar código">
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

// Split Markdown into Sections by '##' headers
const parseMarkdownIntoSections = (markdown) => {
  if (!markdown) return { mainTitle: '', sections: [] };

  const cleanMd = markdown.replace(/\r\n/g, '\n');
  const parts = ('\n' + cleanMd).split(/\n##\s+/);
  const sections = [];
  
  let intro = parts[0].trim();
  let mainTitle = "Introdução";
  
  const h1Match = intro.match(/^#\s+(.+)/m);
  if (h1Match) {
    mainTitle = h1Match[1];
    intro = intro.replace(/^#\s+.+$/m, '').trim();
  }
  
  if (intro.startsWith('\n')) intro = intro.substring(1);
  
  if (intro) {
    sections.push({
      title: "Introdução",
      content: intro
    });
  }
  
  for (let i = 1; i < parts.length; i++) {
    const lines = parts[i].split('\n');
    const title = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();
    if (title || content) {
      // Skip "Cobertura da Grade Operacional" and "Progresso Geral do Curso" topics
      const cleanTitle = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (
        cleanTitle.includes("cobertura da grade operacional") || 
        cleanTitle.includes("progresso geral do curso")
      ) {
        continue;
      }

      sections.push({
        title: title,
        content: content
      });
    }
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
  let inFence = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      (target === 'complement' ? complement : main).push(line);
      inFence = !inFence;
      continue;
    }

    if (!inFence) {
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
    }

    (target === 'complement' ? complement : main).push(line);
  }

  return {
    main: main.join('\n').trim(),
    complement: complement.join('\n').trim()
  };
};

const MarkdownSections = ({ sections }) => (
  <>
    {sections.map((sec, idx) => (
      <div key={`${sec.title}-${idx}`} className="continuous-section-wrapper">
        {idx > 0 && sec.title && <h2 className="section-step-title">{sec.title}</h2>}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <CodeBlockWithCopy match={match} className={className} {...props}>
                  {children}
                </CodeBlockWithCopy>
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
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <CodeBlockWithCopy match={match} className={className} children={children} {...props} />
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
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <CodeBlockWithCopy match={match} className={className} children={children} {...props} />
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
  hasPrevLesson
}) => {
  const [parsedData, setParsedData] = useState({ mainTitle: '', sections: [] });
  const [complementData, setComplementData] = useState({ mainTitle: 'Material complementar', sections: [] });
  const [hasComplement, setHasComplement] = useState(false);
  const [activeContentTab, setActiveContentTab] = useState('lesson');
  const [loading, setLoading] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1.0);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
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

  useEffect(() => {
    const scrollContainer = document.querySelector('.content-scroll-area');
    if (!scrollContainer) return;

    const handleScroll = () => {
      setShowStickyHeader(scrollContainer.scrollTop > 180);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
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

  return (
    <div className="markdown-viewer-container">
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Carregando aula...</p>
        </div>
      ) : (
        <>
          {showStickyHeader && (
            <div className="sticky-lesson-header">
              <div className="sticky-header-left">
                <span className="sticky-lesson-title">{activeTitle}</span>
                <span className="sticky-lesson-step">{metaLabel}</span>
              </div>

              <div className="sticky-header-right">
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

          <header className="lesson-dashboard">
            <h1 className="lesson-main-title">{mainTitle}</h1>
            <div className="lesson-meta-bar">
              <div className="meta-item">
                <BookOpen size={16} />
                <span>{metaLabel}</span>
              </div>

              <div className="meta-item">
                <Clock size={16} />
                <span>Leitura: ~{getReadingTime(activeText)} min</span>
              </div>

              <div className={`meta-status-badge ${isCompleted ? 'completed' : ''}`}>
                {isCompleted ? 'Concluída' : 'Em Andamento'}
              </div>

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

              <div className="view-mode-toggle">
                <button
                  className={`view-mode-btn ${activeContentTab === 'lesson' ? 'active' : ''}`}
                  onClick={() => changeContentTab('lesson')}
                  title="Ver apenas a aula principal"
                >
                  <BookOpen size={13} />
                  <span>Aula</span>
                </button>
                <button
                  className={`view-mode-btn ${activeContentTab === 'complement' ? 'active' : ''}`}
                  onClick={() => changeContentTab('complement')}
                  title="Ver checklists, simulados, gabaritos e materiais de apoio"
                >
                  <ListChecks size={13} />
                  <span>Complementar</span>
                </button>
              </div>
            </div>
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
        </>
      )}
    </div>
  );
};

export default MarkdownViewerV2;
