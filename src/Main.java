import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o nome do cliente:");
        String nomeCliente = scanner.nextLine();

        System.out.println("Digite a quantidade de atividades:");
        int quantidadeAtividades = scanner.nextInt();

        double totalOs = 0.0;

        System.out.println("Cliente: " + nomeCliente);

        for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
            System.out.println("Digite o valor da atividade " + atividadeAtual + ":");
            double valorAtividade = scanner.nextDouble();

            totalOs = totalOs + valorAtividade;

            System.out.println("Atividade " + atividadeAtual + " processada.");
            System.out.println("Total parcial da OS: R$ " + totalOs);
        }

        System.out.println("----- Resumo da OS -----");
        System.out.println("Cliente: " + nomeCliente);
        System.out.println("Quantidade de atividades processadas: " + quantidadeAtividades);
        System.out.println("Total final da OS: R$ " + totalOs);

        scanner.close();
    }
}