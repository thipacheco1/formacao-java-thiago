public class Main {
    public static void main(String[] args) {
        int quantidadeAtividades = 6;
        double totalOs = 0.0;
        int atividadesProcessadas = 0;
        int atividadesIgnoradas = 0;
        boolean houveBloqueio = false;

        for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
            double valorAtividade = 100.00;
            boolean atividadeBloqueada = atividadeAtual == 6;

            if (atividadeAtual == 2) {
                valorAtividade = 0.0;
            }

            if (valorAtividade <= 0) {
                atividadesIgnoradas++;

                System.out.println("Atividade " + atividadeAtual + " inválida. Valor não será somado.");
                continue;
            }

            if (atividadeBloqueada) {
                houveBloqueio = true;

                System.out.println("Atividade " + atividadeAtual + " bloqueada.");
                System.out.println("Processamento interrompido.");
                break;
            }

            totalOs = totalOs + valorAtividade;
            atividadesProcessadas++;

            System.out.println("Atividade " + atividadeAtual + " processada.");
            System.out.println("Total parcial da OS: R$ " + totalOs);
        }

        System.out.println("----- Resumo da OS -----");
        System.out.println("Total processado: R$ " + totalOs);
        System.out.println("Atividades processadas: " + atividadesProcessadas);
        System.out.println("Atividades ignoradas: " + atividadesIgnoradas);
        System.out.println("Houve bloqueio? " + houveBloqueio);
    }
}