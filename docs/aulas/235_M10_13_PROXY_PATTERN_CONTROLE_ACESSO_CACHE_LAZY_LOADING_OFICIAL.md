# 235 — M10.13 — Proxy Pattern: controle de acesso, cache e lazy loading

## Objetivo da aula

Na aula anterior, você estudou:

```text
Decorator Pattern
```

Você viu que Decorator adiciona comportamentos extras mantendo o mesmo contrato, como:

```text
log;
métrica;
cache;
autorização;
validação;
observabilidade;
comportamento transversal.
```

Agora vamos estudar um padrão estrutural muito próximo, mas com outra intenção:

```text
Proxy Pattern
```

Em português:

```text
Padrão Procurador
```

Proxy aparece quando você quer colocar um objeto intermediário entre quem chama e o objeto real.

Esse objeto intermediário pode controlar:

```text
acesso;
permissão;
cache;
lazy loading;
proteção;
validação de entrada;
chamada remota;
controle de custo;
controle de instância;
auditoria de acesso;
bloqueio;
rate limit;
circuit breaker;
timeout.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Proxy resolve;
criar uma interface comum;
criar objeto real;
criar proxy que implementa o mesmo contrato;
controlar acesso antes de chamar o objeto real;
aplicar cache via proxy;
aplicar lazy loading via proxy;
diferenciar Proxy de Decorator;
diferenciar Proxy de Adapter;
diferenciar Proxy de Facade;
entender proxy em frameworks;
entender proxy em Spring Security, Spring Transaction e Spring Cache futuramente.
```

---

## Ideia principal

Proxy é um objeto que fica no lugar de outro objeto.

Quem chama pensa que está falando com o objeto real, mas está falando com o proxy.

Exemplo:

```text
Controller futuro
  -> RelatorioServiceProxyAutorizacao
  -> RelatorioServiceProxyCache
  -> RelatorioServiceReal
```

Todos implementam:

```text
RelatorioService
```

O consumidor não precisa saber se existe proxy.

---

## Proxy em uma frase prática

```text
Use Proxy quando quiser controlar o acesso ou a chamada a um objeto real.
```

Ou:

```text
Proxy é um intermediário com o mesmo contrato do objeto real.
```

---

## Problema sem Proxy

Imagine um service caro:

```java
RelatorioDetalhado gerar(String codigo);
```

Ele:

```text
consulta dados;
simula processamento pesado;
monta relatório;
demora;
custa recurso.
```

Depois surgem necessidades:

```text
somente usuário autorizado pode gerar;
se o mesmo relatório for pedido de novo, usar cache;
não criar o service real até ser necessário;
registrar acesso;
controlar erro.
```

Você pode colocar tudo dentro do service real.

Mas isso mistura:

```text
regra principal;
controle de acesso;
cache;
inicialização tardia;
proteção.
```

Proxy separa esse controle.

---

## Relação com SOLID

## SRP

O objeto real cuida da operação real.

O proxy cuida do controle de acesso, cache, lazy loading ou proteção.

---

## OCP

Você pode adicionar um novo proxy sem alterar o objeto real.

---

## LSP

Proxy deve respeitar o mesmo contrato do objeto real.

Quem espera `RelatorioService` deve conseguir usar:

```text
RelatorioServiceReal;
RelatorioServiceProxyCache;
RelatorioServiceProxyAutorizacao;
RelatorioServiceProxyLazy.
```

---

## ISP

A interface proxied deve ser coesa.

Se a interface tem métodos demais, o proxy fica grande demais.

---

## DIP

Quem consome depende da abstração:

```java
RelatorioService
```

E não de:

```java
RelatorioServiceReal
```

Isso permite trocar real por proxy.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Proxy:

```text
Proxy controla acesso ao objeto real.
A entidade continua decidindo.
O use case continua coordenando.
O repository continua salvando.
O client continua integrando.
O controller futuro continua recebendo.
```

Proxy não deve virar regra de negócio principal.

---

# Parte 1 — Proxy vs Decorator

Proxy e Decorator são muito parecidos na estrutura.

Ambos:

```text
implementam a mesma interface;
recebem um objeto delegate;
chamam o objeto real;
podem executar algo antes/depois.
```

A diferença principal é a intenção.

## Decorator

Adiciona comportamento.

```text
log;
métrica;
validação;
enriquecimento.
```

