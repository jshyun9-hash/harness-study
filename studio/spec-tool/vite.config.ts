import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

/** studio/spec/ 폴더에 MD 파일을 저장하는 dev 전용 플러그인 */
function saveSpecPlugin(): Plugin {
  const specDir = path.resolve(__dirname, '../spec');

  return {
    name: 'save-spec',
    configureServer(server) {
      server.middlewares.use('/__save-spec', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'POST only' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => (body += chunk.toString()));
        req.on('end', () => {
          try {
            const { fileName, content } = JSON.parse(body);
            if (!fileName || !content) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'fileName, content 필수' }));
              return;
            }

            // spec 폴더 없으면 생성
            if (!fs.existsSync(specDir)) {
              fs.mkdirSync(specDir, { recursive: true });
            }

            const filePath = path.join(specDir, fileName);
            fs.writeFileSync(filePath, content, 'utf-8');

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, path: filePath }));
          } catch (e) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: e instanceof Error ? e.message : 'Unknown error',
              }),
            );
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), saveSpecPlugin()],
  server: {
    port: 5174,
    fs: {
      allow: ['..', '.'],
    },
  },
});
