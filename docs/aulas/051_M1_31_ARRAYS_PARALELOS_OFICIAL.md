# 051 — M1.31 — Arrays Paralelos

## Hoje a aula é sobre vínculo por índice

Arrays paralelos funcionam por uma ideia simples:

```text
o mesmo índice liga informações relacionadas.
```

Exemplo visual:

```text
índice | cliente | valor | status
0      | Ana     | 1000  | PENDENTE
1      | Bruno   | 2500  | APROVADO
2      | Carla   | 5000  | RECUSADO
```

Em Java, isso fica assim:

```java
String[] clientes = {"Ana", "Bruno", "Carla"};
long[] valoresCentavos = {1000L, 2500L, 5000L};
String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};
```

Quando percorremos:

```java
for (int indice = 0; indice < clientes.length; indice++) {
    System.out.println(clientes[indice]);
    System.out.println(valoresCentavos[indice]);
    System.out.println(statusPedidos[indice]);
}
```

Estamos lendo um registro por vez.

A posição do array funciona como ligação entre os dados.

---

## O que são arrays paralelos

Arrays paralelos são dois ou mais arrays que usam o mesmo índice para representar partes diferentes do mesmo registro.

Exemplo:

```java
String[] clientes = {"Ana", "Bruno"};
long[] valores = {1000L, 2500L};
```

Interpretação:

```text
índice 0:
cliente Ana
valor 1000

índice 1:
cliente Bruno
valor 2500
```

Os arrays são separados, mas caminham juntos.

Por isso o nome:

```text
paralelos.
```

Eles andam lado a lado.

---

## Por que arrays paralelos existem na formação

Arrays paralelos ajudam a entender uma limitação.

Eles são úteis didaticamente porque mostram como dados diferentes podem estar relacionados por posição.

Mas também mostram fragilidade.

Exemplo:

```java
String[] clientes = {"Ana", "Bruno", "Carla"};
long[] valores = {1000L, 2500L};
```

Agora temos problema.

Clientes tem 3 posições.

Valores tem 2 posições.

Se percorrermos usando `clientes.length`, quando chegar no índice 2:

```java
valores[2]
```

não existe.

Isso gera erro.

Essa fragilidade prepara a cabeça para objetos.

No futuro, em vez de arrays paralelos, faremos algo como:

```text
Pedido
  cliente
  valor
  status
```

Mas antes de objetos, precisamos entender bem a ligação por índice.

---

## Vocabulário essencial

Termos desta aula:

```text
array paralelo;
índice;
vínculo por índice;
registro;
linha lógica;
cliente;
valor;
status;
desalinhamento;
tamanhos diferentes;
fragilidade;
consistência;
arrays relacionados;
campos;
relatório;
busca por campo;
alteração por índice;
preparação para objetos;
modelo tabular;
linha e coluna.
```

Termos mais importantes:

```text
array paralelo -> arrays diferentes ligados pelo mesmo índice;
vínculo por índice -> a posição 0 de todos os arrays representa o mesmo registro;
registro -> conjunto lógico de informações relacionadas;
desalinhamento -> quando os arrays deixam de ter correspondência correta;
fragilidade -> risco de erro por depender manualmente da posição;
preparação para objetos -> percepção de que dados relacionados deveriam andar juntos.
```

---

## Tabela mental

Arrays paralelos devem ser lidos como uma tabela.

Código:

```java
String[] clientes = {"Ana", "Bruno", "Carla"};
long[] valores = {1000L, 2500L, 5000L};
String[] status = {"PENDENTE", "APROVADO", "RECUSADO"};
```

Tabela mental:

```text
índice | cliente | valor | status
0      | Ana     | 1000  | PENDENTE
1      | Bruno   | 2500  | APROVADO
2      | Carla   | 5000  | RECUSADO
```

Cada índice representa uma linha lógica.

Essa ideia será muito importante na próxima aula de matriz bidimensional.

---

## Primeiro exemplo mínimo digitado do zero

Arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};
        long[] valoresCentavos = {1000L, 2500L, 5000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};

        for (int indice = 0; indice < clientes.length; indice++) {
            System.out.println("Cliente: " + clientes[indice]);
            System.out.println("Valor: " + valoresCentavos[indice]);
            System.out.println("Status: " + statusPedidos[indice]);
            System.out.println("---");
        }
    }
}
```

Compile:

```powershell
javac Main.java
```

Execute:

```powershell
java Main
```

Saída:

```text
Cliente: Ana
Valor: 1000
Status: PENDENTE
---
Cliente: Bruno
Valor: 2500
Status: APROVADO
---
Cliente: Carla
Valor: 5000
Status: RECUSADO
---
```

Esse é o padrão base.

---

## Entendendo o índice

No exemplo:

```java
for (int indice = 0; indice < clientes.length; indice++) {
```

quando `indice` vale 0:

```java
clientes[0]
valoresCentavos[0]
statusPedidos[0]
```

quando `indice` vale 1:

```java
clientes[1]
valoresCentavos[1]
statusPedidos[1]
```

quando `indice` vale 2:

```java
clientes[2]
valoresCentavos[2]
statusPedidos[2]
```

O mesmo índice acessa campos diferentes do mesmo registro lógico.

---

## Relatório em formato de tabela

Arquivo:

```text
RelatorioPedidosParalelos.java
```

Código:

```java
public class RelatorioPedidosParalelos {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};
        long[] valoresCentavos = {1000L, 2500L, 5000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};

        System.out.println("RELATÓRIO DE PEDIDOS");
        System.out.println("====================");

        for (int indice = 0; indice < clientes.length; indice++) {
            System.out.println("Pedido " + (indice + 1));
            System.out.println("Cliente: " + clientes[indice]);
            System.out.println("Valor em centavos: " + valoresCentavos[indice]);
            System.out.println("Status: " + statusPedidos[indice]);
            System.out.println("--------------------");
        }
    }
}
```

Esse exemplo melhora a apresentação.

Um relatório de arrays paralelos deve deixar claro que cada grupo pertence ao mesmo índice.

---

## Cliente, valor e status

A grade desta aula cita explicitamente:

```text
cliente, valor, status
```

Esse trio é excelente para aprender arrays paralelos.

Exemplo:

```java
String[] clientes = {"Maria", "João", "Ana"};
long[] valores = {10000L, 25000L, 18000L};
String[] status = {"PENDENTE", "APROVADO", "CANCELADO"};
```

Leitura:

```text
Maria possui pedido de 10000 centavos com status PENDENTE.
João possui pedido de 25000 centavos com status APROVADO.
Ana possui pedido de 18000 centavos com status CANCELADO.
```

Esses dados deveriam formar um único registro.

Mas, por enquanto, estão separados em arrays.

---

## Por que isso prepara para objetos

Arrays paralelos mostram uma dor.

Temos dados que pertencem juntos:

```text
cliente;
valor;
status.
```

Mas eles estão espalhados:

```java
clientes[indice]
valores[indice]
status[indice]
```

No futuro, com objetos, poderemos representar assim:

```java
Pedido pedido;
```

com campos:

```text
cliente;
valor;
status.
```

Ainda não estamos em objetos.

Mas arrays paralelos já mostram por que objetos existem.

Quando dados andam juntos, faz sentido agrupá-los.

---

## Fragilidade dos arrays paralelos

Arrays paralelos são frágeis porque dependem de alinhamento manual.

Exemplo correto:

```text
índice | cliente | valor | status
0      | Ana     | 1000  | PENDENTE
1      | Bruno   | 2500  | APROVADO
2      | Carla   | 5000  | RECUSADO
```

Se alguém altera apenas um array:

```java
String[] clientes = {"Ana", "Bruno", "Carla"};
long[] valores = {2500L, 1000L, 5000L};
String[] status = {"PENDENTE", "APROVADO", "RECUSADO"};
```

Agora `Ana` ficou ligada ao valor 2500, que talvez fosse de Bruno.

O código compila.

Mas a regra fica errada.

Esse tipo de erro é perigoso porque nem sempre gera exceção.

Ele gera dado incorreto.

---

## Tamanhos diferentes

Outro problema:

```java
String[] clientes = {"Ana", "Bruno", "Carla"};
long[] valores = {1000L, 2500L};
String[] status = {"PENDENTE", "APROVADO", "RECUSADO"};
```

Se percorrer com:

```java
for (int indice = 0; indice < clientes.length; indice++) {
    System.out.println(valores[indice]);
}
```

Quando `indice` for 2:

```java
valores[2]
```

não existe.

Erro:

```text
ArrayIndexOutOfBoundsException.
```

Antes de processar arrays paralelos, precisamos garantir que eles têm o mesmo tamanho.

---

## Validação de tamanhos

Arquivo:

```text
ValidarTamanhosParalelos.java
```

Código:

```java
public class ValidarTamanhosParalelos {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};
        long[] valoresCentavos = {1000L, 2500L, 5000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};

        boolean tamanhosIguais = clientes.length == valoresCentavos.length
                && clientes.length == statusPedidos.length;

        if (!tamanhosIguais) {
            System.out.println("Erro: arrays paralelos com tamanhos diferentes.");
        } else {
            System.out.println("Arrays válidos para processamento.");
        }
    }
}
```

Essa validação evita processamento inseguro.

Regra:

```text
arrays paralelos relacionados devem ter o mesmo tamanho.
```

---

## Processando somente se os tamanhos forem iguais

Arquivo:

```text
RelatorioComValidacaoTamanho.java
```

Código:

```java
public class RelatorioComValidacaoTamanho {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};
        long[] valoresCentavos = {1000L, 2500L, 5000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};

        boolean tamanhosIguais = clientes.length == valoresCentavos.length
                && clientes.length == statusPedidos.length;

        if (!tamanhosIguais) {
            System.out.println("Não é possível gerar relatório. Dados desalinhados.");
        } else {
            for (int indice = 0; indice < clientes.length; indice++) {
                System.out.println(clientes[indice] + " | "
                        + valoresCentavos[indice] + " | "
                        + statusPedidos[indice]);
            }
        }
    }
}
```

Esse é o padrão seguro.

Antes de processar, valida.

Depois processa.

---

## Relatório com soma dos valores

Arquivo:

```text
RelatorioPedidosComTotal.java
```

Código:

```java
public class RelatorioPedidosComTotal {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};
        long[] valoresCentavos = {1000L, 2500L, 5000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};

        boolean tamanhosIguais = clientes.length == valoresCentavos.length
                && clientes.length == statusPedidos.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            long totalCentavos = 0L;

            for (int indice = 0; indice < clientes.length; indice++) {
                System.out.println("Cliente: " + clientes[indice]);
                System.out.println("Valor: " + valoresCentavos[indice]);
                System.out.println("Status: " + statusPedidos[indice]);
                System.out.println("---");

                totalCentavos += valoresCentavos[indice];
            }

            System.out.println("Total em centavos: " + totalCentavos);
        }
    }
}
```

Aqui juntamos arrays paralelos com acumulador.

---

## Total por status

Podemos somar apenas pedidos com determinado status.

Arquivo:

```text
TotalPedidosAprovados.java
```

Código:

```java
public class TotalPedidosAprovados {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla", "Daniel"};
        long[] valoresCentavos = {1000L, 2500L, 5000L, 3000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO", "APROVADO"};

        boolean tamanhosIguais = clientes.length == valoresCentavos.length
                && clientes.length == statusPedidos.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            long totalAprovado = 0L;
            int quantidadeAprovados = 0;

            for (int indice = 0; indice < clientes.length; indice++) {
                if ("APROVADO".equals(statusPedidos[indice])) {
                    totalAprovado += valoresCentavos[indice];
                    quantidadeAprovados++;
                }
            }

            System.out.println("Pedidos aprovados: " + quantidadeAprovados);
            System.out.println("Total aprovado em centavos: " + totalAprovado);
        }
    }
}
```

Esse exemplo combina:

```text
String[];
long[];
status;
equals;
soma condicional;
contador.
```

---

## Contagem por status

Arquivo:

```text
ContagemStatusParalelos.java
```

Código:

```java
public class ContagemStatusParalelos {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla", "Daniel", "Eva"};
        long[] valoresCentavos = {1000L, 2500L, 5000L, 3000L, 7000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO", "APROVADO", "PENDENTE"};

        boolean tamanhosIguais = clientes.length == valoresCentavos.length
                && clientes.length == statusPedidos.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            int pendentes = 0;
            int aprovados = 0;
            int recusados = 0;
            int outros = 0;

            for (int indice = 0; indice < clientes.length; indice++) {
                if ("PENDENTE".equals(statusPedidos[indice])) {
                    pendentes++;
                } else if ("APROVADO".equals(statusPedidos[indice])) {
                    aprovados++;
                } else if ("RECUSADO".equals(statusPedidos[indice])) {
                    recusados++;
                } else {
                    outros++;
                }
            }

            System.out.println("Pendentes: " + pendentes);
            System.out.println("Aprovados: " + aprovados);
            System.out.println("Recusados: " + recusados);
            System.out.println("Outros: " + outros);
        }
    }
}
```

Esse padrão é muito comum em relatórios operacionais.

---

## Busca por cliente

Arquivo:

```text
BuscarPedidoPorCliente.java
```

Código:

```java
import java.util.Scanner;

