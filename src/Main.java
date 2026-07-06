import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int opcao;
        int totalOsProcessadas = 0;
        double totalGeralSistema = 0.0;
        int totalAtividadesProcessadasGeral = 0;
        int totalAtividadesInvalidasGeral = 0;
        int totalAtividadesPendentesGeral = 0;
        int totalAtividadesCanceladasGeral = 0;
        int totalOsBloqueadas = 0;

        do {
            System.out.println("----- Sistema Integrado de Processamento de OS -----");
            System.out.println("1 - Processar nova OS");
            System.out.println("2 - Exibir resumo geral");
            System.out.println("0 - Sair");
            System.out.println("Digite uma opção:");

            opcao = scanner.nextInt();
            scanner.nextLine();

            if (opcao == 1) {
                System.out.println("Digite o nome do cliente:");
                String nomeCliente = scanner.nextLine();

                System.out.println("Digite a quantidade de atividades:");
                int quantidadeAtividades = scanner.nextInt();

                while (quantidadeAtividades <= 0) {
                    System.out.println("Quantidade inválida. Digite novamente:");
                    quantidadeAtividades = scanner.nextInt();
                }

                double totalOs = 0.0;
                int atividadesProcessadas = 0;
                int atividadesInvalidas = 0;
                int atividadesPendentes = 0;
                int atividadesCanceladas = 0;
                boolean houveBloqueio = false;

                for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                    System.out.println("Digite o valor da atividade " + atividadeAtual + ":");
                    double valorAtividade = scanner.nextDouble();

                    System.out.println("Digite o status da atividade " + atividadeAtual + ":");
                    System.out.println("1 - Concluída");
                    System.out.println("2 - Pendente");
                    System.out.println("3 - Cancelada");
                    System.out.println("4 - Bloqueada");
                    int statusAtividade = scanner.nextInt();

                    String descricaoStatus;

                    switch (statusAtividade) {
                        case 1:
                            descricaoStatus = "Concluída";
                            break;
                        case 2:
                            descricaoStatus = "Pendente";
                            break;
                        case 3:
                            descricaoStatus = "Cancelada";
                            break;
                        case 4:
                            descricaoStatus = "Bloqueada";
                            break;
                        default:
                            descricaoStatus = "Status inválido";
                    }

                    System.out.println("Status informado: " + descricaoStatus);

                    if (statusAtividade == 4) {
                        houveBloqueio = true;

                        System.out.println("Atividade " + atividadeAtual + " bloqueada.");
                        System.out.println("Processamento da OS interrompido.");
                        break;
                    }

                    if (statusAtividade == 2) {
                        atividadesPendentes++;

                        System.out.println("Atividade " + atividadeAtual + " pendente. Não entrou no total.");
                        continue;
                    }

                    if (statusAtividade == 3) {
                        atividadesCanceladas++;

                        System.out.println("Atividade " + atividadeAtual + " cancelada. Não entrou no total.");
                        continue;
                    }

                    if (statusAtividade != 1) {
                        atividadesInvalidas++;

                        System.out.println("Atividade " + atividadeAtual + " com status inválido. Não entrou no total.");
                        continue;
                    }

                    if (valorAtividade <= 0) {
                        atividadesInvalidas++;

                        System.out.println("Atividade " + atividadeAtual + " com valor inválido. Não entrou no total.");
                        continue;
                    }

                    totalOs = totalOs + valorAtividade;
                    atividadesProcessadas++;

                    System.out.println("Atividade " + atividadeAtual + " processada.");
                    System.out.println("Total parcial da OS: R$ " + totalOs);
                }

                totalOsProcessadas++;
                totalGeralSistema = totalGeralSistema + totalOs;
                totalAtividadesProcessadasGeral = totalAtividadesProcessadasGeral + atividadesProcessadas;
                totalAtividadesInvalidasGeral = totalAtividadesInvalidasGeral + atividadesInvalidas;
                totalAtividadesPendentesGeral = totalAtividadesPendentesGeral + atividadesPendentes;
                totalAtividadesCanceladasGeral = totalAtividadesCanceladasGeral + atividadesCanceladas;

                if (houveBloqueio) {
                    totalOsBloqueadas++;
                }

                System.out.println("----- Resumo da OS -----");
                System.out.println("Cliente: " + nomeCliente);
                System.out.println("Atividades processadas: " + atividadesProcessadas);
                System.out.println("Atividades inválidas: " + atividadesInvalidas);
                System.out.println("Atividades pendentes: " + atividadesPendentes);
                System.out.println("Atividades canceladas: " + atividadesCanceladas);
                System.out.println("Houve bloqueio? " + houveBloqueio);
                System.out.println("Total da OS: R$ " + totalOs);

            } else if (opcao == 2) {
                System.out.println("----- Resumo Geral -----");
                System.out.println("Total de OS processadas: " + totalOsProcessadas);
                System.out.println("Total geral do sistema: R$ " + totalGeralSistema);
                System.out.println("Total de atividades processadas: " + totalAtividadesProcessadasGeral);
                System.out.println("Total de atividades inválidas: " + totalAtividadesInvalidasGeral);
                System.out.println("Total de atividades pendentes: " + totalAtividadesPendentesGeral);
                System.out.println("Total de atividades canceladas: " + totalAtividadesCanceladasGeral);
                System.out.println("Total de OS bloqueadas: " + totalOsBloqueadas);

            } else if (opcao == 0) {
                System.out.println("Encerrando sistema.");

            } else {
                System.out.println("Opção inválida.");
            }

        } while (opcao != 0);

        System.out.println("----- Resumo Final -----");
        System.out.println("Total de OS processadas: " + totalOsProcessadas);
        System.out.println("Total geral do sistema: R$ " + totalGeralSistema);
        System.out.println("Total de atividades processadas: " + totalAtividadesProcessadasGeral);
        System.out.println("Total de atividades inválidas: " + totalAtividadesInvalidasGeral);
        System.out.println("Total de atividades pendentes: " + totalAtividadesPendentesGeral);
        System.out.println("Total de atividades canceladas: " + totalAtividadesCanceladasGeral);
        System.out.println("Total de OS bloqueadas: " + totalOsBloqueadas);

        scanner.close();
    }
}