# 234 — M10.12 — Decorator Pattern: logs, métricas, cache e autorização

## Objetivo da aula

Na aula anterior, você estudou:

```text
Observer Pattern
```

Você viu que Observer ajuda quando algo acontece no sistema e várias partes precisam reagir sem acoplar tudo no fluxo principal, como:

```text
pedido pago;
ordem de serviço criada;
transação aprovada;
importação finalizada;
mensagem enviada;
contrato ativado.
```

Agora vamos estudar outro padrão comportamental muito importante para backend:

```text
Decorator Pattern
```

Em português:

```text
Padrão Decorador
```

Decorator aparece quando você precisa adicionar comportamentos extras a um objeto sem alterar a classe original.

Exemplos comuns em backend:

```text
log;
métrica;
cache;
autorização;
validação;
auditoria;
retry;
timeout;
circuit breaker;
normalização;
criptografia;
compressão;
enriquecimento de resposta;
rastreamento;
correlationId;
tratamento padronizado de erro.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Decorator resolve;
criar uma interface comum;
criar implementação principal;
criar decorators que envolvem a implementação principal;
empilhar decorators;
adicionar log sem alterar service original;
adicionar métrica sem alterar service original;
adicionar cache sem alterar service original;
adicionar autorização sem alterar service original;
diferenciar Decorator de Proxy;
diferenciar Decorator de Adapter;
diferenciar Decorator de Strategy;
entender como isso aparece em middlewares, interceptors e proxies do Spring.
```

---

## Ideia principal

Decorator adiciona comportamento antes, depois ou ao redor de uma chamada.

Exemplo:

```text
ConsultaPedidoService
```

Implementação principal:

```text
ConsultaPedidoServiceBase
```

Decorators:

```text
ConsultaPedidoLogDecorator
ConsultaPedidoMetricasDecorator
ConsultaPedidoCacheDecorator
ConsultaPedidoAutorizacaoDecorator
```

A chamada pode ficar assim:

```text
Controller futuro
  -> AutorizacaoDecorator
  -> LogDecorator
  -> MetricasDecorator
  -> CacheDecorator
  -> ConsultaPedidoServiceBase
```

Todos implementam a mesma interface.

Isso permite empilhar comportamentos.

---

## Decorator em uma frase prática

```text
Use Decorator quando quiser adicionar comportamento a um objeto sem modificar a classe original.
```

Ou:

```text
Decorator envolve um objeto e adiciona comportamento mantendo o mesmo contrato.
```

---

## Problema sem Decorator

Imagine um service simples:

```java
PedidoResumo consultarPorCodigo(String codigo)
```

Depois o sistema pede:

```text
adicionar log;
adicionar métrica;
adicionar cache;
validar autorização;
registrar tempo de execução;
normalizar entrada.
```

Sem Decorator, o método principal começa a ficar poluído:

```java
public PedidoResumo consultarPorCodigo(String codigo) {
    validarPermissao();

    long inicio = System.nanoTime();

    System.out.println("Consultando pedido " + codigo);

    if (cache.containsKey(codigo)) {
        return cache.get(codigo);
    }

    PedidoResumo resumo = consultarNoRepositorio(codigo);

    cache.put(codigo, resumo);

    System.out.println("Duração: " + (System.nanoTime() - inicio));

    return resumo;
}
```

O problema não é o código funcionar.

O problema é misturar:

```text
regra principal;
log;
métrica;
cache;
autorização;
tratamento técnico.
```

Decorator separa essas responsabilidades.

---

## Relação com SOLID

## SRP

Cada decorator tem uma responsabilidade.

```text
LogDecorator:
cuida de log.

CacheDecorator:
cuida de cache.

MetricasDecorator:
cuida de métrica.

AutorizacaoDecorator:
cuida de autorização.
```

---

## OCP

Você adiciona novo comportamento criando novo decorator.

Não precisa alterar o service original.

---

## LSP

Decorator implementa a mesma interface do objeto decorado.

Quem usa a interface não precisa saber se está usando:

```text
service original;
service com log;
service com cache;
service com autorização;
service com tudo empilhado.
```

---

## ISP

A interface decorada deve ser coesa.

Se a interface tiver métodos demais, os decorators serão obrigados a decorar coisas que não interessam.

---

## DIP

Decorator depende da abstração:

```java
private final ConsultaPedidoService delegate;
```

E não da implementação concreta:

```java
private final ConsultaPedidoServiceBase delegate;
```

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Decorator:

```text
Decorator adiciona comportamento transversal.
A entidade continua decidindo.
O use case continua coordenando.
O repository continua salvando.
O client continua integrando.
O controller futuro continua recebendo.
```

Decorator não deve virar regra principal do domínio.

---

# Parte 1 — Decorator vs Proxy

Decorator e Proxy são parecidos porque ambos envolvem outro objeto.

Mas a intenção muda.

## Decorator

Adiciona comportamento.

Exemplo:

```text
adicionar log;
adicionar métrica;
adicionar cache;
adicionar auditoria;
adicionar validação.
```

