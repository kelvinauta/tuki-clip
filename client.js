const io = require('socket.io-client');
const clipboard = require('clipboardy');
const fs = require('fs');
const path = require('path');

// Ruta al archivo de configuración del cliente dentro de la carpeta 'conf'
const clientConfigPath = path.join(__dirname, 'conf', 'client.conf.json');

let config;
try {
    const configFile = fs.readFileSync(clientConfigPath, 'utf8');
    config = JSON.parse(configFile);
} catch (error) {
    console.error('Error al leer la configuración del cliente:', error);
    process.exit(1); // Sale del proceso si no puede leer la configuración.
}

const socket = io(`http://${config.serverIP}:${config.serverPort}`);

socket.on('connect', () => {
    console.log('Conectado al servidor de portapapeles');
});

socket.on('update', (newClipboardContent) => {
    console.log('Actualización de portapapeles recibida');
    try {
        if (typeof newClipboardContent === 'string') {
            clipboard.writeSync(newClipboardContent);
        } else {
            console.warn('El contenido recibido no es un texto.');
        }
    } catch (error) {
        console.error('Error al actualizar el portapapeles:', error);
    }
});

function monitorClipboard() {
    let lastContent = '';
    try {
        lastContent = clipboard.readSync();
    } catch (error) {
        console.error('Error al leer el portapapeles:', error);
    }

    setInterval(() => {
        try {
            const currentContent = clipboard.readSync();
            if (currentContent !== lastContent && typeof currentContent === 'string') {
                console.log('Portapapeles local actualizado, enviando al servidor...');
                socket.emit('update-clipboard', { user: config.username, clipboard: currentContent });
                lastContent = currentContent;
            }
        } catch (error) {
            console.error('Error al leer el portapapeles:', error);
        }
    }, 1000); // Revisa cada segundo.
}

monitorClipboard();
