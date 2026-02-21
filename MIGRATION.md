# Migração - Login e Isolamento por Usuário

## Alterações no Banco de Dados

Execute a migração para adicionar suporte a login local e isolamento de dados por usuário:

```bash
# Configure DATABASE_URL no .env
pnpm db:push
```

## Se você tem dados existentes

A migração adiciona a coluna `userId` às tabelas `categories`, `materials` e `movements`. Se você já tem dados:

1. Crie um usuário admin primeiro (via cadastro na tela de login)
2. Ou execute manualmente no MySQL:
   ```sql
   -- Adicione as colunas como nullable primeiro
   ALTER TABLE categories ADD userId int;
   ALTER TABLE materials ADD userId int;
   ALTER TABLE movements ADD userId int;
   -- Atribua ao primeiro usuário (ajuste o ID se necessário)
   UPDATE categories SET userId = 1 WHERE userId IS NULL;
   UPDATE materials SET userId = 1 WHERE userId IS NULL;
   UPDATE movements SET userId = 1 WHERE userId IS NULL;
   -- Torne NOT NULL
   ALTER TABLE categories MODIFY userId int NOT NULL;
   ALTER TABLE materials MODIFY userId int NOT NULL;
   ALTER TABLE movements MODIFY userId int NOT NULL;
   ```

## Novo fluxo

1. **Login/Cadastro**: Tela de login com email e senha
2. **Isolamento**: Cada usuário vê apenas seus próprios dados (materiais, categorias, movimentações)
3. **Executável**: Use `pnpm electron:full` para build + web + iniciar Electron