## Proxy

Controla acesso ao objeto real.

```text
autorização;
cache;
lazy loading;
chamada remota;
proteção;
bloqueio;
controle de custo.
```

---

## Exemplo prático

Um cache pode ser visto como decorator ou proxy dependendo da intenção.

Se a intenção for:

```text
adicionar comportamento extra observável
```

pode ser Decorator.

Se a intenção for:

```text
evitar acesso caro ao objeto real
```

pode ser Proxy.

Na prática, os padrões se aproximam.

O importante é entender a intenção.

---

# Parte 2 — Proxy vs Adapter

## Adapter

Traduz interface incompatível.

```text
ExternalPaymentClient -> PagamentoGateway
```

## Proxy

Mantém a mesma interface e controla acesso.

```text
RelatorioService -> RelatorioServiceProxy -> RelatorioServiceReal
```

Diferença prática:

```text
Adapter:
muda/adapta contrato.

Proxy:
mantém contrato e intermedia acesso.
```

---

# Parte 3 — Proxy vs Facade

## Facade

Simplifica acesso a um subsistema complexo.

```text
CheckoutFacade.finalizarCompra(...)
```

## Proxy

Intermedia acesso a um objeto real.

```text
RelatorioServiceProxyCache.gerar(...)
```

Diferença prática:

```text
Facade:
simplifica fluxo complexo.

Proxy:
controla acesso a um objeto real.
```

---

# Parte 4 — Tipos comuns de Proxy

## Protection Proxy

Controla autorização.

```text
somente usuário com permissão pode acessar.
```

## Virtual Proxy

Faz lazy loading.

```text
objeto pesado só é criado quando usado.
```

## Cache Proxy

Evita acessar o objeto real repetidamente.

```text
se já existe no cache, retorna cache.
```

## Remote Proxy

Representa um objeto remoto.

```text
client HTTP, RPC, serviço externo.
```

## Smart Proxy

Adiciona controle inteligente.

```text
contagem de acesso;
rate limit;
timeout;
circuit breaker;
auditoria.
```

---

# Parte 5 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-235-proxy-pattern-controle-acesso-cache-lazy-loading
cd labs\m10\aula-235-proxy-pattern-controle-acesso-cache-lazy-loading
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula235

mkdir src\br\com\curso\aula235\app

mkdir src\br\com\curso\aula235\dominio
mkdir src\br\com\curso\aula235\dominio\relatorio
mkdir src\br\com\curso\aula235\dominio\seguranca
mkdir src\br\com\curso\aula235\dominio\pedido

mkdir src\br\com\curso\aula235\aplicacao
mkdir src\br\com\curso\aula235\aplicacao\service
mkdir src\br\com\curso\aula235\aplicacao\port

mkdir src\br\com\curso\aula235\proxy
mkdir src\br\com\curso\aula235\proxy\relatorio
mkdir src\br\com\curso\aula235\proxy\repository

mkdir src\br\com\curso\aula235\infra
mkdir src\br\com\curso\aula235\infra\repository
```

---

# Parte 6 — Domínio de segurança

## UsuarioAutenticado

Crie:

```text
src\br\com\curso\aula235\dominio\seguranca\UsuarioAutenticado.java
```

Código:

```java
package br.com.curso.aula235.dominio.seguranca;

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
src\br\com\curso\aula235\dominio\seguranca\ContextoSeguranca.java
```

Código:

```java
package br.com.curso.aula235.dominio.seguranca;

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

Esse contexto é apenas para estudo.

Em sistemas reais, permissões são tratadas com framework, token, sessão, claims e roles.

Aqui estamos simplificando para entender Protection Proxy.

---

# Parte 7 — Exemplo 1: Proxy de relatório

## RelatorioDetalhado

Crie:

```text
src\br\com\curso\aula235\dominio\relatorio\RelatorioDetalhado.java
```

Código:

```java
package br.com.curso.aula235.dominio.relatorio;

import java.time.Instant;

public record RelatorioDetalhado(
        String codigo,
        String titulo,
        String conteudo,
        Instant geradoEm
) {
}
```

---

## RelatorioService

Crie a interface:

```text
src\br\com\curso\aula235\aplicacao\service\RelatorioService.java
```

Código:

