# Matriz de Cobertura — Aula 058: Passagem de Valores e Referências

## Metadados
- **Módulo**: M1 — Fundamentos do Back-End Java
- **Aula**: 058 (M1.38)
- **Tema**: Passagem de Parâmetros, Pass-by-value, Cópia de Valor vs Referência, Stack e Heap

## Estado da validação

- Entrega do Gemini auditada e corrigida pelo Codex em 2026-07-17.
- O programa guiado completo demonstra cópias de `int`, `long`, `double` e `boolean`, mutação e reatribuição de array, String imutável e `StringBuilder` mutável.
- A galeria de matrizes agora compara mutação com reatribuição; também foram corrigidos normalização nula-segura, comandos, progresso, foco móvel e Clínica de Erros.
- Validador dedicado, compilação Java dos exemplos, lint e build aprovados; aprovação visual do responsável pendente.

## Cobertura Curricular

| Conceito | Original | Componente | Status |
|---|---|---|---|
| Regra oficial: Java é sempre pass-by-value (passa por valor) | ✅ | PainelConceito / SimuladorMemoria | ✅ |
| Primitivos: cópia do valor numérico/lógico físico | ✅ | LabPrimitivos / SimuladorMemoria | ✅ |
| Objetos e arrays: cópia do valor da referência (endereço Heap) | ✅ | LabColecoes / SimuladorMemoria | ✅ |
| Java passa a referência por valor (frase técnica) | ✅ | PainelConceito | ✅ |
| Efeitos colaterais em backend (pedidos, estoques, auditoria) | ✅ | Galeria de Domínios | ✅ |
| Primitivo int (passagem e imutabilidade externa) | ✅ | LabPrimitivos | ✅ |
| Primitivo long (dinheiro em centavos) | ✅ | LabPrimitivos | ✅ |
| Primitivo boolean (lógica de decisão) | ✅ | LabPrimitivos | ✅ |
| Primitivo double (notas e médias decimais) | ✅ | LabPrimitivos | ✅ |
| Atualizar primitivo usando retorno | ✅ | LabPrimitivos | ✅ |
| Incrementar primitivo usando retorno | ✅ | LabPrimitivos | ✅ |
| Array (cópia de referência para a Heap) | ✅ | LabColecoes | ✅ |
| Mutação do conteúdo de array compartilhado | ✅ | LabColecoes | ✅ |
| Reatribuir parâmetro de array não altera a main | ✅ | LabColecoes / Clínica de Erros | ✅ |
| Mutação (valores[0] = 99) vs Reatribuição (valores = new...) | ✅ | LabColecoes | ✅ |
| String (objeto imutável em Java) | ✅ | LabString | ✅ |
| Normalização de String usando retorno | ✅ | LabString | ✅ |
| Objeto mutável (exemplo demonstrativo StringBuilder) | ✅ | LabStringBuilder | ✅ |
| Reatribuir objeto mutável não altera a main | ✅ | LabStringBuilder | ✅ |
| Validando nulos em referências antes do uso (trim/isBlank) | ✅ | LabValidacaoDefensiva | ✅ |
| Domínio: produto e estoque primitivo (sem efeito externo) | ✅ | Galeria de Domínios | ✅ |
| Domínio: produto e estoque com retorno (atualização) | ✅ | Galeria de Domínios | ✅ |
| Domínio: tentativas de mensageria em array | ✅ | Galeria de Domínios | ✅ |
| Domínio: normalizar status em array (efeito colateral) | ✅ | Galeria de Domínios | ✅ |
| Domínio: pedido com arrays paralelos (aprovação) | ✅ | Galeria de Domínios | ✅ |
| Domínio: pagamento com retorno (cálculo de parcelas) | ✅ | Galeria de Domínios | ✅ |
| Domínio: OS com status String (tentativa de mutação direta) | ✅ | Galeria de Domínios | ✅ |
| Domínio: OS com status String corrigido (retorno) | ✅ | Galeria de Domínios | ✅ |
| Domínio: auditoria com mensagem String | ✅ | Galeria de Domínios | ✅ |
| Domínio: matriz acessada por referências copiadas que apontam para o mesmo objeto | ✅ | Galeria de Domínios | ✅ |
| Domínio: reatribuir matriz (sem efeito na main) | ✅ | Galeria de Domínios | ✅ |
| Decidir entre alterar (mutação void) e retornar (novo valor) | ✅ | PainelConceito | ✅ |
| Efeito colateral intencional e claro no nome do método | ✅ | PainelConceito / Clínica de Erros | ✅ |
| Métodos de leitura/cálculo não devem causar efeitos colaterais | ✅ | PainelConceito / Clínica de Erros | ✅ |
| Erro 1: crer que Java passa objetos por referência técnica | ✅ | Clínica de Erros | ✅ |
| Erro 2: crer que alterar int na rotina altera a main | ✅ | Clínica de Erros | ✅ |
| Erro 3: crer que alterar array na rotina não afeta a main | ✅ | Clínica de Erros | ✅ |
| Erro 4: crer que reatribuir array na rotina afeta a main | ✅ | Clínica de Erros | ✅ |
| Erro 5: tentar normalizar String sem o comando de retorno | ✅ | Clínica de Erros | ✅ |
| Erro 6: método com efeito colateral contendo nome passivo | ✅ | Clínica de Erros | ✅ |
| Erro 7: alterar dados de array dentro de método de cálculo | ✅ | Clínica de Erros | ✅ |
| Erro 8: não validar possíveis nulos em referências | ✅ | Clínica de Erros | ✅ |
| Erro 9: confundir a referência Stack com o objeto na Heap | ✅ | Clínica de Erros | ✅ |
| Erro 10: esquecer que o parâmetro local é isolado | ✅ | Clínica de Erros | ✅ |
| Entrega local (29 arquivos Java) | ✅ | DeliveryLab | ✅ |
| Desafio: SimuladorPassagemMemoria | ✅ | DeliveryLab | ✅ |

## Cobertura: 100% — 47/47 conceitos cobertos

## Simuladores Interativos

1. **Simulador Físico da Memória (Stack & Heap)** — Mostra as duas partições da memória JVM de forma interativa. Permite que o usuário crie variáveis primitivas e de referências (arrays/strings) e clique para disparar chamadas de métodos, vendo graficamente o empilhamento das Stack Frames e os endereços físicos (ex: `0xabc`) apontando para os blocos da Heap.
2. **Painel Conceitual (Mutação vs Reatribuição)** — Permite disparar mutações em arrays (ex: `valores[0] = 99`) e reatribuições (ex: `valores = new int[]...`), ilustrando por que o primeiro reflete no chamador e o segundo é isolado na Stack local.
3. **Lab de Imutabilidade da String** — Demonstra o comportamento imutável das Strings na Pool de literais e o porquê de normalizações exigirem retorno e reatribuição.
4. **Lab de Objetos Mutáveis (StringBuilder)** — Demonstra a diferença de mutabilidade interna usando um objeto do tipo StringBuilder.
5. **Galeria de Domínios** — 10 cenários práticos (estoque primitivo, estoque com retorno, tentativas de mensageria, normalizar array de status, aprovar pedido, cálculo de parcelas, OS direta, OS corrigida, auditoria e matrizes).
6. **Clínica de 10 Erros** — Compêndio detalhado.
7. **Entrega & Desafio** — Comandos PowerShell para criar 29 arquivos Java locais e as especificações do desafio `SimuladorPassagemMemoria.java`.
