var socketType = 'game';
var url = window.location.href;
var socket = io.connect(url + "?data=" + socketType);
var socket = io();
var controllers = [];

// When a controller connects
socket.on('controller connection', (controller) => {
    // Add it to the list of controllers
    controllers.push(controller);
    // create a new display for it
    newController(controller);
});

// When a controller disconnects
socket.on('controller disconnection', (controller) => {
    try{
        // remove it from the list of controllers
        var index = controllers.indexOf(controller);
        controllers.splice(index, 1);
        // remove its display
        removeController(controller);
    }
    catch(e){
        console.log("ERROR: " + e);
        return;
    }
});

// FOR ALL
// changes the color of the left or right arrow of the display of that controllers section
socket.on('leftOn', (id) => {
    document.getElementById(id).getElementsByClassName("left")[0].style.backgroundColor = "burlywood";
    leftPressed = true;
    //document.dispatchEvent(leftarrowdown);
});
socket.on('leftOff', (id) => {
    document.getElementById(id).getElementsByClassName("left")[0].style.backgroundColor = "cadetblue";
    leftPressed = false;
    //document.dispatchEvent(leftarrowup);
});
socket.on('rightOn', (id) => {
    document.getElementById(id).getElementsByClassName("right")[0].style.backgroundColor = "burlywood";
    rightPressed = true;
    //document.dispatchEvent(rightarrowdown);
});
socket.on('rightOff', (id) => {
    document.getElementById(id).getElementsByClassName("right")[0].style.backgroundColor = "cadetblue";
    rightPressed = false;
    //document.dispatchEvent(rightarrowup);
});