# Desafio 1 - Encurtador de URLs

Projeto desenvolvido como parte do desafio da Pós-Graduação GoExpert da Rocketseat. Trata-se de uma aplicação full-stack para encurtamento de URLs, com funcionalidades de gerenciamento de links e exportação de dados.

## 🚀 Tecnologias

### Frontend
- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes UI acessíveis
- **React Router DOM** - Roteamento client-side
- **React Query (@tanstack/react-query)** - Gerenciamento de estado assíncrono
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP
- **Sonner** - Notificações toast
- **Lucide React** - Ícones

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Fastify** - Framework web performático
- **Drizzle ORM** - ORM type-safe para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de dados
- **AWS SDK (S3)** - Integração com Cloudflare R2

### Infraestrutura
- **Pulumi** - Infrastructure as Code
- **Cloudflare R2** - Object storage para arquivos CSV
- **Docker** - Containerização
- **Render** - Hospedagem do backend
- **Vercel** - Hospedagem do frontend

## ✅ Funcionalidades Implementadas

### Backend
- [x] **Criar link encurtado**
  - [x] Validação de URL formatada
  - [x] Código customizado ou gerado aleatoriamente
  - [x] Validação de código único (não permite duplicatas)
- [x] **Listar todos os links**
  - [x] Ordenação por data de criação (mais recentes primeiro)
  - [x] Retorna: ID, código, URL original, contador de acessos, data de criação
- [x] **Deletar link**
- [x] **Redirecionamento**
  - [x] Redirect 302 para URL original
  - [x] Headers anti-cache para garantir incremento correto
- [x] **Contagem de acessos**
  - [x] Incremento automático a cada acesso
  - [x] Query SQL otimizada (atomic increment)
- [x] **Exportação de dados**
  - [x] Geração de arquivo CSV
  - [x] Upload automático para Cloudflare R2
  - [x] Presigned URLs (válidas por 1 hora)
  - [x] Nome único gerado com UUID
  - [x] Campos: ID, Code, Original URL, Access Count, Created At

### Frontend
- [x] **Interface de criação de links**
  - [x] Input para URL original
  - [x] Input opcional para código customizado
  - [x] Validação em tempo real
  - [x] Feedback de erros (modal + toast)
- [x] **Listagem de links**
  - [x] Exibição de todos os links criados
  - [x] Contador de acessos em tempo real
  - [x] Auto-refresh a cada 10 segundos
  - [x] Refresh ao voltar para a aba (window focus)
- [x] **Ações sobre links**
  - [x] Copiar link encurtado (clipboard)
  - [x] Deletar link (com modal de confirmação)
  - [x] Exportar todos os links em CSV
- [x] **Sistema de notificações**
  - [x] Toast de sucesso/erro para todas as operações
  - [x] Loading states em botões e operações
- [x] **UX/UI**
  - [x] Design responsivo
  - [x] Animações e transições suaves
  - [x] Estados de loading visual
  - [x] Tratamento de erros amigável

## 🎨 Design e Layout

- **Paleta de cores**: Azul primário (#4F46E5) com tema claro
- **Tipografia**: Sistema de fontes nativas
- **Componentes**: Baseados em Radix UI (acessibilidade)
- **Responsividade**: Mobile-first approach
- **Ícones**: Lucide React e Phosphor Icons

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Conta Cloudflare (para R2 storage)
- npm ou yarn

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
```

**Edite o `.env` com suas credenciais:**

```env
PORT=3333
DATABASE_URL="postgresql://docker:docker@localhost:5432/shortlinks"

# Cloudflare R2 Configuration
CLOUDFLARE_ACCOUNT_ID="seu_account_id"
CLOUDFLARE_BUCKET="shortlinks-export-bucket"
CLOUDFLARE_ACCESS_KEY_ID="sua_access_key"
CLOUDFLARE_SECRET_ACCESS_KEY="sua_secret_key"
```

**Subir banco de dados e rodar migrations:**

```bash
# Subir PostgreSQL com Docker
docker-compose up -d

# Gerar e rodar migrations
npm run db:generate
npm run db:migrate

# Iniciar servidor de desenvolvimento
npm run dev
```

### 3. Frontend

```bash
cd web
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

**Edite o `.env`:**

```env
VITE_API_BASE_URL=http://localhost:3333
```

**Iniciar frontend:**

```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 🐳 Docker (Produção)

### Backend

O backend possui um `Dockerfile` otimizado (multi-stage build):

```bash
cd server
docker build -t url-shortener-backend .
docker run -p 3333:3333 --env-file .env url-shortener-backend
```

## 🚀 Deploy

### Backend (Render)

1. Conecte seu repositório no Render
2. Configure as variáveis de ambiente:
   - `DATABASE_URL`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_BUCKET`
   - `CLOUDFLARE_ACCESS_KEY_ID`
   - `CLOUDFLARE_SECRET_ACCESS_KEY`
3. Build command: `npm run build`
4. Start command: `npm run start:migrate`

### Frontend (Vercel)

1. Conecte seu repositório no Vercel
2. Configure a variável de ambiente:
   - `VITE_API_BASE_URL` = URL do backend no Render
3. Build command: `npm run build`
4. Output directory: `dist`

## 📁 Estrutura do Projeto

```
desafio-1/
├── web/                      # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── features/     # Componentes de features
│   │   │   │   └── links/    # Componentes relacionados a links
│   │   │   └── ui/           # Componentes UI reutilizáveis
│   │   ├── hooks/            # Custom hooks (useLinks)
│   │   ├── lib/              # Configurações (axios, etc)
│   │   ├── pages/            # Páginas (Home, Redirect, NotFound)
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx           # App principal
│   ├── public/               # Arquivos estáticos
│   └── package.json
│
├── server/                   # Backend Node.js
│   ├── src/
│   │   ├── controllers/      # Controllers (linkController)
│   │   ├── services/         # Services (linkService, exportService)
│   │   ├── routes/           # Rotas (linkRoutes)
│   │   ├── schemas/          # Schemas Zod
│   │   ├── db/               # Database config e schema
│   │   ├── utils/            # Utilitários
│   │   └── server.ts         # Server principal
│   ├── drizzle/              # Migrations
│   ├── Dockerfile            # Docker config
│   └── package.json
│
├── infra/                    # Infrastructure as Code
│   ├── index.ts              # Pulumi config
│   └── package.json
│
├── docker-compose.yml        # PostgreSQL local
└── README.md
```

## 🔧 Scripts Úteis

### Backend
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run db:generate  # Gerar migrations
npm run db:migrate   # Rodar migrations
npm run test:r2      # Testar conexão com R2
```

### Frontend
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Rodar linter
```

## 📝 Notas Técnicas

### Cache e Performance
- React Query com `refetchInterval` de 10 segundos
- `refetchOnWindowFocus` habilitado
- `staleTime: 0` e `gcTime: 0` para dados sempre frescos
- Backend com headers anti-cache nos redirects

### Segurança
- Validação de dados com Zod no backend e frontend
- Sanitização de inputs
- CORS configurado
- Presigned URLs com expiração de 1 hora
- Credenciais em variáveis de ambiente

### Database
- Migrations gerenciadas pelo Drizzle Kit
- Atomic increment para contador de acessos
- Índice único no campo `code`

## 📄 Licença

ISC

## 👨‍💻 Autor

Alan Santos - Pós-Graduação Tech Develop 360 - Faculdade de Tecnologia Rocketseat