public class BuscarPedidoPorCliente {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String[] clientes = {"Ana", "Bruno", "Carla"};
        long[] valoresCentavos = {1000L, 2500L, 5000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};

        boolean tamanhosIguais = clientes.length == valoresCentavos.length
                && clientes.length == statusPedidos.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            System.out.println("Digite o nome do cliente:");
            String clienteProcurado = scanner.nextLine().trim();

            int indiceEncontrado = -1;

            for (int indice = 0; indice < clientes.length; indice++) {
                if (clienteProcurado.equalsIgnoreCase(clientes[indice])) {
                    indiceEncontrado = indice;
                    break;
                }
            }

            if (indiceEncontrado == -1) {
                System.out.println("Cliente não encontrado.");
            } else {
                System.out.println("Cliente: " + clientes[indiceEncontrado]);
                System.out.println("Valor: " + valoresCentavos[indiceEncontrado]);
                System.out.println("Status: " + statusPedidos[indiceEncontrado]);
            }
        }

        scanner.close();
    }
}
```

Esse exemplo usa o índice encontrado em todos os arrays.

---

## Busca por status e listagem

Às vezes queremos listar todos com um status.

Arquivo:

```text
ListarPedidosPorStatus.java
```

Código:

```java
import java.util.Scanner;

public class ListarPedidosPorStatus {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String[] clientes = {"Ana", "Bruno", "Carla", "Daniel"};
        long[] valoresCentavos = {1000L, 2500L, 5000L, 3000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO", "APROVADO"};

        boolean tamanhosIguais = clientes.length == valoresCentavos.length
                && clientes.length == statusPedidos.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            System.out.println("Digite o status para listar:");
            String statusProcurado = scanner.nextLine().trim().toUpperCase();

            int encontrados = 0;

            for (int indice = 0; indice < clientes.length; indice++) {
                if (statusProcurado.equals(statusPedidos[indice])) {
                    System.out.println("Cliente: " + clientes[indice]);
                    System.out.println("Valor: " + valoresCentavos[indice]);
                    System.out.println("Status: " + statusPedidos[indice]);
                    System.out.println("---");
                    encontrados++;
                }
            }

            System.out.println("Total encontrado: " + encontrados);
        }

        scanner.close();
    }
}
```

Aqui não usamos `break`.

Queremos listar todos.

---

## Alterar status por cliente

Arquivo:

```text
AlterarStatusPorCliente.java
```

Código:

```java
import java.util.Scanner;

public class AlterarStatusPorCliente {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String[] clientes = {"Ana", "Bruno", "Carla"};
        long[] valoresCentavos = {1000L, 2500L, 5000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};

        boolean tamanhosIguais = clientes.length == valoresCentavos.length
                && clientes.length == statusPedidos.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            System.out.println("Digite o cliente para alterar status:");
            String clienteProcurado = scanner.nextLine().trim();

            int indiceEncontrado = -1;

            for (int indice = 0; indice < clientes.length; indice++) {
                if (clienteProcurado.equalsIgnoreCase(clientes[indice])) {
                    indiceEncontrado = indice;
                    break;
                }
            }

