import * as dotenv from 'dotenv';
import path from 'path';

// Configurar caminhos
const rootDir = path.resolve(process.cwd());

// Tentar carregar o .env de diferentes locais possíveis
const envPaths = [
  path.join(rootDir, '.env'),
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), 'server', '.env')
];

let envLoaded = false;
for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    console.log('✅ Arquivo .env carregado com sucesso de:', envPath);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.error('❌ Erro ao carregar o arquivo .env');
  console.error('Caminhos tentados:');
  envPaths.forEach(path => console.error('- ' + path));
  console.error('\nDiretório atual:', process.cwd());
  throw new Error('Falha ao carregar variáveis de ambiente');
}

// Verificar variáveis obrigatórias
const requiredEnvVars = [
  'CLOUDFLARE_ACCOUNT_ID', 
  'CLOUDFLARE_ACCESS_KEY_ID', 
  'CLOUDFLARE_SECRET_ACCESS_KEY', 
  'CLOUDFLARE_BUCKET'
];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Variáveis de ambiente obrigatórias não encontradas:', missingEnvVars);
  console.error('\nCertifique-se de que seu arquivo .env contém as seguintes variáveis:');
  console.error(`
CLOUDFLARE_ACCOUNT_ID=seu_account_id
CLOUDFLARE_ACCESS_KEY_ID=sua_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=sua_secret_key
CLOUDFLARE_BUCKET=nome_do_seu_bucket
  `);
  throw new Error('Variáveis de ambiente obrigatórias não encontradas');
}

// Agora podemos importar o restante das dependências
import fastify from 'fastify';
import cors from '@fastify/cors';
import { linkRoutes } from './routes/linkRoutes';
import fastifyStatic from '@fastify/static';

console.log('📦 Configurações Cloudflare R2:', {
  bucket: process.env.CLOUDFLARE_BUCKET,
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  hasAccessKey: !!process.env.CLOUDFLARE_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.CLOUDFLARE_SECRET_ACCESS_KEY
});

const app = fastify();

// Configurar CORS
app.register(cors, {
  origin: true
});

// Registrar rotas
app.register(linkRoutes);

// Configurar diretório público para servir arquivos estáticos
app.register(fastifyStatic, {
  root: path.join(rootDir, 'public'),
  prefix: '/'
});

app.listen({ port: 3333 }, (err) => {
  if (err) {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  }
  console.log('🚀 Servidor rodando em http://localhost:3333');
});