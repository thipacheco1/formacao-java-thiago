public class Main {
    public static void main(String[] args) {
        String nomeCliente = "Maria";
        int quantidadeAtividades = 3;

        System.out.println("Cliente: " + nomeCliente);

        for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
            System.out.println("Processando atividade " + atividadeAtual + " de " + quantidadeAtividades);
        }

        System.out.println("Processamento finalizado.");
    }
}