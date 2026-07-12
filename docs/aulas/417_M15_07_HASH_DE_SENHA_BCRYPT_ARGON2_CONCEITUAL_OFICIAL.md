# 417 - M15.07 - Hash de senha BCrypt Argon2 conceitual

## Apresentação da aula

Na aula 416, você aplicou uma baseline de security headers à API.

A aplicação passou a orientar o navegador com:

```text
Content-Security-Policy;

X-Content-Type-Options;

X-Frame-Options;

Referrer-Policy;

Permissions-Policy;

Cache-Control;

HSTS condicionado a HTTPS.
```

Aquela aula respondeu:

```text
como reduzir comportamentos perigosos
na interpretação das responses?
```

Agora o módulo chega a um segredo humano que será usado na autenticação:

```text
a senha.
```

A pergunta central desta aula será:

```text
como armazenar uma senha
sem guardar a própria senha
e sem transformar um vazamento de banco
em recuperação imediata das credenciais?
```

A resposta não será:

- texto puro;
- Base64;
- criptografia reversível;
- SHA-256 simples;
- MD5;
- SHA-1;
- hash caseiro;
- salt fixo;
- algoritmo próprio;
- gerador online.

Senhas devem ser armazenadas com funções específicas de password hashing.

Essas funções são:

```text
unidirecionais;

adaptativas;

deliberadamente caras;

salted;

verificáveis sem descriptografar.
```

A baseline estudará:

```text
BCrypt;

Argon2id.
```

Argon2id será a escolha preferencial para novos sistemas quando a plataforma e a operação suportarem seu custo de memória.

BCrypt continuará importante porque:

- é amplamente utilizado;
- possui suporte maduro;
- aparece em sistemas legados;
- pode ser necessário em migrações;
- será encontrado com frequência no mercado.

O laboratório será conceitual e executável.

Ele utilizará apenas:

```text
spring-security-crypto
```

em escopo de teste.

Isso não criará:

- filter chain;
- login;
- sessão;
- usuário;
- autorização;
- endpoint protegido.

A implementação atual do `Argon2PasswordEncoder` do Spring Security usa Bouncy Castle. Essa dependency também será adicionada somente aos testes.

Arquivos:

```text
src/test/java/br/com/formacao/backend
└── security
    └── password
        ├── PasswordHashLab.java
        └── PasswordHashLabTest.java

docs/security/
└── M15_PASSWORD_STORAGE_DECISION.md
```

A prática demonstrará:

- hash não é decodificado;
- a mesma senha gera hashes diferentes;
- o salt fica incorporado à representação;
- `matches` verifica sem recuperar a senha;
- BCrypt possui custo adaptável;
- BCrypt possui limite de 72 bytes;
- Argon2id utiliza custo de memória;
- parâmetros precisam ser calibrados;
- hashes antigos precisam de migração;
- pepper é diferente de salt;
- senha e hash não pertencem aos logs.

A senha usada será sintética.

Nenhum valor real será digitado, exibido, commitado ou enviado a serviços externos.

A próxima aula será:

```text
418 - M15.08 - Spring Security arquitetura
```

Por isso, esta aula não criará `PasswordEncoder` como bean de produção nem definirá o fluxo final de autenticação.

---

## Onde estamos na formação

A sequência atual é:

```text
415:
CSRF quando importa em APIs.

416:
Security headers.

417:
Hash de senha BCrypt Argon2 conceitual.

418:
Spring Security arquitetura.

419:
SecurityFilterChain.

420:
Login basico usuario em memoria.
```

A aula 416 respondeu:

```text
quais políticas de browser
a API deve enviar?
```

A aula 417 responderá:

```text
como transformar uma senha
em um verificador resistente
a ataques offline?
```

Nesta aula:

```text
hash:
sim.

salt:
sim.

pepper:
sim.

work factor:
sim.

BCrypt:
sim.

Argon2id:
sim.

benchmark:
sim.

migração:
sim.

Spring Security Crypto:
somente teste.

SecurityFilterChain:
não.

usuário:
não.

login:
não.

banco de usuários:
não.
```

A regra central será:

```text
senha não é dado recuperável;

o sistema armazena
um verificador caro
e compara tentativas
sem descriptografar nada.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
docs/security/M15_PASSWORD_STORAGE_DECISION.md
```

O documento conterá:

```text
# Decisao de armazenamento de senhas

## Contexto
## Ameaca
## Requisitos
## Algoritmo preferencial
## Compatibilidade legada
## Parametros
## Salt
## Pepper
## Limite BCrypt
## Calibracao
## Migracao
## Operacao
## Testes
## Decisao
```

O laboratório usará:

```text
BCrypt:
strength 12 como ponto inicial.

Argon2id:
salt 16 bytes;
hash 32 bytes;
parallelism 1;
memory 19 MiB;
iterations 2.
```

A configuração Argon2id de 19 MiB, duas iterações e paralelismo um representa a baseline mínima recomendada pelo OWASP no momento desta aula.

