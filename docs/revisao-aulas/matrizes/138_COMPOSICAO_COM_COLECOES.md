# Matriz de cobertura — Aula 138 — Composição com coleções

## Fontes auditadas

- `docs/aulas/138_M4_34_COMPOSICAO_COM_COLECOES_OFICIAL.md`
- Aula anterior: proteção estrutural de coleções, cópia defensiva e consultas mínimas.
- Fronteira seguinte: `139_M4_35_AGREGADOS_INICIAL_OFICIAL.md` tratará raiz e unidade de consistência; aqui o foco é propriedade e ciclo de vida do filho.

## Promessa pedagógica

O aluno deve distinguir associação de composição por evidências de ciclo de vida, reproduzir o defeito de um filho mutável compartilhado, fazer o pai criar e controlar seus filhos e usar fronteiras de pacote, coleções protegidas e operações de domínio sem transformar toda relação em composição.

## Cobertura obrigatória

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Filho compartilhado indevidamente | Dois Pedidos apontam para o mesmo item e mudam juntos | Etapa 1 |
| Associação versus composição | Classificador pelas seis perguntas de ciclo de vida | Etapa 2 |
| Pai controla criação e entrada | Diagrama App → Pedido → ItemPedido → coleção | Etapa 3 |
| Construtor package-private | Mock de compilador bloqueando `new ItemPedido` no pacote `app` | Etapa 4 |
| Pedido compõe ItemPedido e associa Cliente | Oficina executável com pagamento e total | Etapa 5 |
| Contrato compõe ServicoContrato | Oficina com criação, remoção, duplicidade e ativação | Etapa 6 |
| OS compõe OcorrenciaOs | Linha do tempo criada somente por ações reais da OS | Etapa 7 |
| Identidade, remoção, histórico e filhos mutáveis | Laboratório de decisões de propriedade | Etapa 8 |
| Debug recomendado | Mock de IntelliJ com doze paradas e identidade observável | Etapa 9 |
| Oito erros comuns | Clínica com sintoma, consequência e correção | Etapa 10 |
| Desafio Checklist | Checklist cria e controla PerguntaChecklist package-private | Etapa 11 |

## Decisões pedagógicas

1. O defeito é de identidade compartilhada, não apenas de lista exposta: a mesma referência de filho afeta dois pais.
2. `Cliente` acompanha `Pedido` nos diagramas para provar que “ter um objeto” não significa ser dono dele.
3. A barreira package-private é demonstrada por uma compilação que deve falhar fora do pacote.
4. O pai recebe dados para criar o filho; o app não entrega um filho pronto.
5. Filhos não possuem setters livres e a coleção continua retornando `List.copyOf`.
6. Remoção é tratada como decisão do ciclo de vida; histórico não oferece remoção pública.
7. Agregado aparece somente como ponte da próxima aula, sem antecipar raiz, repositório ou transação.

## Critérios de aceite técnico

- 11 etapas concluíveis e reversíveis com avanço bloqueado.
- 23 fontes Java compiladas em conjunto.
- 6 execuções reais e uma compilação negativa esperada; suíte final imprime `12 testes passaram`.
- 8 casos completos na Clínica de Erros.
- Código destacado, saídas, diagramas de propriedade, barreira de pacote e mock de IDE.
- Layout responsivo e foco móvel na etapa ativa.
