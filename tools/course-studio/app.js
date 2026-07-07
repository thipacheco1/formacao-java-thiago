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
  statusControlContainerEl.style.display = 'flex';
  tabNavbarEl.style.display = 'flex';
  emptyStateEl.style.display = 'none';

  // Load Status dropdown
  const status = courseData.diaryStatus[lesson.id] || 'Pendente';
  lessonStatusSelectEl.value = status;

  // Load contents into panels
  renderReaderView();
  loadEditorView();
  runAnalysis();
  renderExplainerView();

  // Show active tab panel
  switchTab(activeTab);
}

function switchTab(tabId) {
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
  });

  const activePanel = document.getElementById('tab-' + tabId);
  if (activePanel) {
    activePanel.style.display = 'block';
    if (tabId === 'editor') {
      markdownInputEl.focus();
    }
  }
}

// -------------------------------------------------------------
// Reader & Markdown Parser
// -------------------------------------------------------------

function renderReaderView() {
  if (!activeLesson) return;
  const rawMarkdown = activeLesson.contentLines.join('\n');
  
  // Custom marked parsing and styling
  const html = marked.parse(rawMarkdown);
  readerOutputEl.innerHTML = html;
  
  // Code syntax highlighting
  if (typeof hljs !== 'undefined') {
    readerOutputEl.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }

  // Inject header & copy buttons for pre blocks
  readerOutputEl.querySelectorAll('pre').forEach((pre) => {
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

  // 2. Structural Elements Checklist
  const hasObjective = /###\s*Objetivo/i.test(content);
  const hasConcept = /###\s*(Conceito|O que é|Explicação)/i.test(content) || paragraphs > 2;
  const hasCode = /```(java|bash|text)/i.test(content);
  const hasLearnings = /###\s*(Aprendizado|Erros corrigidos)/i.test(content);

  const checklistItems = structureChecklistEl.querySelectorAll('li');
  
  updateChecklistItem(checklistItems[0], hasObjective);
  updateChecklistItem(checklistItems[1], hasConcept);
  updateChecklistItem(checklistItems[2], hasCode);
  updateChecklistItem(checklistItems[3], hasLearnings);

  // 3. Quality Score Gauge
  let score = 100;
  let warnings = 0;
  const suggestions = [];

  if (!hasObjective) { score -= 20; warnings++; suggestions.push({ type: 'warning', text: 'Falta seção "Objetivo". Diga claramente ao aluno o que ele aprenderá nesta aula.' }); }
  if (!hasConcept) { score -= 20; warnings++; suggestions.push({ type: 'warning', text: 'Conteúdo explicativo escasso. Considere expandir os parágrafos de explicação teórica.' }); }
  if (!hasCode) { score -= 20; warnings++; suggestions.push({ type: 'warning', text: 'Sem exemplos de código. Um bom curso de backend precisa de exemplos práticos em blocos de código.' }); }
  if (!hasLearnings) { score -= 20; warnings++; suggestions.push({ type: 'warning', text: 'Falta seção "Aprendizado" ou "Erros corrigidos" no final para consolidar o estudo.' }); }

  if (words < 100) {
    score -= 15;
    warnings++;
    suggestions.push({ type: 'warning', text: 'Texto muito curto. Escreva pelo menos 150 palavras para detalhar o conteúdo.' });
  } else if (words > 800) {
    suggestions.push({ type: 'info', text: 'Aula longa. Considere dividir em duas aulas menores se houver muitos tópicos independentes.' });
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

  // Editor typing preview
  markdownInputEl.addEventListener('input', () => {
    updateEditorPreview();
    runAnalysis();
  });

  // Status Select change
  lessonStatusSelectEl.addEventListener('change', () => {
    if (!activeLesson) return;
    const newStatus = lessonStatusSelectEl.value;
    
    saveStatus(activeLesson.id, activeLesson.title, newStatus);
  });

  // Save Lesson Button
  saveLessonBtn.addEventListener('click', saveActiveLesson);

  // Keyboard shortcut Ctrl+S
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (activeLesson && activeTab === 'editor') {
        saveActiveLesson();
      }
    }
  });

  // Search Input
  document.getElementById('search-input').addEventListener('input', (e) => {
    renderSidebar(e.target.value);
  });

  // Helper inserts
  helperObjBtn.addEventListener('click', () => insertTextAtCursor('### Objetivo\n\n[O que o aluno aprenderá nesta aula...]\n\n'));
  helperCodeBtn.addEventListener('click', () => insertTextAtCursor('### Código praticado\n\n```java\npublic class Main {\n    public static void main(String[] args) {\n        // Escreva seu código aqui\n    }\n}\n```\n\n'));
  helperLearningBtn.addEventListener('click', () => insertTextAtCursor('### Aprendizado\n\n- [Insira o aprendizado importante 1]\n- [Insira o aprendizado importante 2]\n\n'));
  helperWarningBtn.addEventListener('click', () => insertTextAtCursor('> **Atenção:** [Insira sua observação ou aviso técnico aqui]\n\n'));

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

function extractJavaCodeBlocks(content) {
  const codeBlockRegex = /```java\r?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  let index = 1;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      id: index++,
      title: index === 2 ? "Código Praticado / Exemplo Principal" : `Código Praticado #${index - 1}`,
      code: match[1]
    });
  }
  return blocks;
}

function renderExplainerView() {
  if (!activeLesson) return;
  const rawText = activeLesson.contentLines.join('\n');
  const codeBlocks = extractJavaCodeBlocks(rawText);

  explainerCodeListEl.innerHTML = '';
  
  // Reset details card
  explainerDetailEmptyEl.style.display = 'flex';
  explainerDetailContentEl.style.display = 'none';

  if (codeBlocks.length === 0) {
    explainerCodeListEl.innerHTML = `
      <div style="padding: 40px; color: var(--text-muted); text-align: center;">
        <i data-lucide="code-2" style="width: 48px; height: 48px; stroke-width: 1.5; margin-bottom: 12px; color: var(--text-muted);"></i>
        <p>Esta aula não possui exemplos de código Java estruturados para explicação interativa.</p>
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
    titleDiv.innerHTML = `<i data-lucide="code-2"></i> ${block.title}`;
    blockDiv.appendChild(titleDiv);

    // Split code lines
    const lines = block.code.split(/\r?\n/);
    lines.forEach((lineText, idx) => {
      if (idx === lines.length - 1 && lineText.trim() === '') return;

      const lineDiv = document.createElement('div');
      lineDiv.className = 'explainer-line';
      
      const explanation = getLineExplanation(lineText);
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

        if (explanation) {
          explainerLineTitleEl.textContent = explanation.title;
          explainerLineCodeEl.textContent = lineText.trim();
          explainerLineDescEl.innerHTML = explanation.desc;
        } else {
          explainerLineTitleEl.textContent = "Instrução Java";
          explainerLineCodeEl.textContent = lineText.trim();
          explainerLineDescEl.innerHTML = `
            <p>Esta linha faz parte da estrutura lógica do seu programa Java.</p>
            <p>Dica: Clique nas linhas marcadas com uma borda lateral ciano para obter uma explicação didática dos conceitos-chave representados.</p>
          `;
        }
        
        if (typeof hljs !== 'undefined') {
          hljs.highlightElement(explainerLineCodeEl);
        }
      });

      blockDiv.appendChild(lineDiv);
    });

    explainerCodeListEl.appendChild(blockDiv);
  });

  lucide.createIcons();
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

