# Formato oficial das aulas

Este formato vale para a aula 398 recuperada e para todas as aulas seguintes.

## Estrutura obrigatoria

Cada aula deve manter, nessa ordem aproximada:

```text
# NUMERO - CODIGO - Titulo

## Apresentacao da aula
## Onde estamos na formacao
## Objetivo pratico
## Conceito essencial
## Mao na massa guiada
## Entendendo o que foi feito
## Erros comuns importantes
## Comandos uteis
## Exercicio guiado
## Criterios de aceite
## Commit recomendado
## Fechamento e ponte para a proxima aula

# Material complementar
## Checkpoint final
## Troubleshooting adicional
## Perguntas de revisao
## Roteiro de resposta
## Atualizacao do diario de bordo
## Referencia tecnica curta
```

Nem toda aula precisa ter todas as secoes com o mesmo tamanho, mas a aula principal deve ser o centro.

## Regra editorial

A aula principal deve ensinar, executar e fazer o aluno entender.

O material complementar deve conter:

```text
checkpoints;
troubleshooting;
perguntas;
roteiro de resposta;
observacoes extras.
```

Nao transformar a aula principal em checklist gigante.

Nao transformar toda aula em simulado longo.

Nao encher a aula de listas que nao viram pratica.

## Tamanho recomendado

Faixa ideal:

```text
4.800 a 5.800 palavras
```

Pode passar um pouco quando o tema exigir, mas nao deve virar um mini-livro.

## Codigo

Todo bloco de codigo deve ser copiavel.

Regra importante:

```text
Nao quebrar package em duas linhas.
Nao quebrar import em duas linhas.
Nao colocar linha iniciada por ## dentro de bloco de codigo.
```

Errado:

```java
package br.com.formacao.backend.application
        .managedmessage.cache;
```

Certo:

```java
package br.com.formacao.backend.application.managedmessage.cache;
```

Errado:

```java
import org.springframework.transaction.annotation
        .Transactional;
```

Certo:

```java
import org.springframework.transaction.annotation.Transactional;
```

## Escopo

Cada aula deve respeitar o tema da vez.

Nao antecipar aulas futuras.

Pode citar que um assunto vira depois, mas nao implementar antes da hora.

## Commits

Quando houver pratica de projeto, a aula deve terminar com commit recomendado.

Exemplo:

```powershell
git status
git diff
git diff --check
git add <arquivos>
git commit -m "feat(modulo): descricao curta"
```

## Ponte

Toda aula deve terminar dizendo qual e a proxima aula e por que ela vem depois.

A ponte nao pode mudar o roteiro.
