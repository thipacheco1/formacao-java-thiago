# 214 — M8.14 — Revisão técnica, simulado e fechamento do Módulo 8

## Objetivo da aula

Esta aula fecha o Módulo 8.

Neste módulo, você saiu de tratamento básico de erro e chegou em um conjunto muito importante de recursos usados em backend profissional:

```text
exceptions;
checked exceptions;
unchecked exceptions;
exceptions próprias;
modelagem de erros por camada;
try/catch/finally;
try-with-resources;
Resultado<T>;
ResultadoValidacao;
ResultadoImportacao;
Path;
Files;
BufferedReader;
BufferedWriter;
CSV manual;
Date/Time API;
Instant;
ZoneId;
UUID;
correlationId;
Objects;
StringJoiner;
Random;
SecureRandom;
record como DTO simples.
```

O objetivo desta aula é revisar, testar e consolidar.

Ao final desta aula, você deve conseguir:

```text
explicar o papel de exceptions em Java;
diferenciar checked e unchecked;
decidir entre exception e Resultado;
modelar erro por camada;
ler e escrever arquivos;
processar CSV;
usar Date/Time API corretamente;
usar Instant para auditoria;
usar UUID e correlationId;
usar utilitários modernos sem exagero;
montar fluxo backend com separação de responsabilidades;
responder um simulado técnico sobre o Módulo 8;
estar preparado para iniciar SOLID.
```

---

## Visão geral do Módulo 8

O Módulo 8 foi dividido em quatro grandes blocos:

```text
1. Tratamento de erros.
2. Arquivos e I/O.
3. Datas e tempo.
4. Utilitários modernos.
```

Cada bloco tem papel próprio.

Mas o valor real aparece quando você integra tudo.

Exemplo de fluxo real:

```text
1. Receber arquivo CSV.
2. Gerar correlationId.
3. Ler arquivo com BufferedReader.
4. Validar cabeçalho.
5. Parsear linhas.
6. Criar entidades.
7. Acumular erros.
8. Registrar auditoria com Instant.
9. Exportar relatório com BufferedWriter.
10. Retornar ResultadoImportacao.
```

Esse tipo de fluxo é comum em sistemas backend corporativos.

---

## Frase arquitetural do curso

Durante todo o módulo, mantivemos a linha:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Neste módulo, isso ficou assim:

```text
Entidade:
protege regra e invariantes.

Parser:
converte texto em objeto.

Gateway:
lida com arquivo e infraestrutura.

Service/use case:
coordena fluxo.

Resultado:
comunica falhas controladas.

Exception:
interrompe falhas que não podem continuar.

Mapper:
formata saída.

App/controller:
recebe, chama e apresenta.
```

Essa separação prepara você para os próximos módulos.

---

# Parte 1 — Revisão de exceptions

## O que é exception

Exception é um mecanismo para interromper um fluxo inválido.

Exemplo:

```java
if (valor == null) {
    throw new IllegalArgumentException("Valor é obrigatório.");
}
```

A ideia não é apenas “dar erro”.

A ideia é comunicar:

```text
o fluxo não pode continuar assim.
```

---

## Checked exception

Checked exceptions são obrigadas pelo compilador.

Exemplo:

```java
IOException
```

Você precisa:

```text
tratar com try/catch;
ou declarar com throws.
```

Exemplo:

```java
public String lerArquivo(String caminho) throws IOException {
    return Files.readString(Path.of(caminho));
}
```

---

## Unchecked exception

Unchecked exceptions estendem:

```java
RuntimeException
```

O compilador não obriga tratamento.

Exemplos:

```text
IllegalArgumentException;
IllegalStateException;
NullPointerException;
NumberFormatException;
DateTimeParseException.
```

Use para:

```text
argumento inválido;
estado inválido;
regra de domínio violada;
uso incorreto do método;
falha que não deve ser obrigatoriamente declarada.
```

---

## Exception própria

Exception própria dá nome ao erro.

Exemplo:

