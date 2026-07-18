# Matriz de Cobertura — Aula 049: Maior, Menor, Soma e Média em Array

## Metadados
- **Módulo**: M1 — Fundamentos do Back-End Java
- **Aula**: 049 (M1.29)
- **Arquivo original**: `049_M1_29_MAIOR_MENOR_SOMA_E_MEDIA_EM_ARRAY_OFICIAL.md`
- **Tema**: Operações de Estatística Básica em Arrays
- **Estado**: implementação do Gemini auditada e corrigida pelo Codex em 2026-07-17; exemplo guiado com `Scanner`, persistência normalizada, foco mobile e responsividade adicionados. Validação estática, lint, build e inspeção responsiva aprovados; aprovação do responsável pendente.

## Cobertura Curricular

| Conceito | Original | Componente | Status |
|---|---|---|---|
| Acumulador e soma | ✅ | SomaLab (SimuladorRelatorio) | ✅ |
| Média com cast para double | ✅ | SimuladorRelatorio | ✅ |
| Divisão inteira vs decimal | ✅ | CastMediaLab | ✅ |
| Maior valor (init com valores[0]) | ✅ | SimuladorRelatorio | ✅ |
| Menor valor (init com valores[0]) | ✅ | SimuladorRelatorio | ✅ |
| Inicialização correta maior/menor | ✅ | InicializacaoLab | ✅ |
| Perigo de inicializar com zero (negativos) | ✅ | InicializacaoLab | ✅ |
| Loop a partir do índice 1 | ✅ | SimuladorRelatorio | ✅ |
| Relatório final organizado | ✅ | SimuladorRelatorio | ✅ |
| Portão de array vazio | ✅ | ArrayVazioLab | ✅ |
| Valores negativos (proof) | ✅ | InicializacaoLab | ✅ |
| Tipos long e double | ✅ | Galeria de Domínios | ✅ |
| Maior/Menor com posição | ✅ | ComPosicaoLab | ✅ |
| Empate no maior (> vs >=) | ✅ | ComPosicaoLab | ✅ |
| Valores acima da média (2 passes) | ✅ | DoisPassesLab | ✅ |
| Contagem acima de limite | ✅ | DoisPassesLab | ✅ |
| Domínio: estoque | ✅ | Galeria de Domínios | ✅ |
| Domínio: pedidos (long) | ✅ | Galeria de Domínios | ✅ |
| Domínio: OS e atividades | ✅ | Galeria de Domínios | ✅ |
| Domínio: mensageria | ✅ | Galeria de Domínios | ✅ |
| Domínio: auditoria de eventos | ✅ | Galeria de Domínios | ✅ |
| Domínio: SLA em horas (double) | ✅ | Galeria de Domínios | ✅ |
| Erro 1: maior init com 0 | ✅ | Clínica de Erros | ✅ |
| Erro 2: menor init com 0 | ✅ | Clínica de Erros | ✅ |
| Erro 3: array vazio sem proteção | ✅ | Clínica de Erros | ✅ |
| Erro 4: <= valores.length | ✅ | Clínica de Erros | ✅ |
| Erro 5: média dentro do loop | ✅ | Clínica de Erros | ✅ |
| Erro 6: cast faltante para double | ✅ | Clínica de Erros | ✅ |
| Erro 7: somar índice em vez de valor | ✅ | Clínica de Erros | ✅ |
| Erro 8: comparar índice em vez de valor | ✅ | Clínica de Erros | ✅ |
| Erro 9: não atualizar posição | ✅ | Clínica de Erros | ✅ |
| Erro 10: relatório sem rótulos | ✅ | Clínica de Erros | ✅ |
| Entrega local (28 arquivos Java) | ✅ | DeliveryLab | ✅ |
| Desafio: RelatorioNotasAlunos | ✅ | DeliveryLab | ✅ |
| Leitura de valores informados pelo usuário | ✅ | Exemplo guiado `RelatorioValoresUsuario.java` | ✅ |

## Cobertura: 100% — 36/36 conceitos cobertos

## Simuladores Interativos

1. **Simulador Mestre de Relatório** — array editável de 5 elementos, executa todas as 4 operações em tempo real.
2. **Lab de Inicialização Correta** — Comparador de `maior = 0` vs `maior = valores[0]` com arrays negativos.
3. **Lab de Cast de Média** — Demonstra divisão inteira truncada vs divisão com `(double)`.
4. **Lab de Portão de Array Vazio** — Protege o acesso a `valores[0]` com verificação de `length == 0`.
5. **Lab de Maior/Menor com Posição** — Rastreia `indiceMaior` e `indiceMenor` junto ao valor. Demonstra o empate (> vs >=).
6. **Lab de 2 Passes (Acima da Média)** — Executa primeiro a soma/média, depois conta quantos valores ficaram acima.
7. **Galeria de Domínios** — 6 cenários corporativos com relatórios de estoque, pedidos, OS, mensageria, auditoria, SLA.
8. **Clínica de 10 Erros** — Diagnóstico com código problemático, sintoma, causa raiz e correção.
9. **Entrega & Desafio** — PowerShell guiado para 28 arquivos locais + desafio `RelatorioNotasAlunos.java`.
