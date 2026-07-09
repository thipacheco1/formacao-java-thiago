# 236 — M10.14 — Composite Pattern: estruturas hierárquicas no backend

## Objetivo da aula

Na aula anterior, você estudou:

```text
Proxy Pattern
```

Você viu que Proxy cria um intermediário com o mesmo contrato do objeto real para controlar:

```text
acesso;
cache;
lazy loading;
proteção;
transação;
segurança;
intermediação de chamadas.
```

Agora vamos estudar outro padrão estrutural muito importante:

```text
Composite Pattern
```

Em português:

```text
Padrão Composto
```

Composite aparece quando você precisa representar estruturas em árvore, onde objetos individuais e grupos de objetos devem ser tratados de forma parecida.

Exemplos comuns em backend:

```text
menu com submenus;
permissões agrupadas;
categorias e subcategorias;
pastas e arquivos;
grupos de serviço;
pacotes de produtos;
árvore organizacional;
centro de custo;
plano de contas;
checklists com seções e perguntas;
estrutura de módulos;
workflow com etapas agrupadas;
composição de regras;
composição de filtros;
hierarquia de times;
árvore de comentários.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Composite resolve;
modelar objetos folha e objetos compostos;
criar uma interface comum;
tratar item simples e grupo de forma uniforme;
calcular total em estruturas hierárquicas;
percorrer árvores;
aplicar Composite em menu;
aplicar Composite em pacote de serviços;
aplicar Composite em permissões;
diferenciar Composite de Decorator;
diferenciar Composite de Facade;
diferenciar Composite de simples List;
entender quando Composite ajuda e quando é exagero.
```

---

## Ideia principal

Composite permite tratar objetos individuais e composições de objetos de forma uniforme.

Exemplo:

```text
Item de menu simples:
- Produtos

Grupo de menu:
- Cadastros
  - Produtos
  - Clientes
  - Contratos
```

Você quer conseguir chamar:

```java
menu.exibir();
```

tanto em um item simples quanto em um grupo.

---

## Composite em uma frase prática

```text
Use Composite quando uma estrutura em árvore tem folhas e grupos que devem ser tratados pelo mesmo contrato.
```

Ou:

```text
Composite modela hierarquias parte-todo.
```

---

## Problema sem Composite

Imagine uma tela com menus.

Você tem:

```text
menu simples;
submenu;
grupo;
subgrupo;
ação final.
```

Sem Composite, o código começa a ter muitos ifs:

```java
if (item.isGrupo()) {
    for (Item filho : item.getFilhos()) {
        if (filho.isGrupo()) {
            ...
        } else {
            ...
        }
    }
} else {
    ...
}
```

Se a profundidade aumentar, o código piora.

Composite resolve isso com polimorfismo.

Cada item sabe como se exibir, calcular ou validar.

---

## Relação com SOLID

## SRP

Cada classe tem responsabilidade clara:

```text
Folha:
representa item final.

Composto:
agrupa filhos e delega operações.

Interface:
define contrato comum.
```

---

## OCP

Você pode criar novos tipos de componentes sem alterar o código que percorre a árvore.

---

## LSP

Uma folha e um composto devem respeitar o mesmo contrato.

Quem usa `ComponenteMenu` pode receber:

```text
ItemMenu;
GrupoMenu.
```

---

## ISP

Cuidado para não colocar métodos na interface que só fazem sentido para compostos.

Exemplo perigoso:

```java
void adicionar(Componente componente);
void remover(Componente componente);
```

Se a folha implementar isso lançando erro, talvez a interface esteja grande demais.

Vamos discutir isso na aula.

---

## DIP

Quem consome depende do contrato:

```text
ComponenteMenu
```

e não das classes concretas.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Composite:

```text
Composite modela estruturas hierárquicas.
A entidade continua protegendo regra.
O use case continua coordenando.
O repository continua persistindo.
O controller futuro retorna ou recebe a estrutura.
```

Composite não deve virar service de aplicação.

---

# Parte 1 — Composite vs simples lista

Nem toda lista é Composite.

Uma lista simples:

```text
Produtos:
- TV
- Geladeira
- Sofá
```

Pode ser apenas:

```java
List<Produto>
```

Composite faz sentido quando existe hierarquia:

```text
Categoria Móveis
  - Sofás
    - Sofá Retrátil
    - Sofá Cama
  - Mesas
    - Mesa de Jantar
```

