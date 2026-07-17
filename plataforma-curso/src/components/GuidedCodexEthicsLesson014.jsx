import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Bot, BrainCircuit, Check, CheckCircle2,
  ClipboardCheck, Clock3, Code2, Copy, Eye, FileCheck2, FileText, FolderTree,
  GitCompareArrows, GraduationCap, Lightbulb, ListChecks, LockKeyhole,
  MessageSquareText, Play, RotateCcw, SearchCheck, ShieldAlert,
  ShieldCheck, Sparkles, TerminalSquare, TestTube2, UserCheck, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedCodexEthicsLesson.css';

const STORAGE_KEY = 'guided-codex-ethics-lesson-014-progress';

const CODEX_MANUAL_URL = 'https://developers.openai.com/codex/';

const CYCLE = [
  ['Hipótese humana', 'Descreva o problema, o resultado esperado e o que você já observou antes de pedir ajuda.', 'Existe uma pergunta técnica, não apenas “faz para mim”.'],
  ['Contexto mínimo', 'Forneça somente os arquivos, mensagens e restrições necessários e autorizados.', 'O contexto cabe no escopo e não contém segredo.'],
  ['Plano', 'Peça análise, riscos, arquivos afetados e validação antes de permitir escrita.', 'Você sabe o que poderá mudar antes da mudança.'],
  ['Ação pequena', 'Aprove uma alteração delimitada; não entregue o repositório inteiro sem necessidade.', 'O diff continua legível e reversível.'],
  ['Evidência', 'Compile, execute, teste, depure e consulte documentação quando a alegação for mutável.', 'Existe saída técnica, não apenas texto convincente.'],
  ['Revisão humana', 'Leia cada hunk, confirme escopo, segurança, casos de borda e dependências.', 'Você consegue explicar e defender a mudança.'],
  ['Registro', 'Atualize documentação ou diário e crie um commit que descreva a mudança técnica.', 'O histórico registra o que mudou, não “código da IA”.']
];

const SURFACES = [
  { id: 'intellij', title: 'IntelliJ + terminal', status: 'Caminho desta aula', icon: TerminalSquare, use: 'Abra o projeto correto, pressione Alt + F12 e execute o Codex CLI dentro da raiz versionada.', limit: 'A documentação oficial atual não descreve uma extensão Codex para IntelliJ. Não instale um plugin aleatório fingindo que é oficial.', evidence: 'Prompt do terminal mostra a raiz; git status prova o estado do workspace.' },
  { id: 'ide', title: 'Extensão de IDE', status: 'VS Code e compatíveis', icon: Code2, use: 'Útil quando seleção, arquivo aberto e diff precisam permanecer anexados ao editor.', limit: 'Os comandos e telas publicados atualmente são do ecossistema VS Code; não transfira esses cliques para JetBrains.', evidence: 'A origem da extensão e a documentação oficial correspondem.' },
  { id: 'cli', title: 'Codex CLI', status: 'Terminal local', icon: Bot, use: 'Trabalha na pasta atual, lê instruções aplicáveis e pode executar ferramentas dentro das permissões concedidas.', limit: 'A pasta inicial, o sandbox e a política de aprovação definem fronteiras diferentes.', evidence: '`codex --version`, autenticação e modo de permissão são verificáveis.' },
  { id: 'app', title: 'App ou cloud', status: 'Outra superfície', icon: MessageSquareText, use: 'Pode apoiar planejamento, revisão, trabalho local, worktree ou tarefa hospedada conforme a superfície e a conta.', limit: 'Não presuma que autenticação, arquivos, rede e segredos funcionam igual ao terminal local.', evidence: 'O aluno identifica onde a tarefa roda e que contexto foi anexado.' }
];

const SETUP_STEPS = [
  { label: 'Pré-requisitos', command: 'node --version\nnpm --version\ngit --version', output: 'vXX.Y.Z\nXX.Y.Z\ngit version X.Y.Z.windows.N', proof: 'Node/npm são necessários para este caminho de instalação; Git protege a revisão. Números variam.' },
  { label: 'Instalar', command: 'npm install --global @openai/codex', output: 'added … packages in …s', proof: 'Instalação global concluída. Quantidade e tempo variam; mensagens de erro devem ser lidas, não ocultadas.' },
  { label: 'Localizar', command: 'codex --version\nwhere.exe codex', output: 'codex-cli X.Y.Z\nC:\\Users\\SEU_USUARIO\\AppData\\Roaming\\npm\\codex.cmd', proof: 'A versão responde e o Windows mostra qual executável será usado. O caminho real pode variar.' },
  { label: 'Autenticar', command: 'codex login\ncodex login status', output: 'O navegador é aberto para autenticação.\nO status identifica o método de login ativo.', proof: 'Senha não vai para arquivo nem prompt. A redação exata da saída pode mudar.' },
  { label: 'Abrir restrito', command: 'git status --short\ncodex --sandbox read-only --ask-for-approval on-request', output: '(sem saída no status = árvore limpa)\nCodex inicia sem permissão de escrita no workspace.', proof: 'Primeiro contato é leitura e planejamento. Permissão pode ser ampliada conscientemente depois.' },
  { label: 'Ampliar com controle', command: 'git status --short\ncodex --sandbox workspace-write --ask-for-approval on-request', output: 'Codex pode editar dentro do workspace e pede aprovação quando precisa atravessar a fronteira ativa.', proof: 'Use somente em repositório confiável, com escopo pequeno e Git limpo. `danger-full-access` não é o ponto de partida desta formação.' }
];

