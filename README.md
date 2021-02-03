# Passafe

Password Management application with Electron Js.
Safe your passwords encrypted with Passafe.


To run beta [releases](https://github.com/ianmora97/passafe/releases) you should have Node js and NPM to start the app:

```sh
npm install
npm start
```


## Electron Packager

Compile the app you should use [Electron Packager](https://github.com/electron/electron-packager)

Installing **Electron Packager:**
Run these commands in the terminal from the app folder:

```sh
    # for use in npm scripts
    npm install electron-packager --save-dev

    # for use from cli
    npm install electron-packager -g
```
---

Once installed, we're going to package for each OS.

### For MacOS:

- From a script:

```sh
    npm packageOSX
```

- From Electron CLI

```sh
    electron-packager . --overwrite --platform=darwin --arch=x64 --icon=images/icon.icns --prune=true --out=release-builds
```

### For Windows:

- From a script:

```sh
    npm packageWIN
```

- From Electron CLI

```sh
    electron-packager . Passafe --overwrite --platform=win32 --arch=ia32 --icon=images/icon.ico --prune=true --out=release-builds
```

### For Linux:

- From a script:

```sh
    npm packageLINUX
```

- From Electron CLI

```sh
    electron-packager . Passafe --overwrite --platform=linux --arch=x64 --icon=images/icon.png --prune=true --out=release-builds
```