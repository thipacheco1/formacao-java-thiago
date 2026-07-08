# 169 — M5.24 — Exercícios integradores Collections: implementação guiada

## Objetivo da aula

Nesta aula você vai implementar um fluxo maior usando várias estruturas do Java Collections Framework.

Na aula anterior, o foco foi:

```text
ler requisitos;
escolher estruturas;
justificar tecnicamente a escolha.
```

Agora o foco será:

```text
implementar um fluxo guiado de importação, validação, agrupamento, fila e relatório.
```

Você vai construir um mini-processador de importação de OS.

Ele receberá linhas de importação, validará os dados, separará erros, identificará duplicidades, agrupará registros e montará filas de processamento.

Ao final da aula, você deve conseguir:

```text
criar objetos de entrada de importação;
validar dados antes de transformar em domínio;
usar List para entrada original;
usar LinkedHashMap para registros válidos por código;
usar HashSet para detectar duplicidade;
usar LinkedHashSet para duplicados preservando ordem;
usar TreeSet para códigos ordenados;
usar Map com List para agrupamento;
usar Map com Integer para contagem;
usar Queue com ArrayDeque para processamento FIFO;
usar PriorityQueue para processamento por prioridade;
usar Comparator com múltiplos critérios;
proteger retornos com List.copyOf;
separar domínio, infraestrutura e app;
debugar um fluxo com várias coleções trabalhando juntas.
```

Esta aula é uma ponte importante entre exercícios isolados e projetos maiores.

---

## Ideia do fluxo

Vamos simular uma importação de OS.

Cada linha importada terá:

```text
número da linha;
código da OS;
cliente;
data de entrada;
prioridade;
status.
```

O processador deverá gerar:

```text
linhas originais;
registros válidos;
erros de validação;
duplicados;
códigos ordenados;
agrupamento por prioridade;
contagem por status;
ordem de processamento FIFO;
ordem de processamento por prioridade.
```

---

## Por que este exercício é importante

Em backend real, você raramente usa uma coleção isolada.

Um fluxo de importação pode precisar de:

```text
List para manter entrada;
Set para detectar duplicidade;
Map para indexar;
Map com List para agrupar;
Queue para processar;
PriorityQueue para priorizar;
Comparator para ordenar;
TreeSet para relatórios ordenados.
```

A competência está em combinar essas estruturas sem virar bagunça.

---

## Decisão técnica antes do código

Antes de implementar, vamos mapear a intenção.

```text
Entrada original:
List<LinhaImportacaoOs>

Registros válidos por código:
LinkedHashMap<CodigoOs, RegistroImportacaoOs>

Detecção de duplicidade:
HashSet<CodigoOs>

Duplicados detectados:
LinkedHashSet<CodigoOs> ou List<RegistroImportacaoOs>

Códigos ordenados:
TreeSet<CodigoOs>

Agrupamento por prioridade:
Map<PrioridadeAtendimento, List<RegistroImportacaoOs>>

Contagem por status:
Map<StatusAtendimento, Integer>

Fila FIFO:
Queue<RegistroImportacaoOs> com ArrayDeque

Fila prioritária:
PriorityQueue<RegistroImportacaoOs>

Critério da fila prioritária:
Comparator por prioridade, data e código
```

Perceba que cada coleção tem um motivo.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-169-exercicios-integradores-collections-implementacao-guiada
cd labs\m5\aula-169-exercicios-integradores-collections-implementacao-guiada
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula169
mkdir src\br\com\curso\aula169\app
mkdir src\br\com\curso\aula169\dominio
mkdir src\br\com\curso\aula169\dominio\valor
mkdir src\br\com\curso\aula169\dominio\importacao
mkdir src\br\com\curso\aula169\infra
```

---

## Objeto de valor CodigoOs

Crie:

```text
src\br\com\curso\aula169\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula169.dominio.valor;

import java.util.Objects;

public final class CodigoOs implements Comparable<CodigoOs> {
    private final String valor;

    public CodigoOs(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código da OS é obrigatório.");
        }

        String normalizado = valor.trim().toUpperCase();

        if (!normalizado.startsWith("OS-")) {
            throw new IllegalArgumentException("Código da OS deve iniciar com OS-.");
        }

