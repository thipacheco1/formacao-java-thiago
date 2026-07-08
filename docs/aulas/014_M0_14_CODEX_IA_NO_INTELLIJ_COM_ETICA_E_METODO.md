# 014 — M0.14 — Codex, IA no IntelliJ, Ética e Método de Uso

## IA validada com segurança

- [ ] Ferramenta/integração veio de fonte oficial ou aprovada.
- [ ] Login realizado sem expor senha no projeto.
- [ ] Permissões foram lidas.
- [ ] Teste feito em projeto pequeno.
- [ ] Nenhum segredo foi enviado.
- [ ] Nenhum código corporativo sensível foi enviado.
- [ ] Sugestão revisada antes de aceitar.
- [ ] `git diff` conferido após qualquer alteração.
```

### Regra desta formação

```text
IA ajuda.
IA não decide sozinha.
IA não substitui leitura.
IA não substitui teste.
IA não substitui debug.
IA não substitui responsabilidade.
```

---

## Hoje a aula é sobre usar IA sem virar refém dela

Existe uma diferença enorme entre usar IA como apoio e usar IA como substituto do pensamento.

Uso ruim:

```text
faz para mim
me entrega pronto
não quero entender
cola no projeto
se rodar está bom
```

Uso bom:

```text
me explique o erro
me mostre alternativas
me ajude a revisar esta decisão
aponte riscos
gere um exemplo pequeno
compare abordagens
me faça perguntas sobre meu raciocínio
revise meu código e explique os problemas
```

A IA deve funcionar como um par técnico.

Não como alguém que assume seu teclado enquanto você para de pensar.

A formação inteira existe para construir autonomia.

Então a regra é:

```text
IA pode acelerar o caminho,
mas não pode andar no seu lugar.
```

---

## O que é Codex neste contexto

Codex é um agente de programação da OpenAI voltado a tarefas de desenvolvimento.

Ele pode ajudar em atividades como:

```text
entender código;
escrever código;
revisar código;
sugerir testes;
investigar erros;
propor refatorações;
explicar trechos;
executar tarefas locais dependendo da configuração;
trabalhar com contexto do repositório;
apoiar fluxos de terminal, IDE ou ambiente conectado.
```

A forma exata de instalação, disponibilidade e recursos pode mudar com o tempo.

Por isso, a regra profissional é:

```text
para instalação e detalhes atualizados, consultar a documentação oficial da ferramenta.
```

Nesta formação, o foco não é decorar uma tela específica.

O foco é aprender o método correto de uso.

---

## Codex, extensão de IDE e terminal

Ferramentas de IA para código normalmente podem aparecer em diferentes superfícies:

```text
extensão dentro da IDE;
CLI no terminal;
aplicativo separado;
integração com repositório remoto;
tarefas delegadas na nuvem;
chat com contexto do projeto.
```

No caso do IntelliJ, a abordagem pode ser:

```text
usar extensão compatível com IDEs JetBrains, quando disponível;
usar Codex CLI no terminal integrado da IDE;
usar ChatGPT/Codex fora da IDE para explicação e revisão;
usar IA apenas com contexto seguro e permitido.
```

O ponto mais importante:

```text
a ferramenta pode mudar,
mas o método de segurança e raciocínio permanece.
```

Se a extensão mudar de nome, interface ou instalação, você ainda precisa saber:

```text
o que ela pode ler;
o que ela pode alterar;
quais comandos pode executar;
que permissões recebeu;
qual contexto está sendo enviado;
como validar o resultado;
como revisar com Git.
```

---

## IA no IntelliJ não substitui Java, Git e Debug

IA pode sugerir código.

Mas ela não substitui:

```text
entender Java;
saber compilar;
saber executar;
saber debugar;
saber ler erro;
saber usar Git;
saber escrever teste;
saber validar regra de negócio;
saber proteger dados;
saber revisar diff.
```

Se uma IA gera código e você não entende, o código não é realmente seu domínio.

No ambiente profissional, isso é perigoso.

Quando um bug aparecer, a IA não estará necessariamente lá para responder por você.

Quem precisa defender a alteração é o desenvolvedor.

Portanto:

```text
não aceite código que você não consegue explicar.
```

Essa é uma das regras centrais da aula.

---

## O uso correto da IA na formação

Durante esta formação, a IA deve ser usada para:

```text
explicar conceito;
criar analogias;
gerar exemplos menores;
revisar seu raciocínio;
sugerir exercícios;
apontar erros;
propor perguntas de revisão;
comparar soluções;
analisar código que você escreveu;
ajudar a entender mensagens de erro;
sugerir passos de diagnóstico.
```

A IA não deve ser usada para:

```text
pular aula;
resolver exercício sem tentativa;
gerar projeto inteiro sem você entender;
colar código sem revisão;
substituir debug;
substituir leitura de documentação;
substituir teste;
substituir raciocínio de negócio;
enviar dados sensíveis;
expor código corporativo sem autorização.
```

A diferença é simples:

```text
IA boa aumenta sua capacidade.
IA ruim substitui temporariamente sua capacidade e impede evolução.
```

---

## Regra de ouro

A regra de ouro desta formação é:

```text
toda resposta de IA precisa passar por entendimento, revisão e validação.
```

Em termos práticos:

```text
entendi o que foi sugerido?
sei explicar por que funciona?
sei explicar por que é seguro?
sei explicar quais casos não cobre?
rodei o código?
testei o comportamento?
olhei o diff?
o commit ficou claro?
não enviei segredo?
```

Se a resposta for “não”, ainda não está pronto.

---

## O ciclo correto de uso da IA

Use este ciclo:

```text
1. Eu tento entender o problema.
2. Eu escrevo minha hipótese.
3. Eu peço ajuda para a IA.
4. Eu comparo a resposta com minha hipótese.
5. Eu implemento em partes pequenas.
6. Eu rodo.
7. Eu debugo se necessário.
8. Eu testo.
9. Eu reviso o diff.
10. Eu registro no diário.
11. Eu faço commit.
```

Esse ciclo evita dependência.

A IA entra no meio do processo, não no lugar do processo.

---

## A pergunta ruim e a pergunta boa

### Pergunta ruim

```text
Faça uma API de pedidos em Java com Spring Boot.
```

Essa pergunta é vaga.

Ela pode gerar um monte de código sem contexto.

### Pergunta melhor

```text
Estou estudando Java básico e ainda não entrei em Spring Boot.
Quero um exemplo pequeno, em Java puro, que represente um Pedido com id, cliente e valor total.
Não use framework.
Explique cada classe e me diga quais erros comuns devo evitar.
```

A segunda pergunta tem:

```text
nível atual;
limite técnico;
escopo;
objetivo;
restrição;
pedido de explicação.
```

Prompt bom melhora resposta.

Mas o mais importante é que ele força você a pensar.

---

## Prompts úteis para aprendizado

Use prompts assim:

```text
Explique este erro como se eu estivesse aprendendo Java, mas sem pular os detalhes técnicos.
```

```text
Revise meu código e aponte problemas de legibilidade, regra de negócio e possíveis casos de borda.
```

```text
Não resolva direto. Faça perguntas para eu chegar na solução.
```

```text
Me dê um exemplo mínimo antes de mostrar uma versão mais profissional.
```

```text
Compare duas abordagens e explique trade-offs.
```

```text
Aponte o que está correto no meu raciocínio e o que ainda está fraco.
```

```text
Gere testes para este método e explique quais cenários cada teste cobre.
```

```text
Leia esta mensagem de erro e me ajude a montar um roteiro de diagnóstico.
```

Esses prompts usam IA como mentor técnico, não como cola.

---

## Prompts perigosos

Evite prompts como:

```text
faz tudo para mim
```

```text
gera o projeto completo
```

```text
corrige sem explicar
```

```text
ignora os testes
```

```text
não precisa explicar
```

```text
usa qualquer biblioteca
```

```text
pode colocar uma solução rápida
```

```text
não se preocupe com segurança
```

Esses pedidos treinam dependência e aceitação cega.

Em backend, aceitação cega custa caro.

---

## Contexto mínimo antes de pedir ajuda

Antes de pedir ajuda para IA, forneça contexto.

Um bom contexto inclui:

```text
objetivo;
nível atual;
código relevante;
erro completo;
comando executado;
resultado esperado;
resultado obtido;
restrições;
o que você já tentou;
o que não quer que a IA faça.
```

Exemplo:

```text
Estou estudando compilação manual com javac.
Tenho este arquivo Main.java.
Rodei javac Main.java e apareceu este erro.
Eu esperava gerar Main.class.
Não quero solução com Maven ainda.
Explique a causa e me diga como diagnosticar.
```

Isso é muito melhor do que:

```text
deu erro, arruma
```

---

## IA e segurança

Segurança é um ponto central.

Não envie para IA:

```text
senhas;
tokens;
chaves privadas;
certificados;
dados reais de cliente;
dados pessoais sensíveis;
código corporativo sem autorização;
logs com informação sensível;
arquivos internos protegidos;
estratégias confidenciais;
URLs internas sensíveis;
credenciais de banco;
conteúdo de produção.
```

Mesmo quando a ferramenta tem controles de privacidade, o desenvolvedor precisa agir com responsabilidade.

Em contexto corporativo, sempre respeite:

```text
política da empresa;
contrato;
LGPD;
confidencialidade;
regras de cliente;
normas internas de segurança.
```

A pergunta correta não é apenas:

```text
a IA consegue me ajudar?
```

A pergunta correta é:

```text
eu tenho permissão para enviar este contexto?
```

---

## Como anonimizar contexto

Quando precisar pedir ajuda sem expor dados, transforme o caso.

Exemplo sensível:

```text
Cliente Maria Silva, CPF..., pedido..., contrato...
```

Transforme em:

```text
Cliente A, documento fictício, pedido 123, contrato X.
```

Troque dados reais por placeholders:

```text
CLIENTE_EXEMPLO
DOCUMENTO_EXEMPLO
TOKEN_REMOVIDO
URL_INTERNA_REMOVIDA
```

Remova:

```text
credenciais;
tokens;
nomes reais;
dados pessoais;
IDs internos sensíveis;
informação de produção.
```

Mas cuidado: anonimizar mal ainda pode vazar contexto.

Quando houver dúvida, não envie.

---

## IA e código corporativo

Em empresa, código é ativo da organização.

Não cole código corporativo em ferramenta externa sem autorização.

Mesmo se o objetivo for só “explicar um erro”, pode haver risco.

Alternativas:

```text
criar exemplo mínimo reproduzível sem dados sensíveis;
descrever o problema de forma abstrata;
usar nomes fictícios;
consultar política interna;
usar ferramenta aprovada pela empresa;
limitar o contexto ao necessário.
```

Exemplo seguro:

```java
public boolean podeExecutar(String status, boolean bloqueado) {
    return status.equals("AGENDADO") && !bloqueado;
}
```

Exemplo inseguro:

```text
colar service real da empresa com regras, nomes internos, credenciais, URLs e dados de cliente.
```

Profissional forte protege contexto.

---

## IA e direitos autorais

Outro cuidado: não peça para copiar código proprietário de terceiros.

Não peça:

```text
me dê o código completo daquela biblioteca fechada
```

Não use IA para burlar licença.

Em projeto profissional, respeite:

```text
licenças;
autoria;
dependências;
termos de uso;
código aberto;
código proprietário.
```

Se a IA sugerir código, você ainda precisa verificar se faz sentido e se não introduz dependência inadequada.

---

## IA e testes

Uma das melhores formas de usar IA é gerar hipóteses de teste.

Exemplo:

```text
Tenho este método de cálculo de desconto.
Liste casos de teste importantes, incluindo bordas e entradas inválidas.
Não escreva o código ainda; primeiro explique os cenários.
```

Depois:

```text
Agora gere testes JUnit para esses cenários.
Explique o que cada teste prova.
```

Isso é uso bom.

A IA ajuda a pensar em casos.

Mas você revisa, ajusta e executa.

Teste gerado e não executado não prova nada.

---

## IA e debug

IA não substitui debug.

Mas pode ajudar a montar roteiro.

Exemplo:

```text
Meu programa entra no else quando eu esperava entrar no if.
As variáveis são status, dataValida e bloqueado.
Me ajude a montar um roteiro de debug no IntelliJ.
```

Uma resposta útil pode sugerir:

```text
colocar breakpoint antes do if;
observar cada variável;
usar Step Into no método de validação;
verificar retorno booleano;
testar cada cenário.
```

Você ainda precisa executar.

Debug é evidência.

IA é orientação.

---

## IA e Git

Antes de aceitar alteração sugerida por IA:

```bash
git status
git diff
```

Depois de aplicar:

```bash
git status
git diff
```

Leia o diff.

Pergunte:

```text
quais arquivos mudaram?
a IA mexeu onde não deveria?
removeu algo importante?
adicionou dependência?
alterou comportamento?
mudou formatação demais?
criou arquivo desnecessário?
```

Só depois:

```bash
git add
git commit
```

IA sem Git é risco maior.

Git permite revisar, comparar e voltar.

---

## IA e commits

Não faça commit com mensagem:

```text
codigo da IA
```

A mensagem deve refletir a mudança técnica.

Exemplo:

```text
Adiciona validacao de status para reagendamento
```

ou:

```text
Cria testes para calculo de desconto
```

Mesmo que a IA tenha ajudado, o commit deve comunicar o que foi feito.

Você é responsável pelo commit.

---

## IA e aprendizado Java

Durante módulos de Java básico, use IA com restrição.

Exemplo:

```text
Não use recursos avançados.
Não use Spring.
Não use Lombok.
Não use streams.
Use apenas if, for, métodos e classes simples.
Explique linha por linha.
```

Isso evita que a IA entregue código acima do nível da aula.

Um erro comum é pedir solução e receber algo tecnicamente correto, mas incompatível com o momento da formação.

Exemplo:

```text
usar Stream antes de aprender laço;
usar record antes de entender classe;
usar Spring antes de entender main;
usar BigDecimal antes de entender tipos básicos;
usar design pattern antes de entender método.
```

A IA precisa respeitar o nível atual.

Você deve informar esse nível.

---

## IA e arquitetura

Mais tarde, IA pode ajudar a discutir arquitetura.

Mas com cuidado.

Arquitetura não é escolher padrão bonito.

Ao pedir ajuda, forneça contexto:

```text
tipo de sistema;
volume esperado;
consistência necessária;
integrações;
falhas possíveis;
restrições;
time;
prazo;
custo;
legado;
segurança;
observabilidade.
```

Pergunta ruim:

```text
qual arquitetura devo usar?
```

Pergunta melhor:

```text
Tenho um sistema de pedidos com integração assíncrona para faturamento.
A consistência do estoque precisa ser forte no momento da reserva, mas a notificação pode ser eventual.
Compare monólito modular e microserviços para este cenário, apontando trade-offs.
```

IA pode ajudar a pensar.

Mas decisão arquitetural exige responsabilidade humana.

---

## IA e alucinação

IA pode errar.

Pode inventar método que não existe.

Pode citar biblioteca errada.

Pode sugerir configuração antiga.

Pode confundir versão.

Pode dar comando perigoso.

Pode criar teste que não testa nada.

Pode explicar com confiança algo incorreto.

Então, sempre valide.

Validação pode ser:

```text
rodar código;
rodar teste;
consultar documentação oficial;
verificar versão;
debugar;
revisar diff;
pedir segunda análise;
comparar com conhecimento da aula;
fazer exemplo mínimo.
```

A confiança da resposta não prova correção.

Eloquência não é evidência.

---

## IA e documentação oficial

Quando o assunto envolve instalação, versão, configuração de ferramenta ou comportamento que muda, consulte documentação oficial.

Exemplos:

```text
instalação do Codex;
suporte a IDE;
configuração de sandbox;
políticas de aprovação;
uso de AGENTS.md;
configuração de CLI;
versão do Java;
plugins do IntelliJ;
Maven;
Spring Boot;
Docker;
PostgreSQL.
```

A IA pode explicar.

A documentação oficial confirma.

Em tecnologia atual, isso é obrigatório.

---

## AGENTS.md e instruções de projeto

Algumas ferramentas de IA para código permitem arquivos de instrução no projeto.

No ecossistema Codex, um arquivo como `AGENTS.md` pode ser usado para orientar o agente sobre convenções do repositório.

A ideia é:

```text
não repetir toda vez as mesmas regras;
registrar padrões do projeto;
orientar estilo, comandos, testes e limites;
deixar claro o que a IA pode ou não fazer.
```

Exemplo didático de `AGENTS.md`:

```markdown
# AGENTS.md

