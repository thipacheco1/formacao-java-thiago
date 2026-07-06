public class Main {
    public static void main(String[] args) {
        double valorPorServico = 120.50;
        int quantidadeServicos = 8;
        double bonus = 150.00;
        double desconto = 80.00;

        double totalBruto = valorPorServico * quantidadeServicos;
        double totalComBonus = totalBruto + bonus;
        double totalFinal = totalComBonus - desconto;

        System.out.println("Valor por serviço: R$ " + valorPorServico);
        System.out.println("Quantidade de serviços: " + quantidadeServicos);
        System.out.println("Total bruto: R$ " + totalBruto);
        System.out.println("Bônus: R$ " + bonus);
        System.out.println("Total com bônus: R$ " + totalComBonus);
        System.out.println("Desconto: R$ " + desconto);
        System.out.println("Total final: R$ " + totalFinal);
    }
}