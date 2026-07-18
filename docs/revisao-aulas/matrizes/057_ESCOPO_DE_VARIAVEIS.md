# Matriz de Cobertura — Aula 057: Escopo de Variáveis

## Metadados
- **Módulo**: M1 — Fundamentos do Back-End Java
- **Aula**: 057 (M1.37)
- **Tema**: Escopo de Variáveis, Visibilidade, Tempo de Vida, Inicialização Local e Sombra (Shadowing)

## Estado da validação

- Entrega do Gemini auditada e corrigida pelo Codex em 2026-07-17.
- O programa guiado completo repõe a demonstração conjunta de `if/else`, `for`, `while`, temporárias, parâmetros, método e campo sombreado.
- Corrigidos saída divergente, comandos `javac`, progresso persistido, foco móvel, responsividade e Clínica de Erros.
- Validador dedicado, compilação Java dos exemplos, lint e build aprovados; aprovação visual do responsável pendente.

## Cobertura Curricular

| Conceito | Original | Componente | Status |
|---|---|---|---|
| O que é escopo (região de existência) | ✅ | PainelConceito | ✅ |
| Evitar vazamento de dados lógicos (isolamento) | ✅ | PainelConceito | ✅ |
| Bloco definido por chaves (blocos internos vs externos) | ✅ | SimuladorEscopo | ✅ |
| Visibilidade: bloco interno enxerga externo (vice-versa não) | ✅ | SimuladorEscopo | ✅ |
| Variável local (método ou bloco) | ✅ | SimuladorEscopo | ✅ |
| Escopo e tempo de vida de parâmetros de métodos | ✅ | SimuladorEscopo / LabMetodos | ✅ |
| Tempo de vida (nascimento e fim da variável) | ✅ | SimuladorEscopo | ✅ |
| Erro ao tentar acessar variável fora do bloco (if/for/while) | ✅ | SimuladorEscopo / Clínica de Erros | ✅ |
| Variável local precisa ser inicializada antes do uso | ✅ | LabInicializacao / Clínica de Erros | ✅ |
| Correção com atribuição garantida (ambos os fluxos) | ✅ | LabInicializacao | ✅ |
| Variável local não recebe valor padrão automaticamente | ✅ | LabInicializacao | ✅ |
| Escopo do loop for (índice restrito) | ✅ | LabLoops | ✅ |
| Erro tentando acessar índice do for fora do loop | ✅ | LabLoops / Clínica de Erros | ✅ |
| Escopo do loop while | ✅ | LabLoops | ✅ |
| Variável criada em if e else isolados | ✅ | LabInicializacao | ✅ |
| Escopo e isolamento entre métodos | ✅ | LabMetodos | ✅ |
| Erro tentando ler variável de outro método | ✅ | LabMetodos / Clínica de Erros | ✅ |
| Cópia de primitivos em parâmetros | ✅ | LabMetodos | ✅ |
| Compartilhamento de arrays em parâmetros (referência Heap) | ✅ | LabMetodos | ✅ |
| Sombra de variáveis (shadowing) | ✅ | LabShadowing | ✅ |
| Shadowing de campo estático da classe por local/parâmetro | ✅ | LabShadowing | ✅ |
| Acesso explícito ao campo global usando ClassName.campo | ✅ | LabShadowing | ✅ |
| Redeclaração inválida no mesmo escopo local | ✅ | Clínica de Erros | ✅ |
| Acumulador fora do loop (por que é obrigatório) | ✅ | LabLoops | ✅ |
| Erro declarando acumulador dentro do loop | ✅ | LabLoops / Clínica de Erros | ✅ |
| Variável temporária de suporte (statusNormalizado) | ✅ | LabTemporarias | ✅ |
| Evitar campo estático global para fugir de parâmetros | ✅ | LabShadowing | ✅ |
| Domínio: pedido (cliente, valor, status) | ✅ | Galeria de Domínios | ✅ |
| Domínio: produto (bloco de alerta de estoque) | ✅ | Galeria de Domínios | ✅ |
| Domínio: pagamento (validação com escape return;) | ✅ | Galeria de Domínios | ✅ |
| Domínio: ordem de serviço (mensagens de decisão) | ✅ | Galeria de Domínios | ✅ |
| Domínio: auditoria (linha temporária local) | ✅ | Galeria de Domínios | ✅ |
| Domínio: mensageria (alerta condicional de tentativas) | ✅ | Galeria de Domínios | ✅ |
| Domínio: loop de pedidos (clienteAtual e valorAtual) | ✅ | Galeria de Domínios | ✅ |
| Erro 1: usar variável fora do bloco | ✅ | Clínica de Erros | ✅ |
| Erro 2: usar índice do for fora do loop | ✅ | Clínica de Erros | ✅ |
| Erro 3: ler variável de outro método diretamente | ✅ | Clínica de Erros | ✅ |
| Erro 4: declarar variável local e não inicializar | ✅ | Clínica de Erros | ✅ |
| Erro 5: inicializar variável local apenas em um if sem else | ✅ | Clínica de Erros | ✅ |
| Erro 6: declarar acumulador dentro do loop | ✅ | Clínica de Erros | ✅ |
| Erro 7: escopo local grande demais desnecessário | ✅ | Clínica de Erros | ✅ |
| Erro 8: campo estático desnecessário para fugir do escopo | ✅ | Clínica de Erros | ✅ |
| Erro 9: sombra confusa mascarando lógica | ✅ | Clínica de Erros | ✅ |
| Erro 10: confundir escopo da variável com seu valor | ✅ | Clínica de Erros | ✅ |
| Entrega local (27 arquivos Java) | ✅ | DeliveryLab | ✅ |
| Desafio: CalculoFreteEscopo | ✅ | DeliveryLab | ✅ |

## Cobertura: 100% — 47/47 conceitos cobertos

## Simuladores Interativos

1. **Simulador de Escopo e Tempo de Vida** — Demonstra visualmente as chaves `{}` do código e realça as variáveis vivas na Stack em cada linha de execução de condicionais e loops.
2. **Lab de Inicialização Local** — Apresenta os caminhos que falham na compilação por falta de definição segura de valores e como corrigi-los usando blocos equilibrados.
3. **Lab de Shadowing (Sombra)** — Mostra visualmente a máscara que uma variável local faz em campos estáticos globais de mesmo nome e a sintaxe de desambiguação.
4. **Lab de Loops & Acumuladores** — Explica fisicamente a diferença entre declarar um totalizador fora ou dentro do laço `for`/`while`.
5. **Galeria de Domínios** — 7 cenários práticos (pedidos, produtos, pagamentos, OS, auditoria, mensageria, loops de listagem).
6. **Clínica de 10 Erros** — Compêndio estruturado sobre violações de escopo em Java.
7. **Entrega & Desafio** — Comandos PowerShell para criar 27 laboratórios Java locais e as especificações do desafio `CalculoFreteEscopo.java`.