            if (indiceEncontrado == -1) {
                System.out.println("Cliente não encontrado.");
            } else {
                System.out.println("Digite o novo status:");
                String novoStatus = scanner.nextLine().trim().toUpperCase();

                boolean statusValido = "PENDENTE".equals(novoStatus)
                        || "APROVADO".equals(novoStatus)
                        || "RECUSADO".equals(novoStatus)
                        || "CANCELADO".equals(novoStatus);

                if (!statusValido) {
                    System.out.println("Status inválido.");
                } else {
                    String statusAntigo = statusPedidos[indiceEncontrado];
                    statusPedidos[indiceEncontrado] = novoStatus;

                    System.out.println("Status alterado.");
                    System.out.println("Cliente: " + clientes[indiceEncontrado]);
                    System.out.println("Valor: " + valoresCentavos[indiceEncontrado]);
                    System.out.println("Status antigo: " + statusAntigo);
                    System.out.println("Status novo: " + statusPedidos[indiceEncontrado]);
                }
            }
        }

        scanner.close();
    }
}
```

Esse exemplo combina:

```text
busca textual;
índice encontrado;
alteração de array paralelo;
validação de status;
valor antigo;
valor novo.
```

---

## Validar campos relacionados

Quando usamos arrays paralelos, precisamos validar cada registro lógico.

Exemplo:

```text
cliente não pode estar em branco;
valor precisa ser maior que zero;
status precisa ser conhecido.
```

Arquivo:

```text
ValidarRegistrosParalelos.java
```

Código:

```java
public class ValidarRegistrosParalelos {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "", "Carla"};
        long[] valoresCentavos = {1000L, -2500L, 5000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "XYZ"};

        boolean tamanhosIguais = clientes.length == valoresCentavos.length
                && clientes.length == statusPedidos.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            int registrosInvalidos = 0;

            for (int indice = 0; indice < clientes.length; indice++) {
                boolean clienteInvalido = clientes[indice] == null || clientes[indice].isBlank();
                boolean valorInvalido = valoresCentavos[indice] <= 0;
                boolean statusValido = "PENDENTE".equals(statusPedidos[indice])
                        || "APROVADO".equals(statusPedidos[indice])
                        || "RECUSADO".equals(statusPedidos[indice])
                        || "CANCELADO".equals(statusPedidos[indice]);

                if (clienteInvalido || valorInvalido || !statusValido) {
                    registrosInvalidos++;
                    System.out.println("Registro inválido na posição " + (indice + 1));
                }
            }

            System.out.println("Total de registros inválidos: " + registrosInvalidos);
        }
    }
}
```

Aqui validamos o registro como conjunto.

---

## Melhorando a validação com mensagens específicas

Arquivo:

```text
ValidarRegistrosComDetalhe.java
```

Código:

```java
public class ValidarRegistrosComDetalhe {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "", "Carla"};
        long[] valoresCentavos = {1000L, -2500L, 5000L};
        String[] statusPedidos = {"PENDENTE", "APROVADO", "XYZ"};

        boolean tamanhosIguais = clientes.length == valoresCentavos.length
                && clientes.length == statusPedidos.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            int registrosInvalidos = 0;

            for (int indice = 0; indice < clientes.length; indice++) {
                boolean possuiErro = false;

                if (clientes[indice] == null || clientes[indice].isBlank()) {
                    System.out.println("Cliente inválido na posição " + (indice + 1));
                    possuiErro = true;
                }

                if (valoresCentavos[indice] <= 0) {
                    System.out.println("Valor inválido na posição " + (indice + 1));
                    possuiErro = true;
                }

                boolean statusValido = "PENDENTE".equals(statusPedidos[indice])
                        || "APROVADO".equals(statusPedidos[indice])
                        || "RECUSADO".equals(statusPedidos[indice])
                        || "CANCELADO".equals(statusPedidos[indice]);

                if (!statusValido) {
                    System.out.println("Status inválido na posição " + (indice + 1));
                    possuiErro = true;
                }

                if (possuiErro) {
                    registrosInvalidos++;
                }
            }

            System.out.println("Total de registros inválidos: " + registrosInvalidos);
        }
    }
}
```

Mensagem específica ajuda no diagnóstico.

Isso é importante em sistemas reais.

---

## Exemplo aplicado: produtos e estoques

Arquivo:

```text
ProdutosEstoquesParalelos.java
```

Código:

```java
public class ProdutosEstoquesParalelos {
    public static void main(String[] args) {
        String[] produtos = {"Mesa", "Cadeira", "Sofá"};
        int[] estoques = {10, 0, 5};
        String[] statusProdutos = {"ATIVO", "ATIVO", "INATIVO"};

        boolean tamanhosIguais = produtos.length == estoques.length
                && produtos.length == statusProdutos.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            for (int indice = 0; indice < produtos.length; indice++) {
                System.out.println("Produto: " + produtos[indice]);
                System.out.println("Estoque: " + estoques[indice]);
                System.out.println("Status: " + statusProdutos[indice]);
                System.out.println("---");
            }
        }
    }
}
```

Esse exemplo usa:

```text
produto;
estoque;
status.
```

---

## Exemplo aplicado: produtos sem estoque

Arquivo:

```text
ProdutosSemEstoqueParalelos.java
```

Código:

```java
public class ProdutosSemEstoqueParalelos {
    public static void main(String[] args) {
        String[] produtos = {"Mesa", "Cadeira", "Sofá"};
        int[] estoques = {10, 0, 5};
        String[] statusProdutos = {"ATIVO", "ATIVO", "INATIVO"};

        boolean tamanhosIguais = produtos.length == estoques.length
                && produtos.length == statusProdutos.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            int semEstoque = 0;

            for (int indice = 0; indice < produtos.length; indice++) {
                if (estoques[indice] == 0 && "ATIVO".equals(statusProdutos[indice])) {
                    System.out.println("Produto ativo sem estoque: " + produtos[indice]);
                    semEstoque++;
                }
            }

            System.out.println("Total de produtos ativos sem estoque: " + semEstoque);
        }
    }
}
```

Aqui a regra depende de dois arrays:

```text
estoque;
status.
```

E o relatório usa o terceiro:

```text
produto.
```

Isso é array paralelo na prática.

---

## Exemplo aplicado: OS, atividades e status

Arquivo:

```text
OrdensServicoParalelas.java
```

Código:

```java
public class OrdensServicoParalelas {
    public static void main(String[] args) {
        String[] certificados = {"OS-001", "OS-002", "OS-003"};
        int[] atividades = {2, 4, 1};
        String[] statusOs = {"ABERTA", "CONCLUIDA", "ABERTA"};

        boolean tamanhosIguais = certificados.length == atividades.length
                && certificados.length == statusOs.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            for (int indice = 0; indice < certificados.length; indice++) {
                System.out.println("Certificado: " + certificados[indice]);
                System.out.println("Atividades: " + atividades[indice]);
                System.out.println("Status: " + statusOs[indice]);
                System.out.println("---");
            }
        }
    }
}
```

Esse exemplo usa arrays paralelos para representar dados operacionais.

---

## Total de atividades por status de OS

Arquivo:

```text
TotalAtividadesOsAbertas.java
```

Código:

```java
public class TotalAtividadesOsAbertas {
    public static void main(String[] args) {
        String[] certificados = {"OS-001", "OS-002", "OS-003"};
        int[] atividades = {2, 4, 1};
        String[] statusOs = {"ABERTA", "CONCLUIDA", "ABERTA"};

        boolean tamanhosIguais = certificados.length == atividades.length
                && certificados.length == statusOs.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            int totalAtividadesAbertas = 0;

            for (int indice = 0; indice < certificados.length; indice++) {
                if ("ABERTA".equals(statusOs[indice])) {
                    totalAtividadesAbertas += atividades[indice];
                }
            }

            System.out.println("Total de atividades em OS abertas: " + totalAtividadesAbertas);
        }
    }
}
```

Esse exemplo combina:

```text
String[];
int[];
status;
soma condicional.
```

---

## Exemplo aplicado: mensageria

Arquivo:

```text
MensageriaParalela.java
```

Código:

```java
public class MensageriaParalela {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};
        String[] tiposMensagem = {"BOAS_VINDAS", "ENTREGA", "NPS"};
        int[] tentativas = {1, 3, 2};

        boolean tamanhosIguais = clientes.length == tiposMensagem.length
                && clientes.length == tentativas.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            for (int indice = 0; indice < clientes.length; indice++) {
                System.out.println("Cliente: " + clientes[indice]);
                System.out.println("Tipo: " + tiposMensagem[indice]);
                System.out.println("Tentativas: " + tentativas[indice]);
                System.out.println("---");
            }
        }
    }
}
```

Esse exemplo representa mensagens por cliente.

---

## Mensagens com muitas tentativas

Arquivo:

```text
MensagensComMuitasTentativas.java
```

Código:

```java
public class MensagensComMuitasTentativas {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};
        String[] tiposMensagem = {"BOAS_VINDAS", "ENTREGA", "NPS"};
        int[] tentativas = {1, 3, 5};

        boolean tamanhosIguais = clientes.length == tiposMensagem.length
                && clientes.length == tentativas.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            int limite = 2;
            int acimaDoLimite = 0;

            for (int indice = 0; indice < clientes.length; indice++) {
                if (tentativas[indice] > limite) {
                    System.out.println("Cliente: " + clientes[indice]);
                    System.out.println("Tipo: " + tiposMensagem[indice]);
                    System.out.println("Tentativas: " + tentativas[indice]);
                    System.out.println("---");
                    acimaDoLimite++;
                }
            }

            System.out.println("Mensagens acima do limite: " + acimaDoLimite);
        }
    }
}
```

Esse é um relatório de alerta.

---

## Exemplo aplicado: auditoria

Arquivo:

```text
AuditoriaParalela.java
```

Código:

```java
public class AuditoriaParalela {
    public static void main(String[] args) {
        String[] usuarios = {"aline", "jackson", "guilherme"};
        String[] operacoes = {"CRIACAO", "EDICAO", "EXCLUSAO"};
        String[] status = {"SUCESSO", "SUCESSO", "RECUSADO"};

        boolean tamanhosIguais = usuarios.length == operacoes.length
                && usuarios.length == status.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            for (int indice = 0; indice < usuarios.length; indice++) {
                System.out.println("Usuário: " + usuarios[indice]);
                System.out.println("Operação: " + operacoes[indice]);
                System.out.println("Status: " + status[indice]);
                System.out.println("---");
            }
        }
    }
}
```

Esse exemplo representa eventos de auditoria.

---

## Contagem de operações de auditoria

Arquivo:

```text
ContagemAuditoriaParalela.java
```

Código:

```java
public class ContagemAuditoriaParalela {
    public static void main(String[] args) {
        String[] usuarios = {"aline", "jackson", "guilherme", "aline"};
        String[] operacoes = {"CRIACAO", "EDICAO", "EXCLUSAO", "EDICAO"};
        String[] status = {"SUCESSO", "SUCESSO", "RECUSADO", "SUCESSO"};

        boolean tamanhosIguais = usuarios.length == operacoes.length
                && usuarios.length == status.length;

        if (!tamanhosIguais) {
            System.out.println("Dados inconsistentes.");
        } else {
            int edicoesComSucesso = 0;

            for (int indice = 0; indice < usuarios.length; indice++) {
                if ("EDICAO".equals(operacoes[indice]) && "SUCESSO".equals(status[indice])) {
                    edicoesComSucesso++;
                }
            }

            System.out.println("Edições com sucesso: " + edicoesComSucesso);
        }
    }
}
```

A regra usa dois campos:

```text
operação;
status.
```

---

## Preenchendo arrays paralelos com Scanner

Arquivo:

```text
PreencherPedidosParalelos.java
```

Código:

```java
import java.util.Scanner;

