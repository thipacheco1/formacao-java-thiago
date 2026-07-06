import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o nome do técnico:");
        String nomeTecnico = scanner.nextLine();

        System.out.println("Digite a quantidade de serviços:");
        int quantidadeServicos = scanner.nextInt();

        System.out.println("Digite a meta de serviços:");
        int metaServicos = scanner.nextInt();

        System.out.println("Digite o valor por serviço:");
        double valorPorServico = scanner.nextDouble();

        boolean atingiuMeta = quantidadeServicos >= metaServicos;
        double totalSemBonus = quantidadeServicos * valorPorServico;

        System.out.println("----- Resultado -----");
        System.out.println("Técnico: " + nomeTecnico);
        System.out.println("Quantidade de serviços: " + quantidadeServicos);
        System.out.println("Meta de serviços: " + metaServicos);
        System.out.println("Valor por serviço: R$ " + valorPorServico);
        System.out.println("Total sem bônus: R$ " + totalSemBonus);
        System.out.println("Atingiu a meta? " + atingiuMeta);

        scanner.close();
    }
}