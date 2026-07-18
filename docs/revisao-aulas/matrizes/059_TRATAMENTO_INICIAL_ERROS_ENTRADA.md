# Matriz de cobertura — Aula 059

## Identificação

- Aula original: `059_M1_39_TRATAMENTO_INICIAL_DE_ERROS_DE_ENTRADA_OFICIAL.md`
- Componente: `GuidedInputErrorsLesson059.jsx`
- Estilo: `guidedInputErrorsLesson.css`
- Arquétipo: oficina de recuperação de entrada com fluxo try/catch, buffer visível, dois portões, leitores reutilizáveis, domínios, clínica e entrega
- Cobertura: 100%

## Transformação observável

Ao terminar, o aluno não apenas reconhece `try/catch`: ele provoca uma `InputMismatchException`, acompanha o desvio da execução, limpa a entrada incompatível, repete a leitura, distingue tipo de regra e entrega um cadastro que sobrevive a tentativas inválidas.

## Destinos do conteúdo original

| Competência ou nuance original | Destino na experiência nova | Evidência |
|---|---|---|
| Entrada incompatível em `nextInt`, `nextLong` e `nextDouble` | Try/catch em movimento + leitores tipados | Alternância entre entrada válida e inválida com saída prevista |
| Exceção como falha em execução, não compilação | Etapa 1 | Explicação junto ao fluxo executável |
| `try`, `catch`, variável da exceção e mensagem amigável | Etapa 1 | Código destacado e console sincronizado |
| Tratamento não elimina o dado inválido | Etapas 1 e 2 | Buffer permanece bloqueado até ser consumido |
| Repetição com `while` | Etapas 2, 3 e programa completo | Nova tentativa só ocorre após recuperação |
| `scanner.nextLine()` no `catch` | Mapa visual do buffer | Comparação com e sem limpeza |
| `nextLine()` após leitura numérica bem-sucedida | Etapa 2 e leitores | Distinção entre token inválido e quebra de linha restante |
| Método `lerInteiro` | Leitores tipados e programa completo | Contrato com retorno após leitura válida |
| Um único `Scanner` passado como parâmetro | Etapa 5 e programa completo | Cadeia main → leitor → valor confiável |
| Leitura de `int`, `long` e `double` | Etapa 3 | Três variantes navegáveis |
| Configuração regional de decimal | Etapa 3 | Mensagem contextualizada no leitor `double` |
| Tipo incompatível versus regra inválida | Etapa 4 | Dois portões independentes |
| Inteiro e long positivos | Etapas 4, 5 e programa completo | Regra `valor > 0` depois da conversão |
| Texto obrigatório | Etapas 4, 5, 6 e programa completo | `trim`, `isBlank` e repetição sem try/catch |
| Status normalizado e permitido | Etapas 5, 6 e programa completo | `trim`, `toUpperCase` e conjunto permitido |
| Pedido | Galeria + programa guiado | Cliente, centavos e status |
| Produto | Galeria | Estoque não negativo e status |
| Pagamento | Galeria | Centavos, parcelas positivas e divisão segura |
| OS | Galeria + desafio | Certificado, atividades e status |
| Mensageria | Galeria | Tentativas não negativas e tipo permitido |
| Auditoria | Galeria | Caso só textual sem try/catch numérico artificial |
| `try/catch` próximo do ponto recuperável | Etapas 5 e 6 | Responsabilidades explícitas |
| Evitar bloco gigante e `catch (Exception)` | Clínica | Sintoma, causa e correção |
| Dez erros comuns | Clínica de Erros | Dez casos navegáveis com rótulos legíveis |
| Atividade local, compilação, execução e saídas | Entrega & Desafio | PowerShell guiado com saída interpretada |
| Arquivos de erro proposital | Clínica + testes deliberados | Mesmas competências sem exigir 23 arquivos repetitivos |
| Debug do caminho inválido e válido | Etapa 1 | Frames do try, exceção, catch e sucesso |
| Git, diário e exclusão de `.class` | Entrega | Sequência de status, diff, staging, commit e confirmação |
| Limites da aula | Escopo pedagógico | Não antecipa hierarquia, exceções customizadas, `throws`, logs ou Bean Validation |

## Consolidações sem perda

- Os muitos programas quase idênticos foram consolidados em leitores navegáveis, seis aplicações e um programa completo compilável.
- Os arquivos de erro proposital viraram dez diagnósticos interativos; seus sintomas e correções continuam explícitos.
- A lista extensa de comandos repetidos foi substituída por uma execução guiada com saída e critério de observação.
- O desafio de OS exige transferência do padrão sem entregar a solução pronta.

## Verificações obrigatórias

- O programa `CadastroPedidoResiliente.java` deve compilar com `javac`.
- Todas as oito etapas devem possuir renderizador.
- A Galeria de Domínios deve apresentar seis cenários.
- A Clínica de Erros deve apresentar dez casos e manter seus rótulos legíveis.
- O roteiro deve centralizar a etapa ativa no celular.
- A conclusão da aula só pode aparecer depois das oito etapas.
- Lint e build da plataforma devem passar.
