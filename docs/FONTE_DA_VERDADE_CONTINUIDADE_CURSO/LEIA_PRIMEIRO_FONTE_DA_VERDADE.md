# Leia primeiro - Fonte da verdade da continuidade

Esta pasta existe para abrir um novo chat e continuar a formacao Java Backend sem perder sequencia, nomes, diretorios, profundidade ou raciocinio pedagogico.

O ponto atual validado e:

```text
Ultima aula real gerada: 387
Proxima aula a gerar: 388
Modulo atual: M14
Tema do M14: Spring Boot, REST APIs e backend profissional
Proxima aula: Cache com Spring Redis
```

## Ordem de leitura obrigatoria

O novo chat deve ler nesta ordem:

```text
1. ORDEM_DE_ENVIO_AO_CHAT.md
2. LEIA_PRIMEIRO_FONTE_DA_VERDADE.md
3. PROMPT_MESTRE_CONTINUAR_CURSO_JAVA.md
4. ROTEIRO_OPERACIONAL_RECONSTRUIDO_COMPLETO.md
5. GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_387.csv
6. 387_M14_32_ASYNC_NO_SPRING_OFICIAL.md
7. REVISAO_EDITORIAL_V2/PADRAO_EDITORIAL_AULA_V2.md
8. ANALISE_GRADES_E_ROTEIRO_CONTINUIDADE_POS_259.md
```

## Estado validado do curso

```text
Pasta fonte real das aulas: docs/aulas
Aulas reais ja geradas: 000 a 387
Total de aulas reais: 388
Ultima aula real: 387
Proxima aula: 388
Modulo atual da continuidade: M14
Modulo anterior concluido: M13
Grade operacional atualizada: 000 a 720
Total na grade atualizada: 721 linhas
Aulas concluidas na grade atualizada: 388
Aulas planejadas na grade atualizada: 333
Numeros faltando em docs/aulas: nenhum
Numeros duplicados em docs/aulas: nenhum
```

## Ultima aula real

```text
Arquivo:
387_M14_32_ASYNC_NO_SPRING_OFICIAL.md

H1:
# 387 - M14.32 - Async no Spring
```

Essa aula fechou o assunto de execucao assincrona com Spring:

```text
@EnableAsync;
@Async por proxy;
self-invocation;
executor nomeado e limitado;
ThreadPoolTaskExecutor;
pool, queue, rejection e shutdown;
TaskDecorator com MDC;
AsyncUncaughtExceptionHandler;
CompletableFuture;
transaction REQUIRES_NEW no worker;
bridge AFTER_COMMIT;
tasks em memoria nao duraveis;
sem Redis, sem cache, sem broker e sem outbox.
```

## Proxima aula obrigatoria

```text
Arquivo:
388_M14_33_CACHE_COM_SPRING_REDIS_OFICIAL.md

H1:
# 388 - M14.33 - Cache com Spring Redis

Modulo:
M14 - Spring Boot, REST APIs e backend profissional

Projeto:
formacao-java-backend-api
```

## Regras que nao podem ser quebradas

- Nao reescrever aulas antigas.
- Nao renomear arquivos antigos.
- Nao mudar numeracao.
- Nao voltar para a aula 271.
- Nao voltar para M12.
- Nao voltar para M13.
- Nao tratar a aula 356 como ultimo ponto.
- Nao tratar a aula 270 como ultimo ponto.
- Nao pular a aula 388.
- Nao gerar rate limiting antes da aula 389.
- Nao antecipar upload/download, scheduler, email, testes, Docker da API, projeto final do modulo ou observabilidade avancada.
- Nao transformar cache em fila, mensageria, outbox, scheduler, lock distribuido ou arquitetura distribuida completa.
- Gerar uma aula por vez.
- Ler a aula anterior antes de gerar a proxima.
- Usar `docs/aulas` como fonte da verdade das aulas ja geradas.
- Usar `GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_387.csv` como roteiro operacional das aulas futuras.

## Regra editorial atual

Continuar usando o Padrao Editorial Aula V2.

Objetivo:

```text
manter profundidade tecnica;
reduzir repeticao;
deixar a aula principal mais estudavel;
separar checklists, perguntas, desafios e simulados em material complementar;
evitar excesso de paragrafos de uma linha;
nao cortar conteudo necessario para formar backend senior/arquiteto.
```

## Texto curto para mandar ao novo chat

```text
Estou anexando a pasta FONTE_DA_VERDADE_CONTINUIDADE_CURSO.

Leia primeiro ORDEM_DE_ENVIO_AO_CHAT.md e LEIA_PRIMEIRO_FONTE_DA_VERDADE.md.
Depois leia PROMPT_MESTRE_CONTINUAR_CURSO_JAVA.md, ROTEIRO_OPERACIONAL_RECONSTRUIDO_COMPLETO.md, GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_387.csv, a aula 387 e o PADRAO_EDITORIAL_AULA_V2.

Voce deve continuar a formacao Java Backend exatamente da aula 388.

Nao reescreva aulas antigas.
Nao renumere.
Nao mude modulos.
Nao volte para M12 ou M13.
Nao pule para rate limiting, upload/download, scheduler, email, testes, Docker de API ou projeto final.

Gere somente a aula 388 quando eu enviar GERAR_AULA_388.
```
