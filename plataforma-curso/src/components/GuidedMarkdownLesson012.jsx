import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpen, Braces, Check,
  CheckCircle2, ClipboardCheck, Clock3, Code2, Copy, Eye, FileCode2, FilePlus2,
  FileText, FolderTree, GitCommitHorizontal, Heading, Image, Italic, Keyboard,
  Lightbulb, Link2, List, ListChecks, PanelLeftClose, Play, Quote,
  RefreshCw, RotateCcw, Search, ShieldCheck, Table2, TerminalSquare, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedMarkdownLesson.css';

const STORAGE_KEY = 'guided-markdown-lesson-012-progress';

const README_SECTIONS = [
  ['identidade', '# Formação Java Backend\n\nRepositório de estudos, práticas e evolução técnica em Java Backend.'],
  ['estrutura', '## Estrutura\n\n- `docs`: documentação e registros técnicos.\n- `src`: código-fonte dos exemplos.\n- `labs`: laboratórios preservados para estudo.'],
  ['ambiente', '## Ambiente\n\n```powershell\njava -version\njavac -version\ngit --version\n```'],
  ['git', '## Git\n\n```bash\ngit status\ngit log --oneline\n```'],
  ['navegacao', '## Navegação\n\n- [Comandos úteis](docs/comandos.md)\n- [Atalhos do IntelliJ](docs/atalhos.md)\n\n![Mapa das três áreas do Git](docs/imagens/tres-areas-git.png)'],
  ['validacao', '## Checklist inicial\n\n- [x] JDK instalado\n- [x] Git configurado\n- [ ] Repositório remoto validado\n\n> Nunca registre senha, token ou chave privada neste repositório.']
];

const DOCS = {
  comandos: {
    file: 'docs/comandos.md',
    purpose: 'Repertório operacional que evita depender da memória.',
    source: '# Comandos úteis\n\n## Git\n\n| Comando | Uso |\n|---|---|\n| `git status` | Inspeciona o estado |\n| `git diff` | Revisa mudanças |\n| `git log --oneline` | Resume o histórico |'
  },
  atalhos: {
    file: 'docs/atalhos.md',
    purpose: 'Ações recorrentes organizadas por ferramenta, não uma lista solta.',
    source: '# Atalhos\n\n## IntelliJ\n\n| Ação | Atalho | Observação |\n|---|---|---|\n| Buscar ação | `Ctrl + Shift + A` | Localiza ações pelo nome |\n| Terminal | `Alt + F12` | Abre o terminal integrado |\n| Project | `Alt + 1` | Foca a árvore do projeto |\n| Buscar no projeto | `Ctrl + Shift + F` | Procura em todos os arquivos |\n| Renomear | `Shift + F6` | Renomeia com suporte da IDE |'
  },
  diario: {
    file: 'docs/diario-de-bordo.md',
    purpose: 'Ponte mínima para a Aula 013, onde a rotina de rastreabilidade será praticada.',
    source: '# Diário de bordo\n\n## Aula 012 — Markdown\n\n- **Aprendi:** estruturar documentação técnica.\n- **Pratiquei:** editor, preview e README.\n- **Preciso revisar:** caminhos relativos.\n- **Próximo passo:** construir uma rotina sustentável na Aula 013.'
  },
  api: {
    file: 'docs/api-pedidos.md',
    purpose: 'Contrato legível antes de OpenAPI e testes de contrato.',
    source: '# Criar pedido\n\n## Endpoint\n\n`POST /pedidos`\n\n## Request\n\n```json\n{\n  "clienteId": 10,\n  "quantidade": 2\n}\n```\n\n## Response `201 Created`\n\n```json\n{\n  "id": 1,\n  "status": "CRIADO"\n}\n```'
  },
  adr: {
    file: 'docs/decisoes/adr-001-postgresql.md',
    purpose: 'Registra contexto, decisão e consequências para não depender de memória oral.',
    source: '# ADR 001 — PostgreSQL\n\n## Status\n\nAceita\n\n## Contexto\n\nO sistema precisa de integridade transacional.\n\n## Decisão\n\nUsar PostgreSQL como banco principal.\n\n## Consequências\n\n- Suporte a transações ACID.\n- Migrações de schema precisam ser controladas.'
  },
  checklist: {
    file: 'docs/checklist-pedido.md',
    purpose: 'Orienta validação manual sem fingir que substitui teste automatizado.',
    source: '# Checklist — Cadastro de pedido\n\n- [ ] Cria pedido válido.\n- [ ] Rejeita pedido sem cliente.\n- [ ] Rejeita pedido sem item.\n- [ ] Calcula o total corretamente.\n- [ ] Retorna `201 Created`.\n- [ ] Retorna `400 Bad Request` para entrada inválida.'
  }
};