```java
public class PedidoNaoEncontradoException extends RuntimeException {
    public PedidoNaoEncontradoException(String codigo) {
        super("Pedido não encontrado: " + codigo);
    }
}
```

Melhor do que:

```java
throw new RuntimeException("Erro.");
```

Porque comunica intenção.

---

## Preservação da causa

Ao converter uma exception técnica, preserve a causa.

Bom:

```java
catch (IOException erro) {
    throw new FalhaArquivoException("Falha ao ler arquivo: " + caminho, erro);
}
```

Ruim:

```java
catch (IOException erro) {
    throw new FalhaArquivoException("Falha ao ler arquivo.");
}
```

A causa original ajuda no diagnóstico.

---

# Parte 2 — Revisão de modelagem de erros por camada

## Erro de validação

Exemplo:

```text
campo obrigatório;
formato inválido;
data inválida;
valor negativo.
```

Pode virar:

```text
IllegalArgumentException;
ResultadoValidacao;
erro 400 futuramente em API.
```

---

## Erro de não encontrado

Exemplo:

```text
Pedido não encontrado.
Produto não encontrado.
Cliente não encontrado.
```

Normalmente pertence ao fluxo de aplicação.

Futuramente, em API REST:

```text
HTTP 404
```

---

## Erro de domínio

Exemplo:

```text
pedido cancelado não pode faturar;
cliente bloqueado não pode operar;
OS concluída não pode reagendar;
produto sem estoque não pode vender.
```

Normalmente nasce na entidade ou regra de domínio.

Futuramente, em API REST:

```text
HTTP 409 ou 422
```

---

## Erro de infraestrutura

Exemplo:

```text
arquivo inexistente;
falha de banco;
timeout;
falha de API externa;
permissão negada.
```

Normalmente nasce em:

```text
repository;
gateway;
client;
infraestrutura.
```

Futuramente, em API REST:

```text
HTTP 500, 502 ou 503.
```

---

## Quadro de decisão

```text
Argumento obrigatório:
IllegalArgumentException.

Regra de entidade violada:
DominioException ou exception específica.

Recurso obrigatório não encontrado:
RecursoNaoEncontradoException.

Falha ao ler arquivo:
FalhaArquivoException preservando IOException.

Linha inválida em importação:
ResultadoImportacao com ErroLinha.

Validação de formulário:
ResultadoValidacao acumulando mensagens.
```

---

# Parte 3 — Exception ou Resultado

## Use exception quando

```text
a operação não pode continuar;
é falha técnica;
é regra crítica;
é estado inválido;
é recurso obrigatório não encontrado;
é uso incorreto do método.
```

Exemplo:

```java
pedido.faturar();
```

Se o pedido está cancelado, pode lançar:

```java
PedidoNaoPodeSerFaturadoException
```

---

## Use Resultado quando

```text
falha é esperada;
você quer comunicar sem interromper;
você quer acumular erros;
é validação de entrada;
é importação em lote;
é fluxo de tentativa.
```

Exemplo:

```java
ResultadoImportacao<Produto>
```

com:

```text
válidos;
erros;
linhas inválidas.
```

---

## Falha rápida vs acúmulo de erros

Falha rápida:

```text
parar no primeiro erro.
```

Boa para:

```text
regra obrigatória;
operação crítica;
fluxo que não pode seguir.
```

Acúmulo de erros:

```text
validar tudo e retornar lista.
```

Bom para:

```text
formulário;
CSV;
importação;
lote;
relatório de inconsistências.
```

---

# Parte 4 — Revisão de try/catch/finally

## try

Bloco que contém código que pode falhar.

```java
try {
    executar();
}
```

---

## catch

Captura uma exception.

```java
catch (IllegalArgumentException erro) {
    System.out.println(erro.getMessage());
}
```

Prefira catches específicos.

---

## finally

Executa no final, com ou sem erro.

Use para:

```text
limpeza;
liberação;
finalização técnica.
```

Evite:

```text
return no finally;
regra principal no finally;
lançar erro sem necessidade.
```

---

## try-with-resources

Use para recursos que precisam fechar:

```java
try (BufferedReader reader = Files.newBufferedReader(path)) {
    ...
}
```

O Java fecha automaticamente.

Use com:

```text
BufferedReader;
BufferedWriter;
InputStream;
OutputStream;
Connection;
PreparedStatement;
ResultSet.
```

---

# Parte 5 — Revisão de I/O

## Path

Representa caminho de arquivo.

```java
Path caminho = Path.of("dados", "clientes.csv");
```

Prefira isso a concatenar strings manualmente.

---

## Files

Classe utilitária para operações de arquivo:

```java
Files.exists(path)
Files.createDirectories(path)
Files.readString(path)
Files.readAllLines(path)
Files.write(path, linhas)
Files.writeString(path, texto)
Files.newBufferedReader(path)
Files.newBufferedWriter(path)
```

---

## readString e readAllLines

Use para arquivos pequenos ou médios.

```java
String texto = Files.readString(path);
List<String> linhas = Files.readAllLines(path);
```

Cuidado com arquivos muito grandes.

---

## BufferedReader

Processa linha a linha.

```java
try (BufferedReader reader = Files.newBufferedReader(path)) {
    String linha;

    while ((linha = reader.readLine()) != null) {
        processar(linha);
    }
}
```

Bom para:

```text
arquivos grandes;
importação;
número de linha;
processamento incremental.
```

---

## BufferedWriter

Escreve linha a linha.

```java
try (BufferedWriter writer = Files.newBufferedWriter(path)) {
    writer.write("linha");
    writer.newLine();
}
```

Bom para:

```text
exportação;
relatório;
arquivo de retorno;
logs didáticos.
```

---

# Parte 6 — Revisão de CSV manual

## CSV simples

Nesta fase, usamos CSV simples:

```text
separador ;
sem aspas complexas;
sem quebra de linha dentro de campo;
sem separador dentro de campo.
```

Exemplo:

```text
SKU;NOME;PRECO;ESTOQUE
PRD-001;Notebook;3500.00;5
```

---

## split com -1

Use:

```java
linha.split(";", -1)
```

para preservar campos vazios.

Exemplo:

```text
PRD-001;Notebook;3500.00;
```

O campo final vazio precisa ser detectado.

---

## Cabeçalho

Valide cabeçalho para garantir formato.

Esperado:

```text
SKU;NOME;PRECO;ESTOQUE
```

Recebido:

```text
CODIGO;DESCRICAO;VALOR;QTD
```

Isso deve gerar erro.

---

## Parser

Parser converte:

```text
linha CSV -> objeto
objeto -> linha CSV
```

Parser não deve:

```text
ler arquivo;
escrever arquivo;
imprimir;
registrar auditoria.
```

---

## ResultadoImportacao

Representa:

```text
válidos;
erros;
sucesso total;
sucesso parcial;
falha total;
metadados da importação.
```

Linha inválida deve entrar no resultado.

Falha técnica deve lançar exception.

---

# Parte 7 — Revisão de Date/Time

## LocalDate

Use para data sem hora:

```text
prazo;
vencimento;
agendamento por data;
data de contrato;
data de cadastro.
```

---

## LocalTime

Use para hora sem data:

```text
hora de abertura;
hora de fechamento;
janela de atendimento;
horário limite.
```

---

## LocalDateTime

Use para data e hora local sem fuso:

```text
criado em;
atualizado em;
concluído em;
agendamento com hora local.
```

Cuidado:

```text
LocalDateTime não representa momento global.
```

---

## Duration

Use para duração em tempo:

```text
minutos;
horas;
segundos;
timeout;
tempo em fila;
expiração em minutos.
```

---

## Period

Use para calendário:

```text
anos;
meses;
dias;
idade;
vigência em meses.
```

---

## ChronoUnit

Use para totais:

```java
ChronoUnit.DAYS.between(inicio, fim)
ChronoUnit.MINUTES.between(inicio, fim)
```

---

## DateTimeFormatter

Use para formatar e parsear:

```java
DateTimeFormatter.ofPattern("dd/MM/yyyy")
DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
```