public class PreencherPedidosParalelos {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantos pedidos deseja cadastrar?");
        int quantidade = scanner.nextInt();

        while (quantidade <= 0) {
            System.out.println("Quantidade inválida. Digite valor maior que zero:");
            quantidade = scanner.nextInt();
        }

        scanner.nextLine();

        String[] clientes = new String[quantidade];
        long[] valoresCentavos = new long[quantidade];
        String[] statusPedidos = new String[quantidade];

        for (int indice = 0; indice < quantidade; indice++) {
            do {
                System.out.println("Cliente do pedido " + (indice + 1) + ":");
                clientes[indice] = scanner.nextLine().trim();

                if (clientes[indice].isBlank()) {
                    System.out.println("Cliente obrigatório.");
                }
            } while (clientes[indice].isBlank());

            do {
                System.out.println("Valor em centavos:");
                valoresCentavos[indice] = scanner.nextLong();

                if (valoresCentavos[indice] <= 0) {
                    System.out.println("Valor deve ser maior que zero.");
                }
            } while (valoresCentavos[indice] <= 0);

            scanner.nextLine();

            do {
                System.out.println("Status: PENDENTE, APROVADO, RECUSADO ou CANCELADO");
                statusPedidos[indice] = scanner.nextLine().trim().toUpperCase();

                boolean statusValido = "PENDENTE".equals(statusPedidos[indice])
                        || "APROVADO".equals(statusPedidos[indice])
                        || "RECUSADO".equals(statusPedidos[indice])
                        || "CANCELADO".equals(statusPedidos[indice]);

                if (!statusValido) {
                    System.out.println("Status inválido.");
                }
            } while (!"PENDENTE".equals(statusPedidos[indice])
                    && !"APROVADO".equals(statusPedidos[indice])
                    && !"RECUSADO".equals(statusPedidos[indice])
                    && !"CANCELADO".equals(statusPedidos[indice]));
        }

