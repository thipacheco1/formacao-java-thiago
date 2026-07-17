# Matriz de cobertura — Aula 036

## Identificação

- Aula original: `docs/aulas/036_M1_16_IFS_ANINHADOS_E_SIMPLIFICACAO_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/035_M1_15_IF_ELSE_IF_E_ELSE_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/037_M1_17_SWITCH_TRADICIONAL_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedNestedIfsSimplificationLesson036.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedNestedIfsSimplificationLesson.css`
- Arquétipo: oficina de refatoração condicional com animador de achatamento de escada, comparador de validações (independentes vs exclusivas) e clínica de erros
- Estado: em_revisao (aguardando implementação e aprovação)

## Fronteiras curriculares

- A Aula 035 ensinou o if básico e cadeias excludentes simples. A Aula 036 avança cobrindo desvios aninhados (if dentro de if) e técnicas profissionais de refatoração para achatar a indentação do código.
- A Aula 037 apresentará o switch-case tradicional. A Aula 036 está restrita a simplificações baseadas em álgebra booleana, acumuladores de falhas e ordenação de prioridade de bloqueios em ifs lineares.
- Embora conceitue a mentalidade de guard clauses, o uso da palavra-chave `return` para desvios de métodos é apenas sugerida e omitida da prática para manter o alinhamento com a ausência de métodos declarados nesta etapa do curso.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Anti-pattern do código "escada" (aninhamento excessivo) | Animador de Achatamento de Escada | Código com 4 níveis de indentação sofrendo achatamento visual para a esquerda. |
| Leitura pesada de camadas mentais de decisão | Animador de Achatamento de Escada | Destaque do volume de memória mental exigido para entender a escada. |
| Exemplo mínimo aninhado no Main | Galeria de Casos de Domínio | Código e console de liberação de compras. |
| Exemplo simplificado com operador && | Animador de Achatamento de Escada | Junção de ifs independentes na mesma linha via &&. |
| Quando o aninhamento faz sentido (dependência de dados) | Painel de refatoração | Casos de dependência física (ex: clienteEncontrado primeiro). |
| Exemplo ruim: pedido com 4 aninhamentos | Animador de Achatamento de Escada | Código e console da escada clássica de pedidos. |
| Pedido simplificado com regra booleana nomeada | Animador de Achatamento de Escada | Versão compilada com booleano intermediário autoexplicativo. |
| Estratégias de simplificação 1 e 2 (variáveis locais) | Painel de refatoração | Demonstração prática do uso de variáveis locais Stack autoexplicativas. |
| Estratégia 3 (validações independentes) | Validador de Erros Independentes | Simulação de inputs de cadastro falhando ao mesmo tempo. |
| Acumulador booleano de erros (possuiErro = true) | Validador de Erros Independentes | Fluxo atestando todas as falhas consecutivas na tela. |
| Estratégia 4 (else if para exclusividades) | Validador de Erros Independentes | Fluxo exibindo apenas a primeira falha ao usar else if. |
| Estratégia 5 (preparação mental para guard clauses) | Painel de refatoração | Relação com a portaria física e verificações preliminares rápidas. |
| Exemplo ClienteAninhado | Galeria de Casos de Domínio | Código e console de status de clientes. |
| Exemplo ClienteSimplificado (bloqueio ordenado) | Galeria de Casos de Domínio | Código linear contendo os desvios organizados. |
| Exemplo ClienteRegraNomeada | Galeria de Casos de Domínio | Código compactado com uma única atribuição de regra. |
| Exemplo PedidoAninhado | Galeria de Casos de Domínio | Versão com escada para pedidos. |
| Exemplo PedidoSimplificado | Galeria de Casos de Domínio | Roteamento linear de pedido com else if. |
| Exemplo PedidoRegraNomeada | Galeria de Casos de Domínio | Atribuição de regra boleana explicativa em pedidos. |
| Exemplo OrdemServicoAninhada | Galeria de Casos de Domínio | OS com aninhamentos. |
| Exemplo OrdemServicoSimplificada | Galeria de Casos de Domínio | OS com desvios lineares e bloqueios. |
| Exemplo AutorizacaoAninhada | Galeria de Casos de Domínio | Usuários e supervisores com escada. |
| Exemplo AutorizacaoSimplificada | Galeria de Casos de Domínio | Código otimizado com perfil aprovador. |
| Exemplo ClienteValidacoesIndependentes | Galeria de Casos de Domínio | Código com if separado acumulando erros de CPF, nome e e-mail. |
| Exemplo FluxoStatusSimplificado | Galeria de Casos de Domínio | Código categorizando andamento de processamentos de compras. |
| Exemplo PedidoSimplificadoConsole (com Scanner) | Galeria de Casos de Domínio | Entrada de dados interativa para testar a ordem de desvios. |
| Exemplo ClienteValidacoesConsole (com Scanner) | Galeria de Casos de Domínio | Leitura dinâmica no console acusando múltiplos erros. |
| Clínica de 10 Erros Comuns | Clínica de Erros (10 abas) | Análise detalhada das 10 falhas de escadas, perda de mensagens, nomes genéricos, etc. |
| Atividade prática local e commits | Terminal de Entrega e Diário | Setup local PowerShell, compilação de 15 classes e commit limpo. |
| Critérios de Conclusão da Aula | Gate final da Aula | Checklist objetivo de conclusão. |

## Repetições consolidadas

- Os 15 programas locais foram organizados na Galeria de Casos de Domínio, eliminando duplicações de códigos e consoles nas explicações conceituais.
- A comparação de vários ifs e de else ifs foi fundida no laboratório de validações independentes.

## Lacunas resolvidas

- O achatador visual de escada resolve de forma lúdica a barreira mental de visualizar aninhamentos complexos, demonstrando como puxar as linhas para a esquerda melhora a leitura de código.
- A demonstração da perda de mensagens específicas na simplificação excessiva evita que o aluno confunda "código menor" com "código didático e informativo".
