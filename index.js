const readline = require('readline');
const fs = require('fs');
const path = require('path');
const network = require('network');
const axios = require('axios'); // Asegúrate de instalar axios con `npm install axios`

const confDir = path.join(__dirname, 'conf');
if (!fs.existsSync(confDir)) {
  fs.mkdirSync(confDir);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function checkInternet(callback) {
  axios.get('https://httpbin.org/ip')
    .then(response => {
      if (response.status === 200 && response.data) {
        callback(true); // Hay conexión a Internet
      } else {
        callback(false); // No se pudo verificar la conexión a Internet
      }
    })
    .catch(() => callback(false));
}

function pingServer(serverIP, serverPort, callback) {
  axios.get(`http://${serverIP}:${serverPort}/ping`)
    .then(response => {
      if (response.data === 'pong') {
        callback(true); // El servidor responde correctamente
      } else {
        callback(false); // Respuesta inesperada del servidor
      }
    })
    .catch(() => callback(false));
}

function promptForIP(defaultIP, callback) {
  rl.question(`Detectada la dirección IP ${defaultIP}. Presione ENTER para usar esta o ingrese una nueva dirección IP: `, (inputIP) => {
    const ipToUse = inputIP.trim() || defaultIP;
    callback(ipToUse);
  });
}

rl.question('¿Desea iniciar como servidor o cliente? (servidor/cliente): ', (answer) => {
  if (answer.toLowerCase() === 'servidor') {
    network.get_active_interface((err, obj) => {
      if (err) {
        console.error('Error al obtener la dirección IP:', err);
        rl.close();
        return;
      }
      const localIP = obj.ip_address;

      checkInternet((hasInternet) => {
        if (!hasInternet) {
          console.log('No se detectó conexión a Internet. Asegúrese de estar conectado a una red.');
          rl.close();
          return;
        }

        promptForIP(localIP, (ipToUse) => {
          const config = { ip: ipToUse, port: 3000 };
          fs.writeFileSync(path.join(confDir, 'server.conf.json'), JSON.stringify(config, null, 2));
          console.log(`Configuración del servidor guardada en 'conf/server.conf.json' con IP ${ipToUse}`);
          require('./server');

          // Pregunta si también quiere ser cliente
          rl.question('¿Desea que este servidor actúe también como cliente? (sí/no): ', (clientAnswer) => {
            if (clientAnswer.toLowerCase() === 'sí' || clientAnswer.toLowerCase() === 'si') {
              rl.question('Ingrese su nombre de usuario: ', (username) => {
                const clientConfig = { serverIP: ipToUse, serverPort: 3000, username };
                fs.writeFileSync(path.join(confDir, 'client.conf.json'), JSON.stringify(clientConfig, null, 2));
                console.log('Configuración del cliente guardada en \'conf/client.conf.json\'');
                require('./client');
                rl.close();
              });
              
           
            }
            
          });
        });
      });
    });
  } else if (answer.toLowerCase() === 'cliente') {
    rl.question('Ingrese la IP del servidor: ', (serverIP) => {
      rl.question('Ingrese el puerto del servidor: ', (serverPort) => {
        pingServer(serverIP, serverPort, (isAvailable) => {
          if (!isAvailable) {
            console.log('No se pudo establecer conexión con el servidor. Asegúrese de que la dirección IP y el puerto sean correctos.');
            rl.close();
            return;
          }

          rl.question('Ingrese su nombre de usuario: ', (username) => {
            const config = { serverIP, serverPort, username };
            fs.writeFileSync(path.join(confDir, 'client.conf.json'), JSON.stringify(config, null, 2));
            console.log(`Configuración del cliente guardada en 'conf/client.conf.json'`);
            require('./client');
            rl.close();
          });
        });
      });
    });
  } else {
    console.log('Por favor, responda "servidor" o "cliente".');
    rl.close();
  }
});