Ela não é universal.

O ambiente final precisa medir:

- latência;
- CPU;
- memória;
- concorrência;
- throughput;
- capacidade de login;
- risco de DoS;
- orçamento operacional.

Você irá:

1. diferenciar encoding, encryption e hashing;
2. compreender ataques offline;
3. estudar funções adaptativas;
4. compreender salt;
5. compreender pepper;
6. compreender work factor;
7. estudar BCrypt;
8. estudar o limite de 72 bytes;
9. estudar Argon2id;
10. comparar CPU e memória;
11. adicionar dependencies de laboratório;
12. criar encoders de teste;
13. provar salt aleatório;
14. provar `matches`;
15. medir custo;
16. documentar calibração;
17. documentar migração;
18. atualizar o threat model;
19. atualizar OWASP;
20. commitar.

---

## Conceito essencial

### Encoding não protege segredo

Encoding transforma uma representação em outra.

Exemplos:

- Base64;
- hexadecimal;
- URL encoding.

Base64 pode ser revertido sem chave.

Armazenar uma senha em Base64 é armazenar a senha com outra aparência.

---

### Criptografia é reversível

Criptografia utiliza uma chave para transformar plaintext em ciphertext.

Com a chave correta, o valor original é recuperado.

Ela é adequada quando o sistema precisa ler novamente o dado.

O sistema de autenticação não precisa recuperar a senha.

Ele precisa responder:

```text
a tentativa corresponde
ao verificador armazenado?
```

Se senhas forem criptografadas e a chave vazar, todas poderão ser recuperadas.

Por isso, criptografia reversível é o modelo errado para password storage.

---

### Hash geral não é password hashing

SHA-256 é uma função hash criptográfica importante.

Porém, é rápida.

Velocidade é útil para integridade de arquivos e mensagens.

Para senhas, favorece ataques offline.

Depois de obter uma tabela de hashes, o atacante testa candidatos sem falar com a API.

O sistema não consegue aplicar:

- rate limiting;
- bloqueio;
- CAPTCHA;
- logs de login;
- atraso de rede.

A defesa principal é tornar cada tentativa cara.

---

### Ataques online e offline

Ataque online:

```text
a tentativa passa pela aplicação.
```

Controles:

- rate limiting;
- bloqueio;
- MFA;
- alertas;
- detecção;
- IP reputation.

Ataque offline:

```text
o atacante possui os hashes
e testa candidatos localmente.
```

A resistência depende de:

- qualidade da senha;
- algoritmo;
- salt;
- work factor;
- memória;
- pepper;
- proteção do banco;
- capacidade de migração.

---

### Função adaptativa unidirecional

Uma função adaptativa permite aumentar o custo conforme o hardware evolui.

Exemplos:

```text
BCrypt;

Argon2id;

scrypt;

PBKDF2.
```

A saída armazena os parâmetros necessários para verificar.

Exemplo BCrypt:

```text
$2a$12$...
```

Exemplo Argon2id:

```text
$argon2id$v=19$m=19456,t=2,p=1$...
```

Isso permite verificar hashes antigos enquanto novos registros usam parâmetros melhores.

---

### Salt

Salt é um valor aleatório e único por hash.

Ele evita que duas contas com a mesma senha tenham a mesma representação e reduz a utilidade de tabelas pré-computadas.

O salt:

- não precisa ser secreto;
- precisa ser aleatório;
- precisa ser único;
- deve ser gerado por biblioteca segura;
- normalmente fica incorporado ao hash.

Não use:

```text
SALT_GLOBAL = "minha-api".
```

BCrypt e `Argon2PasswordEncoder` geram salts automaticamente.

Não concatene um salt manual adicional.

---

### Pepper

Pepper é um segredo adicional mantido fora do banco de hashes.

Diferenças:

`Salt`

```text
único por registro;

não secreto;

armazenado com o hash.
```

`Pepper`

```text
secreto;

compartilhado ou versionado;

armazenado fora do banco.
```

Pepper pode ajudar quando somente o banco é comprometido, mas adiciona:

- secret manager;
- acesso controlado;
- rotação;
- versionamento;
- recovery;
- indisponibilidade;
- resposta a incidente.

Se o pepper vazar, pode ser necessário rehash após login ou reset de senha.

Nesta aula, pepper será documentado e não implementado.

Não coloque pepper em:

- `application.yaml`;
- código;
- Dockerfile;
- banco;
- collection;
- Git.

---

### Work factor

Work factor controla o custo do hashing.

No BCrypt, aparece como:

```text
strength;

cost;

log rounds.
```

O crescimento é aproximadamente exponencial.

Aumentar de 10 para 11 tende a dobrar o trabalho.

No Argon2, existem custos de:

- memória;
- iterações;
- paralelismo.

Um custo excessivo pode facilitar DoS no login.

A configuração precisa equilibrar:

```text
resistência offline;

latência;

concorrência;

capacidade.
```

---

### Calibração

O Spring Security recomenda calibrar funções adaptativas para uma verificação próxima de um segundo no sistema real.

Isso é uma referência, não uma assertion fixa.

O OWASP oferece parâmetros mínimos e recomenda evitar custos que tornem a aplicação impraticável.

Calibre em:

- hardware semelhante;
- container real;
- limites reais de CPU e memória;
- JVM real;
- concorrência real.

Não calibre somente no notebook do desenvolvedor.

---

### BCrypt

BCrypt possui:

- salt automático;
- cost configurável;
- formato autocontido;
- suporte amplo;
- custo principalmente de CPU;
- limite de entrada.

A baseline OWASP para sistemas legados utiliza cost 10 ou maior.

O laboratório usa:

```text
12.
```

Isso não define o valor final de produção.

A medição decidirá.

---

### Limite de 72 bytes

BCrypt possui limite de 72 bytes.

Não são 72 caracteres.

Em UTF-8:

```text
a:
1 byte.

ç:
2 bytes.

emoji:
pode usar 4 bytes.
```

Uma senha com menos de 72 caracteres pode ultrapassar o limite.

A linha atual do Spring Security rejeita novos encodes acima de 72 bytes.

A decisão segura é:

- validar por bytes;
- não truncar;
- documentar;
- preferir Argon2id para novas bases;
- testar Unicode;
- planejar legados.

Truncar silenciosamente pode tornar entradas distintas equivalentes.

---

### Pré-hash antes do BCrypt

Alguns sistemas usam pré-hash para contornar o limite.

Isso exige cuidado com:

- encoding;
- compatibilidade;
- bytes nulos;
- versionamento;
- algoritmo;
- migração.

Não implemente:

```text
bcrypt(sha256(password))
```

por conta própria.

Para a formação:

```text
novo sistema:
Argon2id.

legado BCrypt:
respeitar 72 bytes.
```

---

### Argon2

Variantes:

`Argon2d`

```text
forte contra cracking,
com maior atenção a side channels.
```

`Argon2i`

```text
acesso de memória independente de dados.
```

`Argon2id`

```text
combina estratégias
e é recomendado para password hashing geral.
```

Argon2id é memory-hard.

Cada tentativa exige memória significativa, tornando ataques paralelos mais caros.

---

### Parâmetros Argon2id

Laboratório:

```text
saltLength:
16 bytes.

hashLength:
32 bytes.

parallelism:
1.

memory:
19456 KiB.

iterations:
2.
```

`19456 KiB` corresponde a 19 MiB.

A string codificada registra:

- variante;
- versão;
- memória;
- iterações;
- paralelismo;
- salt;
- hash.

Não é necessário separar esses campos no banco.

---

### Defaults e implementação

Factories do Spring Security oferecem defaults.

Eles são pontos iniciais, não prova automática de conformidade com qualquer guia.

Nesta aula, parâmetros explícitos tornam a decisão visível.

A implementação atual de Argon2 do Spring Security usa Bouncy Castle e não explora todas as otimizações disponíveis a crackers.

A calibração precisa considerar essa assimetria.

---

### Matches

O fluxo correto é:

```text
senha informada;

hash armazenado;

encoder.matches(raw, encoded).
```

Não faça:

```text
encoder.encode(raw).equals(encoded).
```

Um novo encode gera outro salt e outro hash.

`matches` lê algoritmo, parâmetros e salt da representação armazenada.

---

### Hashes diferentes são esperados

```text
encode(password):
hash A.

encode(password):
hash B.

A != B.

matches(password, A):
true.

matches(password, B):
true.
```

Não compare hashes para detectar reutilização de senha.

---

### Hash também é sensível

O hash permite ataque offline.

Proteja:

- banco;
- backup;
- export;
- logs;
- suporte;
- testes.

Não envie hash ao frontend.

Não inclua hash em DTO.

Não imprima hash completo.

---

### Migração e agility

Algoritmos mudam.

Uma representação versionada pode usar:

```text
{bcrypt}...

{argon2}...
```

O Spring Security possui `DelegatingPasswordEncoder` para múltiplos formatos.

Estratégia futura:

1. verificar o hash antigo;
2. autenticar;
3. detectar upgrade;
4. gerar hash atual;
5. persistir;
6. registrar evento sem segredo.

`upgradeEncoding` ajudará a identificar hashes que precisam de atualização.

A integração ficará para as aulas de autenticação.

---

### Rehash no login

O login bem-sucedido é uma oportunidade de rehash porque a senha está disponível naquele instante.

Cuidados:

- transação;
- concorrência;
- falha de escrita;
- observabilidade;
- pepper;
- latência;
- ausência de logs sensíveis.

Hashes incompatíveis podem exigir reset de senha.

---

## Mão na massa guiada

### 1. Criar o documento de decisão

Arquivo:

```text
docs/security/M15_PASSWORD_STORAGE_DECISION.md
```

Conteúdo inicial:

```markdown
# Decisao de armazenamento de senhas

## Contexto

A aplicacao ainda nao possui usuarios ou autenticacao.
A decisao prepara o armazenamento futuro sem criar
tabela, endpoint ou login antecipadamente.

## Decisao resumida

- Novo sistema: Argon2id.
- Compatibilidade: BCrypt para hashes legados.
- Texto puro: proibido.
- Criptografia reversivel: proibida.
- SHA-256 simples: proibido.
- Pepper: somente com secret manager e rotacao.
- Rehash: apos autenticacao valida quando necessario.
```

---

### 2. Adicionar dependencies de teste

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk18on</artifactId>
    <scope>test</scope>
</dependency>
```

Use as versões gerenciadas pelo dependency management.

Não adicione uma versão aleatória.

Valide:

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.springframework.security:spring-security-crypto,org.bouncycastle:bcprov-jdk18on"
```

---

### 3. Criar PasswordHashLab

```java
package br.com.formacao.backend.security.password;

import java.nio.charset.StandardCharsets;
import java.time.Duration;

import org.springframework.security.crypto.argon2
        .Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt
        .BCryptPasswordEncoder;
import org.springframework.security.crypto.password
        .PasswordEncoder;

final class PasswordHashLab {

    static final int BCRYPT_STRENGTH =
            12;

    static final int ARGON2_MEMORY_KIB =
            19 * 1024;

    private PasswordHashLab() {
    }

    static PasswordEncoder bcrypt() {
        return new BCryptPasswordEncoder(
                BCRYPT_STRENGTH
        );
    }

    static PasswordEncoder argon2id() {
        return new Argon2PasswordEncoder(
                16,
                32,
                1,
                ARGON2_MEMORY_KIB,
                2
        );
    }

    static int utf8Length(
            String value
    ) {
        return value
                .getBytes(
                        StandardCharsets.UTF_8
                )
                .length;
    }

    static void validateBcryptLength(
            String rawPassword
    ) {
        if (utf8Length(rawPassword) > 72) {
            throw new IllegalArgumentException(
                    "BCrypt password exceeds 72 UTF-8 bytes"
            );
        }
    }

    static Duration measureMatches(
            PasswordEncoder encoder,
            String syntheticPassword,
            String encoded
    ) {
        long start =
                System.nanoTime();

        if (
            !encoder.matches(
                    syntheticPassword,
                    encoded
            )
        ) {
            throw new IllegalStateException(
                    "Synthetic password should match"
            );
        }

        return Duration.ofNanos(
                System.nanoTime() - start
        );
    }
}
```

A classe fica somente em testes.

---

### 4. Criar PasswordHashLabTest

```java
package br.com.formacao.backend.security.password;

import static org.assertj.core.api.Assertions
        .assertThat;
import static org.assertj.core.api.Assertions
        .assertThatThrownBy;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;

import org.junit.jupiter.api.Test;

import org.springframework.security.crypto.password
        .PasswordEncoder;

class PasswordHashLabTest {

    private static final String SYNTHETIC_PASSWORD =
            "Laboratorio-M15!Senha-Sintetica-2026";
}
```

Esse valor nunca deve ser usado em conta real.

---

### 5. Demonstrar SHA-256 determinístico

```java
@Test
void shouldShowWhyFastHashIsNotPasswordStorage()
        throws Exception {

    MessageDigest digest =
            MessageDigest.getInstance(
                    "SHA-256"
            );

    String first =
            HexFormat.of()
                    .formatHex(
                            digest.digest(
                                    SYNTHETIC_PASSWORD
                                            .getBytes(
                                                    StandardCharsets.UTF_8
                                            )
                            )
                    );

    String second =
            HexFormat.of()
                    .formatHex(
                            digest.digest(
                                    SYNTHETIC_PASSWORD
                                            .getBytes(
                                                    StandardCharsets.UTF_8
                                            )
                            )
                    );

    assertThat(first)
            .isEqualTo(second);
}
```

O teste não imprime o resultado.

Ele demonstra mesma entrada, mesma saída e ausência de salt.

Não use esse código em password storage.

---

### 6. Testar BCrypt

```java
@Test
void shouldEncodeAndMatchWithBcrypt() {
    PasswordEncoder encoder =
            PasswordHashLab.bcrypt();

    String first =
            encoder.encode(
                    SYNTHETIC_PASSWORD
            );

    String second =
            encoder.encode(
                    SYNTHETIC_PASSWORD
            );

    assertThat(first)
            .isNotEqualTo(second);

    assertThat(
            encoder.matches(
                    SYNTHETIC_PASSWORD,
                    first
            )
    )
    .isTrue();

    assertThat(
            encoder.matches(
                    "senha-incorreta",
                    first
            )
    )
    .isFalse();

    assertThat(first)
            .startsWith("$2");
}
```