## Proxy

Controla acesso ou representa outro objeto.

Exemplo:

```text
proxy remoto;
proxy de segurança;
proxy de lazy loading;
proxy de transação;
proxy criado por framework.
```

Diferença prática:

```text
Decorator:
quero adicionar comportamento extra mantendo o contrato.

Proxy:
quero controlar acesso, representar ou intermediar o objeto.
```

---

# Parte 2 — Decorator vs Adapter

## Adapter

Muda ou traduz o contrato.

```text
ExternalPaymentClient -> PagamentoGateway
```

## Decorator

Mantém o mesmo contrato.

```text
PagamentoGateway -> PagamentoGateway com log
```

Diferença prática:

```text
Adapter:
traduz interface incompatível.

Decorator:
mantém interface e adiciona comportamento.
```

---

# Parte 3 — Decorator vs Strategy

## Strategy

Escolhe uma regra intercambiável.

```text
PoliticaDesconto;
PoliticaFrete;
PoliticaPrioridade.
```

## Decorator

Envolve uma implementação para adicionar comportamento.

```text
ConsultaPedidoService com cache;
ConsultaPedidoService com log;
ConsultaPedidoService com métrica.
```

Diferença prática:

```text
Strategy:
qual algoritmo/regra usar?

Decorator:
qual comportamento extra adicionar ao objeto?
```

---

# Parte 4 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-234-decorator-pattern-logs-metricas-cache-autorizacao
cd labs\m10\aula-234-decorator-pattern-logs-metricas-cache-autorizacao
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula234

mkdir src\br\com\curso\aula234\app

mkdir src\br\com\curso\aula234\dominio
mkdir src\br\com\curso\aula234\dominio\pedido
mkdir src\br\com\curso\aula234\dominio\seguranca

mkdir src\br\com\curso\aula234\aplicacao
mkdir src\br\com\curso\aula234\aplicacao\port
mkdir src\br\com\curso\aula234\aplicacao\service

mkdir src\br\com\curso\aula234\decorator
mkdir src\br\com\curso\aula234\decorator\consulta
mkdir src\br\com\curso\aula234\decorator\mensageria

mkdir src\br\com\curso\aula234\infra
mkdir src\br\com\curso\aula234\infra\repository
mkdir src\br\com\curso\aula234\infra\mensageria
```

---

# Parte 5 — Domínio de Pedido

## StatusPedido

Crie:

```text
src\br\com\curso\aula234\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula234.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

---

## Pedido

Crie:

```text
src\br\com\curso\aula234\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula234.dominio.pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class Pedido {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final StatusPedido status;
    private final Instant criadoEm;

    public Pedido(
            UUID id,
            String codigo,
            String cliente,
            BigDecimal valor,
            StatusPedido status,
            Instant criadoEm
    ) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (criadoEm == null) {
            throw new IllegalArgumentException("Data de criação é obrigatória.");
        }

        this.id = id;
        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.valor = valor;
        this.status = status;
        this.criadoEm = criadoEm;
    }

    public UUID id() {
        return id;
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public BigDecimal valor() {
        return valor;
    }

    public StatusPedido status() {
        return status;
    }

    public Instant criadoEm() {
        return criadoEm;
    }
}
```

---

## PedidoResumo

Crie:

```text
src\br\com\curso\aula234\dominio\pedido\PedidoResumo.java
```

Código:

```java
package br.com.curso.aula234.dominio.pedido;

import java.math.BigDecimal;

public record PedidoResumo(
        String codigo,
        String cliente,
        BigDecimal valor,
        String status
) {
}
```

---

# Parte 6 — Segurança simples

## UsuarioAutenticado

Crie:

```text
src\br\com\curso\aula234\dominio\seguranca\UsuarioAutenticado.java
```

Código:

```java
package br.com.curso.aula234.dominio.seguranca;

import java.util.Set;

public class UsuarioAutenticado {
    private final String nome;
    private final Set<String> permissoes;

    public UsuarioAutenticado(String nome, Set<String> permissoes) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (permissoes == null) {
            throw new IllegalArgumentException("Permissões são obrigatórias.");
        }

        this.nome = nome.trim();
        this.permissoes = Set.copyOf(permissoes);
    }

    public String nome() {
        return nome;
    }

    public boolean temPermissao(String permissao) {
        if (permissao == null || permissao.isBlank()) {
            return false;
        }

        return permissoes.contains(permissao.trim().toUpperCase());
    }
}
```

---

## ContextoSeguranca

Crie:

```text
src\br\com\curso\aula234\dominio\seguranca\ContextoSeguranca.java
```

Código:

```java
package br.com.curso.aula234.dominio.seguranca;

public final class ContextoSeguranca {
    private static UsuarioAutenticado usuarioAtual;

    private ContextoSeguranca() {
    }

    public static void autenticar(UsuarioAutenticado usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("Usuário é obrigatório.");
        }

        usuarioAtual = usuario;
    }

    public static UsuarioAutenticado usuarioAtual() {
        if (usuarioAtual == null) {
            throw new IllegalStateException("Nenhum usuário autenticado.");
        }

        return usuarioAtual;
    }

    public static void limpar() {
        usuarioAtual = null;
    }
}
```

