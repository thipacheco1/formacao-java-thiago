import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight,
  ClipboardCheck, Clock3, Cloud, Code2, Copy, Download,
  ExternalLink, FileText, FolderOpen, GitCommit, Globe2,
  Laptop, Lightbulb, ListChecks, LockKeyhole, Network, RotateCcw,
  SearchCheck, Send, Server, Wrench, Zap
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedHttpClientLesson.css';

const STORAGE_KEY = 'guided-http-client-lesson-017-progress';
const POSTMAN_INSTALL = 'https://learning.postman.com/docs/getting-started/installation/install-app/';
const INSOMNIA_INSTALL = 'https://developer.konghq.com/insomnia/';

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  return <button type="button" className="http17-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodeWindow({ title, code, output, language = 'http', note, error = false }) {
  return <section className="http17-code"><header><span><Code2 size={16} />{title}</span><CopyButton value={code} /></header><SyntaxHighlighter style={vscDarkPlus} language={language} PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.73rem', lineHeight: 1.65, padding: '16px' }}>{code}</SyntaxHighlighter>{output && <div className="http17-output"><small>RESULTADO ESPERADO · SIMULAÇÃO</small><pre>{output}</pre></div>}{note && <footer className={error ? 'error' : ''}>{error ? <AlertTriangle size={17} /> : <SearchCheck size={17} />}<span>{note}</span></footer>}</section>;
}

function HttpFlow() {
  const [stage, setStage] = useState(0);
  const stages = [
    { icon: Laptop, label: 'Cliente', title: 'Postman ou Insomnia monta a intenção', text: 'Escolhe método, URL, headers, parâmetros, autenticação e body. Cliente não decide sozinho se a operação é válida.' },
    { icon: Send, label: 'Request', title: 'A mensagem atravessa a rede', text: 'Método e target carregam a intenção; campos e conteúdo carregam metadados e representação.' },
    { icon: Server, label: 'Servidor', title: 'A API interpreta o contrato', text: 'Roteia, autentica, valida, executa regra, acessa dependências e produz uma resposta.' },
    { icon: Network, label: 'Response', title: 'O servidor devolve evidências', text: 'Status, headers, body e tempo ajudam a interpretar o resultado — nenhum deles isoladamente conta toda a causa.' },
    { icon: SearchCheck, label: 'Leitura', title: 'O cliente investiga antes de tentar de novo', text: 'Distingue falha sem response de resposta HTTP, confronta contrato e só então corrige uma variável.' }
  ]; const item = stages[stage]; const Icon = item.icon;
  return <section className="http17-flow"><div role="tablist">{stages.map((entry, index) => { const EntryIcon = entry.icon; return <React.Fragment key={entry.label}><button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)}><EntryIcon size={21} /><strong>{entry.label}</strong></button>{index < stages.length - 1 && <ChevronRight size={18} />}</React.Fragment>; })}</div><article><Icon size={34} /><div><small>ETAPA {stage + 1}</small><h3>{item.title}</h3><p>{item.text}</p></div></article><button type="button" className="http17-next-action" disabled={stage === stages.length - 1} onClick={() => setStage(value => value + 1)}>Acompanhar mensagem <ArrowRight size={16} /></button></section>;
}

