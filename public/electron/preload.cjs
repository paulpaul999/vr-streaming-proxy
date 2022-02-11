const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron_api', {
    provider_set_cookies: (provider_id) => ipcRenderer.send('provider:set-cookies', provider_id)
})