// State
let courseData = {
  introLines: [],
  modules: [],
  diaryStatus: {}
};

let activeLesson = null;
let activeModuleId = null;
let activeTab = 'reader';

// Explainer State
// No quiz state needed

// DOM Elements
const explainerCodeListEl = document.getElementById('explainer-code-list');
const explainerDetailEmptyEl = document.getElementById('explainer-detail-empty');
const explainerDetailContentEl = document.getElementById('explainer-detail-content');
const explainerLineTitleEl = document.getElementById('explainer-line-title');
const explainerLineCodeEl = document.getElementById('explainer-line-code');
const explainerLineDescEl = document.getElementById('explainer-line-desc');
const courseTreeEl = document.getElementById('course-tree');
const activeLessonTagEl = document.getElementById('active-lesson-tag');
const activeLessonTitleEl = document.getElementById('active-lesson-title');
const statusControlContainerEl = document.getElementById('status-control-container');
const lessonStatusSelectEl = document.getElementById('lesson-status-select');
const tabNavbarEl = document.getElementById('tab-navbar');
const tabContentEl = document.getElementById('tab-content');
const emptyStateEl = document.getElementById('empty-state');

const tabReaderPanel = document.getElementById('tab-reader');
const readerOutputEl = document.getElementById('reader-output');
const tabComplementPanel = document.getElementById('tab-complement');
const complementOutputEl = document.getElementById('complement-output');

const tabEditorPanel = document.getElementById('tab-editor');
const markdownInputEl = document.getElementById('markdown-input');
const previewOutputEl = document.getElementById('preview-output');
const saveLessonBtn = document.getElementById('save-lesson-btn');

const tabAnalyzerPanel = document.getElementById('tab-analyzer');
const analyzerWarningBadgeEl = document.getElementById('analyzer-warning-badge');

// Toast DOM Elements
const toastEl = document.getElementById('toast');
const toastIconEl = document.getElementById('toast-icon');
const toastMsgEl = document.getElementById('toast-msg');

// Helper button elements
const helperObjBtn = document.getElementById('helper-obj');
const helperCodeBtn = document.getElementById('helper-code');
const helperLearningBtn = document.getElementById('helper-learning');
const helperWarningBtn = document.getElementById('helper-warning');

// Stats Elements
const valWordsEl = document.getElementById('val-words');
const valTimeEl = document.getElementById('val-time');
const valCodeEl = document.getElementById('val-code');
const fillParagraphsEl = document.getElementById('fill-paragraphs');
const numParagraphsEl = document.getElementById('num-paragraphs');
const fillListsEl = document.getElementById('fill-lists');
const numListsEl = document.getElementById('num-lists');
const gaugeFillEl = document.getElementById('gauge-fill');
const gaugeScoreValueEl = document.getElementById('gauge-score-value');
const scoreDescEl = document.getElementById('score-desc');
const structureChecklistEl = document.getElementById('structure-checklist');
const suggestionsListEl = document.getElementById('suggestions-list');

// -------------------------------------------------------------
// App Initialization
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  setupEventListeners();
});

function fetchData() {
  fetch('/api/data')
    .then(res => {
      if (!res.ok) throw new Error('Não foi possível carregar os dados do servidor.');
      return res.json();
    })
    .then(data => {
      courseData = data;
      renderSidebar();
      updateGlobalProgress();
      
      // If a lesson was already active, preserve it, else show empty state
      if (activeLesson) {
        const found = findLessonById(activeLesson.id);
        if (found) {
          selectLesson(found.lesson, found.moduleId);
        }
      }
    })
    .catch(err => {
      console.error(err);
      showToast(err.message, 'warning');
    });
}

function findLessonById(id) {
  for (const mod of courseData.modules) {
    for (const les of mod.lessons) {
      if (les.id === id) {
        return { lesson: les, moduleId: mod.id };
      }
    }
  }
  return null;
}

// -------------------------------------------------------------
// Sidebar & Tree Rendering
// -------------------------------------------------------------

function renderSidebar(filterText = '') {
  courseTreeEl.innerHTML = '';
  
  if (courseData.modules.length === 0) {
    courseTreeEl.innerHTML = '<p class="sidebar-empty">Nenhum módulo encontrado.</p>';
    return;
  }

  const query = filterText.toLowerCase().trim();

  courseData.modules.forEach(mod => {
    // Filter lessons
    const filteredLessons = mod.lessons.filter(les => {
      return les.title.toLowerCase().includes(query) || 
             les.id.includes(query) || 
             les.contentLines.join('\n').toLowerCase().includes(query);
    });

    // If query is present and no lessons match, don't show the module
    if (query !== '' && filteredLessons.length === 0) return;

    const modContainer = document.createElement('div');
    modContainer.className = 'module-item';
    
    // Header
    const header = document.createElement('div');
    header.className = 'module-header';
    header.innerHTML = `
      <span class="module-header-title">
        <i data-lucide="chevron-down"></i>
        Módulo ${mod.id}: ${mod.title}
      </span>
    `;
    
    // Lessons container
    const lessonsList = document.createElement('ul');
    lessonsList.className = 'module-lessons';

    filteredLessons.forEach(les => {
      const status = courseData.diaryStatus[les.id] || 'Pendente';
      let dotClass = 'pending';
      if (status === 'Concluída') dotClass = 'completed';
      if (status === 'Em andamento') dotClass = 'progress';

      const li = document.createElement('li');
      li.className = `lesson-item ${activeLesson && activeLesson.id === les.id ? 'active' : ''}`;
      li.innerHTML = `
        <div class="lesson-title-container">
          <span class="status-dot ${dotClass}" title="${status}"></span>
          <span class="lesson-number">${les.id}</span>
          <span class="lesson-title-text" title="${les.title}">${les.title}</span>
        </div>
      `;

      li.addEventListener('click', () => {
        selectLesson(les, mod.id);
      });

      lessonsList.appendChild(li);
    });

    // Expand collapse module
    header.addEventListener('click', () => {
      modContainer.classList.toggle('collapsed');
      const icon = header.querySelector('i');
      if (modContainer.classList.contains('collapsed')) {
        icon.style.transform = 'rotate(-90deg)';
      } else {
        icon.style.transform = 'rotate(0deg)';
      }
    });

    modContainer.appendChild(header);
    modContainer.appendChild(lessonsList);
    courseTreeEl.appendChild(modContainer);
  });

  lucide.createIcons();
}