function UrlLab() {
  const [url, setUrl] = useState('http://localhost:8080/clientes/10/pedidos?status=aberto&page=0');
  let parsed; try { parsed = new URL(url); } catch { parsed = null; }
  const pathParts = parsed?.pathname.split('/').filter(Boolean) || [];
  return <section className="http17-url"><header><Globe2 size={18} /><label>URL para decompor<input value={url} onChange={event => setUrl(event.target.value)} /></label></header>{parsed ? <><div className="http17-url-strip"><span className="protocol">{parsed.protocol.replace(':', '')}</span><b>://</b><span className="host">{parsed.hostname}</span>{parsed.port && <><b>:</b><span className="port">{parsed.port}</span></>}<span className="path">{parsed.pathname}</span><span className="query">{parsed.search}</span></div><div className="http17-url-grid"><article><small>PROTOCOLO</small><strong>{parsed.protocol === 'https:' ? 'HTTPS + TLS' : 'HTTP local'}</strong><p>{parsed.protocol === 'https:' ? 'Protege o trânsito quando configurado corretamente.' : 'Aceitável em laboratório local; não envie credencial real em tráfego aberto.'}</p></article><article><small>HOST + PORTA</small><strong>{parsed.hostname}:{parsed.port || (parsed.protocol === 'https:' ? '443' : '80')}</strong><p>Host encontra a máquina; porta encontra o processo.</p></article><article><small>PATH</small><strong>/{pathParts.join('/')}</strong><p>`10` identifica o cliente no caminho; a interpretação final depende do contrato.</p></article><article><small>QUERY</small><strong>{parsed.search || '(nenhuma)'}</strong><p>{[...parsed.searchParams].map(([key, value]) => `${key}=${value}`).join(' · ') || 'Filtros e ajustes aparecem após ?.'}</p></article></div></> : <p className="http17-invalid"><AlertTriangle size={18} />URL inválida: informe protocolo, host e caminho antes de enviar.</p>}<div className="http17-url-examples"><button type="button" onClick={() => setUrl('http://localhost:8080/clientes/10')}>Path parameter</button><button type="button" onClick={() => setUrl('http://localhost:8080/clientes?status=ativo&page=0&size=20')}>Query parameters</button><button type="button" onClick={() => setUrl('https://api.exemplo.com/ordens-servico/100')}>HTTPS remoto</button></div></section>;
}

const METHODS = {
  GET: { intent: 'Consultar uma representação', body: 'Normalmente sem body', example: 'GET /clientes/10', typical: '200 com dados ou 404', safety: 'Seguro pela semântica HTTP: não deve solicitar mudança de estado.' },
  POST: { intent: 'Criar recurso ou pedir processamento', body: 'Frequentemente JSON', example: 'POST /clientes', typical: '201, 200, 202 ou erro do contrato', safety: 'Não presuma repetição segura; efeitos dependem da API.' },
  PUT: { intent: 'Substituir o estado do recurso', body: 'Representação completa típica', example: 'PUT /clientes/10', typical: '200 ou 204', safety: 'Semântica idempotente, mas valide o contrato e campos exigidos.' },
  PATCH: { intent: 'Aplicar atualização parcial', body: 'Mudanças parciais', example: 'PATCH /clientes/10/status', typical: '200 ou 204', safety: 'Formato do patch e idempotência dependem do contrato.' },
  DELETE: { intent: 'Solicitar remoção', body: 'Normalmente sem body', example: 'DELETE /clientes/10', typical: '204, 200 ou 404', safety: 'Pode ser destrutivo; confira ambiente, recurso e autorização.' }
};

function MethodLab() {
  const [method, setMethod] = useState('GET'); const item = METHODS[method];
  return <section className="http17-methods"><nav>{Object.keys(METHODS).map(name => <button type="button" className={`${name.toLowerCase()} ${method === name ? 'active' : ''}`} onClick={() => setMethod(name)} key={name}>{name}</button>)}</nav><article><div className={`http17-method-badge ${method.toLowerCase()}`}>{method}</div><div><small>INTENÇÃO TÍPICA</small><h3>{item.intent}</h3><code>{item.example}</code><dl><div><dt>Body</dt><dd>{item.body}</dd></div><div><dt>Resposta típica</dt><dd>{item.typical}</dd></div><div><dt>Cuidado</dt><dd>{item.safety}</dd></div></dl></div></article><p><Lightbulb size={18} /><span><strong>Método não é verbo decorativo.</strong> Ele comunica semântica. O contrato da API decide rota, representação e status concretos.</span></p></section>;
}

function HttpWorkbench({ mode }) {
  const isPost = mode === 'post';
  const [sent, setSent] = useState(false); const [contentType, setContentType] = useState(isPost); const [validJson, setValidJson] = useState(true); const [semanticValid, setSemanticValid] = useState(true);
  const method = isPost ? 'POST' : 'GET'; const url = isPost ? '{{base_url}}/clientes' : '{{base_url}}/clientes/10?detalhes=true';
  let status = 200; let statusText = 'OK'; let body = '{\n  "id": 10,\n  "nome": "Cliente Exemplo",\n  "ativo": true\n}';
  if (isPost) {
    if (!contentType) { status = 415; statusText = 'Unsupported Media Type'; body = '{\n  "erro": "Content-Type application/json obrigatório"\n}'; }
    else if (!validJson) { status = 400; statusText = 'Bad Request'; body = '{\n  "erro": "JSON malformado na linha 3"\n}'; }
    else if (!semanticValid) { status = 422; statusText = 'Unprocessable Content'; body = '{\n  "erro": "Dados inválidos",\n  "campos": [{"campo":"email","mensagem":"Email inválido"}]\n}'; }
    else { status = 201; statusText = 'Created'; body = '{\n  "id": 11,\n  "nome": "Cliente Exemplo",\n  "email": "cliente@exemplo.com"\n}'; }
  }
  const requestBody = validJson ? (semanticValid ? '{\n  "nome": "Cliente Exemplo",\n  "email": "cliente@exemplo.com"\n}' : '{\n  "nome": "",\n  "email": "email-invalido"\n}') : '{\n  "nome": "Cliente Exemplo"\n  "email": "cliente@exemplo.com"\n}';
  return <section className="http17-workbench"><header><span>Cliente HTTP · Request sem rede real</span><em>SIMULAÇÃO DIDÁTICA DETERMINÍSTICA</em></header><div className="http17-request-bar"><strong className={method.toLowerCase()}>{method}</strong><code>{url}</code><button type="button" onClick={() => setSent(true)}><Send size={16} /> Send</button></div><div className="http17-workbench-body"><section><nav><span>Params {isPost ? '0' : '1'}</span><b>Headers {isPost ? (contentType ? '2' : '1') : '1'}</b><span>Authorization</span>{isPost && <b>Body</b>}</nav><div className="http17-headers"><div><code>Accept</code><span>application/json</span></div>{isPost && <div className={!contentType ? 'disabled' : ''}><code>Content-Type</code><span>{contentType ? 'application/json' : '(ausente)'}</span></div>}</div>{isPost && <><SyntaxHighlighter style={vscDarkPlus} language="json" PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.69rem', minHeight: 155 }}>{requestBody}</SyntaxHighlighter><div className="http17-body-controls"><label><input type="checkbox" checked={contentType} onChange={event => { setContentType(event.target.checked); setSent(false); }} /> Content-Type</label><label><input type="checkbox" checked={validJson} onChange={event => { setValidJson(event.target.checked); setSent(false); }} /> JSON sintaticamente válido</label><label><input type="checkbox" checked={semanticValid} onChange={event => { setSemanticValid(event.target.checked); setSent(false); }} /> Regra válida</label></div></>}</section><section className="http17-response"><nav><b>Body</b><span>Headers</span><span>Timing</span></nav>{sent ? <><div className={`http17-response-status s${Math.floor(status / 100)}`}><strong>{status} {statusText}</strong><span>{isPost ? '43' : '28'} ms · {body.length} B</span></div>{status !== 204 && <SyntaxHighlighter style={vscDarkPlus} language="json" PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.69rem', minHeight: 190 }}>{body}</SyntaxHighlighter>}<p>{status < 300 ? 'Response HTTP recebida: leia status, headers e body.' : 'Há response HTTP: transporte funcionou. Investigue contrato e conteúdo.'}</p></> : <div className="http17-await"><Send size={30} /><strong>Envie a request</strong><span>A URL final resolve para http://localhost:8080, mas nenhuma rede real será acessada nesta simulação.</span></div>}</section></div></section>;
}

