const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const rootDir = path.resolve(__dirname, '../..');
const courseFilePath = path.join(rootDir, 'docs', 'curso-java-backend-thiago.md');
const diaryFilePath = path.join(rootDir, 'docs', 'diario-de-bordo.md');
const backupsDir = path.join(__dirname, 'backups');

// Ensure backups directory exists
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

// -------------------------------------------------------------
// Parsers & Rebuilder
// -------------------------------------------------------------

function parseCourse(filePath) {
  const aulasDir = path.join(path.dirname(filePath), 'aulas');
  let content = '';
  
  if (fs.existsSync(aulasDir)) {
    const files = fs.readdirSync(aulasDir)
      .filter(f => f.endsWith('.md'))
      .sort();
      
    if (files.length > 0) {
      content = files.map(f => fs.readFileSync(path.join(aulasDir, f), 'utf8')).join('\n\n---\n\n');
    }
  }
  
  if (!content) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo do curso não encontrado: ${filePath}`);
    }
    content = fs.readFileSync(filePath, 'utf8');
  }

  const lines = content.split(/\r?\n/);
  const introLines = [];
  const modules = [];
  let currentModule = null;
  let currentLesson = null;
  
  const moduleRegex = /^#\s+Módulo\s+([\w\d]+)\s*[-—–:]\s*(.*)$/i;
  const lessonRegex = /^##\s+Aula\s+([\w\d.]+)\s*[-—–:]\s*(.*)$/i;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const modMatch = line.match(moduleRegex);
    const lesMatch = line.match(lessonRegex);
    
    if (modMatch) {
      const modId = modMatch[1];
      const modTitle = modMatch[2].trim();
      let existingMod = modules.find(m => m.id === modId);
      if (existingMod) {
        currentModule = existingMod;
      } else {
        currentModule = {
          id: modId,
          title: modTitle,
          lessons: [],
          introLines: []
        };
        modules.push(currentModule);
      }
      currentLesson = null;
    } else if (lesMatch) {
      if (!currentModule) {
        currentModule = {
          id: '0',
          title: 'Geral',
          lessons: [],
          introLines: []
        };
        modules.push(currentModule);
      }
      currentLesson = {
        id: lesMatch[1],
        title: lesMatch[2].trim(),
        contentLines: []
      };
      currentModule.lessons.push(currentLesson);
    } else {
      if (currentLesson) {
        currentLesson.contentLines.push(line);
      } else if (currentModule) {
        currentModule.introLines.push(line);
      } else {
        introLines.push(line);
      }
    }
  }
  
  return { introLines, modules };
}

function rebuildCourse(introLines, modules) {
  let output = [];
  output.push(...introLines);
  
  for (const mod of modules) {
    output.push(`# Módulo ${mod.id} — ${mod.title}`);
    output.push(...mod.introLines);
    
    for (const les of mod.lessons) {
      output.push(`## Aula ${les.id} — ${les.title}`);
      output.push(...les.contentLines);
    }
  }
  // Ensure we end with a single newline
  return output.join('\n');
}

function parseDiary(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const sections = content.split(/(?=^## Aula )/m);
  
  const statusMap = {};
  const lessonRegex = /^## Aula ([\d.]+)\s*[-—–:]\s*(.*)$/i;
  
  for (const section of sections) {
    const lines = section.split(/\r?\n/);
    if (lines.length === 0) continue;
    const header = lines[0];
    const match = header.match(lessonRegex);
    if (match) {
      const lessonId = match[1];
      let status = 'Pendente';
      let statusFound = false;
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('### Status')) {
          statusFound = true;
          continue;
        }
        if (statusFound && line.length > 0) {
          if (line.toLowerCase().includes('concluída') || line.toLowerCase().includes('concluida')) {
            status = 'Concluída';
          } else if (line.toLowerCase().includes('em andamento')) {
            status = 'Em andamento';
          }
          break;
        }
      }
      statusMap[lessonId] = status;
    }
  }
  return statusMap;
}

function updateDiaryStatus(filePath, lessonId, status, lessonTitle) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `# Diário de Bordo - Formação Java Backend\n\n`, 'utf8');
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  
  const lessonRegex = new RegExp(`^## Aula ${lessonId.replace('.', '\\.')}\\b`, 'i');
  let lessonLineIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(lessonRegex)) {
      lessonLineIndex = i;
      break;
    }
  }
  
  const statusStr = status === 'Concluída' ? 'Concluída.' : 'Em andamento.';
  
  if (lessonLineIndex !== -1) {
    let statusLineIndex = -1;
    for (let i = lessonLineIndex + 1; i < lines.length; i++) {
      if (lines[i].startsWith('## Aula ')) break;
      if (lines[i].trim() === '### Status') {
        statusLineIndex = i;
        break;
      }
    }
    
    if (statusLineIndex !== -1) {
      let updated = false;
      for (let i = statusLineIndex + 1; i < lines.length; i++) {
        if (lines[i].startsWith('## Aula ')) break;
        if (lines[i].trim() !== '') {
          lines[i] = statusStr;
          updated = true;
          break;
        }
      }
      if (!updated) {
        lines.splice(statusLineIndex + 1, 0, '', statusStr);
      }
    } else {
      let insertIndex = lines.length;
      for (let i = lessonLineIndex + 1; i < lines.length; i++) {
        if (lines[i].startsWith('## Aula ')) {
          insertIndex = i;
          break;
        }
      }
      lines.splice(insertIndex, 0, '', '### Status', statusStr, '');
    }
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  } else {
    const newEntry = [
      '',
      '---',
      '',
      `## Aula ${lessonId} - ${lessonTitle}`,
      '',
      '### O que foi feito',
      '- Estudado e revisado através do Java Course Studio.',
      '',
      '### Status',
      statusStr,
      ''
    ].join('\n');
    fs.appendFileSync(filePath, newEntry, 'utf8');
  }
}