        this.valor = normalizado;
    }

    public String valor() {
        return valor;
    }

    public String resumo() {
        return valor;
    }

    @Override
    public int compareTo(CodigoOs outro) {
        return this.valor.compareTo(outro.valor);
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof CodigoOs codigoOs)) {
            return false;
        }

        return Objects.equals(valor, codigoOs.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
```

---

## O papel do CodigoOs

O `CodigoOs` será usado como:

```text
chave de Map;
elemento de Set;
elemento de TreeSet;
critério de desempate na PriorityQueue.
```

Por isso ele precisa ter:

```text
equals;
hashCode;
Comparable.
```

Sem isso, as coleções não funcionariam corretamente.

---

## Enums do fluxo

Crie:

```text
src\br\com\curso\aula169\dominio\importacao\PrioridadeAtendimento.java
```

Código:

```java
package br.com.curso.aula169.dominio.importacao;

public enum PrioridadeAtendimento {
    BAIXA,
    NORMAL,
    ALTA,
    CRITICA
}
```

Crie:

```text
src\br\com\curso\aula169\dominio\importacao\StatusAtendimento.java
```

Código:

```java
package br.com.curso.aula169.dominio.importacao;

public enum StatusAtendimento {
    CADASTRADA,
    ENFILEIRADA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA
}
```

---

## Linha bruta de importação

A linha de importação representa dados que vieram de fora.

Ela ainda não é um registro válido do domínio.

Crie:

```text
src\br\com\curso\aula169\dominio\importacao\LinhaImportacaoOs.java
```

Código:

```java
package br.com.curso.aula169.dominio.importacao;

import java.time.LocalDateTime;

public class LinhaImportacaoOs {
    private final int numero;
    private final String codigoTexto;
    private final String cliente;
    private final LocalDateTime dataEntrada;
    private final String prioridadeTexto;
    private final String statusTexto;

    public LinhaImportacaoOs(
            int numero,
            String codigoTexto,
            String cliente,
            LocalDateTime dataEntrada,
            String prioridadeTexto,
            String statusTexto
    ) {
        if (numero <= 0) {
            throw new IllegalArgumentException("Número da linha deve ser positivo.");
        }

        if (dataEntrada == null) {
            throw new IllegalArgumentException("Data de entrada da linha é obrigatória.");
        }

        this.numero = numero;
        this.codigoTexto = codigoTexto;
        this.cliente = cliente;
        this.dataEntrada = dataEntrada;
        this.prioridadeTexto = prioridadeTexto;
        this.statusTexto = statusTexto;
    }

    public int numero() {
        return numero;
    }

    public String codigoTexto() {
        return codigoTexto;
    }

    public String cliente() {
        return cliente;
    }

    public LocalDateTime dataEntrada() {
        return dataEntrada;
    }

    public String prioridadeTexto() {
        return prioridadeTexto;
    }

    public String statusTexto() {
        return statusTexto;
    }

    public String resumo() {
        return "Linha " + numero
                + " | Código: " + codigoTexto
                + " | Cliente: " + cliente
                + " | Data: " + dataEntrada
                + " | Prioridade: " + prioridadeTexto
                + " | Status: " + statusTexto;
    }
}
```

---

## Por que separar linha bruta de registro válido

Dados externos podem vir errados.

Exemplos:

```text
código vazio;
código com prefixo inválido;
cliente em branco;
prioridade inexistente;
status inexistente.
```

Se tentarmos transformar tudo diretamente em objeto válido, o fluxo fica confuso.

Por isso usamos duas etapas:

```text
LinhaImportacaoOs:
representa o que veio de fora.

RegistroImportacaoOs:
representa dado validado.
```

---

## Registro de importação validado

Crie:

```text
src\br\com\curso\aula169\dominio\importacao\RegistroImportacaoOs.java
```

Código:

```java
package br.com.curso.aula169.dominio.importacao;

import br.com.curso.aula169.dominio.valor.CodigoOs;

import java.time.LocalDateTime;

public class RegistroImportacaoOs {
    private final int linhaOrigem;
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDateTime dataEntrada;
    private final PrioridadeAtendimento prioridade;
    private final StatusAtendimento status;

    public RegistroImportacaoOs(
            int linhaOrigem,
            CodigoOs codigo,
            String cliente,
            LocalDateTime dataEntrada,
            PrioridadeAtendimento prioridade,
            StatusAtendimento status
    ) {
        if (linhaOrigem <= 0) {
            throw new IllegalArgumentException("Linha de origem deve ser positiva.");
        }

        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (dataEntrada == null) {
            throw new IllegalArgumentException("Data de entrada é obrigatória.");
        }

        if (prioridade == null) {
            throw new IllegalArgumentException("Prioridade é obrigatória.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.linhaOrigem = linhaOrigem;
        this.codigo = codigo;
        this.cliente = cliente.trim();
        this.dataEntrada = dataEntrada;
        this.prioridade = prioridade;
        this.status = status;
    }

    public int linhaOrigem() {
        return linhaOrigem;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public LocalDateTime dataEntrada() {
        return dataEntrada;
    }

    public PrioridadeAtendimento prioridade() {
        return prioridade;
    }

    public StatusAtendimento status() {
        return status;
    }

    public String resumo() {
        return "Linha " + linhaOrigem
                + " | " + codigo.resumo()
                + " | Cliente: " + cliente
                + " | Data: " + dataEntrada
                + " | Prioridade: " + prioridade
                + " | Status: " + status;
    }
}
```

---

## Erro de importação

Crie:

```text
src\br\com\curso\aula169\dominio\importacao\ErroImportacao.java
```

Código:

```java
package br.com.curso.aula169.dominio.importacao;

public class ErroImportacao {
    private final int linha;
    private final String codigoTexto;
    private final String motivo;

    public ErroImportacao(int linha, String codigoTexto, String motivo) {
        if (linha <= 0) {
            throw new IllegalArgumentException("Linha deve ser positiva.");
        }

        if (motivo == null || motivo.isBlank()) {
            throw new IllegalArgumentException("Motivo do erro é obrigatório.");
        }

        this.linha = linha;
        this.codigoTexto = codigoTexto;
        this.motivo = motivo;
    }

    public int linha() {
        return linha;
    }

    public String codigoTexto() {
        return codigoTexto;
    }

    public String motivo() {
        return motivo;
    }

    public String resumo() {
        return "Linha " + linha
                + " | Código: " + codigoTexto
                + " | Erro: " + motivo;
    }
}
```

---

## Resultado da importação

Agora vamos criar uma classe para carregar o resultado do processamento.

Crie:

```text
src\br\com\curso\aula169\infra\ResultadoProcessamentoImportacaoOs.java
```

Código:

```java
package br.com.curso.aula169.infra;

import br.com.curso.aula169.dominio.importacao.ErroImportacao;
import br.com.curso.aula169.dominio.importacao.LinhaImportacaoOs;
import br.com.curso.aula169.dominio.importacao.PrioridadeAtendimento;
import br.com.curso.aula169.dominio.importacao.RegistroImportacaoOs;
import br.com.curso.aula169.dominio.importacao.StatusAtendimento;
import br.com.curso.aula169.dominio.valor.CodigoOs;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

public class ResultadoProcessamentoImportacaoOs {
    private final List<LinhaImportacaoOs> linhasOriginais;
    private final List<RegistroImportacaoOs> validos;
    private final List<RegistroImportacaoOs> duplicados;
    private final List<ErroImportacao> erros;
    private final Set<CodigoOs> codigosOrdenados;
    private final Map<PrioridadeAtendimento, List<RegistroImportacaoOs>> agrupadasPorPrioridade;
    private final Map<StatusAtendimento, Integer> contagemPorStatus;
    private final List<RegistroImportacaoOs> processamentoFifo;
    private final List<RegistroImportacaoOs> processamentoPrioridade;

    public ResultadoProcessamentoImportacaoOs(
            List<LinhaImportacaoOs> linhasOriginais,
            List<RegistroImportacaoOs> validos,
            List<RegistroImportacaoOs> duplicados,
            List<ErroImportacao> erros,
            Set<CodigoOs> codigosOrdenados,
            Map<PrioridadeAtendimento, List<RegistroImportacaoOs>> agrupadasPorPrioridade,
            Map<StatusAtendimento, Integer> contagemPorStatus,
            List<RegistroImportacaoOs> processamentoFifo,
            List<RegistroImportacaoOs> processamentoPrioridade
    ) {
        this.linhasOriginais = List.copyOf(linhasOriginais);
        this.validos = List.copyOf(validos);
        this.duplicados = List.copyOf(duplicados);
        this.erros = List.copyOf(erros);
        this.codigosOrdenados = new TreeSet<>(codigosOrdenados);
        this.agrupadasPorPrioridade = copiarAgrupamento(agrupadasPorPrioridade);
        this.contagemPorStatus = new LinkedHashMap<>(contagemPorStatus);
        this.processamentoFifo = List.copyOf(processamentoFifo);
        this.processamentoPrioridade = List.copyOf(processamentoPrioridade);
    }

    public List<LinhaImportacaoOs> linhasOriginais() {
        return linhasOriginais;
    }

    public List<RegistroImportacaoOs> validos() {
        return validos;
    }

    public List<RegistroImportacaoOs> duplicados() {
        return duplicados;
    }

    public List<ErroImportacao> erros() {
        return erros;
    }

    public Set<CodigoOs> codigosOrdenados() {
        return new TreeSet<>(codigosOrdenados);
    }

    public Map<PrioridadeAtendimento, List<RegistroImportacaoOs>> agrupadasPorPrioridade() {
        return copiarAgrupamento(agrupadasPorPrioridade);
    }

    public Map<StatusAtendimento, Integer> contagemPorStatus() {
        return new LinkedHashMap<>(contagemPorStatus);
    }

    public List<RegistroImportacaoOs> processamentoFifo() {
        return processamentoFifo;
    }

    public List<RegistroImportacaoOs> processamentoPrioridade() {
        return processamentoPrioridade;
    }

    public int quantidadeLinhas() {
        return linhasOriginais.size();
    }

    public int quantidadeValidos() {
        return validos.size();
    }

    public int quantidadeDuplicados() {
        return duplicados.size();
    }

    public int quantidadeErros() {
        return erros.size();
    }

    private static Map<PrioridadeAtendimento, List<RegistroImportacaoOs>> copiarAgrupamento(
            Map<PrioridadeAtendimento, List<RegistroImportacaoOs>> origem
    ) {
        Map<PrioridadeAtendimento, List<RegistroImportacaoOs>> copia = new LinkedHashMap<>();

        for (Map.Entry<PrioridadeAtendimento, List<RegistroImportacaoOs>> entrada : origem.entrySet()) {
            copia.put(entrada.getKey(), List.copyOf(entrada.getValue()));
        }

        return copia;
    }
}
```

---

## Por que ResultadoProcessamentoImportacaoOs é importante

Essa classe evita retornar um monte de variáveis soltas.

Ela organiza o resultado do processamento.

Também protege as coleções com cópias:

```text
List.copyOf;
new TreeSet;
new LinkedHashMap.
```

Isso evita que quem recebe o resultado altere o estado interno sem controle.

---

## Ordenação de atendimento

Crie:

```text
src\br\com\curso\aula169\infra\OrdenacaoImportacaoOs.java
```

Código:

```java
package br.com.curso.aula169.infra;

import br.com.curso.aula169.dominio.importacao.PrioridadeAtendimento;
import br.com.curso.aula169.dominio.importacao.RegistroImportacaoOs;

import java.util.Comparator;

public final class OrdenacaoImportacaoOs {
    private OrdenacaoImportacaoOs() {
    }

    public static Comparator<RegistroImportacaoOs> prioridadeDataCodigo() {
        return Comparator.comparingInt((RegistroImportacaoOs registro) -> pesoPrioridade(registro.prioridade()))
                .thenComparing(RegistroImportacaoOs::dataEntrada)
                .thenComparing(RegistroImportacaoOs::codigo);
    }

    private static int pesoPrioridade(PrioridadeAtendimento prioridade) {
        return switch (prioridade) {
            case CRITICA -> 1;
            case ALTA -> 2;
            case NORMAL -> 3;
            case BAIXA -> 4;
        };
    }
}
```

---

## Processador da importação

Agora vem a classe principal da aula.

Crie:

```text
src\br\com\curso\aula169\infra\ProcessadorImportacaoOsMemoria.java
```

Código:

```java
package br.com.curso.aula169.infra;

import br.com.curso.aula169.dominio.importacao.ErroImportacao;
import br.com.curso.aula169.dominio.importacao.LinhaImportacaoOs;
import br.com.curso.aula169.dominio.importacao.PrioridadeAtendimento;
import br.com.curso.aula169.dominio.importacao.RegistroImportacaoOs;
import br.com.curso.aula169.dominio.importacao.StatusAtendimento;
import br.com.curso.aula169.dominio.valor.CodigoOs;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Set;
import java.util.TreeSet;

public class ProcessadorImportacaoOsMemoria {
    public ResultadoProcessamentoImportacaoOs processar(List<LinhaImportacaoOs> linhas) {
        if (linhas == null) {
            throw new IllegalArgumentException("Linhas de importação são obrigatórias.");
        }

        List<LinhaImportacaoOs> linhasOriginais = new ArrayList<>(linhas);
        Map<CodigoOs, RegistroImportacaoOs> validosPorCodigo = new LinkedHashMap<>();
        Set<CodigoOs> vistos = new HashSet<>();
        Set<CodigoOs> codigosOrdenados = new TreeSet<>();
        Set<CodigoOs> codigosDuplicados = new LinkedHashSet<>();
        List<RegistroImportacaoOs> duplicados = new ArrayList<>();
        List<ErroImportacao> erros = new ArrayList<>();

        for (LinhaImportacaoOs linha : linhas) {
            if (linha == null) {
                erros.add(new ErroImportacao(1, null, "Linha nula não é permitida."));
                continue;
            }

            try {
                RegistroImportacaoOs registro = converter(linha);

                boolean novo = vistos.add(registro.codigo());

                if (!novo) {
                    codigosDuplicados.add(registro.codigo());
                    duplicados.add(registro);
                    erros.add(new ErroImportacao(
                            linha.numero(),
                            linha.codigoTexto(),
                            "Código duplicado na importação"
                    ));
                    continue;
                }

                validosPorCodigo.put(registro.codigo(), registro);
                codigosOrdenados.add(registro.codigo());
            } catch (IllegalArgumentException erro) {
                erros.add(new ErroImportacao(
                        linha.numero(),
                        linha.codigoTexto(),
                        erro.getMessage()
                ));
            }
        }

        List<RegistroImportacaoOs> validos = new ArrayList<>(validosPorCodigo.values());

        return new ResultadoProcessamentoImportacaoOs(
                linhasOriginais,
                validos,
                duplicados,
                erros,
                codigosOrdenados,
                agruparPorPrioridade(validos),
                contarPorStatus(validos),
                processarFifo(validos),
                processarPorPrioridade(validos)
        );
    }

    private RegistroImportacaoOs converter(LinhaImportacaoOs linha) {
        CodigoOs codigo = new CodigoOs(linha.codigoTexto());
        PrioridadeAtendimento prioridade = converterPrioridade(linha.prioridadeTexto());
        StatusAtendimento status = converterStatus(linha.statusTexto());

        return new RegistroImportacaoOs(
                linha.numero(),
                codigo,
                linha.cliente(),
                linha.dataEntrada(),
                prioridade,
                status
        );
    }

    private PrioridadeAtendimento converterPrioridade(String texto) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Prioridade é obrigatória.");
        }

        try {
            return PrioridadeAtendimento.valueOf(texto.trim().toUpperCase());
        } catch (IllegalArgumentException erro) {
            throw new IllegalArgumentException("Prioridade inválida: " + texto);
        }
    }

    private StatusAtendimento converterStatus(String texto) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        try {
            return StatusAtendimento.valueOf(texto.trim().toUpperCase());
        } catch (IllegalArgumentException erro) {
            throw new IllegalArgumentException("Status inválido: " + texto);
        }
    }

    private Map<PrioridadeAtendimento, List<RegistroImportacaoOs>> agruparPorPrioridade(
            List<RegistroImportacaoOs> registros
    ) {
        Map<PrioridadeAtendimento, List<RegistroImportacaoOs>> agrupamento = new LinkedHashMap<>();

        for (PrioridadeAtendimento prioridade : PrioridadeAtendimento.values()) {
            agrupamento.put(prioridade, new ArrayList<>());
        }

        for (RegistroImportacaoOs registro : registros) {
            agrupamento.get(registro.prioridade()).add(registro);
        }

        return agrupamento;
    }

    private Map<StatusAtendimento, Integer> contarPorStatus(List<RegistroImportacaoOs> registros) {
        Map<StatusAtendimento, Integer> contagem = new LinkedHashMap<>();

        for (StatusAtendimento status : StatusAtendimento.values()) {
            contagem.put(status, 0);
        }

        for (RegistroImportacaoOs registro : registros) {
            contagem.merge(registro.status(), 1, Integer::sum);
        }

        return contagem;
    }

    private List<RegistroImportacaoOs> processarFifo(List<RegistroImportacaoOs> registros) {
        Queue<RegistroImportacaoOs> fila = new ArrayDeque<>(registros);
        List<RegistroImportacaoOs> processados = new ArrayList<>();

        while (!fila.isEmpty()) {
            processados.add(fila.poll());
        }

        return processados;
    }

    private List<RegistroImportacaoOs> processarPorPrioridade(List<RegistroImportacaoOs> registros) {
        Queue<RegistroImportacaoOs> fila = new PriorityQueue<>(OrdenacaoImportacaoOs.prioridadeDataCodigo());

        fila.addAll(registros);

        List<RegistroImportacaoOs> processados = new ArrayList<>();

        while (!fila.isEmpty()) {
            processados.add(fila.poll());
        }

        return processados;
    }
}
```

---

## Atenção ao detalhe da linha nula

Neste trecho:

```java
if (linha == null) {
    erros.add(new ErroImportacao(1, null, "Linha nula não é permitida."));
    continue;
}
```

Estamos usando linha `1` como fallback porque uma referência nula não possui número de linha.

Em um sistema real, isso poderia ser tratado antes, no parser da importação.

O objetivo aqui é manter o fluxo simples.

---

## O que o processador usa

A classe `ProcessadorImportacaoOsMemoria` usa:

```text
ArrayList:
linhas originais, válidos, duplicados, erros e processados.

LinkedHashMap:
válidos por código mantendo ordem de importação.

HashSet:
vistos para detectar duplicidade.

LinkedHashSet:
códigos duplicados preservando ordem de detecção.

TreeSet:
códigos ordenados.

LinkedHashMap + List:
agrupamento por prioridade.

LinkedHashMap + Integer:
contagem por status.

ArrayDeque:
processamento FIFO.

PriorityQueue:
processamento por prioridade.
```

Esse é o coração da aula.

---

## App principal do fluxo guiado

Crie:

```text
src\br\com\curso\aula169\app\FluxoImportacaoValidacaoAgrupamentoApp.java
```

Código:

```java
package br.com.curso.aula169.app;

import br.com.curso.aula169.dominio.importacao.ErroImportacao;
import br.com.curso.aula169.dominio.importacao.LinhaImportacaoOs;
import br.com.curso.aula169.dominio.importacao.PrioridadeAtendimento;
import br.com.curso.aula169.dominio.importacao.RegistroImportacaoOs;
import br.com.curso.aula169.dominio.importacao.StatusAtendimento;
import br.com.curso.aula169.dominio.valor.CodigoOs;
import br.com.curso.aula169.infra.ProcessadorImportacaoOsMemoria;
import br.com.curso.aula169.infra.ResultadoProcessamentoImportacaoOs;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class FluxoImportacaoValidacaoAgrupamentoApp {
    public static void main(String[] args) {
        List<LinhaImportacaoOs> linhas = criarLinhas();

        ProcessadorImportacaoOsMemoria processador = new ProcessadorImportacaoOsMemoria();

        ResultadoProcessamentoImportacaoOs resultado = processador.processar(linhas);

        imprimirLinhasOriginais(resultado);
        imprimirErros(resultado);
        imprimirValidos(resultado);
        imprimirDuplicados(resultado);
        imprimirCodigosOrdenados(resultado);
        imprimirAgrupamentoPorPrioridade(resultado);
        imprimirContagemPorStatus(resultado);
        imprimirProcessamentoFifo(resultado);
        imprimirProcessamentoPorPrioridade(resultado);
        imprimirResumoFinal(resultado);
    }

    private static List<LinhaImportacaoOs> criarLinhas() {
        return List.of(
                new LinhaImportacaoOs(
                        1,
                        "OS-2026-0003",
                        "Mariana Lima",
                        LocalDateTime.of(2026, 12, 10, 9, 5),
                        "ALTA",
                        "CADASTRADA"
                ),
                new LinhaImportacaoOs(
                        2,
                        "OS-2026-0001",
                        "Ana Silva",
                        LocalDateTime.of(2026, 12, 10, 9, 0),
                        "NORMAL",
                        "CADASTRADA"
                ),
                new LinhaImportacaoOs(
                        3,
                        "OS-2026-0002",
                        "Carlos Souza",
                        LocalDateTime.of(2026, 12, 10, 9, 10),
                        "CRITICA",
                        "ENFILEIRADA"
                ),
                new LinhaImportacaoOs(
                        4,
                        "os-2026-0001",
                        "Ana Silva Duplicada",
                        LocalDateTime.of(2026, 12, 10, 9, 20),
                        "NORMAL",
                        "CADASTRADA"
                ),
                new LinhaImportacaoOs(
                        5,
                        "ABC-999",
                        "Cliente Código Inválido",
                        LocalDateTime.of(2026, 12, 10, 9, 25),
                        "BAIXA",
                        "CADASTRADA"
                ),
                new LinhaImportacaoOs(
                        6,
                        "OS-2026-0004",
                        "Bruno Rocha",
                        LocalDateTime.of(2026, 12, 10, 9, 30),
                        "URGENTE",
                        "CADASTRADA"
                ),
                new LinhaImportacaoOs(
                        7,
                        "OS-2026-0005",
                        "Juliana Mendes",
                        LocalDateTime.of(2026, 12, 10, 9, 35),
                        "BAIXA",
                        "CONCLUIDA"
                )
        );
    }

    private static void imprimirLinhasOriginais(ResultadoProcessamentoImportacaoOs resultado) {
        System.out.println("Linhas originais:");

        for (LinhaImportacaoOs linha : resultado.linhasOriginais()) {
            System.out.println("- " + linha.resumo());
        }
    }

    private static void imprimirErros(ResultadoProcessamentoImportacaoOs resultado) {
        System.out.println();
        System.out.println("Erros:");

        if (resultado.erros().isEmpty()) {
            System.out.println("- Nenhum erro.");
            return;
        }

        for (ErroImportacao erro : resultado.erros()) {
            System.out.println("- " + erro.resumo());
        }
    }

    private static void imprimirValidos(ResultadoProcessamentoImportacaoOs resultado) {
        System.out.println();
        System.out.println("Registros válidos:");

        for (RegistroImportacaoOs registro : resultado.validos()) {
            System.out.println("- " + registro.resumo());
        }
    }

    private static void imprimirDuplicados(ResultadoProcessamentoImportacaoOs resultado) {
        System.out.println();
        System.out.println("Duplicados:");

        if (resultado.duplicados().isEmpty()) {
            System.out.println("- Nenhum duplicado.");
            return;
        }

        for (RegistroImportacaoOs registro : resultado.duplicados()) {
            System.out.println("- " + registro.resumo());
        }
    }

    private static void imprimirCodigosOrdenados(ResultadoProcessamentoImportacaoOs resultado) {
        System.out.println();
        System.out.println("Códigos válidos ordenados:");

        for (CodigoOs codigo : resultado.codigosOrdenados()) {
            System.out.println("- " + codigo.resumo());
        }
    }

    private static void imprimirAgrupamentoPorPrioridade(ResultadoProcessamentoImportacaoOs resultado) {
        System.out.println();
        System.out.println("Agrupamento por prioridade:");

        for (Map.Entry<PrioridadeAtendimento, List<RegistroImportacaoOs>> entrada
                : resultado.agrupadasPorPrioridade().entrySet()) {

            System.out.println(entrada.getKey() + ":");

            if (entrada.getValue().isEmpty()) {
                System.out.println("  - Nenhuma OS.");
            }

            for (RegistroImportacaoOs registro : entrada.getValue()) {
                System.out.println("  - " + registro.resumo());
            }
        }
    }

    private static void imprimirContagemPorStatus(ResultadoProcessamentoImportacaoOs resultado) {
        System.out.println();
        System.out.println("Contagem por status:");

        for (Map.Entry<StatusAtendimento, Integer> entrada : resultado.contagemPorStatus().entrySet()) {
            System.out.println("- " + entrada.getKey() + " -> " + entrada.getValue());
        }
    }

    private static void imprimirProcessamentoFifo(ResultadoProcessamentoImportacaoOs resultado) {
        System.out.println();
        System.out.println("Processamento FIFO:");

        for (RegistroImportacaoOs registro : resultado.processamentoFifo()) {
            System.out.println("- " + registro.resumo());
        }
    }

    private static void imprimirProcessamentoPorPrioridade(ResultadoProcessamentoImportacaoOs resultado) {
        System.out.println();
        System.out.println("Processamento por prioridade:");

        for (RegistroImportacaoOs registro : resultado.processamentoPrioridade()) {
            System.out.println("- " + registro.resumo());
        }
    }

    private static void imprimirResumoFinal(ResultadoProcessamentoImportacaoOs resultado) {
        System.out.println();
        System.out.println("Resumo final:");
        System.out.println("- Linhas: " + resultado.quantidadeLinhas());
        System.out.println("- Válidos: " + resultado.quantidadeValidos());
        System.out.println("- Duplicados: " + resultado.quantidadeDuplicados());
        System.out.println("- Erros: " + resultado.quantidadeErros());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula169.app.FluxoImportacaoValidacaoAgrupamentoApp
```

---

## O que observar na execução principal

Você deve observar diferenças importantes:

```text
Linhas originais:
mantêm tudo que chegou.

Registros válidos:
somente linhas convertidas com sucesso e sem duplicidade.

Erros:
incluem duplicidade, código inválido e prioridade inválida.

Códigos ordenados:
usam TreeSet.

Agrupamento por prioridade:
usa Map<Prioridade, List<Registro>>.

Contagem por status:
usa Map<Status, Integer>.

Processamento FIFO:
segue ordem de importação válida.

Processamento por prioridade:
segue regra de prioridade, data e código.
```

---

## Teste focado em duplicidade

Crie:

```text
src\br\com\curso\aula169\app\TesteDuplicidadeImportacaoApp.java
```

Código:

```java
package br.com.curso.aula169.app;

import br.com.curso.aula169.dominio.importacao.ErroImportacao;
import br.com.curso.aula169.dominio.importacao.LinhaImportacaoOs;
import br.com.curso.aula169.infra.ProcessadorImportacaoOsMemoria;
import br.com.curso.aula169.infra.ResultadoProcessamentoImportacaoOs;

import java.time.LocalDateTime;
import java.util.List;

public class TesteDuplicidadeImportacaoApp {
    public static void main(String[] args) {
        List<LinhaImportacaoOs> linhas = List.of(
                new LinhaImportacaoOs(
                        1,
                        "OS-2026-0001",
                        "Ana Silva",
                        LocalDateTime.of(2026, 12, 10, 9, 0),
                        "NORMAL",
                        "CADASTRADA"
                ),
                new LinhaImportacaoOs(
                        2,
                        " os-2026-0001 ",
                        "Ana Silva Duplicada",
                        LocalDateTime.of(2026, 12, 10, 9, 10),
                        "ALTA",
                        "CADASTRADA"
                )
        );

        ProcessadorImportacaoOsMemoria processador = new ProcessadorImportacaoOsMemoria();

        ResultadoProcessamentoImportacaoOs resultado = processador.processar(linhas);

        System.out.println("Válidos: " + resultado.quantidadeValidos());
        System.out.println("Duplicados: " + resultado.quantidadeDuplicados());
        System.out.println("Erros: " + resultado.quantidadeErros());

        for (ErroImportacao erro : resultado.erros()) {
            System.out.println("- " + erro.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula169.app.TesteDuplicidadeImportacaoApp
```

---

## O que esse teste mostra

Ele mostra que:

```text
OS-2026-0001
```

e:

```text
 os-2026-0001 
```

são consideradas o mesmo código.

Isso acontece porque `CodigoOs` normaliza o valor.

O `HashSet` detecta duplicidade usando `equals` e `hashCode`.

---

## Teste FIFO versus prioridade

Crie:

```text
src\br\com\curso\aula169\app\TesteFilaFifoVersusPrioridadeApp.java
```

Código:

```java
package br.com.curso.aula169.app;

import br.com.curso.aula169.dominio.importacao.LinhaImportacaoOs;
import br.com.curso.aula169.dominio.importacao.RegistroImportacaoOs;
import br.com.curso.aula169.infra.ProcessadorImportacaoOsMemoria;
import br.com.curso.aula169.infra.ResultadoProcessamentoImportacaoOs;

import java.time.LocalDateTime;
import java.util.List;

public class TesteFilaFifoVersusPrioridadeApp {
    public static void main(String[] args) {
        List<LinhaImportacaoOs> linhas = List.of(
                new LinhaImportacaoOs(
                        1,
                        "OS-2026-0001",
                        "Ana Silva",
                        LocalDateTime.of(2026, 12, 10, 9, 0),
                        "BAIXA",
                        "CADASTRADA"
                ),
                new LinhaImportacaoOs(
                        2,
                        "OS-2026-0002",
                        "Carlos Souza",
                        LocalDateTime.of(2026, 12, 10, 9, 5),
                        "CRITICA",
                        "CADASTRADA"
                ),
                new LinhaImportacaoOs(
                        3,
                        "OS-2026-0003",
                        "Mariana Lima",
                        LocalDateTime.of(2026, 12, 10, 9, 10),
                        "ALTA",
                        "CADASTRADA"
                )
        );

        ResultadoProcessamentoImportacaoOs resultado =
                new ProcessadorImportacaoOsMemoria().processar(linhas);

        System.out.println("FIFO:");

        for (RegistroImportacaoOs registro : resultado.processamentoFifo()) {
            System.out.println("- " + registro.codigo().resumo() + " | " + registro.prioridade());
        }

        System.out.println();
        System.out.println("Prioridade:");

        for (RegistroImportacaoOs registro : resultado.processamentoPrioridade()) {
            System.out.println("- " + registro.codigo().resumo() + " | " + registro.prioridade());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula169.app.TesteFilaFifoVersusPrioridadeApp
```

---

## O que esse teste mostra

FIFO respeita:

```text
ordem de importação.
```

Prioridade respeita:

```text
CRITICA;
ALTA;
NORMAL;
BAIXA;
data;
código.
```

São comportamentos diferentes.

Por isso a escolha da estrutura muda o resultado.

---

## Teste de relatório por status

Crie:

```text
src\br\com\curso\aula169\app\TesteRelatorioStatusImportacaoApp.java
```

Código:

```java
package br.com.curso.aula169.app;

import br.com.curso.aula169.dominio.importacao.LinhaImportacaoOs;
import br.com.curso.aula169.dominio.importacao.StatusAtendimento;
import br.com.curso.aula169.infra.ProcessadorImportacaoOsMemoria;
import br.com.curso.aula169.infra.ResultadoProcessamentoImportacaoOs;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class TesteRelatorioStatusImportacaoApp {
    public static void main(String[] args) {
        List<LinhaImportacaoOs> linhas = List.of(
                new LinhaImportacaoOs(
                        1,
                        "OS-2026-0001",
                        "Ana",
                        LocalDateTime.of(2026, 12, 10, 9, 0),
                        "NORMAL",
                        "CADASTRADA"
                ),
                new LinhaImportacaoOs(
                        2,
                        "OS-2026-0002",
                        "Carlos",
                        LocalDateTime.of(2026, 12, 10, 9, 5),
                        "ALTA",
                        "CONCLUIDA"
                ),
                new LinhaImportacaoOs(
                        3,
                        "OS-2026-0003",
                        "Mariana",
                        LocalDateTime.of(2026, 12, 10, 9, 10),
                        "CRITICA",
                        "CONCLUIDA"
                ),
                new LinhaImportacaoOs(
                        4,
                        "OS-2026-0004",
                        "Bruno",
                        LocalDateTime.of(2026, 12, 10, 9, 15),
                        "BAIXA",
                        "CANCELADA"
                )
        );

        ResultadoProcessamentoImportacaoOs resultado =
                new ProcessadorImportacaoOsMemoria().processar(linhas);

        System.out.println("Contagem por status:");

        for (Map.Entry<StatusAtendimento, Integer> entrada : resultado.contagemPorStatus().entrySet()) {
            System.out.println("- " + entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula169.app.TesteRelatorioStatusImportacaoApp
```

---

## Revisão das coleções usadas

### List

Usada para:

```text
linhas originais;
válidos;
duplicados;
erros;
processados;
listas dentro de agrupamento.
```

### LinkedHashMap

Usada para:

```text
válidos por código mantendo ordem de importação;
contagem com ordem previsível;
agrupamento com ordem previsível.
```

### HashSet

Usada para:

```text
detectar se um código já apareceu.
```

### LinkedHashSet

Usada para:

```text
controlar duplicados na ordem em que foram detectados.
```

### TreeSet

Usada para:

```text
códigos ordenados.
```

### ArrayDeque

Usada para:

```text
fila FIFO.
```

### PriorityQueue

Usada para:

```text
fila por prioridade.
```

### Comparator

Usado para:

```text
prioridade;
data;
código.
```

---

## Por que não usamos Stream ainda

Talvez você conheça ou já tenha visto código com `stream`.

Nesta aula, mantivemos `for`, `Map`, `Set` e `Queue` explícitos.

Motivo:

```text
primeiro você precisa dominar a estrutura;
depois aprende atalhos e programação funcional.
```

Streams virão mais adiante com profundidade.

Antes disso, é importante enxergar exatamente o que cada coleção está fazendo.

---

## Onde isso aparece em backend

Esse fluxo lembra vários cenários reais:

```text
importação de arquivo CSV;
importação de planilha;
validação de lote;
processamento de OS;
tratamento de duplicidade;
agrupamento para relatório;
fila de reprocessamento;
prioridade de atendimento;
retorno de erros para usuário;
auditoria de importação.
```

Em uma aplicação real, algumas partes mudariam:

```text
linha viria de arquivo;
erros poderiam ir para resposta da API;
válidos poderiam ser salvos no banco;
fila poderia ser mensageria;
relatório poderia virar endpoint;
processador poderia virar use case.
```

Mas a lógica de coleção continua sendo uma base importante.

---

## Separação de responsabilidades

Neste exercício, separamos:

```text
dominio.valor:
CodigoOs.

dominio.importacao:
Linha, Registro, Erro, enums.

infra:
processador, resultado, ordenação.

app:
cenários executáveis.
```

Essa separação prepara para arquitetura.

Mais adiante, isso evolui para:

```text
Controller;
DTO;
Use Case;
Service;
Repository;
Entity;
Gateway;
Mapper.
```

Mas a base já aparece aqui.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Criar domínio

Crie e revise:

```text
CodigoOs;
PrioridadeAtendimento;
StatusAtendimento;
LinhaImportacaoOs;
RegistroImportacaoOs;
ErroImportacao.
```

Confirme que:

```text
CodigoOs valida e normaliza;
LinhaImportacaoOs aceita dados brutos;
RegistroImportacaoOs valida dados finais;
ErroImportacao registra linha e motivo.
```

### Parte 2 — Criar infraestrutura

Crie e revise:

```text
ResultadoProcessamentoImportacaoOs;
OrdenacaoImportacaoOs;
ProcessadorImportacaoOsMemoria.
```

Confirme que:

```text
resultado protege coleções;
ordenação usa Comparator;
processador usa várias coleções com intenção clara.
```

### Parte 3 — Executar fluxo completo

Execute:

```powershell
java -cp out br.com.curso.aula169.app.FluxoImportacaoValidacaoAgrupamentoApp
```

Observe cada bloco impresso.

### Parte 4 — Executar testes focados

Execute:

```powershell
java -cp out br.com.curso.aula169.app.TesteDuplicidadeImportacaoApp
java -cp out br.com.curso.aula169.app.TesteFilaFifoVersusPrioridadeApp
java -cp out br.com.curso.aula169.app.TesteRelatorioStatusImportacaoApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula169\app\FluxoImportacaoSomenteValidosApp.java
```

Ele deve:

```text
criar pelo menos 8 linhas;
ter somente dados válidos;
processar a importação;
exibir válidos;
exibir códigos ordenados;
exibir agrupamento por prioridade;
exibir contagem por status;
exibir FIFO;
exibir prioridade.
```

Critério principal:

```text
o resultado não deve ter erros nem duplicados.
```

---

## Desafio extra

Crie um app chamado:

```text
src\br\com\curso\aula169\app\FluxoImportacaoComMuitosErrosApp.java
```

Ele deve conter linhas com:

```text
código nulo;
código em branco;
código com prefixo errado;
cliente em branco;
prioridade inválida;
status inválido;
código duplicado.
```

Critério principal:

```text
todos os erros devem aparecer na lista de erros.
```

Depois revise se o processador está tratando todos os casos de forma clara.

---

## Desafio de melhoria

Crie um método novo em `ResultadoProcessamentoImportacaoOs`:

```text
possuiErros()
```

Ele deve retornar:

```java
true
```

se houver pelo menos um erro.

Depois use isso no app principal para imprimir:

```text
Importação concluída com erros.
```

ou:

```text
Importação concluída sem erros.
```

Critério principal:

```text
não acessar diretamente quantidadeErros() no app para essa decisão.
```

A intenção é melhorar expressividade.

---

## Erros comuns nesta aula

### 1. Tentar validar tudo no app

O app deve montar cenário e exibir resultado.

A validação pertence ao processador ou aos objetos.

### 2. Usar List para detectar duplicidade

Use `Set`.

### 3. Usar HashMap quando precisa preservar ordem de importação

Use `LinkedHashMap`.

### 4. Usar HashSet para duplicados quando precisa preservar ordem

Use `LinkedHashSet`.

### 5. Usar PriorityQueue e depois iterar com foreach esperando prioridade

Use `poll`.

### 6. Retornar Map com listas internas mutáveis

Copie as listas internas.

### 7. Esquecer critério de desempate na prioridade

Use prioridade, data e código.

### 8. Misturar linha bruta com registro validado

Separe entrada externa de domínio validado.

### 9. Usar String para status e prioridade no registro validado

Converta para enum.

### 10. Não debugar o fluxo

Este exercício precisa ser debugado para entender as coleções trabalhando.

---

## Debug recomendado

Use debug em:

```text
ProcessadorImportacaoOsMemoria.java
ResultadoProcessamentoImportacaoOs.java
OrdenacaoImportacaoOs.java
FluxoImportacaoValidacaoAgrupamentoApp.java
TesteDuplicidadeImportacaoApp.java
TesteFilaFifoVersusPrioridadeApp.java
```

Breakpoints recomendados:

```java
converter(linha)

new CodigoOs(...)

converterPrioridade(...)

converterStatus(...)

vistos.add(registro.codigo())

validosPorCodigo.put(...)

codigosOrdenados.add(...)

duplicados.add(...)

erros.add(...)

agrupamento.get(...).add(...)

contagem.merge(...)

fila.poll()

new PriorityQueue<>(...)
```

Observe:

```text
quando a linha vira registro;
quando a validação falha;
quando a duplicidade é detectada;
quando Map mantém ordem;
quando TreeSet ordena;
quando ArrayDeque processa FIFO;
quando PriorityQueue muda a ordem;
quando o resultado copia as coleções.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Por que usamos LinhaImportacaoOs e RegistroImportacaoOs separados?
2. Qual coleção detecta duplicidade?
3. Qual coleção preserva válidos por código na ordem de importação?
4. Qual coleção gera os códigos ordenados?
5. Qual a diferença entre processamento FIFO e por prioridade neste exercício?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar o fluxo de importação;
criar linha bruta de importação;
criar registro validado;
criar erro de importação;
usar CodigoOs como objeto de valor;
converter String para enum;
validar prioridade;
validar status;
usar LinkedHashMap para válidos por código;
usar HashSet para vistos;
usar LinkedHashSet para duplicados;
usar TreeSet para ordenados;
usar Map<Prioridade, List<Registro>> para agrupamento;
usar Map<Status, Integer> para contagem;
usar ArrayDeque para FIFO;
usar PriorityQueue para prioridade;
usar Comparator com desempate;
proteger resultado com cópias;
executar fluxo completo;
executar testes focados;
resolver FluxoImportacaoSomenteValidosApp;
resolver FluxoImportacaoComMuitosErrosApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-169-exercicios-integradores-collections-implementacao-guiada
git commit -m "Aula 169: exercicios integradores collections implementacao guiada"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
um fluxo real combina várias coleções, cada uma com uma responsabilidade clara.
```

Você implementou um processador que usa:

```text
List;
Map;
Set;
TreeSet;
Queue;
PriorityQueue;
Comparator;
List.copyOf.
```

Também praticou uma separação importante:

```text
entrada bruta;
registro validado;
erro;
resultado;
processador;
app.
```

Na próxima aula, vamos caminhar para o projeto final do Módulo 5.

Vamos consolidar Collections em um mini-sistema maior de cadastro, seleção, atendimento, importação e relatório.
