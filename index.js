const readline = require('readline');
const fs = require('fs');
const path = require('path');
const network = require('network');

const confDir = path.join(__dirname, 'conf');
if (!fs.existsSync(confDir)) {
    fs.mkdirSync(confDir);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function checkConfigFile(file, callback) {
    const filePath = path.join(confDir, file);
    if (fs.existsSync(filePath)) {
        rl.question(`El archivo ${file} ya existe en la carpeta 'conf'. ¿Desea utilizar la configuración existente? (sí/no): `, (useExisting) => {
            if (useExisting.toLowerCase() === 'sí' || useExisting.toLowerCase() === 'si') {
                callback(true);
            } else {
                callback(false);
            }
        });
    } else {
        callback(false);
    }
}

function createServerConfig(callback) {
    network.get_active_interface((err, obj) => {
        if (err) {
            console.error('Error al obtener la dirección IP:', err);
            return callback(err);
        }
        const localIP = obj.ip_address;
        const config = { ip: localIP, port: 3000 };
        fs.writeFileSync(path.join(confDir, 'server.conf.json'), JSON.stringify(config, null, 2));
        console.log(`Configuración del servidor guardada en 'conf/server.conf.json' con IP ${localIP}`);
        callback(null);
    });
}

function createClientConfig(callback) {
    rl.question('Ingrese la IP del servidor: ', (serverIP) => {
        rl.question('Ingrese el puerto del servidor: ', (serverPort) => {
            rl.question('Ingrese su nombre de usuario: ', (username) => {
                const config = { serverIP, serverPort, username };
                fs.writeFileSync(path.join(confDir, 'client.conf.json'), JSON.stringify(config, null, 2));
                console.log(`Configuración del cliente guardada en 'conf/client.conf.json'`);
                callback(null);
            });
        });
    });
}

rl.question('¿Desea iniciar como servidor o cliente? (servidor/cliente): ', (answer) => {
    if (answer === 'servidor') {
        checkConfigFile('./conf/server.conf.json', (useExisting) => {
            if (!useExisting) {
                createServerConfig((err) => {
                    if (err) {
                        console.error('Error al crear la configuración del servidor.');
                        rl.close();
                        return;
                    }
                    require('./server');
                    // Pregunta si también quiere actuar como cliente
                    rl.question('¿Desea que este servidor actúe también como cliente? (sí/no): ', (clientResponse) => {
                        if (clientResponse.toLowerCase() === 'sí' || clientResponse.toLowerCase() === 'si') {
                            checkConfigFile('client.conf.json', (useExisting) => {
                                if (!useExisting) {
                                    createClientConfig((err) => {
                                        if (err) {
                                            console.error('Error al crear la configuración del cliente.');
                                            rl.close();
                                            return;
                                        }
                                        require('./client');
                                        rl.close();
                                    });
                                } else {
                                    require('./client');
                                    rl.close();
                                }
                            });
                        } else {
                            rl.close();
                        }
                    });
                });
            } else {
                require('./server');
                rl.close();
            }
        });
    } else if (answer === 'cliente') {
        checkConfigFile('client.conf.json', (useExisting) => {
            if (!useExisting) {
                createClientConfig((err) => {
                    if (err) {
                        console.error('Error al crear la configuración del cliente.');
                        rl.close();
                        return;
                    }
                    require('./client');
                    rl.close();
                });
            } else {
                require('./client');
                rl.close();
            }
        });
    } else {
        console.log('Por favor, responda "servidor" o "cliente".');
        rl.close();
    }
});