const ERRORS = [
  ['Pular de `#` para `####`', 'A hierarquia perde continuidade.', 'Use `#`, depois `##` e só então `###` quando houver subseção.', 'O outline mostra uma árvore coerente.'],
  ['Comandos no meio do parágrafo', 'Instruções diferentes viram uma linha ambígua.', 'Use código inline para um comando ou bloco cercado para uma sequência.', 'Cada comando permanece copiável e legível.'],
  ['Cerca de código sem fechar', 'Todo o restante pode ser interpretado como código.', 'Adicione as três crases finais e confira o preview.', 'O texto seguinte volta a renderizar como parágrafo.'],
  ['Bloco sem linguagem', 'O conteúdo aparece, mas perde destaque e assistência da IDE.', 'Especifique `java`, `powershell`, `bash`, `json` ou a linguagem real.', 'Cores e inspeções correspondem ao conteúdo.'],
  ['Link relativo quebrado', 'O caminho foi calculado a partir da pasta errada.', 'Parta da localização do arquivo atual e use `../` somente quando necessário.', 'Abra o link no preview e no GitHub.'],
  ['Imagem sem texto alternativo', 'Quem não recebe a imagem perde a informação.', 'Escreva um equivalente textual curto e mantenha explicação no corpo.', 'O alt ainda comunica o papel quando a imagem falha.'],
  ['Tabela sem linha separadora', 'Cabeçalho e linhas aparecem como texto comum.', 'Inclua `|---|---|` com a mesma quantidade lógica de colunas.', 'O preview exibe células e cabeçalho.'],
  ['README sem objetivo ou ação', 'O leitor não sabe o que é nem como começar.', 'Responda objetivo, pré-requisitos, execução, teste e cuidado relevante.', 'Uma pessoa nova consegue agir sem explicação oral.'],
  ['Comando, porta ou versão desatualizada', 'A documentação espalha uma falha reproduzível.', 'Teste o comando e atualize a documentação no mesmo trabalho que mudou o projeto.', 'O roteiro executa no ambiente declarado.'],
  ['Senha, token ou dado real no Markdown', 'Texto puro versionado preserva e distribui o segredo.', 'Pare, remova antes do commit; se já publicou, revogue ou rotacione primeiro.', 'Diff e histórico não contêm a credencial ativa.']
];

