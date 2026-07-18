# Matriz de cobertura — Aula 107 — Classe e objeto em Java

## Fonte auditada

- `docs/aulas/107_M4_03_CLASSE_E_OBJETO_EM_JAVA_OFICIAL.md`
- Leitura integral realizada em 2026-07-18 antes da reconstrução.

## Contrato pedagógico preservado

| Conteúdo da aula original | Reconstrução guiada | Evidência prática |
|---|---|---|
| Classe, objeto, instância, `new` e referência | Mapa interativo entre molde, expressão de criação e dois objetos na Heap | Alternância entre Ana e Carlos revela endereços e estados independentes |
| Primeiro `Cliente` completo | Etapa com fonte integral, comandos PowerShell e saída esperada | `ClientePrimeiroObjeto.java` compilado pelo validador |
| Atributos e métodos | Anatomia navegável de campo, consulta e comportamento | Estado → comportamento → resposta do objeto atual |
| Construtor e `this` | Linha do tempo em cinco movimentos, separando argumento, parâmetro, atributo e referência | Atribuição `this.nome = nome` observada antes/depois |
| Dois objetos da mesma classe | Comparador de memória e fonte completa | Ana possui contato completo; Carlos não possui |
| OS com regra de negócio | Simulador de status, dias e reagendamentos, seguido da fonte completa | Fila recalculada em tempo real e execução Java validada |
| Classe pública e classes auxiliares | Explicação incorporada aos programas de arquivo único | Cada fonte mantém uma classe pública com o nome do arquivo |
| Atributo versus variável local | Classificador de seis construções | Campo, parâmetro e local diferenciados por escopo e duração |
| Método de objeto versus `static` | Regra de decisão e exemplos selecionáveis | Dependência do estado determina método de instância |
| Pedido com `BigDecimal` | Calculadora interativa e fonte completa | Validade, bruto, desconto e total final conferidos |
| Encapsulamento e `final` | Classificador de `private final` e limite da classe | Estado não fica público nem pode ser reatribuído após construção |
| Assuntos que ainda não entram | Faixa explícita de herança, interface, Spring, JPA e demais tópicos futuros | Foco preservado na base de objetos |
| Debug recomendado | Mock de IDE com oito pausas do `main` ao método privado | Variables, Frames, `this`, parâmetro, campo e referência |
| Sete erros comuns | Clínica ampliada para oito diagnósticos sem remover nenhum erro original | Novo diagnóstico distingue referência do objeto |
| Atividade guiada | Cliente, dois clientes, OS e Pedido distribuídos ao longo do roteiro | Quatro programas completos e saídas verificáveis |
| Desafio Pagamento | Contrato antes da solução, enum, duas instâncias e testes | `PagamentoObjeto.java` e `TesteClasseObjeto.java` compilados e executados |
| Registro, conclusão e Git | Defesa oral, checklist de evidências, README e comandos de commit | Progressão bloqueada por etapa e aula seguinte bloqueada até conclusão |

## Arquétipo aplicado

Oficina guiada de mapa mental, primeira execução, construção em memória, anatomia, independência de instâncias, regras de domínio, limites da classe, transferência para Pedido, debug, clínica e entrega.

## Decisões de profundidade

- A metáfora “classe é molde” foi mantida, mas conectada ao processo real `argumentos → new → construtor → this → referência`.
- “Objeto em memória” não ficou apenas no texto: a interface mostra variável/referência separada do objeto e permite comparar duas instâncias.
- Todos os conceitos centrais aparecem primeiro em um programa completo, depois em inspeções visuais e finalmente em um domínio novo.
- `private`, `final`, método de instância e `static` são explicados pelo efeito no estado, não como palavras-chave isoladas.
- OS e Pedido preservam os exemplos da fonte; Pagamento exige transferência, sem copiar nomes ou regras.
- Blocos de código usam destaque de sintaxe estilo IDE e comandos incluem a saída esperada.

## Artefatos

- `plataforma-curso/src/components/GuidedClassObjectLesson107.jsx`
- `plataforma-curso/src/components/guidedClassObjectLesson.css`
- `tools/validate-lesson-107.mjs`
- Integração: `plataforma-curso/src/components/MarkdownViewer.jsx`

## Estado da revisão

- Implementação técnica: concluída.
- Validação automatizada: seis fontes Java compiladas e executadas com sucesso.
- Inspeção visual e aprovação explícita do responsável: pendentes.
