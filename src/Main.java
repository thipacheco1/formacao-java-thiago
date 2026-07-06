public class Main {
    public static void main(String[] args) {
        double atividade1 = 100.0;
        double atividade2 = 200.0;
        double atividade3 = 0.0;
        double atividade4 = 150.0;
        double atividade5 = -50.0;

        double total = 0.0;
        int atividadesValidas = 0;
        int atividadesInvalidas = 0;

        if (atividade1 > 0) {
            total = total + atividade1;
            atividadesValidas++;
        } else {
            atividadesInvalidas++;
        }

        if (atividade2 > 0) {
            total = total + atividade2;
            atividadesValidas++;
        } else {
            atividadesInvalidas++;
        }

        if (atividade3 > 0) {
            total = total + atividade3;
            atividadesValidas++;
        } else {
            atividadesInvalidas++;
        }

        if (atividade4 > 0) {
            total = total + atividade4;
            atividadesValidas++;
        } else {
            atividadesInvalidas++;
        }

        if (atividade5 > 0) {
            total = total + atividade5;
            atividadesValidas++;
        } else {
            atividadesInvalidas++;
        }

        System.out.println("Total final: R$ " + total);
        System.out.println("Atividades válidas: " + atividadesValidas);
        System.out.println("Atividades inválidas: " + atividadesInvalidas);
    }
}