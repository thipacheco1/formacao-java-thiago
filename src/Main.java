public class Main {
    public static void main(String[] args) {
        String[] clientes = {"Maria", "", "Carlos", "Ana", ""};

        int clientesValidos = 0;
        int clientesInvalidos = 0;

        for (int indice = 0; indice < clientes.length; indice++) {
            String cliente = clientes[indice];

            if (cliente.isEmpty()) {
                clientesInvalidos++;

                System.out.println("Cliente na posição " + indice + " inválido. Nome vazio.");
            } else {
                clientesValidos++;

                System.out.println("Cliente na posição " + indice + " válido: " + cliente);

                if (cliente.equals("Carlos")) {
                    System.out.println("Cliente Carlos encontrado para validação especial.");
                }
            }
        }

        System.out.println("----- Resumo -----");
        System.out.println("Clientes válidos: " + clientesValidos);
        System.out.println("Clientes inválidos: " + clientesInvalidos);
    }
}