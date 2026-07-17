# Blueprint de reconstrução das aulas

## 1. Finalidade deste documento

Este documento permite que qualquer novo chat, pessoa ou agente continue a reconstrução da Formação Java com o mesmo padrão aprovado nas aulas 008 e 010.

Ele não é uma sugestão estética. É o contrato pedagógico, visual e técnico da reconstrução.

O objetivo não é “embelezar Markdown”. O objetivo é transformar cada aula em uma experiência guiada semelhante a uma boa aula ministrada por um professor: o aluno sabe o que fará, onde clicar ou o que digitar, o que deve acontecer, por que aconteceu, como reconhecer um erro e como provar que aprendeu.

## 2. Princípio central

> Preservar toda competência e profundidade técnica única da aula antiga, eliminar apenas repetição sem valor adicional e reconstruir a explicação do zero em uma sequência guiada, visual, verificável e praticável.

“Preservar conteúdo” não significa copiar frases, parágrafos ou a ordem antiga.

Significa criar um destino explícito para cada:

- conceito técnico;
- comando;
- opção ou parâmetro relevante;
- saída importante;
- exemplo com variação única;
- erro comum;
- regra de segurança;
- atividade;
- relação com backend, testes, arquitetura ou produção;
- critério de conclusão.

É permitido consolidar três explicações repetidas em uma explicação melhor. Não é permitido remover uma nuance técnica porque ela é difícil de ensinar.

## 3. Fontes de verdade

### 3.1 Conteúdo original

As aulas originais ficam em:

```text
docs/aulas/
```

Cada aula escolhida deve ser lida integralmente antes de qualquer implementação. Não basta ler títulos, procurar palavras ou confiar no nome do arquivo.

### 3.2 Estado da reconstrução

O estado estruturado fica em:

```text
docs/revisao-aulas/STATUS_REVISAO.json
```

O cronograma humano é gerado em:

```text
docs/revisao-aulas/CRONOGRAMA_COMPLETO.md
```

Nunca marque uma aula diretamente no cronograma. Atualize o JSON e execute:

```powershell
node tools/update-lesson-review-schedule.mjs
```

### 3.3 Referências de implementação aprovadas

#### Aula 000 — Abertura guiada da formação

Arquétipo: orientação interativa e pacto de estudo.

```text
plataforma-curso/src/components/GuidedCourseOpeningLesson000.jsx
plataforma-curso/src/components/guidedCourseOpeningLesson.css
docs/revisao-aulas/matrizes/000_AULA_DE_ABERTURA.md
```

O que aprender com essa referência:

- transformar uma introdução conceitual em decisões e evidências observáveis;
- usar mapas exploráveis para ensinar relações sem criar decoração vazia;
- distinguir promessa pedagógica de garantia de cargo ou senioridade;
- mostrar um fluxo de backend antes de aprofundar suas tecnologias;
- treinar julgamento sobre método de estudo e uso de IA;
- terminar com um compromisso pessoal que possa ser verificado.

#### Aula 008 — Debug inicial no IntelliJ

Arquétipo: laboratório de interface interativa.

```text
plataforma-curso/src/components/GuidedIntelliJLesson008.jsx
plataforma-curso/src/components/guidedIntelliJLesson.css
```

O que aprender com essa referência:

- transformar uma interface complexa em uma simulação didática;
- identificar Project, editor, gutter, toolbar e painéis inferiores;
- permitir que o aluno clique em breakpoint e controles;
- atualizar linha atual, variáveis, Watch, Call Stack e Console;
- explicar o estado antes e depois de uma instrução;
- usar um cenário de negócio único para conectar vários conceitos;
- preservar exemplos secundários em tabelas, experimentos e desafios;
- aplicar destaque de sintaxe dentro e fora da simulação.

Não copie a tela de debug para assuntos que não precisam dela. Copie o raciocínio: tornar visível o estado que o aluno precisa entender.

#### Aula 010 — Git local do zero

Arquétipo: laboratório de terminal guiado.

