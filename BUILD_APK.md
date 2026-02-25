# Gerar APK - MTec Estoque

Para gerar o APK do app Android (a partir da mesma interface web do Electron):

## Pré-requisitos

- **Node.js** (LTS) instalado
- **Java JDK 17** (OpenJDK) instalado e variável `JAVA_HOME` apontando para ele
- **Android SDK** (Android Studio ou command-line tools) instalado e `ANDROID_HOME` configurado

## Passo a passo

### 1. Instalar dependências do projeto

```bash
npm install
```

### 2. Instalar Capacitor (se ainda não tiver)

```bash
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
```

### 3. Preparar a pasta web para o Android

A pasta `www` deve conter o app web. Se você usa o arquivo `MTec_Estoque_Supabase.html` como tela única:

- Copie `MTec_Estoque_Supabase.html` para `www/index.html`:

```bash
# PowerShell
Copy-Item "MTec_Estoque_Supabase.html" -Destination "www\index.html" -Force
```

Ou crie a pasta e o arquivo manualmente.

### 4. Inicializar Capacitor (só na primeira vez)

O arquivo `capacitor.config.json` já está na raiz. Se precisar reinicializar:

```bash
npx cap init "MTec Estoque" "com.mtec.estoque" --web-dir www
```

### 5. Adicionar a plataforma Android (só na primeira vez)

```bash
npm run cap:add:android
```

ou:

```bash
npx cap add android
```

### 6. Sincronizar o conteúdo web com o projeto Android

```bash
npx cap sync android
```

### 7. Gerar o APK

**Opção A – Pela linha de comando (APK de debug):**

```bash
cd android
.\gradlew assembleDebug
cd ..
```

O APK estará em: `android\app\build\outputs\apk\debug\app-debug.apk`

**No Windows (PowerShell), a partir da raiz do projeto:**

```powershell
npm run build:web
npm run cap:sync
cd android
.\gradlew.bat assembleDebug
cd ..
```

**Opção B – Abrir no Android Studio e gerar (debug ou release):**

```bash
npx cap open android
```

No Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.  
Para APK assinado (release): **Build → Generate Signed Bundle / APK**.

---

## Scripts no package.json (opcional)

Você pode adicionar ao `package.json`:

```json
"scripts": {
  "build:web": "node -e \"require('fs').mkdirSync('www',{recursive:true}); require('fs').copyFileSync('MTec_Estoque_Supabase.html','www/index.html')\"",
  "cap:sync": "npx cap sync android",
  "apk:debug": "npm run build:web && npm run cap:sync && cd android && ./gradlew assembleDebug && cd .."
}
```

Depois, para gerar o APK de debug:

```bash
npm run apk:debug
```

---

## Resumo rápido

1. `npm install` e instalar Capacitor
2. Copiar `MTec_Estoque_Supabase.html` → `www/index.html`
3. `npx cap add android` (uma vez)
4. `npx cap sync android`
5. `cd android && .\gradlew assembleDebug` → APK em `android\app\build\outputs\apk\debug\app-debug.apk`

Se algo falhar, confira `JAVA_HOME` e `ANDROID_HOME` e se o JDK 17 e o Android SDK estão instalados.
