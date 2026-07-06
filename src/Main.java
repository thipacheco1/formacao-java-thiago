import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int opcao;
        int totalOsProcessadas = 0;

        do {
            System.out.println("----- Menu de Atendimento -----");
            System.out.println("1 - Processar nova OS");
            System.out.println("2 - Exibir quantidade de OS processadas");
            System.out.println("3 - Exibir status do sistema");
            System.out.println("0 - Sair");
            System.out.println("Digite uma opção:");

            opcao = scanner.nextInt();

            if (opcao == 1) {
                totalOsProcessadas++;
                System.out.println("OS processada com sucesso.");
            } else if (opcao == 2) {
                System.out.println("Total de OS processadas: " + totalOsProcessadas);
            } else if (opcao == 3) {
                System.out.println("Sistema operacional e aguardando comandos.");
            } else if (opcao == 0) {
                System.out.println("Encerrando sistema.");
            } else {
                System.out.println("Opção inválida.");
            }
        } while (opcao != 0);

        System.out.println("Total final de OS processadas: " + totalOsProcessadas);

        scanner.close();
    }
}