import { defineConfig } from 'vitest/config';

const PORT = 3000;

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: PORT,
  },
  preview: {
    port: PORT,
  },
  test: {
    environment: 'jsdom',
  },
});
