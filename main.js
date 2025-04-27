const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const os = require('os');

// Configure electron-store to use a specific folder
const storeConfig = {
  cwd: path.join(os.homedir(), '.api_tester')
};

// Create separate stores for different data types
const envStore = new Store({
  ...storeConfig,
  name: 'environments'
});

const requestsStore = new Store({
  ...storeConfig,
  name: 'requests'
});

const historyStore = new Store({
  ...storeConfig,
  name: 'history'
});

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

// Handle IPC messages for environments
ipcMain.handle('get-environments', async () => {
  return envStore.get('items') || [];
});

ipcMain.handle('save-environment', async (event, environment) => {
  const environments = envStore.get('items') || [];
  const existingIndex = environments.findIndex(env => env.id === environment.id);
  
  if (existingIndex >= 0) {
    environments[existingIndex] = environment;
  } else {
    environments.push(environment);
  }
  
  envStore.set('items', environments);
  return environments;
});

ipcMain.handle('delete-environment', async (event, environmentId) => {
  const environments = envStore.get('items') || [];
  const updatedEnvironments = environments.filter(env => env.id !== environmentId);
  envStore.set('items', updatedEnvironments);
  return updatedEnvironments;
});

// Handle IPC messages for saved requests
ipcMain.handle('get-saved-requests', async () => {
  return requestsStore.get('items') || {};
});

ipcMain.handle('save-request', async (event, requestName, requestConfig) => {
  const savedRequests = requestsStore.get('items') || {};
  savedRequests[requestName] = requestConfig;
  requestsStore.set('items', savedRequests);
  return savedRequests;
});

ipcMain.handle('delete-saved-request', async (event, requestName) => {
  const savedRequests = requestsStore.get('items') || {};
  delete savedRequests[requestName];
  requestsStore.set('items', savedRequests);
  return savedRequests;
});

// Handle IPC messages for request history
ipcMain.handle('get-request-history', async () => {
  return historyStore.get('items') || [];
});

ipcMain.handle('add-to-history', async (event, historyItem) => {
  const history = historyStore.get('items') || [];
  
  // Add to beginning of array and limit size
  history.unshift(historyItem);
  
  // Limit history size to 50 items
  const limitedHistory = history.slice(0, 50);
  historyStore.set('items', limitedHistory);
  return limitedHistory;
});