```java
package br.com.curso.aula235.aplicacao.service;

import br.com.curso.aula235.dominio.relatorio.RelatorioDetalhado;

public interface RelatorioService {
    RelatorioDetalhado gerar(String codigo);
}
```

---

## RelatorioServiceReal

Crie:

```text
src\br\com\curso\aula235\aplicacao\service\RelatorioServiceReal.java
```

Código:

```java
package br.com.curso.aula235.aplicacao.service;

import br.com.curso.aula235.dominio.relatorio.RelatorioDetalhado;

import java.time.Instant;

public class RelatorioServiceReal implements RelatorioService {
    public RelatorioServiceReal() {
        System.out.println("[REAL] RelatorioServiceReal criado.");
    }

    @Override
    public RelatorioDetalhado gerar(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        System.out.println("[REAL] Gerando relatório pesado para: " + codigo);

        simularProcessamentoPesado();

        return new RelatorioDetalhado(
                codigo.trim().toUpperCase(),
                "Relatório detalhado " + codigo.trim().toUpperCase(),
                "Conteúdo detalhado gerado pelo serviço real.",
                Instant.now()
        );
    }

    private void simularProcessamentoPesado() {
        try {
            Thread.sleep(500);
        } catch (InterruptedException erro) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Processamento interrompido.", erro);
        }
    }
}
```

---

# Parte 8 — Protection Proxy

## RelatorioServiceProxyAutorizacao

Crie:

```text
src\br\com\curso\aula235\proxy\relatorio\RelatorioServiceProxyAutorizacao.java
```

Código:

```java
package br.com.curso.aula235.proxy.relatorio;

import br.com.curso.aula235.aplicacao.service.RelatorioService;
import br.com.curso.aula235.dominio.relatorio.RelatorioDetalhado;
import br.com.curso.aula235.dominio.seguranca.ContextoSeguranca;
import br.com.curso.aula235.dominio.seguranca.UsuarioAutenticado;

public class RelatorioServiceProxyAutorizacao implements RelatorioService {
    private static final String PERMISSAO = "GERAR_RELATORIO";

    private final RelatorioService real;

    public RelatorioServiceProxyAutorizacao(RelatorioService real) {
        if (real == null) {
            throw new IllegalArgumentException("Service real é obrigatório.");
        }

        this.real = real;
    }

    @Override
    public RelatorioDetalhado gerar(String codigo) {
        UsuarioAutenticado usuario = ContextoSeguranca.usuarioAtual();

        if (!usuario.temPermissao(PERMISSAO)) {
            throw new SecurityException("Usuário " + usuario.nome() + " não possui permissão " + PERMISSAO + ".");
        }

        System.out.println("[PROXY AUTORIZACAO] Acesso permitido para: " + usuario.nome());

        return real.gerar(codigo);
    }
}
```

---

## RelatorioAutorizacaoProxyApp

Crie:

```text
src\br\com\curso\aula235\app\RelatorioAutorizacaoProxyApp.java
```

Código:

```java
package br.com.curso.aula235.app;

import br.com.curso.aula235.aplicacao.service.RelatorioService;
import br.com.curso.aula235.aplicacao.service.RelatorioServiceReal;
import br.com.curso.aula235.dominio.seguranca.ContextoSeguranca;
import br.com.curso.aula235.dominio.seguranca.UsuarioAutenticado;
import br.com.curso.aula235.proxy.relatorio.RelatorioServiceProxyAutorizacao;

import java.util.Set;

public class RelatorioAutorizacaoProxyApp {
    public static void main(String[] args) {
        ContextoSeguranca.autenticar(new UsuarioAutenticado(
                "thiago",
                Set.of("GERAR_RELATORIO")
        ));

        RelatorioService service = new RelatorioServiceProxyAutorizacao(
                new RelatorioServiceReal()
        );

        System.out.println(service.gerar("REL-001"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula235.app.RelatorioAutorizacaoProxyApp
```

---

## RelatorioAutorizacaoNegadaProxyApp

Crie:

```text
src\br\com\curso\aula235\app\RelatorioAutorizacaoNegadaProxyApp.java
```

Código:

```java
package br.com.curso.aula235.app;

import br.com.curso.aula235.aplicacao.service.RelatorioService;
import br.com.curso.aula235.aplicacao.service.RelatorioServiceReal;
import br.com.curso.aula235.dominio.seguranca.ContextoSeguranca;
import br.com.curso.aula235.dominio.seguranca.UsuarioAutenticado;
import br.com.curso.aula235.proxy.relatorio.RelatorioServiceProxyAutorizacao;

import java.util.Set;

public class RelatorioAutorizacaoNegadaProxyApp {
    public static void main(String[] args) {
        ContextoSeguranca.autenticar(new UsuarioAutenticado(
                "usuario-sem-permissao",
                Set.of()
        ));

        RelatorioService service = new RelatorioServiceProxyAutorizacao(
                new RelatorioServiceReal()
        );

        try {
            System.out.println(service.gerar("REL-002"));
        } catch (RuntimeException erro) {
            System.out.println("Erro esperado: " + erro.getMessage());
        }
    }
}
```

---

# Parte 9 — Cache Proxy

## RelatorioServiceProxyCache

Crie:

```text
src\br\com\curso\aula235\proxy\relatorio\RelatorioServiceProxyCache.java
```

Código:

```java
package br.com.curso.aula235.proxy.relatorio;

import br.com.curso.aula235.aplicacao.service.RelatorioService;
import br.com.curso.aula235.dominio.relatorio.RelatorioDetalhado;

import java.util.HashMap;
import java.util.Map;

public class RelatorioServiceProxyCache implements RelatorioService {
    private final RelatorioService real;
    private final Map<String, RelatorioDetalhado> cache = new HashMap<>();

    public RelatorioServiceProxyCache(RelatorioService real) {
        if (real == null) {
            throw new IllegalArgumentException("Service real é obrigatório.");
        }

        this.real = real;
    }

    @Override
    public RelatorioDetalhado gerar(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String chave = codigo.trim().toUpperCase();

        if (cache.containsKey(chave)) {
            System.out.println("[PROXY CACHE] HIT: " + chave);
            return cache.get(chave);
        }

        System.out.println("[PROXY CACHE] MISS: " + chave);

        RelatorioDetalhado relatorio = real.gerar(chave);

        cache.put(chave, relatorio);

        return relatorio;
    }
}
```

---

## RelatorioCacheProxyApp

Crie:

```text
src\br\com\curso\aula235\app\RelatorioCacheProxyApp.java
```

Código:

```java
package br.com.curso.aula235.app;

import br.com.curso.aula235.aplicacao.service.RelatorioService;
import br.com.curso.aula235.aplicacao.service.RelatorioServiceReal;
import br.com.curso.aula235.proxy.relatorio.RelatorioServiceProxyCache;

public class RelatorioCacheProxyApp {
    public static void main(String[] args) {
        RelatorioService service = new RelatorioServiceProxyCache(
                new RelatorioServiceReal()
        );

        System.out.println(service.gerar("REL-003"));
        System.out.println();
        System.out.println(service.gerar("REL-003"));
    }
}
```

---

## O que observar

Na primeira chamada:

```text
cache miss;
service real é chamado.
```

Na segunda chamada:

```text
cache hit;
service real não é chamado.
```

O proxy controla o acesso ao objeto real.

---

# Parte 10 — Virtual Proxy com lazy loading

Agora vamos criar um proxy que só cria o objeto real quando for necessário.

## RelatorioServiceProxyLazy

Crie:

```text
src\br\com\curso\aula235\proxy\relatorio\RelatorioServiceProxyLazy.java
```

Código:

```java
package br.com.curso.aula235.proxy.relatorio;

import br.com.curso.aula235.aplicacao.service.RelatorioService;
import br.com.curso.aula235.aplicacao.service.RelatorioServiceReal;
import br.com.curso.aula235.dominio.relatorio.RelatorioDetalhado;

public class RelatorioServiceProxyLazy implements RelatorioService {
    private RelatorioService real;

    @Override
    public RelatorioDetalhado gerar(String codigo) {
        if (real == null) {
            System.out.println("[PROXY LAZY] Criando serviço real apenas agora.");
            real = new RelatorioServiceReal();
        }

        return real.gerar(codigo);
    }
}
```

---

## RelatorioLazyProxyApp

Crie:

```text
src\br\com\curso\aula235\app\RelatorioLazyProxyApp.java
```

Código:

```java
package br.com.curso.aula235.app;

import br.com.curso.aula235.aplicacao.service.RelatorioService;
import br.com.curso.aula235.proxy.relatorio.RelatorioServiceProxyLazy;

public class RelatorioLazyProxyApp {
    public static void main(String[] args) {
        System.out.println("Aplicação iniciou.");

        RelatorioService service = new RelatorioServiceProxyLazy();

        System.out.println("Proxy criado, mas service real ainda não.");

        System.out.println(service.gerar("REL-004"));
    }
}
```

---

## O que observar

O objeto real só é criado quando o método `gerar` é chamado.

Isso é útil quando o objeto real:

```text
é pesado;
abre conexão;
carrega configuração;
faz chamada externa;
consome memória;
talvez nem seja usado.
```

---

# Parte 11 — Empilhando proxies

Você pode combinar proxies.

Exemplo:

```text
Autorizacao -> Cache -> Lazy -> Real
```

## RelatorioProxyCombinadoApp

Crie:

```text
src\br\com\curso\aula235\app\RelatorioProxyCombinadoApp.java
```

Código:

```java
package br.com.curso.aula235.app;

import br.com.curso.aula235.aplicacao.service.RelatorioService;
import br.com.curso.aula235.dominio.seguranca.ContextoSeguranca;
import br.com.curso.aula235.dominio.seguranca.UsuarioAutenticado;
import br.com.curso.aula235.proxy.relatorio.RelatorioServiceProxyAutorizacao;
import br.com.curso.aula235.proxy.relatorio.RelatorioServiceProxyCache;
import br.com.curso.aula235.proxy.relatorio.RelatorioServiceProxyLazy;

import java.util.Set;

public class RelatorioProxyCombinadoApp {
    public static void main(String[] args) {
        ContextoSeguranca.autenticar(new UsuarioAutenticado(
                "thiago",
                Set.of("GERAR_RELATORIO")
        ));

        RelatorioService service =
                new RelatorioServiceProxyAutorizacao(
                        new RelatorioServiceProxyCache(
                                new RelatorioServiceProxyLazy()
                        )
                );

        System.out.println(service.gerar("REL-005"));
        System.out.println();
        System.out.println(service.gerar("REL-005"));
    }
}
```

---

## Ordem dos proxies

A ordem muda o comportamento.

Exemplo:

```text
Autorização antes de cache:
usuário sem permissão não acessa nem cache.

Cache antes de autorização:
risco de retornar dado cacheado sem validar permissão.
```

Para segurança, geralmente autorização deve ficar antes de cache.

Regra prática:

```text
controle de acesso costuma ficar mais externo.
```

---

# Parte 12 — Exemplo 2: Repository Proxy

Proxy também aparece em repository.

Vamos criar um proxy de cache para repository.

## Pedido

Crie:

```text
src\br\com\curso\aula235\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula235.dominio.pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class Pedido {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final Instant criadoEm;

    public Pedido(UUID id, String codigo, String cliente, BigDecimal valor, Instant criadoEm) {
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

        if (criadoEm == null) {
            throw new IllegalArgumentException("Data de criação é obrigatória.");
        }

        this.id = id;
        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.valor = valor;
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

    public Instant criadoEm() {
        return criadoEm;
    }

    @Override
    public String toString() {
        return codigo + " | Cliente: " + cliente + " | Valor: " + valor;
    }
}
```

---

## PedidoRepository

Crie:

```text
src\br\com\curso\aula235\aplicacao\port\PedidoRepository.java
```

Código:

```java
package br.com.curso.aula235.aplicacao.port;

import br.com.curso.aula235.dominio.pedido.Pedido;

import java.util.Optional;

public interface PedidoRepository {
    void salvar(Pedido pedido);

    Optional<Pedido> buscarPorCodigo(String codigo);
}
```

---

## PedidoRepositoryMemoria

Crie:

```text
src\br\com\curso\aula235\infra\repository\PedidoRepositoryMemoria.java
```

Código:

```java
package br.com.curso.aula235.infra.repository;

import br.com.curso.aula235.aplicacao.port.PedidoRepository;
import br.com.curso.aula235.dominio.pedido.Pedido;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class PedidoRepositoryMemoria implements PedidoRepository {
    private final List<Pedido> pedidos = new ArrayList<>();

    @Override
    public void salvar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        pedidos.removeIf(item -> item.codigo().equals(pedido.codigo()));
        pedidos.add(pedido);

        System.out.println("[REPOSITORY REAL] Pedido salvo: " + pedido.codigo());
    }

    @Override
    public Optional<Pedido> buscarPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        System.out.println("[REPOSITORY REAL] Buscando pedido: " + normalizado);

        return pedidos.stream()
                .filter(pedido -> pedido.codigo().equals(normalizado))
                .findFirst();
    }
}
```

