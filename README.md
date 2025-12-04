# Desafio 1 - Encurtador de URLs

Projeto desenvolvido como parte do desafio da Pós-Graduação GoExpert da Rocketseat. Trata-se de uma aplicação full-stack para encurtamento de URLs, com funcionalidades de gerenciamento de links e exportação de dados.

## 🚀 Tecnologias

- **Frontend**: React, Vite, TailwindCSS, Shadcn/ui.
- **Backend**: Node.js, Fastify, Drizzle ORM, PostgreSQL.
- **Infraestrutura**: Pulumi (IaC), Cloudflare R2 (Storage), Docker.

## ✅ Funcionalidades e Requisitos

- [x] **Criar um link**
    - [x] Validação de URL formatada
    - [x] Validação de código único (gerado aleatoriamente ou customizado)
- [x] **Deletar um link**
- [x] **Redirecionamento** (Obter URL original via código encurtado)
- [x] **Listar todas as URLs**
- [x] **Contagem de acessos** (Incremento ao acessar o link encurtado)
- [x] **Exportação de dados**
    - [x] Exportar links em CSV
    - [x] Upload automático para CDN (Cloudflare R2)
    - [x] Geração de nome aleatório e único para o arquivo
    - [x] Listagem performática
    - [x] Campos: URL original, URL encurtada, acessos, data de criação

## 🛠️ Como Rodar o Projeto

### 1. Infraestrutura (Opcional - Para Exportação CSV)
Este projeto usa o **Pulumi** para provisionar um bucket no Cloudflare R2.

```bash
cd infra
npm install
pulumi login
pulumi config set accountId <SEU_CLOUDFLARE_ACCOUNT_ID>
export CLOUDFLARE_API_TOKEN=<SEU_TOKEN_R2_ADMIN>
pulumi up
```
*Após o deploy, copie o nome do bucket para o `.env` do servidor.*

### 2. Backend

```bash
cd server
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Banco e Cloudflare

# Subir o banco de dados (Docker)
docker-compose up -d

# Rodar migrations
npm run db:migrate

# Iniciar servidor
npm run dev
```

### 3. Frontend

```bash
cd web
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Defina VITE_API_BASE_URL="http://localhost:3333"

# Iniciar frontend
npm run dev
```

## 🐳 Docker (Produção)

O backend possui um `Dockerfile` otimizado (multi-stage build) pronto para deploy em serviços como Render, Railway ou AWS App Runner.

```bash
cd server
docker build -t url-shortener-backend .
docker run -p 3333:3333 --env-file .env url-shortener-backend
```