// -------------------------------------------------------------
// Lesson Selection & Tabs Management
// -------------------------------------------------------------

function selectLesson(lesson, moduleId) {
  activeLesson = lesson;
  activeModuleId = moduleId;

  // Visual active state update in sidebar
  document.querySelectorAll('.lesson-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Find current active item and mark it
  const activeElements = Array.from(document.querySelectorAll('.lesson-item')).filter(el => {
    return el.querySelector('.lesson-number').textContent === lesson.id;
  });
  if (activeElements.length > 0) {
    activeElements[0].classList.add('active');
  }

  // Update layout header
  activeLessonTagEl.textContent = `Aula ${lesson.id}`;
  activeLessonTitleEl.textContent = lesson.title;
  if (statusControlContainerEl) {
    statusControlContainerEl.style.display = 'none';
  }
  tabNavbarEl.style.display = 'flex';
  emptyStateEl.style.display = 'none';

  // Load contents into panels
  renderReaderView();
  renderComplementView();
  renderExplainerView();

  // Show active tab panel
  switchTab(activeTab);
}

function switchTab(tabId) {
  if (tabId === 'editor' || tabId === 'analyzer') {
    tabId = 'reader';
  }

  activeTab = tabId;
  
  // Toggle tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Toggle tab panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.style.display = 'none';
    panel.classList.remove('active');
  });

  const activePanel = document.getElementById('tab-' + tabId);
  if (activePanel) {
    activePanel.style.display = 'flex';
    activePanel.classList.add('active');
    if (tabId === 'editor') {
      markdownInputEl?.focus();
    }
  }
}

// -------------------------------------------------------------
// Reader & Markdown Parser
// -------------------------------------------------------------

function renderReaderView() {
  if (!activeLesson) return;
  const rawMarkdown = activeLesson.contentLines.join('\n');
  const split = splitLessonContent(rawMarkdown);
  renderMarkdownInto(readerOutputEl, split.main || rawMarkdown);
}

function renderComplementView() {
  if (!activeLesson) return;
  const rawMarkdown = activeLesson.contentLines.join('\n');
  const split = splitLessonContent(rawMarkdown);

  if (!split.complement.trim()) {
    renderMarkdownInto(complementOutputEl, [
      '# Material complementar',
      '',
      'Nenhum material complementar separado automaticamente nesta aula.',
      '',
      'Use esta aba para mover futuramente checklists longos, perguntas, simulados, gabaritos, desafios extras e anotações que não precisam interromper a aula principal.'
    ].join('\n'));
    return;
  }

  renderMarkdownInto(complementOutputEl, [
    '# Material complementar',
    '',
    split.complement
  ].join('\n'));
}

function splitLessonContent(rawMarkdown) {
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
}

function isComplementHeading(title) {
  return /^(material complementar|complementos|registro r[aá]pido|perguntas? de revis[aã]o|perguntas?|simulado|gabarito|desafio extra|desafios? opcionais?|exerc[ií]cios complementares|checklist da aula|checkpoint final|crit[eé]rios? de aceite|crit[eé]rio de conclus[aã]o|anota[cç][oõ]es|relat[oó]rio|material de apoio)/i.test(title) ||
         /\b(simulado|gabarito|desafio extra|perguntas de revis[aã]o|registro r[aá]pido|material complementar)\b/i.test(title);
}

function isMainResumeHeading(title) {
  return /^(commit recomendado|fechamento|fechamento da aula|exerc[ií]cio pr[aá]tico principal|atividade guiada|m[aã]o na massa guiada|laborat[oó]rio guiado)/i.test(title);
}

function renderMarkdownInto(container, markdown) {
  const html = marked.parse(markdown);
  container.innerHTML = html;

  // Code syntax highlighting
  if (typeof hljs !== 'undefined') {
    container.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }

  // Inject header & copy buttons for pre blocks
  container.querySelectorAll('pre').forEach((pre) => {
    const codeBlock = pre.querySelector('code');
    const codeText = codeBlock ? codeBlock.innerText : '';
    
    // Determine language label
    let lang = 'JAVA';
    if (codeBlock) {
      const classes = Array.from(codeBlock.classList);
      const langClass = classes.find(c => c.startsWith('language-'));
      if (langClass) lang = langClass.replace('language-', '').toUpperCase();
    }

    const header = document.createElement('div');
    header.className = 'code-block-header';
    header.innerHTML = `
      <span>${lang}</span>
      <button class="copy-code-btn" data-code="${encodeURIComponent(codeText)}">
        <i data-lucide="copy"></i> Copiar Código
      </button>
    `;
    pre.parentNode.insertBefore(header, pre);
  });
  
  lucide.createIcons();
}

function loadEditorView() {
  if (!activeLesson) return;
  const rawMarkdown = activeLesson.contentLines.join('\n');
  markdownInputEl.value = rawMarkdown;
  updateEditorPreview();
}

function updateEditorPreview() {
  const content = markdownInputEl.value;
  const html = marked.parse(content);
  previewOutputEl.innerHTML = html;
  if (typeof hljs !== 'undefined') {
    previewOutputEl.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }
}

// -------------------------------------------------------------
// Progress Tracking
// -------------------------------------------------------------

function updateGlobalProgress() {
  let totalLessons = 0;
  let completedLessons = 0;

  courseData.modules.forEach(mod => {
    totalLessons += mod.lessons.length;
    mod.lessons.forEach(les => {
      if (courseData.diaryStatus[les.id] === 'Concluída') {
        completedLessons++;
      }
    });
  });

  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  document.getElementById('progress-percent').textContent = `${percent}% (${completedLessons}/${totalLessons})`;
  document.getElementById('progress-bar-fill').style.width = `${percent}%`;
}