## Objetivo do projeto

Projeto de formação Java Backend.

## Regras de trabalho

- Não gerar código sem explicação.
- Não usar frameworks antes do módulo correspondente.
- Preferir exemplos pequenos e incrementais.
- Sempre sugerir validação com teste ou execução manual.
- Não criar arquivos fora da estrutura combinada.
- Não adicionar dependências sem justificar.
- Não usar dados sensíveis.
- Antes de alterar muitos arquivos, explicar o plano.

## Comandos úteis

```bash
git status
git diff
```

## Padrão de documentação

- Usar Markdown.
- Atualizar diário de bordo quando a prática for concluída.
```

Esse tipo de arquivo não substitui sua atenção.

Mas ajuda a manter consistência.

---

## Configuração e permissões

Ferramentas de IA local podem ter configurações para:

```text
modelo padrão;
aprovação antes de comandos;
modo sandbox;
permissão de leitura;
permissão de escrita;
execução de comandos;
configuração por usuário;
configuração por projeto.
```

A regra de segurança é:

```text
comece restritivo.
```

Não dê permissão total sem entender.

Prefira fluxos em que a ferramenta:

```text
explica antes de alterar;
mostra plano;
pede aprovação;
limita execução de comandos;
trabalha dentro do repositório;
permite revisar diff.
```

Em projeto desconhecido, redobre cuidado.

---

## Quando permitir alteração automática

Permitir alteração automática pode ser útil em tarefas pequenas e controladas.

Exemplo:

```text
corrigir formatação em um arquivo;
renomear variável local;
gerar teste simples;
ajustar README;
criar exemplo pequeno em labs.
```

Mas, mesmo assim, revise.

Evite permitir alteração automática em:

```text
segurança;
autenticação;
pagamento;
dados sensíveis;
migração de banco;
infraestrutura;
arquitetura central;
múltiplos arquivos sem plano;
código corporativo sem permissão;
comandos destrutivos;
alterações que você não entende.
```

A regra:

```text
quanto maior o risco, maior a revisão humana.
```

---

## Exemplo mínimo: usando IA como tutor

Cenário:

```text
Você não entendeu a diferença entre javac e java.
```

Prompt ruim:

```text
faz a aula para mim
```

Prompt bom:

```text
Estou estudando Java no início.
Explique a diferença entre `javac Main.java` e `java Main`.
Use um exemplo pequeno.
Depois me faça 3 perguntas para verificar se entendi.
Não use Maven nem IDE.
```

Resposta esperada deve ajudar a entender:

```text
javac compila;
java executa;
.java é fonte;
.class é bytecode;
Main é nome da classe;
Main.class não deve ser usado no comando java.
```

Depois, você pratica no terminal.

---

## Exemplo mínimo: usando IA para revisar seu código

Código:

```java
public class Calculadora {
    public static int somar(int a, int b) {
        return a + b;
    }
}
```

Prompt:

```text
Revise este código como estudo inicial de Java.
Não adicione frameworks.
Explique se o nome está claro, se o método está simples e quais testes mínimos eu poderia fazer.
```

Esse prompt direciona a IA.

Ela não deve transformar isso em arquitetura.

Ela deve revisar o nível certo.

---

## Exemplo aplicado ao domínio corporativo

Cenário:

```text
uma atividade só pode ser reagendada se status for AGENDADO ou REAGENDADO,
a data for válida
e o cliente não estiver bloqueado.
```

Código didático:

```java
public class RegraReagendamento {
    public static boolean podeReagendar(String status, boolean dataValida, boolean clienteBloqueado) {
        boolean statusPermitido = status.equals("AGENDADO") || status.equals("REAGENDADO");
        return statusPermitido && dataValida && !clienteBloqueado;
    }
}
```

Prompt bom:

```text
Revise esta regra didática de Java puro.
Quero entender possíveis riscos e casos de borda.
Não use Spring.
Não reescreva tudo sem explicar.
Aponte quais testes mínimos deveriam existir.
```

Uma boa resposta deve mencionar pontos como:

```text
status nulo pode causar NullPointerException;
status como String pode aceitar valor inválido;
enum seria melhor quando esse conceito for estudado;
testar AGENDADO;
testar REAGENDADO;
testar CONCLUIDO;
testar data inválida;
testar cliente bloqueado.
```

Perceba: a IA não precisa “fazer tudo”.

Ela ajuda a pensar.

---

## Como revisar uma resposta da IA

Use este checklist:

```markdown
- [ ] A resposta respeita o nível atual da formação?
- [ ] A resposta evita frameworks ainda não estudados?
- [ ] O código compila?
- [ ] O código roda?
- [ ] Eu entendi cada linha?
- [ ] Há teste ou validação manual?
- [ ] Há risco de segurança?
- [ ] A resposta inventou biblioteca, método ou configuração?
- [ ] A alteração é pequena o suficiente?
- [ ] O diff está limpo?
- [ ] A documentação foi atualizada se necessário?
```

Se algum item falhar, não aceite automaticamente.

---

## Como usar IA para aprender erro

Quando aparecer erro, não peça apenas “corrige”.

Use estrutura:

```text
Estou tentando fazer X.
Executei o comando Y.
Recebi o erro Z.
Eu esperava W.
Meu ambiente é A.
O que esse erro significa?
Quais hipóteses devo verificar?
Qual roteiro de diagnóstico devo seguir?
```

Exemplo:

```text
Estou compilando manualmente com `javac Main.java`.
O erro diz `';' expected`.
Explique o que significa e como localizar a linha.
Não corrija sem explicar.
```

Isso transforma erro em aprendizado.

---

## Como usar IA para criar perguntas de revisão

Depois de uma aula, peça:

```text
Com base nesta aula sobre Git local, gere 10 perguntas de revisão.
Não dê as respostas ainda.
Misture perguntas conceituais e práticas.
```

Depois responda.

Depois peça correção:

```text
Corrija minhas respostas.
Aponte onde meu entendimento está fraco.
```

Esse uso é excelente.

A IA vira ferramenta de revisão ativa.

---

## Como usar IA sem expor o projeto inteiro

Em vez de colar tudo, reduza.

Exemplo:

```text
Tenho uma classe Service grande.
Não posso compartilhar o código.
A regra é: ...
O problema observado é: ...
O método deveria retornar: ...
Hoje retorna: ...
Quais hipóteses posso verificar?
```

Ou crie um exemplo mínimo:

```java
public class Exemplo {
    public static boolean regra(String status) {
        return status.equals("AGENDADO");
    }
}
```

Exemplo mínimo reproduzível é uma das melhores práticas de diagnóstico.

Ele ajuda a IA e ajuda você.

---

## Fluxo seguro com IA dentro da IDE

Quando usar IA no IntelliJ ou terminal integrado, siga:

```bash
git status
```

Antes da IA alterar algo, veja o estado limpo.

Depois peça um plano:

```text
Antes de alterar arquivos, explique o plano e liste quais arquivos pretende modificar.
```

Depois da alteração:

```bash
git status
git diff
```

Leia tudo.

Rode o projeto ou teste:

```bash
javac Main.java
java Main
```

ou, futuramente:

```bash
mvn test
```

Se estiver correto:

```bash
git add .
git commit -m "Mensagem clara"
```

Se não estiver:

```bash
git restore arquivo
```

ou ajuste manualmente.

Nunca aceite alteração grande sem revisar diff.

---

## Exemplo de prompt com plano obrigatório

Use este modelo:

```text
Quero ajuda para melhorar este código.

