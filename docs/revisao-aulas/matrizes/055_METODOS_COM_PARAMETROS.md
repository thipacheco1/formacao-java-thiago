# Matriz de Cobertura — Aula 055: Métodos com Parâmetros

## Metadados
- **Módulo**: M1 — Fundamentos do Back-End Java
- **Aula**: 055 (M1.35)
- **Arquivo original**: `055_M1_35_METODOS_COM_PARAMETROS_OFICIAL.md`
- **Tema**: Parâmetros, Argumentos, Passagem por Valor, Cópia de Referências e Efeitos Colaterais

## Estado da validação

- Entrega do Gemini auditada e corrigida pelo Codex em 2026-07-17.
- Corrigida a afirmação tecnicamente incorreta de que arrays seriam passados por referência: Java sempre passa por valor e, nesse caso, copia o valor da referência.
- Um programa completo e compilável agora demonstra parâmetros `int`, `long`, `double`, `boolean`, `String`, arrays e matrizes antes do desafio.
- Comandos, progresso persistido, foco móvel, responsividade e Clínica de Erros foram corrigidos; aprovação visual do responsável pendente.

## Cobertura Curricular

| Conceito | Original | Componente | Status |
|---|---|---|---|
| O que é parâmetro (assinatura e vaga) | ✅ | PainelConceito | ✅ |
| O que é argumento (chamada e valor real) | ✅ | PainelConceito | ✅ |
| Parâmetro vs Argumento | ✅ | PainelConceito | ✅ |
| Assinatura com parâmetros | ✅ | PainelAnatomia | ✅ |
| Ordem dos parâmetros (sequência obrigatória) | ✅ | PainelOrdem / Clínica de Erros | ✅ |
| Risco de ordem errada com tipos iguais | ✅ | PainelOrdem / Clínica de Erros | ✅ |
| Nome do parâmetro e legibilidade | ✅ | PainelAnatomia / LabComparativo | ✅ |
| Parâmetro com valor literal | ✅ | LabArgumentos | ✅ |
| Parâmetro com variável como argumento | ✅ | LabArgumentos | ✅ |
| Escopo do parâmetro | ✅ | PainelEscopo | ✅ |
| Parâmetro int (estoques, contadores) | ✅ | LabTiposParametros | ✅ |
| Parâmetro long (centavos financeiros) | ✅ | LabTiposParametros | ✅ |
| Parâmetro double (médias decimais) | ✅ | LabTiposParametros | ✅ |
| Parâmetro boolean (decisões lógicas) | ✅ | LabTiposParametros | ✅ |
| Parâmetro String (nomes, status) | ✅ | LabTiposParametros | ✅ |
| Vários parâmetros (assinaturas complexas) | ✅ | LabTiposParametros | ✅ |
| Método com parâmetro e retorno (trabalho conjunto) | ✅ | LabTiposParametros | ✅ |
| Parâmetro array (String[], int[]) | ✅ | LabArraysMatrizes | ✅ |
| Parâmetro matriz (int[][]) | ✅ | LabArraysMatrizes | ✅ |
| Parâmetro primitivo e cópia de valor (passagem por valor) | ✅ | LabPassagemPrimitivo | ✅ |
| Mutabilidade de array como parâmetro (referência copiada por valor) | ✅ | LabPassagemArray | ✅ |
| Efeitos colaterais e sua declaração no nome do método | ✅ | LabPassagemArray | ✅ |
| Normalizar array de status | ✅ | LabPassagemArray | ✅ |
| Muitos parâmetros e sinal de futuro objeto | ✅ | PainelConceito | ✅ |
| Parâmetros relacionados (indicativo de classe/entidade) | ✅ | PainelConceito | ✅ |
| Validando parâmetros defensivamente (null/isBlank/negativo) | ✅ | LabValidacaoDefensiva | ✅ |
| Return em void para interrupção de entrada inválida | ✅ | LabValidacaoDefensiva | ✅ |
| Parâmetro com nome igual a variável da main | ✅ | PainelEscopo | ✅ |
| Parâmetro com nome diferente da variável da main | ✅ | PainelEscopo | ✅ |
| Domínio: cliente | ✅ | Galeria de Domínios | ✅ |
| Domínio: produto (estoque zerado ativo) | ✅ | Galeria de Domínios | ✅ |
| Domínio: pedido (roteiro de alto nível) | ✅ | Galeria de Domínios | ✅ |
| Domínio: pagamento (cálculo de parcelas) | ✅ | Galeria de Domínios | ✅ |
| Domínio: ordem de serviço (certificado e atividades) | ✅ | Galeria de Domínios | ✅ |
| Domínio: auditoria (logs sequenciais) | ✅ | Galeria de Domínios | ✅ |
| Domínio: mensageria (tentativas acima do limite) | ✅ | Galeria de Domínios | ✅ |
| Erro 1: confundir parâmetro com argumento | ✅ | Clínica de Erros | ✅ |
| Erro 2: passar argumentos na ordem errada | ✅ | Clínica de Erros | ✅ |
| Erro 3: usar nomes genéricos (a, b, c) | ✅ | Clínica de Erros | ✅ |
| Erro 4: esquecer o tipo do parâmetro | ✅ | Clínica de Erros | ✅ |
| Erro 5: chamar método sem enviar argumento obrigatório | ✅ | Clínica de Erros | ✅ |
| Erro 6: enviar tipo incompatível | ✅ | Clínica de Erros | ✅ |
| Erro 7: crer que alterar primitivo altera fora | ✅ | Clínica de Erros | ✅ |
| Erro 8: alterar array sem perceber | ✅ | Clínica de Erros | ✅ |
| Erro 9: métodos com parâmetros demais | ✅ | Clínica de Erros | ✅ |
| Erro 10: não validar parâmetro vindo de fora | ✅ | Clínica de Erros | ✅ |
| Entrega local (32 arquivos Java) | ✅ | DeliveryLab | ✅ |
| Desafio: CadastroProdutosComParametros | ✅ | DeliveryLab | ✅ |

## Cobertura: 100% — 48/48 conceitos cobertos

## Simuladores Interativos

1. **Simulador de Passagem de Parâmetros** — Demonstra a diferença entre copiar um valor primitivo e copiar o valor de uma referência que continua apontando para o mesmo objeto na Heap.
2. **Painel Anatômico do Cabeçalho de Método** — Inspeciona modificadores, nomes e tipos de parâmetros em assinaturas estáticas.
3. **Lab de Escopo & Nomes** — Compara visualmente variáveis com nomes iguais ou diferentes declaradas na `main` e passadas como argumentos a parâmetros isolados.
4. **Lab de Argumentos (Literais vs Variáveis)** — Permite alternar a chamada de métodos usando strings literais diretamente ou variáveis declaradas.
5. **Lab de Validação Defensiva** — Simula barreiras que protegem o método de entradas nulas, vazias ou fora dos limites físicos.
6. **Galeria de Domínios** — 7 cenários práticos (clientes, produtos, pedidos, pagamentos, OS, auditoria e mensageria).
7. **Clínica de 10 Erros** — Compêndio de falhas de compilação ou bugs conceituais associados a parâmetros.
8. **Entrega & Desafio** — Comandos PowerShell para criar e validar 32 arquivos Java e o desafio `CadastroProdutosComParametros.java`.