const steps = [
  { id: 'mapa', label: 'Ver a transformação', duration: '7 min', eyebrow: 'Comece aqui', title: 'Veja o mesmo conteúdo como fonte, estrutura e histórico', blocks: [{ type: 'lead', text: 'Markdown é texto puro com marcadores de intenção. O arquivo continua legível no editor, o renderizador cria estrutura visual e o Git registra mudanças linha por linha.' }, { type: 'pipeline' }, { type: 'note', tone: 'info', title: 'O objetivo não é decorar símbolos', text: 'Você aprenderá a escolher a estrutura que ajuda uma pessoa a entender, executar, validar ou decidir.' }] },
  { id: 'intellij', label: 'Criar e abrir preview', duration: '14 min', eyebrow: 'Etapa 1', title: 'Crie o README no lugar certo e localize cada modo do IntelliJ', blocks: [{ type: 'lead', text: 'Abra a raiz do projeto no painel Project. Crie README.md na raiz, não dentro de src. O IntelliJ reconhece .md e oferece editor, preview ou divisão dos dois.' }, { type: 'intellij' }, { type: 'note', tone: 'warning', title: 'Se o preview não existir', text: 'Abra Settings → Plugins → Installed, procure Markdown e confirme que o plugin está habilitado. Keymaps variam; Ctrl + Shift + A encontra a ação pelo nome.' }] },
  { id: 'estrutura', label: 'Organizar a hierarquia', duration: '13 min', eyebrow: 'Etapa 2', title: 'Construa títulos e parágrafos que formam uma árvore coerente', blocks: [{ type: 'lead', text: 'Use um único título principal, seções para perguntas maiores e subseções apenas quando o conteúdo realmente pertence à seção anterior.' }, { type: 'structure' }] },
  { id: 'elementos', label: 'Escrever elementos básicos', duration: '17 min', eyebrow: 'Etapa 3', title: 'Use ênfase, listas, checklist e código inline por intenção', blocks: [{ type: 'lead', text: 'Texto explica; lista agrupa; numeração ordena; checklist acompanha estado; código inline separa nomes técnicos. Negrito e itálico não devem transformar tudo em urgente.' }, { type: 'elements' }] },
  { id: 'codigo', label: 'Documentar código', duration: '18 min', eyebrow: 'Etapa 4', title: 'Abra e feche cercas, informe a linguagem e respeite o shell', blocks: [{ type: 'lead', text: 'Três crases delimitam um bloco. A palavra logo depois informa ao editor e ao renderizador qual linguagem deve receber destaque e inspeção.' }, { type: 'fences' }, { type: 'note', tone: 'danger', title: 'Contexto faz parte do comando', text: 'Não entregue um comando Linux destrutivo a quem está no PowerShell sem explicar ambiente, efeito e alternativa segura. Documente somente comandos testados.' }] },
  { id: 'caminhos', label: 'Criar links e imagens', duration: '18 min', eyebrow: 'Etapa 5', title: 'Calcule caminhos a partir do arquivo atual e preserve a informação sem imagem', blocks: [{ type: 'lead', text: 'Links relativos continuam úteis para quem clona o repositório. O caminho parte da pasta do arquivo Markdown atual; mover o arquivo pode mudar a rota.' }, { type: 'paths' }] },
  { id: 'estrutura-avancada', label: 'Montar tabela e citação', duration: '14 min', eyebrow: 'Etapa 6', title: 'Use estruturas auxiliares quando elas simplificam a leitura', blocks: [{ type: 'lead', text: 'Tabela compara colunas; citação destaca uma ideia; linha horizontal separa blocos grandes; escape mostra um marcador literalmente. Nenhum deles deve substituir uma boa hierarquia.' }, { type: 'tableLab' }] },
  { id: 'readme', label: 'Construir um README útil', duration: '22 min', eyebrow: 'Etapa 7', title: 'Responda às perguntas do leitor em vez de preencher um modelo vazio', blocks: [{ type: 'lead', text: 'Uma pessoa nova precisa descobrir o que é o projeto, onde estão os arquivos, como validar o ambiente, como inspecionar o Git e quais cuidados respeitar.' }, { type: 'readme' }] },
  { id: 'aplicacoes', label: 'Escolher o documento certo', duration: '20 min', eyebrow: 'Etapa 8', title: 'Mude a estrutura quando a intenção muda', blocks: [{ type: 'lead', text: 'README apresenta; comandos guardam repertório; atalhos apoiam operação; diário registra sua experiência; API descreve contrato; checklist orienta validação; ADR registra decisão.' }, { type: 'gallery' }, { type: 'note', tone: 'info', title: 'Limite com a próxima aula', text: 'Aqui o diário aparece somente como exemplo de documento. A Aula 013 ensinará entrada cronológica, erros, revisão semanal, rastreabilidade e sustentabilidade.' }] },
  { id: 'diagnostico', label: 'Recuperar renderização', duration: '20 min', eyebrow: 'Etapa 9', title: 'Leia o sintoma no preview antes de alterar marcadores ao acaso', blocks: [{ type: 'lead', text: 'Markdown quebrado costuma deixar uma pista: hierarquia estranha, bloco que engole o documento, link que aponta à pasta errada ou tabela que continua sendo texto.' }, { type: 'errors' }] },
  { id: 'entrega', label: 'Versionar e transferir', duration: '22 min', eyebrow: 'Etapa 10', title: 'Revise três arquivos, registre um commit e entregue documentação que outra pessoa consegue usar', blocks: [{ type: 'lead', text: 'Atualize README.md, docs/atalhos.md e um diário mínimo. Depois revise exatamente essas mudanças antes de criar o commit.' }, { type: 'delivery' }, { type: 'result', title: 'Critérios profissionais desta entrega', items: ['README responde objetivo, estrutura e validação', 'Código possui linguagem e contexto corretos', 'Link relativo e imagem possuem caminho verificado', 'Imagem possui texto alternativo e explicação essencial', 'Nenhum segredo ou dado real aparece no diff', 'Commit registra a intenção da documentação'] }, { type: 'challenge', title: 'Desafio: documente um laboratório que outra pessoa nunca viu', text: 'Escolha um laboratório Java já criado e escreva um README próprio com pré-requisitos, árvore mínima, comando testado, saída esperada, um link relativo, uma imagem com alt, uma tabela pequena e uma falha conhecida.', acceptance: ['Fonte continua legível sem preview', 'Preview não possui bloco ou tabela quebrados', 'Comando declara o ambiente e foi testado', 'Leitor consegue executar sem explicação oral', 'git diff --staged contém somente arquivos pretendidos', 'Working tree termina limpo após o commit'] }] }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return <button type="button" className="guided-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function MarkdownPreview({ source }) {
  return <div className="md12-rendered"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const value = String(children).replace(/\n$/, '');
      if (!match) return <code {...props}>{children}</code>;
      return <SyntaxHighlighter language={match[1]} style={vscDarkPlus} wrapLongLines customStyle={{ margin: '9px 0', padding: '13px', background: '#0d1117', fontSize: '.69rem', lineHeight: 1.55 }}>{value}</SyntaxHighlighter>;
    },
    img({ alt }) {
      return <figure className="md12-image-placeholder"><Image size={28} /><figcaption><strong>Imagem do repositório</strong><span>{alt || 'Sem texto alternativo'}</span></figcaption></figure>;
    }
  }}>{source}</ReactMarkdown></div>;
}

