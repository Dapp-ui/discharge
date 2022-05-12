const path = require('path')
const chokidar = require('chokidar')

import { Store } from './storage'
import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  nativeImage,
  Menu,
  dialog,
} from 'electron'

let mainWindow: BrowserWindow | null
let tray: Tray | null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const __dirname =
  process.env.NODE_ENV === 'production'
    ? process.resourcesPath
    : app.getAppPath()

const preferences = new Store({
  configName: 'preferences',
  defaults: {
    path: __dirname,
    sync: 'auto',
  },
})

const watcher = chokidar.watch(preferences.get('path'), {
  ignored: /(^|[\/\\])\../,
  persistent: true,
})

function createTray() {
  const icon = path.join(__dirname, 'assets', 'logo.ico') // required.
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

  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'assets', 'logo.png'),
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

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  mainWindow.setMenu(null)
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

async function registerListeners() {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    console.log(message)
  })

  ipcMain.on('app:preferences:get', (event, _) => {
    event.returnValue = preferences.data
  })

  ipcMain.on('app:preferences:set:path', async (event, data) => {
    const response = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
    if (response.canceled) return
    watcher.unwatch(preferences.get('path'))
    preferences.set('path', response.filePaths[0])
    watcher.watch(response.filePaths[0])
    event.reply('client:preferences:updated', preferences.data)
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
}

app
  .on('ready', createWindow)
  .whenReady()
  .then(registerListeners)
  .catch(e => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && mainWindow) mainWindow.hide()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
