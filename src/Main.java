public class Main {
    public static void main(String[] args) {
        double[] atividades = {100.0, 200.0, 0.0, 150.0, -50.0, 300.0, -10.0};

        double total = 0.0;
        int atividadesValidas = 0;
        int atividadesInvalidas = 0;

        for (int indice = 0; indice < atividades.length; indice++) {
            double valorAtividade = atividades[indice];

            if (valorAtividade > 0) {
                total = total + valorAtividade;
                atividadesValidas++;

                System.out.println("Atividade " + indice + " válida: R$ " + valorAtividade);
            } else {
                atividadesInvalidas++;

                System.out.println("Atividade " + indice + " inválida: R$ " + valorAtividade);
            }
        }

        System.out.println("----- Resumo -----");
        System.out.println("Total final: R$ " + total);
        System.out.println("Atividades válidas: " + atividadesValidas);
        System.out.println("Atividades inválidas: " + atividadesInvalidas);
    }
}