Antes de alterar qualquer arquivo:
1. explique o problema que você encontrou;
2. proponha um plano curto;
3. diga quais arquivos seriam alterados;
4. aguarde minha aprovação.

Restrições:
- não adicionar dependências;
- não usar framework;
- manter compatível com Java 21;
- explicar depois como validar.
```

Esse prompt força controle.

Ele evita que a IA saia modificando tudo.

---

## Exemplo de prompt para revisão de diff

Depois de fazer alteração:

```text
Revise este diff como se fosse um code review.
Procure:
- bug lógico;
- caso de borda;
- nome ruim;
- acoplamento desnecessário;
- falta de teste;
- risco de segurança;
- alteração fora do escopo.
Não reescreva tudo. Liste primeiro os problemas.
```

Esse uso é muito bom.

A IA vira revisora.

Você continua dono da decisão.

---

## Exemplo de prompt para não pular nível

Durante Java básico:

```text
Estou no módulo inicial de Java.
Ainda não estudei Collections, Streams, Spring, JPA nem Lombok.
Resolva usando apenas variáveis, if, for e métodos simples.
Explique como eu poderia melhorar depois, mas não aplique recursos avançados agora.
```

Isso protege a sequência didática.

A IA tende a dar solução moderna.

Nem sempre a solução moderna é a melhor para o momento do aprendizado.

---

## Arquivo `docs/uso-de-ia.md`

Crie um documento para registrar as regras de uso de IA.

Exemplo:

```markdown
# Uso de IA na formação

