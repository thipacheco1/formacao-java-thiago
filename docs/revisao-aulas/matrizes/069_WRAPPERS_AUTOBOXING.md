# Matriz de cobertura — Aula 069

- Original: `069_M2_08_WRAPPERS_E_AUTOBOXING_OFICIAL.md`
- Componente: `GuidedWrappersLesson069.jsx`
- Cobertura: 100%
- Arquétipo: laboratório visual de primitivos, wrappers, boxing, parsing, comparação, modelagem de domínio, clínica e entrega.

## Transformação

O aluno mapeia cada primitivo ao wrapper, acompanha autoboxing e unboxing em stack/heap, escolhe o tratamento de null pelo contrato, atravessa uma bancada de parsing e confronta o cache de Integer com comparação de valor segura.

## Cobertura rastreável

| Conteúdo original | Destino reconstruído | Evidência |
|---|---|---|
| O que são wrappers | Mapa Primitivo–Wrapper | Oito pares selecionáveis |
| Por que wrappers existem | Mapa + domínio | APIs, objeto, métodos e ausência opcional |
| Primitivo versus wrapper | Mapa Primitivo–Wrapper | Comparador de cinco características por lado |
| Autoboxing | Boxing por Dentro | Passo int → Integer com `valueOf` conceitual |
| Unboxing | Boxing por Dentro | Passo Integer → int com `intValue` conceitual |
| Exemplo mínimo | Boxing + programa | Fluxo 10 → 10 → 10 compilado |
| Null em wrapper | Unboxing de Null | Quatro respostas possíveis para ausência |
| Erro de unboxing null | Unboxing + debug | Falha proposital e causa precisa |
| Validação e método com fallback | Unboxing + programa | `valorOuPadrao` deixa a decisão explícita |
| Métodos úteis | Texto para Número + constantes | parse, valueOf, limites e Boolean |
| `parseInt` | Texto para Número | Retorno int visível |
| `valueOf` | Texto para Número | Retorno Integer visível |
| NumberFormatException | Texto para Número | Entrada abc termina em erro explícito |
| `Boolean.parseBoolean` | Texto para Número + programa | abc retorna false e não valida vocabulário |
| Comparação com `==` | Comparação sem Armadilha | Valores 100 e 1000 expõem cache e identidade |
| Comparação com equals | Comparação sem Armadilha | Conteúdo verdadeiro sem depender da referência |
| `Objects.equals` | Comparação + programa | null/10, null/null e IDs grandes |
| Boolean wrapper | Unboxing + domínio | Três estados e risco de `if (ativo)` |
| `Boolean.TRUE.equals` | Unboxing + programa | null produz false sem NPE |
| Wrapper em domínio | Tipos no Domínio | Nove decisões concretas |
| Idade opcional | Tipos no Domínio + programa | Integer null distingue ausência de zero |
| Estoque obrigatório | Tipos no Domínio + programa | int zero é valor real |
| Performance e overhead | Overhead com Critério | Loop compara somas primitivas e boxing repetido |
| Constantes de wrappers | Overhead + programa | MIN/MAX e Boolean TRUE/FALSE |
| Cliente | Tipos no Domínio | idade opcional |
| Produto | Tipos no Domínio | estoque obrigatório e ativo condicional |
| Pedido | Tipos no Domínio | Long id antes de persistir e long valor obrigatório |
| Pagamento | Tipos no Domínio | parcelas opcionais versus obrigatórias |
| Ordem de serviço | Tipos no Domínio | integração opcional e fallback explícito |
| Mensageria | Tipos no Domínio | tentativas e Boolean com três estados |
| Auditoria | Tipos no Domínio | IDs Long comparados por valor |
| Refatorações | Overhead + Clínica | wrapper desnecessário, Boolean e ID seguros |
| Dez erros comuns | Clínica de Erros | Dez casos com sintoma e correção |
| Debug recomendado | Entrega & Desafio | Quatro passos para null e IDs |
| Atividade, comandos e saída | Entrega & Desafio | Programa completo e doze linhas determinísticas |
| Diário, README, Git e `.class` | Entrega & Desafio | Evidências copiáveis e checklist |
| Limites curriculares | Toda a aula | Não antecipa generics, collections, BigDecimal, Optional ou performance avançada |

## Consolidação sem perda

Os exemplos repetitivos foram consolidados em oito pares de tipos, quatro passos de boxing, quatro políticas para null, seis conversões textuais, quatro cenários de comparação, nove decisões de domínio, um simulador de overhead, dez diagnósticos e um programa integrado. Todo comportamento único permanece observável.

## Verificações

- Nove etapas, com Clínica e Entrega independentes.
- Dez diagnósticos, nove decisões de domínio e dez evidências finais.
- Código completo com destaque, comandos e saída esperada.
- Validador específico compila e executa o Java.
- Progresso filtrado, conclusão normalizada, foco móvel e próxima aula protegida.
- Responsividade até 320 px; Clínica usa seletores restritos.

