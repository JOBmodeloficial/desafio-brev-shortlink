// Garante NODE_ENV=test e uma DATABASE_URL de teste antes do env.ts carregar.
// Definido aqui (setupFile roda antes dos módulos) para não depender de .env.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgresql://brevly:brevly@localhost:5432/brevly';
