public class Main {
    public static void main(String[] args) {
        String nomeCliente = "Maria";
        int quantidadeAtividades = 3;
        double valorPorAtividade = 200.00;
        double totalOs = 0.0;

        System.out.println("Cliente: " + nomeCliente);

        for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
            totalOs = totalOs + valorPorAtividade;

            System.out.println("Processando atividade " + atividadeAtual + " de " + quantidadeAtividades);
            System.out.println("Total parcial da OS: R$ " + totalOs);
        }

        System.out.println("Total final da OS: R$ " + totalOs);
    }
}