const STATUS_CASES = [
  ['200', 'OK', 'GET devolveu representação', 'Sucesso com body típico. Ainda confirme se os dados pertencem ao recurso esperado.'],
  ['201', 'Created', 'POST criou recurso', 'Normalmente acompanha representação ou referência ao recurso criado.'],
  ['204', 'No Content', 'Operação concluída sem body', 'Não trate body vazio como erro quando o contrato promete 204.'],
  ['400', 'Bad Request', 'Request sintaticamente ou genericamente inválida', 'Leia corpo de erro; não reenvie o mesmo JSON cegamente.'],
  ['401', 'Unauthorized', 'Credencial ausente ou inválida', 'Autenticação falhou. Não significa necessariamente falta de permissão.'],
  ['403', 'Forbidden', 'Identidade sem autorização', 'Servidor reconhece o contexto, mas recusa a ação.'],
  ['404', 'Not Found', 'Rota ou recurso não encontrado', 'Teste path, ID, base URL e contrato antes de concluir qual hipótese é correta.'],
  ['409', 'Conflict', 'Estado atual conflita com a operação', 'Ex.: e-mail duplicado ou pedido já concluído.'],
  ['422', 'Unprocessable Content', 'Sintaxe aceita, conteúdo rejeitado', 'Algumas APIs usam 400; siga o contrato concreto.'],
  ['500', 'Internal Server Error', 'Falha inesperada no servidor', 'Correlacione request e logs; não esconda bug devolvendo 200.']
];