const PROMPT_CASES = [
  { weak: 'Faz uma API de pedidos para mim.', intent: 'aprender modelagem inicial', result: 'Quero representar um Pedido em Java puro. Estou no módulo inicial e ainda não estudei Spring, Collections, Streams ou Lombok. Primeiro faça perguntas sobre minha ideia. Depois proponha um exemplo com uma classe e um `main`, sem alterar arquivos. Explique como eu validaria com `javac` e `java`.' },
  { weak: 'Deu erro. Corrige.', intent: 'diagnosticar compilação', result: 'Estou compilando `RegraReagendamento.java` com `javac`. Recebi `\';\' expected` na linha 8; esperava gerar o `.class`. Ainda não quero a correção pronta. Explique como ler arquivo, linha, marcador e mensagem e proponha três verificações em ordem.' },
  { weak: 'Melhora esse código todo.', intent: 'revisar com controle', result: 'Revise apenas `RegraReagendamento.java`. Não altere arquivos. Liste primeiro bugs lógicos, casos de borda e testes ausentes, citando as linhas. Respeite Java 21 sem frameworks. Depois aguarde minha autorização antes de propor um patch.' }
];

const SECURITY_CASES = [
  { label: 'Token em log', sample: 'Authorization: Bearer [TOKEN_REAL_REMOVIDO]', verdict: 'Bloquear', reason: 'Credencial não deve ser enviada. Revogue/rotacione se for real; não tente “mascarar” e continuar.', safe: 'Descreva: “a requisição retorna 401; o cabeçalho foi removido”.' },
  { label: 'Cliente real', sample: 'Maria Silva, CPF 000…, contrato interno 4831', verdict: 'Bloquear', reason: 'Há dado pessoal e identificadores internos. Autorização vem antes de qualquer anonimização.', safe: 'Use um caso sintético: CLIENTE_EXEMPLO, DOCUMENTO_FICTICIO e contrato X.' },
  { label: 'Regra mínima', sample: 'boolean podeExecutar(String status, boolean bloqueado)', verdict: 'Reduzir e confirmar', reason: 'O trecho é pequeno, mas ainda pode representar regra proprietária. Confirme política e autorização.', safe: 'Se permitido, use nomes genéricos e somente o comportamento indispensável.' },
  { label: 'Biblioteca fechada', sample: 'Reproduza o código completo do produto proprietário Y', verdict: 'Recusar', reason: 'Não use IA para burlar licença, autoria ou acesso.', safe: 'Peça explicação do conceito público ou implemente uma solução original a partir de requisitos autorizados.' },
  { label: 'Exemplo didático', sample: 'Classe Calculadora criada exclusivamente para este laboratório', verdict: 'Pode prosseguir', reason: 'Contexto sintético, pequeno e sob seu controle, desde que não esconda segredo em outro arquivo anexado.', safe: 'Envie só os arquivos necessários e mantenha o repositório limpo.' }
];

const BAD_DIFF = `diff --git a/RegraReagendamento.java b/RegraReagendamento.java
@@
- boolean statusPermitido = "AGENDADO".equals(status)
-         || "REAGENDADO".equals(status);
- return statusPermitido && dataValida && !clienteBloqueado;
+ return status == "AGENDADO"
+         || status == "REAGENDADO" && dataValida;`;

const BAD_CODE = `public class RegraReagendamento {
    static boolean podeReagendar(
            String status,
            boolean dataValida,
            boolean clienteBloqueado) {
        return status == "AGENDADO"
                || status == "REAGENDADO" && dataValida;
    }

    public static void main(String[] args) {
        conferir("agendado bloqueado", false,
                podeReagendar("AGENDADO", true, true));
        conferir("texto equivalente", true,
                podeReagendar(new String("AGENDADO"), true, false));
    }

    static void conferir(String cenario, boolean esperado, boolean obtido) {
        System.out.printf("%s | esperado=%s | obtido=%s | %s%n",
                cenario, esperado, obtido,
                esperado == obtido ? "PASSOU" : "FALHOU");
    }
}`;

const GOOD_CODE = `public class RegraReagendamento {
    static boolean podeReagendar(
            String status,
            boolean dataValida,
            boolean clienteBloqueado) {
        boolean statusPermitido = "AGENDADO".equals(status)
                || "REAGENDADO".equals(status);
        return statusPermitido && dataValida && !clienteBloqueado;
    }
}`;

