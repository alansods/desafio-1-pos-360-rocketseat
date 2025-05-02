# Brev.ly - URL Shortener API

## Cloudflare R2 Configuration Guide

Para configurar o Cloudflare R2 para exportação de arquivos CSV, siga os passos abaixo:

### 1. Configurar Variáveis de Ambiente

Certifique-se que seu arquivo `.env` tenha as seguintes variáveis configuradas:

```
R2_ACCOUNT_ID=seu_account_id
R2_ACCESS_KEY_ID=sua_access_key
R2_SECRET_ACCESS_KEY=sua_secret_key
R2_BUCKET=nome_do_seu_bucket
```

### 2. Verificar Configuração do R2

1. Execute o teste de conexão:
   ```
   npm run test:r2
   ```

2. O teste irá:
   - Verificar suas credenciais
   - Fazer upload de um arquivo de teste
   - Gerar uma URL assinada
   - Remover o arquivo de teste

### 3. Solução de Problemas

Se você encontrar erros, verifique:

1. **Credenciais R2:**
   - Confirme se o Account ID está correto
   - Verifique se as chaves de acesso estão corretas
   - Certifique-se que o token R2 tem as permissões necessárias

2. **Bucket:**
   - Confirme se o bucket existe
   - Verifique se o nome do bucket está correto

3. **Permissões:**
   - O token R2 deve ter permissões para:
     - `com.cloudflare.edge.r2.bucket.get_bucket`
     - `com.cloudflare.edge.r2.bucket.put_object`
     - `com.cloudflare.edge.r2.bucket.get_object`
     - `com.cloudflare.edge.r2.bucket.delete_object`

### Observação Importante

O sistema possui um mecanismo de fallback que salva os arquivos CSV localmente no diretório `/public/exports` caso o upload para o R2 falhe. Isso garante que a funcionalidade continue funcionando mesmo sem a configuração correta do R2.

## Desenvolvimento Local

1. Instale as dependências:
   ```
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

3. O servidor estará rodando em: http://localhost:3333 