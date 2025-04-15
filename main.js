const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Check if Vite dev server is running
  const checkViteServer = () => {
    return new Promise((resolve) => {
      const http = require('http');
      const req = http.get('http://localhost:5173', (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => {
        resolve(false);
      });
      req.end();
    });
  };

  // Try to load from Vite dev server first, fall back to file if not available
  checkViteServer().then(isViteRunning => {
    if (isViteRunning) {
      // If Vite is running, load from dev server
      mainWindow.loadURL('http://localhost:5173');
      mainWindow.webContents.openDevTools();
    } else {
      // If Vite is not running, load from the dist directory (created by vite build)
      mainWindow.loadFile('dist/index.html');
      
      // Open dev tools to help debug any issues
      mainWindow.webContents.openDevTools();
      
      // Log to console for debugging
      console.log('Loading from file system. If you see a blank screen, try running with npm run dev instead.');
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Handle IPC messages
ipcMain.handle('get-environments', async () => {
  return store.get('environments') || [];
});

ipcMain.handle('save-environment', async (event, environment) => {
  const environments = store.get('environments') || [];
  const existingIndex = environments.findIndex(env => env.id === environment.id);
  
  if (existingIndex >= 0) {
    environments[existingIndex] = environment;
  } else {
    environments.push(environment);
  }
  
  store.set('environments', environments);
  return environments;
});

ipcMain.handle('delete-environment', async (event, environmentId) => {
  const environments = store.get('environments') || [];
  const updatedEnvironments = environments.filter(env => env.id !== environmentId);
  store.set('environments', updatedEnvironments);
  return updatedEnvironments;
});
