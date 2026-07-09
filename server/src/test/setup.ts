// Garante NODE_ENV=test e uma DATABASE_URL de teste antes do env.ts carregar.
// Definido aqui (setupFile roda antes dos módulos) para não depender de .env.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgresql://brevly:brevly@localhost:5432/brevly';

// R2 dummy — o upload real é sempre mockado nos testes; só precisa passar a validação de config.
process.env.CLOUDFLARE_ACCOUNT_ID ??= 'test-account';
process.env.CLOUDFLARE_ACCESS_KEY_ID ??= 'test-key';
process.env.CLOUDFLARE_SECRET_ACCESS_KEY ??= 'test-secret';
process.env.CLOUDFLARE_BUCKET ??= 'test-bucket';
process.env.CLOUDFLARE_PUBLIC_URL ??= 'https://cdn.test';