const DELEGATION_CASES = [
  ['Explicar `javac`', 'Explicar', 'Baixo risco e objetivo de aprendizagem. Ainda compare a explicação com a execução.'],
  ['Sugerir casos de teste', 'Propor', 'A IA amplia hipóteses; você escolhe casos, escreve ou revisa e executa.'],
  ['Renomear variável local', 'Editar com revisão', 'Mudança pequena, reversível e fácil de validar por diff e compilação.'],
  ['Alterar autenticação', 'Plano + revisão especializada', 'Impacto de segurança exige contexto, testes e decisão humana; não autorize edição automática ampla.'],
  ['Migrar banco de produção', 'Não delegar execução', 'Dados e reversibilidade exigem procedimento autorizado, backup, revisão e operação controlada.'],
  ['Escolher microserviços', 'Apoiar análise', 'IA pode comparar trade-offs; responsabilidade arquitetural não é transferida.']
];

const AGENTS_SOURCE = `# AGENTS.md

## Escopo

Projeto didático da Formação Java Backend.

## Método

- Antes de editar, explique o problema e proponha um plano curto.
- Liste os arquivos que pretende modificar e aguarde aprovação.
- Não use frameworks ou recursos ainda não estudados.
- Não adicione dependências sem justificar.
- Nunca use dados sensíveis ou código corporativo não autorizado.

## Validação

- Compile exemplos com \`javac\` quando aplicável.
- Execute o cenário e mostre a saída.
- Revise \`git diff\` e \`git diff --staged\`.
- Mantenha alterações pequenas e dentro do repositório.`;

const POLICY_SOURCE = `# Uso de IA na formação

## Regras

- Tentar e registrar uma hipótese antes de pedir solução.
- Não aceitar código que eu não consiga explicar.
- Não enviar segredo, dado pessoal ou código corporativo sem autorização.
- Pedir plano e arquivos afetados antes de qualquer edição.
- Restringir a solução ao nível atual da formação.
- Compilar, executar, testar e revisar o diff.
- Consultar documentação oficial para comportamento mutável.

## Prompt-base

> Analise primeiro. Não altere arquivos. Explique riscos, proponha um plano curto,
> liste os arquivos afetados e diga como validar. Aguarde minha autorização.

## Gate de aceitação

- [ ] Entendi cada mudança.
- [ ] O escopo foi respeitado.
- [ ] Execução ou teste produziu evidência.
- [ ] O diff não contém segredo nem dependência inesperada.
- [ ] Consigo defender a decisão sem repetir a resposta da IA.`;

const COMMON_ERRORS = [
  ['Aceitar sem entender', 'Código entra no projeto sem domínio humano.', 'Explique, reduza, execute e reescreva a decisão com suas palavras.', 'Você consegue defender cada linha alterada.'],
  ['Pular fundamento', 'A solução usa abstrações que escondem o conceito estudado.', 'Declare módulo e recursos proibidos no prompt.', 'O código respeita o nível atual.'],
  ['Enviar contexto sensível', 'Utilidade aparente cria risco de confidencialidade.', 'Pare, confirme autorização e produza exemplo sintético.', 'Nenhum dado real é necessário para reproduzir o problema.'],
  ['Não revisar diff', 'Mudanças laterais passam despercebidas.', 'Compare antes/depois e leia cada hunk.', 'Arquivos e linhas coincidem com o plano aprovado.'],
  ['Confiar na eloquência', 'Uma explicação segura pode estar tecnicamente errada.', 'Execute, teste ou consulte fonte oficial.', 'Há evidência independente da resposta.'],
  ['Pedir tarefa grande', 'Escopo, revisão e reversão ficam difíceis.', 'Quebre em menor alteração verificável.', 'Um diff curto responde a um objetivo.'],
  ['Delegar arquitetura', 'Padrão é escolhido sem restrições nem trade-offs.', 'Use IA para perguntas e comparação; mantenha decisão humana.', 'Decisão registra contexto, custo e alternativas.'],
  ['Usar sem Git', 'Não existe base confiável para comparar ou desfazer.', 'Comece limpo e preserve um checkpoint.', '`git status --short` e histórico são conhecidos.'],
  ['Não testar', 'Código que compila ou parece correto pode quebrar regra.', 'Execute cenários positivos, negativos e bordas.', 'Saídas observadas confirmam a intenção.'],
  ['Não registrar', 'O erro volta e o método não melhora.', 'Atualize diário e política quando surgir aprendizado durável.', 'A próxima sessão reutiliza a regra aprendida.']
];

