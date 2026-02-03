import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';

/** Plugin que serve /geral/* como arquivos estáticos brutos, sem passar pelo PostCSS.
 * No Netlify os arquivos são servidos assim. Localmente o Vite processava o CSS com
 * PostCSS, que falha em algum trecho de geral.css (parser mais rigoroso que o do browser). */
function serveGeralRaw() {
  const handler = (req: any, res: any, next: () => void) => {
    if (!req.url?.startsWith('/geral/')) return next();
    const urlPath = req.url.split('?')[0];
    const filePath = path.join(process.cwd(), urlPath);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return next();
    const ext = path.extname(filePath);
    const types: Record<string, string> = {
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
      '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject', '.otf': 'font/otf',
    };
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  };
  return {
    name: 'serve-geral-raw',
    configureServer(server) {
      // Coloca nosso middleware no início para rodar ANTES do Vite processar o CSS
      (server.middlewares as any).stack.unshift({ route: '', handle: handler });
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [serveGeralRaw()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
