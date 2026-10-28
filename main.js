const { app, BrowserWindow, Menu, session, shell } = require('electron');
const path = require('path');
app.setName('WI Builder');
app.whenReady().then(() => {
  /* the page is fully offline: refuse every network request, so no file content can leave the computer */
  session.defaultSession.webRequest.onBeforeRequest((d, cb) => cb({ cancel: /^(https?|wss?|ftp):/i.test(d.url) }));
  Menu.setApplicationMenu(null);
  const win = new BrowserWindow({
    width: 1200, height: 900, title: 'WI Builder', icon: path.join(__dirname, 'icon.png'), autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file:')) e.preventDefault(); });
  /* downloads show Windows' own "Save as" dialog (Electron's default) */
  win.loadFile(path.join(__dirname, 'index.html'));
});
app.on('window-all-closed', () => app.quit());
