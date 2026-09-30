const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, { maxHttpBufferSize: 5e7 });

app.use(express.static('public'));

// ESTA ES LA MAGIA PARA QUE CARGUE AUTOMÁTICAMENTE
app.get('/', (req, res) => res.redirect('/pantalla.html'));

io.on('connection', (socket) => {
    socket.on('joinRoom', (pin) => {
        socket.join(pin);
        socket.roomPin = pin; 
        console.log(`Dispositivo unido a la sala: ${pin}`);
    });

    socket.on('syncTablero', (data) => socket.to(socket.roomPin).emit('updateTablero', data));
    socket.on('abrirCaja', (data) => socket.to(socket.roomPin).emit('ejecutarAbrir', data));
    socket.on('configurarJuego', (data) => socket.to(socket.roomPin).emit('aplicarConfig', data));
    socket.on('reiniciar', () => socket.to(socket.roomPin).emit('ejecutarReiniciar'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Juego corriendo en el puerto ' + PORT));