function StatusClinic() {
  const [active, setActive] = useState(0); const item = STATUS_CASES[active]; const family = item[0][0];
  return <section className="http17-status"><div className="http17-family"><span className={family === '2' ? 'active' : ''}>2xx Sucesso</span><span>3xx Redirecionamento</span><span className={family === '4' ? 'active' : ''}>4xx Cliente/contrato</span><span className={family === '5' ? 'active' : ''}>5xx Servidor</span></div><div className="http17-status-grid">{STATUS_CASES.map((entry, index) => <button type="button" className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={entry[0]}><strong>{entry[0]}</strong><span>{entry[1]}</span></button>)}</div><article className={`family-${family}`}><strong>{item[0]} {item[1]}</strong><h3>{item[2]}</h3><p>{item[3]}</p><small>Status é o começo da investigação, não uma explicação completa da causa.</small></article></section>;
}

function WorkspaceLab() {
  const [environment, setEnvironment] = useState('Local'); const [secret, setSecret] = useState('empty'); const [request, setRequest] = useState('health');
  const base = environment === 'Local' ? 'http://localhost:8080' : environment === 'Homologação' ? 'https://hml.exemplo.invalid' : 'https://api.exemplo.invalid';
  const requests = { health: ['GET', '/health'], list: ['GET', '/ordens-servico'], detail: ['GET', '/ordens-servico/{{ordem_servico_id}}'], create: ['POST', '/ordens-servico'], status: ['PATCH', '/ordens-servico/{{ordem_servico_id}}/status'] };
  const current = requests[request];
  return <section className="http17-workspace"><header><span><FolderOpen size={17} /> Formação Java Backend — HTTP Básico</span><select value={environment} onChange={event => setEnvironment(event.target.value)}><option>Local</option><option>Homologação</option><option>Produção</option></select></header><div className="http17-workspace-body"><aside><strong>Collection</strong>{Object.entries(requests).map(([id, entry]) => <button type="button" className={request === id ? 'active' : ''} onClick={() => setRequest(id)} key={id}><span className={entry[0].toLowerCase()}>{entry[0]}</span>{id === 'health' ? 'Health' : id === 'list' ? 'Listar ordens' : id === 'detail' ? 'Buscar por ID' : id === 'create' ? 'Criar ordem' : 'Atualizar status'}</button>)}</aside><main><div className="http17-resolved"><small>REQUEST SALVA</small><code><b className={current[0].toLowerCase()}>{current[0]}</b> {'{{base_url}}'}{current[1]}</code><small>URL RESOLVIDA ANTES DO ENVIO</small><strong>{base}{current[1].replace('{{ordem_servico_id}}', '100')}</strong></div><section><h4>Environment · {environment}</h4><div><code>base_url</code><span>{base}</span><b>local/compartilhável</b></div><div><code>ordem_servico_id</code><span>100</span><b>exemplo</b></div><div className={secret === 'real' ? 'danger' : ''}><code>token</code><span>{secret === 'real' ? 'eyJhbGciOi...VALOR_REAL_SIMULADO' : secret === 'placeholder' ? 'TOKEN_EXEMPLO' : '(vazio)'}</span><b>{secret === 'real' ? 'NÃO EXPORTAR' : 'seguro para modelo'}</b></div><nav><button type="button" onClick={() => setSecret('empty')}>Vazio</button><button type="button" onClick={() => setSecret('placeholder')}>Placeholder</button><button type="button" onClick={() => setSecret('real')}>Simular segredo</button></nav></section>{environment === 'Produção' && <p className="http17-danger"><AlertTriangle size={18} />Produção selecionada: pare. Esta aula não autoriza requests reais nesse ambiente.</p>}{secret === 'real' && <p className="http17-danger"><LockKeyhole size={18} />Valor sensível simulado: não sincronize, compartilhe, exporte nem commite. Em incidente real, revogue/rotacione.</p>}</main></div></section>;
}

