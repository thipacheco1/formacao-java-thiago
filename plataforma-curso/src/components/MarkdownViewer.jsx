import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckCircle2, Circle, Copy, Check, Volume2, Play, Pause, Square, ChevronRight, ChevronLeft, Clock, BookOpen } from 'lucide-react';

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

// Translates technical code structures into readable Portuguese explanations for TTS
const cleanCodeForSpeech = (codeLines, lang) => {
  if (codeLines.length === 0) return "";

  // For plain text blocks, read them verbatim line by line
  if (lang === 'text' || lang === 'plaintext' || lang === 'txt' || !lang) {
    return codeLines.join('. ') + '.';
  }
  
  const cleanLines = [];
  
  for (let line of codeLines) {
    let cleanLine = line.trim();
    
    // Skip empty or simple bracket lines
    if (!cleanLine || cleanLine === '{' || cleanLine === '}' || cleanLine === '(' || cleanLine === ')') {
      continue;
    }
    
    // Ignore imports/package statements
    if (cleanLine.startsWith('import ') || cleanLine.startsWith('package ')) {
      continue;
    }
    
    // Clean up typical programming syntax to read naturally
    cleanLine = cleanLine
      .replace(/[{};()]/g, ' ')                                  // Omit braces, semicolons, parentheses
      .replace(/\/\//g, 'Comentário: ')                          // Read double slash comments
      .replace(/\/\*.*?\*\//g, '')                               // Remove multiline comments
      .replace(/==/g, ' igual a ')
      .replace(/!=/g, ' diferente de ')
      .replace(/&&/g, ' e ')
      .replace(/\|\|/g, ' ou ')
      .replace(/<=/g, ' menor ou igual a ')
      .replace(/>=/g, ' maior ou igual a ')
      .replace(/\bSystem\.out\.println\b/gi, 'escrever na tela') // Convert java print to natural statement
      .replace(/\bpublic class\b/gi, 'classe pública')
      .replace(/\bpublic static void main\b/gi, 'método principal main')
      .replace(/\bprivate\b/gi, 'privado')
      .replace(/\bpublic\b/gi, 'público')
      .replace(/\bvoid\b/gi, 'sem retorno void')
      .replace(/\bString\[\] args\b/gi, 'argumentos')
      .replace(/\s+/g, ' ');                                     // Collapse spaces

    if (cleanLine.trim()) {
      cleanLines.push(cleanLine.trim());
    }
  }

  if (cleanLines.length === 0) return "";
  
  // Format based on type
  if (lang === 'powershell' || lang === 'bash' || lang === 'cmd' || lang === 'shell') {
    return `Executar comando: ${cleanLines.join('. ')}.`;
  }
  
  return `Trecho de código ${lang}: ${cleanLines.join('. ')}.`;
};

// Helper function to split text into short natural chunks (around 150-200 chars)
const chunkTextForSpeech = (text) => {
  if (!text) return [];
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
  const chunks = [];
  let currentChunk = "";
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    if (sentence.length > 200) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      const subParts = sentence.split(/[,;]/);
      for (let part of subParts) {
        if ((currentChunk + part).length > 200) {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = part;
        } else {
          currentChunk += (currentChunk ? ", " : "") + part;
        }
      }
    } else if ((currentChunk + sentence).length > 200) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks.filter(c => c.length > 0);
};

const DynamicTTSPlayer = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0); // Speech speed
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  
  // Refs to manage speaking queue without stale React state
  const chunksRef = useRef([]);
  const currentChunkIdxRef = useRef(0);
  const isPlayingRef = useRef(false);
  const rateRef = useRef(1.0);
  const selectedVoiceNameRef = useRef('');
  const isChangingSettingsRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { rateRef.current = rate; }, [rate]);
  useEffect(() => { selectedVoiceNameRef.current = selectedVoiceName; }, [selectedVoiceName]);

  const updateVoices = () => {
    if (!synthRef.current) return;
    const allVoices = synthRef.current.getVoices();
    const ptVoices = allVoices.filter(v => v.lang.toLowerCase().startsWith('pt'));
    setVoices(ptVoices);
    
    if (ptVoices.length > 0 && !selectedVoiceNameRef.current) {
      const bestVoice = ptVoices.find(v => 
        v.name.toLowerCase().includes('google') || 
        v.name.toLowerCase().includes('online') || 
        v.name.toLowerCase().includes('natural')
      ) || ptVoices[0];
      setSelectedVoiceName(bestVoice.name);
    }
  };

  useEffect(() => {
    updateVoices();
    if (synthRef.current) {
      synthRef.current.onvoiceschanged = updateVoices;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [text]); // Re-init when text changes (new topic step)

  const speakCurrentChunk = () => {
    if (!synthRef.current || chunksRef.current.length === 0) return;

    const idx = currentChunkIdxRef.current;
    if (idx >= chunksRef.current.length) {
      // Clear last highlight
      const prevActive = document.querySelector('.speaking-highlight');
      if (prevActive) prevActive.classList.remove('speaking-highlight');

      setIsPlaying(false);
      setIsPaused(false);
      return;
    }

    const { element, text: chunk } = chunksRef.current[idx];

    // Manage DOM highlighting and scrolling
    if (element) {
      // Clear previous highlight
      const prevActive = document.querySelector('.speaking-highlight');
      if (prevActive && prevActive !== element) {
        prevActive.classList.remove('speaking-highlight');
      }

      // Add current highlight
      element.classList.add('speaking-highlight');

      // Scroll element to center of container smoothly
      const scrollContainer = document.querySelector('.content-scroll-area');
      if (scrollContainer) {
        const containerHeight = scrollContainer.clientHeight;
        const elementTop = element.offsetTop;
        const elementHeight = element.clientHeight;
        
        const targetScroll = elementTop - (containerHeight / 2) + (elementHeight / 2);
        
        scrollContainer.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
      }
    }

    const utterance = new SpeechSynthesisUtterance(chunk);
    
    const activeVoice = voices.find(v => v.name === selectedVoiceNameRef.current);
    if (activeVoice) {
      utterance.voice = activeVoice;
    }
    
    utterance.rate = rateRef.current;
    utterance.lang = activeVoice ? activeVoice.lang : 'pt-BR';

    utterance.onend = () => {
      if (isChangingSettingsRef.current) return;
      
      if (isPlayingRef.current) {
        currentChunkIdxRef.current += 1;
        speakCurrentChunk();
      }
    };

    utterance.onerror = (e) => {
      if (isChangingSettingsRef.current) return;
      
      if (e.error !== 'interrupted') {
        console.error("SpeechSynthesis utterance error:", e);
        handleStop();
      }
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const handlePlay = () => {
    if (!synthRef.current) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    synthRef.current.cancel();

    const speakableElements = Array.from(
      document.querySelectorAll(
        '.markdown-viewer h1, .markdown-viewer h2, .markdown-viewer h3, .markdown-viewer h4, .markdown-viewer p, .markdown-viewer li, .markdown-viewer pre'
      )
    ).filter(el => {
      if (el.tagName === 'P' && el.closest('li')) return false;
      return true;
    });

    const queue = [];
    for (let el of speakableElements) {
      let rawText = "";
      
      if (el.tagName === 'PRE') {
        const codeEl = el.querySelector('code');
        const codeText = codeEl ? codeEl.innerText : el.innerText;
        const className = codeEl ? codeEl.className : '';
        const match = /language-(\w+)/.exec(className);
        const lang = match ? match[1] : 'código';
        rawText = cleanCodeForSpeech(codeText.split('\n'), lang);
      } else {
        let textVal = el.innerText.trim();
        if (!textVal) continue;
        
        if (el.tagName.startsWith('H')) {
          rawText = `Tópico: ${textVal}.`;
        } else if (el.tagName === 'LI') {
          rawText = `Item: ${textVal}.`;
        } else {
          rawText = textVal;
        }
      }

      if (rawText) {
        const sentences = chunkTextForSpeech(rawText);
        for (let sentence of sentences) {
          queue.push({
            element: el,
            text: sentence
          });
        }
      }
    }

    chunksRef.current = queue;
    currentChunkIdxRef.current = 0;

    if (chunksRef.current.length > 0) {
      setIsPlaying(true);
      setIsPaused(false);
      setTimeout(() => {
        speakCurrentChunk();
      }, 50);
    }
  };

  const handlePause = () => {
    if (synthRef.current && isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      
      const prevActive = document.querySelector('.speaking-highlight');
      if (prevActive) prevActive.classList.remove('speaking-highlight');

      setIsPlaying(false);
      setIsPaused(false);
      currentChunkIdxRef.current = 0;
    }
  };

  const changeSettingsAndRestart = (newRate, newVoiceName) => {
    if (!synthRef.current) return;
    
    isChangingSettingsRef.current = true;
    synthRef.current.cancel();
    
    setTimeout(() => {
      isChangingSettingsRef.current = false;
      if (isPlayingRef.current || isPaused) {
        speakCurrentChunk();
      }
    }, 100);
  };

  const handleSpeedChange = (newRate) => {
    setRate(newRate);
    if (isPlaying || isPaused) {
      changeSettingsAndRestart(newRate, selectedVoiceName);
    }
  };

  const handleVoiceChange = (newVoiceName) => {
    setSelectedVoiceName(newVoiceName);
    if (isPlaying || isPaused) {
      changeSettingsAndRestart(rate, newVoiceName);
    }
  };

  const formatVoiceName = (name) => {
    let cleanName = name.replace('Microsoft ', '').replace(' Desktop', '');
    if (name.toLowerCase().includes('google') || name.toLowerCase().includes('online') || name.toLowerCase().includes('natural')) {
      return `${cleanName} (Natural/Online)`;
    }
    return cleanName;
  };

  return (
    <div className="custom-audio-player tts-player">
      <div className="audio-player-icon">
        <Volume2 size={24} />
      </div>
      <div className="audio-player-content">
        <h4 className="audio-title">Assistente de Voz (Leitura da Aula)</h4>
        <div className="audio-controls">
          {!isPlaying ? (
            <button onClick={handlePlay} className="play-pause-btn" title="Ouvir">
              <Play size={18} className="play-icon-fix" />
            </button>
          ) : (
            <button onClick={handlePause} className="play-pause-btn" title="Pausar">
              <Pause size={18} />
            </button>
          )}
          
          {(isPlaying || isPaused) && (
            <button onClick={handleStop} className="stop-btn" title="Parar">
              <Square size={16} />
            </button>
          )}

          {voices.length > 1 && (
            <div className="voice-control">
              <span className="control-label">Voz:</span>
              <select 
                value={selectedVoiceName} 
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="control-select"
              >
                {voices.map(v => (
                  <option key={v.name} value={v.name}>
                    {formatVoiceName(v.name)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="speed-control">
            <span className="control-label">Velocidade:</span>
            <select 
              value={rate} 
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="control-select"
            >
              <option value="0.8">0.8x</option>
              <option value="1.0">1.0x (Normal)</option>
              <option value="1.2">1.2x</option>
              <option value="1.5">1.5x</option>
              <option value="1.8">1.8x</option>
            </select>
          </div>
        </div>
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

const MarkdownViewer = ({ 
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
      
      let delay = 35; // default 1.0x
      if (scrollSpeed === 0.5) delay = 70;
      if (scrollSpeed === 1.5) delay = 22;
      if (scrollSpeed === 2.0) delay = 14;

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
                    <option value="0.5">0.5x</option>
                    <option value="1.0">1.0x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2.0">2.0x</option>
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
                  <option value="0.5">0.5x</option>
                  <option value="1.0">1.0x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2.0">2.0x</option>
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
                {/* Voice player reads entire lesson */}
                <DynamicTTSPlayer text={fullLessonText} />
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
                  {/* Voice player reads active section text */}
                  <DynamicTTSPlayer text={activeSection.content} />
                  
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

export default MarkdownViewer;
