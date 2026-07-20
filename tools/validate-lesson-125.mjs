import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const componentPath = path.join(root, 'plataforma-curso/src/components/GuidedClassFilesLesson125.jsx');
const viewerPath = path.join(root, 'plataforma-curso/src/components/MarkdownViewer.jsx');
const cssPath = path.join(root, 'plataforma-curso/src/components/guidedClassFilesLesson.css');
const source = fs.readFileSync(componentPath, 'utf8');
const viewer = fs.readFileSync(viewerPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requireText = (text, needle, label) => {
  if (!text.includes(needle)) throw new Error(`Ausente: ${label}`);
};
requireText(viewer, "import('./GuidedClassFilesLesson125')", 'lazy import da aula 125');
requireText(viewer, "startsWith('125_')", 'roteamento da aula 125');
requireText(source, 'guided-class-files-lesson-125-progress', 'persistência por etapa');
if (!/completedSteps\.size\s*===\s*steps\.length/.test(source)) throw new Error('Ausente: bloqueio por todas as etapas');
if (!/scrollIntoView\([\s\S]*?inline:\s*["']center["']/.test(source)) throw new Error('Ausente: foco móvel');
requireText(source, 'const ERRORS = [', 'clínica de erros');
requireText(css, '.cf125-errors nav button>span:first-child', 'número estável da clínica');
requireText(css, '@media(max-width:520px)', 'responsividade móvel');

const stepCount = [...source.matchAll(/\{\s*id:\s*"[^"]+",\s*label:/g)].length;
const errorsBlock = source.match(/const ERRORS\s*=\s*\[([\s\S]*?)\];/);
const errorCount = errorsBlock ? [...errorsBlock[1].matchAll(/\[\s*"/g)].length : 0;
if (stepCount !== 11) throw new Error(`Esperadas 11 etapas; encontradas ${stepCount}`);
if (errorCount !== 8) throw new Error(`Esperados 8 erros; encontrados ${errorCount}`);

const constants = {};
for (const match of source.matchAll(/const ([A-Z_]+) = `([\s\S]*?)`;/g)) constants[match[1]] = match[2];
const files = {
  'ClienteArquivo125.java':'SINGLE_SOURCE',
  'PedidoEmUmArquivo125.java':'ONE_FILE_SOURCE',
  'PedidoSeparadoApp125.java':'PEDIDO_APP','PedidoSeparado125.java':'PEDIDO_ENTITY','ClienteSeparado125.java':'PEDIDO_CLIENT','DinheiroSeparado125.java':'PEDIDO_MONEY','StatusPedidoSeparado125.java':'PEDIDO_STATUS',
  'OrdemServicoApp125.java':'OS_APP','OrdemServicoSeparada125.java':'OS_ENTITY','CodigoOsSeparado125.java':'OS_CODE','PeriodoSeparado125.java':'OS_PERIOD','StatusOsSeparado125.java':'OS_STATUS','TurnoSeparado125.java':'OS_SHIFT',
  'ContratoApp125.java':'CONTRACT_APP','ContratoSeparado125.java':'CONTRACT_ENTITY','ClienteCorporativo125.java':'CONTRACT_CLIENT','ServicoContratado125.java':'CONTRACT_SERVICE','DinheiroContrato125.java':'CONTRACT_MONEY','PeriodoContrato125.java':'CONTRACT_PERIOD','StatusContratoSeparado125.java':'CONTRACT_STATUS','TesteArquivos125.java':'CONTRACT_TEST',
};
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-125-'));
try {
  for (const [file, key] of Object.entries(files)) {
    if (!constants[key]) throw new Error(`Fonte não encontrada: ${key}`);
    fs.writeFileSync(path.join(temp, file), constants[key]);
  }
  execFileSync('javac', Object.keys(files), { cwd: temp, stdio: 'pipe' });
  const runs = {
    ClienteArquivo125:['Cliente 10 | Ana Silva'],
    PedidoEmUmArquivo125:['Pedido 1001','R$ 399.80'],
    PedidoSeparadoApp125:['Pedido 1001','PAGO'],
    OrdemServicoApp125:['OS-2026-0001','2026-07-22 TARDE','REAGENDADA'],
    ContratoApp125:['CONT-001','ATIVO','R$ 600.00'],
    TesteArquivos125:['8 testes passaram'],
  };
  for (const [main, expected] of Object.entries(runs)) {
    const output = execFileSync('java', [main], { cwd: temp, encoding: 'utf8' });
    for (const fragment of expected) requireText(output, fragment, `${main}: ${fragment}`);
  }
  for (const [file, key] of [['DuasPublic125.java','INVALID_TWO_PUBLIC'],['ClienteNome125.java','INVALID_FILENAME']]) {
    const invalidDir = fs.mkdtempSync(path.join(temp, 'invalid-'));
    fs.writeFileSync(path.join(invalidDir, file), constants[key]);
    const result = spawnSync('javac', [file], { cwd: invalidDir, encoding:'utf8' });
    if (result.status === 0) throw new Error(`${file} deveria falhar na compilação`);
  }
  console.log('Aula 125 validada: UI, 11 etapas, 8 erros, 21 fontes válidas, 2 falhas intencionais e 6 execuções.');
} finally {
  fs.rmSync(temp, { recursive:true, force:true });
}