function ToolChoice() {
  const [tool, setTool] = useState('postman');
  const info = tool === 'postman' ? { name: 'Postman Desktop', icon: Cloud, url: POSTMAN_INSTALL, points: ['Aplicativo desktop oferece experiência completa.', 'Web app pode exigir Desktop Agent para chamadas locais e superar limitações do navegador.', 'Cliente leve pode enviar requests sem login; recursos de nuvem e colaboração têm outras implicações.'] } : { name: 'Insomnia Desktop', icon: Zap, url: INSOMNIA_INSTALL, points: ['Aplicativo desktop open source do ecossistema Kong.', 'Collections, environments, autenticação e importação atendem este módulo.', 'Pode importar collections Postman; escolha do time continua valendo.'] };
  const Icon = info.icon;
  return <section className="http17-tools"><nav><button type="button" className={tool === 'postman' ? 'active' : ''} onClick={() => setTool('postman')}><Cloud size={24} /><strong>Postman</strong><span>Desktop · web + agent</span></button><button type="button" className={tool === 'insomnia' ? 'active' : ''} onClick={() => setTool('insomnia')}><Zap size={24} /><strong>Insomnia</strong><span>Desktop</span></button></nav><article><Icon size={40} /><div><small>ESCOLHA UMA PARA PRATICAR</small><h3>{info.name}</h3><ul>{info.points.map(point => <li key={point}><CheckCircle2 size={15} />{point}</li>)}</ul><a href={info.url} target="_blank" rel="noreferrer"><Download size={16} /> Abrir instalação oficial <ExternalLink size={14} /></a></div></article><div className="http17-install-check"><span><CheckCircle2 /> Aplicativo abre</span><span><CheckCircle2 /> Workspace local criado</span><span><CheckCircle2 /> Request pode ser salva</span><span><CheckCircle2 /> Response é legível</span></div><p><Lightbulb size={18} />Ferramenta muda; HTTP permanece. Em equipe, padrão, política, armazenamento e colaboração pesam mais que preferência estética.</p></section>;
}

const DOC = `# Criar cliente

## Método e URL

\`POST {{base_url}}/clientes\`

## Headers

| Header | Valor |
|---|---|
| \`Content-Type\` | \`application/json\` |
| \`Accept\` | \`application/json\` |

## Body

\`\`\`json
{
  "nome": "Cliente Exemplo",
  "email": "cliente@exemplo.com"
}
\`\`\`

## Resposta esperada

- Status: \`201 Created\`
- Nenhuma credencial real documentada.`;