        System.out.println("Pedidos cadastrados:");

        for (int indice = 0; indice < quantidade; indice++) {
            System.out.println(clientes[indice] + " | "
                    + valoresCentavos[indice] + " | "
                    + statusPedidos[indice]);
        }

        scanner.close();
    }
}
```

Esse exemplo é maior, mas muito importante.

Ele mostra preenchimento de vários arrays mantendo o mesmo índice.

---

## Melhorando a validação de status com boolean atualizado

No exemplo anterior, repetimos a condição no `while`.

Podemos melhorar.

Arquivo:

```text
PreencherPedidosParalelosMelhorado.java
```

Código:

```java
import java.util.Scanner;

public class PreencherPedidosParalelosMelhorado {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Quantos pedidos deseja cadastrar?");
        int quantidade = scanner.nextInt();

        while (quantidade <= 0) {
            System.out.println("Quantidade inválida. Digite valor maior que zero:");
            quantidade = scanner.nextInt();
        }

        scanner.nextLine();

        String[] clientes = new String[quantidade];
        long[] valoresCentavos = new long[quantidade];
        String[] statusPedidos = new String[quantidade];

        for (int indice = 0; indice < quantidade; indice++) {
            do {
                System.out.println("Cliente do pedido " + (indice + 1) + ":");
                clientes[indice] = scanner.nextLine().trim();

                if (clientes[indice].isBlank()) {
                    System.out.println("Cliente obrigatório.");
                }
            } while (clientes[indice].isBlank());

            do {
                System.out.println("Valor em centavos:");
                valoresCentavos[indice] = scanner.nextLong();

                if (valoresCentavos[indice] <= 0) {
                    System.out.println("Valor deve ser maior que zero.");
                }
            } while (valoresCentavos[indice] <= 0);

            scanner.nextLine();

            boolean statusValido;

            do {
                System.out.println("Status: PENDENTE, APROVADO, RECUSADO ou CANCELADO");
                statusPedidos[indice] = scanner.nextLine().trim().toUpperCase();

                statusValido = "PENDENTE".equals(statusPedidos[indice])
                        || "APROVADO".equals(statusPedidos[indice])
                        || "RECUSADO".equals(statusPedidos[indice])
                        || "CANCELADO".equals(statusPedidos[indice]);

                if (!statusValido) {
                    System.out.println("Status inválido.");
                }
            } while (!statusValido);
        }

        long totalCentavos = 0L;

        for (int indice = 0; indice < quantidade; indice++) {
            totalCentavos += valoresCentavos[indice];
        }

        System.out.println("Total dos pedidos em centavos: " + totalCentavos);