Ou quando grupo e item precisam ter comportamento comum:

```text
calcular total;
exibir;
validar;
verificar permissão;
contar itens;
gerar árvore.
```

---

# Parte 2 — Composite vs Decorator

## Decorator

Envolve um objeto para adicionar comportamento.

```text
Service com log;
Service com cache;
Service com métrica.
```

## Composite

Agrupa objetos em árvore.

```text
Menu com submenus;
Pacote com serviços;
Categoria com subcategorias.
```

Diferença prática:

```text
Decorator:
envolve um objeto.

Composite:
compõe vários objetos em hierarquia.
```

---

# Parte 3 — Composite vs Facade

## Facade

Simplifica acesso a um subsistema complexo.

```text
CheckoutFacade.finalizarCompra(...)
```

## Composite

Modela uma estrutura parte-todo.

```text
Grupo de serviços contém serviços e outros grupos.
```

Diferença prática:

```text
Facade:
simplifica uma operação.

Composite:
representa árvore de componentes.
```

---

# Parte 4 — Tipos do Composite

O padrão normalmente tem três papéis:

## Component

Contrato comum.

```text
ComponenteMenu
```

## Leaf

Objeto final, sem filhos.

```text
ItemMenu
```

## Composite

Objeto que contém filhos.

```text
GrupoMenu
```

Visualmente:

```text
Componente
├── Leaf
└── Composite
    ├── Leaf
    ├── Leaf
    └── Composite
        └── Leaf
```

---

# Parte 5 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-236-composite-pattern-estruturas-hierarquicas-backend
cd labs\m10\aula-236-composite-pattern-estruturas-hierarquicas-backend
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula236

mkdir src\br\com\curso\aula236\app

mkdir src\br\com\curso\aula236\menu
mkdir src\br\com\curso\aula236\servico
mkdir src\br\com\curso\aula236\permissao
mkdir src\br\com\curso\aula236\categoria

mkdir src\br\com\curso\aula236\util
```

---

# Parte 6 — Exemplo 1: menu hierárquico

Vamos modelar um menu de sistema.

Estrutura desejada:

```text
Kora
  Cadastros
    Produtos
    Clientes
    Contratos
  Operação
    Ordens de Serviço
    Atividades
  Relatórios
    Financeiro
    Atendimento
```

Queremos tratar tudo como:

```text
ComponenteMenu
```

---

## ComponenteMenu

Crie:

```text
src\br\com\curso\aula236\menu\ComponenteMenu.java
```

Código:

```java
package br.com.curso.aula236.menu;

public interface ComponenteMenu {
    String nome();

    void exibir(String indentacao);

    int totalItens();
}
```

---

## ItemMenu

Crie:

```text
src\br\com\curso\aula236\menu\ItemMenu.java
```

Código:

```java
package br.com.curso.aula236.menu;

public class ItemMenu implements ComponenteMenu {
    private final String nome;
    private final String rota;

    public ItemMenu(String nome, String rota) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do menu é obrigatório.");
        }

        if (rota == null || rota.isBlank()) {
            throw new IllegalArgumentException("Rota é obrigatória.");
        }

        this.nome = nome.trim();
        this.rota = rota.trim();
    }

    @Override
    public String nome() {
        return nome;
    }

    public String rota() {
        return rota;
    }

    @Override
    public void exibir(String indentacao) {
        System.out.println(indentacao + "- " + nome + " -> " + rota);
    }

    @Override
    public int totalItens() {
        return 1;
    }
}
```

---

## GrupoMenu

Crie:

```text
src\br\com\curso\aula236\menu\GrupoMenu.java
```

Código:

```java
package br.com.curso.aula236.menu;

import java.util.ArrayList;
import java.util.List;

public class GrupoMenu implements ComponenteMenu {
    private final String nome;
    private final List<ComponenteMenu> filhos = new ArrayList<>();

    public GrupoMenu(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do grupo é obrigatório.");
        }