function SourcePreview({ source, file = 'README.md', caption }) {
  return <section className="md12-workbench"><div className="md12-source"><header><span><FileCode2 size={16} /> {file}</span><CopyButton value={source} /></header><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines showLineNumbers customStyle={{ margin: 0, padding: '15px', background: '#0d1117', fontSize: '.7rem', lineHeight: 1.58 }}>{source}</SyntaxHighlighter></div><div className="md12-preview"><header><Eye size={16} /><span>Preview renderizado</span><em>Simulação didática</em></header><MarkdownPreview source={source} /></div>{caption && <footer><CheckCircle2 size={16} /> {caption}</footer>}</section>;
}

function Pipeline() {
  const [view, setView] = useState('preview');
  const source = '# API de Pedidos\n\nExecute `mvn test` antes de publicar.\n\n- documentação legível\n- alteração versionável';
  return <section className="md12-pipeline"><nav>{[['source', 'Texto puro'], ['preview', 'Preview'], ['diff', 'Git diff']].map(([id, label]) => <button type="button" className={view === id ? 'active' : ''} onClick={() => setView(id)} key={id}>{label}</button>)}</nav><div className="md12-pipeline-flow"><article><FileText size={26} /><small>Entrada</small><strong>README.md</strong><span>legível em qualquer editor</span></article><span><ArrowRight /><b>{view === 'source' ? 'salvar' : view === 'preview' ? 'renderizar' : 'comparar linhas'}</b></span><article>{view === 'preview' ? <Eye size={26} /> : view === 'diff' ? <GitCommitHorizontal size={26} /> : <Code2 size={26} />}<small>Estado observado</small><strong>{view === 'preview' ? 'Documento estruturado' : view === 'diff' ? '+ linha adicionada' : 'Texto preservado'}</strong><span>{view === 'preview' ? 'título, código e lista' : view === 'diff' ? 'mudança pequena e revisável' : 'sem formato proprietário'}</span></article></div>{view === 'preview' ? <MarkdownPreview source={source} /> : <pre>{view === 'diff' ? '+ Execute `mvn test` antes de publicar.\n+ - documentação legível\n+ - alteração versionável' : source}</pre>}</section>;
}

