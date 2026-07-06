import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o nome do técnico:");
        String nomeTecnico = scanner.nextLine();

        System.out.println("Digite o tipo de serviço:");
        System.out.println("1 - Montagem");
        System.out.println("2 - Assistência técnica");
        System.out.println("3 - Entrega");
        System.out.println("4 - Vistoria");
        System.out.println("5 - Troca");
        int tipoServico = scanner.nextInt();

        System.out.println("Digite a quantidade de serviços:");
        int quantidadeServicos = scanner.nextInt();

        System.out.println("Digite a meta de serviços:");
        int metaServicos = scanner.nextInt();

        System.out.println("Digite o valor por serviço:");
        double valorPorServico = scanner.nextDouble();

        System.out.println("O técnico está ativo? true/false");
        boolean tecnicoAtivo = scanner.nextBoolean();

        System.out.println("O técnico possui bloqueio? true/false");
        boolean possuiBloqueio = scanner.nextBoolean();

        String descricaoTipoServico;

        switch (tipoServico) {
            case 1:
                descricaoTipoServico = "Montagem";
                break;
            case 2:
                descricaoTipoServico = "Assistência técnica";
                break;
            case 3:
                descricaoTipoServico = "Entrega";
                break;
            case 4:
                descricaoTipoServico = "Vistoria";
                break;
            case 5:
                descricaoTipoServico = "Troca";
                break;
            default:
                descricaoTipoServico = "Tipo inválido";
        }

        double totalBruto = quantidadeServicos * valorPorServico;
        boolean atingiuMeta = quantidadeServicos >= metaServicos;
        boolean podeReceberBonus = atingiuMeta && tecnicoAtivo && !possuiBloqueio;

        String classificacaoPerformance;

        if (quantidadeServicos >= 15) {
            classificacaoPerformance = "Excelente";
        } else if (quantidadeServicos >= 10) {
            classificacaoPerformance = "Boa";
        } else if (quantidadeServicos >= 5) {
            classificacaoPerformance = "Regular";
        } else {
            classificacaoPerformance = "Baixa";
        }

        System.out.println("----- Resultado da Análise -----");
        System.out.println("Técnico: " + nomeTecnico);
        System.out.println("Tipo de serviço: " + descricaoTipoServico);
        System.out.println("Quantidade de serviços: " + quantidadeServicos);
        System.out.println("Meta de serviços: " + metaServicos);
        System.out.println("Valor por serviço: R$ " + valorPorServico);
        System.out.println("Total bruto: R$ " + totalBruto);
        System.out.println("Técnico ativo? " + tecnicoAtivo);
        System.out.println("Possui bloqueio? " + possuiBloqueio);
        System.out.println("Atingiu a meta? " + atingiuMeta);
        System.out.println("Pode receber bônus? " + podeReceberBonus);
        System.out.println("Classificação de performance: " + classificacaoPerformance);

        scanner.close();
    }
}