## Regras

- Não aceitar código sem entender.
- Não enviar dados sensíveis.
- Não enviar código corporativo sem autorização.
- Não usar IA para pular fundamentos.
- Sempre revisar `git diff`.
- Sempre rodar ou testar quando houver código.
- Pedir explicação, não apenas solução pronta.
- Registrar aprendizados importantes no diário de bordo.

## Prompts úteis

```text
Explique sem resolver direto.
Faça perguntas para eu chegar na resposta.
Revise meu código e aponte riscos.
Liste casos de teste.
Monte um roteiro de debug.
```

## Checklist antes de aceitar resposta

- [ ] Entendi a solução.
- [ ] O código compila.
- [ ] Rodei o exemplo.
- [ ] Revisei o diff.
- [ ] Não há segredo.
- [ ] Não há dependência desnecessária.
- [ ] O commit comunica a mudança.
```

Esse documento ajuda a manter método.

---

## Erros comuns

### Erro 1 — Aceitar código sem entender

Correção:

```text
pedir explicação linha por linha;
rodar;
debugar;
reescrever com suas palavras.
```

---

### Erro 2 — Usar IA para pular fundamento

Correção:

```text
informar o módulo atual e restringir recursos.
```

---

### Erro 3 — Enviar dados sensíveis

Correção:

```text
anonimizar;
reduzir exemplo;
não enviar se houver dúvida;
seguir política da empresa.
```

---

### Erro 4 — Não revisar diff

Correção:

```bash
git status
git diff
```

antes e depois.

---

### Erro 5 — Confiar porque a resposta parece bonita

Correção:

```text
validar com execução, teste e documentação oficial.
```

---

### Erro 6 — Pedir solução grande demais

Correção:

```text
quebrar em etapas pequenas;
pedir plano antes;
aprovar arquivo por arquivo.
```

---

### Erro 7 — Deixar IA alterar arquitetura sem contexto

Correção:

```text
decisão arquitetural exige contexto, trade-off e revisão humana.
```

---

### Erro 8 — Usar IA sem Git

Correção:

```text
trabalhar com repositório limpo;
fazer commit antes de experimento grande;
revisar diff depois.
```

---

### Erro 9 — Não testar código gerado

Correção:

```text
código gerado precisa compilar, rodar e ser validado.
```

---

### Erro 10 — Não registrar aprendizado

Correção:

```text
atualizar diário de bordo quando a IA ajudar a resolver algo importante.
```

---

## Atividade guiada

Crie:

```text
docs/uso-de-ia.md
```

Com o conteúdo base:

```markdown
# Uso de IA na formação

