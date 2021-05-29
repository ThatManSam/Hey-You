const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var controllerSockets = [];

var gameSocket;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/controlGame.html');
});

app.get('/controller', (req, res) => {
    res.sendFile(__dirname + '/controller.html');
});

// When a new socket connection is created
io.on('connection', (socket) => {
    // getting the type from the socket (game or controller)
    var socketType = socket.handshake.query.data;
    // Show the id of the new socket
    console.log(socket.id +' socket connected: ' + socketType);
    // if the socket is a game save it to the gameSocket variable (if there isn't already a game)
    if (socketType == "game" && gameSocket != null) console.log("Game already exists");
    if (socketType == "game" && gameSocket == null) {
        gameSocket = socket.id;
        // adds all the already existing controllers to the new game
        controllerSockets.forEach(control =>{
            io.to(gameSocket).emit('controller connection', control);
        });
    }
    // if the socket is a controller send it to the game socket
    if (socketType == "controller"){
        controllerSockets.push(socket.id);
        io.to(gameSocket).emit('controller connection', socket.id);
    }
    

    socket.on('disconnect', () => {
        // if the game disconnects, release the gameSocket variable
        if (gameSocket != null && socket.id == gameSocket){
            console.log("Reset game socket");
            gameSocket = null;
        }

        // if a controller disconnects
        // check it is in our list of controllers
        if (controllerSockets.includes(socket.id)) {
            try{
                // remove it from the list of controllers
                var index = controllerSockets.indexOf(socket.id);
                controllerSockets.splice(index, 1);
                // tell game to remove the controller
                io.to(gameSocket).emit('controller disconnection', socket.id);
            }
            catch(e){
                console.log("ERROR: " + e);
                return;
            }
        }
        console.log(socketType + ' user disconnected');
    });

    // FOR ALL
    // emits the respective key up or down with the controller id
    socket.on('left key down', () => {
        io.emit('left down', socket.id);
    });
    socket.on('left key up', () => {
        io.emit('left up', socket.id);
    });
    socket.on('right key down', () => {
        io.emit('right down', socket.id);
    });
    socket.on('right key up', () => {
        io.emit('right up', socket.id);
    });
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});