Cuidado:

```text
MM = mês
mm = minuto
```

---

## Instant

Use para momento global:

```text
auditoria;
logs;
eventos;
mensageria;
createdAt;
updatedAt;
correlation tracking.
```

---

## ZoneId e ZonedDateTime

Use para exibir ou manipular horário em uma zona:

```java
instant.atZone(ZoneId.of("America/Sao_Paulo"))
```

---

## OffsetDateTime

Use em integrações/API quando vem offset:

```text
2026-07-09T10:30:00-03:00
```

---

# Parte 8 — Revisão de utilitários modernos

## Objects

Use para:

```text
requireNonNull;
equals seguro;
hash;
toString com fallback.
```

Exemplo:

```java
Objects.equals(a, b)
Objects.hash(codigo)
Objects.requireNonNull(cliente, "Cliente é obrigatório.")
```

---

## String.join

Bom para junção simples:

```java
String.join(";", "SKU", "NOME", "PRECO")
```

---

## StringJoiner

Bom para montagem com separador, prefixo e sufixo:

```java
new StringJoiner(" | ")
```

---

## UUID

Use para identificador técnico:

```java
UUID.randomUUID()
```

Bom para:

```text
id técnico;
correlationId;
requestId;
eventId.
```

Não substitui:

```text
protocolo de negócio;
número fiscal;
sequência com regra;
código humano.
```

---

## Random

Use para sorteio sem segurança.

```java
Random random = new Random();
```

---

## SecureRandom

Use para cenários sensíveis:

```text
token;
código de verificação;
senha temporária;
segredo.
```

---

## record

Bom para DTO simples:

```java
public record ClienteResponse(String nome, String email) {
}
```

Use com critério.

---

# Parte 9 — Simulado técnico

Responda sem consultar as respostas.

## Questão 1

Qual é a principal diferença entre checked e unchecked exception?

```text
A) Checked exception sempre é erro de regra de negócio.
B) Checked exception precisa ser tratada ou declarada; unchecked não é exigida pelo compilador.
C) Unchecked exception só ocorre em arquivo.
D) Checked exception não pode ser capturada.
```

---

## Questão 2

Qual exception faz mais sentido para argumento obrigatório inválido?

```text
A) IOException
B) IllegalArgumentException
C) NullPointerException obrigatoriamente
D) Error
```

---

## Questão 3

Ao converter uma `IOException` para `FalhaArquivoException`, o que deve ser feito?

```text
A) Ignorar a exception original.
B) Preservar a causa original.
C) Retornar null.
D) Encerrar a JVM.
```

---

## Questão 4

Linha inválida em importação CSV deve normalmente virar:

```text
A) ResultadoImportacao com ErroLinha.
B) FalhaArquivoException.
C) System.exit.
D) NullPointerException.
```

---

## Questão 5

Arquivo inexistente durante leitura deve normalmente virar:

```text
A) ErroLinha.
B) FalhaArquivoException preservando causa.
C) Linha vazia.
D) Produto inválido.
```

---

## Questão 6

Qual classe deve conhecer `BufferedReader`?

```text
A) Entidade.
B) Gateway/infraestrutura.
C) DTO.
D) Enum de status.
```

---

## Questão 7

Qual classe deve converter linha CSV em entidade?

```text
A) Parser.
B) Controller.
C) Entidade obrigatoriamente.
D) Exception.
```

---

## Questão 8

Quando usar `LocalDate`?

```text
A) Quando só a data importa.
B) Quando precisa de timezone.
C) Quando precisa de offset.
D) Quando precisa de token seguro.
```

---

## Questão 9

Quando usar `Instant`?

```text
A) Para momento global/auditoria.
B) Para nome de cliente.
C) Para texto CSV.
D) Para status PENDENTE.
```

---

## Questão 10

Qual é a diferença entre `ZoneId` e offset?

```text
A) Não há diferença.
B) ZoneId representa região com regras; offset é apenas diferença fixa para UTC.
C) Offset representa banco de dados.
D) ZoneId só funciona com CSV.
```

