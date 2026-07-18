# Matriz de cobertura — Aula 065

- Original: `065_M2_04_DEFAULT_VALUES_E_INICIALIZACAO_OFICIAL.md`
- Componente: `GuidedDefaultValuesInitializationLesson065.jsx`
- Cobertura: 100%
- Arquétipo: laboratório visual de defaults, atribuição definida, arrays, validade de domínio, estratégias de inicialização, clínica e entrega.

## Transformação

A lista técnica de valores padrão vira uma investigação guiada: o aluno escolhe o local de armazenamento, observa quem escreve o valor, percorre caminhos do compilador, cria separadamente array e objetos e decide quando um estado técnico não satisfaz a regra de negócio.

## Cobertura rastreável

| Conteúdo original | Destino reconstruído | Evidência |
|---|---|---|
| Conceito de default value | Mapa dos Defaults | Regra central separa valores escritos pela JVM de valores exigidos pelo compilador |
| Defaults de byte, short, int, long, float, double, boolean, char e referências | Mapa dos Defaults | Grade interativa com sete grupos e literais corretos |
| Campos de instância | Mapa + programa | Seletor explica inicialização no nascimento do objeto; saída mostra null, 0 e false |
| Campos static | Mapa + programa | Seletor e saída `0 | null` |
| Elementos de array | Mapa + Arrays por Dentro | `int[3]` inicia com 0 e `Cliente[3]` com null |
| Variáveis locais sem default utilizável | Locais e Caminhos | Reprodução mínima do erro de compilação |
| Análise de caminhos | Locais e Caminhos | Fluxo alterna entre if incompleto e if/else completo |
| Inicializar local diretamente ou em todos os ramos | Locais e Caminhos | Código corrigido e veredito explicado |
| Por que campos recebem defaults | Mapa dos Defaults | Contexto de criação do objeto, preparação da classe e criação do array |
| Array de primitivos | Arrays por Dentro | Três slots 0 visíveis |
| Array de referências | Arrays por Dentro | Três slots null visíveis |
| Array de objetos não cria objetos | Arrays por Dentro | Heap permanece vazio até clicar em criar Cliente |
| Acesso a posição null | Arrays + Clínica | Dois níveis de inicialização e diagnóstico de NPE |
| Campos default dentro de objetos do array | Arrays por Dentro | Cada Cliente criado revela nome null, pontos 0 e ativo false |
| Objeto criado versus objeto válido | Criado ≠ Válido | Comparador alterna estado técnico e estado de negócio |
| Produto incompleto e fábrica simples | Criado ≠ Válido + estratégias | Produto explicita nome, estoque e ativo |
| `false` seguro ou perigoso | Criado ≠ Válido + domínios | Produto, contrato e mensagem mostram interpretações diferentes |
| Zero seguro ou perigoso | Criado ≠ Válido + domínios | Pagamento exige valor e parcelas positivos; array exige quantidade válida |
| Pagamento incompleto e válido | Criado ≠ Válido | Estado 0/0 é comparado com 10000/4 |
| Pedido default e PENDENTE | Domínios + programa | Construtor produz `PENDENTE | 1500` |
| Ordem de serviço | Defaults no Backend | ABERTA, quantidade e urgente por decisão explícita |
| Mensageria | Defaults no Backend | Tentativas 0 e enviada false são separados de cliente/tipo null |
| Auditoria | Defaults no Backend | PENDENTE e tentativa 1 como regra |
| Default técnico versus default de negócio | Criado ≠ Válido + domínios | Fluxo `criado → validado/preenchido → válido` |
| Preenchimento manual | Inicialização Explícita | Estratégia 1 com custo de repetição |
| Método fábrica | Inicialização Explícita | Estratégia 2 centraliza estado e validação |
| Validar antes de criar e checar retorno null | Estratégias + Clínica + desafio | Limite curricular preservado antes da aula 066 |
| Evitar null quando possível | Estratégias | Pergunta profissional: aceitar, escolher default ou impedir criação |
| Construtor e `this` introdutórios | Inicialização Explícita + programa | Estratégia 3 e classe Pedido sem aprofundamento prematuro |
| Inicializador no campo | Inicialização Explícita + programa | Configuração nasce com 3 e LOCAL |
| Boolean com mais de dois estados | Criado ≠ Válido + Clínica | Contrato troca ambiguidade por PENDENTE |
| Zero como valor ou ausência | Criado ≠ Válido + Clínica | Pagamento e posições não preenchidas |
| Dez erros comuns | Clínica de Erros | Dez casos com sintoma e correção |
| Debug recomendado | Entrega & Desafio | Quatro passos mostram defaults e atribuições sucessivas |
| Atividade, comandos e saída | Entrega & Desafio | Programa completo compila e produz seis linhas determinísticas |
| Produto, pedido, pagamento, OS, mensagem e auditoria | Defaults no Backend | Galeria de seis domínios consolida exemplos repetidos sem perda |
| Diário, README, Git e `.class` | Entrega & Desafio | Evidências copiáveis, checklist e orientação de commit limpo |
| Critério de conclusão | Toda a aula | Etapas bloqueiam avanço, conclusão geral e próxima aula |
| Limites curriculares | Estratégias + desafio | Não antecipa enum, Optional, Bean Validation, builder ou encapsulamento |

## Consolidação sem perda

Os muitos arquivos quase idênticos do original foram consolidados em quatro locais de armazenamento, sete grupos de tipos, três cenários de validade, quatro estratégias, seis domínios, dez diagnósticos e um programa integrado. Todos os comportamentos únicos permanecem observáveis, com menos repetição mecânica.

## Verificações

- Oito etapas, com Clínica e Entrega independentes.
- Dez diagnósticos, seis domínios e dez evidências finais.
- Código completo com destaque, comandos e saída esperada.
- Validador específico compila e executa o Java.
- Progresso filtrado, conclusão normalizada, foco móvel e próxima aula protegida.
- Responsividade até 320 px; Clínica usa seletores restritos.