const DELIVERY = [
  ['Inspecionar', 'git status --short\ngit diff -- AGENTS.md docs/uso-de-ia.md', 'Somente os dois documentos esperados aparecem; leia todo o conteúdo.'],
  ['Preparar', 'git add AGENTS.md docs/uso-de-ia.md\ngit diff --staged', 'O staged contém somente regras de projeto e política de IA.'],
  ['Validar', 'javac RegraReagendamento.java\njava RegraReagendamento', 'Todos os cenários planejados precisam passar antes do commit.'],
  ['Commitar', 'git commit -m "Documenta protocolo seguro de uso de IA"\ngit status --short', 'Commit comunica a mudança técnica e o status final fica silencioso/limpo.']
];

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1300); } catch { setCopied(false); } };
  return <button type="button" className="codex14-copy" onClick={copy} aria-label="Copiar conteúdo">{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado' : 'Copiar'}</button>;
}

function Highlight({ language, children, lines = false }) {
  return <SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} customStyle={{ margin: 0, borderRadius: 0, fontSize: '.69rem', lineHeight: 1.55, background: '#0d1117' }}>{children}</SyntaxHighlighter>;
}

function TerminalPanel({ command, output, proof, title = 'PowerShell — terminal integrado' }) {
  return <section className="codex14-terminal"><header><TerminalSquare size={16} /><span>{title}</span><CopyButton value={command} /></header><Highlight language="powershell">{command}</Highlight><div><small>Saída esperada ou comportamento</small><pre>{output}</pre></div><footer><CheckCircle2 size={16} /><span><strong>Como interpretar:</strong> {proof}</span></footer></section>;
}

function SupervisedCycle() {
  const [index, setIndex] = useState(0);
  const current = CYCLE[index];
  return <section className="codex14-cycle"><div role="tablist" aria-label="Ciclo de IA supervisionada">{CYCLE.map((item, itemIndex) => <button type="button" role="tab" aria-selected={index === itemIndex} className={index === itemIndex ? 'active' : itemIndex < index ? 'done' : ''} onClick={() => setIndex(itemIndex)} key={item[0]}><span>{itemIndex < index ? <Check size={13} /> : itemIndex + 1}</span>{item[0]}</button>)}</div><article><BrainCircuit size={32} /><small>Responsabilidade permanece humana</small><h3>{current[0]}</h3><p>{current[1]}</p><div><UserCheck size={18} /><span><strong>Evidência para avançar</strong>{current[2]}</span></div></article><button type="button" disabled={index === CYCLE.length - 1} onClick={() => setIndex(value => value + 1)}><Play size={16} /> Próximo controle</button></section>;
}

function SurfaceMap() {
  const [selected, setSelected] = useState('intellij');
  const current = SURFACES.find(item => item.id === selected);
  const Icon = current.icon;
  return <section className="codex14-surfaces"><nav aria-label="Superfícies do Codex">{SURFACES.map(item => <button type="button" className={selected === item.id ? 'active' : ''} onClick={() => setSelected(item.id)} key={item.id}><item.icon size={18} /><span><strong>{item.title}</strong><small>{item.status}</small></span></button>)}</nav><article><header><Icon size={27} /><div><small>Superfície selecionada</small><h3>{current.title}</h3></div></header><p>{current.use}</p><aside><AlertTriangle size={18} /><span><strong>Limite</strong>{current.limit}</span></aside><footer><SearchCheck size={17} /><span><strong>Como provar:</strong> {current.evidence}</span></footer></article><div className="codex14-official"><ShieldCheck size={17} /><span>Informação verificada em julho de 2026. Para instalação e suporte atuais, confirme na <a href={CODEX_MANUAL_URL} target="_blank" rel="noreferrer">documentação oficial do Codex</a>.</span></div></section>;
}

function SetupLab() {
  const [stage, setStage] = useState(0);
  const current = SETUP_STEPS[stage];
  return <section className="codex14-setup"><div className="codex14-ide"><header><span className="traffic"><i /><i /><i /></span><strong>IntelliJ IDEA — simulação didática</strong><small>Projeto: ia-lab</small></header><div className="codex14-ide-body"><aside><strong>Project</strong><span><FolderTree size={14} /> ia-lab</span><span>⌄ .git</span><span>⌄ docs</span><span>　 diario-de-bordo.md</span><span>　 uso-de-ia.md</span><span>　 RegraReagendamento.java</span></aside><main><div className="codex14-editor-placeholder"><Bot size={28} /><strong>Codex não está fingindo ser um painel do IntelliJ</strong><span>Use <kbd>Alt + F12</kbd> para abrir o terminal integrado na raiz do projeto.</span></div><div className="codex14-terminal-dock"><nav><button type="button" className="active">Terminal</button><button type="button">Problems</button><button type="button">Git</button></nav><div><span>PS C:\dev\labs\ia-lab&gt;</span><strong>{current.command.split('\n')[0]}</strong></div></div></main></div></div><nav className="codex14-stage-nav">{SETUP_STEPS.map((item, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={item.label}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{item.label}</button>)}</nav><TerminalPanel command={current.command} output={current.output} proof={current.proof} /><button type="button" className="codex14-next-action" disabled={stage === SETUP_STEPS.length - 1} onClick={() => setStage(value => value + 1)}><Play size={16} /> Executar próxima verificação</button></section>;
}

function PromptWorkshop() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const current = PROMPT_CASES[caseIndex];
  const choose = index => { setCaseIndex(index); setRevealed(false); };
  return <section className="codex14-prompts"><nav>{PROMPT_CASES.map((item, index) => <button type="button" className={caseIndex === index ? 'active' : ''} onClick={() => choose(index)} key={item.weak}><span>{index + 1}</span>{item.intent}</button>)}</nav><article><small>Pedido fraco</small><blockquote>{current.weak}</blockquote><div className="codex14-prompt-anatomy"><span>objetivo</span><span>contexto</span><span>nível</span><span>escopo</span><span>restrições</span><span>validação</span></div><button type="button" onClick={() => setRevealed(true)} disabled={revealed}><Wrench size={16} /> Reconstruir como mentor</button>{revealed && <div className="codex14-rewritten"><header><Sparkles size={17} /><strong>Prompt controlado</strong><CopyButton value={current.result} /></header><p>{current.result}</p><footer>O prompt não garante verdade; ele melhora escopo e cria pontos de verificação.</footer></div>}</article></section>;
}

