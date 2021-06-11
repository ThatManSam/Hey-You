const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var controllerSockets = [];
var hostController;

var gameSocket;
var game = '';

app.get('/game', (req, res) => {
    if (game == '/PongMultiplayer'){
        res.sendFile(__dirname + '/PongMultiplayer/pongMultiplayer.html');
    }
    else res.sendFile(__dirname + game + '/index.html');
});

app.get('/', (req, res) => {
        res.sendFile(__dirname + game + '/controller.html');
});

app.get('/Sounds', (req, res) => {
    res.sendFile(__dirname + game + '/Sounds');
});

app.get('/PongMultiplayer', (req, res) => {
    res.sendFile(__dirname + game + '/pongMultiplayer.html');
});

app.get('/controllerInput.js', (req, res) => {
    var file = game + '/controllerInput.js';
    res.sendFile(__dirname + file);
});

// app.get('/controller', (req, res) => {
//     res.sendFile(__dirname + game + '/controller.html');
// });

app.get('/selectGame', (req, res) => {
    res.sendFile(__dirname + '/hostController.html');
});

app.get('/joystickbase', (req, res) => {
    res.sendFile(__dirname + game + '/joystick-base.png');
});

app.get('/main.js', (req, res) => {
    console.log(__dirname + game + '/Scripts/main.js');
    res.sendFile(__dirname + game + '/Scripts/main.js');
});

app.get('/qr-code', (req, res) => {
    res.sendFile(__dirname + '/qr.png');
});

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
});

io.on('connection', (socket, host) => {
    // getting the type from the socket (game or controller)
    var socketType = socket.handshake.query.data;
    // Show the id of the new socket
    console.log(socket.id +' socket connected: ' + socketType + ' ' + controllerSockets.length);
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
        //if (hostController == null) hostController = socket.id;
        controllerSockets.push(socket.id);
        if (game == '') io.to(hostController).emit("select game");
        console.log("Triggering emit to controller with response");
        io.to(gameSocket).emit('controller connection', socket.id);
    }

    // if (host) {
    //     if (hostController != null){
    //         io.to(socket).emit('reconnect');
    //         console.log("There is already a host controller");
    //     }
    // }

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
            io.emit('reconnect');
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
                if (hostController == socket.id) {
                    if (controllerSockets.length > 0) {
                        hostController = controllerSockets[0];
                    }
                    else hostController = null;
                }
            }
            catch(e){
                console.log("ERROR: " + e);
                return;
            }
        }
        console.log(socketType + ' user disconnected');
    });

    // socket.on('selectGame', (selected, callback) => {
    //     console.log("New Game selected: " + selected);
    //     game = selected;
    //     io.to(gameSocket).emit('reload');
    //     callback();
    // });

    // socket.on('playerColour', (controller, colour) => {
    //     console.log("Emitting colour: " + colour + " to: " + controller);
    //     io.to(controller).emit('playerColour', colour);
    // });

    socket.onAny((event, ...args) => {
        switch (event) {
            case "playerColour":
                var controller = args[0];
                var colour = args[1];
                console.log("Emitting colour: " + colour + " to: " + controller);
                io.to(controller).emit('playerColour', colour);
                break;
            
            case "selectGame":
                var selected = args[0];
                var callback = args[1];
                console.log("New Game selected: " + selected);
                game = selected;
                io.to(gameSocket).emit('reload');
                callback();

            default:
                console.log("Remitted event: " + event);
                io.emit(event, socket.id);
                break;
        }
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});