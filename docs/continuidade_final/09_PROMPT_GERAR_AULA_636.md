# Prompt para gerar a aula 636

Use este prompt somente depois que o novo chat confirmar que entendeu a fonte da verdade.

Comando:

```text
GERAR_AULA_636
```

Prompt:

```text
Gere somente a aula 636.

Arquivo exato:
636_M19_26_PACELC_OFICIAL.md

H1 exato:
# 636 - M19.26 - PACELC

Modulo:
M19 - Arquitetura, DDD, sistemas distribuidos e lideranca tecnica

Contexto anterior:
634_M19_24_CONSISTENCIA_EVENTUAL_OFICIAL.md
635_M19_25_CAP_OFICIAL.md

A aula 634 tratou de consistencia eventual.
A aula 635 tratou de CAP.

A aula 635 deixa claro que a aula 636 deve tratar:
- PACELC;
- classificacoes PC/PA/EL/EC;
- trade-offs de latencia em operacao normal;
- relacao entre particionamento, consistencia, disponibilidade e latencia;
- decisao por operacao, dado e risco.

Objetivo da aula:
ensinar PACELC como extensao operacional do raciocinio de CAP, mostrando que mesmo quando nao ha particao, a arquitetura ainda escolhe entre latencia e consistencia.

Escopo esperado:
- revisar CAP rapidamente, sem reensinar a aula 635 inteira;
- explicar PACELC;
- explicar P, A, C, E, L, C no modelo;
- diferenciar decisao durante particao e decisao em operacao normal;
- explicar PC/PA e EL/EC;
- mostrar exemplos de leitura, escrita, confirmacao, dashboard e consulta no dominio Service Scheduling;
- construir um laboratorio coerente com o laboratorio de CAP, se houver pratica;
- criar evidencias, matriz de decisao e gate;
- mostrar erros comuns de interpretacao;
- recomendar commit quando houver laboratorio;
- fechar com ponte para 637 - Idempotencia avancada.

Nao fazer:
- nao repetir CAP inteiro;
- nao antecipar idempotencia avancada da aula 637;
- nao aprofundar multi tenancy da aula 638;
- nao transformar a aula em resumo teorico raso;
- nao gerar aula 637;
- nao mudar numeracao;
- nao mudar modulo.

Formato:
- seguir PADRAO_EDITORIAL_AULA_V2;
- aula principal focada em aprender, executar e entender;
- material complementar separado;
- codigo copiavel;
- nao quebrar package/import em duas linhas;
- nao colocar linha iniciada por ## dentro de bloco de codigo;
- evitar excesso de paragrafos de uma linha;
- manter profundidade de engenharia/arquiteto.

Tamanho alvo:
4.800 a 5.900 palavras.

Gere a aula completa em Markdown.
```
