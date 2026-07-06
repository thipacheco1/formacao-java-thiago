import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int opcao;
        int totalOsProcessadas = 0;
        double totalGeralSistema = 0.0;
        int totalAtividadesValidasGeral = 0;
        int totalAtividadesInvalidasGeral = 0;

        do {
            System.out.println("----- Sistema de Processamento de OS -----");
            System.out.println("1 - Processar OS");
            System.out.println("2 - Exibir resumo geral");
            System.out.println("0 - Sair");
            System.out.println("Digite uma opção:");

            opcao = scanner.nextInt();
            scanner.nextLine();

            if (opcao == 1) {
                System.out.println("Digite o nome do cliente:");
                String nomeCliente = scanner.nextLine();

                System.out.println("Digite a quantidade de atividades:");
                int quantidadeAtividades = scanner.nextInt();

                double totalOs = 0.0;
                int atividadesValidas = 0;
                int atividadesInvalidas = 0;

                for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                    System.out.println("Digite o valor da atividade " + atividadeAtual + ":");
                    double valorAtividade = scanner.nextDouble();

                    if (valorAtividade > 0) {
                        totalOs = totalOs + valorAtividade;
                        atividadesValidas++;

                        System.out.println("Atividade " + atividadeAtual + " válida.");
                        System.out.println("Total parcial da OS: R$ " + totalOs);
                    } else {
                        atividadesInvalidas++;

                        System.out.println("Atividade " + atividadeAtual + " inválida. Valor não somado.");
                    }
                }

                totalOsProcessadas++;
                totalGeralSistema = totalGeralSistema + totalOs;
                totalAtividadesValidasGeral = totalAtividadesValidasGeral + atividadesValidas;
                totalAtividadesInvalidasGeral = totalAtividadesInvalidasGeral + atividadesInvalidas;

                System.out.println("----- Resumo da OS -----");
                System.out.println("Cliente: " + nomeCliente);
                System.out.println("Atividades válidas: " + atividadesValidas);
                System.out.println("Atividades inválidas: " + atividadesInvalidas);
                System.out.println("Total da OS: R$ " + totalOs);

            } else if (opcao == 2) {
                System.out.println("----- Resumo Geral -----");
                System.out.println("Total de OS processadas: " + totalOsProcessadas);
                System.out.println("Total geral do sistema: R$ " + totalGeralSistema);
                System.out.println("Total de atividades válidas: " + totalAtividadesValidasGeral);
                System.out.println("Total de atividades inválidas: " + totalAtividadesInvalidasGeral);

            } else if (opcao == 0) {
                System.out.println("Encerrando sistema.");

            } else {
                System.out.println("Opção inválida.");
            }

        } while (opcao != 0);

        System.out.println("----- Resumo Final -----");
        System.out.println("Total de OS processadas: " + totalOsProcessadas);
        System.out.println("Total geral do sistema: R$ " + totalGeralSistema);
        System.out.println("Total de atividades válidas: " + totalAtividadesValidasGeral);
        System.out.println("Total de atividades inválidas: " + totalAtividadesInvalidasGeral);

        scanner.close();
    }
}