# Matriz de Cobertura — Aula 053: Métodos sem Retorno

## Metadados
- **Módulo**: M1 — Fundamentos do Back-End Java
- **Aula**: 053 (M1.33)
- **Arquivo original**: `053_M1_33_METODOS_SEM_RETORNO_OFICIAL.md`
- **Tema**: Declaração, Assinatura e Chamada de Métodos void (Sem Retorno)

## Estado da validação

- Entrega do Gemini auditada e corrigida pelo Codex em 2026-07-17.
- Reposto o sétimo domínio prometido (`NormalizarStatusComMetodo.java`) e acrescentado um programa completo, compilável e guiado antes do desafio.
- Corrigidos comandos PowerShell, terminologia de passagem por valor, progresso persistido, foco móvel e Clínica de Erros.
- Validador dedicado, compilação Java dos exemplos, lint e build aprovados; aprovação visual do responsável pendente.

## Cobertura Curricular

| Conceito | Original | Componente | Status |
|---|---|---|---|
| O que é método (bloco de código nomeado) | ✅ | PainelConceito / SimuladorFluxo | ✅ |
| O que significa void (executa ação sem devolver valor) | ✅ | PainelConceito | ✅ |
| O que é assinatura (nome, retorno, parâmetros) | ✅ | PainelAnatomia | ✅ |
| Anatomia (public static void nome(params)) | ✅ | PainelAnatomia | ✅ |
| Onde declarar método (classe, fora do main) | ✅ | PainelAnatomia / Clínica de Erros | ✅ |
| Ordem de execução (controle do fluxo na pilha) | ✅ | SimuladorFluxo | ✅ |
| Chamada de método (nome + parênteses + ;) | ✅ | SimuladorFluxo | ✅ |
| Declarar não executa (necessidade de chamada) | ✅ | SimuladorFluxo / Clínica de Erros | ✅ |
| Método sem parâmetro | ✅ | SimuladorFluxo | ✅ |
| Método com parâmetro | ✅ | SimuladorFluxo | ✅ |
| Parâmetro vs Argumento | ✅ | PainelAnatomia | ✅ |
| Método com mais de um parâmetro (ordem importa) | ✅ | SimuladorFluxo / Clínica de Erros | ✅ |
| Responsabilidade única (nome claro de ação) | ✅ | PainelConceito | ✅ |
| Método deve contar uma história (roteiro no main) | ✅ | SimuladorFluxo / Introducao | ✅ |
| Extração de método (refatoração) | ✅ | LabExtração | ✅ |
| Método recebendo array (String[], int[], etc) | ✅ | LabArraysEMatrizes | ✅ |
| Método recebendo matriz (int[][]) | ✅ | LabArraysEMatrizes | ✅ |
| Métodos void com efeito colateral (alterar array recebido) | ✅ | LabEfeitoColateral | ✅ |
| Cuidado com efeito colateral no nome do método | ✅ | LabEfeitoColateral | ✅ |
| Return vazio em void (interrupção antecipada) | ✅ | LabReturnVazio | ✅ |
| Método chamando outro método | ✅ | SimuladorFluxo | ✅ |
| Organização do arquivo (main primeiro, auxiliares depois) | ✅ | PainelAnatomia | ✅ |
| Convenção camelCase para nomes | ✅ | PainelAnatomia / Clínica de Erros | ✅ |
| Sinalizadores de método muito grande | ✅ | Clínica de Erros | ✅ |
| Domínio: cabeçalho e rodapé | ✅ | Galeria de Domínios | ✅ |
| Domínio: exibir pedido | ✅ | Galeria de Domínios | ✅ |
| Domínio: normalizar status | ✅ | Galeria de Domínios | ✅ |
| Domínio: registrar auditoria | ✅ | Galeria de Domínios | ✅ |
| Domínio: exibir ordem de serviço | ✅ | Galeria de Domínios | ✅ |
| Domínio: exibir produto com alerta | ✅ | Galeria de Domínios | ✅ |
| Domínio: exibir pagamento e parcelas | ✅ | Galeria de Domínios | ✅ |
| Erro 1: declarar método dentro de outro método | ✅ | Clínica de Erros | ✅ |
| Erro 2: esquecer de chamar o método | ✅ | Clínica de Erros | ✅ |
| Erro 3: tentar guardar retorno de void | ✅ | Clínica de Erros | ✅ |
| Erro 4: retornar valor em void | ✅ | Clínica de Erros | ✅ |
| Erro 5: esquecer palavra-chave static | ✅ | Clínica de Erros | ✅ |
| Erro 6: passar argumentos na ordem incorreta | ✅ | Clínica de Erros | ✅ |
| Erro 7: nome genérico demais | ✅ | Clínica de Erros | ✅ |
| Erro 8: método com responsabilidade demais | ✅ | Clínica de Erros | ✅ |
| Erro 9: nome de exibição que causa alteração | ✅ | Clínica de Erros | ✅ |
| Erro 10: chamada recursiva acidental | ✅ | Clínica de Erros | ✅ |
| Entrega local (21 arquivos Java) | ✅ | DeliveryLab | ✅ |
| Desafio: CadastroPedidosComMetodos | ✅ | DeliveryLab | ✅ |

## Cobertura: 100% — 43/43 conceitos cobertos

## Simuladores Interativos

1. **Simulador de Fluxo de Execução** — Acompanha passo a passo a pilha de execução (Stack) entrando no `main`, chamando métodos auxiliares com e sem parâmetros, e retornando ao fluxo principal.
2. **Painel de Anatomia do Método** — Identifica visualmente as partes de um método (modificadores, void, parâmetros) e diferencia argumentos de parâmetros.
3. **Lab de Extração e Refatoração** — Demonstra o código "antes" (bloco gigante no main) e "depois" (extraído em métodos com roteiro limpo).
4. **Lab de Arrays & Matrizes** — Demonstra como métodos `void` recebem referências de arrays e matrizes e os exibem de forma estruturada.
5. **Lab de Efeitos Colaterais** — Ilustra como um método `void` pode normalizar ou alterar o conteúdo de um array externo, com o alerta sobre nomes condizentes.
6. **Lab de Return Vazio em Void** — Demonstra a interrupção antecipada com `return;` seguro.
7. **Galeria de Domínios** — 7 cenários práticos de exibição e controle (cabeçalhos, pedidos, status, auditoria, OS, produtos e pagamentos).
8. **Clínica de 10 Erros** — Análise completa de falhas comuns com métodos void.
9. **Entrega & Desafio** — Comandos PowerShell para 21 arquivos Java locais e o desafio integrado `CadastroPedidosComMetodos.java`.
