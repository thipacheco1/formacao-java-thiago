public class Main {
    public static void main(String[] args) {
        String nomeUsuario = "Thiago";
        boolean usuarioAtivo = true;
        boolean senhaCorreta = true;
        boolean possuiPermissao = true;
        boolean contaBloqueada = false;

        boolean podeAcessarSistema = usuarioAtivo && senhaCorreta && possuiPermissao && !contaBloqueada;

        System.out.println("Usuário: " + nomeUsuario);
        System.out.println("Usuário ativo? " + usuarioAtivo);
        System.out.println("Senha correta? " + senhaCorreta);
        System.out.println("Possui permissão? " + possuiPermissao);
        System.out.println("Conta bloqueada? " + contaBloqueada);
        System.out.println("Pode acessar o sistema? " + podeAcessarSistema);
    }
}