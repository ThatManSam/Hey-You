const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/controlGame.html');
});

app.get('/controller', (req, res) => {
    res.sendFile(__dirname + '/controller.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('disconnect', (socket) => {
        console.log('user disconnected');
    });

    socket.on('left key down', () => {
        console.log("Left key down");
        io.emit('left down');
    });
    socket.on('left key up', () => {
        io.emit('left up');
    });
    socket.on('right key down', () => {
        io.emit('right down');
    });
    socket.on('right key up', () => {
        io.emit('right up');
    });
});

server.listen(3001, () => {
    console.log('listening on *:3000');
});