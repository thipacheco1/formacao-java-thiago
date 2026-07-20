# Matriz de cobertura — Aula 121 — static com critério

## Compromisso de reconstrução

A aula original foi lida integralmente antes da nova experiência. Nenhum conceito técnico foi descartado: trechos repetidos sobre pertencimento, critérios e perigos de estado global foram consolidados em demonstrações interativas, código executável, clínica de erros e uma entrega de domínio. A reconstrução muda a forma de ensinar, não reduz a profundidade.

## Resultado pedagógico

Ao final, o aluno consegue explicar quem é o dono de um membro, distinguir memória da classe e do objeto, justificar `main`, constantes, funções puras e factories, ler o erro de contexto `static`, rejeitar estado global mutável e implementar uma Ordem de Serviço na qual cada uso de `static` possui uma justificativa verificável.

## Cobertura fonte → experiência

| Conteúdo da aula original | Onde foi preservado e aprofundado | Evidência prática |
|---|---|---|
| Objetivo e ideia central: membro pertence à classe, não à instância | Etapa 1, mapa visual Heap × área da classe | Criação de três clientes exibe um `id` por objeto e um único `totalCriados` |
| `main` é `static` | Etapa 2, sequência visual de bootstrap | Comando `java`, carregamento, busca da assinatura e invocação sem `new` |
| Atributo de instância | Etapas 1 e 3 | `id` e `nome` são armazenados separadamente em cada `ClienteContado121` |
| Atributo `static` compartilhado | Etapas 1 e 3 | Contador cresce para todas as instâncias e é acessado por `ClienteContado121.getTotalCriados()` |
| Acesso pela classe | Etapas 1, 3 e clínica | Comparação explícita entre acesso pela classe e chamada enganosa por instância |
| `static final` para constantes | Etapa 4 e entrega | `PRAZO_PADRAO_DIAS` e `DIAS_MAXIMOS_REAGENDAMENTO`, com `UPPER_SNAKE_CASE` |
| Convenção de nomes de constantes | Etapa 4 | O nome é associado visualmente à intenção de valor estável |
| Objeto mutável em campo `static final` | Etapa 4 | Alternância entre primitivo imutável e `List` cuja referência é final, mas aceita `add` |
| Método utilitário `static` | Etapa 5 | Normalização e iniciais são executadas com entrada editável |
| Construtor privado em classe utilitária | Etapa 5 e código compilável | `TextoUtil121` impede instanciação sem sentido |
| Perigo de classe `Utils` gigante | Etapa 5 e clínica | Critério separa transformação genérica de regras de cliente, pedido e pagamento |
| `static` não acessa atributo de instância diretamente | Etapa 6 | O aluno alterna entre `ContextoInvalido121` e uma referência explícita a `cliente` |
| Quando usar método de instância | Etapas 6, 9 e entrega | `getNome`, `resumo` e `reagendar` dependem do estado de um objeto específico |
| Quando um método pode ser `static` | Etapas 5 e 9 | Função pura, constante e criação nomeada passam pelo critério de propriedade |
| Factory `static` | Etapa 7 e entrega | `OrdemFactory121.agendada(...)` e `OrdemServico121.agendar(...)` nomeiam cenários válidos |
| Estado global mutável | Etapa 8 | Simulador faz o teste B encontrar a OS gravada pelo teste A |
| Exemplo ruim com repositório global | Etapa 8 e `StaticGlobalRuim121.java` | A lista `static` permanece entre dois cenários no mesmo processo |
| Dependência explícita | Etapa 8 e `StaticDependenciaExplicita121.java` | Cada `ServicoOrdem121` recebe um repositório novo pelo construtor |
| Melhora obtida pela dependência explícita | Etapas 8 e 9 | Isolamento, substituição e testabilidade são mostrados antes da regra de decisão |
| `static` em testes | Etapa 8 e entrega | Contaminação é reproduzida; métodos auxiliares do teste final são `static` e sem estado de negócio |
| Relação entre `static` e Orientação a Objetos | Etapa 9 | Seis cenários são classificados por propriedade, identidade, estado e colaboração |
| Resumo mental de decisão | Etapa 9 | Pergunta central: “quem é o dono?”; regra de bolso exige justificativa |
| Atividades: instância, compartilhado, constante, utilitário, factory e estado global | Etapas 1 a 9 | Todas viraram ações observáveis, não apenas comandos textuais |
| Desafio prático | Etapa 11 | Ordem de Serviço combina factory, constante, utilitário puro e comportamento de instância |
| Oito erros comuns | Etapa 10, clínica de erros | Oito casos exibem sintoma, causa conceitual e correção |
| Debug recomendado | Etapa 10 | Cinco frames mostram quando `this` existe e quando o contexto é da classe |
| Registro, conclusão e commit | Etapa 11 | Checklist copiável, oito testes, terminal esperado e commit sugerido |

## Roteiro reconstruído

1. Classe ou objeto — mapa de memória e propriedade.
2. `main` e a JVM — bootstrap guiado sem instância.
3. Contador compartilhado — utilidade e limites do estado de classe.
4. Constantes e `final` — imutabilidade de valor versus referência.
5. Utilitário pequeno — função pura, parâmetros e construtor privado.
6. Contexto `static` — ausência de `this` e erro real do compilador.
7. Factory nomeada — criação válida com intenção explícita.
8. Estado global — contaminação de testes e dependência explícita.
9. Decisão de design — seis classificações pelo verdadeiro dono.
10. Debug e clínica — cinco frames e oito diagnósticos.
11. Entrega e OS — solução compilável, oito testes e evidências.

## Recursos visuais e práticos

- Mapa Heap × área da classe que reage à criação de objetos.
- Timeline do bootstrap da JVM.
- Comparador de constante real e coleção `static final` mutável.
- Transformador de texto com entrada livre e saída imediata.
- Terminal de erro deliberado para contexto `static`.
- Comparador de construtor e factory nomeada.
- Simulador de dois testes com e sem dependência compartilhada.
- Classificador de decisões entre instância, constante, função pura, factory e dependência.
- Debugger simulado com `this`, call stack e cinco pausas.
- Clínica navegável com oito erros e nomes legíveis no desktop e no celular.
- Código Java com destaque de sintaxe, saída esperada e cópia.

## Verificação técnica

O validador da aula compila nove programas Java válidos em conjunto, compila separadamente o exemplo deliberadamente inválido e exige sua falha, executa os exemplos, confirma a Ordem de Serviço e os oito testes. Também verifica integração lazy, onze etapas, oito diagnósticos, persistência normalizada e responsividade nos breakpoints do padrão atual.

## Estado editorial

- Implementação: concluída.
- Validação automatizada: obrigatória antes da entrega desta aula.
- Aprovação visual do responsável: pendente; por isso o status permanece `em_revisao`.
