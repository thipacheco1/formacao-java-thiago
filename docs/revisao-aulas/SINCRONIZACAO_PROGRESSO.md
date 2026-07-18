# Sincronização de progresso entre dispositivos

Última revisão técnica: **2026-07-18**.

## Garantia funcional

Quando o aluno entra com a mesma conta, a plataforma sincroniza no Redis/Vercel KV:

- aulas concluídas ou reabertas;
- etapas concluídas ou desmarcadas dentro de cada roteiro guiado;
- etapa ativa de cada aula;
- última aula aberta;
- cache local e fila de alterações feitas temporariamente sem conexão.

Ao abrir a plataforma em outro computador ou celular, o estado central é carregado antes da retomada. A última aula é aberta automaticamente quando não existe uma aula explícita na URL, a etapa ativa recebe foco e as etapas já realizadas aparecem concluídas.

## Separação dos dados

### Conclusão curricular

- Cliente: `completedLessons_<email>` e `progressMutations_<email>`.
- API: `api/progress.js`.
- Redis: `progress:<email>`.
- Escrita: mutação atômica por aula, sem substituir o mapa inteiro.

### Estado detalhado da aprendizagem

- Cliente: `learningStateCache_<email>` e `learningStateMutations_<email>`.
- Ponte: `plataforma-curso/src/utils/useLearningStateSync.js`.
- API: `api/learning-state.js`.
- Redis Hash: `learning-state:<email>`.
- Campos: `__lastLessonId` e `lesson:<lessonId>`.
- Snapshot de aula: `stepStorageKey`, `completedStepIds`, `activeStepIndex` e `updatedAt`.

As chaves históricas `guided-*-lesson-NNN-progress` continuam sendo usadas pelos componentes. A ponte observa o roteiro renderizado, envia as alterações ao servidor e repõe essas chaves ao hidratar outro dispositivo. Isso evita reescrever individualmente todas as experiências guiadas já construídas.

## Conflitos, troca de conta e modo offline

- Alterações pendentes ficam em uma fila local específica do e-mail.
- Ao recuperar conexão, a fila é enviada antes da leitura do estado central.
- Escritas de aulas diferentes usam campos independentes no Redis Hash.
- Na mesma aula, prevalece o snapshot salvo por último.
- `guidedProgressOwnerEmail` impede que etapas locais do usuário anterior sejam migradas para outra conta no mesmo navegador.
- A primeira conta que encontra progresso legado sem proprietário pode migrá-lo; contas seguintes recebem apenas o próprio estado central.

### Compatibilidade com progresso antigo

Versões antigas podiam deixar `progress:<email>` como um array JSON, inclusive `[]`.
A API aceita esse formato somente como legado, converte cada identificador válido em
`{ "lessonId": true }` e grava o mapa atual na próxima alteração. A migração aditiva
`progressCentralMigrationV3_<email>` também reenvia uma vez o progresso preservado
no navegador, sem remover conclusões que já chegaram de outro dispositivo.

## Sessão e autorização

- Login e cadastro criam o cookie HttpOnly assinado `course_user_session`.
- A assinatura usa `USER_SESSION_SECRET`, com fallback para `ADMIN_SESSION_SECRET` ou `KV_REST_API_TOKEN`.
- `api/progress.js` e `api/learning-state.js` recusam leitura ou escrita de outro e-mail.
- Administradores autenticados mantêm acesso aos relatórios de progresso.
- Contas anteriores à sessão assinada precisam fazer login novamente uma única vez, controlado por `signedUserSessionV1`.
- Se a sessão expirar, a plataforma abre o login e preserva as mutações pendentes para retomá-las depois da autenticação.

## Exclusão de usuário

Ao excluir uma conta pelo painel administrativo, são removidos:

- `progress:<email>`;
- `learning-state:<email>`.

## Validação obrigatória

Execute:

```powershell
node tools/validate-learning-state-sync.mjs
node tools/validate-progress-compatibility.mjs
plataforma-curso\node_modules\.bin\oxlint.cmd plataforma-curso/src/App.jsx plataforma-curso/src/utils/useLearningStateSync.js api/learning-state.js api/progress.js api/users.js api/_lib/user-session.js api/_lib/admin-session.js
npm.cmd run build --prefix plataforma-curso
```

O validador cobre sessão assinada, autorização entre contas, gravação e leitura do Redis Hash, última aula, etapas concluídas, etapa ativa, fila offline e integração no aplicativo.