```text
docs/aulas/010_M0_10_GIT_LOCAL_DO_ZERO.md
plataforma-curso/src/components/GuidedGitLesson010.jsx
plataforma-curso/src/components/guidedLesson.css
plataforma-curso/public/lesson-assets/010-git-local/
```

O que aprender com essa referência:

- apresentar um comando por intenção, não como lista para copiar;
- mostrar a saída esperada logo após o comando;
- explicar o significado da saída;
- separar resultado invariável de valores que mudam, como hash e versão;
- mostrar o estado antes e depois de `add`, `commit` e `restore`;
- incluir diagramas quando uma relação entre áreas é difícil de compreender em prosa;
- ensinar recuperação segura, não apenas o caminho feliz;
- terminar com um desafio verificável e um estado final conhecido.

### 3.4 Integração na plataforma

O roteamento das experiências especiais acontece em:

```text
plataforma-curso/src/components/MarkdownViewer.jsx
```

As aulas 008 e 010 são despachadas para componentes próprios. A visualização Markdown padrão continua sendo o fallback das aulas ainda não reconstruídas.

## 4. Regra de ouro contra perda de conteúdo

Antes de escrever a nova aula, crie uma matriz baseada em:

```text
docs/revisao-aulas/MODELO_MATRIZ_COBERTURA.md
```

A matriz deve responder:

1. O que existia na aula antiga?
2. O que era único?
3. O que era repetição?
4. Em qual etapa da aula nova cada item único aparece?
5. Qual evidência prova que o item foi ensinado?

Uma aula não pode ser marcada como `refeita` se houver uma linha única sem destino.

### 4.1 O que pode ser removido

- repetição literal;
- introduções que dizem várias vezes que o assunto é importante;
- listas diferentes que repetem os mesmos itens;
- exemplos idênticos com nomes trocados e nenhuma nova dificuldade;
- conclusões que apenas repetem a abertura;
- frases motivacionais sem função pedagógica;
- comandos repetidos sem mudança de estado ou interpretação.

### 4.2 O que não pode ser removido

- variações que mudam comportamento;
- riscos, limitações e efeitos colaterais;
- alternativas profissionais relevantes;
- erros comuns e diagnóstico;
- contexto de uso real;
- relações com conteúdos futuros;
- detalhes difíceis apenas por exigirem uma explicação melhor;
- exemplos que introduzem uma nova categoria de raciocínio.

### 4.3 Consolidação correta

É permitido substituir cinco pequenos programas por um laboratório coerente quando:

- o laboratório novo cobre todas as competências;
- as variações ainda são praticadas ou comparadas;
- a matriz mostra onde cada exemplo antigo foi absorvido;
- o novo cenário não aumenta a carga cognitiva antes da hora.

A aula 008 usa uma regra de reagendamento como eixo principal, mas continua cobrindo decisão, laço, método, `NullPointerException`, testes e Spring em blocos apropriados.

## 5. Processo obrigatório por aula

### Passo 1 — Selecionar a aula

Consulte o cronograma e confirme com o responsável qual aula ou lote pequeno está autorizado.

Não reconstrua centenas de aulas mecanicamente. Cada aula precisa de leitura, decisão de formato e validação.

### Passo 2 — Ler o original inteiro

Leia do primeiro ao último caractere. Registre:

- promessa da aula;
- pré-requisitos;
- conceitos;
- comandos;
- exemplos;
- atividades;
- erros;
- regras de segurança;
- conexões futuras;
- critérios de conclusão;
- repetições e lacunas.

### Passo 3 — Ler o contexto adjacente

Leia pelo menos:

- a aula anterior, para não reensinar tudo;
- a aula seguinte, para não antecipar sem necessidade;
- qualquer aula explicitamente referenciada.

O objetivo é manter a progressão de dificuldade.

### Passo 4 — Preencher a matriz de cobertura

Copie o modelo e associe cada item antigo a uma etapa nova.

Se um item não tem destino, a sequência ainda está incompleta.

### Passo 5 — Definir um resultado observável

Evite resultados vagos como “entender Git” ou “conhecer debug”.

Prefira:

- criar um repositório com quatro commits e estado limpo;
- pausar um programa, entrar em um método e justificar uma decisão;
- criar uma API que responde a uma requisição e validar o retorno;
- escrever uma consulta e confirmar linhas, plano e índice.

### Passo 6 — Escolher o arquétipo

Use o formato que revela melhor o estado do sistema.

#### Terminal guiado

Indicado para:

- Git;
- Maven e Gradle;
- Docker;
- comandos do sistema;
- execução Java;
- ferramentas CLI.

Precisa mostrar:

- onde executar;
- comando copiável;
- saída esperada;
- variações aceitáveis;
- significado da saída;
- erro provável e correção;
- comando de confirmação.

#### Interface guiada

Indicado para:

- IntelliJ;
- DBeaver;
- Postman/Insomnia;
- GitHub;
- painéis de CI/CD;
- ferramentas de observabilidade.

Precisa mostrar:

- região da interface;
- nome exato da ação;
- sequência de cliques;
- estado antes;
- estado depois;
- confirmação visual;
- variação por versão quando relevante.

Use simulação interativa quando o estado é a própria matéria. Use imagem estática quando basta localizar elementos. Nunca apresente uma simulação como screenshot oficial; identifique-a como simulação didática fiel.

#### Laboratório de código

Indicado para:

- sintaxe Java;
- orientação a objetos;
- collections;
- testes;
- Spring;
- arquitetura e padrões.

Precisa mostrar:

- estrutura de arquivos;
- código com destaque de sintaxe;
- alteração incremental;
- execução ou teste;
- saída, resposta ou falha;
- explicação de causa e efeito;
- refatoração quando fizer parte do objetivo.

#### Diagrama explicativo

Indicado quando três ou mais elementos possuem relações difíceis de explicar linearmente:

- fluxo de requisição;
- camadas;
- estados;
- ciclo de vida;
- dependências;
- concorrência;
- arquitetura distribuída.

O diagrama deve possuir rótulos claros e uma função na atividade. Decoração não é recurso didático.

### Passo 7 — Desenhar a sequência

A sequência padrão é:

1. resultado final e mapa da aula;
2. preparação e pré-requisitos;
3. primeira ação pequena;
4. evidência visível;
5. interpretação;
6. segunda ação que muda o estado;
7. erro intencional ou problema realista;
8. diagnóstico e recuperação;
9. variação ou aplicação profissional;
10. desafio sem copiar o roteiro;
11. critérios de conclusão.

Nem toda aula precisa de onze etapas. Toda aula precisa de começo, prática progressiva, evidência, diagnóstico e conclusão verificável.

### Passo 8 — Escrever como professor

Cada etapa precisa responder, na ordem:

1. O que faremos agora?
2. Por que isso vem agora?
3. Onde o aluno deve agir?
4. O que deve digitar ou clicar?
5. O que deve aparecer?
6. O que essa evidência significa?
7. O que fazer se aparecer algo diferente?
8. Como confirmar antes de avançar?

Use linguagem direta, adulta e acolhedora. Não presuma que o aluno já sabe abrir uma conta, localizar um menu ou interpretar uma saída.

Explique com precisão sem infantilizar.

### Passo 9 — Implementar a experiência

#### Nomes

Use:

```text
Guided<Assunto>LessonNNN.jsx
guided<Assunto>Lesson.css
```

Recursos específicos:

```text
plataforma-curso/public/lesson-assets/NNN-slug-curto/
```

Chave de progresso interno:

```text
guided-<assunto>-lesson-NNN-progress
```

#### Estrutura React

O padrão aprovado possui:

- cabeçalho com ID, título, promessa e progresso;
- navegação lateral ou horizontal de etapas;
- blocos de conteúdo orientados por dados;
- ações Anterior e Concluir etapa;
- persistência local das etapas;
- integração com conclusão e navegação geral da plataforma;
- layout responsivo.

Não transforme cada aula em um clone visual. Reutilize a linguagem de design e adapte os blocos ao assunto.

#### Regra de conclusão e navegação

Os controles de etapa e de aula possuem responsabilidades diferentes e não podem ser redundantes:

- `Concluir etapa` marca somente a etapa atual e não avança automaticamente;
- uma etapa concluída oferece `Desmarcar etapa`;
- `Próxima etapa` é uma ação separada e só fica disponível depois da conclusão da etapa atual;
- a navegação lateral pode abrir uma etapa para consulta, mas isso não a conclui;
- o botão `Concluir aula` só aparece depois que todas as etapas estão concluídas;
- existe apenas um botão de conclusão da aula;
- o rodapé mostra o estado da aula de forma passiva e mantém apenas a navegação entre aulas;
- `Próxima aula` permanece bloqueada até todas as etapas e a própria aula estarem concluídas;
- `Reabrir aula` desfaz a conclusão geral sem apagar as etapas já realizadas;
- ao desmarcar uma etapa de uma aula concluída, a conclusão geral também deve ser desfeita;
- um estado antigo inconsistente — aula concluída com etapas pendentes — deve ser normalizado ao abrir a experiência.

Essa regra evita conclusão acidental, deixa o progresso auditável e permite ao aluno corrigir uma marcação sem apagar todo o roteiro.

#### Integração no visualizador

Importe o componente em `MarkdownViewer.jsx` e adicione uma condição pelo prefixo exato do ID.

Exemplo conceitual:

```jsx
if (props.lesson?.id?.startsWith('NNN_')) {
  return <GuidedAssuntoLessonNNN {...props} />;
}
```

O fallback deve continuar funcionando para aulas pendentes.

### Passo 10 — Aplicar recursos visuais

#### Código

Todo código precisa de destaque de sintaxe estilo IDE.

Na plataforma já existe:

```jsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
```

Escolha a linguagem correta:

- `java`;
- `sql`;
- `json`;
- `yaml`;
- `xml`;
- `bash` ou `powershell`;
- `docker` quando suportado.

Regras:

- palavras-chave, tipos, strings, números, métodos e comentários devem ser distinguíveis;
- código longo deve ter numeração de linhas;
- o botão Copiar deve copiar somente o conteúdo, sem números;
- linhas longas não podem quebrar a página;
- o contraste precisa funcionar no tema escolhido;
- código dentro de uma simulação também precisa de realce;
- o código exibido precisa compilar ou ser explicitamente marcado como trecho.

#### Terminal

O terminal deve distinguir:

- comando digitado;
- saída;
- erro;
- explicação;
- valores variáveis.

Não invente uma saída idealizada. Confirme versões e comportamento quando forem instáveis. Quando hashes, caminhos ou versões variarem, diga isso.

#### Imagens, diagramas e simulações

Prioridade:

1. interface HTML/CSS interativa quando o estado precisa mudar;
2. SVG próprio para diagrama preciso e responsivo;
3. screenshot real quando a fidelidade da ferramenta é essencial e existe permissão para capturá-lo;
4. imagem gerada apenas para ilustração, nunca para fingir uma interface técnica verificável.

Toda imagem precisa de:

- texto alternativo;
- legenda que ensina como lê-la;
- boa resolução;
- comportamento responsivo;
- correspondência com o passo atual.

### Passo 11 — Ensinar erro e recuperação

Uma aula profissional não mostra apenas o caminho feliz.

Inclua:

- erro provável;
- mensagem ou sintoma;
- causa mais comum;
- verificação segura;
- correção;
- confirmação posterior.

Para operações destrutivas, ensine inspeção antes da execução. Não normalize comandos perigosos como primeira tentativa.

### Passo 12 — Criar o desafio

O desafio final não deve mandar repetir o roteiro trocando nomes.

Ele precisa exigir transferência:

- novo cenário;
- menos instruções;
- critérios de aceite observáveis;
- estado final verificável;
- uso consciente dos conceitos centrais.

### Passo 13 — Validar

Na pasta `plataforma-curso`:

```powershell
npm.cmd run build
npm.cmd run lint
```

Na raiz:

```powershell
git diff --check
```

Também valide:

- desktop;
- largura intermediária;
- celular a partir de 320 px;
- rolagem;
- botões;
- navegação de etapas;
- marcar e desmarcar uma etapa;
- bloqueio da próxima etapa enquanto a atual estiver pendente;
- bloqueio da conclusão e da próxima aula enquanto existirem etapas pendentes;
- reabertura da aula e normalização de estados inconsistentes;
- persistência;
- copiar código/comando;
- imagens;
- Console sem novos erros;
- estados vazios e erros.

Avisos antigos e não relacionados devem ser informados, não silenciosamente corrigidos durante outra aula.

### Passo 14 — Obter aprovação e atualizar estado

Antes da aprovação, use `em_revisao`.

Depois que o responsável aprovar:

1. mude para `refeita` em `STATUS_REVISAO.json`;
2. registre data, arquétipo, resumo e arquivos de referência;
3. execute o gerador do cronograma;
4. confira os totais;
5. faça `git diff --check`.

## 6. Padrão pedagógico detalhado

### 6.1 Uma aula é uma transformação

O aluno começa com um estado A e termina com um estado B.

Exemplos:

- pasta comum → repositório Git com histórico;
- programa opaco → execução pausada e explicada;
- classe inválida → objeto que protege invariantes;
- consulta lenta → plano entendido e índice justificado;
- endpoint sem proteção → autorização testada.

Se não é possível descrever a transformação, a aula provavelmente ainda é um material de consulta.

### 6.2 Evidência antes de abstração excessiva

Mostre um comportamento pequeno, permita observá-lo e então nomeie o conceito.

Definições continuam importantes, mas devem ajudar o aluno a interpretar o que viu.

### 6.3 Uma ação por bloco

Evite blocos que mandam executar dez comandos sem pausa.

Agrupe apenas comandos que formam uma operação inseparável. Depois mostre a saída e explique o estado.

### 6.4 Saída faz parte da aula

O aluno precisa saber:

- o que deve aparecer;
- o que pode variar;
- o que indica sucesso;
- o que indica que deve parar;
- como confirmar o estado.

### 6.5 Carga cognitiva progressiva

Introduza um novo tipo de dificuldade por vez:

- primeiro executar;
- depois observar;
- depois alterar;
- depois diagnosticar;
- depois aplicar sem roteiro.

### 6.6 Contexto real sem complexidade prematura

Use domínios realistas, mas limite a quantidade de classes e regras ao objetivo da aula.

Uma regra de reagendamento é útil porque se conecta ao backend. Um sistema inteiro de ordens de serviço dentro de uma aula inicial de `if` seria ruído.

## 7. Sistema visual

### 7.1 Continuidade

As aulas reconstruídas devem parecer partes do mesmo curso:

- tipografia consistente;
- cabeçalho forte;
- progresso visível;
- navegação de etapas;
- cartões de nota, alerta, resultado e desafio;
- espaçamento generoso;
- bordas e sombras contidas;
- responsividade.

### 7.2 Variação por assunto

O assunto pode definir um acento visual:

- Git: azul e verde, terminal e diagramas de estado;
- IntelliJ/debug: roxo, turquesa e interface escura;
- banco: tons associados a dados e tabelas;
- segurança: contraste de risco e confirmação;
- observabilidade: linhas, eventos e correlação.

A cor complementa a estrutura; nunca deve ser a única forma de comunicar estado.

### 7.3 Acessibilidade

- use botões reais para ações;
- mantenha ordem natural de foco;
- escreva rótulos visíveis;
- forneça `aria-label` quando necessário;
- não remova foco do navegador;
- não dependa apenas de cor;
- mantenha contraste;
- use texto alternativo;
- permita leitura em telas pequenas sem sobreposição.

Responsividade obrigatória das aulas guiadas:

- a página nunca pode criar rolagem horizontal por causa de texto, botão, cartão, imagem ou diagrama;
- containers em `grid` ou `flex` precisam aceitar encolhimento com `min-width: 0`;
- palavras, URLs e rótulos longos precisam quebrar dentro do próprio bloco;
- código, tabelas e simulações que exigem largura podem ter rolagem interna, mas não ultrapassar o fundo da aula;
- mapas e controles devem reorganizar colunas progressivamente em larguras intermediárias e no celular;
- a navegação de etapas pode rolar horizontalmente dentro do próprio trilho em telas estreitas;
- valide explicitamente desktop amplo, janela lateral reduzida, 640 px, 360 px e 320 px.

