import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite a quantidade de atividades:");
        int quantidadeAtividades = scanner.nextInt();

        while (quantidadeAtividades <= 0) {
            System.out.println("Quantidade inválida. Digite novamente:");
            quantidadeAtividades = scanner.nextInt();
        }

        double[] atividades = new double[quantidadeAtividades];

        for (int indice = 0; indice < atividades.length; indice++) {
            System.out.println("Digite o valor da atividade " + (indice + 1) + ":");
            atividades[indice] = scanner.nextDouble();
        }

        double total = 0.0;
        int atividadesValidas = 0;
        int atividadesInvalidas = 0;

        System.out.println("----- Atividades informadas -----");

        for (int indice = 0; indice < atividades.length; indice++) {
            double valorAtividade = atividades[indice];

            if (valorAtividade > 0) {
                total = total + valorAtividade;
                atividadesValidas++;

                System.out.println("Atividade " + (indice + 1) + " válida: R$ " + valorAtividade);
            } else {
                atividadesInvalidas++;

                System.out.println("Atividade " + (indice + 1) + " inválida: R$ " + valorAtividade);
            }
        }

        System.out.println("----- Resumo -----");
        System.out.println("Total final: R$ " + total);
        System.out.println("Atividades válidas: " + atividadesValidas);
        System.out.println("Atividades inválidas: " + atividadesInvalidas);

        scanner.close();
    }
}