---

## Observação

Esse contexto é simplificado para estudo.

Em sistemas reais, segurança é tratada por framework, como Spring Security.

Aqui usamos isso apenas para entender um decorator de autorização.

---

# Parte 7 — Port e service principal

## PedidoRepository

Crie:

```text
src\br\com\curso\aula234\aplicacao\port\PedidoRepository.java
```

Código:

```java
package br.com.curso.aula234.aplicacao.port;

import br.com.curso.aula234.dominio.pedido.Pedido;

import java.util.Optional;

public interface PedidoRepository {
    Optional<Pedido> buscarPorCodigo(String codigo);

    void salvar(Pedido pedido);
}
```

---

## ConsultaPedidoService

Crie:

```text
src\br\com\curso\aula234\aplicacao\service\ConsultaPedidoService.java
```

Código:

```java
package br.com.curso.aula234.aplicacao.service;

import br.com.curso.aula234.dominio.pedido.PedidoResumo;

public interface ConsultaPedidoService {
    PedidoResumo consultarPorCodigo(String codigo);
}
```

---

## ConsultaPedidoServiceBase

Crie:

```text
src\br\com\curso\aula234\aplicacao\service\ConsultaPedidoServiceBase.java
```

Código:

```java
package br.com.curso.aula234.aplicacao.service;

import br.com.curso.aula234.aplicacao.port.PedidoRepository;
import br.com.curso.aula234.dominio.pedido.Pedido;
import br.com.curso.aula234.dominio.pedido.PedidoResumo;

public class ConsultaPedidoServiceBase implements ConsultaPedidoService {
    private final PedidoRepository repository;

    public ConsultaPedidoServiceBase(PedidoRepository repository) {
        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        this.repository = repository;
    }

    @Override
    public PedidoResumo consultarPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        Pedido pedido = repository.buscarPorCodigo(codigo)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado: " + codigo));

        return new PedidoResumo(
                pedido.codigo(),
                pedido.cliente(),
                pedido.valor(),
                pedido.status().name()
        );
    }
}
```

---

## PedidoRepositoryMemoria

Crie:

```text
src\br\com\curso\aula234\infra\repository\PedidoRepositoryMemoria.java
```

Código:

```java
package br.com.curso.aula234.infra.repository;

import br.com.curso.aula234.aplicacao.port.PedidoRepository;
import br.com.curso.aula234.dominio.pedido.Pedido;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class PedidoRepositoryMemoria implements PedidoRepository {
    private final List<Pedido> pedidos = new ArrayList<>();

    @Override
    public Optional<Pedido> buscarPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        System.out.println("[REPOSITORY] Buscando pedido: " + normalizado);

        return pedidos.stream()
                .filter(pedido -> pedido.codigo().equals(normalizado))
                .findFirst();
    }

    @Override
    public void salvar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        pedidos.removeIf(item -> item.codigo().equals(pedido.codigo()));
        pedidos.add(pedido);
    }
}
```

---

# Parte 8 — Decorator base

## ConsultaPedidoDecorator

Crie:

```text
src\br\com\curso\aula234\decorator\consulta\ConsultaPedidoDecorator.java
```

Código:

```java
package br.com.curso.aula234.decorator.consulta;

import br.com.curso.aula234.aplicacao.service.ConsultaPedidoService;
import br.com.curso.aula234.dominio.pedido.PedidoResumo;

public abstract class ConsultaPedidoDecorator implements ConsultaPedidoService {
    protected final ConsultaPedidoService delegate;

    protected ConsultaPedidoDecorator(ConsultaPedidoService delegate) {
        if (delegate == null) {
            throw new IllegalArgumentException("Delegate é obrigatório.");
        }

        this.delegate = delegate;
    }

    @Override
    public PedidoResumo consultarPorCodigo(String codigo) {
        return delegate.consultarPorCodigo(codigo);
    }
}
```

---

## O que é delegate

`delegate` é o objeto real que será chamado.

O decorator pode:

```text
executar algo antes;
chamar delegate;
executar algo depois;
alterar retorno;
guardar em cache;
medir tempo;
validar autorização.
```

---

# Parte 9 — Decorator de Log

## ConsultaPedidoLogDecorator

Crie:

```text
src\br\com\curso\aula234\decorator\consulta\ConsultaPedidoLogDecorator.java
```

Código:

```java
package br.com.curso.aula234.decorator.consulta;

import br.com.curso.aula234.aplicacao.service.ConsultaPedidoService;
import br.com.curso.aula234.dominio.pedido.PedidoResumo;

public class ConsultaPedidoLogDecorator extends ConsultaPedidoDecorator {
    public ConsultaPedidoLogDecorator(ConsultaPedidoService delegate) {
        super(delegate);
    }

    @Override
    public PedidoResumo consultarPorCodigo(String codigo) {
        System.out.println("[LOG] Iniciando consulta do pedido: " + codigo);

        try {
            PedidoResumo resultado = delegate.consultarPorCodigo(codigo);

            System.out.println("[LOG] Consulta concluída: " + resultado.codigo());

            return resultado;
        } catch (RuntimeException erro) {
            System.out.println("[LOG] Falha na consulta: " + erro.getMessage());
            throw erro;
        }
    }
}
```