function IntelliJMock() {
  const [file, setFile] = useState(false);
  const [mode, setMode] = useState('split');
  const [plugin, setPlugin] = useState(true);
  const source = '# Formação Java Backend\n\nDocumentação que acompanha o código.';
  return <section className="md12-idea"><aside><header><FolderTree size={16} /> Project <em>Simulação didática</em></header><div><strong>formacao-java-backend</strong><span>▾ docs</span><span>▸ src</span>{file && <span className="selected">M↓ README.md</span>}</div><button type="button" onClick={() => setFile(true)} disabled={file}><FilePlus2 size={15} /> {file ? 'README.md criado' : 'New → File → README.md'}</button></aside><main><header><span>{file ? 'README.md' : 'Nenhum arquivo aberto'}</span><nav><button type="button" className={mode === 'editor' ? 'active' : ''} onClick={() => setMode('editor')}><FileCode2 size={15} /> Editor</button><button type="button" className={mode === 'split' ? 'active' : ''} onClick={() => setMode('split')}><PanelLeftClose size={15} /> Editor e Preview</button><button type="button" className={mode === 'preview' ? 'active' : ''} onClick={() => setMode('preview')}><Eye size={15} /> Preview</button></nav></header>{!file ? <div className="md12-idea-empty"><FilePlus2 size={34} /><h3>Crie o arquivo na raiz</h3><p>Use o painel Project ou Alt + Insert. A extensão precisa ser .md ou .markdown.</p></div> : !plugin ? <div className="md12-plugin"><AlertTriangle size={31} /><h3>Preview indisponível</h3><p>Settings → Plugins → Installed → Markdown → Enable</p><button type="button" onClick={() => setPlugin(true)}>Habilitar na simulação</button></div> : <div className={'md12-idea-editor ' + mode}>{mode !== 'preview' && <SyntaxHighlighter language="markdown" style={vscDarkPlus} customStyle={{ margin: 0, padding: '16px', background: '#1e1f22', fontSize: '.72rem', lineHeight: 1.6 }}>{source}</SyntaxHighlighter>}{mode !== 'editor' && <MarkdownPreview source={source} />}</div>}<footer><button type="button" onClick={() => setPlugin(value => !value)}>{plugin ? 'Simular plugin desabilitado' : 'Restaurar plugin'}</button><span><Keyboard size={14} /> Ctrl + Shift + A: buscar “Markdown Preview”</span></footer></main></section>;
}

function StructureLab() {
  const [valid, setValid] = useState(true);
  const good = '# Formação Java Backend\n\nRepositório de estudos práticos.\n\n## Como executar\n\nValide o ambiente antes de iniciar.\n\n### Verificar o JDK\n\nExecute `java -version`.\n\n## Como testar\n\nExecute os testes antes do commit.';
  const bad = '# Formação Java Backend\n\n#### Como executar\n\nTudo sobre setup, testes, Git, arquitetura e outras coisas em um único parágrafo muito longo que mistura várias intenções e dificulta localizar a ação principal.\n\n## Como executar\n\n## Testes';
  const source = valid ? good : bad;
  return <section className="md12-structure"><div role="tablist"><button type="button" className={valid ? 'active' : ''} onClick={() => setValid(true)}>Hierarquia coerente</button><button type="button" className={!valid ? 'active danger' : ''} onClick={() => setValid(false)}>Documento quebrado</button></div><SourcePreview source={source} caption={valid ? 'Um H1 identifica o documento; H2 separa perguntas; H3 detalha uma seção.' : 'O salto de nível, título duplicado e parágrafo sem foco dificultam o outline.'} /><aside className={valid ? 'good' : 'danger'}><Heading size={21} /><div><strong>Outline</strong>{(valid ? ['Formação Java Backend', '↳ Como executar', '  ↳ Verificar o JDK', '↳ Como testar'] : ['Formação Java Backend', '    ↳ Como executar', '↳ Como executar', '↳ Testes']).map(item => <span key={item}>{item}</span>)}</div></aside></section>;
}

function ElementsLab() {
  const [type, setType] = useState('inline');
  const cases = {
    inline: ['Ênfase e código inline', 'Use **negrito** para um alerta pontual e *itálico* para ênfase leve.\n\nExecute `git status`; o arquivo `README.md` fica na raiz.'],
    unordered: ['Lista não ordenada', 'O projeto contém:\n\n- código-fonte Java\n- documentação técnica\n- laboratórios reproduzíveis'],
    ordered: ['Lista ordenada', 'Para validar:\n\n1. Abra o terminal.\n2. Execute `mvn test`.\n3. Confira o resultado.'],
    checklist: ['Checklist', '## Preparação\n\n- [x] JDK instalado\n- [x] Git configurado\n- [ ] README revisado\n- [ ] Push realizado']
  };
  return <section className="md12-elements"><nav>{Object.keys(cases).map(id => <button type="button" className={type === id ? 'active' : ''} onClick={() => setType(id)} key={id}>{id === 'inline' ? <Italic size={16} /> : id === 'checklist' ? <ListChecks size={16} /> : <List size={16} />}{cases[id][0]}</button>)}</nav><SourcePreview source={cases[type][1]} caption={type === 'checklist' ? 'No GitHub Flavored Markdown, [x] registra concluído e [ ] registra pendente.' : 'O marcador foi escolhido pela função que exerce no texto.'} /></section>;
}

