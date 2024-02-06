
# Tuki Clip - README

## Descripción

Tuki Clip es un software diseñado para permitir la comunicación y compartición del portapapeles entre dispositivos dentro de una red local de Wi-Fi. Este software es compatible con varios sistemas operativos, incluyendo Windows, Mac, Linux y Android. Su funcionamiento se basa en tres archivos principales:

1. `server.js`: Este archivo representa el servidor central de Tuki Clip. Su tarea principal es escuchar y emitir el contenido del portapapeles en tiempo real desde todos los dispositivos conectados al servidor. El servidor actúa como el intermediario que facilita la comunicación entre los clientes.

2. `client.js`: El archivo `client.js` es el componente que se ejecuta en cada dispositivo que desea participar en la comunicación. Cada cliente se conecta al servidor central y es capaz de enviar y recibir el contenido del portapapeles. De esta manera, todos los dispositivos conectados pueden compartir el mismo portapapeles de manera eficiente.

3. `index.js`: Este archivo es el iniciador del código. Al ejecutarse, le permite al usuario elegir si desea ser un servidor o un cliente, así como la configuración de otras funciones relacionadas. Esta interfaz de usuario facilita la configuración y la gestión de la comunicación entre dispositivos.

Además de estos archivos principales, existe una carpeta llamada `conf` que se utiliza para almacenar todas las configuraciones necesarias, así como un historial de los datos del portapapeles compartidos. Esta estructura de archivos garantiza que Tuki Clip sea una solución flexible y versátil para la compartición de datos dentro de una red local de Wi-Fi.

## Configuración

Antes de utilizar Tuki Clip, asegúrese de realizar la siguiente configuración:

1. Instale Node.js: Asegúrese de tener Node.js instalado en su dispositivo para ejecutar el código.

2. Descargue los archivos: Descargue los archivos principales (`server.js`, `client.js` y `index.js`) en los dispositivos que desee utilizar.

3. Configuración inicial: Al ejecutar `index.js`, se le pedirá que seleccione si desea ser un servidor o un cliente. También deberá especificar la dirección de conexión para unirse a la red local de Tuki Clip.

4. Uso: Una vez configurado, los dispositivos pueden comenzar a compartir el portapapeles. Todo el texto o contenido copiado en el portapapeles se compartirá automáticamente con otros dispositivos conectados en tiempo real.

## Notas adicionales

- Tuki Clip es una solución diseñada para redes locales de Wi-Fi y no requiere una conexión a Internet para funcionar.

- La carpeta `conf` almacena configuraciones y un historial de los datos compartidos, lo que permite un control y seguimiento de la información compartida.

- Asegúrese de mantener actualizado Tuki Clip y de utilizarlo de manera responsable y legal, respetando la privacidad y los derechos de otros usuarios de la red local.

Tuki Clip es una herramienta útil para la colaboración y el intercambio de información en una red local, y su sencilla configuración lo convierte en una opción conveniente para aquellos que desean compartir contenido entre dispositivos de manera eficiente.