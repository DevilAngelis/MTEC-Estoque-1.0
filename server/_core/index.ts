import express from "express";
import path from "path";
import { createServer } from "http";
import net from "net";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { getSessionCookieOptions } from "./cookies";
import { COOKIE_NAME } from "../../shared/const.js";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Enable CORS for all routes - reflect the request origin to support credentials
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now(), message: "API MTec Estoque está operacional" });
  });

  // REST endpoints for auth (used by useAuth)
  app.get("/api/auth/me", async (req, res) => {
    try {
      const ctx = await createContext({ req, res } as any);
      res.json({ user: ctx.user });
    } catch {
      res.json({ user: null });
    }
  });
  app.post("/api/auth/logout", (req, res) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // Serve static web app (Expo export) when dist exists - must be after API routes
  const webBuildPath = path.join(__dirname, "..", "..", "dist");
  const fs = await import("fs");
  if (fs.existsSync(webBuildPath)) {
    app.use(express.static(webBuildPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(webBuildPath, "index.html"));
    });
  } else {
    // Root route - serve welcome page when no web build
    app.get("/", (_req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MTec Estoque</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #151718; color: #ECEDEE; }
          .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
          .header { background: #00FF00; color: #000; padding: 40px; border-radius: 8px; margin-bottom: 40px; text-align: center; }
          .header h1 { font-size: 2.5em; margin-bottom: 10px; }
          .header p { font-size: 1.1em; opacity: 0.9; }
          .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
          .feature { background: #1e2022; border: 1px solid #334155; padding: 20px; border-radius: 8px; }
          .feature h3 { color: #00FF00; margin-bottom: 10px; }
          .feature p { font-size: 0.9em; color: #9BA1A6; line-height: 1.6; }
          .button { display: inline-block; background: #00FF00; color: #000; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 20px; transition: all 0.3s; }
          .button:hover { background: #00DD00; transform: scale(1.05); }
          .info { background: #1e2022; border-left: 4px solid #00FF00; padding: 20px; border-radius: 4px; margin-top: 40px; }
          .info h3 { color: #00FF00; margin-bottom: 10px; }
          .info p { color: #9BA1A6; line-height: 1.8; }
          code { background: #151718; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; color: #00FF00; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏭 MTec Estoque</h1>
            <p>Sistema de Controle de Estoque Profissional</p>
          </div>

          <div class="features">
            <div class="feature">
              <h3>📊 Dashboard</h3>
              <p>Visualize em tempo real o status completo do seu estoque com métricas e alertas.</p>
            </div>
            <div class="feature">
              <h3>📦 Materiais</h3>
              <p>Gerencie categorias, cadastre novos produtos e controle quantidades.</p>
            </div>
            <div class="feature">
              <h3>🔄 Movimentações</h3>
              <p>Registre entradas e saídas com histórico completo e rastreabilidade.</p>
            </div>
            <div class="feature">
              <h3>📈 Relatórios</h3>
              <p>Gere relatórios em PDF, exporte em CSV e analise tendências.</p>
            </div>
            <div class="feature">
              <h3>💾 Sincronização</h3>
              <p>Dados persistentes e sincronizados entre web e mobile.</p>
            </div>
            <div class="feature">
              <h3>🔒 Segurança</h3>
              <p>Banco de dados PostgreSQL com backup automático.</p>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="/api/health" class="button">✓ Verificar Status da API</a>
          </div>

          <div class="info">
            <h3>🚀 Como Usar</h3>
            <p>
              O aplicativo está rodando com sucesso! A API está disponível em /api/trpc
            </p>
            <p style="margin-top: 15px;">
              <strong>Endpoints disponíveis:</strong><br>
              • GET /api/health - Status da API<br>
              • POST /api/trpc/materials.create - Criar material<br>
              • GET /api/trpc/materials.list - Listar materiais<br>
              • POST /api/trpc/movements.create - Registrar movimentação<br>
              • GET /api/trpc/movements.list - Listar movimentações<br>
            </p>
            <p style="margin-top: 15px;">
              <strong>Status:</strong> <span style="color: #00FF00;">✓ Operacional</span>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  });
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}

startServer().catch(console.error);
