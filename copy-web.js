/**
 * Copia o HTML principal para www/index.html para o build Android (Capacitor).
 * Execute: node copy-web.js
 */
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'MTec_Estoque_Supabase.html');
const destDir = path.join(__dirname, 'www');
const dest = path.join(destDir, 'index.html');

if (!fs.existsSync(src)) {
  console.error('Arquivo não encontrado: MTec_Estoque_Supabase.html');
  console.error('Coloque o arquivo HTML do app na raiz do projeto e execute novamente.');
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('OK: www/index.html criado a partir de MTec_Estoque_Supabase.html');