function PlanChat() {
  const [stage, setStage] = useState(0);
  const messages = [
    ['Você', 'Minha hipótese: a regra falha quando o cliente está bloqueado. Analise `RegraReagendamento.java`, mas não altere arquivos.'],
    ['Codex', 'Vou localizar a regra, ler os cenários existentes e comparar a condição com o resultado esperado. Ainda não farei alterações.'],
    ['Codex', 'Plano: 1) adicionar cenário negativo no mesmo arquivo; 2) corrigir somente a condição se o teste provar o defeito; 3) compilar e executar; 4) mostrar o diff. Arquivo previsto: `RegraReagendamento.java`.'],
    ['Você', 'Aprovo apenas a inclusão do cenário de teste. Pare e mostre a saída antes de alterar a regra.'],
    ['Codex', 'Entendido. O escopo aprovado não inclui corrigir a regra nem criar outros arquivos.']
  ];
  return <section className="codex14-chat"><header><MessageSquareText size={17} /><span>Conversa supervisionada — simulação didática</span><small>{stage + 1} de {messages.length}</small></header><div>{messages.slice(0, stage + 1).map((message, index) => <article className={message[0] === 'Você' ? 'human' : 'agent'} key={index}><strong>{message[0]}</strong><p>{message[1]}</p></article>)}</div><footer><span>{stage < 2 ? 'Nenhuma escrita autorizada' : stage === 2 ? 'Plano aguardando aprovação' : 'Escopo autorizado: um cenário de teste'}</span><button type="button" disabled={stage === messages.length - 1} onClick={() => setStage(value => value + 1)}><Play size={16} /> {stage === 2 ? 'Responder com limite' : 'Continuar conversa'}</button></footer></section>;
}

