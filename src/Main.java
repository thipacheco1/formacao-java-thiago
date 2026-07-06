public class Main {
    public static void main(String[] args) {
        double[] atividades = new double[5];

        atividades[0] = 100.0;
        atividades[1] = 200.0;
        atividades[2] = 0.0;
        atividades[3] = 150.0;
        atividades[4] = -50.0;

        System.out.println("----- Antes da correção -----");

        for (int indice = 0; indice < atividades.length; indice++) {
            System.out.println("Atividade na posição " + indice + ": R$ " + atividades[indice]);
        }

        atividades[2] = 300.0;
        atividades[4] = 50.0;

        System.out.println("----- Depois da correção -----");

        for (int indice = 0; indice < atividades.length; indice++) {
            System.out.println("Atividade na posição " + indice + ": R$ " + atividades[indice]);
        }

        double total = 0.0;

        for (int indice = 0; indice < atividades.length; indice++) {
            total = total + atividades[indice];
        }

        System.out.println("----- Resumo -----");
        System.out.println("Total final: R$ " + total);
    }
}