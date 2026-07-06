import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o nome do Cliente : ");
        String nomeCliente = scanner.nextLine();

        System.out.println("Digite o Status da OS:");
        System.out.println("1 - Aberta");
        System.out.println("2 - Agendada");
        System.out.println("3 - Em Atendimento");
        System.out.println("4 - Concluida");
        System.out.println("5 - Cancelada");
        int statusOs = scanner.nextInt();

        System.out.println("Digite o valor do serviço:");
        double valorServico = scanner.nextDouble();

        System.out.println("Cliente ativo? true/false");
        boolean clienteAtivo = scanner.nextBoolean();

        System.out.println("Possui Pendencia? true/false");
        boolean possuiPendencia = scanner.nextBoolean();

        String descricaoStatusOs;

        switch (statusOs) {
            case 1:
                descricaoStatusOs = "Aberta";
                break;
            case 2:
                descricaoStatusOs = "Agendada";
                break;
            case 3:
                descricaoStatusOs = "Em atendimento";
                break;
            case 4:
                descricaoStatusOs = "Concluída";
                break;
            case 5:
                descricaoStatusOs = "Cancelada";
                break;
            default:
                descricaoStatusOs = "Status inválido";
        }

        boolean podeSeguirAtendimento = clienteAtivo && !possuiPendencia && statusOs == 2;


        String classificacaoValor;

        if (valorServico  >= 500) {
            classificacaoValor = "Serviço de alto valor";
        } else if (valorServico  >= 200) {
            classificacaoValor = "Serviço de médio valor";
        } else if (valorServico  >0) {
            classificacaoValor = "Serviço de baixo valor";
        } else {
            classificacaoValor = "Valor inválido";
        }

        System.out.println("----- Resultado da Análise -----");
        System.out.println("Nome do cliente: " + nomeCliente);
        System.out.println("Status da OS: " + descricaoStatusOs);
        System.out.println("Valor do serviço: " + valorServico);
        System.out.println("Cliente Ativo? " + clienteAtivo);
        System.out.println("Possui pendencia? " + possuiPendencia);

        System.out.println("Pode seguir para atendimento? " + podeSeguirAtendimento);
        System.out.println("Classificação do valor: " + classificacaoValor);

        scanner.close();
    }
}