---

## PedidoRepositoryCacheProxy

Crie:

```text
src\br\com\curso\aula235\proxy\repository\PedidoRepositoryCacheProxy.java
```

Código:

```java
package br.com.curso.aula235.proxy.repository;

import br.com.curso.aula235.aplicacao.port.PedidoRepository;
import br.com.curso.aula235.dominio.pedido.Pedido;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class PedidoRepositoryCacheProxy implements PedidoRepository {
    private final PedidoRepository real;
    private final Map<String, Pedido> cache = new HashMap<>();

    public PedidoRepositoryCacheProxy(PedidoRepository real) {
        if (real == null) {
            throw new IllegalArgumentException("Repository real é obrigatório.");
        }

        this.real = real;
    }

    @Override
    public void salvar(Pedido pedido) {
        real.salvar(pedido);
        cache.put(pedido.codigo(), pedido);
        System.out.println("[REPOSITORY PROXY CACHE] Cache atualizado: " + pedido.codigo());
    }

    @Override
    public Optional<Pedido> buscarPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String chave = codigo.trim().toUpperCase();

        if (cache.containsKey(chave)) {
            System.out.println("[REPOSITORY PROXY CACHE] HIT: " + chave);
            return Optional.of(cache.get(chave));
        }

        System.out.println("[REPOSITORY PROXY CACHE] MISS: " + chave);

        Optional<Pedido> pedido = real.buscarPorCodigo(chave);

        pedido.ifPresent(valor -> cache.put(chave, valor));

        return pedido;
    }
}
```

---

## RepositoryProxyCacheApp

Crie:

```text
src\br\com\curso\aula235\app\RepositoryProxyCacheApp.java
```

Código:

```java
package br.com.curso.aula235.app;

import br.com.curso.aula235.aplicacao.port.PedidoRepository;
import br.com.curso.aula235.dominio.pedido.Pedido;
import br.com.curso.aula235.infra.repository.PedidoRepositoryMemoria;
import br.com.curso.aula235.proxy.repository.PedidoRepositoryCacheProxy;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class RepositoryProxyCacheApp {
    public static void main(String[] args) {
        PedidoRepository repository = new PedidoRepositoryCacheProxy(
                new PedidoRepositoryMemoria()
        );

        repository.salvar(new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana Silva",
                new BigDecimal("1200.00"),
                Instant.now()
        ));

        System.out.println(repository.buscarPorCodigo("PED-001"));
        System.out.println();
        System.out.println(repository.buscarPorCodigo("PED-001"));
    }
}
```

---

# Parte 13 — Proxy em frameworks

Você verá Proxy com frequência em frameworks.

## Spring Transaction

Quando você usa algo como:

```java
@Transactional
public void executar() {
}
```

O Spring normalmente cria um proxy ao redor do bean.

Esse proxy controla:

```text
abrir transação;
executar método real;
commit se sucesso;
rollback se erro.
```

---

## Spring Security

Ao proteger método, o framework pode criar proxy/interceptor para validar autorização antes da execução.

---

## Spring Cache

Ao usar cache declarativo, o framework pode interceptar chamada, verificar cache e evitar execução real.

---

## Lazy Loading em ORM

Bibliotecas de ORM podem criar proxies para carregar dados relacionados apenas quando acessados.

Exemplo conceitual:

```text
pedido.getCliente()
```

pode disparar carregamento tardio do cliente.

---

# Parte 14 — Proxy e front-end

O front não precisa saber se o backend usou proxy.

Exemplo:

```text
GET /relatorios/REL-001
```

O backend pode internamente passar por:

```text
AutorizacaoProxy;
CacheProxy;
LazyProxy;
RelatorioServiceReal.
```

O response continua estável.

Isso protege o contrato externo e permite otimização interna.

---

# Parte 15 — Erros comuns com Proxy

## 1. Proxy mudando contrato

Proxy deve manter o mesmo contrato.

Se mudou contrato, talvez seja Adapter.