// Helper to keep backups limited
function cleanOldBackups() {
  fs.readdir(backupsDir, (err, files) => {
    if (err) return;
    const backups = files
      .filter(f => f.startsWith('curso-java-backend-thiago.backup-'))
      .map(f => ({ name: f, time: fs.statSync(path.join(backupsDir, f)).mtime.getTime() }))
      .sort((a, b) => b.time - a.time); // newest first

    if (backups.length > 20) {
      for (let i = 20; i < backups.length; i++) {
        fs.unlink(path.join(backupsDir, backups[i].name), () => {});
      }
    }
  });
}

// -------------------------------------------------------------
// Server & Routing
// -------------------------------------------------------------

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API: Get course content and diary progress
  if (url === '/api/data' && method === 'GET') {
    try {
      const courseData = parseCourse(courseFilePath);
      const diaryStatus = parseDiary(diaryFilePath);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        introLines: courseData.introLines,
        modules: courseData.modules,
        diaryStatus: diaryStatus
      }));
    } catch (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // API: Save lesson text
  if (url === '/api/save-lesson' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { lessonId, title, content } = JSON.parse(body);
        if (!lessonId || !content) {
          throw new Error('lessonId e content são obrigatórios.');
        }

        const aulasDir = path.join(path.dirname(courseFilePath), 'aulas');
        let savedInModular = false;
        let backupCreated = '';
        
        if (fs.existsSync(aulasDir)) {
          const files = fs.readdirSync(aulasDir).filter(f => f.endsWith('.md'));
          const targetFile = files.find(f => f.toLowerCase().startsWith(lessonId.toLowerCase() + '-') || f.toLowerCase() === lessonId.toLowerCase() + '.md');
          
          if (targetFile) {
            const targetFilePath = path.join(aulasDir, targetFile);
            
            // Backup existing file before saving
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = path.join(backupsDir, `${path.basename(targetFile)}.backup-${timestamp}.md`);
            fs.copyFileSync(targetFilePath, backupPath);
            backupCreated = path.basename(backupPath);
            cleanOldBackups();
            
            // Reconstruct the file content preserving module header if it exists
            const fileContent = fs.readFileSync(targetFilePath, 'utf8');
            const fileLines = fileContent.split(/\r?\n/);
            let moduleHeader = '';
            for (const line of fileLines) {
              if (line.trim().startsWith('# Módulo')) {
                moduleHeader = line.trim();
                break;
              }
            }
            
            let newFileContent = '';
            if (moduleHeader) {
              newFileContent += moduleHeader + '\n\n';
            }
            newFileContent += `## Aula ${lessonId} — ${title || 'Sem título'}\n\n`;
            newFileContent += content;
            
            fs.writeFileSync(targetFilePath, newFileContent, 'utf8');
            savedInModular = true;
          }
        }
        
        if (!savedInModular) {
          // Parse existing course structure
          const courseData = parseCourse(courseFilePath);
  
          // Find the lesson and update its content
          let found = false;
          for (const mod of courseData.modules) {
            for (const les of mod.lessons) {
              if (les.id === lessonId) {
                les.title = title || les.title;
                les.contentLines = content.split(/\r?\n/);
                found = true;
                break;
              }
            }
            if (found) break;
          }
  
          if (!found) {
            throw new Error(`Aula com id ${lessonId} não encontrada no curso.`);
          }
  
          // Backup existing file before saving
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const backupPath = path.join(backupsDir, `curso-java-backend-thiago.backup-${timestamp}.md`);
          fs.copyFileSync(courseFilePath, backupPath);
          backupCreated = path.basename(backupPath);
          cleanOldBackups();
  
          // Write the rebuilt content back
          const newMarkdown = rebuildCourse(courseData.introLines, courseData.modules);
          fs.writeFileSync(courseFilePath, newMarkdown, 'utf8');
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, backupCreated }));
      } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API: Update lesson progress status in diary
  if (url === '/api/save-status' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { lessonId, lessonTitle, status } = JSON.parse(body);
        if (!lessonId || !status || !lessonTitle) {
          throw new Error('lessonId, lessonTitle e status são obrigatórios.');
        }

        updateDiaryStatus(diaryFilePath, lessonId, status, lessonTitle);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static files serving
  let filePath = path.join(__dirname, url === '/' ? 'index.html' : url);
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Página Não Encontrada</h1>', 'utf8');
      } else {
        res.writeHead(500);
        res.end(`Erro no servidor: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n======================================================`);
  console.log(`🚀 Java Course Studio rodando em: ${url}`);
  console.log(`📁 Monitorando: docs/curso-java-backend-thiago.md`);
  console.log(`📁 Sincronizando com: docs/diario-de-bordo.md`);
  console.log(`======================================================\n`);

  // Open in browser
  const startCommand = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${startCommand} ${url}`, (err) => {
    if (err) {
      console.log(`Por favor, abra o navegador e acesse manualmente: ${url}`);
    }
  });
});