        scanner.close();
    }
}
```

Essa versão usa `statusValido` com clareza.

---

## Problema de desalinhamento lógico

O erro mais perigoso em arrays paralelos não é sempre exceção.

Às vezes o programa roda, mas com dados trocados.

Exemplo:

```java
String[] clientes = {"Ana", "Bruno", "Carla"};
long[] valoresCentavos = {5000L, 1000L, 2500L};
String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};
```

O código roda.

Mas talvez os valores estejam associados aos clientes errados.

Esse erro é de lógica.

O compilador não identifica.

Por isso, arrays paralelos são frágeis.

---

## Como reduzir risco enquanto ainda usamos arrays paralelos

Algumas práticas ajudam:

```text
criar arrays com o mesmo tamanho;
preencher todos os arrays no mesmo loop;
não ordenar apenas um dos arrays;
não remover item de apenas um array;
validar tamanhos antes de processar;
usar nomes claros;
gerar relatórios para conferir;
usar o mesmo índice com disciplina;
não passar arrays paralelos para muitos lugares.
```

Mesmo assim, essa abordagem tem limite.

O próximo grande passo do curso será entender objetos.

Objetos resolvem essa fragilidade agrupando dados relacionados.

---

## Ordenação parcial é perigosa

Imagine ordenar apenas clientes:

```text
clientes ordenados alfabeticamente;
valores e status continuam na ordem antiga.
```

Agora o vínculo por índice quebra.

Exemplo:

```text
antes:
Ana -> 1000
Bruno -> 2500

depois de ordenar só clientes:
Ana -> 2500
Bruno -> 1000
```

Esse tipo de erro é muito comum quando se usa arrays paralelos sem cuidado.

Regra:

```text
se alterar a ordem de um array paralelo, precisa alterar todos os arrays relacionados da mesma forma.
```

Ainda não vamos implementar ordenação.

O alerta é conceitual.

---

## Erros comuns

### Erro 1 — Arrays com tamanhos diferentes

Pode causar:

```text
ArrayIndexOutOfBoundsException.
```

Valide os tamanhos antes.

---

### Erro 2 — Percorrer usando o length do array errado

Se os arrays deveriam ter mesmo tamanho, valide.

Depois escolha um array principal.

Exemplo:

```java
for (int indice = 0; indice < clientes.length; indice++)
```

---

### Erro 3 — Alterar apenas um array e quebrar o vínculo

Se trocar ordem ou remover logicamente em um array, os outros ficam desalinhados.

---

### Erro 4 — Buscar em um array e usar índice em outro sem validar tamanhos

Só use o índice encontrado em outro array se os arrays estão alinhados.

---

### Erro 5 — Usar status sem normalizar

Entrada:

```text
aprovado
```

não é igual a:

```text
APROVADO
```

Use:

```java
trim().toUpperCase()
```

---

### Erro 6 — Comparar String com `==`

Use:

```java
"APROVADO".equals(statusPedidos[indice])
```

---

### Erro 7 — Não validar campos obrigatórios

Cliente vazio, valor negativo ou status desconhecido criam registro inválido.

---

### Erro 8 — Esquecer scanner.nextLine após nextInt ou nextLong

Ao misturar número e texto, limpe a quebra de linha.

---

### Erro 9 — Achar que arrays paralelos são solução final

Eles são didáticos e úteis em situações simples.

Mas em sistemas maiores, objetos serão melhores.

---

### Erro 10 — Não explicar a relação por índice

Se outra pessoa não entende que índice 2 liga cliente, valor e status, ela pode quebrar o código.

Documente e nomeie bem.

---

## Atividade guiada

Crie a pasta:

```powershell
mkdir labs\m1\aula-051-arrays-paralelos
cd labs\m1\aula-051-arrays-paralelos
```

Crie arquivos:

```text
Main.java
RelatorioPedidosParalelos.java
ValidarTamanhosParalelos.java
RelatorioComValidacaoTamanho.java
RelatorioPedidosComTotal.java
TotalPedidosAprovados.java
ContagemStatusParalelos.java
BuscarPedidoPorCliente.java
ListarPedidosPorStatus.java
AlterarStatusPorCliente.java
ValidarRegistrosParalelos.java
ValidarRegistrosComDetalhe.java
ProdutosEstoquesParalelos.java
ProdutosSemEstoqueParalelos.java
OrdensServicoParalelas.java
TotalAtividadesOsAbertas.java
MensageriaParalela.java
MensagensComMuitasTentativas.java
AuditoriaParalela.java
ContagemAuditoriaParalela.java
PreencherPedidosParalelos.java
PreencherPedidosParalelosMelhorado.java
ErroTamanhosDiferentes.java
ErroValorDesalinhado.java
ErroStringComIgualIgual.java
ErroBuscaSemValidarPosicao.java
ErroNextLine.java
```

Compile:

```powershell
javac Main.java
javac RelatorioPedidosParalelos.java
javac ValidarTamanhosParalelos.java
javac RelatorioComValidacaoTamanho.java
javac RelatorioPedidosComTotal.java
javac TotalPedidosAprovados.java
javac ContagemStatusParalelos.java
javac BuscarPedidoPorCliente.java
javac ListarPedidosPorStatus.java
javac AlterarStatusPorCliente.java
javac ValidarRegistrosParalelos.java
javac ValidarRegistrosComDetalhe.java
javac ProdutosEstoquesParalelos.java
javac ProdutosSemEstoqueParalelos.java
javac OrdensServicoParalelas.java
javac TotalAtividadesOsAbertas.java
javac MensageriaParalela.java
javac MensagensComMuitasTentativas.java
javac AuditoriaParalela.java
javac ContagemAuditoriaParalela.java
javac PreencherPedidosParalelos.java
javac PreencherPedidosParalelosMelhorado.java
javac ErroTamanhosDiferentes.java
javac ErroValorDesalinhado.java
javac ErroStringComIgualIgual.java
javac ErroBuscaSemValidarPosicao.java
javac ErroNextLine.java
```

Execute:

```powershell
java Main
java RelatorioPedidosParalelos
java ValidarTamanhosParalelos
java RelatorioComValidacaoTamanho
java RelatorioPedidosComTotal
java TotalPedidosAprovados
java ContagemStatusParalelos
java BuscarPedidoPorCliente
java ListarPedidosPorStatus
java AlterarStatusPorCliente
java ValidarRegistrosParalelos
java ValidarRegistrosComDetalhe
java ProdutosEstoquesParalelos
java ProdutosSemEstoqueParalelos
java OrdensServicoParalelas
java TotalAtividadesOsAbertas
java MensageriaParalela
java MensagensComMuitasTentativas
java AuditoriaParalela
java ContagemAuditoriaParalela
java PreencherPedidosParalelos
java PreencherPedidosParalelosMelhorado
java ErroTamanhosDiferentes
java ErroValorDesalinhado
java ErroStringComIgualIgual
java ErroBuscaSemValidarPosicao
java ErroNextLine
```

Alguns arquivos de erro proposital podem quebrar ou mostrar resultado conceitualmente errado.

Use para diagnóstico.

---

## Arquivo sugerido: `ErroTamanhosDiferentes.java`

```java
public class ErroTamanhosDiferentes {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno", "Carla"};
        long[] valores = {1000L, 2500L};

