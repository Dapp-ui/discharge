import { join } from 'path'
import chokidar from 'chokidar'
import fs from 'fs'

import { Store } from './storage'
import { encrypt, getFiles, uploadFile } from './estuary'

import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  nativeImage,
  Menu,
  dialog,
} from 'electron'

let window: BrowserWindow | null
let tray: Tray | null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const __dirname =
  process.env.NODE_ENV === 'production'
    ? process.resourcesPath
    : app.getAppPath()

if (!fs.existsSync(join(__dirname, 'files')))
  fs.mkdirSync(join(__dirname, 'files'))
if (!fs.existsSync(join(app.getPath('userData'), 'Temp')))
  fs.mkdirSync(join(app.getPath('userData'), 'Temp'))

const preferences = new Store({
  configName: 'preferences',
  defaults: {
    path: join(__dirname, 'files'),
    sync: 'auto',
  },
})

const watcher = chokidar.watch(preferences.get('path'), {
  ignored: /(^|[\/\\])\../,
  persistent: true,
})

function createTray() {
  const icon = join(__dirname, 'assets', 'logo.ico') // required.
  const trayicon = nativeImage.createFromPath(icon)
  tray = new Tray(trayicon.resize({ width: 16 }))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => {
        createWindow()
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit() // actually quit the app.
      },
    },
  ])
  tray.setContextMenu(contextMenu)
}

function createWindow() {
  if (!tray) createTray()

  window = new BrowserWindow({
    icon: join(__dirname, 'assets', 'logo.ico'),
    resizable: false,
    width: 400,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  window.setMenu(null)
  window.webContents.openDevTools()

  window.on('closed', () => {
    window = null
  })
}

async function registerListeners() {
  /* IPC Main Listeners */

  ipcMain.on('message', (_, message) => {
    console.log(message)
  })

  ipcMain.on('app:preferences:get', (event, _) => {
    event.returnValue = preferences.data
  })

  ipcMain.on('app:preferences:set:path', async (event, data) => {
    try {
      const response = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      })
      if (response.canceled) return
      watcher.unwatch(preferences.get('path'))
      preferences.set('path', response.filePaths[0])
      watcher.add(response.filePaths[0])
      event.reply('client:preferences:updated', preferences.data)
    } catch (error) {
      console.log(error)
    }
  })

  ipcMain.on('app:preferences:set:uid', async (event, uid) => {
    preferences.set('uid', uid)
    event.reply('client:preferences:updated', preferences.data)
  })

  ipcMain.on('app:preferences:set:key', async (event, key) => {
    preferences.set('key', key)
    event.reply('client:preferences:updated', preferences.data)
  })

  ipcMain.on('app:preferences:set:sync', async (event, sync) => {
    preferences.set('sync', sync)
    event.reply('client:preferences:updated', preferences.data)
  })

  ipcMain.on('app:files:get', async (event, _) => {
    const files = await getFiles(preferences.get('uid'))
    event.returnValue = files
  })

  /* Chokidar (Directory) Listeners */
  watcher.on('add', (path: string) => {
    if (preferences.get('sync') !== 'auto') return
    else {
      const out = encrypt(
        path,
        preferences.get('key'),
        join(app.getPath('userData'), 'Temp')
      )
      const dir = path.replace(preferences.get('path'), '')
      uploadFile(preferences.get('uid'), out, dir, event => {})
    }
  })
}

app
  .on('ready', createWindow)
  .whenReady()
  .then(registerListeners)
  .catch(e => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && window) window.hide()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