// -------------------------------------------------------------
// Quality Analyzer & Writing Checker
// -------------------------------------------------------------

function runAnalysis() {
  if (!activeLesson) return;
  const content = markdownInputEl.value;
  
  // 1. Text Metrics
  const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  const readTime = Math.max(1, Math.round(words / 200)); // ~200 WPM
  
  // Match code blocks
  const codeBlocks = (content.match(/```[a-z]*[\s\S]*?```/g) || []).length;
  
  // Paragraphs
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0 && !p.trim().startsWith('#') && !p.trim().startsWith('-') && !p.trim().startsWith('*')).length;
  
  // List items
  const lists = (content.match(/^\s*[-*+]\s+/gm) || []).length;

  // Update DOM metrics
  valWordsEl.textContent = words;
  valTimeEl.textContent = `${readTime}m`;
  valCodeEl.textContent = codeBlocks;
  numParagraphsEl.textContent = paragraphs;
  numListsEl.textContent = lists;

  // Progress fills
  fillParagraphsEl.style.width = `${Math.min(100, paragraphs * 10)}%`;
  fillListsEl.style.width = `${Math.min(100, lists * 8)}%`;

  // 2. Structural Elements Checklist - Aula V2
  const hasObjective = /#{1,3}\s*(Objetivo|Apresentação|Apresentacao|Hoje a aula|Onde estamos)/i.test(content);
  const hasConcept = /#{1,3}\s*(Conceito|O que é|O que e|Por que|Entendendo|A ideia central)/i.test(content) || paragraphs > 6;
  const hasPractice = /```(java|bash|powershell|text|sql|xml|yaml|dockerfile|properties)/i.test(content) || /Mão na massa|Mao na massa|Laboratório|Laboratorio|Exercício guiado|Exercicio guiado|Atividade guiada/i.test(content);
  const hasClosure = /Commit recomendado|git commit|Fechamento|Checkpoint final|Critério de conclusão|Criterio de conclusao/i.test(content);

  const checklistItems = structureChecklistEl.querySelectorAll('li');
  
  updateChecklistItem(checklistItems[0], hasObjective);
  updateChecklistItem(checklistItems[1], hasConcept);
  updateChecklistItem(checklistItems[2], hasPractice);
  updateChecklistItem(checklistItems[3], hasClosure);

  // 3. Quality Score Gauge
  let score = 100;
  let warnings = 0;
  const suggestions = [];

  if (!hasObjective) { score -= 20; warnings++; suggestions.push({ type: 'warning', text: 'Falta apresentação ou objetivo claro. Diga o que o aluno fará e por que isso importa.' }); }
  if (!hasConcept) { score -= 20; warnings++; suggestions.push({ type: 'warning', text: 'Conceito essencial pouco claro. Explique o que é, por que existe e quando usar.' }); }
  if (!hasPractice) { score -= 20; warnings++; suggestions.push({ type: 'warning', text: 'Falta prática guiada. A aula precisa de comandos, código, laboratório ou atividade executável.' }); }
  if (!hasClosure) { score -= 20; warnings++; suggestions.push({ type: 'warning', text: 'Falta commit, fechamento ou checkpoint final para consolidar a aula.' }); }

  if (words < 800) {
    score -= 15;
    warnings++;
    suggestions.push({ type: 'warning', text: 'Aula curta para o padrão da formação. Verifique se há contexto, prática e entendimento suficientes.' });
  } else if (words > 5000) {
    suggestions.push({ type: 'info', text: 'Aula extensa. Considere mover checklists, perguntas, simulados e desafios para Material complementar.' });
  }

  score = Math.max(0, score);
  
  // Set gauge
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  gaugeFillEl.style.strokeDasharray = circumference;
  gaugeFillEl.style.strokeDashoffset = offset;
  gaugeScoreValueEl.textContent = `${score}%`;

  // Score description
  if (score === 100) {
    scoreDescEl.textContent = 'Perfeito! A estrutura está completa e equilibrada.';
    scoreDescEl.style.color = 'var(--status-completed)';
  } else if (score >= 60) {
    scoreDescEl.textContent = 'Bom, mas pode ser melhorado com as sugestões abaixo.';
    scoreDescEl.style.color = 'var(--status-progress)';
  } else {
    scoreDescEl.textContent = 'Precisa de atenção. Adicione as seções obrigatórias.';
    scoreDescEl.style.color = 'var(--status-pending)';
  }

  // Update suggestions panel
  suggestionsListEl.innerHTML = '';
  if (suggestions.length === 0) {
    suggestionsListEl.innerHTML = `
      <div class="suggestion-item success">
        <i data-lucide="check-circle"></i>
        <span>Excelente escrita! Nenhum item pendente ou de alerta estrutural.</span>
      </div>
    `;
  } else {
    suggestions.forEach(s => {
      const div = document.createElement('div');
      div.className = `suggestion-item ${s.type}`;
      div.innerHTML = `
        <i data-lucide="${s.type === 'warning' ? 'alert-triangle' : 'info'}"></i>
        <span>${s.text}</span>
      `;
      suggestionsListEl.appendChild(div);
    });
  }

  // Update analyzer tab warning badge
  if (warnings > 0) {
    analyzerWarningBadgeEl.style.display = 'inline-block';
    analyzerWarningBadgeEl.textContent = warnings;
  } else {
    analyzerWarningBadgeEl.style.display = 'none';
  }

  lucide.createIcons();
}

function updateChecklistItem(el, checked) {
  const icon = el.querySelector('.check-icon');
  if (checked) {
    icon.className = 'check-icon status-checked';
    icon.setAttribute('data-lucide', 'check-circle');
  } else {
    icon.className = 'check-icon status-pending';
    icon.setAttribute('data-lucide', 'circle');
  }
}

// -------------------------------------------------------------
// Event Handlers & API Operations
// -------------------------------------------------------------

function setupEventListeners() {
  // Tab change
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });

  // Editor features are intentionally hidden in the course reader experience.
  if (markdownInputEl) {
    markdownInputEl.addEventListener('input', () => {
      updateEditorPreview();
    });
  }

  // Status Select change
  if (lessonStatusSelectEl) lessonStatusSelectEl.addEventListener('change', () => {
    if (!activeLesson) return;
    const newStatus = lessonStatusSelectEl.value;
    
    saveStatus(activeLesson.id, activeLesson.title, newStatus);
  });

  // Save Lesson Button
  if (saveLessonBtn) saveLessonBtn.addEventListener('click', saveActiveLesson);

  // Keyboard shortcut Ctrl+S
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (activeLesson && activeTab === 'editor') {
        // Editing is hidden in the course reader, so Ctrl+S is ignored here.
      }
    }
  });

  // Search Input
  document.getElementById('search-input').addEventListener('input', (e) => {
    renderSidebar(e.target.value);
  });

  // Helper inserts
  if (helperObjBtn) helperObjBtn.addEventListener('click', () => insertTextAtCursor('### Objetivo\n\n[O que o aluno aprenderá nesta aula...]\n\n'));
  if (helperCodeBtn) helperCodeBtn.addEventListener('click', () => insertTextAtCursor('### Código praticado\n\n```java\npublic class Main {\n    public static void main(String[] args) {\n        // Escreva seu código aqui\n    }\n}\n```\n\n'));
  if (helperLearningBtn) helperLearningBtn.addEventListener('click', () => insertTextAtCursor('### Aprendizado\n\n- [Insira o aprendizado importante 1]\n- [Insira o aprendizado importante 2]\n\n'));
  if (helperWarningBtn) helperWarningBtn.addEventListener('click', () => insertTextAtCursor('> **Atenção:** [Insira sua observação ou aviso técnico aqui]\n\n'));

  // Copy code blocks (global event listener)
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.copy-code-btn');
    if (copyBtn) {
      const text = decodeURIComponent(copyBtn.getAttribute('data-code'));
      navigator.clipboard.writeText(text).then(() => {
        showToast('Código copiado com sucesso!', 'success');
      }).catch(err => {
        console.error(err);
        showToast('Erro ao copiar código.', 'warning');
      });
    }
  });

}

