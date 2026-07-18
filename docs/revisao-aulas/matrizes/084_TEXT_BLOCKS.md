# Matriz de preservação — Aula 084 — Text blocks

## Contrato pedagógico

A aula foi reconstruída como laboratório de caracteres, documentos e fronteiras de segurança. Todo conteúdo original foi preservado, consolidando exemplos repetidos num programa único e em nove etapas guiadas.

## Cobertura curricular

| Conteúdo original | Etapa guiada | Evidência |
|---|---|---|
| concatenação versus text block | Três Aspas + Backend | comparação e refatoração visual |
| definição, três aspas e tipo String | Três Aspas, uma String | simulador de abertura e métodos String |
| abertura exige quebra de linha | Três Aspas, uma String | estado válido e erro do compilador |
| Java 17+ | Entrega | `java -version` e `javac -version` |
| quebra de linha final e tamanho | Quebra Final e Strip | visual por caracteres e programa executável |
| `strip()` | Quebra Final e Strip | alternância do valor e código |
| indentação incidental e delimitador final | Indentação Incidental | regra visual e JSON alinhado |
| `stripIndent()` e `indent(int)` | Indentação Incidental | três modos e saídas executáveis |
| aspas duplas internas | Aspas e Escapes | JSON sem escape de aspas comuns |
| `\n`, `\t`, `\"` e `\\` | Aspas e Escapes | seletor de escapes |
| JSON fixo | JSON e Formatted | preview e código multilinha |
| `formatted()` | JSON e Formatted | nome editável e poucos placeholders |
| JSON dinâmico sem escaping | JSON e Formatted | nome com aspas sinaliza payload inválido |
| biblioteca JSON/Jackson e DTO | JSON e Formatted | fronteira profissional explícita |
| SQL multilinha | SQL, HTML e Mensagens | consulta legível |
| SQL injection e parâmetro preparado | SQL, HTML e Mensagens | `?` e alerta de segurança |
| HTML simples e template engine | SQL, HTML e Mensagens | seletor de documento e limite |
| mensagem multilinha, linhas em branco e formatted | SQL, HTML e Mensagens | exemplo e ordem de placeholders |
| template engine, arquivo externo e i18n | Documentos + Clínica | alternativas profissionais |
| cliente, produto, pedido, pagamento, OS, mensageria e auditoria | Text Blocks no Backend | galeria de sete domínios |
| refatoração de concatenação e SQL | Text Blocks no Backend | antes/depois |
| muitos placeholders para DTO/template | JSON + Clínica | diagnóstico e alternativas |
| quando usar e evitar | Domínios + Clínica | teste fixo, SQL, mock versus conteúdo dinâmico/gigante |
| dez erros comuns | Clínica de Erros | dez diagnósticos navegáveis |
| debug de conteúdo, espaços, quebras e tamanho | Entrega | roteiro de quatro passos |
| atividade, comandos, saída, README e Git | Entrega | programa compilável, nove saídas e evidências |
| limites: Jackson, templates, JDBC, i18n e resources | fechamento | não antecipados nem substituídos |

## Consolidações intencionais

- Os exemplos válidos foram reunidos em `LaboratorioTextBlocks.java`.
- Os sete domínios viraram galeria comparativa sem perder JSON, SQL, relatório, mensagem e auditoria.
- O erro de abertura fica no simulador para não impedir a compilação do laboratório principal.
- Casos de JSON e SQL inseguros são demonstrados como diagnóstico, nunca como receita de produção.

## Recursos visuais e práticos

- simulador do delimitador de abertura;
- mapa de caracteres com quebra final;
- laboratório de indentação incidental, `stripIndent` e `indent`;
- seletor de escapes;
- preview de JSON dinâmico com alerta;
- seletor SQL/HTML/mensagem;
- sete domínios e refatoração antes/depois;
- clínica de dez erros;
- código destacado, terminal, saída, debug, checklist e desafio.

## Validação esperada

- rota exclusiva para `084_`;
- nove etapas, persistência filtrada, foco móvel e portão curricular;
- CSS responsivo até 380 px;
- Java compila e produz exatamente nove linhas;
- validator dedicado e lint aprovados;
- documentação aponta a Aula 085 — Exceptions por baixo.