Hashes diferentes comprovam salts diferentes.

---

### 7. Testar o limite BCrypt

```java
@Test
void shouldValidateBcryptLimitInUtf8Bytes() {
    String seventyTwoBytes =
            "a".repeat(72);

    String moreThanSeventyTwoBytes =
            "a".repeat(69)
            + "🔒";

    assertThat(
            PasswordHashLab.utf8Length(
                    seventyTwoBytes
            )
    )
    .isEqualTo(72);

    assertThat(
            PasswordHashLab.utf8Length(
                    moreThanSeventyTwoBytes
            )
    )
    .isGreaterThan(72);

    PasswordHashLab.validateBcryptLength(
            seventyTwoBytes
    );

    assertThatThrownBy(
            () ->
                    PasswordHashLab
                            .validateBcryptLength(
                                    moreThanSeventyTwoBytes
                            )
    )
    .isInstanceOf(
            IllegalArgumentException.class
    );
}
```

---

### 8. Testar Argon2id

```java
@Test
void shouldEncodeAndMatchWithArgon2id() {
    PasswordEncoder encoder =
            PasswordHashLab.argon2id();

    String first =
            encoder.encode(
                    SYNTHETIC_PASSWORD
            );

    String second =
            encoder.encode(
                    SYNTHETIC_PASSWORD
            );

    assertThat(first)
            .isNotEqualTo(second);

    assertThat(
            encoder.matches(
                    SYNTHETIC_PASSWORD,
                    first
            )
    )
    .isTrue();

    assertThat(
            encoder.matches(
                    "senha-incorreta",
                    first
            )
    )
    .isFalse();

    assertThat(first)
            .startsWith(
                    "$argon2id$"
            )
            .contains(
                    "m=19456,t=2,p=1"
            );
}
```

---

### 9. Medir custo sem assertion absoluta

```java
@Test
void shouldMeasureWithoutTimingAssertion() {
    PasswordEncoder bcrypt =
            PasswordHashLab.bcrypt();

    PasswordEncoder argon2 =
            PasswordHashLab.argon2id();

    String bcryptHash =
            bcrypt.encode(
                    SYNTHETIC_PASSWORD
            );

    String argon2Hash =
            argon2.encode(
                    SYNTHETIC_PASSWORD
            );

    Duration bcryptDuration =
            PasswordHashLab.measureMatches(
                    bcrypt,
                    SYNTHETIC_PASSWORD,
                    bcryptHash
            );

    Duration argon2Duration =
            PasswordHashLab.measureMatches(
                    argon2,
                    SYNTHETIC_PASSWORD,
                    argon2Hash
            );

    assertThat(bcryptDuration)
            .isPositive();

    assertThat(argon2Duration)
            .isPositive();

    System.out.printf(
            "bcrypt verification: %d ms%n",
            bcryptDuration.toMillis()
    );

    System.out.printf(
            "argon2id verification: %d ms%n",
            argon2Duration.toMillis()
    );
}
```

O teste imprime somente duração.

Nunca imprima password, hash, salt ou pepper.

---

### 10. Executar os testes

```powershell
.\mvnw.cmd `
  -Dtest=PasswordHashLabTest `
  test
```

Execute três vezes.

Registre:

- hardware;
- JVM;
- host ou container;
- BCrypt strength;
- Argon2 memory;
- iterations;
- mediana observada.

Uma única execução não define uma policy.

---

### 11. Experimentar BCrypt

Altere temporariamente:

```text
10;

11;

12;

13.
```

Observe a progressão.

Depois restaure:

```text
12.
```

Não use custo extremo.

O login pode ficar impraticável.

---

### 12. Experimentar Argon2id

Avalie temporariamente:

```text
19 MiB;

32 MiB;

64 MiB.
```

Mantenha as outras variáveis constantes.

Observe:

- tempo;
- memória;
- concorrência possível.

Depois restaure a baseline.

---

### 13. Documentar salt

```markdown
## Salt

- Gerado automaticamente.
- Unico por hash.
- Nao secreto.
- Incorporado na representacao.
- Nao armazenado em coluna manual.
- Nao concatenado pela aplicacao.
```

---

### 14. Documentar pepper

```markdown
## Pepper

Nao sera usado na primeira implementacao.

Sua adocao exigira:

- secret manager;
- versao;
- permissao minima;
- rotacao;
- recovery;
- rehash ou reset;
- teste de indisponibilidade.

Pepper nunca sera armazenado junto ao hash.
```

---

### 15. Documentar o formato futuro

A futura tabela poderá armazenar:

```text
password_hash VARCHAR(255).
```

O valor deve conter o formato completo.

Exemplos conceituais:

```text
{argon2}$argon2id$...

{bcrypt}$2a$...
```

Não crie a tabela agora.

Não crie `password_plain`.

Não exponha `password_hash`.

---

### 16. Documentar migração

