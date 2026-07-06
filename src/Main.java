public class Main {
    public static void main(String[] args) {
        String nomeTecnico = "Carlos";
        int quantidadeServicos = 5;
        int metaMinima = 8;
        int metaBoa = 12;
        int metaExcelente = 15;

        System.out.println("Técnico: " + nomeTecnico);
        System.out.println("Quantidade de serviços: " + quantidadeServicos);

        if (quantidadeServicos >= metaExcelente) {
            System.out.println("Performance excelente.");
        } else if (quantidadeServicos >= metaBoa) {
            System.out.println("Performance boa.");
        } else if (quantidadeServicos >= metaMinima) {
            System.out.println("Performance mínima atingida.");
        } else {
            System.out.println("Meta não atingida.");
        }
    }
}