# Matriz de cobertura — Aula 126

| Conteúdo da aula oficial | Experiência guiada reconstruída |
|---|---|
| Package como namespace | Mapa interativo de `br.com.curso.aula126.dominio.pedido` e sua pasta equivalente |
| Correspondência entre package e diretório | Árvores navegáveis com caminho completo de 17 fontes |
| Ordem package, imports e tipo | Comparador compilável com erro controlado e mensagem do compilador |
| Pacote default | Laboratório que contrapõe exemplo mínimo e namespace profissional |
| Pedido organizado em pacotes | App, Cliente, Pedido, StatusPedido e Dinheiro com código completo |
| Mesmo pacote, outro pacote e `java.lang` | Mapa de decisão de imports e código real de Pedido |
| Imports explícitos e subpacotes | Caso específico demonstrando que `dominio.*` não importa seus subpacotes |
| `javac -d out` | Pipeline fonte → compilador → árvore de bytecode |
| `java -cp out` e nome qualificado | Terminal alternando execução incorreta e execução correta |
| Convenção de nomes e domínio invertido | Cartão profissional com minúsculas, sem acento, espaço ou hífen |
| Pacotes por domínio versus tipo técnico | Comparador visual e contextualização da futura arquitetura backend |
| Ordem de Serviço | Segunda árvore com seis fontes no mesmo pacote de domínio |
| Nomes iguais em pacotes diferentes | Explicação pelo nome qualificado e alerta sobre clareza semântica |
| IntelliJ | Mock de New Package, New Java Class, Alt+Enter, Optimize Imports e Move |
| Debug e erros comuns | Seis saltos entre pacotes e clínica com oito diagnósticos |
| Desafio Contrato | App e domínio distribuídos em três pacotes, reuso de Dinheiro e oito testes |

## Garantias

- Todo o conteúdo conceitual e prático da fonte oficial foi preservado; repetições viraram comparações e evidências executáveis.
- A App apenas monta cenários. Regras permanecem nos objetos de domínio.
- A aula possui 11 etapas, progresso reversível, bloqueio de conclusão, foco móvel e layout responsivo.
- Os 17 arquivos são compilados juntos, gerando a árvore de pacotes em `out`, e quatro pontos de entrada são executados pelo nome qualificado.