---

## 2. Proxy com regra de negócio principal

Proxy deve controlar acesso/chamada.

A regra central deve continuar no objeto real, entidade ou use case.

---

## 3. Cache sem invalidação

Cache errado gera dado velho.

Sempre pense:

```text
quando atualizar?
quando limpar?
qual TTL?
cache por usuário?
cache por tenant?
```

---

## 4. Lazy loading escondendo custo

Lazy loading pode gerar chamadas inesperadas.

Em banco de dados, isso pode virar problema de N+1 queries.

---

## 5. Ordem de proxies insegura

Autorização depois do cache pode ser perigoso.

---

## 6. Proxy para tudo

Nem tudo precisa de proxy.

Se não há controle de acesso, custo, lazy loading ou intermediação, talvez seja exagero.

---

# Parte 16 — Quando usar Proxy

Use Proxy quando:

```text
quer controlar acesso;
quer proteger objeto real;
quer evitar criação pesada antes da hora;
quer cachear resultado;
quer representar recurso remoto;
quer adicionar controle de transação;
quer interceptar chamada;
quer limitar uso;
quer esconder objeto caro.
```

---

## Quando evitar

Evite Proxy quando:

```text
não há controle necessário;
o objeto real é simples;
a camada extra não agrega;
vai dificultar debug sem ganho;
está tentando resolver regra de domínio com proxy.
```

---

# Parte 17 — Checklist para aplicar Proxy

Pergunte:

```text
1. Existe objeto real?
2. Quero controlar acesso a ele?
3. Quero manter o mesmo contrato?
4. Existe custo de criação ou execução?
5. Cache faz sentido?
6. Lazy loading faz sentido?
7. Autorização precisa vir antes de cache?
8. O proxy está respeitando o contrato?
9. O objeto real continua com regra principal?
10. O proxy está resolvendo problema real?
```

---

# Parte 18 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula235.app.RelatorioAutorizacaoProxyApp
java -cp out br.com.curso.aula235.app.RelatorioAutorizacaoNegadaProxyApp
java -cp out br.com.curso.aula235.app.RelatorioCacheProxyApp
java -cp out br.com.curso.aula235.app.RelatorioLazyProxyApp
java -cp out br.com.curso.aula235.app.RelatorioProxyCombinadoApp
java -cp out br.com.curso.aula235.app.RepositoryProxyCacheApp
```

Depois responda:

```text
1. Qual interface foi usada no proxy de relatório?
2. Qual classe é o objeto real?
3. Qual proxy controla autorização?
4. Qual proxy controla cache?
5. Qual proxy faz lazy loading?
6. Por que o consumidor não precisa saber do proxy?
7. Qual diferença entre Proxy e Decorator?
8. Qual diferença entre Proxy e Adapter?
9. Por que a ordem dos proxies importa?
10. Onde esse conceito aparece no Spring?
```

---

# Parte 19 — Exercício prático principal

## Contexto

Crie um proxy para consulta de cliente.

Interface:

```java
public interface ClienteService {
    ClienteDetalhe consultar(String documento);
}
```

Implementação real:

```text
ClienteServiceReal
```

Simule chamada pesada com:

```java
Thread.sleep(300);
```

---

## Proxies

Crie:

```text
ClienteServiceProxyAutorizacao;
ClienteServiceProxyCache;
ClienteServiceProxyLazy;
ClienteServiceProxyRateLimit.
```

---

## Regras

## Autorização

```text
permissão necessária: CONSULTAR_CLIENTE.
```

## Cache

```text
chave = documento normalizado.
```

## Lazy

```text
ClienteServiceReal só deve ser criado na primeira consulta.
```

## Rate limit

```text
permitir no máximo 3 consultas por execução do app.
na quarta, lançar erro.
```

---

## Apps

Crie:

```text
ClienteProxyAutorizadoApp;
ClienteProxyNegadoApp;
ClienteProxyCacheApp;
ClienteProxyLazyApp;
ClienteProxyRateLimitApp;
ClienteProxyCombinadoApp.
```

---

## Critérios

```text
todos implementam ClienteService;
não alterar ClienteServiceReal para adicionar cache;
não alterar ClienteServiceReal para autorização;
não alterar ClienteServiceReal para lazy;
ordem dos proxies deve ser explicada;
autorização deve ficar antes de cache.
```

---

# Parte 20 — Desafio extra

## Proxy de transação

Crie uma interface:

```java
public interface OperacaoFinanceiraService {
    void executar(String codigoOperacao);
}
```

Implementação real:

```text
OperacaoFinanceiraServiceReal
```

Proxy:

```text
OperacaoFinanceiraTransacaoProxy
```

Comportamento:

```text
imprimir [TRANSACAO] abrindo;
chamar real;
se sucesso, imprimir commit;
se erro, imprimir rollback e relançar erro.
```

Crie também:

```text
OperacaoFinanceiraFalhaServiceReal
```

para simular erro.

Apps:

```text
TransacaoProxySucessoApp;
TransacaoProxyFalhaApp.
```

Objetivo:

```text
entender a ideia de proxies transacionais em frameworks.
```

---

# Parte 21 — Simulado rápido

## Questão 1

Proxy Pattern é usado para:

```text
A) controlar acesso a um objeto real mantendo o mesmo contrato.
B) adaptar contrato externo incompatível.
C) criar objeto com muitos campos.
D) representar vários observers.
```

---

## Questão 2

Protection Proxy é usado para:

```text
A) controlar autorização/acesso.
B) montar DTO.
C) parsear CSV.
D) substituir enum.
```

---

## Questão 3

Virtual Proxy é usado para:

```text
A) lazy loading/criação tardia.
B) validar CEP sempre.
C) calcular desconto.
D) montar JSON.
```

---

## Questão 4

Proxy se diferencia de Adapter porque:

```text
A) Proxy mantém contrato; Adapter traduz contrato.
B) Proxy sempre usa banco.
C) Adapter sempre usa cache.
D) Não existe diferença.
```

---

## Questão 5

Ao combinar autorização e cache, normalmente é mais seguro:

```text
A) autorização antes do cache.
B) cache antes da autorização sempre.
C) remover autorização.
D) retornar null.
```

---

## Questão 6

Em frameworks, proxies aparecem em recursos como:

```text
A) transação, segurança, cache e lazy loading.
B) apenas comentários.
C) apenas enums.
D) apenas operadores matemáticos.
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