function SecurityGate() {
  const [selected, setSelected] = useState(0);
  const current = SECURITY_CASES[selected];
  const blocked = current.verdict === 'Bloquear' || current.verdict === 'Recusar';
  return <section className="codex14-security"><nav>{SECURITY_CASES.map((item, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={item.label}><span>{index + 1}</span>{item.label}</button>)}</nav><article className={blocked ? 'blocked' : 'review'}><header>{blocked ? <ShieldAlert size={27} /> : <ShieldCheck size={27} />}<div><small>Decisão antes do envio</small><h3>{current.verdict}</h3></div></header><blockquote>{current.sample}</blockquote><p>{current.reason}</p><footer><LockKeyhole size={17} /><span><strong>Alternativa segura:</strong> {current.safe}</span></footer></article><div className="codex14-security-rule"><strong>Ordem correta</strong><span>autorização</span><ArrowRight size={15} /><span>necessidade</span><ArrowRight size={15} /><span>redução</span><ArrowRight size={15} /><span>envio mínimo</span></div></section>;
}

function DiffReviewLab() {
  const [stage, setStage] = useState(0);
  const panels = [
    { label: 'Ler o diff', language: 'diff', code: BAD_DIFF, output: 'A sugestão removeu `clienteBloqueado`, usa `==` para String e mudou a precedência lógica.', proof: 'Três mudanças semânticas aparecem antes mesmo de executar.' },
    { label: 'Executar', language: 'java', code: BAD_CODE, output: 'agendado bloqueado | esperado=false | obtido=true | FALHOU\ntexto equivalente | esperado=true | obtido=false | FALHOU', proof: 'Código compilar não prova regra; os cenários negativos revelam o defeito.' },
    { label: 'Diagnosticar', language: 'text', code: 'Hipótese 1: `==` compara referências de String.\nHipótese 2: `&&` é avaliado antes de `||`.\nHipótese 3: clienteBloqueado desapareceu da condição.', output: 'As três hipóteses são confirmadas pelo diff e pelos dois cenários.', proof: 'A causa foi explicada por linguagem e regra de negócio, não por tentativa aleatória.' },
    { label: 'Corrigir', language: 'java', code: GOOD_CODE, output: 'javac RegraReagendamento.java\njava RegraReagendamento\nTodos os cenários: PASSOU', proof: 'Agora use `git diff` novamente e confirme que nenhuma alteração lateral entrou.' }
  ];
  const current = panels[stage];
  return <section className="codex14-diff"><nav>{panels.map((item, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={item.label}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{item.label}</button>)}</nav><div className="codex14-code-review"><header><GitCompareArrows size={17} /><span>{current.label}</span><CopyButton value={current.code} /></header><Highlight language={current.language} lines={current.language === 'java'}>{current.code}</Highlight><div><small>Saída ou conclusão observada</small><pre>{current.output}</pre></div><footer><TestTube2 size={17} /><span><strong>O que prova:</strong> {current.proof}</span></footer></div><button type="button" className="codex14-next-action" disabled={stage === panels.length - 1} onClick={() => setStage(value => value + 1)}><Play size={16} /> Próxima evidência</button></section>;
}

function DelegationLab() {
  const [selected, setSelected] = useState(0);
  const current = DELEGATION_CASES[selected];
  return <section className="codex14-delegation"><nav>{DELEGATION_CASES.map((item, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={item[0]}>{item[0]}</button>)}</nav><article><small>Nível máximo recomendado</small><h3>{current[1]}</h3><p>{current[2]}</p><div className="codex14-autonomy"><span className="active">Explicar</span><span className={['Propor', 'Editar com revisão', 'Plano + revisão especializada', 'Apoiar análise'].includes(current[1]) ? 'active' : ''}>Propor</span><span className={current[1] === 'Editar com revisão' ? 'active' : ''}>Editar</span><span>Executar</span></div><footer>Quanto maior o impacto, a irreversibilidade e a sensibilidade, menor deve ser a autonomia automática.</footer></article></section>;
}

function PolicyDocs() {
  const [file, setFile] = useState('agents');
  const source = file === 'agents' ? AGENTS_SOURCE : POLICY_SOURCE;
  const path = file === 'agents' ? 'AGENTS.md' : 'docs/uso-de-ia.md';
  return <section className="codex14-docs"><nav><button type="button" className={file === 'agents' ? 'active' : ''} onClick={() => setFile('agents')}>AGENTS.md</button><button type="button" className={file === 'policy' ? 'active' : ''} onClick={() => setFile('policy')}>docs/uso-de-ia.md</button></nav><div className="codex14-doc-grid"><section><header><FileText size={16} /><span>{path}</span><CopyButton value={source} /></header><Highlight language="markdown">{source}</Highlight></section><section><header><Eye size={16} /><span>Preview</span></header><div className="codex14-rendered"><ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown></div></section></div><footer><FileCheck2 size={17} /><span><strong>Escopos diferentes:</strong> `AGENTS.md` orienta o agente dentro do repositório; `docs/uso-de-ia.md` registra o método que o aluno assume e consegue revisar.</span></footer></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const current = COMMON_ERRORS[selected];
  return <section className="codex14-errors"><nav>{COMMON_ERRORS.map((item, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={item[0]}><span>{index + 1}</span>{item[0]}</button>)}</nav><article><header><AlertTriangle size={25} /><div><small>Antipadrão {selected + 1} de {COMMON_ERRORS.length}</small><h3>{current[0]}</h3></div></header><div><section><ShieldAlert size={19} /><strong>Sintoma</strong><p>{current[1]}</p></section><section><Wrench size={19} /><strong>Correção</strong><p>{current[2]}</p></section><section><SearchCheck size={19} /><strong>Confirmação</strong><p>{current[3]}</p></section></div></article></section>;
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const current = DELIVERY[stage];
  return <section className="codex14-delivery"><nav>{DELIVERY.map((item, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={item[0]}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{item[0]}</button>)}</nav><TerminalPanel command={current[1]} output={current[2]} proof={stage === 3 ? 'A alteração está rastreável; a responsabilidade continua sua.' : 'Pare se aparecer arquivo, segredo ou falha fora do esperado.'} title="PowerShell — entrega supervisionada" /><div className="codex14-defense"><GraduationCap size={26} /><div><small>Defesa oral antes de concluir</small><strong>Explique sem consultar</strong><span>Qual problema existia? O que a IA apenas sugeriu? Que evidência confirmou a solução? Que risco você rejeitou? Como o diff prova o escopo?</span></div></div><button type="button" className="codex14-next-action" disabled={stage === DELIVERY.length - 1} onClick={() => setStage(value => value + 1)}><Play size={16} /> Próximo estado</button></section>;
}

const steps = [
  { id: 'ciclo', label: 'Pacto de responsabilidade', duration: '8 min', eyebrow: 'COMECE AQUI', title: 'Você continua sendo o autor da decisão', blocks: [{ type: 'lead', text: 'Hoje não vamos aprender a pedir “código pronto”. Vamos construir um ciclo em que a IA ajuda a investigar, mas toda mudança termina em entendimento, evidência e responsabilidade humana.' }, { type: 'cycle' }, { type: 'note', tone: 'warning', title: 'Regra inegociável', text: 'Não aceite código que você não consegue explicar, executar, revisar e defender.' }] },
  { id: 'superficies', label: 'Escolher a superfície', duration: '9 min', eyebrow: 'MAPA OPERACIONAL', title: 'IntelliJ, CLI, extensão e cloud não são a mesma coisa', blocks: [{ type: 'lead', text: 'Primeiro escolha onde a tarefa realmente rodará. Isso define quais arquivos podem ser vistos, quais comandos podem executar e onde a autorização aparece.' }, { type: 'surfaces' }, { type: 'result', title: 'Decisão para esta formação', items: ['IntelliJ permanece aberto como IDE Java.', 'Codex é usado pelo terminal integrado na raiz do laboratório.', 'Plugin desconhecido não recebe confiança por parecer conveniente.'] }] },
  { id: 'preparo', label: 'Preparar com segurança', duration: '14 min', eyebrow: 'INTELLIJ + TERMINAL', title: 'Valide ferramenta, pasta, login e permissão antes do primeiro prompt', blocks: [{ type: 'lead', text: 'Eu vou guiá-lo por um caminho atual e verificável. Cada comando tem uma saída, uma interpretação e um ponto de parada.' }, { type: 'setup' }, { type: 'note', title: 'Sandbox não é aprovação', text: 'Sandbox define o que tecnicamente pode ser feito; política de aprovação define quando o agente precisa parar e pedir consentimento. Comece em leitura.' }] },
  { id: 'prompt', label: 'Construir bons pedidos', duration: '11 min', eyebrow: 'PROMPT COM MÉTODO', title: 'Um prompt bom delimita o trabalho e melhora seu próprio raciocínio', blocks: [{ type: 'lead', text: 'Pedido útil declara o objetivo, o que você sabe, o nível atual, o escopo, as restrições e como a resposta será validada.' }, { type: 'prompts' }, { type: 'note', title: 'Prompt não é prova', text: 'Uma instrução excelente reduz ambiguidades; ela não transforma a resposta em verdade.' }] },
  { id: 'plano', label: 'Exigir plano e limite', duration: '10 min', eyebrow: 'ANTES DA ESCRITA', title: 'Autorize uma ação menor que o problema inteiro', blocks: [{ type: 'lead', text: 'Observe como uma conversa profissional preserva hipótese, escopo e consentimento. A IA não recebe autorização implícita para “aproveitar e corrigir tudo”.' }, { type: 'chat' }, { type: 'result', title: 'Contrato antes da mudança', items: ['Problema e hipótese foram registrados.', 'Arquivos previstos apareceram antes da escrita.', 'A autorização limitou exatamente o próximo passo.'] }] },
  { id: 'seguranca', label: 'Proteger o contexto', duration: '13 min', eyebrow: 'GATE DE SEGURANÇA', title: 'Pergunte se pode enviar antes de perguntar se a IA pode ajudar', blocks: [{ type: 'lead', text: 'Segredo, dado pessoal, código corporativo, log interno e material proprietário não viram seguros só porque o prompt é técnico.' }, { type: 'security' }, { type: 'note', tone: 'danger', title: 'Se houver dúvida, não envie', text: 'Siga política da empresa, contrato, confidencialidade, regras do cliente e orientação de segurança. Anonimização reduz contexto; não cria autorização.' }] },
  { id: 'diff', label: 'Validar código e diff', duration: '16 min', eyebrow: 'EVIDÊNCIA TÉCNICA', title: 'Uma sugestão que compila ainda pode quebrar a regra de negócio', blocks: [{ type: 'lead', text: 'Vamos revisar uma mudança convincente, porém errada. Primeiro lemos o diff, depois executamos cenários, diagnosticamos a causa e só então corrigimos.' }, { type: 'diff' }, { type: 'result', title: 'Gate de aceitação', items: ['O diff respeita o plano e não adiciona dependência.', 'Casos positivos, negativos e de borda foram executados.', 'Você entende por que o código funciona — não apenas que passou.'] }] },
  { id: 'delegacao', label: 'Calibrar autonomia', duration: '10 min', eyebrow: 'RISCO E REVERSIBILIDADE', title: 'Nem toda tarefa merece o mesmo nível de autonomia', blocks: [{ type: 'lead', text: 'Explicar, propor, editar e executar são níveis diferentes. O impacto da decisão determina até onde a assistência pode avançar.' }, { type: 'delegation' }, { type: 'note', title: 'Arquitetura continua humana', text: 'A IA pode comparar monólito e microserviços, mas contexto, custo, consistência, time, legado e risco pertencem à decisão responsável.' }] },
  { id: 'politica', label: 'Registrar regras duráveis', duration: '12 min', eyebrow: 'ARQUIVOS DO PROJETO', title: 'Transforme o método em instruções que sobrevivem ao chat', blocks: [{ type: 'lead', text: 'Regras repetidas deixam de depender da memória quando têm escopo, comandos e critérios verificáveis.' }, { type: 'docs' }, { type: 'note', title: 'Não transforme AGENTS.md em manifesto', text: 'Mantenha regras curtas, práticas e ligadas a erros reais. Instrução mais específica pode valer apenas para uma subpasta.' }] },
  { id: 'antipadroes', label: 'Recuperar falhas comuns', duration: '12 min', eyebrow: 'CLÍNICA DE MENTORIA', title: 'Reconheça a dependência antes que ela pareça produtividade', blocks: [{ type: 'lead', text: 'Passe pelos dez antipadrões e, em cada um, nomeie sintoma, correção e confirmação sem consultar a resposta anterior.' }, { type: 'errors' }, { type: 'note', title: 'Fonte de verdade depende da alegação', text: 'Comportamento do programa: execução/teste. Estado do workspace: Git. Opção ou versão mutável: documentação oficial. Decisão de negócio: regra autorizada e seus responsáveis.' }] },
  { id: 'entrega', label: 'Entregar e defender', duration: '13 min', eyebrow: 'DESAFIO FINAL', title: 'Feche a aula com protocolo, evidência e histórico limpo', blocks: [{ type: 'lead', text: 'Agora una documentação, validação e Git. Não prepare tudo com `git add .`: selecione os arquivos que pertencem a esta intenção.' }, { type: 'delivery' }, { type: 'challenge', title: 'Transferência: IA como mentora, não autora invisível', text: 'Escolha um erro real de um laboratório anterior. Registre sua hipótese, produza um exemplo mínimo autorizado, peça somente um roteiro de diagnóstico, execute as verificações e escreva no diário o que a evidência confirmou ou refutou.', acceptance: ['O prompt contém nível, escopo, restrições e validação.', 'Nenhum dado sensível ou código não autorizado foi enviado.', 'A resposta foi confrontada com execução, teste ou fonte oficial.', 'O diff final contém apenas a intenção declarada.', 'Você consegue explicar a solução sem abrir a conversa da IA.'] }] }
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const map = { cycle: SupervisedCycle, surfaces: SurfaceMap, setup: SetupLab, prompts: PromptWorkshop, chat: PlanChat, security: SecurityGate, diff: DiffReviewLab, delegation: DelegationLab, docs: PolicyDocs, errors: ErrorClinic, delivery: DeliveryLab };
  if (map[block.type]) { const Component = map[block.type]; return <Component />; }
  if (block.type === 'note') { const Icon = block.tone === 'warning' || block.tone === 'danger' ? AlertTriangle : Lightbulb; return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedCodexEthicsLesson014({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-codex-ethics-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Bot size={17} /> Mentoria de IA supervisionada</span><p className="guided-sequence">014 · M0.14</p><h1>Use IA sem entregar seu raciocínio, seus dados ou sua responsabilidade</h1><p>Opere Codex pelo terminal do IntelliJ, limite permissões, construa prompts melhores e aceite mudanças somente depois de evidência, diff e explicação humana.</p></div><div className="guided-hero-status"><ShieldCheck size={42} /><strong>{progress}%</strong><span>{label}</span></div><div className="guided-progress-track" aria-label={'Progresso: ' + progress + '%'}><span style={{ width: progress + '%' }} /></div></header>
    <GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 1, label: 'fluxo supervisionado' }, { value: 3, label: 'gates de aceitação' }, { value: 10, label: 'antipadrões recuperáveis' }]} />
    <div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 014"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completed.has(step.id) ? 'done' : '')} onClick={() => select(index)}><span className="guided-step-number">{completed.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{active.eyebrow} · {active.duration}</span><h2>{active.title}</h2></div><div className="guided-blocks">{active.blocks.map((block, index) => <ContentBlock block={block} key={active.id + '-' + block.type + '-' + index} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => select(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (activeDone ? 'undo' : 'complete')} onClick={toggle}>{activeDone ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeDone} onClick={() => select(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonDone ? 'Protocolo de IA assumido' : 'Mentoria concluída'}</h3><p>{lessonDone ? 'Método, segurança, validação e rastreabilidade foram confirmados.' : 'Conclua a aula para liberar a instalação do Maven.'}</p></div><button type="button" className={lessonDone ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonDone ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 013</button><div className={'guided-course-status ' + (lessonDone ? 'completed' : allDone ? 'ready' : '')}>{lessonDone ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonDone ? 'Aula concluída' : allDone ? 'Pronta para concluir' : completed.size + ' de ' + steps.length + ' etapas'}</strong><small>{lessonDone ? 'IA sob responsabilidade humana' : allDone ? 'Use o botão acima' : 'Pensar, limitar, validar e registrar'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonDone}>Aula 015 <ArrowRight size={17} /></button></footer>
  </article>;
}