---

## Questão 11

`UUID` é mais adequado para:

```text
A) Identificador técnico.
B) Preço de produto.
C) Data de vencimento.
D) Mensagem de erro.
```

---

## Questão 12

`SecureRandom` deve ser usado para:

```text
A) Token e código sensível.
B) Listar clientes.
C) Somar datas.
D) Validar cabeçalho CSV.
```

---

## Questão 13

Por que evitar `return` dentro de `finally`?

```text
A) Porque pode esconder exceptions e confundir o fluxo.
B) Porque não compila nunca.
C) Porque só funciona em Python.
D) Porque apaga arquivos.
```

---

## Questão 14

Por que passar `hoje` ou `agora` por parâmetro em regras de domínio?

```text
A) Para facilitar teste e evitar comportamento escondido.
B) Para deixar o código mais aleatório.
C) Para evitar criar classes.
D) Para transformar tudo em String.
```

---

## Questão 15

Qual alternativa representa melhor a separação correta?

```text
A) Entidade lê CSV, imprime e salva arquivo.
B) Gateway lê arquivo, parser converte linha, service coordena, domínio valida regra.
C) Controller faz tudo.
D) Exception deve exportar relatório.
```

---

# Parte 10 — Gabarito do simulado

Confira depois de responder.

```text
1. B
2. B
3. B
4. A
5. B
6. B
7. A
8. A
9. A
10. B
11. A
12. A
13. A
14. A
15. B
```

---

# Parte 11 — Perguntas discursivas

Responda com suas palavras.

## 1. Por que exception própria melhora o código?

Resposta esperada:

```text
Porque dá nome ao erro, melhora leitura, facilita tratamento específico, logs, testes e tradução futura para HTTP.
```

---

## 2. Por que não usar exception para toda validação de formulário?

Resposta esperada:

```text
Porque validação de formulário pode ser uma falha esperada e acumulável. ResultadoValidacao pode comunicar várias mensagens sem interromper no primeiro erro.
```

---

## 3. Por que arquivo inexistente não deve virar ErroLinha?

Resposta esperada:

```text
Porque arquivo inexistente é falha técnica de infraestrutura. ErroLinha representa uma linha lida, mas inválida.
```

---

## 4. Por que domínio não deve conhecer CSV?

Resposta esperada:

```text
Porque CSV é formato de entrada/saída. O domínio deve proteger regras do negócio, não depender de arquivo, separador ou layout externo.
```

---

## 5. Por que `Instant` é melhor para auditoria?

Resposta esperada:

```text
Porque representa um momento global, independente do fuso usado para exibição.
```

---

## 6. Por que `LocalDateTime` sozinho pode ser perigoso em sistemas distribuídos?

Resposta esperada:

```text
Porque ele não possui fuso horário. O mesmo LocalDateTime pode representar instantes diferentes em zonas diferentes.
```

---

## 7. Por que `UUID` não substitui protocolo de negócio?

Resposta esperada:

```text
Porque UUID é identificador técnico. Protocolo de negócio pode ter formato, sequência, regra, legibilidade e significado próprios.
```

---

## 8. Quando `for` é melhor que Stream?

Resposta esperada:

```text
Quando há I/O, número de linha, try/catch por item, controle de fluxo, escrita sequencial ou necessidade de clareza imperativa.
```

---

# Parte 12 — Exercício integrador final do módulo

## Contexto

Você vai criar um fluxo chamado:

```text
Importação de solicitações
```

Esse exercício é o fechamento prático do Módulo 8.

---

## Requisitos do arquivo

Arquivo:

```text
dados/solicitacoes/solicitacoes.csv
```

Cabeçalho:

```text
CLIENTE;DESCRICAO;PRIORIDADE;PRAZO;ATIVO
```

Linhas exemplo:

```text
CLIENTE;DESCRICAO;PRIORIDADE;PRAZO;ATIVO
Ana Silva;Instalar equipamento;ALTA;20/07/2026;true
Carlos Souza;Trocar peça;MEDIA;22/07/2026;true
Maria Oliveira;Validar endereço;BAIXA;25/07/2026;false
Cliente Ruim;;ALTA;20/07/2026;true
Data Ruim;Atendimento;MEDIA;2026-07-20;true
Prioridade Ruim;Atendimento;URGENTE;20/07/2026;true
Ativo Ruim;Atendimento;BAIXA;20/07/2026;sim
```

---

## Domínio Solicitacao

Crie entidade:

```text
Solicitacao
```

Campos:

```text
UUID id;
String protocolo;
String cliente;
String descricao;
String prioridade;
LocalDate prazo;
boolean ativo;
Instant criadaEm;
String correlationId;
```

Regras:

```text
id obrigatório;
protocolo obrigatório;
cliente obrigatório;
descricao obrigatória;
prioridade obrigatória;
prioridade permitida: BAIXA, MEDIA, ALTA;
prazo obrigatório;
ativo boolean;
criadaEm obrigatório;
correlationId obrigatório.
```

Métodos:

```java
boolean altaPrioridade()
boolean vencidaEm(LocalDate hoje)
long diasAtePrazo(LocalDate hoje)
String resumo()
```

Use `StringJoiner` no `resumo`.

---

## Parser

Crie:

```text
SolicitacaoCsvParser
```

Formato:

```text
CLIENTE;DESCRICAO;PRIORIDADE;PRAZO;ATIVO
```

Responsabilidades:

```text
validar 5 colunas;
converter LocalDate com dd/MM/yyyy;
converter boolean aceitando apenas true/false;
gerar UUID;
gerar protocolo;
receber correlationId;
receber Instant criadaEm;
criar Solicitacao.
```

Observação:

```text
Para gerar protocolo, use SOL- + código numérico de 6 dígitos.
Use SecureRandom.
```

---

## ResultadoImportacao

Use o mesmo padrão:

```text
UUID idImportacao;
String correlationId;
Instant iniciadoEm;
Instant finalizadoEm;
List<Solicitacao> validas;
List<ErroLinha> erros.
```

---

## Gateway

Crie:

```text
ArquivoCsvGateway
```

Com:

```text
processarLinhas;
escrever.
```

Use:

```text
BufferedReader;
BufferedWriter;
try-with-resources;
FalhaArquivoException.
```

---

## Service

Crie:

```text
SolicitacaoImportacaoService
```

Responsabilidades:

```text
gerar correlationId;
validar cabeçalho;
processar linhas;
usar parser;
acumular erros;
registrar auditoria;
finalizar resultado.
```

---

## Exportação

Crie:

```text
SolicitacaoExportacaoService
```

Exportar válidas para:

```text
dados/solicitacoes/solicitacoes-validas.csv
```

Cabeçalho:

```text
PROTOCOLO;CLIENTE;DESCRICAO;PRIORIDADE;PRAZO;ATIVO;CRIADA_EM;CORRELATION_ID
```

---

## Relatório

Crie:

```text
SolicitacaoRelatorioImportacaoService
```

Exportar relatório para:

```text
dados/solicitacoes/relatorio-importacao.csv
```

Conteúdo:

```text
RESUMO
ID_IMPORTACAO;...
CORRELATION_ID;...
VALIDOS;...
ERROS;...
INICIADO_EM;...
FINALIZADO_EM;...

ERROS
LINHA;MENSAGEM
...
```

---

## Consulta

Crie:

```text
SolicitacaoConsultaService
```

Métodos:

```java
List<Solicitacao> listarAtivas()

List<Solicitacao> listarAltaPrioridade()

List<Solicitacao> listarVencidas(LocalDate hoje)

List<Solicitacao> listarPrazoEntre(LocalDate inicio, LocalDate fim)
```

Use Streams.

---

## App final

Crie:

```text
SolicitacaoImportacaoFinalModulo8App
```

Fluxo:

```text
1. Criar arquivo de entrada.
2. Importar.
3. Imprimir resumo.
4. Imprimir válidas.
5. Imprimir erros.
6. Exportar válidas.
7. Exportar relatório.
8. Listar alta prioridade.
9. Listar vencidas em uma data.
10. Exibir auditoria.
```