function insertTextAtCursor(text) {
  const start = markdownInputEl.selectionStart;
  const end = markdownInputEl.selectionEnd;
  const val = markdownInputEl.value;
  markdownInputEl.value = val.substring(0, start) + text + val.substring(end);
  markdownInputEl.selectionStart = markdownInputEl.selectionEnd = start + text.length;
  markdownInputEl.focus();
  updateEditorPreview();
  runAnalysis();
}

function saveActiveLesson() {
  if (!activeLesson) return;
  
  saveLessonBtn.disabled = true;
  saveLessonBtn.innerHTML = '<i data-lucide="loader"></i> Salvando...';
  lucide.createIcons();

  const newContent = markdownInputEl.value;

  fetch('/api/save-lesson', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lessonId: activeLesson.id,
      title: activeLesson.title,
      content: newContent
    })
  })
  .then(res => {
    if (!res.ok) throw new Error('Falha ao salvar no servidor.');
    return res.json();
  })
  .then(data => {
    showToast(`Aula salva! Backup criado: ${data.backupCreated}`, 'success');
    
    // Refresh local dataset & render
    activeLesson.contentLines = newContent.split('\n');
    renderReaderView();
    runAnalysis();
  })
  .catch(err => {
    console.error(err);
    showToast(err.message, 'warning');
  })
  .finally(() => {
    saveLessonBtn.disabled = false;
    saveLessonBtn.innerHTML = '<i data-lucide="save"></i> Salvar Alterações';
    lucide.createIcons();
  });
}

function saveStatus(lessonId, lessonTitle, status) {
  fetch('/api/save-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lessonId, lessonTitle, status })
  })
  .then(res => {
    if (!res.ok) throw new Error('Falha ao atualizar status no diário.');
    return res.json();
  })
  .then(() => {
    courseData.diaryStatus[lessonId] = status;
    updateGlobalProgress();
    renderSidebar(document.getElementById('search-input').value);
    showToast(`Status da Aula ${lessonId} atualizado para "${status}".`, 'success');
  })
  .catch(err => {
    console.error(err);
    showToast(err.message, 'warning');
  });
}

// -------------------------------------------------------------
// Toast Notification Utility
// -------------------------------------------------------------

let toastTimeout = null;

function showToast(message, type = 'success') {
  clearTimeout(toastTimeout);
  
  toastMsgEl.textContent = message;
  
  if (type === 'success') {
    toastIconEl.setAttribute('data-lucide', 'check-circle');
    toastIconEl.style.color = 'var(--status-completed)';
  } else {
    toastIconEl.setAttribute('data-lucide', 'alert-triangle');
    toastIconEl.style.color = 'var(--status-progress)';
  }
  
  lucide.createIcons();
  
  toastEl.classList.add('show');
  
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 4000);
}

// -------------------------------------------------------------
// Code Explainer Interactivity
// -------------------------------------------------------------

function extractCodeBlocks(content) {
  const codeBlockRegex = /```([^\r\n`]*)\r?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = normalizeCodeLanguage(match[1]);
    const code = match[2];
    if (!code.trim()) continue;

    blocks.push({
      id: blocks.length + 1,
      language,
      title: `Bloco ${blocks.length + 1} - ${getCodeLanguageLabel(language)}`,
      code
    });
  }
  return blocks;
}

function normalizeCodeLanguage(language) {
  const clean = (language || 'text').trim().toLowerCase();
  if (!clean) return 'text';
  if (clean === 'sh' || clean === 'shell' || clean === 'terminal') return 'bash';
  if (clean === 'ps' || clean === 'pwsh') return 'powershell';
  if (clean === 'yml') return 'yaml';
  if (clean === 'env') return 'properties';
  if (clean === 'docker') return 'dockerfile';
  if (clean === 'plaintext' || clean === 'txt') return 'text';
  return clean.replace(/[^\w+-]/g, '');
}