## Regras
- Não aceitar código sem entender.
- Não enviar dados sensíveis.
- Não enviar código corporativo sem autorização.
- Não usar IA para pular fundamentos.
- Sempre revisar `git diff`.
- Sempre testar ou executar código gerado.
- Sempre pedir explicação quando houver dúvida.
- Registrar aprendizados importantes no diário.

## Prompts úteis
- Explique este erro e monte um roteiro de diagnóstico.
- Revise meu código e aponte riscos.
- Não resolva direto; faça perguntas.
- Gere casos de teste e explique cada cenário.
- Compare abordagens e trade-offs.

## Checklist
- [ ] Entendi a resposta.
- [ ] Validei com execução ou teste.
- [ ] Revisei o diff.
- [ ] Não há segredo.
- [ ] Não há dependência desnecessária.
- [ ] O código respeita o nível atual da formação.
```

Depois rode:

```bash
git status
git diff
git add docs/uso-de-ia.md docs/diario-de-bordo.md docs/atalhos.md
git diff --staged
git commit -m "Documenta metodo de uso de IA na formacao"
git status
```

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
explicar o papel da IA como apoio técnico;
explicar por que IA não substitui raciocínio;
explicar o que é Codex em nível conceitual;
diferenciar uso em IDE, CLI e ferramenta externa;
usar prompts com contexto, restrição e objetivo;
identificar prompts ruins;
pedir plano antes de alteração;
revisar git diff antes e depois;
validar código gerado com execução ou teste;
não aceitar código sem entender;
não enviar dados sensíveis;
não enviar código corporativo sem autorização;
criar docs/uso-de-ia.md;
registrar regras de uso de IA no diário;
registrar atalhos úteis;
explicar como IA pode ajudar em debug, testes, revisão e documentação;
explicar riscos de alucinação, dependência e vazamento de contexto.
```

Não precisa dominar todas as ferramentas de IA.

Precisa dominar a postura correta.

---

## Fechamento da aula

IA é uma ferramenta poderosa.

Mas ferramenta poderosa exige método.

Um desenvolvedor fraco usa IA para esconder lacuna.

Um desenvolvedor em evolução usa IA para revelar lacuna, estudar melhor e validar mais rápido.

A diferença está na postura.

A partir de agora, quando usar IA, mantenha a sequência:

```text
pensar;
pedir ajuda com contexto;
entender;
validar;
revisar diff;
testar;
registrar;
commitar.
```

Isso preserva o objetivo maior da formação:

```text
formar autonomia técnica.
```

Na próxima aula, voltamos ao Java e à organização inicial de código:

```text
pacotes;
nomes;
estrutura;
convenções;
leitura profissional;
preparação para projetos maiores.
```

A IA pode ajudar.

Mas quem precisa aprender a organizar código é você.
