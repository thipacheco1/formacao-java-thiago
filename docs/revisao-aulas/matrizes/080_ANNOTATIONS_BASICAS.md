# Matriz de cobertura — Aula 080 — Annotations básicas

Fonte integral analisada: docs/aulas/080_M2_19_ANNOTATIONS_BASICAS_OFICIAL.md.

Implementação: GuidedBasicAnnotationsLesson080.jsx e guidedBasicAnnotationsLesson.css.

## Cobertura do conteúdo original

| Conteúdo exigido | Onde foi reconstruído | Evidência didática |
|---|---|---|
| Annotation como metadado e diferença para comentário | Etapa 1 | Pipeline código-intérprete-diagnóstico |
| @Override em classe e interface | Etapa 2 | Simulador de assinatura e código destacado |
| Erro de assinatura detectado | Etapas 1, 2 e 8 | tostring/toString e clínica |
| @Deprecated, since, forRemoval e alternativa | Etapa 3 | Linha de versões e documentação de migração |
| @SuppressWarnings específico e menor escopo | Etapa 4 | Comparador all/deprecation/unchecked |
| Annotation customizada e @interface | Etapa 5 | Anatomia com elementos obrigatório/default |
| @Retention SOURCE, CLASS e RUNTIME | Etapa 6 | Linha fonte-bytecode-runtime |
| @Target e ElementType | Etapa 6 | FIELD/TYPE contextualizados |
| getAnnotation e leitura de campo | Etapas 6 e 9 | Código reflection inicial e programa compilável |
| Annotation não executa regra sozinha | Etapas 5, 6 e 8 | Separação metadado/intérprete |
| Cliente, produto, pedido, pagamento, OS, mensageria e auditoria | Etapa 7 | Galeria de sete domínios |
| Dez erros comuns | Etapa 8 | Clínica navegável |
| Debug da leitura em runtime | Etapa 9 | Class, annotation e elemento em quatro passos |
| Atividade, comandos, evidências, desafio e Git | Etapa 9 | Programa, terminal e checklist |

## Decisões de reconstrução

- Comentário e annotation foram comparados pelo mecanismo que consegue interpretá-los.
- @Deprecated ganhou linha de migração em vez de explicação isolada.
- SuppressWarnings foi tratado como dívida localizada, não como correção.
- Retention virou percurso de sobrevivência do metadado pela compilação.
- A leitura em runtime permanece introdutória; reflection profunda fica para a aula seguinte.
- Layout, código e clínica são responsivos até 320 px.

Cobertura: 100%.

Pendente: inspeção visual do usuário e aprovação explícita.