function FenceLab() {
  const [language, setLanguage] = useState('powershell');
  const cases = {
    powershell: ['Windows PowerShell', '```powershell\nSet-Location C:\\dev\\projects\nGet-ChildItem\njava -version\n```'],
    bash: ['Git genérico', '```bash\ngit status\ngit diff\ngit log --oneline\n```'],
    java: ['Java', '```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Documentado");\n    }\n}\n```'],
    json: ['Contrato JSON', '```json\n{\n  "id": 1,\n  "status": "CRIADO"\n}\n```'],
    sql: ['SQL', '```sql\nselect id, status\nfrom pedido\nwhere id = 1;\n```']
  };
  return <section className="md12-fences"><nav>{Object.keys(cases).map(id => <button type="button" className={language === id ? 'active' : ''} onClick={() => setLanguage(id)} key={id}>{id}</button>)}</nav><SourcePreview source={cases[language][1]} caption={'A cerca foi fechada e a linguagem corresponde a ' + cases[language][0] + '.'} /><div className="md12-fence-anatomy"><span><strong>1</strong> três crases abrem</span><ArrowRight /><span><strong>2</strong> linguagem ativa destaque</span><ArrowRight /><span><strong>3</strong> três crases fecham</span></div></section>;
}

function PathsLab() {
  const [document, setDocument] = useState('root');
  const [kind, setKind] = useState('internal');
  const cases = {
    internal: { label: 'Link interno', root: '[Diário de bordo](docs/diario-de-bordo.md)', nested: '[Voltar ao README](../README.md)', destination: document === 'root' ? 'docs/diario-de-bordo.md' : 'README.md' },
    external: { label: 'Link externo', root: '[Documentação do Java](https://docs.oracle.com/en/java/)', nested: '[Documentação do Java](https://docs.oracle.com/en/java/)', destination: 'https://docs.oracle.com/en/java/' },
    image: { label: 'Imagem acessível', root: '![Fluxo local e remoto](docs/imagens/fluxo-git.png)\n\nO fluxo mostra commits locais sendo publicados em `origin/main`.', nested: '![Fluxo local e remoto](imagens/fluxo-git.png)\n\nO fluxo mostra commits locais sendo publicados em `origin/main`.', destination: 'docs/imagens/fluxo-git.png' },
    broken: { label: 'Caminho quebrado', root: '[Guia Git](git.md)', nested: '[Guia Git](docs/git.md)', destination: 'arquivo não encontrado a partir da pasta atual' }
  };
  const current = cases[kind];
  const source = current[document];
  const valid = kind !== 'broken';
  return <section className="md12-paths"><header><div><small>Arquivo atual</small><button type="button" className={document === 'root' ? 'active' : ''} onClick={() => setDocument('root')}>/README.md</button><button type="button" className={document === 'nested' ? 'active' : ''} onClick={() => setDocument('nested')}>/docs/guia.md</button></div><nav>{Object.keys(cases).map(id => <button type="button" className={kind === id ? 'active' : ''} onClick={() => setKind(id)} key={id}>{cases[id].label}</button>)}</nav></header><SourcePreview source={source} file={document === 'root' ? 'README.md' : 'docs/guia.md'} /><aside className={valid ? 'good' : 'danger'}>{valid ? <Link2 size={21} /> : <AlertTriangle size={21} />}<div><strong>{valid ? 'Destino resolvido' : 'Link quebrado'}</strong><code>{current.destination}</code><span>{kind === 'image' ? 'O alt comunica a função quando a imagem não carrega; o parágrafo preserva a explicação.' : valid ? 'Confirme abrindo no preview e depois no GitHub.' : 'Recalcule a partir da pasta do arquivo atual, não da raiz imaginada.'}</span></div></aside></section>;
}

function TableLab() {
  const [element, setElement] = useState('table');
  const cases = {
    table: ['Tabela', '| Comando | Função |\n|---|---|\n| `git status` | Mostra o estado |\n| `git diff` | Mostra alterações |'],
    quote: ['Citação', '> Debug troca chute por evidência.\n\nA explicação principal continua no corpo do documento.'],
    rule: ['Linha horizontal', '## Preparação\n\nValide o ambiente.\n\n---\n\n## Execução\n\nRode o projeto.'],
    escape: ['Escape', 'Mostre um marcador literalmente: \\*não é itálico\\*.\n\nPara termos técnicos, prefira `*asterisco*` como código inline.']
  };
  return <section className="md12-table-lab"><nav>{Object.keys(cases).map(id => <button type="button" className={element === id ? 'active' : ''} onClick={() => setElement(id)} key={id}>{id === 'table' ? <Table2 size={16} /> : id === 'quote' ? <Quote size={16} /> : <Braces size={16} />}{cases[id][0]}</button>)}</nav><SourcePreview source={cases[element][1]} caption={element === 'table' ? 'Cabeçalho, separador e linhas mantêm duas colunas lógicas.' : 'Use este elemento apenas quando ele melhora a leitura.'} /></section>;
}

