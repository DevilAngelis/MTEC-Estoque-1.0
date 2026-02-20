const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let serverProcess;
let serverPort = 3000;

// Função para encontrar porta disponível
function findAvailablePort(startPort = 3000) {
  return new Promise((resolve) => {
    const server = require('net').createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Função para iniciar o servidor Express
async function startServer() {
  const port = await findAvailablePort(serverPort);
  serverPort = port;

  // Verificar se dist/index.js existe
  const serverPath = path.join(__dirname, '..', 'dist', 'index.js');
  const fs = require('fs');
  
  if (!fs.existsSync(serverPath)) {
    throw new Error('Servidor não compilado! Execute: pnpm build');
  }
  
  // Definir variáveis de ambiente
  process.env.PORT = port.toString();
  process.env.NODE_ENV = 'production';

  // Iniciar servidor em processo separado
  serverProcess = spawn('node', [serverPath], {
    env: { ...process.env, PORT: port.toString(), NODE_ENV: 'production' },
    cwd: path.join(__dirname, '..'),
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let serverOutput = '';
  let serverError = '';

  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    serverOutput += output;
    console.log(`[Server] ${output.trim()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    const error = data.toString();
    serverError += error;
    console.error(`[Server Error] ${error.trim()}`);
  });

  serverProcess.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[Server] Processo encerrado com código ${code}`);
      console.error(`[Server] Erros: ${serverError}`);
    }
  });

  // Aguardar servidor iniciar (máximo 30 segundos)
  await new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 60; // 30 segundos (500ms * 60)
    
    const checkServer = setInterval(() => {
      attempts++;
      const req = http.get(`http://localhost:${port}/api/health`, { timeout: 1000 }, (res) => {
        if (res.statusCode === 200) {
          clearInterval(checkServer);
          resolve();
        }
      });
      req.on('error', () => {
        if (attempts >= maxAttempts) {
          clearInterval(checkServer);
          reject(new Error(`Servidor não iniciou. Últimos erros:\n${serverError}`));
        }
      });
      req.on('timeout', () => {
        req.destroy();
      });
    }, 500);
  });

  return port;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, '..', 'assets', 'images', 'icon.png'),
    titleBarStyle: 'default',
    show: false,
  });

  // Aguardar servidor iniciar e então carregar a aplicação
  startServer().then((port) => {
    const url = `http://localhost:${port}`;
    console.log(`[Electron] Carregando aplicação em ${url}`);
    mainWindow.loadURL(url);
    mainWindow.show();

    // Abrir DevTools em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }
  }).catch((error) => {
    console.error('[Electron] Erro ao iniciar servidor:', error);
    
    // Mostrar diálogo de erro ao usuário
    const { dialog } = require('electron');
    dialog.showErrorBox(
      'Erro ao Iniciar Aplicativo',
      `Não foi possível iniciar o servidor.\n\n${error.message}\n\nCertifique-se de que:\n1. Executeu: pnpm install\n2. Executeu: pnpm build\n3. O banco de dados está configurado`
    );
    
    app.quit();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Criar menu
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Sair',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Visualizar',
      submenu: [
        {
          label: 'Recarregar',
          accelerator: 'Ctrl+R',
          click: () => {
            if (mainWindow) mainWindow.reload();
          },
        },
        {
          label: 'Ferramentas de Desenvolvedor',
          accelerator: 'F12',
          click: () => {
            if (mainWindow) mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre',
          click: () => {
            require('electron').dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Sobre',
              message: 'MTec Estoque',
              detail: 'Sistema de Controle de Estoque\nVersão 1.0.0',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