        this.nome = nome.trim();
    }

    @Override
    public String nome() {
        return nome;
    }

    public GrupoMenu adicionar(ComponenteMenu componente) {
        if (componente == null) {
            throw new IllegalArgumentException("Componente é obrigatório.");
        }

        filhos.add(componente);
        return this;
    }

    public List<ComponenteMenu> filhos() {
        return List.copyOf(filhos);
    }

    @Override
    public void exibir(String indentacao) {
        System.out.println(indentacao + "+ " + nome);

        for (ComponenteMenu filho : filhos) {
            filho.exibir(indentacao + "  ");
        }
    }

    @Override
    public int totalItens() {
        int total = 0;

        for (ComponenteMenu filho : filhos) {
            total += filho.totalItens();
        }

        return total;
    }
}
```

---

## MenuCompositeApp

Crie:

```text
src\br\com\curso\aula236\app\MenuCompositeApp.java
```

Código:

```java
package br.com.curso.aula236.app;

import br.com.curso.aula236.menu.GrupoMenu;
import br.com.curso.aula236.menu.ItemMenu;

public class MenuCompositeApp {
    public static void main(String[] args) {
        GrupoMenu raiz = new GrupoMenu("Kora");

        GrupoMenu cadastros = new GrupoMenu("Cadastros")
                .adicionar(new ItemMenu("Produtos", "/produtos"))
                .adicionar(new ItemMenu("Clientes", "/clientes"))
                .adicionar(new ItemMenu("Contratos", "/contratos"));

        GrupoMenu operacao = new GrupoMenu("Operação")
                .adicionar(new ItemMenu("Ordens de Serviço", "/ordens-servico"))
                .adicionar(new ItemMenu("Atividades", "/atividades"));

        GrupoMenu relatorios = new GrupoMenu("Relatórios")
                .adicionar(new ItemMenu("Financeiro", "/relatorios/financeiro"))
                .adicionar(new ItemMenu("Atendimento", "/relatorios/atendimento"));

        raiz.adicionar(cadastros)
                .adicionar(operacao)
                .adicionar(relatorios);

        raiz.exibir("");

        System.out.println();
        System.out.println("Total de itens finais: " + raiz.totalItens());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula236.app.MenuCompositeApp
```

---

## O que aconteceu

O `GrupoMenu` não precisa saber se o filho é:

```text
ItemMenu;
GrupoMenu;
outro tipo futuro.
```

Ele só chama:

```java
filho.exibir(...)
filho.totalItens()
```

Isso é Composite.

---

# Parte 7 — Exemplo 2: pacote de serviços

Agora vamos para um exemplo muito comum em backend de negócio.

Você pode ter:

```text
serviço simples;
pacote de serviços;
grupo de pacotes;
combo.
```

Exemplo:

```text
Pacote Montagem Completa
  Montagem
  Instalação
  Conferência Técnica

Pacote Premium
  Pacote Montagem Completa
  Garantia Estendida
  Atendimento Prioritário
```

Você quer calcular valor total.

---

## ComponenteServico

Crie:

```text
src\br\com\curso\aula236\servico\ComponenteServico.java
```

Código:

```java
package br.com.curso.aula236.servico;

import java.math.BigDecimal;

public interface ComponenteServico {
    String nome();

    BigDecimal valor();

    void imprimir(String indentacao);
}
```

---

## ServicoSimples

Crie:

```text
src\br\com\curso\aula236\servico\ServicoSimples.java
```

Código:

```java
package br.com.curso.aula236.servico;

import java.math.BigDecimal;

public class ServicoSimples implements ComponenteServico {
    private final String nome;
    private final BigDecimal valor;

    public ServicoSimples(String nome, BigDecimal valor) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do serviço é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valor do serviço não pode ser negativo.");
        }

        this.nome = nome.trim();
        this.valor = valor;
    }

    public ServicoSimples(String nome, String valor) {
        this(nome, new BigDecimal(valor));
    }

    @Override
    public String nome() {
        return nome;
    }

    @Override
    public BigDecimal valor() {
        return valor;
    }