function ReadmeBuilder() {
  const [count, setCount] = useState(1);
  const source = README_SECTIONS.slice(0, count).map(section => section[1]).join('\n\n');
  const questions = ['O que é e para quem serve?', 'Onde estão os arquivos?', 'Como validar o ambiente?', 'Como inspecionar o Git?', 'Como navegar para outros documentos?', 'Como validar e o que nunca publicar?'];
  return <section className="md12-builder"><nav>{README_SECTIONS.map((section, index) => <button type="button" className={index < count ? 'included' : index === count ? 'next' : ''} onClick={() => setCount(index + 1)} key={section[0]}><span>{index < count ? <Check size={13} /> : index + 1}</span>{questions[index]}</button>)}</nav><SourcePreview source={source} caption={count === README_SECTIONS.length ? 'O documento agora permite começar, navegar, validar e evitar exposição de segredo.' : 'Adicione a próxima seção somente quando souber qual dúvida ela resolve.'} /><button type="button" className="md12-builder-next" disabled={count === README_SECTIONS.length} onClick={() => setCount(value => value + 1)}><Play size={16} /> Adicionar próxima resposta</button></section>;
}

function DocGallery() {
  const [selected, setSelected] = useState('comandos');
  const current = DOCS[selected];
  return <section className="md12-gallery"><nav>{Object.keys(DOCS).map(id => <button type="button" className={selected === id ? 'active' : ''} onClick={() => setSelected(id)} key={id}>{id}</button>)}</nav><div className="md12-gallery-purpose"><FileText size={22} /><div><small>{current.file}</small><strong>{current.purpose}</strong></div></div><SourcePreview source={current.source} file={current.file} /></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="md12-errors"><nav>{ERRORS.map((error, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={error[0]}><span>{index + 1}</span>{error[0]}</button>)}</nav><article><header><Wrench size={24} /><div><small>Clínica de renderização e escrita</small><h3>{item[0]}</h3></div></header><div>{[['Sintoma', item[1], Search], ['Correção', item[2], RefreshCw], ['Confirmação', item[3], CheckCircle2]].map(([title, text, Icon]) => <section key={title}><Icon size={18} /><strong>{title}</strong><p>{text}</p></section>)}</div></article></section>;
}

const DELIVERY_STAGES = [
  { label: 'Inspecionar', command: 'git status --short\ngit diff -- README.md docs/atalhos.md docs/diario-de-bordo.md', output: ' M README.md\n M docs/atalhos.md\n M docs/diario-de-bordo.md\n\ndiff --git a/README.md b/README.md\n+## Ambiente\n+```powershell\n+java -version\n+```', proof: 'Somente os três documentos pretendidos aparecem; o diff não contém segredo.' },
  { label: 'Preparar', command: 'git add README.md docs/atalhos.md docs/diario-de-bordo.md\ngit diff --staged --stat\ngit diff --staged', output: ' README.md                    | 24 ++++++++++++++++++++++++\n docs/atalhos.md              | 10 ++++++++++\n docs/diario-de-bordo.md      |  8 ++++++++\n 3 files changed, 42 insertions(+)', proof: 'O staged contém exatamente a entrega revisada.' },
  { label: 'Registrar', command: 'git commit -m "Documenta base de Markdown tecnico"', output: '[main d42c1a8] Documenta base de Markdown tecnico\n 3 files changed, 42 insertions(+)', proof: 'O hash varia; a mensagem registra a intenção, não apenas “aula”.' },
  { label: 'Confirmar', command: 'git status\ngit log -1 --oneline', output: 'On branch main\nnothing to commit, working tree clean\n\nd42c1a8 Documenta base de Markdown tecnico', proof: 'A árvore está limpa e o commit documental é a ponta da branch.' }
];

function CommandBlock({ command, output, proof }) {
  return <section className="md12-command"><header><span><TerminalSquare size={16} /> PowerShell — execute na raiz do repositório</span><CopyButton value={command} /></header><SyntaxHighlighter language="powershell" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '15px', background: '#0d1117', fontSize: '.72rem', lineHeight: 1.58 }}>{command}</SyntaxHighlighter><div><small>Saída esperada ou modelo</small><pre>{output}</pre></div><footer><CheckCircle2 size={16} /><span><strong>O que prova:</strong> {proof}</span></footer></section>;
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const current = DELIVERY_STAGES[stage];
  return <section className="md12-delivery"><nav>{DELIVERY_STAGES.map((item, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={item.label}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{item.label}</button>)}</nav><div><CommandBlock command={current.command} output={current.output} proof={current.proof} /><aside><ShieldCheck size={24} /><div><strong>Gate de segurança antes do commit</strong><span>Procure token, senha, chave, `.env`, dado real, caminho pessoal e informação corporativa indevida. Se um segredo já foi publicado, revogue ou rotacione antes de limpar o histórico.</span></div></aside></div><button type="button" disabled={stage === DELIVERY_STAGES.length - 1} onClick={() => setStage(value => value + 1)}><Play size={16} /> Executar próxima evidência</button></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const blocks = { pipeline: Pipeline, intellij: IntelliJMock, structure: StructureLab, elements: ElementsLab, fences: FenceLab, paths: PathsLab, tableLab: TableLab, readme: ReadmeBuilder, gallery: DocGallery, errors: ErrorClinic, delivery: DeliveryLab };
  if (blocks[block.type]) { const Component = blocks[block.type]; return <Component />; }
  if (block.type === 'note') { const Icon = block.tone === 'warning' || block.tone === 'danger' ? AlertTriangle : Lightbulb; return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><BookOpen size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedMarkdownLesson012({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const normalized = useRef(false);
  const [completed, setCompleted] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return new Set(Array.isArray(saved) ? saved : []); } catch { return new Set(); } });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])), [completed]);
  const active = steps[activeIndex];
  const progress = Math.round((completed.size / steps.length) * 100);
  const allDone = completed.size === steps.length;
  const activeDone = completed.has(active.id);
  const lessonDone = isCompleted && allDone;
  const label = useMemo(() => completed.size + ' de ' + steps.length + ' etapas concluídas', [completed]);
  useEffect(() => { if (normalized.current) return; normalized.current = true; if (isCompleted && !allDone) onToggleCompleted(); }, [allDone, isCompleted, onToggleCompleted]);
  const select = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggle = () => { if (activeDone && isCompleted) onToggleCompleted(); setCompleted(previous => { const next = new Set(previous); if (next.has(active.id)) next.delete(active.id); else next.add(active.id); return next; }); };
  return <article className="guided-git-lesson guided-markdown-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><FileText size={17} /> Oficina de documentação viva</span><p className="guided-sequence">012 · M0.12</p><h1>Escreva uma vez, leia como texto, preview e histórico</h1><p>Construa um README útil no IntelliJ, veja cada marcador ganhar significado e registre uma entrega documental que outra pessoa consegue executar.</p></div><div className="guided-hero-status"><BookOpen size={42} /><strong>{progress}%</strong><span>{label}</span></div><div className="guided-progress-track" aria-label={'Progresso: ' + progress + '%'}><span style={{ width: progress + '%' }} /></div></header>
    <GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 3, label: 'estados observados' }, { value: 6, label: 'documentos aplicados' }, { value: 10, label: 'falhas diagnosticadas' }]} />
    <div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 012"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completed.has(step.id) ? 'done' : '')} onClick={() => select(index)}><span className="guided-step-number">{completed.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{active.eyebrow} · {active.duration}</span><h2>{active.title}</h2></div><div className="guided-blocks">{active.blocks.map((block, index) => <ContentBlock block={block} key={active.id + '-' + block.type + '-' + index} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => select(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (activeDone ? 'undo' : 'complete')} onClick={toggle}>{activeDone ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeDone} onClick={() => select(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonDone ? 'Documentação registrada' : 'Oficina Markdown completa'}</h3><p>{lessonDone ? 'Fonte, preview, diagnóstico e entrega estão registrados.' : 'Conclua a aula para liberar o diário de bordo.'}</p></div><button type="button" className={lessonDone ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonDone ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 011</button><div className={'guided-course-status ' + (lessonDone ? 'completed' : allDone ? 'ready' : '')}>{lessonDone ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonDone ? 'Aula concluída' : allDone ? 'Pronta para concluir' : completed.size + ' de ' + steps.length + ' etapas'}</strong><small>{lessonDone ? 'README validado' : allDone ? 'Use o botão acima' : 'Escreva, visualize e confirme'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonDone}>Aula 013 <ArrowRight size={17} /></button></footer>
  </article>;
}