# Parte 22 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Proxy Pattern.
[ ] Sei criar interface comum.
[ ] Sei criar objeto real.
[ ] Sei criar proxy de autorização.
[ ] Sei criar proxy de cache.
[ ] Sei criar proxy lazy.
[ ] Sei empilhar proxies.
[ ] Sei explicar ordem dos proxies.
[ ] Sei diferenciar Proxy de Decorator.
[ ] Sei diferenciar Proxy de Adapter.
[ ] Sei diferenciar Proxy de Facade.
[ ] Sei explicar proxy em Spring.
[ ] Sei explicar riscos de cache e lazy loading.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Proxy Pattern?
2. Qual problema ele resolve?
3. O que é Protection Proxy?
4. O que é Virtual Proxy?
5. O que é Cache Proxy?
6. Qual diferença entre Proxy e Decorator?
7. Qual diferença entre Proxy e Adapter?
8. Por que autorização antes de cache?
9. Onde Proxy aparece no Spring?
10. Quando Proxy seria exagerado?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar proxy de relatório;
controlar autorização;
adicionar cache por proxy;
usar lazy loading;
combinar proxies;
aplicar proxy em repository;
explicar uso em frameworks;
resolver exercício de cliente;
resolver desafio de transação.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-235-proxy-pattern-controle-acesso-cache-lazy-loading
git commit -m "Aula 235: proxy pattern controle acesso cache lazy loading"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Proxy Pattern coloca um intermediário com o mesmo contrato do objeto real para controlar acesso, cache, criação tardia ou proteção.
```

Você estudou:

```text
Proxy Pattern;
Protection Proxy;
Cache Proxy;
Virtual Proxy;
lazy loading;
repository proxy;
autorização;
ordem de proxies;
diferença para Decorator;
diferença para Adapter;
diferença para Facade;
proxy em frameworks;
Spring Transaction;
Spring Security;
Spring Cache;
lazy loading em ORM.
```

Na próxima aula, vamos estudar:

```text
Composite Pattern.
```

A ideia será modelar estruturas hierárquicas de objetos, como menus, permissões, categorias, árvores, grupos, pacotes de serviços e composições no backend.
