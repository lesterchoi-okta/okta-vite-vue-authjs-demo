/* eslint-env node, mocha */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = __dirname;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'jsonforms': [
            '@jsonforms/vue',
            '@jsonforms/vue-vanilla',
            '@jsonforms/core'
          ],
          'authjs': [
            '@okta/okta-auth-js'
          ]
        },
      },
    },
  },
  server: {
    host: 'localhost',
    port: 8080,
    https: (() => {
      try {
        return {
          key: readFileSync(resolve(PROJECT_ROOT, '.https', 'localhost-key.pem')),
          cert: readFileSync(resolve(PROJECT_ROOT, '.https', 'localhost-cert.pem')),
        };
      } catch (err) {
        throw new Error('Generate certs to enable https by running scripts/gen-certs');
      }
    })(),
  },
})
