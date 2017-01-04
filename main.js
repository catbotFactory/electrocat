const electron = require('electron')
const app = electron.app
const path = require('path')
const BrowserWindow = electron.BrowserWindow

var mainWindow = null

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    height: 700,
    resizable: true,
    title: 'electroCat',
    width: 1295
  })
  mainWindow.webContents.openDevTools()

  mainWindow.loadURL(path.join('file://', __dirname, '/app/test.html'))
  mainWindow.on('closed', function () {
    mainWindow = null
  })
})