    @Override
    public void imprimir(String indentacao) {
        System.out.println(indentacao + "- " + nome + " | R$ " + valor);
    }
}
```

---

## PacoteServico

Crie:

```text
src\br\com\curso\aula236\servico\PacoteServico.java
```

Código:

```java
package br.com.curso.aula236.servico;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PacoteServico implements ComponenteServico {
    private final String nome;
    private final List<ComponenteServico> componentes = new ArrayList<>();

    public PacoteServico(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do pacote é obrigatório.");
        }

        this.nome = nome.trim();
    }

    public PacoteServico adicionar(ComponenteServico componente) {
        if (componente == null) {
            throw new IllegalArgumentException("Componente é obrigatório.");
        }

        componentes.add(componente);
        return this;
    }

    @Override
    public String nome() {
        return nome;
    }

    @Override
    public BigDecimal valor() {
        BigDecimal total = BigDecimal.ZERO;

        for (ComponenteServico componente : componentes) {
            total = total.add(componente.valor());
        }

        return total;
    }

    @Override
    public void imprimir(String indentacao) {
        System.out.println(indentacao + "+ " + nome + " | Total R$ " + valor());

        for (ComponenteServico componente : componentes) {
            componente.imprimir(indentacao + "  ");
        }
    }

    public List<ComponenteServico> componentes() {
        return List.copyOf(componentes);
    }
}
```

---

## ServicoCompositeApp

Crie:

```text
src\br\com\curso\aula236\app\ServicoCompositeApp.java
```

Código:

```java
package br.com.curso.aula236.app;

import br.com.curso.aula236.servico.ComponenteServico;
import br.com.curso.aula236.servico.PacoteServico;
import br.com.curso.aula236.servico.ServicoSimples;

public class ServicoCompositeApp {
    public static void main(String[] args) {
        ComponenteServico montagemCompleta = new PacoteServico("Montagem Completa")
                .adicionar(new ServicoSimples("Montagem", "120.00"))
                .adicionar(new ServicoSimples("Instalação", "80.00"))
                .adicionar(new ServicoSimples("Conferência Técnica", "50.00"));

        ComponenteServico pacotePremium = new PacoteServico("Pacote Premium")
                .adicionar(montagemCompleta)
                .adicionar(new ServicoSimples("Garantia Estendida", "200.00"))
                .adicionar(new ServicoSimples("Atendimento Prioritário", "150.00"));

        pacotePremium.imprimir("");

        System.out.println();
        System.out.println("Valor total do pacote: R$ " + pacotePremium.valor());
    }
}
```

---

## Análise

`Pacote Premium` contém:

```text
um pacote;
dois serviços simples.
```

Mas todos são tratados como:

```text
ComponenteServico
```

Isso permite compor pacotes dentro de pacotes.

---

# Parte 8 — Exemplo 3: permissões hierárquicas

Agora vamos modelar permissões.

Exemplo:

```text
ADMIN
  PRODUTOS
    PRODUTOS_LISTAR
    PRODUTOS_CRIAR
    PRODUTOS_EDITAR
  CONTRATOS
    CONTRATOS_LISTAR
    CONTRATOS_APROVAR
```

Queremos saber se um grupo contém uma permissão.

---

## ComponentePermissao

Crie:

```text
src\br\com\curso\aula236\permissao\ComponentePermissao.java
```

Código:

```java
package br.com.curso.aula236.permissao;

public interface ComponentePermissao {
    String nome();

    boolean contem(String permissao);

    void imprimir(String indentacao);
}
```

---

## PermissaoSimples

Crie:

```text
src\br\com\curso\aula236\permissao\PermissaoSimples.java
```

Código:

```java
package br.com.curso.aula236.permissao;

public class PermissaoSimples implements ComponentePermissao {
    private final String nome;

    public PermissaoSimples(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome da permissão é obrigatório.");
        }

        this.nome = nome.trim().toUpperCase();
    }

    @Override
    public String nome() {
        return nome;
    }

    @Override
    public boolean contem(String permissao) {
        if (permissao == null || permissao.isBlank()) {
            return false;
        }

        return nome.equals(permissao.trim().toUpperCase());
    }

    @Override
    public void imprimir(String indentacao) {
        System.out.println(indentacao + "- " + nome);
    }
}
```

---

## GrupoPermissao

Crie:

```text
src\br\com\curso\aula236\permissao\GrupoPermissao.java
```

Código:

```java
package br.com.curso.aula236.permissao;

import java.util.ArrayList;
import java.util.List;

public class GrupoPermissao implements ComponentePermissao {
    private final String nome;
    private final List<ComponentePermissao> permissoes = new ArrayList<>();

    public GrupoPermissao(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do grupo é obrigatório.");
        }

