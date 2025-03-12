const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Detectar si estamos en modo portable
const isPortable = process.argv.includes('--portable');
let dataPath = isPortable 
  ? path.join(path.dirname(app.getPath('exe')), 'data')
  : path.join(app.getPath('userData'), 'data');

// Asegurar que el directorio de datos existe
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

// Gestión de almacenamiento persistente
ipcMain.handle('saveData', async (event, key, data) => {
  try {
    const filePath = path.join(dataPath, `${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
});

ipcMain.handle('getData', async (event, key, defaultValue) => {
  try {
    const filePath = path.join(dataPath, `${key}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return defaultValue;
  } catch (error) {
    console.error('Error reading data:', error);
    return defaultValue;
  }
});