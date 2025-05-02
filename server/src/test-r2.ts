import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar caminhos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
  process.exit(1);
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
  process.exit(1);
}

async function testR2Connection() {
  console.log('\n📦 Configurações Cloudflare R2:');
  console.log('----------------');
  console.log(`Account ID: ${process.env.CLOUDFLARE_ACCOUNT_ID}`);
  console.log(`Bucket: ${process.env.CLOUDFLARE_BUCKET}`);
  console.log(`Access Key ID: ${process.env.CLOUDFLARE_ACCESS_KEY_ID ? '******' + process.env.CLOUDFLARE_ACCESS_KEY_ID.slice(-4) : 'não definido'}`);
  console.log('----------------\n');

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!
    }
  });

  try {
    // Teste 1: Upload de arquivo
    console.log('1️⃣ Tentando fazer upload de teste...');
    const testKey = `test-${Date.now()}.txt`;
    const testContent = 'Teste de conexão com Cloudflare R2';
    
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET!,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain'
    });

    const uploadResult = await s3Client.send(uploadCommand);
    console.log('✅ Upload bem-sucedido:', uploadResult);

    // Teste 2: Gerar URL assinada
    console.log('\n2️⃣ Gerando URL assinada...');
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET!,
      Key: testKey
    });

    const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 3600 // 1 hora
    });
    console.log('✅ URL assinada gerada com sucesso');
    console.log('🔗 URL:', signedUrl);

    // Teste 3: Remover arquivo de teste
    console.log('\n3️⃣ Removendo arquivo de teste...');
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET!,
      Key: testKey
    });

    await s3Client.send(deleteCommand);
    console.log('✅ Arquivo removido com sucesso');

    console.log('\n🎉 Todos os testes completados com sucesso!');
    console.log('O Cloudflare R2 está configurado corretamente e pronto para uso.');

  } catch (error: any) {
    console.error('\n❌ Erro durante os testes:');
    console.error(`Nome do erro: ${error.name}`);
    console.error(`Mensagem: ${error.message}`);
    
    if (error.$metadata) {
      console.error('\nDetalhes do erro:');
      console.error(`Código HTTP: ${error.$metadata.httpStatusCode}`);
      console.error(`Request ID: ${error.$metadata.requestId}`);
    }

    console.error('\n🔍 Possíveis soluções:');
    console.error('1. Verifique se o Account ID está correto');
    console.error('2. Confirme se as credenciais R2 estão corretas');
    console.error('3. Verifique se o bucket existe');
    console.error('4. Verifique se as permissões do token R2 estão corretas');
    process.exit(1);
  }
}

testR2Connection(); 