        this.nome = nome.trim().toUpperCase();
    }

    public GrupoPermissao adicionar(ComponentePermissao permissao) {
        if (permissao == null) {
            throw new IllegalArgumentException("Permissão é obrigatória.");
        }

        permissoes.add(permissao);
        return this;
    }

    @Override
    public String nome() {
        return nome;
    }

    @Override
    public boolean contem(String permissao) {
        if (nome.equalsIgnoreCase(permissao)) {
            return true;
        }

        for (ComponentePermissao item : permissoes) {
            if (item.contem(permissao)) {
                return true;
            }
        }

        return false;
    }

    @Override
    public void imprimir(String indentacao) {
        System.out.println(indentacao + "+ " + nome);

        for (ComponentePermissao permissao : permissoes) {
            permissao.imprimir(indentacao + "  ");
        }
    }
}
```

---

## PermissaoCompositeApp

Crie:

```text
src\br\com\curso\aula236\app\PermissaoCompositeApp.java
```

Código:

```java
package br.com.curso.aula236.app;

import br.com.curso.aula236.permissao.ComponentePermissao;
import br.com.curso.aula236.permissao.GrupoPermissao;
import br.com.curso.aula236.permissao.PermissaoSimples;

public class PermissaoCompositeApp {
    public static void main(String[] args) {
        ComponentePermissao permissoesProdutos = new GrupoPermissao("PRODUTOS")
                .adicionar(new PermissaoSimples("PRODUTOS_LISTAR"))
                .adicionar(new PermissaoSimples("PRODUTOS_CRIAR"))
                .adicionar(new PermissaoSimples("PRODUTOS_EDITAR"));

        ComponentePermissao permissoesContratos = new GrupoPermissao("CONTRATOS")
                .adicionar(new PermissaoSimples("CONTRATOS_LISTAR"))
                .adicionar(new PermissaoSimples("CONTRATOS_APROVAR"));

        ComponentePermissao admin = new GrupoPermissao("ADMIN")
                .adicionar(permissoesProdutos)
                .adicionar(permissoesContratos);

        admin.imprimir("");

        System.out.println();
        System.out.println("Contém PRODUTOS_EDITAR? " + admin.contem("PRODUTOS_EDITAR"));
        System.out.println("Contém USUARIOS_EXCLUIR? " + admin.contem("USUARIOS_EXCLUIR"));
    }
}
```

---

# Parte 9 — Cuidado com interface inchada

Uma dúvida comum:

```text
Devo colocar adicionar/remover na interface Componente?
```

Exemplo:

```java
public interface Componente {
    void adicionar(Componente componente);
    void remover(Componente componente);
}
```

Problema:

```text
folha não tem filhos.
```

Então a folha teria que fazer:

```java
throw new UnsupportedOperationException();
```

Isso pode violar ISP se usado sem cuidado.

Nesta aula, seguimos uma abordagem mais segura:

```text
a interface comum tem operações realmente comuns;
o método adicionar fica apenas no composto.
```

Exemplo:

```java
GrupoMenu.adicionar(...)
PacoteServico.adicionar(...)
GrupoPermissao.adicionar(...)
```

Mas a interface comum mantém:

```text
exibir;
valor;
contem;
totalItens.
```

Esse desenho costuma ser mais limpo.

---

# Parte 10 — Composite e recursão

Composite normalmente usa recursão.

Exemplo:

```java
public int totalItens() {
    int total = 0;

    for (ComponenteMenu filho : filhos) {
        total += filho.totalItens();
    }

    return total;
}
```

Se o filho for folha:

```text
retorna 1.
```

Se o filho for grupo:

```text
calcula total dos filhos.
```

Isso percorre a árvore inteira.

---

## Cuidado com ciclos

Em árvores reais, cuidado para não criar ciclos:

```text
Grupo A contém Grupo B.
Grupo B contém Grupo A.
```

Isso causaria loop infinito.

Em sistemas reais, você pode precisar validar:

```text
não permitir adicionar pai como filho;
não permitir ciclos;
limitar profundidade;
validar hierarquia antes de salvar.
```

---

# Parte 11 — Composite e persistência

No banco de dados, hierarquias podem ser persistidas de várias formas.

Exemplos:

## Parent ID

```text
categoria_id
nome
categoria_pai_id
```

Simples e comum.

---

## Tabela de fechamento

```text
ancestor_id
descendant_id
depth
```

Útil para consultas rápidas de árvore.

---

## Caminho materializado

```text
/cadastros/produtos/eletrodomesticos
```

Útil para leitura rápida.

---

## JSON

Para algumas estruturas configuráveis:

```json
{
  "nome": "Cadastros",
  "filhos": [
    {
      "nome": "Produtos",
      "rota": "/produtos"
    }
  ]
}
```

Nesta aula, estamos focando no modelo de objetos em Java.

Persistência virá em módulos futuros.

---

# Parte 12 — Composite e front-end

Composite conversa muito com front porque muitas telas usam árvore.

Exemplos de resposta JSON:

```json
{
  "nome": "Kora",
  "tipo": "GRUPO",
  "filhos": [
    {
      "nome": "Cadastros",
      "tipo": "GRUPO",
      "filhos": [
        {
          "nome": "Produtos",
          "tipo": "ITEM",
          "rota": "/produtos"
        }
      ]
    }
  ]
}
```

O backend pode montar a árvore e o front renderiza:

```text
menus;
sidebars;
árvore de categorias;
permissões;
checklists;
grupos.
```

---

# Parte 13 — Erros comuns com Composite

## 1. Usar Composite sem hierarquia

Se é apenas lista simples, `List<T>` resolve.

---

## 2. Interface comum grande demais

Se a folha precisa implementar métodos que não fazem sentido, revise a interface.

---

## 3. Composto com regra demais

Composite representa estrutura.

Regra de aplicação ainda deve ficar no lugar certo.

---

## 4. Permitir ciclos

Ciclos podem quebrar recursão.

---

## 5. Esconder performance

Percorrer árvore grande pode custar caro.

Pense em paginação, cache e consultas otimizadas.

---

## 6. Misturar Composite com DTO sem pensar

Às vezes você precisa de:

```text
modelo de domínio;
DTO de árvore para front.
```

Não necessariamente a mesma classe serve para tudo.

---

# Parte 14 — Quando usar Composite

Use Composite quando:

```text
existe hierarquia;
grupo e item precisam compartilhar contrato;
precisa percorrer árvore;
precisa calcular total recursivo;
precisa exibir estrutura;
precisa validar permissões agrupadas;
precisa compor pacotes;
precisa representar parte-todo.
```

---

## Quando evitar

Evite Composite quando:

```text
é apenas uma lista simples;
não há comportamento comum;
a hierarquia é rasa e sem regra;
a interface ficaria artificial;
DTO simples resolveria melhor;
o custo de complexidade não compensa.
```

---

# Parte 15 — Checklist para aplicar Composite

Pergunte:

```text
1. Existe uma estrutura em árvore?
2. Existem folhas e grupos?
3. Folhas e grupos podem compartilhar contrato?
4. Preciso tratar ambos de forma uniforme?
5. Preciso percorrer recursivamente?
6. Preciso calcular totais na árvore?
7. Preciso exibir árvore?
8. Há risco de ciclo?
9. A interface comum está enxuta?
10. Uma lista simples não resolveria?
```

---

# Parte 16 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula236.app.MenuCompositeApp
java -cp out br.com.curso.aula236.app.ServicoCompositeApp
java -cp out br.com.curso.aula236.app.PermissaoCompositeApp
```