---

## Critérios obrigatórios

```text
Não guardar data como String no domínio.
Não usar Random para protocolo sensível; usar SecureRandom.
Não usar exception para linha inválida.
Não usar ResultadoImportacao para arquivo inexistente.
Não imprimir dentro do service.
Não colocar CSV na entidade.
Não colocar BufferedReader no parser.
Não engolir IOException.
Preservar causa original.
Usar UUID para ID técnico.
Usar correlationId.
Usar Instant para auditoria.
Usar LocalDate para prazo.
```

---

# Parte 13 — Checklist final do Módulo 8

Marque mentalmente:

```text
[ ] Sei diferenciar checked e unchecked.
[ ] Sei criar exception própria.
[ ] Sei preservar causa original.
[ ] Sei diferenciar erro de domínio, aplicação e infraestrutura.
[ ] Sei decidir entre exception e Resultado.
[ ] Sei criar ResultadoImportacao.
[ ] Sei usar try/catch/finally.
[ ] Sei usar try-with-resources.
[ ] Sei usar Path e Files.
[ ] Sei usar BufferedReader.
[ ] Sei usar BufferedWriter.
[ ] Sei validar cabeçalho CSV.
[ ] Sei acumular erros por linha.
[ ] Sei usar LocalDate.
[ ] Sei usar LocalDateTime.
[ ] Sei usar Duration e Period.
[ ] Sei usar ChronoUnit.
[ ] Sei usar DateTimeFormatter.
[ ] Sei usar Instant.
[ ] Sei usar ZoneId e ZonedDateTime.
[ ] Sei usar OffsetDateTime em integração.
[ ] Sei usar UUID.
[ ] Sei gerar correlationId.
[ ] Sei diferenciar Random e SecureRandom.
[ ] Sei usar StringJoiner.
[ ] Sei usar Objects.
[ ] Sei usar record como DTO simples.
[ ] Sei separar domínio, parser, gateway, service e app.
```

---

## Critério de aprovação do módulo

Você está pronto para seguir se consegue explicar este fluxo:

```text
Arquivo CSV chega.
Gateway abre arquivo.
Service gera correlationId.
Gateway entrega linhas.
Service valida cabeçalho.
Parser converte linha em entidade.
Entidade valida regra.
Linha inválida entra no ResultadoImportacao.
Falha técnica lança FalhaArquivoException.
Auditoria registra com Instant.
Exportação escreve válidos.
Relatório escreve erros.
App apresenta resultado.
```

Se você consegue explicar isso, o Módulo 8 cumpriu o papel.

---

## Commit recomendado

Depois de concluir o exercício final:

```bash
git status
git add labs/m8/aula-214-revisao-tecnica-simulado-fechamento-modulo-8
git commit -m "Aula 214: revisao tecnica simulado fechamento modulo 8"
git status
```

Se você usou a pasta desta aula com outro nome, ajuste o caminho no `git add`.

---

## Fechamento do Módulo 8

A principal ideia deste módulo foi:

```text
backend profissional precisa tratar erro, arquivo, data e utilitários com intenção arquitetural.
```

Você aprendeu que:

```text
exception não é só erro;
Resultado não é substituto universal de exception;
arquivo não pertence ao domínio;
CSV precisa de parser;
data não deve ser String;
Instant é melhor para auditoria;
UUID é ID técnico;
correlationId rastreia fluxo;
SecureRandom é para cenário sensível;
service coordena;
entidade protege regra.
```

Este módulo fecha uma base essencial.

A partir da próxima aula, vamos entrar em:

```text
Módulo 9 — SOLID.
```

Esse módulo muda o nível do curso.

Até aqui, você aprendeu a fazer código funcionar com boa organização.

Agora vamos estudar como fazer o código evoluir sem virar bagunça.

A próxima aula começa com:

```text
SOLID — visão geral, motivação, problemas que ele resolve e por que isso importa para backend.
```