```markdown
## Migracao

- Hash informa algoritmo e parametros.
- Hash legado continua verificavel.
- Novos cadastros usam a policy atual.
- Login valido pode disparar rehash.
- `upgradeEncoding` sera avaliado.
- Algoritmo desconhecido falha seguro.
- Migracao nunca descriptografa senha.
```

---

### 17. Documentar operação

Registre:

- rate limit de login;
- limite de concorrência;
- métricas sem segredo;
- CPU;
- memória;
- timeout;
- teste de carga;
- capacity planning;
- reset seguro;
- resposta a compromise.

Password hashing caro é intencional.

A operação precisa suportar o custo.

---

### 18. Atualizar o threat model

Adicione:

```text
THR-011:
vazamento da base de hashes.

THR-012:
hash rápido ou sem salt.

THR-013:
pepper exposto.

THR-014:
custo excessivo usado para DoS.

THR-015:
hash ou senha em log.
```

Associe:

```text
A04;

A07;

A08;

A09;

A10.
```

---

### 19. Atualizar OWASP e baseline

A04:

```text
password hashing adaptativo planejado.
```

A07:

```text
storage decision presente;
autenticação ainda ausente.
```

A08:

```text
formato versionado e migração.
```

A09:

```text
senha e hash proibidos em logs.
```

A10:

```text
algoritmo desconhecido falha seguro.
```

Na baseline:

```text
usuários:
ausentes.

hash preferencial:
Argon2id.

compatibilidade:
BCrypt.

produção:
pendente.
```

Não marque A07 como resolvida.

---

### 20. Executar o gate

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- dependencies em test scope;
- nenhum bean novo;
- nenhum endpoint;
- nenhuma tabela;
- runtime inalterado;
- nenhum segredo no output.

---

## Entendendo o que foi feito

### Senha deixou de ser recuperável

A decisão armazena verificadores.

### Hash geral foi diferenciado

SHA-256 rápido não foi adotado para senhas.

### Salt foi automatizado

A mesma senha produziu hashes diferentes.

### Pepper permaneceu operacional

Ele não virou uma constante no código.

### BCrypt foi tratado com limites

Cost e 72 bytes ficaram explícitos.

### Argon2id ganhou parâmetros visíveis

Memória, iterações e paralelismo foram documentados.

### Benchmark não virou teste frágil

Tempo foi medido sem limite absoluto.

### Migração foi planejada

Hashes legados podem ser verificados e atualizados.

### Runtime não foi antecipado

Nenhum login ou security chain foi criado.

---

## Erros comuns importantes

### Armazenar texto puro

Um vazamento entrega as credenciais.

### Criptografar senha

A chave permite recuperar todas.

### Usar SHA-256 simples

O atacante calcula tentativas rapidamente.

### Criar salt fixo

Usuários com mesma senha voltam a gerar padrões.

### Armazenar pepper no banco

A separação deixa de existir.

### Comparar novo encode com hash armazenado

O salt novo muda a saída.

### Ignorar 72 bytes

Unicode pode ultrapassar o limite.

### Truncar silenciosamente

Senhas diferentes podem se tornar equivalentes.

### Copiar work factor

Hardware e carga são diferentes.

### Logar hash

O hash permite ataque offline.

---

## Comandos úteis

### Dependências

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.springframework.security:spring-security-crypto,org.bouncycastle:bcprov-jdk18on"
```

### Teste focado

```powershell
.\mvnw.cmd `
  -Dtest=PasswordHashLabTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar usos sensíveis

```powershell
Select-String `
  -Path "src/main/java/**/*.java" `
  -Pattern `
    "password|senha|passwordHash" `
  -CaseSensitive:$false
```

### Revisar pom

```powershell
git diff `
  -- `
  "pom.xml"