Depois responda:

```text
1. Qual interface representa o componente de menu?
2. Qual classe é folha no menu?
3. Qual classe é composta no menu?
4. Como totalItens funciona?
5. Qual interface representa serviço?
6. Como PacoteServico calcula valor?
7. Como permissões foram agrupadas?
8. Por que adicionar não ficou na interface comum?
9. Qual diferença entre Composite e Decorator?
10. Quando Composite seria exagerado?
```

---

# Parte 17 — Exercício prático principal

## Contexto

Crie Composite para categorias de produtos.

Estrutura:

```text
Móveis
  Sala
    Sofás
    Racks
  Quarto
    Camas
    Guarda-roupas

Eletrodomésticos
  Cozinha
    Geladeiras
    Fogões
```

---

## Interface

Crie:

```java
public interface ComponenteCategoria {
    String nome();
    void imprimir(String indentacao);
    int totalCategorias();
    boolean contem(String nomeCategoria);
}
```

---

## Leaf

Crie:

```text
CategoriaSimples
```

Representa categoria final.

---

## Composite

Crie:

```text
GrupoCategoria
```

Possui lista de `ComponenteCategoria`.

---

## App

Crie:

```text
CategoriaCompositeApp
```

Deve:

```text
montar árvore;
imprimir árvore;
calcular total;
verificar se contém "Sofás";
verificar se contém "Celulares".
```

---