function getCodeLanguageLabel(language) {
  const labels = {
    bash: 'Terminal',
    cmd: 'CMD',
    dockerfile: 'Dockerfile',
    java: 'Java',
    json: 'JSON',
    properties: 'Properties / .env',
    powershell: 'PowerShell',
    sql: 'SQL',
    text: 'Texto',
    xml: 'XML',
    yaml: 'YAML'
  };
  return labels[language] || language.toUpperCase();
}

function renderExplainerView() {
  if (!activeLesson) return;
  const rawText = activeLesson.contentLines.join('\n');
  const codeBlocks = extractCodeBlocks(rawText);

  explainerCodeListEl.innerHTML = '';
  
  // Reset details card
  explainerDetailEmptyEl.style.display = 'flex';
  explainerDetailContentEl.style.display = 'none';

  if (codeBlocks.length === 0) {
    explainerCodeListEl.innerHTML = `
      <div style="padding: 40px; color: var(--text-muted); text-align: center;">
        <i data-lucide="code-2" style="width: 48px; height: 48px; stroke-width: 1.5; margin-bottom: 12px; color: var(--text-muted);"></i>
        <p>Esta aula não possui blocos de código ou comandos estruturados para explicação interativa.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  codeBlocks.forEach(block => {
    const blockDiv = document.createElement('div');
    blockDiv.className = 'explainer-code-block';
    
    // Add title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'explainer-code-title';
    titleDiv.innerHTML = `<i data-lucide="terminal-square"></i> ${block.title}`;
    blockDiv.appendChild(titleDiv);

    // Split code lines
    const lines = block.code.split(/\r?\n/);
    lines.forEach((lineText, idx) => {
      if (idx === lines.length - 1 && lineText.trim() === '') return;

      const lineDiv = document.createElement('div');
      lineDiv.className = 'explainer-line';
      
      const explanation = getLineExplanation(lineText) || getGenericLineExplanation(lineText, block.language);
      if (explanation) {
        lineDiv.classList.add('has-explanation');
      }

      lineDiv.innerHTML = `
        <span class="explainer-ln">${idx + 1}</span>
        <span class="explainer-code-text"></span>
      `;
      
      lineDiv.querySelector('.explainer-code-text').textContent = lineText;

      lineDiv.addEventListener('click', () => {
        document.querySelectorAll('.explainer-line').forEach(el => el.classList.remove('active'));
        lineDiv.classList.add('active');

        explainerDetailEmptyEl.style.display = 'none';
        explainerDetailContentEl.style.display = 'block';

        explainerLineTitleEl.textContent = explanation.title;
        explainerLineCodeEl.className = `language-${block.language}`;
        explainerLineCodeEl.textContent = lineText.trim();
        explainerLineDescEl.innerHTML = explanation.desc;
        
        if (typeof hljs !== 'undefined') {
          delete explainerLineCodeEl.dataset.highlighted;
          explainerLineCodeEl.removeAttribute('data-highlighted');
          hljs.highlightElement(explainerLineCodeEl);
        }
      });

      blockDiv.appendChild(lineDiv);
    });

    explainerCodeListEl.appendChild(blockDiv);
  });

  lucide.createIcons();
}

function getGenericLineExplanation(lineText, language) {
  const trimmed = lineText.trim();
  const label = getCodeLanguageLabel(language);

  if (!trimmed) {
    return {
      title: "Linha em branco",
      desc: "<p>Esta linha separa visualmente partes do bloco para melhorar a leitura.</p>"
    };
  }

  if (language === 'bash' || language === 'powershell' || language === 'cmd') {
    return getShellLineExplanation(trimmed, label);
  }

  if (language === 'yaml') {
    return getYamlLineExplanation(trimmed);
  }

  if (language === 'properties') {
    return getPropertiesLineExplanation(trimmed);
  }

  if (language === 'dockerfile') {
    return getDockerfileLineExplanation(trimmed);
  }

  if (language === 'sql') {
    return getSqlLineExplanation(trimmed);
  }

  if (language === 'json') {
    return {
      title: "Estrutura JSON",
      desc: `<p>Esta linha faz parte de um documento JSON, usado para representar dados estruturados em chaves e valores.</p><p><code>${escapeHtml(trimmed)}</code></p>`
    };
  }

  if (language === 'xml') {
    return {
      title: "Estrutura XML",
      desc: `<p>Esta linha pertence a um documento XML, formato comum em configuracoes Java, Maven e ferramentas corporativas.</p><p><code>${escapeHtml(trimmed)}</code></p>`
    };
  }

  return {
    title: `Linha de ${label}`,
    desc: `<p>Esta linha faz parte do bloco de ${label}. Leia junto com as linhas vizinhas para entender o efeito completo do trecho.</p><p><code>${escapeHtml(trimmed)}</code></p>`
  };
}

function getShellLineExplanation(trimmed, label) {
  const command = trimmed.split(/\s+/)[0];
  const common = {
    cd: "troca o diretorio atual do terminal.",
    code: "abre o projeto ou arquivo no Visual Studio Code.",
    docker: "executa uma operacao do Docker, como criar imagem, subir servicos ou consultar containers.",
    git: "executa uma operacao de versionamento no Git.",
    java: "executa a JVM ou comandos relacionados ao Java.",
    javac: "compila arquivos Java para bytecode.",
    mkdir: "cria um novo diretorio.",
    mvn: "executa uma tarefa do Maven, como build, teste ou execucao.",
    psql: "abre ou executa comandos no cliente PostgreSQL.",
    'redis-cli': "abre ou executa comandos no cliente Redis."
  };

  return {
    title: `Comando ${label}`,
    desc: `<p>Esta linha deve ser executada no ${label}. ${common[command] || 'Ela automatiza uma acao pratica necessaria para a aula.'}</p><p><code>${escapeHtml(trimmed)}</code></p>`
  };
}

function getYamlLineExplanation(trimmed) {
  if (trimmed.startsWith('- ')) {
    return {
      title: "Item de lista YAML",
      desc: `<p>O hifen indica um item dentro de uma lista YAML, muito usado em Docker Compose, GitHub Actions e arquivos de configuracao.</p><p><code>${escapeHtml(trimmed)}</code></p>`
    };
  }

  const keyMatch = trimmed.match(/^([A-Za-z0-9_.-]+):/);
  if (keyMatch) {
    return {
      title: `Chave YAML: ${keyMatch[1]}`,
      desc: `<p>Define uma chave de configuracao. Em YAML, a indentacao mostra quem pertence a quem, por isso o recuo desta linha e importante.</p><p><code>${escapeHtml(trimmed)}</code></p>`
    };
  }

  return {
    title: "Linha YAML",
    desc: `<p>Esta linha complementa a configuracao YAML acima dela. Observe o recuo para entender o bloco ao qual ela pertence.</p><p><code>${escapeHtml(trimmed)}</code></p>`
  };
}

function getPropertiesLineExplanation(trimmed) {
  const match = trimmed.match(/^([A-Za-z0-9_.-]+)\s*=\s*(.*)$/);
  if (match) {
    return {
      title: `Propriedade: ${match[1]}`,
      desc: `<p>Define uma configuracao no formato chave=valor. Esse padrao aparece em arquivos <code>.env</code>, <code>.properties</code> e configuracoes de backend.</p><p><code>${escapeHtml(trimmed)}</code></p>`
    };
  }

  return {
    title: "Linha de configuracao",
    desc: `<p>Esta linha faz parte de um arquivo simples de configuracao textual.</p><p><code>${escapeHtml(trimmed)}</code></p>`
  };
}

function getDockerfileLineExplanation(trimmed) {
  const instruction = trimmed.split(/\s+/)[0].toUpperCase();
  const meanings = {
    FROM: "define a imagem base que sera usada para construir a imagem final.",
    WORKDIR: "define o diretorio de trabalho dentro da imagem.",
    COPY: "copia arquivos do projeto para dentro da imagem.",
    RUN: "executa comandos durante o build da imagem.",
    EXPOSE: "documenta a porta usada pela aplicacao dentro do container.",
    CMD: "define o comando padrao executado quando o container inicia.",
    ENTRYPOINT: "define o processo principal do container."
  };

  return {
    title: `Dockerfile: ${instruction}`,
    desc: `<p>${meanings[instruction] || 'Instrucao usada durante a montagem ou execucao da imagem Docker.'}</p><p><code>${escapeHtml(trimmed)}</code></p>`
  };
}

function getSqlLineExplanation(trimmed) {
  const keyword = trimmed.split(/\s+/)[0].toUpperCase();
  const meanings = {
    SELECT: "consulta dados em uma ou mais tabelas.",
    INSERT: "insere novos registros em uma tabela.",
    UPDATE: "altera registros existentes.",
    DELETE: "remove registros de uma tabela.",
    CREATE: "cria estruturas no banco, como tabelas, indices ou schemas.",
    ALTER: "altera uma estrutura ja existente no banco.",
    DROP: "remove uma estrutura do banco."
  };

  return {
    title: `SQL: ${keyword}`,
    desc: `<p>${meanings[keyword] || 'Linha de comando SQL usada para consultar ou modificar o banco de dados.'}</p><p><code>${escapeHtml(trimmed)}</code></p>`
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getLineExplanation(lineText) {
  const trimmed = lineText.trim();
  
  if (CODE_EXPLANATIONS[trimmed]) return CODE_EXPLANATIONS[trimmed];
  
  for (const key in CODE_EXPLANATIONS) {
    if (trimmed.includes(key)) {
      return CODE_EXPLANATIONS[key];
    }
  }
  
  // RegEx based rules
  if (/System\.out\.println\((.*)\);/.test(trimmed)) {
    return {
      title: "Saída no Console (Print Line)",
      desc: "<p>Instrução que imprime uma mensagem na tela e <strong>pula de linha</strong> automaticamente no final.</p><p>O termo <code>System.out</code> faz referência à saída padrão do sistema, e o método <code>println</code> realiza a escrita da informação fornecida nos parênteses.</p>"
    };
  }
  if (/System\.out\.print\((.*)\);/.test(trimmed)) {
    return {
      title: "Saída no Console (Print simples)",
      desc: "<p>Imprime informações no terminal mas <strong>mantém o cursor na mesma linha</strong>. Útil quando você quer colar o próximo print ou a digitação do usuário na mesma linha.</p>"
    };
  }
  if (/String\s+(\w+)\s*=\s*(.*);/.test(trimmed)) {
    const match = trimmed.match(/String\s+(\w+)/);
    const varName = match ? match[1] : "variável";
    return {
      title: "Declaração de String (Texto)",
      desc: `<p>Cria uma variável chamada <code>${varName}</code> da classe <code>String</code>.</p><p>Em Java, Strings são objetos usados para armazenar textos e devem obrigatoriamente ser escritas com <strong>aspas duplas</strong> (ex: <code>"Thiago"</code>).</p>`
    };
  }
  if (/int\s+(\w+)\s*=\s*(.*);/.test(trimmed)) {
    const match = trimmed.match(/int\s+(\w+)/);
    const varName = match ? match[1] : "variável";
    return {
      title: "Variável Inteira (int)",
      desc: `<p>Declara uma variável de número inteiro de 32 bits chamada <code>${varName}</code> usando o tipo primitivo <code>int</code>.</p><p>Ideal para armazenar contagens, idades ou IDs numéricos simples que não necessitam de decimais.</p>`
    };
  }
  if (/double\s+(\w+)\s*=\s*(.*);/.test(trimmed)) {
    const match = trimmed.match(/double\s+(\w+)/);
    const varName = match ? match[1] : "variável";
    return {
      title: "Variável Decimal (double)",
      desc: `<p>Declara uma variável decimal de 64 bits chamada <code>${varName}</code> usando o tipo primitivo <code>double</code>.</p><p>É o padrão do Java para números de ponto flutuante de precisão dupla (ex: alturas, médias, salários).</p>`
    };
  }
  if (/float\s+(\w+)\s*=\s*(.*);/.test(trimmed)) {
    const match = trimmed.match(/float\s+(\w+)/);
    const varName = match ? match[1] : "variável";
    return {
      title: "Variável Decimal Curta (float)",
      desc: `<p>Cria uma variável decimal de 32 bits chamada <code>${varName}</code> usando o tipo primitivo <code>float</code>.</p><p>Requer obrigatoriamente a letra <code>F</code> ou <code>f</code> no final do valor numérico atribuído, senão o compilador a confunde com um double de 64 bits e causa erro de compilação.</p>`
    };
  }
  if (/boolean\s+(\w+)\s*=\s*(.*);/.test(trimmed)) {
    const match = trimmed.match(/boolean\s+(\w+)/);
    const varName = match ? match[1] : "variável";
    return {
      title: "Variável Lógica (boolean)",
      desc: `<p>Declara uma variável booleana chamada <code>${varName}</code>.</p><p>Variáveis booleanas ocupam apenas 1 bit de dados na memória RAM e só admitem dois estados lógicos: <code>true</code> (verdadeiro) ou <code>false</code> (falso).</p>`
    };
  }
  if (/char\s+(\w+)\s*=\s*(.*);/.test(trimmed)) {
    const match = trimmed.match(/char\s+(\w+)/);
    const varName = match ? match[1] : "variável";
    return {
      title: "Caractere Único (char)",
      desc: `<p>Declara uma variável de caractere único Unicode chamada <code>${varName}</code>.</p><p>Variáveis <code>char</code> devem ser inicializadas obrigatoriamente usando <strong>aspas simples</strong> (ex: <code>'P'</code>). Aspas duplas geram erro de compilação.</p>`
    };
  }
  if (/if\s*\((.*)\)/.test(trimmed)) {
    return {
      title: "Condicional SE (if)",
      desc: "<p>Instrução de tomada de decisão. Se a expressão lógica indicada dentro dos parênteses for verdadeira (<code>true</code>), o bloco de chaves seguintes será executado.</p>"
    };
  }
  if (/else\s+if\s*\((.*)\)/.test(trimmed)) {
    return {
      title: "Condicional Alternativa (else if)",
      desc: "<p>Executa uma verificação secundária apenas se todas as condições anteriores testadas pelo <code>if</code> ou por outros <code>else if</code> resultarem em falso.</p>"
    };
  }
  if (/else\s*\{/.test(trimmed) || trimmed === "else") {
    return {
      title: "Caso de Exceção (else)",
      desc: "<p>Bloco padrão executado automaticamente quando todas as condições lógicas anteriores falham (são avaliadas como <code>false</code>).</p>"
    };
  }
  if (/for\s*\((.*)\)/.test(trimmed)) {
    return {
      title: "Laço de Repetição Controlado (for)",
      desc: "<p>Laço de repetição muito potente. Divide-se em 3 partes dentro dos parênteses:<br>1. Inicialização da variável contadora;<br>2. Condição de parada (executa enquanto for true);<br>3. Passo de incremento ou decremento.</p>"
    };
  }
  if (/while\s*\((.*)\)/.test(trimmed)) {
    return {
      title: "Laço de Repetição Condicional (while)",
      desc: "<p>Repete as instruções dentro do bloco repetidamente <strong>enquanto</strong> a expressão nos parênteses for verdadeira.</p><p>Atenção: A variável que controla a condição deve mudar de valor dentro do bloco para evitar travar o computador em <strong>loop infinito</strong>.</p>"
    };
  }
  if (/do\s*\{/.test(trimmed) || trimmed === "do") {
    return {
      title: "Laço Repetitivo Pós-Testado (do while)",
      desc: "<p>Garante que o bloco de código dentro das chaves seja executado <strong>pelo menos uma vez</strong> antes de validar a condição lógica de parada. O teste condicional ocorre no final.</p>"
    };
  }
  if (/switch\s*\((.*)\)/.test(trimmed)) {
    return {
      title: "Estrutura de Seleção Múltipla (switch)",
      desc: "<p>Avalia o valor de uma única variável contra múltiplos cenários fixos (<code>case</code>). Ideal para substituir encadeamentos exaustivos de <code>if-else</code>.</p>"
    };
  }
  if (/case\s+(.*):/.test(trimmed)) {
    return {
      title: "Cenário de Seleção (case)",
      desc: "<p>Define um dos possíveis caminhos de execução dentro de um bloco <code>switch</code>. Se o valor da variável corresponder a este caso, o bloco associado é disparado.</p>"
    };
  }
  if (trimmed === "break;") {
    return {
      title: "Comando de Parada (break)",
      desc: "<p>Comando que interrompe e sai imediatamente de uma estrutura de controle ativa (como um loop <code>for</code>/<code>while</code> ou de uma seleção <code>switch</code>).</p>"
    };
  }
  if (trimmed === "continue;") {
    return {
      title: "Comando de Salto (continue)",
      desc: "<p>Pula o restante dos comandos da iteração atual de um loop e salta diretamente para o teste de condição da próxima repetição do laço.</p>"
    };
  }

  // Array declarations e.g. int[] idades = new int[5]; or String[] nomes = new String[3];
  if (/(int|String|double|float|boolean)\[\]\s+(\w+)\s*=\s*new\s+\1\[(.*)\];/.test(trimmed)) {
    const match = trimmed.match(/(int|String|double|float|boolean)\[\]\s+(\w+)\s*=\s*new\s+\1\[(.*)\];/);
    const typeName = match ? match[1] : "tipo";
    const varName = match ? match[2] : "array";
    const size = match ? match[3] : "tamanho";
    return {
      title: "Criação de Array (Vetor de tamanho fixo)",
      desc: `<p>Declara e inicializa uma estrutura de Array (Vetor) de tipo <code>${typeName}</code> chamada <code>${varName}</code>, reservando espaço físico contíguo para conter exatamente <strong>${size}</strong> elementos.</p><p>Em Java, Arrays têm tamanho fixo imutável determinado na criação. O primeiro índice é sempre o <code>0</code> e o último é <code>tamanho - 1</code>.</p>`
    };
  }

  // Array shorthand initialization e.g. int[] numeros = {1, 2, 3};
  if (/(int|String|double)\[\]\s+(\w+)\s*=\s*\{/.test(trimmed)) {
    const match = trimmed.match(/(int|String|double)\[\]\s+(\w+)/);
    const varName = match ? match[2] : "array";
    return {
      title: "Inicialização Curta de Array",
      desc: `<p>Declara um array de nome <code>${varName}</code> e já o preenche com os elementos fornecidos entre chaves de forma abreviada.</p><p>O Java calcula o tamanho do array automaticamente com base no número de valores informados.</p>`
    };
  }

  // Array access e.g. idades[i] or nomes[0]
  if (/(\w+)\[([\w+-\s]+)\]/.test(trimmed) && !trimmed.startsWith("for") && !trimmed.startsWith("if")) {
    const match = trimmed.match(/(\w+)\[([\w+-\s]+)\]/);
    const arrayName = match ? match[1] : "array";
    const index = match ? match[2] : "índice";
    return {
      title: "Acesso a Índice de Array",
      desc: `<p>Acessa ou altera o valor localizado na posição de índice <code>${index}</code> do array <code>${arrayName}</code>.</p><p>Atenção: Se o índice for menor que <code>0</code> ou maior/igual ao tamanho total do array, a JVM lançará o temido erro em tempo de execução <code>ArrayIndexOutOfBoundsException</code>.</p>`
    };
  }

  // Array Length property
  if (trimmed.includes(".length") && !trimmed.includes(".length()")) {
    return {
      title: "Propriedade length do Array",
      desc: "<p>Retorna a quantidade total de elementos que o array possui (seu tamanho físico). É um atributo somente-leitura próprio dos arrays em Java.</p>"
    };
  }

  // String length() method
  if (trimmed.includes(".length()")) {
    return {
      title: "Método length() de Strings",
      desc: "<p>Retorna o número de caracteres contidos em um objeto <code>String</code>. Diferente dos arrays, em Strings <code>length()</code> é um método (requer parênteses).</p>"
    };
  }

  // String comparison (.equals)
  if (trimmed.includes(".equals(")) {
    return {
      title: "Comparação de Textos (equals)",
      desc: "<p>Compara o valor de texto de duas Strings para verificar igualdade de conteúdo.</p><p><strong>Importante:</strong> Em Java, nunca use o operador <code>==</code> para comparar textos, pois ele compara referências de memória. Use sempre o método <code>.equals()</code>.</p>"
    };
  }

  // String isEmpty()
  if (trimmed.includes(".isEmpty()")) {
    return {
      title: "Validação de String Vazia",
      desc: "<p>Método que retorna <code>true</code> se a String possuir tamanho zero (ou seja, estiver totalmente em branco, sem caracteres).</p>"
    };
  }

  // Increment operator
  if (/(\w+)\+\+/.test(trimmed)) {
    const match = trimmed.match(/(\w+)\+\+/);
    const varName = match ? match[1] : "variável";
    return {
      title: "Operador de Incremento (Pós-Incremento)",
      desc: `<p>Sintaxe reduzida que soma <code>1</code> ao valor contido na variável <code>${varName}</code>.</p><p>Equivalente a escrever <code>${varName} = ${varName} + 1;</code>. Muito comum em loops para avançar o contador para a próxima iteração.</p>`
    };
  }

  // Accumulator assignment
  if (trimmed.includes("=") && (trimmed.includes(" + ") || trimmed.includes(" += "))) {
    const match = trimmed.match(/(\w+)\s*(\+)?=/);
    const varName = match ? match[1] : "acumulador";
    return {
      title: "Lógica de Acumulador",
      desc: `<p>Soma um valor novo ao valor que a variável <code>${varName}</code> já possuía anteriormente, acumulando o resultado.</p><p>Muito usado para calcular somatórios ou totais gerais dentro de estruturas de repetição.</p>`
    };
  }

  return null;
}



const CODE_EXPLANATIONS = {
  "public class Main {": {
    title: "Declaração de Classe Pública",
    desc: "<p>Define uma classe pública chamada <code>Main</code>. Em Java, <strong>todo o código executável</strong> precisa obrigatoriamente residir dentro de uma classe.</p><p>O nome da classe pública deve ser idêntico ao nome do arquivo físico no disco (<code>Main.java</code>).</p>"
  },
  "public static void main(String[] args) {": {
    title: "Método Entry Point (Ponto de Entrada)",
    desc: "<p>É o ponto de partida do seu programa Java. Quando a JVM executa a aplicação, ela procura exatamente por esta assinatura de método para dar início à execução.</p><ul><li><code>public</code>: acessível por qualquer código fora da classe.</li><li><code>static</code>: pertence à classe em si, permitindo ser chamado pela JVM sem instanciar um objeto primeiro.</li><li><code>void</code>: não retorna nenhum valor após finalizar.</li><li><code>main</code>: o nome do método que a JVM busca.</li><li><code>String[] args</code>: parâmetros/argumentos passados via console na inicialização.</li></ul>"
  },
  "Scanner scanner = new Scanner(System.in);": {
    title: "Criação de Leitor de Teclado (Scanner)",
    desc: "<p>Instancia um objeto da classe <code>Scanner</code> configurado para ouvir o canal <code>System.in</code> (a entrada padrão do sistema, normalmente o seu teclado físico).</p><p>Isso permite que você capture informações interativas digitadas pelo usuário no console.</p>"
  },
  "scanner.close();": {
    title: "Fechamento de Recursos de I/O",
    desc: "<p>Fecha o leitor <code>Scanner</code> e libera os recursos do sistema operacional associados à entrada padrão.</p><p>É uma boa prática indispensável para desenvolvedores backend para evitar <strong>Memory Leaks</strong> (vazamentos de recursos de memória).</p>"
  }
};