```

---

## Exercício guiado

### Parte 1 — Conceitos

Diferencie encoding, encryption e hashing.

### Parte 2 — Ataque

Explique online e offline.

### Parte 3 — Salt

Comprove hashes diferentes.

### Parte 4 — Matches

Valide senha correta e incorreta.

### Parte 5 — BCrypt

Meça costs e valide bytes.

### Parte 6 — Argon2id

Meça memória e iterações.

### Parte 7 — Pepper

Crie um plano sem implementar.

### Parte 8 — Migração

Desenhe rehash no login.

### Parte 9 — Operação

Registre capacidade e DoS.

### Parte 10 — Segurança

Atualize baseline, threat model e OWASP.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 416 foi preservada;
- encoding foi diferenciado de proteção;
- Base64 foi rejeitado;
- criptografia reversível foi explicada;
- criptografia de senha foi rejeitada;
- SHA-256 simples foi rejeitado;
- MD5 foi rejeitado;
- SHA-1 foi rejeitado;
- ataque online foi explicado;
- ataque offline foi explicado;
- rate limiting não foi tratado como defesa offline;
- funções adaptativas foram explicadas;
- BCrypt foi estudado;
- Argon2id foi estudado;
- PBKDF2 foi citado;
- scrypt foi citado;
- salt foi explicado;
- salt único foi exigido;
- salt não secreto foi registrado;
- salt automático foi usado;
- salt fixo foi rejeitado;
- pepper foi explicado;
- pepper foi diferenciado de salt;
- pepper fora do banco foi exigido;
- secret manager foi exigido;
- rotação foi explicada;
- pepper não foi implementado;
- work factor foi explicado;
- risco de DoS foi considerado;
- calibração por ambiente foi exigida;
- tempo absoluto não virou assertion;
- BCrypt cost foi explicado;
- strength 12 foi usado somente no lab;
- limite de 72 bytes foi explicado;
- bytes foram diferenciados de caracteres;
- UTF-8 foi testado;
- truncamento foi rejeitado;
- pré-hash caseiro foi rejeitado;
- Argon2d foi explicado;
- Argon2i foi explicado;
- Argon2id foi explicado;
- Argon2id foi preferido;
- memory hardness foi explicada;
- salt length foi registrado;
- hash length foi registrado;
- 19 MiB foram configurados;
- duas iterações foram configuradas;
- paralelismo um foi configurado;
- parâmetros foram codificados no hash;
- defaults foram tratados como início;
- Bouncy Castle foi registrado;
- dependencies ficaram em test scope;
- PasswordHashLab foi criado;
- BCrypt encoder foi criado;
- Argon2 encoder foi criado;
- validator de bytes foi criado;
- PasswordHashLabTest foi criado;
- SHA-256 determinístico foi demonstrado;
- SHA-256 não foi usado em produção;
- BCrypt gerou hashes diferentes;
- BCrypt validou senha correta;
- BCrypt rejeitou senha incorreta;
- Argon2 gerou hashes diferentes;
- Argon2 validou senha correta;
- Argon2 rejeitou senha incorreta;
- prefixo Argon2id foi validado;
- parâmetros Argon2 foram validados;
- duração foi medida;
- senha não foi impressa;
- hash não foi impresso;
- salt não foi impresso;
- benchmark foi repetido;
- hardware foi registrado;
- baseline foi restaurada;
- documento de decisão foi criado;
- novo sistema escolheu Argon2id;
- BCrypt foi mantido para legado;
- texto puro foi proibido;
- policy de salt foi registrada;
- policy de pepper foi registrada;
- formato futuro foi registrado;
- tabela de usuário não foi criada;
- endpoint de usuário não foi criado;
- password hash não foi exposto;
- algorithm agility foi explicada;
- DelegatingPasswordEncoder foi introduzido;
- rehash foi explicado;
- upgradeEncoding foi citado;
- algoritmo desconhecido falha seguro;
- hashes foram tratados como sensíveis;
- logs de senha foram proibidos;
- logs de hash foram proibidos;
- threat model foi atualizado;
- OWASP review foi atualizada;
- baseline foi atualizada;
- A07 não foi marcada como resolvida;
- gate completo foi executado;
- runtime não ganhou security chain;
- login não foi implementado;
- usuário não foi implementado;
- banco de usuário não foi implementado;
- commit recomendado está pronto;
- ponte para a aula 418 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "test(m15): comparar BCrypt e Argon2id para senhas"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- senhas reais;
- hashes reais;
- pepper;
- credentials;
- env files;
- benchmark sensível;
- logs de secrets;
- tabela de usuário antecipada;
- bean de autenticação antecipado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você definiu como uma senha futura será armazenada.

A decisão ficou:

```text
novo sistema:
Argon2id.

compatibilidade legada:
BCrypt.

texto puro:
proibido.

criptografia reversível:
proibida.

SHA-256 simples:
proibido.
```

Você comprovou:

```text
mesma senha;

salts diferentes;

hashes diferentes;

matches verdadeiro.
```

Também registrou:

```text
BCrypt:
limite de 72 bytes.

Argon2id:
custo de memória.

pepper:
somente com operação segura.

work factor:
calibrado por ambiente.

migração:
rehash após login válido.
```

A decisão central foi:

```text
o sistema nunca precisa
recuperar a senha;

