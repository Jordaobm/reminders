# 🎗️ Lembretes

Página destinada ao aplicativo de lembretes que foi desenvolvido para me ajudar a lembrar de eventos importantes durante o mês.

Versões do aplicativo:

- <a href="docs\v0.0.1\README.md" target="_blank" rel="noopener noreferrer">v0.0.1</a>

# ⚙️ Instruções

Para rodar o aplicativo em modo de desenvolvimento, clone o repositório, instale as dependências e inicie o projeto. Segue a sequência de scripts

    git clone https://github.com/Jordaobm/reminders.git

    yarn

    yarn android

Para gerar um APK do aplicativo, entre pelo terminal Powershell na pasta android e em seguida execute o script responsável por gerar o apk. Segue a sequência de scripts.

    cd android

    ./gradlew assembleRelease

Em caso de falha no build, execute

    rm -rf android/app/build
    rm -rf android/build
    cd android
    ./gradlew clean
    cd ../
    yarn react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
    rm -rf android/app/src/main/res/drawable-*
    cd android
    ./gradlew assembleRelease

Lembre-se de documentar as versões 🧬