        for (int indice = 0; indice < clientes.length; indice++) {
            System.out.println(clientes[indice] + " - " + valores[indice]);
        }
    }
}
```

Depois corrija validando os tamanhos antes de processar.

Objetivo:

```text
entender risco de ArrayIndexOutOfBoundsException em arrays paralelos.
```

---

## Arquivo sugerido: `ErroValorDesalinhado.java`

```java
public class ErroValorDesalinhado {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno"};
        long[] valores = {2500L, 1000L};

        for (int indice = 0; indice < clientes.length; indice++) {
            System.out.println(clientes[indice] + " - " + valores[indice]);
        }
    }
}
```

Objetivo:

```text
entender que arrays paralelos podem gerar dado errado mesmo sem erro técnico.
```

---

## Arquivo sugerido: `ErroBuscaSemValidarPosicao.java`

```java
public class ErroBuscaSemValidarPosicao {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno"};
        long[] valores = {1000L, 2500L};

        String procurado = "Carla";
        int indiceEncontrado = -1;

        for (int indice = 0; indice < clientes.length; indice++) {
            if (procurado.equalsIgnoreCase(clientes[indice])) {
                indiceEncontrado = indice;
                break;
            }
        }

        System.out.println(valores[indiceEncontrado]);
    }
}
```

Depois corrija:

```java
if (indiceEncontrado != -1) {
    System.out.println(valores[indiceEncontrado]);
} else {
    System.out.println("Cliente não encontrado");
}
```

Objetivo:

```text
entender que busca não encontrada precisa ser tratada antes de usar o índice.
```

---

## Debug recomendado

Use debug neste trecho:

```java
String[] clientes = {"Ana", "Bruno", "Carla"};
long[] valoresCentavos = {1000L, 2500L, 5000L};
String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};

for (int indice = 0; indice < clientes.length; indice++) {
    System.out.println(clientes[indice]);
    System.out.println(valoresCentavos[indice]);
    System.out.println(statusPedidos[indice]);
}
```

Observe em cada volta:

```text
indice = 0;
clientes[0];
valoresCentavos[0];
statusPedidos[0].
```

Depois:

```text
indice = 1;
clientes[1];
valoresCentavos[1];
statusPedidos[1].
```

O debug mostra visualmente o vínculo por índice.

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-051-arrays-paralelos docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 051: pratica arrays paralelos em Java"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore`.

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
explicar arrays paralelos;
explicar vínculo por índice;
montar tabela mental com índice, cliente, valor e status;
criar arrays paralelos de cliente, valor e status;
percorrer arrays paralelos;
gerar relatório de pedidos;
validar tamanhos iguais;
bloquear processamento com tamanhos diferentes;
somar valores em arrays paralelos;
somar apenas aprovados;
contar status;
buscar por cliente;
listar por status;
alterar status por cliente;
validar campos relacionados;
aplicar em produtos e estoques;
aplicar em OS e atividades;
aplicar em mensageria;
aplicar em auditoria;
preencher arrays paralelos com Scanner;
usar scanner.nextLine corretamente;
normalizar status;
comparar String com equals;
identificar desalinhamento lógico;
explicar fragilidade dos arrays paralelos;
explicar por que objetos serão melhores;
diagnosticar erros comuns;
debugar o mesmo índice em vários arrays;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar objetos.

Não precisa ainda dominar classes.

Não precisa ainda dominar listas.

Não precisa ainda dominar matrizes profundamente.

Não precisa ainda dominar banco de dados.

Esses assuntos virão depois.

O objetivo é entender como arrays diferentes podem representar um registro pelo mesmo índice e por que essa abordagem é frágil.

---

## Fechamento da aula

Hoje aprendemos arrays paralelos.

A ideia central foi:

```text
arrays diferentes podem representar partes do mesmo registro usando o mesmo índice.
```

Exemplo:

```java
clientes[indice]
valoresCentavos[indice]
statusPedidos[indice]
```

O índice liga:

```text
cliente;
valor;
status.
```

Também vimos que arrays paralelos são frágeis.

Eles dependem de:

```text
mesmo tamanho;
mesma ordem;
mesmo índice;
mesma disciplina de alteração.
```

Se um array fica desalinhado, o programa pode continuar rodando, mas com dados errados.

Esse é o ponto mais importante.

Arrays paralelos são úteis para aprender, mas eles também mostram por que objetos existem.

Na próxima aula, vamos estudar matriz bidimensional inicial.

Isso vai levar a ideia de linha e coluna para uma estrutura própria, ajudando a entender tabelas simples dentro da linguagem Java.
