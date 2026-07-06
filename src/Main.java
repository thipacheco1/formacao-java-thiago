public class Main {
    public static void main(String[] args) {
        int tipoServico = 9;

        switch (tipoServico) {
            case 1:
                System.out.println("Tipo de serviço: Montagem.");
                break;
            case 2:
                System.out.println("Tipo de serviço: Assistência técnica.");
                break;
            case 3:
                System.out.println("Tipo de serviço: Entrega.");
                break;
            case 4:
                System.out.println("Tipo de serviço: Vistoria.");
                break;
            case 5:
                System.out.println("Tipo de serviço: Troca.");
                break;
            default:
                System.out.println("Tipo de serviço inválido.");
        }
    }
}