ele precisa armazenar
um verificador adaptativo
que torne cada tentativa
cara para um atacante.
```

A aplicação continua sem autenticação real.

A próxima aula será:

```text
418 - M15.08 - Spring Security arquitetura
```

Nela, você estudará:

- filter chain;
- `SecurityContext`;
- `Authentication`;
- `AuthenticationManager`;
- `AuthenticationProvider`;
- `UserDetailsService`;
- `PasswordEncoder`;
- entry point;
- access denied handler;
- anonymous authentication;
- request cache;
- fluxo de autenticação.

Nenhuma configuração prática ampla será feita antes de entender essas responsabilidades.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei hash, encryption e encoding.
- [ ] Comprovei salt automático e matches.
- [ ] Entendi BCrypt e seu limite.
- [ ] Entendi Argon2id e memory hardness.
- [ ] Documentei calibração e migração.

---

## Troubleshooting adicional

### Argon2 lança ClassNotFoundException

Confirme `bcprov-jdk18on` em test scope.

Revise o dependency tree.

### BCrypt rejeita uma senha aparentemente curta

Meça bytes UTF-8.

Unicode pode ocupar mais de um byte.

### Os testes ficaram lentos

Revise parâmetros somente no laboratório.

Não esconda o custo com timeout excessivo.

### Tempos variam

Feche tarefas concorrentes e repita.

Benchmark de CI é informativo.

### Dois hashes são diferentes

Esse é o resultado esperado.

Use `matches`.

### O hash apareceu no relatório

Remova o valor.

Registre somente algoritmo, parâmetros e duração.

### Argon2 consome memória em paralelo

Considere concorrência e limites do container.

### A dependency entrou em runtime

Confirme `<scope>test</scope>`.

A arquitetura começa na próxima aula.

---

## Perguntas de revisão

1. Base64 protege senha?
2. Por que não criptografar senha?
3. Por que SHA-256 simples é inadequado?
4. O que é ataque offline?
5. O que é função adaptativa?
6. Para que serve salt?
7. Salt é secreto?
8. O que é pepper?
9. Onde fica o pepper?
10. O que é work factor?
11. Qual é o limite BCrypt?
12. O limite é em caracteres?
13. Qual variante Argon2 foi escolhida?
14. O que memory-hard significa?
15. Hashes iguais são esperados?
16. Como verificar senha?
17. Hash pode ir para logs?
18. Como migrar hashes?
19. A autenticação já foi implementada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Não.
2. Porque ela é recuperável por chave.
3. Porque é rápida para ataques offline.
4. Teste local contra hashes vazados.
5. Função com custo ajustável.
6. Tornar cada hash único.
7. Não.
8. Segredo adicional fora do banco.
9. Em secret manager.
10. Custo de cálculo.
11. 72 bytes.
12. Não.
13. Argon2id.
14. Exige memória por tentativa.
15. Não, por causa do salt.
16. Com `matches`.
17. Não.
18. Rehash após autenticação válida.
19. Não.
20. Spring Security arquitetura.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 417 - M15.07 - Hash de senha BCrypt Argon2 conceitual

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei encoding, criptografia e hashing.
- Rejeitei Base64 como proteção.
- Rejeitei criptografia reversível para senha.
- Rejeitei MD5, SHA-1 e SHA-256 simples.
- Diferenciei ataques online e offline.
- Estudei funções adaptativas unidirecionais.
- Estudei salt aleatório e único.
- Confirmei que salt não é secreto.
- Estudei pepper e sua operação.
- Não implementei pepper sem secret manager.
- Estudei work factor e calibração.
- Estudei BCrypt.
- Usei strength 12 somente no laboratório.
- Estudei o limite BCrypt de 72 bytes.
- Diferenciei bytes e caracteres UTF-8.
- Rejeitei truncamento silencioso.
- Estudei Argon2d, Argon2i e Argon2id.
- Escolhi Argon2id para novos sistemas.
- Estudei memory hardness.
- Configurei 19 MiB, duas iterações e paralelismo um no laboratório.
- Adicionei Spring Security Crypto somente em test scope.
- Adicionei Bouncy Castle somente em test scope.
- Criei `PasswordHashLab`.
- Criei `PasswordHashLabTest`.
- Demonstrei que SHA-256 é determinístico e rápido.
- Confirmei hashes diferentes para a mesma senha.
- Testei `matches` com senha correta e incorreta.
- Validei o limite BCrypt em bytes.
- Validei parâmetros do Argon2id.
- Medi tempos sem assertion absoluta.
- Não imprimi senha, hash, salt ou pepper.
- Criei `docs/security/M15_PASSWORD_STORAGE_DECISION.md`.
- Planejei algorithm agility e rehash.
- Mantive BCrypt para compatibilidade legada.
- Atualizei baseline, threat model e OWASP.
- Não criei usuário, tabela, login ou SecurityFilterChain.
- Próxima aula: Spring Security arquitetura.
```

---

## Referência técnica curta

- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Spring Security — Password Storage](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)
- [Spring Security — PasswordEncoder](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/password-encoder.html)
- [RFC 9106 — Argon2](https://www.rfc-editor.org/rfc/rfc9106.html)
- [NIST SP 800-63B — Passwords](https://pages.nist.gov/800-63-4/sp800-63b/passwords/)

Regra final:

```text
senhas precisam ser armazenadas como verificadores salted, adaptativos e unidirecionais, nunca como texto, Base64, criptografia reversível ou hash rápido; nesta decisão, Argon2id é preferido para novos sistemas com parâmetros calibrados por ambiente, BCrypt permanece para compatibilidade com limite explícito de 72 bytes, pepper só existe com secret manager e plano de rotação, e a migração ocorre por formato versionado e rehash após autenticação válida.
```
