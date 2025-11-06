
import path from 'path';
// Fix: Import process to provide correct type definitions for process.cwd().
import process from 'process';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Use a single, consistent environment variable for the API key.
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // Fix: __dirname is not available in ES modules. Use process.cwd() instead.
          '@': path.resolve(process.cwd(), '.'),
        }
      }
    };
});
