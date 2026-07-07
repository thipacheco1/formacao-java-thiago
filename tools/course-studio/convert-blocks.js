const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
const courseFilePath = path.join(rootDir, 'docs', 'curso-java-backend-thiago.md');
const backupPath = path.join(rootDir, 'docs', 'curso-java-backend-thiago.backup-convert.md');

console.log('Iniciando conversão de blocos de código...');
console.log(`Lendo arquivo: ${courseFilePath}`);

if (!fs.existsSync(courseFilePath)) {
  console.error(`Erro: Arquivo não encontrado em ${courseFilePath}`);
  process.exit(1);
}

// 1. Criar backup de segurança
fs.copyFileSync(courseFilePath, backupPath);
console.log(`Cópia de segurança criada em: ${backupPath}`);

// 2. Ler conteúdo
const content = fs.readFileSync(courseFilePath, 'utf8');
const lines = content.split(/\r?\n/);

const newLines = [];
let inCode = false;
let codeIndentation = 0;
let codeLines = [];

// Indicadores comuns de início de código Java indentado
const isJavaIndicator = /^\s{4,}(public\s+class|public\s+static|System\.out|import\s+java|Scanner\s+\w+|int\s+\w+|double\s+\w+|boolean\s+\w+|String\s+\w+|for\s*\(|while\s*\(|switch\s*\(|if\s*\(|do\s*\{|\/\/|int\[\]\s+\w+|String\[\]\s+\w+|double\[\]\s+\w+)/i;

let convertedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (!inCode) {
    // Verifica se a linha atende aos requisitos de início de bloco Java recuado
    const matchJava = line.match(isJavaIndicator);
    
    if (matchJava) {
      inCode = true;
      convertedCount++;
      const spaceMatch = line.match(/^(\s+)/);
      codeIndentation = spaceMatch ? spaceMatch[1].length : 4;
      
      newLines.push('```java');
      // Remove o recuo base (geralmente 4 espaços)
      const stripped = line.substring(codeIndentation);
      codeLines.push(stripped);
    } else {
      newLines.push(line);
    }
  } else {
    // Estamos dentro do bloco de código
    const isEmpty = line.trim() === '';
    const startsWithSpaces = /^\s+/.test(line);
    
    // O bloco de código acaba se encontrarmos uma linha que não seja vazia E não comece com espaço
    if (!isEmpty && !startsWithSpaces) {
      newLines.push(...codeLines);
      newLines.push('```');
      newLines.push(line);
      inCode = false;
      codeLines = [];
    } else {
      if (startsWithSpaces) {
        // Remove apenas o recuo base do início do bloco
        const stripped = line.substring(codeIndentation);
        codeLines.push(stripped);
      } else {
        // Linha vazia
        codeLines.push('');
      }
    }
  }
}

// Se o arquivo acabar e ainda estivermos em um bloco de código
if (inCode) {
  newLines.push(...codeLines);
  newLines.push('```');
}

// Gravar alterações de volta no arquivo
fs.writeFileSync(courseFilePath, newLines.join('\n'), 'utf8');

console.log(`\n======================================================`);
console.log(`✅ Conversão concluída com sucesso!`);
console.log(`📝 Total de blocos de código convertidos: ${convertedCount}`);
console.log(`📁 Arquivo atualizado: docs/curso-java-backend-thiago.md`);
console.log(`======================================================\n`);
