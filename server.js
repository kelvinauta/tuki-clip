const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const clipboard = require('clipboardy');

const app = express();
const server = http.createServer(app);

// Ruta al archivo de configuración del servidor dentro de la carpeta 'conf'
const serverConfigPath = path.join(__dirname, 'conf', 'server.conf.json');

let serverConfig;
try {
    const configContent = fs.readFileSync(serverConfigPath, 'utf8');
    serverConfig = JSON.parse(configContent);
} catch (error) {
    console.error('Error al leer la configuración del servidor:', error);
    process.exit(1); // Sale del proceso si no puede leer la configuración.
}

const io = socketIo(server);
const clipboardFilePath = path.join(__dirname, 'conf', 'clipboard.json');
let clipboards = {};
app.get('/ping', (req, res) => {
   res.send('pong');
});

io.on('connection', (socket) => {
    console.log(`Nuevo dispositivo conectado: ${socket.id}`);

    socket.on('update-clipboard', (data) => {
        console.log(`Portapapeles actualizado por ${data.user}`);
        clipboards[data.user] = clipboards[data.user] || [];
        clipboards[data.user].push(data.clipboard);
        fs.writeFileSync(clipboardFilePath, JSON.stringify(clipboards, null, 2));
        socket.broadcast.emit('update', data.clipboard);
    });

    socket.on('disconnect', () => {
        console.log(`Dispositivo desconectado: ${socket.id}`);
    });
});

server.listen(serverConfig.port, serverConfig.ip, () => {
    console.log(`Servidor escuchando en ${serverConfig.ip}:${serverConfig.port}`);
});