---

# Parte 10 — Decorator de Métricas

## ConsultaPedidoMetricasDecorator

Crie:

```text
src\br\com\curso\aula234\decorator\consulta\ConsultaPedidoMetricasDecorator.java
```

Código:

```java
package br.com.curso.aula234.decorator.consulta;

import br.com.curso.aula234.aplicacao.service.ConsultaPedidoService;
import br.com.curso.aula234.dominio.pedido.PedidoResumo;

public class ConsultaPedidoMetricasDecorator extends ConsultaPedidoDecorator {
    public ConsultaPedidoMetricasDecorator(ConsultaPedidoService delegate) {
        super(delegate);
    }

    @Override
    public PedidoResumo consultarPorCodigo(String codigo) {
        long inicio = System.nanoTime();

        try {
            PedidoResumo resultado = delegate.consultarPorCodigo(codigo);

            long duracao = System.nanoTime() - inicio;

            System.out.println("[METRICA] consulta_pedido_sucesso_total +1");
            System.out.println("[METRICA] consulta_pedido_duracao_ns " + duracao);

            return resultado;
        } catch (RuntimeException erro) {
            long duracao = System.nanoTime() - inicio;

            System.out.println("[METRICA] consulta_pedido_falha_total +1");
            System.out.println("[METRICA] consulta_pedido_duracao_ns " + duracao);

            throw erro;
        }
    }
}
```

---

# Parte 11 — Decorator de Cache

## ConsultaPedidoCacheDecorator

Crie:

```text
src\br\com\curso\aula234\decorator\consulta\ConsultaPedidoCacheDecorator.java
```

Código:

```java
package br.com.curso.aula234.decorator.consulta;

import br.com.curso.aula234.aplicacao.service.ConsultaPedidoService;
import br.com.curso.aula234.dominio.pedido.PedidoResumo;

import java.util.HashMap;
import java.util.Map;

public class ConsultaPedidoCacheDecorator extends ConsultaPedidoDecorator {
    private final Map<String, PedidoResumo> cache = new HashMap<>();

    public ConsultaPedidoCacheDecorator(ConsultaPedidoService delegate) {
        super(delegate);
    }

    @Override
    public PedidoResumo consultarPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String chave = codigo.trim().toUpperCase();

        if (cache.containsKey(chave)) {
            System.out.println("[CACHE] HIT: " + chave);
            return cache.get(chave);
        }

        System.out.println("[CACHE] MISS: " + chave);

        PedidoResumo resultado = delegate.consultarPorCodigo(chave);

        cache.put(chave, resultado);

        return resultado;
    }
}
```

---

## Observação sobre cache

Esse cache é simples e em memória.

Em sistemas reais, cache pode envolver:

```text
TTL;
invalidação;
Redis;
Caffeine;
cache por usuário;
cache por tenant;
controle de concorrência;
risco de dado desatualizado.
```

Aqui o objetivo é entender o padrão.

---

# Parte 12 — Decorator de Autorização

## ConsultaPedidoAutorizacaoDecorator

Crie:

```text
src\br\com\curso\aula234\decorator\consulta\ConsultaPedidoAutorizacaoDecorator.java
```

Código:

```java
package br.com.curso.aula234.decorator.consulta;

import br.com.curso.aula234.aplicacao.service.ConsultaPedidoService;
import br.com.curso.aula234.dominio.pedido.PedidoResumo;
import br.com.curso.aula234.dominio.seguranca.ContextoSeguranca;
import br.com.curso.aula234.dominio.seguranca.UsuarioAutenticado;

public class ConsultaPedidoAutorizacaoDecorator extends ConsultaPedidoDecorator {
    private static final String PERMISSAO = "CONSULTAR_PEDIDO";

    public ConsultaPedidoAutorizacaoDecorator(ConsultaPedidoService delegate) {
        super(delegate);
    }

    @Override
    public PedidoResumo consultarPorCodigo(String codigo) {
        UsuarioAutenticado usuario = ContextoSeguranca.usuarioAtual();

        if (!usuario.temPermissao(PERMISSAO)) {
            throw new SecurityException("Usuário " + usuario.nome() + " não possui permissão " + PERMISSAO + ".");
        }

        return delegate.consultarPorCodigo(codigo);
    }
}
```

---

# Parte 13 — App sem decorator

## ConsultaPedidoSemDecoratorApp

Crie:

```text
src\br\com\curso\aula234\app\ConsultaPedidoSemDecoratorApp.java
```

Código:

```java
package br.com.curso.aula234.app;

import br.com.curso.aula234.aplicacao.port.PedidoRepository;
import br.com.curso.aula234.aplicacao.service.ConsultaPedidoService;
import br.com.curso.aula234.aplicacao.service.ConsultaPedidoServiceBase;
import br.com.curso.aula234.dominio.pedido.Pedido;
import br.com.curso.aula234.dominio.pedido.StatusPedido;
import br.com.curso.aula234.infra.repository.PedidoRepositoryMemoria;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class ConsultaPedidoSemDecoratorApp {
    public static void main(String[] args) {
        PedidoRepository repository = new PedidoRepositoryMemoria();

        repository.salvar(new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana Silva",
                new BigDecimal("1500.00"),
                StatusPedido.PAGO,
                Instant.now()
        ));

        ConsultaPedidoService service = new ConsultaPedidoServiceBase(repository);

        System.out.println(service.consultarPorCodigo("PED-001"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula234.app.ConsultaPedidoSemDecoratorApp
```

---

# Parte 14 — App com decorators empilhados

## ConsultaPedidoComDecoratorsApp

Crie:

```text
src\br\com\curso\aula234\app\ConsultaPedidoComDecoratorsApp.java
```

Código:

```java
package br.com.curso.aula234.app;

import br.com.curso.aula234.aplicacao.port.PedidoRepository;
import br.com.curso.aula234.aplicacao.service.ConsultaPedidoService;
import br.com.curso.aula234.aplicacao.service.ConsultaPedidoServiceBase;
import br.com.curso.aula234.decorator.consulta.ConsultaPedidoAutorizacaoDecorator;
import br.com.curso.aula234.decorator.consulta.ConsultaPedidoCacheDecorator;
import br.com.curso.aula234.decorator.consulta.ConsultaPedidoLogDecorator;
import br.com.curso.aula234.decorator.consulta.ConsultaPedidoMetricasDecorator;
import br.com.curso.aula234.dominio.pedido.Pedido;
import br.com.curso.aula234.dominio.pedido.StatusPedido;
import br.com.curso.aula234.dominio.seguranca.ContextoSeguranca;
import br.com.curso.aula234.dominio.seguranca.UsuarioAutenticado;
import br.com.curso.aula234.infra.repository.PedidoRepositoryMemoria;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public class ConsultaPedidoComDecoratorsApp {
    public static void main(String[] args) {
        ContextoSeguranca.autenticar(new UsuarioAutenticado(
                "thiago",
                Set.of("CONSULTAR_PEDIDO")
        ));

        PedidoRepository repository = new PedidoRepositoryMemoria();

        repository.salvar(new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana Silva",
                new BigDecimal("1500.00"),
                StatusPedido.PAGO,
                Instant.now()
        ));

        ConsultaPedidoService serviceBase = new ConsultaPedidoServiceBase(repository);

        ConsultaPedidoService serviceDecorado =
                new ConsultaPedidoAutorizacaoDecorator(
                        new ConsultaPedidoLogDecorator(
                                new ConsultaPedidoMetricasDecorator(
                                        new ConsultaPedidoCacheDecorator(serviceBase)
                                )
                        )
                );

        System.out.println();
        System.out.println(serviceDecorado.consultarPorCodigo("PED-001"));

        System.out.println();
        System.out.println(serviceDecorado.consultarPorCodigo("PED-001"));
    }
}
```

Execute:

```powershell
java -cp out br.com.curso.aula234.app.ConsultaPedidoComDecoratorsApp
```

---

## O que observar

Na primeira consulta:

```text
autorização valida;
log inicia;
métrica mede;
cache dá MISS;
repository é chamado;
cache guarda;
log finaliza.
```

Na segunda consulta:

```text
autorização valida;
log inicia;
métrica mede;
cache dá HIT;
repository não precisa buscar de novo.
```

---

# Parte 15 — Ordem dos decorators

A ordem importa.

Exemplo:

```java
new LogDecorator(
    new CacheDecorator(service)
)
```

é diferente de:

```java
new CacheDecorator(
    new LogDecorator(service)
)
```

No primeiro caso, o log envolve até cache.

No segundo, se cache der HIT, talvez o log interno nem rode.

Pense sempre:

```text
qual comportamento deve ficar mais externo?
qual comportamento deve ficar mais interno?
cache deve vir antes ou depois de autorização?
métrica deve medir cache ou apenas chamada real?
log deve registrar tudo ou apenas chamada real?
```

Não existe resposta única.

Depende do objetivo.

---

# Parte 16 — App de autorização negada

## ConsultaPedidoAutorizacaoNegadaApp

Crie:

```text
src\br\com\curso\aula234\app\ConsultaPedidoAutorizacaoNegadaApp.java
```

Código:

```java
package br.com.curso.aula234.app;

import br.com.curso.aula234.aplicacao.port.PedidoRepository;
import br.com.curso.aula234.aplicacao.service.ConsultaPedidoService;
import br.com.curso.aula234.aplicacao.service.ConsultaPedidoServiceBase;
import br.com.curso.aula234.decorator.consulta.ConsultaPedidoAutorizacaoDecorator;
import br.com.curso.aula234.dominio.pedido.Pedido;
import br.com.curso.aula234.dominio.pedido.StatusPedido;
import br.com.curso.aula234.dominio.seguranca.ContextoSeguranca;
import br.com.curso.aula234.dominio.seguranca.UsuarioAutenticado;
import br.com.curso.aula234.infra.repository.PedidoRepositoryMemoria;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public class ConsultaPedidoAutorizacaoNegadaApp {
    public static void main(String[] args) {
        ContextoSeguranca.autenticar(new UsuarioAutenticado(
                "usuario-sem-permissao",
                Set.of()
        ));

        PedidoRepository repository = new PedidoRepositoryMemoria();

        repository.salvar(new Pedido(
                UUID.randomUUID(),
                "PED-002",
                "Carlos Souza",
                new BigDecimal("700.00"),
                StatusPedido.CRIADO,
                Instant.now()
        ));

        ConsultaPedidoService service = new ConsultaPedidoAutorizacaoDecorator(
                new ConsultaPedidoServiceBase(repository)
        );

        try {
            System.out.println(service.consultarPorCodigo("PED-002"));
        } catch (RuntimeException erro) {
            System.out.println("Erro esperado: " + erro.getMessage());
        }
    }
}
```

---

# Parte 17 — Decorator em Mensageria

Decorator também é útil em gateways.

Vamos decorar um gateway de mensageria.

## MensageriaGateway

Crie:

```text
src\br\com\curso\aula234\aplicacao\port\MensageriaGateway.java
```

Código:

```java
package br.com.curso.aula234.aplicacao.port;

public interface MensageriaGateway {
    void enviar(String destino, String mensagem);
}
```

---

## MensageriaConsoleGateway

Crie:

```text
src\br\com\curso\aula234\infra\mensageria\MensageriaConsoleGateway.java
```

Código:

```java
package br.com.curso.aula234.infra.mensageria;

import br.com.curso.aula234.aplicacao.port.MensageriaGateway;

public class MensageriaConsoleGateway implements MensageriaGateway {
    @Override
    public void enviar(String destino, String mensagem) {
        System.out.println("[MENSAGERIA] Para: " + destino + " | " + mensagem);
    }
}
```

---

## MensageriaDecorator

Crie:

```text
src\br\com\curso\aula234\decorator\mensageria\MensageriaDecorator.java
```

Código:

```java
package br.com.curso.aula234.decorator.mensageria;

import br.com.curso.aula234.aplicacao.port.MensageriaGateway;

public abstract class MensageriaDecorator implements MensageriaGateway {
    protected final MensageriaGateway delegate;

    protected MensageriaDecorator(MensageriaGateway delegate) {
        if (delegate == null) {
            throw new IllegalArgumentException("Delegate é obrigatório.");
        }

        this.delegate = delegate;
    }

    @Override
    public void enviar(String destino, String mensagem) {
        delegate.enviar(destino, mensagem);
    }
}
```

---

## MensageriaValidacaoDecorator

Crie:

```text
src\br\com\curso\aula234\decorator\mensageria\MensageriaValidacaoDecorator.java
```

Código:

```java
package br.com.curso.aula234.decorator.mensageria;

import br.com.curso.aula234.aplicacao.port.MensageriaGateway;

public class MensageriaValidacaoDecorator extends MensageriaDecorator {
    public MensageriaValidacaoDecorator(MensageriaGateway delegate) {
        super(delegate);
    }

    @Override
    public void enviar(String destino, String mensagem) {
        if (destino == null || destino.isBlank()) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        delegate.enviar(destino, mensagem);
    }
}
```

---

## MensageriaLogDecorator

Crie:

```text
src\br\com\curso\aula234\decorator\mensageria\MensageriaLogDecorator.java
```

Código:

```java
package br.com.curso.aula234.decorator.mensageria;

import br.com.curso.aula234.aplicacao.port.MensageriaGateway;

public class MensageriaLogDecorator extends MensageriaDecorator {
    public MensageriaLogDecorator(MensageriaGateway delegate) {
        super(delegate);
    }

    @Override
    public void enviar(String destino, String mensagem) {
        System.out.println("[LOG] Enviando mensagem para: " + destino);

        try {
            delegate.enviar(destino, mensagem);
            System.out.println("[LOG] Mensagem enviada.");
        } catch (RuntimeException erro) {
            System.out.println("[LOG] Falha ao enviar mensagem: " + erro.getMessage());
            throw erro;
        }
    }
}
```

---

## MensageriaDecoratorApp

Crie:

```text
src\br\com\curso\aula234\app\MensageriaDecoratorApp.java
```

Código:

```java
package br.com.curso.aula234.app;

import br.com.curso.aula234.aplicacao.port.MensageriaGateway;
import br.com.curso.aula234.decorator.mensageria.MensageriaLogDecorator;
import br.com.curso.aula234.decorator.mensageria.MensageriaValidacaoDecorator;
import br.com.curso.aula234.infra.mensageria.MensageriaConsoleGateway;

public class MensageriaDecoratorApp {
    public static void main(String[] args) {
        MensageriaGateway gateway = new MensageriaLogDecorator(
                new MensageriaValidacaoDecorator(
                        new MensageriaConsoleGateway()
                )
        );

        gateway.enviar("11999999999", "Sua ordem de serviço foi criada.");
    }
}
```

---

# Parte 18 — Decorator e arquitetura limpa

Decorator ajuda a manter o núcleo limpo.

Exemplo:

```text
ConsultaPedidoServiceBase:
regra principal da consulta.

ConsultaPedidoLogDecorator:
log.

ConsultaPedidoMetricasDecorator:
métrica.

ConsultaPedidoCacheDecorator:
cache.

ConsultaPedidoAutorizacaoDecorator:
autorização.
```

Cada preocupação fica isolada.

Isso evita misturar:

```text
regra de negócio;
infraestrutura;
observabilidade;
segurança;
performance.
```

---

# Parte 19 — Decorator em frameworks

Em projetos reais, você verá conceitos parecidos em:

```text
middlewares;
interceptors;
filters;
AOP;
Spring Security;
Spring Cache;
Spring Transaction;
Feign interceptors;
RestTemplate interceptors;
WebClient filters;
Servlet filters.
```

Exemplo conceitual:

```text
Controller
  -> Security Filter
  -> Logging Filter
  -> Transaction Proxy
  -> Service
```

Muitas dessas estruturas usam ideias parecidas com Decorator e Proxy.

Entender Java puro ajuda a entender framework.

---

# Parte 20 — Erros comuns com Decorator

## 1. Decorator mudando regra principal

Decorator deve adicionar comportamento transversal.

Não deve roubar regra central do service.

---

## 2. Ordem errada dos decorators

Ordem muda comportamento.

Pense antes de empilhar.

---

## 3. Decorator retornando coisa incompatível

Decorator deve respeitar o mesmo contrato.

---

## 4. Decorator gigante

Se o decorator faz log, cache, métrica e autorização ao mesmo tempo, você perdeu SRP.

---

## 5. Decorator para tudo

Se a operação é simples e não precisa de comportamento adicional, não force o padrão.

---

## 6. Cache sem estratégia de invalidação

Cache exige cuidado.

Dado desatualizado pode gerar bug sério.

---

# Parte 21 — Quando usar Decorator

Use Decorator quando:

```text
quer adicionar comportamento sem alterar classe original;
quer empilhar comportamentos;
quer manter mesmo contrato;
quer separar preocupações técnicas;
quer adicionar log;
quer adicionar métrica;
quer adicionar cache;
quer adicionar autorização;
quer criar wrappers testáveis.
```

---

## Quando evitar

Evite Decorator quando:

```text
não há comportamento extra;
a interface não é estável;
a ordem ficaria confusa;
decorators criariam complexidade maior que o problema;
um simples método privado resolveria;
a regra pertence ao domínio, não a um wrapper.
```

---

# Parte 22 — Checklist para aplicar Decorator

Pergunte:

```text
1. Existe uma interface comum?
2. Quero manter o mesmo contrato?
3. Quero adicionar comportamento extra?
4. Esse comportamento pode ficar separado?
5. Posso empilhar mais de um comportamento?
6. A ordem importa?
7. O decorator respeita LSP?
8. Cada decorator tem uma responsabilidade?
9. O service base continua limpo?
10. Estou usando Decorator por necessidade ou por moda?
```

---