function DocumentationLab() {
  const [view, setView] = useState('source');
  return <section className="http17-docs"><header><span><FileText size={17} /> docs/http-basico.md</span><div><button type="button" className={view === 'source' ? 'active' : ''} onClick={() => setView('source')}>Editor</button><button type="button" className={view === 'preview' ? 'active' : ''} onClick={() => setView('preview')}>Preview</button><CopyButton value={DOC} /></div></header>{view === 'source' ? <SyntaxHighlighter style={vscDarkPlus} language="markdown" PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.7rem', minHeight: 380 }}>{DOC}</SyntaxHighlighter> : <article className="http17-preview"><h2>Criar cliente</h2><h3>Método e URL</h3><code>POST {'{{base_url}}'}/clientes</code><h3>Headers</h3><table><tbody><tr><td>Content-Type</td><td>application/json</td></tr><tr><td>Accept</td><td>application/json</td></tr></tbody></table><h3>Body</h3><pre>{'{\n  "nome": "Cliente Exemplo",\n  "email": "cliente@exemplo.com"\n}'}</pre><h3>Resposta esperada</h3><p>201 Created · nenhuma credencial real documentada.</p></article>}<footer><span><kbd>Ctrl + Enter</kbd> enviar em muitos clientes</span><span><kbd>Ctrl + S</kbd> salvar quando disponível</span><span><kbd>Alt + F12</kbd> terminal IntelliJ</span><p>Ações são estáveis; atalhos podem variar por versão e sistema.</p></footer></section>;
}

const ERRORS = [
  ['Sem response', 'ECONNREFUSED / Could not connect', 'Servidor não iniciou, caiu, host ou porta estão errados.', 'Leia o log do servidor, confirme listener e base_url. Nenhum status HTTP foi recebido.'],
  ['405', 'Method Not Allowed', 'Rota existe, mas o método não é permitido.', 'Compare método + path com o contrato; não troque para POST ao acaso.'],
  ['415', 'Unsupported Media Type', 'Body chegou com formato não aceito ou sem Content-Type.', 'Confirme `Content-Type: application/json` e o formato real do body.'],
  ['400 JSON', 'Bad Request com erro de parse', 'Vírgula, aspas, chaves ou tipo sintático inválido.', 'Formate o JSON, leia linha/coluna e corrija a sintaxe antes da regra.'],
  ['401', 'Unauthorized', 'Autenticação ausente, inválida ou expirada.', 'Confirme esquema e variável local; nunca cole token real em URL ou documentação.'],
  ['403', 'Forbidden', 'Identidade reconhecida sem permissão.', 'Confirme papel/escopo e recurso; gerar outro token não cria autorização.'],
  ['404', 'Not Found', 'Path, ID, base URL ou rota podem estar errados.', 'Veja URL resolvida e contrato; diferencie rota inexistente de recurso ausente pelo body.'],
  ['409', 'Conflict', 'Estado atual não permite a operação.', 'Leia a regra de negócio; não repita uma operação não idempotente cegamente.'],
  ['Ambiente', 'Resposta vem do alvo errado', 'Environment ativo resolveu base_url para homologação/produção.', 'Pare, confira seletor e URL final antes de qualquer novo envio.'],
  ['Segredo', 'Token entrou em collection/export/Git', 'Credencial foi persistida fora do cofre apropriado.', 'Revogue/rotacione, contenha a exposição e substitua por variável vazia/segura.']
];

function ErrorClinic() {
  const [active, setActive] = useState(0); const item = ERRORS[active];
  return <section className="http17-errors"><nav>{ERRORS.map((entry, index) => <button type="button" className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={entry[0]}><span>{index + 1}</span>{entry[0]}</button>)}</nav><article><header><AlertTriangle size={24} /><div><small>SINTOMA OBSERVADO</small><h3>{item[1]}</h3></div></header><div className="http17-error-flow"><section><small>CAMADA PROVÁVEL</small><p>{item[2]}</p></section><ChevronRight /><section><small>CORREÇÃO + NOVA PROVA</small><p>{item[3]}</p></section></div><div className={`http17-response-marker ${item[0] === 'Sem response' ? 'none' : 'received'}`}>{item[0] === 'Sem response' ? <><Network size={20} /> Sem status: transporte não entregou response HTTP.</> : <><Server size={20} /> Status recebido: rede e servidor responderam; investigue o contrato.</>}</div></article></section>;
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const delivery = [
    ['Organizar', 'Crie collection, environment Local e requests conceituais sem segredo.', 'GET /health\nGET /clientes\nGET /clientes/1\nPOST /clientes\nPUT /clientes/1\nPATCH /clientes/1/status\nDELETE /clientes/1'],
    ['Documentar', 'Atualize documentos com o que você consegue explicar.', 'docs/http-basico.md\ndocs/diario-de-bordo.md\ndocs/atalhos.md'],
    ['Revisar', 'Confirme escopo e procure credenciais antes de preparar.', 'git status --short\ngit diff -- docs/http-basico.md docs/diario-de-bordo.md docs/atalhos.md'],
    ['Preparar', 'Adicione somente os três arquivos e leia o staged.', 'git add docs/http-basico.md docs/diario-de-bordo.md docs/atalhos.md\ngit diff --staged --check\ngit diff --staged'],
    ['Commitar', 'Registre a intenção e confirme árvore limpa.', 'git commit -m "docs: prepara cliente HTTP e exemplos de API"\ngit status --short']
  ]; const item = delivery[stage];
  return <section className="http17-delivery"><nav>{delivery.map((entry, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={entry[0]}><span>{index < stage ? <Check size={12} /> : index + 1}</span>{entry[0]}</button>)}</nav><CodeWindow title={stage < 2 ? 'Evidência de aprendizagem' : 'PowerShell — entrega nominal'} code={item[2]} language={stage < 2 ? 'text' : 'powershell'} note={item[1]} /><div className="http17-defense"><GitCommit size={28} /><div><small>DEFESA ORAL</small><strong>Explique antes de concluir</strong><span>Qual URL final será chamada? Por que uma falha de conexão não tem status? O que 401 prova e o que não prova? Como Content-Type difere de Accept? Onde um token real pode ficar?</span></div></div><button type="button" className="http17-next-action" disabled={stage === delivery.length - 1} onClick={() => setStage(value => value + 1)}>Próximo estado <ArrowRight size={16} /></button></section>;
}

const steps = [
  { id: 'ciclo', label: 'Acompanhar o ciclo', duration: '8 min', eyebrow: 'MODELO MENTAL', title: 'HTTP é uma troca de mensagens entre papéis', blocks: [{ type: 'lead', text: 'Postman e Insomnia não “testam magicamente uma API”. Eles assumem o papel de cliente, enviam uma request e exibem a response que o servidor produziu.' }, { type: 'flow' }, { type: 'note', title: 'Cliente e servidor são papéis da conexão', text: 'Um backend pode ser servidor para o frontend e cliente ao chamar outro serviço. O mesmo programa pode exercer os dois papéis em conexões diferentes.' }] },
  { id: 'url', label: 'Ler a URL', duration: '10 min', eyebrow: 'ALVO DA REQUEST', title: 'Protocolo, host, porta, path e query respondem perguntas diferentes', blocks: [{ type: 'lead', text: 'Edite a URL e observe cada parte. Antes de clicar em Send, você deve conseguir dizer exatamente qual processo e qual recurso pretende alcançar.' }, { type: 'url' }] },
  { id: 'metodos', label: 'Escolher o método', duration: '10 min', eyebrow: 'SEMÂNTICA DA INTENÇÃO', title: 'GET, POST, PUT, PATCH e DELETE não são atalhos intercambiáveis', blocks: [{ type: 'lead', text: 'Clique em cada método e conecte intenção, body, resposta típica e risco. O contrato concreto governa os detalhes.' }, { type: 'methods' }] },
  { id: 'get', label: 'Montar uma GET', duration: '11 min', eyebrow: 'REQUEST + RESPONSE', title: 'Envie uma consulta e leia status, body, headers e tempo', blocks: [{ type: 'lead', text: 'Este laboratório não acessa rede externa: ele simula de forma determinística o que você deve observar num cliente HTTP. Clique em Send e leia os dois lados.' }, { type: 'getWorkbench' }, { type: 'result', title: 'Leitura mínima da GET', items: ['Método e URL resolvida correspondem ao contrato.', 'GET normalmente não leva body; filtros ficam em path ou query.', '`Accept` descreve a representação desejada na resposta.', '200 não basta: confira o recurso devolvido.'] }] },
  { id: 'post', label: 'Enviar JSON', duration: '14 min', eyebrow: 'POST + BODY', title: 'Sintaxe, tipo de mídia e regra de negócio falham em camadas diferentes', blocks: [{ type: 'lead', text: 'Alterne Content-Type, validade sintática e validade semântica. Envie após cada mudança e compare 201, 415, 400 e 422.' }, { type: 'postWorkbench' }, { type: 'note', title: 'Content-Type não é Accept', text: '`Content-Type` descreve o body enviado; `Accept` expressa quais representações o cliente aceita receber.' }] },
  { id: 'status', label: 'Interpretar status', duration: '13 min', eyebrow: 'STATUS NÃO É DIAGNÓSTICO COMPLETO', title: 'Família, código, body e contrato formam a evidência', blocks: [{ type: 'lead', text: 'Passe pelos dez status preservados da aula antiga. Em cada um, diga o que já sabe e o que ainda precisa investigar.' }, { type: 'status' }] },
  { id: 'workspace', label: 'Organizar requests', duration: '13 min', eyebrow: 'COLLECTION + ENVIRONMENT', title: 'Veja a URL resolvida antes de enviar e trate segredo como segredo', blocks: [{ type: 'lead', text: 'Crie uma collection de ordem de serviço, alterne environments e simule um token. Observe como o mesmo template pode mirar alvos radicalmente diferentes.' }, { type: 'workspace' }, { type: 'note', tone: 'warning', title: 'Variável não é automaticamente um cofre', text: 'Use valor local/seguro conforme a ferramenta e a política do time. Não compartilhe, sincronize, exporte ou versione segredo só porque ele está entre chaves.' }] },
  { id: 'ferramenta', label: 'Escolher a ferramenta', duration: '9 min', eyebrow: 'POSTMAN OU INSOMNIA', title: 'Instale uma ferramenta; aprenda o protocolo', blocks: [{ type: 'lead', text: 'As duas atendem este módulo. Escolha pelo padrão do time, política e fluxo local — não pela quantidade de botões.' }, { type: 'tools' }] },
  { id: 'documentar', label: 'Documentar a request', duration: '10 min', eyebrow: 'CONTRATO RECUPERÁVEL', title: 'Uma request importante deve sobreviver à interface', blocks: [{ type: 'lead', text: 'Transforme o exemplo em Markdown com método, URL, headers, body, resposta e cuidados. Compare fonte e preview.' }, { type: 'docs' }] },
  { id: 'erros', label: 'Diagnosticar falhas', duration: '15 min', eyebrow: 'CLÍNICA DE CAMADAS', title: 'Primeiro pergunte: houve response HTTP?', blocks: [{ type: 'lead', text: 'Escolha cada falha. A linha divisória mais importante é entre transporte sem resposta e servidor que respondeu com status.' }, { type: 'errors' }] },
  { id: 'entrega', label: 'Entregar e defender', duration: '12 min', eyebrow: 'DESAFIO FINAL', title: 'Feche com collection coerente, documentação sem segredo e Git limpo', blocks: [{ type: 'lead', text: 'Organize sete requests conceituais, registre apenas o que entende e prepare arquivos nomeados. Collection ainda não executada deve ser identificada como modelo.' }, { type: 'delivery' }, { type: 'challenge', title: 'Transferência: 404 no ambiente errado', text: 'Uma GET para `{{base_url}}/clientes/10` retorna 404, mas o seletor mostra Homologação e você esperava Local. Descreva a investigação sem enviar outra request primeiro.', acceptance: ['Você expande a URL final e identifica o alvo.', 'Você não conclui que o ID inexiste antes de ler o body/contrato.', 'Você troca o environment somente após confirmar intenção.', 'Você verifica se o servidor local está rodando antes da nova chamada.', 'Você não copia token entre environments.'] }] }
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const components = { flow: HttpFlow, url: UrlLab, methods: MethodLab, getWorkbench: () => <HttpWorkbench mode="get" />, postWorkbench: () => <HttpWorkbench mode="post" />, status: StatusClinic, workspace: WorkspaceLab, tools: ToolChoice, docs: DocumentationLab, errors: ErrorClinic, delivery: DeliveryLab };
  if (components[block.type]) { const Component = components[block.type]; return <Component />; }
  if (block.type === 'note') { const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb; return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} />{block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} />{item}</li>)}</ul></section>;
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Wrench size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedHttpClientLesson017({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0); const normalized = useRef(false);
  const [completed, setCompleted] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return new Set(Array.isArray(saved) ? saved : []); } catch { return new Set(); } });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])), [completed]);
  const active = steps[activeIndex]; const progress = Math.round((completed.size / steps.length) * 100); const allDone = completed.size === steps.length; const activeDone = completed.has(active.id); const lessonDone = isCompleted && allDone; const label = useMemo(() => `${completed.size} de ${steps.length} etapas concluídas`, [completed]);
  useEffect(() => { if (normalized.current) return; normalized.current = true; if (isCompleted && !allDone) onToggleCompleted(); }, [allDone, isCompleted, onToggleCompleted]);
  const select = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggle = () => { if (activeDone && isCompleted) onToggleCompleted(); setCompleted(previous => { const next = new Set(previous); if (next.has(active.id)) next.delete(active.id); else next.add(active.id); return next; }); };
  return <article className="guided-git-lesson guided-http-client-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Send size={17} /> Laboratório de comunicação HTTP</span><p className="guided-sequence">017 · M0.17</p><h1>Monte requests e leia responses como quem investiga um sistema</h1><p>Use Postman ou Insomnia com método, URL, headers, JSON, status, environments e segurança — entendendo cada evidência antes do próximo envio.</p></div><div className="guided-hero-status"><Globe2 size={42} /><strong>{progress}%</strong><span>{label}</span></div><div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header><GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 5, label: 'métodos interpretados' }, { value: 10, label: 'status diagnosticados' }, { value: 2, label: 'ferramentas comparadas' }]} /><div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 017"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={`${index === activeIndex ? 'active ' : ''}${completed.has(step.id) ? 'done' : ''}`} onClick={() => select(index)}><span className="guided-step-number">{completed.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{active.eyebrow} · {active.duration}</span><h2>{active.title}</h2></div><div className="guided-blocks">{active.blocks.map((block, index) => <ContentBlock block={block} key={`${active.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => select(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeDone ? 'undo' : 'complete'}`} onClick={toggle}>{activeDone ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeDone} onClick={() => select(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonDone ? 'Cliente HTTP preparado' : 'Laboratório concluído'}</h3><p>{lessonDone ? 'Request, response, status, environment e segurança foram defendidos.' : 'Conclua a aula para liberar Docker e WSL2.'}</p></div><button type="button" className={lessonDone ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonDone ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 016</button><div className={`guided-course-status ${lessonDone ? 'completed' : allDone ? 'ready' : ''}`}>{lessonDone ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonDone ? 'Aula concluída' : allDone ? 'Pronta para concluir' : `${completed.size} de ${steps.length} etapas`}</strong><small>{lessonDone ? 'HTTP compreendido por evidências' : allDone ? 'Use o botão acima' : 'Montar, enviar, ler e diagnosticar'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonDone}>Aula 018 <ArrowRight size={17} /></button></footer></article>;
}
