const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    //io.emit('chat message bold', 'User connected');
    //console.log('a user connected');
    socket.on('nickname', (nickname) =>{
        io.emit('chat message bold', nickname + " connected");
        console.log(nickname + " connected");
    });
    
    socket.on('disconnect', (client) => {
        client.emit('nickname')
        io.emit('chat message bold', 'User disconnected');
        console.log('user disconnected');
    });

    socket.on('chat message', (user, msg) => {
        console.log(user + ': ' + msg);
    });

    socket.on('chat message', (user, msg) => {
        socket.broadcast.emit('chat message', user, msg);
    });
});

/*io.on('connection', (socket) => {
    socket.on('chat message', (user, msg) => {
        console.log(user + ': ' + msg);
    });
    socket.on('chat message', (user, msg) => {
        socket.broadcast.emit('chat message', user, msg);
        //io.emit('chat message', user, msg);
    });
});

/*io.on('connection', (socket) => {
    socket.on('chat message', (user, msg) => {
        socket.broadcast.emit('chat message', user, msg);
        //io.emit('chat message', user, msg);
    });
});*/

server.listen(3000, () => {
    console.log('listening on *:3000');
});