# Parte 23 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula234.app.ConsultaPedidoSemDecoratorApp
java -cp out br.com.curso.aula234.app.ConsultaPedidoComDecoratorsApp
java -cp out br.com.curso.aula234.app.ConsultaPedidoAutorizacaoNegadaApp
java -cp out br.com.curso.aula234.app.MensageriaDecoratorApp
```

Depois responda:

```text
1. Qual interface foi decorada na consulta de pedido?
2. Qual classe é a implementação base?
3. Qual decorator adiciona log?
4. Qual decorator adiciona métrica?
5. Qual decorator adiciona cache?
6. Qual decorator adiciona autorização?
7. Por que todos implementam a mesma interface?
8. Por que a ordem dos decorators importa?
9. Qual diferença entre Decorator e Adapter?
10. Quando Decorator seria exagerado?
```

---

# Parte 24 — Exercício prático principal

## Contexto

Crie decorators para um serviço de cálculo de frete.

Interface:

```java
public interface CalculadoraFrete {
    BigDecimal calcular(String cep, BigDecimal valorPedido);
}
```

Implementação base:

```text
CalculadoraFreteBase
```

Regra:

```text
valorPedido >= 1000 -> frete zero;
caso contrário -> 30.00.
```

Decorators:

```text
CalculadoraFreteLogDecorator;
CalculadoraFreteMetricasDecorator;
CalculadoraFreteCacheDecorator;
CalculadoraFreteCepValidacaoDecorator.
```

---

## Regras

## Validação

```text
CEP obrigatório;
CEP deve ter 8 dígitos numéricos.
```

## Cache

```text
chave = cep + valorPedido.
```

## Log

```text
logar início, sucesso e falha.
```

## Métrica

```text
registrar duração e sucesso/falha no console.
```

---

## Apps

Crie:

```text
FreteSemDecoratorApp;
FreteComDecoratorsApp;
FreteCepInvalidoApp.
```

---

## Critérios

```text
service base não deve ter log;
service base não deve ter cache;
service base não deve ter métrica;
validação de CEP deve ficar no decorator;
todos devem implementar CalculadoraFrete;
ordem dos decorators deve ser explicada.
```

---

# Parte 25 — Desafio extra

## Decorator de autorização por perfil

Crie um serviço:

```java
public interface ExportadorRelatorio {
    String exportar(String tipoRelatorio);
}
```

Implementação:

```text
ExportadorRelatorioBase
```

Decorators:

```text
ExportadorRelatorioAutorizacaoDecorator;
ExportadorRelatorioLogDecorator;
ExportadorRelatorioMetricasDecorator.
```

Regra:

```text
somente usuário com permissão EXPORTAR_RELATORIO pode exportar.
```

Apps:

```text
ExportadorRelatorioAutorizadoApp;
ExportadorRelatorioNegadoApp.
```

Objetivo:

```text
praticar decorator de autorização com mesmo contrato.
```

---

# Parte 26 — Simulado rápido

## Questão 1

Decorator Pattern é usado para:

```text
A) adicionar comportamento a um objeto mantendo o mesmo contrato.
B) adaptar contrato externo incompatível.
C) criar objeto com muitos campos.
D) representar estado interno.
```

---

## Questão 2

Um decorator normalmente possui:

```text
A) um delegate da mesma interface.
B) apenas campos static.
C) apenas enum.
D) apenas SQL.
```

---

## Questão 3

Decorator se diferencia de Adapter porque:

```text
A) Decorator mantém o contrato; Adapter muda/adapta contrato.
B) Adapter sempre mede métrica.
C) Decorator sempre salva no banco.
D) Não existe diferença.
```

---

## Questão 4

A ordem dos decorators:

```text
A) pode mudar o comportamento final.
B) nunca importa.
C) é sempre alfabética.
D) é definida pelo compilador.
```

---

## Questão 5

Um decorator de cache precisa cuidado com:

```text
A) invalidação e dado desatualizado.
B) apenas nome do package.
C) apenas comentários.
D) apenas System.out.println.
```

---

## Questão 6

Um bom decorator deve:

```text
A) ter responsabilidade clara e respeitar a interface.
B) concentrar todas as regras do sistema.
C) substituir entidade.
D) mudar o retorno para qualquer tipo.
```

---

## Gabarito

```text
1. A
2. A
3. A
4. A
5. A
6. A
```

---

# Parte 27 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Decorator Pattern.
[ ] Sei criar interface decorada.
[ ] Sei criar implementação base.
[ ] Sei criar decorator base.
[ ] Sei criar decorator de log.
[ ] Sei criar decorator de métricas.
[ ] Sei criar decorator de cache.
[ ] Sei criar decorator de autorização.
[ ] Sei empilhar decorators.
[ ] Sei explicar por que a ordem importa.
[ ] Sei diferenciar Decorator de Adapter.
[ ] Sei diferenciar Decorator de Proxy.
[ ] Sei diferenciar Decorator de Strategy.
[ ] Sei aplicar Decorator em gateway.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Decorator Pattern?
2. Qual problema ele resolve?
3. O que é delegate?
4. Por que decorator implementa a mesma interface?
5. Qual diferença entre Decorator e Adapter?
6. Qual diferença entre Decorator e Proxy?
7. Qual diferença entre Decorator e Strategy?
8. Por que ordem dos decorators importa?
9. Quais cuidados com cache?
10. Como isso aparece em frameworks?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
adicionar log sem alterar service base;
adicionar métrica sem alterar service base;
adicionar cache sem alterar service base;
adicionar autorização sem alterar service base;
decorar um gateway;
empilhar decorators;
explicar riscos de ordem;
resolver exercício de frete;
resolver desafio de relatório.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-234-decorator-pattern-logs-metricas-cache-autorizacao
git commit -m "Aula 234: decorator pattern logs metricas cache autorizacao"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Decorator Pattern adiciona comportamento extra mantendo o mesmo contrato do objeto original.
```

Você estudou:

```text
Decorator Pattern;
delegate;
service base;
decorator base;
log decorator;
metricas decorator;
cache decorator;
autorizacao decorator;
mensageria decorator;
ordem dos decorators;
diferença para Adapter, Proxy e Strategy;
uso em frameworks;
cuidados com cache e autorização.
```

Na próxima aula, vamos estudar:

```text
Proxy Pattern.
```

A ideia será entender controle de acesso, lazy loading, proteção, cache por intermediação e como frameworks usam proxies para segurança, transação e interceptação.
