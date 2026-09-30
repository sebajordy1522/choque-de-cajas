const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, { maxHttpBufferSize: 5e7 });

app.use(express.static('public'));

io.on('connection', (socket) => {
    // 1. Asignar el socket a una sala privada con el PIN
    socket.on('joinRoom', (pin) => {
        socket.join(pin);
        socket.roomPin = pin; // Guarda el pin en la memoria de este dispositivo
        console.log(`Dispositivo unido a la sala: ${pin}`);
    });

    // 2. Redirigir acciones SOLO a los que tengan el mismo PIN
    socket.on('syncTablero', (data) => socket.to(socket.roomPin).emit('updateTablero', data));
    socket.on('abrirCaja', (data) => socket.to(socket.roomPin).emit('ejecutarAbrir', data));
    socket.on('configurarJuego', (data) => socket.to(socket.roomPin).emit('aplicarConfig', data));
    socket.on('reiniciar', () => socket.to(socket.roomPin).emit('ejecutarReiniciar'));
});

// Puerto dinámico preparado para Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Juego corriendo en el puerto ' + PORT));