## Critérios

```text
CategoriaSimples não deve ter lista de filhos;
GrupoCategoria deve aceitar filhos;
interface deve ser enxuta;
cálculo deve ser recursivo;
sem if para saber se é grupo ou folha no app.
```

---

# Parte 18 — Desafio extra

## Checklist com seções e perguntas

Modele Composite para checklist.

Estrutura:

```text
Checklist
  Dados do Cliente
    Pergunta: Nome confirmado?
    Pergunta: Telefone confirmado?
  Entrega
    Pergunta: Produto entregue?
    Pergunta: Embalagem íntegra?
  Montagem
    Pergunta: Montagem realizada?
    Pergunta: Cliente aprovou?
```

Interface:

```java
public interface ComponenteChecklist {
    String titulo();
    void imprimir(String indentacao);
    int totalPerguntas();
}
```

Folha:

```text
PerguntaChecklist
```

Composto:

```text
SecaoChecklist
```

Critério:

```text
seção soma total de perguntas dos filhos;
pergunta retorna 1;
seção pode conter outras seções.
```

---

# Parte 19 — Simulado rápido

## Questão 1

Composite Pattern é usado principalmente para:

```text
A) representar hierarquias parte-todo.
B) controlar acesso a objeto real.
C) adaptar API externa.
D) encapsular comando.
```

---

## Questão 2

No Composite, uma folha é:

```text
A) objeto final sem filhos.
B) sempre um banco de dados.
C) sempre um proxy.
D) sempre um controller.
```

---

## Questão 3

No Composite, um composto é:

```text
A) objeto que contém outros componentes.
B) objeto que apenas adapta API externa.
C) objeto que executa command.
D) objeto que representa status.
```

---

## Questão 4

Composite permite tratar folha e grupo:

```text
A) por um contrato comum.
B) sempre com if no app.
C) sem interface.
D) apenas com SQL.
```

---

## Questão 5

Se não existe hierarquia, provavelmente:

```text
A) uma lista simples pode resolver.
B) Composite é obrigatório.
C) Proxy é obrigatório.
D) State é obrigatório.
```

---

## Questão 6

Um risco em estruturas Composite é:

```text
A) criar ciclos e recursão infinita.
B) não conseguir usar String.
C) não conseguir usar BigDecimal.
D) Java não permitir interface.
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

# Parte 20 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Composite Pattern.
[ ] Sei identificar estrutura em árvore.
[ ] Sei criar interface Component.
[ ] Sei criar Leaf.
[ ] Sei criar Composite.
[ ] Sei percorrer árvore.
[ ] Sei calcular total recursivo.
[ ] Sei aplicar em menu.
[ ] Sei aplicar em pacote de serviços.
[ ] Sei aplicar em permissões.
[ ] Sei diferenciar Composite de Decorator.
[ ] Sei diferenciar Composite de Facade.
[ ] Sei evitar interface inchada.
[ ] Sei pensar em persistência de árvore.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Composite Pattern?
2. Qual problema ele resolve?
3. O que é Component?
4. O que é Leaf?
5. O que é Composite?
6. Por que tratar folha e grupo pelo mesmo contrato ajuda?
7. Qual diferença entre Composite e Decorator?
8. Qual diferença entre Composite e Facade?
9. Quais cuidados com ciclos?
10. Quando uma lista simples é melhor?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
modelar árvore de menu;
modelar pacote de serviços;
modelar grupo de permissões;
criar folha e composto;
usar recursão;
calcular totais;
evitar if por tipo no app;
resolver exercício de categorias;
resolver desafio de checklist.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-236-composite-pattern-estruturas-hierarquicas-backend
git commit -m "Aula 236: composite pattern estruturas hierarquicas backend"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Composite Pattern permite tratar objetos individuais e grupos de objetos pelo mesmo contrato em estruturas hierárquicas.
```

Você estudou:

```text
Composite Pattern;
Component;
Leaf;
Composite;
menus;
pacotes de serviço;
permissões;
recursão;
árvores;
cálculo de total;
interface enxuta;
risco de ciclos;
persistência de hierarquia;
conversa com front-end.
```

Na próxima aula, vamos estudar:

```text
Flyweight Pattern.
```

A ideia será reduzir consumo de memória compartilhando objetos repetidos, útil em cenários com muitos objetos parecidos, catálogos, permissões, configurações e dados de referência.
