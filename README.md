# Passafe

Password Management application with Electron Js.
Safe your passwords encrypted with Passafe.


To run beta [releases](https://github.com/ianmora97/passafe/releases) you should have Node js and NPM to start the app:

```sh
# For node_modules/
$ npm install

# To start the app
$ npm start
```
# Node Scripts
## Database
* To interact with Database directly you will use ```npm run wpc -- <args>```:
```sh
# Wipe all database and recreate tables
$ npm run wpc -s -- w

# Wipe all database, recreate tables, insert some examples
$ npm run wpc -s -- ci
```
_This scripts will erase your database, **be careful**_

***
## Masterkey
* To interact with the masterkey you will use ```npm run mkc -- <args>```:
```sh
# Set Master Key to 12345
$ npm run mkc -s -- smk=12345
```
***
<br>

# Electron Packager

Compile the app you should use [Electron Packager](https://github.com/electron/electron-packager)

Installing **Electron Packager:**
Run these commands in the terminal from the app folder:

```sh
# for use in npm scripts
$ npm install electron-packager --save-dev

# for use from cli
$ npm install electron-packager -g
```
---

Once installed, we're going to package for each OS.

### For MacOS:

```sh
# From a script
$ npm run packageOSX

# From Electron CLI
$ electron-packager . --overwrite --platform=darwin --arch=x64 --icon=images/icon.icns --prune=true --out=release-builds
```

### For Windows:

```sh
# From a script
$ npm run packageWIN

# From Electron CLI
$ electron-packager . Passafe --overwrite --platform=win32 --arch=ia32 --icon=images/icon.ico --prune=true --out=release-builds
```

### For Linux:

```sh
# From a script
$ npm run packageLINUX

# From Electron CLI
$ electron-packager . Passafe --overwrite --platform=linux --arch=x64 --icon=images/icon.png --prune=true --out=release-builds
```

Made it by Ian Mora Rodriguez.
