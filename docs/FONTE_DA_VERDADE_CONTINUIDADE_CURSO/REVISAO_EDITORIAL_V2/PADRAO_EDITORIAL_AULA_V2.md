# Padrao editorial Aula V2

Este documento define o novo formato editorial sugerido para deixar a formacao mais estudavel, pratica e coesa, sem perder profundidade tecnica.

## Decisao central

A aula principal deve ensinar.

O material complementar deve apoiar.

Portanto, cada aula revisada deve ser organizada em duas camadas:

```text
1. AULA
2. MATERIAL COMPLEMENTAR
```

## Camada 1: AULA

Esta e a parte principal da aula. Deve concentrar aquilo que o aluno precisa ler, entender, executar e versionar.

Estrutura recomendada:

```text
1. Apresentacao da aula
2. Onde estamos na formacao
3. Objetivo pratico
4. Conceito essencial
5. Mao na massa guiada
6. Entendendo o que foi feito
7. Erros comuns importantes
8. Atalhos ou comandos uteis
9. Exercicio guiado
10. Commit recomendado
11. Fechamento e ponte para a proxima aula
```

Proporcao desejada:

```text
15% contexto e conceito
60% pratica guiada
15% explicacao das decisoes e erros comuns
10% fechamento, commit e ponte
```

## Camada 2: MATERIAL COMPLEMENTAR

Esta parte deve conter o que ajuda, mas nao precisa interromper o fluxo principal da aula.

Mover para material complementar:

```text
checklists longos;
registro rapido;
perguntas de revisao;
simulados;
gabaritos;
desafios extras;
anotacoes sugeridas;
modelos de relatorio;
explicacoes repetidas;
aprofundamentos opcionais;
listas muito grandes;
referencias de consulta;
conteudo de revisao de modulo.
```

O material complementar pode existir na mesma pagina, mas deve vir depois da aula principal, com este titulo:

```md
---

# Material complementar
```

## O que nunca cortar

Nao remover:

```text
conceito essencial;
por que o assunto existe;
quando usar;
quando evitar;
como usar;
comandos necessarios;
codigo necessario;
laboratorio;
passos praticos;
erros comuns que travam o aluno;
debug ou diagnostico importante;
commit recomendado;
ponte com a aula anterior;
ponte para a proxima aula.
```

## O que pode ser reduzido

Reduzir sem medo:

```text
repeticao da mesma ideia em muitas secoes;
checklist com dezenas de itens;
registro rapido com muitas perguntas;
simulado em toda aula;
gabarito que so repete alternativa;
desafio extra que nao muda o aprendizado central;
relatorio tecnico em aula que nao precisa;
fechamento longo demais;
listas de topicos que ja foram explicados na pratica.
```

## Simulados e revisoes

Simulado nao precisa existir em toda aula.

Regra nova:

```text
aulas normais: checkpoint curto de 3 a 5 itens;
aulas praticas: criterio de aceite do laboratorio;
aulas de fechamento: simulado maior;
aulas de revisao: perguntas, gabarito e diagnostico.
```

## Checklist

Checklist deve virar checkpoint curto.

Modelo:

```md
## Checkpoint final

- [ ] Executei o laboratorio.
- [ ] Entendi o conceito central.
- [ ] Corrigi ou registrei erros encontrados.
- [ ] Fiz o commit recomendado.
```

## Topicos

Quando a ferramenta do curso exibir uma area de topicos, ela deve priorizar material complementar, nao repetir toda a aula.

Topicos devem conter:

```text
perguntas de revisao;
checkpoints;
atalhos;
comandos uteis;
erros comuns;
desafios opcionais;
links ou referencias internas;
criterios de aceite.
```

## Regra para as proximas aulas

A partir da aula 261, gerar no formato V2.

Nao deixar a aula rasa.

Nao transformar a aula em resumo.

O objetivo e reduzir atrito, nao reduzir rigor.

Cada aula ainda precisa formar mentalidade de Java Backend profissional, engenheiro e arquiteto.
