const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var controllerSockets = [];

var gameSocket;
var game = '';

app.get('/home', (req, res) => {
    game = '';
    res.sendFile(__dirname + '/index.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + game + '/index.html');
});

app.get('/pongMultiplayer', (req, res) => {
    res.sendFile(__dirname + game + '/pongMultiplayer.html');
});

app.get('/controllerInput.js', (req, res) => {
    var file = game + '/controllerInput.js';
    res.sendFile(__dirname + file);
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + game + '/controlGame.html');
});

app.get('/controller', (req, res) => {
    res.sendFile(__dirname + game + '/controller.html');
});

app.get('/main.js', (req, res) => {
    console.log(__dirname + game + '/Scripts/main.js');
    res.sendFile(__dirname + game + '/Scripts/main.js');
});

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
        console.log("Triggering emit to controller with response");
        io.to(gameSocket).emit('controller connection', socket.id);
    }

    socket.on('connection callback', (response) =>{
        if (response.orientation !== null) {
            console.log("Emiting Orientation: " + response.orientation);
            io.to(response.socket).emit('orientation', response.orientation);
        }
    })

    socket.on('disconnect', () => {
        // if the game disconnects, release the gameSocket variable
        if (gameSocket != null && socket.id == gameSocket){
            console.log("Reset game socket");
            gameSocket = null;
            game = '';
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

    socket.on('selectGame', (selected, callback) => {
        console.log("New Game selected: " + selected);
        game = selected;
        callback();
    });

    socket.on('playerColour', (controller, colour) => {
        io.to(controller).emit('playerColour', colour);
    });

    socket.onAny((event) => {
        io.emit(event, socket.id);
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});