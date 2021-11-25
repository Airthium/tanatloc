/** @module Electron */

import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

const isProd: boolean = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

/**
 * Start electron
 * @memberof Electron
 * @description Start the installation script, the server and the electron window
 */
const start = async (): Promise<void> => {
  console.info('Starting Tanatloc')
  await app.whenReady()

  // Install
  console.info('Install')
  require('../dist-install/install/index')

  // Server
  console.info('Starting server')
  require('../dist-server/server/bin/www')

  // Client
  console.info('Starting client')
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600
  })
  mainWindow.maximize()

  if (isProd) {
    await mainWindow.loadURL('app://./index.html')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/`)
    mainWindow.webContents.openDevTools()
  }
}
start()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('ping-pong', (event, arg) => {
  event.sender.send('ping-pong', `[ipcMain] "${arg}" received asynchronously.`)
})

ipcMain.on('ping-pong-sync', (event, arg) => {
  event.returnValue = `[ipcMain] "${arg}" received synchronously.`
})
