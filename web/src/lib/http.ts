/**
 * Stub do cliente HTTP do frontend (ponto de extensão de W4-T6).
 *
 * A implementação real derivará a `baseURL` de `import.meta.env.VITE_BACKEND_URL`
 * e centralizará toda a I/O de rede (constitution Art.1 R2). Nesta onda não há
 * chamadas reais — apenas o contrato de leitura da env fica registrado.
 */
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const http = {};
