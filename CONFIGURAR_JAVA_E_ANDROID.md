# Como configurar Java JDK 17 e Android SDK no Windows

Siga os passos abaixo para poder gerar o APK do MTec Estoque.

---

## Parte 1: Instalar Java JDK 17 (OpenJDK)

### Opção A – Pelo site (recomendado)

1. Acesse: **https://adoptium.net/** (Eclipse Temurin – OpenJDK).
2. Clique em **"Download"**.
3. Escolha:
   - **Version:** 17 (LTS)
   - **Operating System:** Windows
   - **Architecture:** x64 (na maioria dos PCs)
4. Baixe o **.msi** (instalador).
5. Execute o instalador:
   - Marque **"Set JAVA_HOME variable"** e **"Add to PATH"** se aparecer.
   - Anote o caminho de instalação, por exemplo:  
     `C:\Program Files\Eclipse Adoptium\jdk-17.x.x.x-hotspot`

### Opção B – Pelo winget (Windows 11 / Windows 10 atualizado)

Abra o **PowerShell** ou **Terminal** como usuário normal e rode:

```powershell
winget install EclipseAdoptium.Temurin.17.JDK
```

Depois da instalação, anote onde o JDK foi instalado (geralmente em `C:\Program Files\Eclipse Adoptium\jdk-17.x.x.x-hotspot`).

---

## Parte 2: Configurar a variável JAVA_HOME

### Verificar se já existe

1. Pressione **Win + R**, digite `sysdm.cpl` e Enter.
2. Aba **Avançado** → **Variáveis de Ambiente**.
3. Em **Variáveis do sistema** (ou **Variáveis do usuário**), veja se existe **JAVA_HOME**.
4. Se existir e apontar para uma pasta de um JDK 17, pode pular para a Parte 3.

### Definir JAVA_HOME manualmente

1. Em **Variáveis do sistema** (ou do usuário), clique em **Novo**.
2. Nome da variável: `JAVA_HOME`
3. Valor: o caminho da pasta do JDK 17, **sem** `\bin`. Exemplos:
   - `C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot`
   - `C:\Program Files\Microsoft\jdk-17.0.13.11.7-hotspot`
4. Clique **OK** em todas as janelas.

### Incluir Java no PATH (se não estiver)

1. Na mesma tela de variáveis, selecione **Path** e clique em **Editar**.
2. **Novo** e adicione: `%JAVA_HOME%\bin`
3. **OK** em todas as janelas.

### Testar no terminal

Feche e abra de novo o **PowerShell** ou **CMD** e rode:

```powershell
java -version
```

Deve aparecer algo como: `openjdk version "17.x.x"`.  
Se aparecer, **JAVA_HOME** está correto para uso pelo Android build.

---

## Parte 3: Instalar Android SDK (via Android Studio – mais fácil)

### Baixar e instalar o Android Studio

1. Acesse: **https://developer.android.com/studio**
2. Baixe o **Android Studio** para Windows.
3. Execute o instalador e siga o assistente (pode deixar as opções padrão).
4. Na primeira abertura, o Android Studio vai pedir para baixar:
   - **Android SDK**
   - **Android SDK Platform** (ex.: API 34)
   - **Android SDK Build-Tools**
   - **Android SDK Command-line Tools** (útil)
5. Aceite e espere o download terminar.

### Descobrir a pasta do Android SDK

No Android Studio:

1. **File** → **Settings** (ou **Ctrl + Alt + S**).
2. **Languages & Frameworks** → **Android SDK**.
3. No topo está o **Android SDK Location**, por exemplo:  
   `C:\Users\SeuUsuario\AppData\Local\Android\Sdk`  
   Copie esse caminho.

No Windows, o caminho costuma ser:

- `C:\Users\<SEU_USUARIO>\AppData\Local\Android\Sdk`

Substitua `<SEU_USUARIO>` pelo seu nome de usuário do Windows.

---

## Parte 4: Configurar ANDROID_HOME

1. **Win + R** → `sysdm.cpl` → Enter.
2. Aba **Avançado** → **Variáveis de Ambiente**.
3. Em **Variáveis do sistema** (ou **Variáveis do usuário**), clique em **Novo**.
4. Nome: `ANDROID_HOME`
5. Valor: o caminho do **Android SDK** (o que você copiou), por exemplo:  
   `C:\Users\Almoxarifado\AppData\Local\Android\Sdk`
6. **OK**.

### Incluir ferramentas do Android no PATH

1. Selecione **Path** → **Editar** → **Novo** e adicione, **um por um** (ajuste se seu usuário for outro):

   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

2. **OK** em todas as janelas.

### Testar

Feche e abra o **PowerShell** e rode:

```powershell
echo $env:ANDROID_HOME
```

Deve mostrar o caminho do SDK.  
Depois:

```powershell
adb version
```

Se aparecer a versão do ADB, o PATH está certo.

---

## Resumo das variáveis

| Variável      | Exemplo de valor |
|---------------|-------------------|
| **JAVA_HOME** | `C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot` |
| **ANDROID_HOME** | `C:\Users\Almoxarifado\AppData\Local\Android\Sdk` |

No **Path** devem existir:

- `%JAVA_HOME%\bin`
- `%ANDROID_HOME%\platform-tools`
- `%ANDROID_HOME%\tools`
- `%ANDROID_HOME%\tools\bin`

---

## Depois de configurar

1. Feche **todos** os terminais e o Cursor/VS Code (para carregar as variáveis novas).
2. Abra de novo o terminal na pasta do projeto e rode:

```powershell
# Testar Java
java -version

# Testar Android
echo $env:ANDROID_HOME
adb version
```

3. Gerar o APK:

```powershell
.\GERAR_APK.bat
```

ou:

```powershell
npm run apk
```

---

## Problemas comuns

- **"java não é reconhecido"**  
  JAVA_HOME ou Path incorretos; confira o caminho do JDK e se `%JAVA_HOME%\bin` está no Path. Reinicie o terminal.

- **"ANDROID_HOME não definido"**  
  Variável não criada ou terminal aberto antes de salvar. Crie ANDROID_HOME, salve e abra um terminal novo.

- **"SDK location not found"**  
  ANDROID_HOME não está definido ou o caminho está errado. Use exatamente o caminho que o Android Studio mostra em **Android SDK Location**.

- **Build do Gradle falha**  
  Confirme que é JDK **17** (não 8 ou 11). O Android Gradle Plugin recente exige JDK 17.

Se quiser, posso te passar um script PowerShell que só verifica se JAVA_HOME e ANDROID_HOME estão configurados e imprimem os caminhos.
