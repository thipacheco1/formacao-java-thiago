# Matriz de Cobertura — Aula 056: Sobrecarga de Métodos Inicial

## Metadados
- **Módulo**: M1 — Fundamentos do Back-End Java
- **Aula**: 056 (M1.36)
- **Arquivo original**: `056_M1_36_SOBRECARGA_DE_METODOS_INICIAL_OFICIAL.md`
- **Tema**: Sobrecarga de Métodos (Overload) e Resolução de Assinaturas

## Estado da validação

- Entrega do Gemini auditada e corrigida pelo Codex em 2026-07-17.
- O exemplo guiado completo agora cobre sobrecarga por quantidade, tipos primitivos, arrays, normalização textual, boolean e delegação para a assinatura mais completa.
- Corrigidos comandos `javac`, progresso persistido, foco móvel, responsividade e Clínica de Erros.
- Validador dedicado, compilação Java dos exemplos, lint e build aprovados; aprovação visual do responsável pendente.

## Cobertura Curricular

| Conceito | Original | Componente | Status |
|---|---|---|---|
| Sobrecarga de métodos (mesmo nome, parâmetros diferentes) | ✅ | SimuladorResolucao | ✅ |
| Decisão de chamada em tempo de compilação | ✅ | SimuladorResolucao / Clínica de Erros | ✅ |
| Sobrecarga por quantidade | ✅ | LabSobrecargas / Clínica de Erros | ✅ |
| Sobrecarga por tipo | ✅ | LabSobrecargas / Clínica de Erros | ✅ |
| Sobrecarga por ordem dos tipos | ✅ | LabSobrecargas / Clínica de Erros | ✅ |
| Assinatura conceitual (nome + tipos) | ✅ | PainelAssinatura | ✅ |
| Tipo de retorno não diferencia sobrecarga | ✅ | PainelAssinatura / Clínica de Erros | ✅ |
| Nome do parâmetro não diferencia assinatura | ✅ | PainelAssinatura / Clínica de Erros | ✅ |
| Sobrecarga com retorno (devolução de dados) | ✅ | LabSobrecargas | ✅ |
| Sobrecarga com void (rotinas de exibição) | ✅ | LabSobrecargas | ✅ |
| Redução de duplicação: menor chamando o mais completo | ✅ | LabReutilizacao | ✅ |
| Risco de valores padrão inadequados | ✅ | LabReutilizacao | ✅ |
| Cuidado com booleanos na assinatura (legibilidade) | ✅ | LabNormalizacao | ✅ |
| Ambiguidade com null em sobrecargas de referência | ✅ | LabNullAmbiguo | ✅ |
| Resolução com conversão implícita (int para long) | ✅ | LabNormalizacao | ✅ |
| Sobrecarga por tipo de array (int[] vs long[]) | ✅ | LabArrays | ✅ |
| Sobrecarga não substitui bom nome específico | ✅ | PainelConceito | ✅ |
| Domínio: mensagens (INFO, ERRO com códigos) | ✅ | Galeria de Domínios | ✅ |
| Domínio: pedido (cliente, valor, status) | ✅ | Galeria de Domínios | ✅ |
| Domínio: pagamento (parcelas implícitas) | ✅ | Galeria de Domínios | ✅ |
| Domínio: produto (estoque opcional) | ✅ | Galeria de Domínios | ✅ |
| Domínio: OS (níveis de detalhamento) | ✅ | Galeria de Domínios | ✅ |
| Domínio: auditoria (usuário e status implícitos) | ✅ | Galeria de Domínios | ✅ |
| Domínio: mensageria (tentativas de envio) | ✅ | Galeria de Domínios | ✅ |
| Erro 1: achar que mudar retorno diferencia sobrecarga | ✅ | Clínica de Erros | ✅ |
| Erro 2: duplicar assinaturas com nomes de parâmetros distintos | ✅ | Clínica de Erros | ✅ |
| Erro 3: sobrecarga confusa com muitas Strings | ✅ | Clínica de Erros | ✅ |
| Erro 4: sobrecarga com responsabilidades distintas | ✅ | Clínica de Erros | ✅ |
| Erro 5: usar valores padrão sem lógica de negócio | ✅ | Clínica de Erros | ✅ |
| Erro 6: desatenção sobre qual versão está sendo chamada | ✅ | Clínica de Erros | ✅ |
| Erro 7: passar null de forma ambígua | ✅ | Clínica de Erros | ✅ |
| Erro 8: sobrecarga gerada por preguiça de nomear | ✅ | Clínica de Erros | ✅ |
| Erro 9: misturar com métodos gigantes | ✅ | Clínica de Erros | ✅ |
| Erro 10: deixar de validar/testar cada variação | ✅ | Clínica de Erros | ✅ |
| Entrega local (21 arquivos Java) | ✅ | DeliveryLab | ✅ |
| Desafio: CalculadoraCustoServico | ✅ | DeliveryLab | ✅ |

## Cobertura: 100% — 36/36 conceitos cobertos

## Simuladores Interativos

1. **Simulador de Resolução de Chamadas (Overload Resolver)** — Permite que o usuário selecione diferentes tipos e quantidades de argumentos e observe qual método sobrecarregado é resolvido pelo compilador do Java em tempo real.
2. **Painel de Assinatura Conceitual** — Demonstra visualmente como o compilador vê a assinatura (ex: `exibir(String)` vs `exibir(int)`), realçando a ineficácia do tipo de retorno e do nome do parâmetro como diferenciais.
3. **Lab de Reutilização Limpa** — Mostra a boa prática de delegar a execução da sobrecarga simples para a mais complexa enviando valores padrão, minimizando a duplicação de lógica.
4. **Lab de Ambiguidade de Null & Conversões** — Demonstra o comportamento de conversões implícitas (como `int` migrando para `long`) e os travamentos gerados ao tentar passar `null` para assinaturas conflitantes.
5. **Galeria de Domínios** — 7 cenários práticos (mensagens, pedidos, pagamentos, estoque de produtos, OS, auditoria e mensageria).
6. **Clínica de 10 Erros** — Compêndio de falhas comuns em sobrecarga.
7. **Entrega & Desafio** — Comandos PowerShell para criar 21 arquivos Java locais e o desafio integrado `CalculadoraCustoServico.java`.