### 7.4 Moldura permanente da plataforma

A página inicial e o navegador lateral formam a moldura do curso. Eles devem ajudar o aluno a começar ou retomar o estudo sem competir visualmente com as aulas.

Referências atuais:

- abertura e conteúdo: `plataforma-curso/src/components/WelcomeView.jsx`;
- acabamento compacto da abertura: `plataforma-curso/src/components/welcomeElegance.css`;
- estrutura do navegador: `plataforma-curso/src/components/Sidebar.jsx`;
- acabamento do navegador: `plataforma-curso/src/components/sidebarNavigator.css`.

Regras para a página inicial:

- tratar a abertura como uma introdução editorial, não como um painel publicitário gigante;
- manter título, proposta, ações, mapa das fases e indicadores, mas com altura e densidade controladas;
- representar as cinco fases como uma trilha editorial de etapas, sem painéis tecnológicos decorativos, constelações ou ilustrações que não ajudem na navegação;
- evitar grandes massas escuras e cartões excessivamente aninhados;
- fazer a ação de continuar estudando ser a principal;
- preservar legibilidade e ordem de leitura no celular;
- não duplicar na abertura informações que já estão detalhadas no currículo abaixo.

Alterações na moldura não mudam o conteúdo pedagógico das aulas nem o estado do cronograma. Elas só devem ser registradas neste blueprint quando estabelecerem um padrão reutilizável.

## 8. Critério de conclusão de uma aula

Uma aula só está pronta quando:

- a matriz cobre 100% do conteúdo único;
- a sequência é ensinável sem assistência externa;
- comandos e cliques possuem contexto;
- código possui destaque de sintaxe;
- saídas e estados esperados estão visíveis;
- erros relevantes possuem recuperação;
- existe uma prática guiada;
- existe um desafio de transferência;
- os critérios de aceite são objetivos;
- build, lint e diff check foram executados;
- desktop e celular foram verificados;
- o responsável pelo curso aprovou.

## 9. Antipadrões proibidos

- trocar apenas Markdown por cartões bonitos;
- escrever páginas longas de definições antes da primeira ação;
- mandar executar sem mostrar saída;
- presumir que o aluno sabe localizar telas, criar contas ou configurar ferramentas;
- usar “faça isso” sem explicar por quê;
- repetir o mesmo conceito para aumentar a quantidade de aulas;
- remover conteúdo avançado para terminar mais rápido;
- criar screenshots falsos de ferramentas;
- usar código sem cores;
- apresentar código que não compila sem avisar;
- criar uma simulação que não corresponde à explicação;
- marcar como refeita antes de aprovação;
- reconstruir em massa com uma plantilla genérica;
- editar trabalho não relacionado durante a reconstrução.

## 10. Protocolo para retomar em outro chat

O novo chat deve executar esta ordem:

1. ler este blueprint inteiro;
2. ler `README.md` desta pasta;
3. ler `STATUS_REVISAO.json`;
4. consultar o início e o módulo relevante do cronograma;
5. abrir as referências 008 e 010;
6. confirmar qual aula está autorizada;
7. ler integralmente o original e as aulas adjacentes;
8. preencher a matriz de cobertura;
9. apresentar ou implementar a nova experiência;
10. validar;
11. aguardar aprovação;
12. atualizar o estado e gerar o cronograma.

Se alguma referência estiver ausente ou não compilar, o trabalho deve parar e o problema deve ser informado. Não se deve improvisar silenciosamente um padrão diferente.

## 11. Manutenção deste blueprint

Quando uma nova aula introduzir um arquétipo realmente novo — por exemplo, laboratório de banco, API interativa ou diagrama de arquitetura — registre:

- a aula aprovada;
- o novo componente;
- o CSS;
- os recursos;
- o que esse arquétipo ensina;
- quais assuntos se beneficiam dele;
- quais erros evitar.

O blueprint pode evoluir, mas as regras de preservação, cobertura, prática, evidência e validação não podem ser enfraquecidas.
