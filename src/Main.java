public class Main {
    public static void main(String[] args) {
        String nomeCliente = "Carlos";
        int quantidadeAtividades = 6;
        int atividadesConcluidas = 2;
        double valorPorAtividade = 200.00;
        double totalOs = 0.0;
        int totalConcluidas = 0;
        int totalPendentes = 0;

        System.out.println("Cliente: " + nomeCliente);

        for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
            if (atividadeAtual <= atividadesConcluidas) {
                totalOs = totalOs + valorPorAtividade;
                totalConcluidas++;

                System.out.println("Atividade " + atividadeAtual + " concluída.");
                System.out.println("Total parcial da OS: R$ " + totalOs);
            } else {
                totalPendentes++;

                System.out.println("Atividade " + atividadeAtual + " pendente.");
            }
        }

        System.out.println("----- Resumo da OS -----");
        System.out.println("Total de atividades concluídas: " + totalConcluidas);
        System.out.println("Total de atividades pendentes: " + totalPendentes);
        System.out.println("Total final da OS: R$ " + totalOs);
    }
}