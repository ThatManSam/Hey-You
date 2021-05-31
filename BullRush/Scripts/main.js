//include("Scripts/player.js");

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

canvas.width = innerWidth - 30;
canvas.height = innerHeight - 30;

ctx.lineWidth = 2;
ctx.strokesStyle = "#FFFFFF";


var players = [];
var taggers = [];
var tagged = [];

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    for (var i = 0; i < taggers.length; i++) {
        if (e.key == "d") {
            taggers[i].moveRight = true;
        }
        else if (e.key == "a" || e.key == "ArrowLeft") {
            taggers[i].moveLeft = true;
        }
        else if (e.key == "w" || e.key == "ArrowUp") {
            taggers[i].moveUp = true;
        }
        else if (e.key == "s" || e.key == "ArrowDown") {
            taggers[i].moveDown = true;
        }
    }
    for (var i = 0; i < players.length; i++) {
        if (e.key == "ArrowRight") {
            players[i].moveRight = true;
        }
    }

}

function keyUpHandler(e) {
    for (var i = 0; i < taggers.length; i++) {
        if (e.key == "d") {
            taggers[i].moveRight = false;
        }
        else if (e.key == "a" || e.key == "ArrowLeft") {
            taggers[i].moveLeft = false;
        }
        else if (e.key == "w" || e.key == "ArrowUp") {
            taggers[i].moveUp = false;
        }
        else if (e.key == "s" || e.key == "ArrowDown") {
            taggers[i].moveDown = false;
        }
    }
    for (var i = 0; i < players.length; i++) {
        if (e.key == "ArrowRight") {
            players[i].moveRight = false;
        }
    }
}



function draw() {

    //Draw players
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Roud restart occurs here
    // if (players.length == 0) {
    //     ctx.fillStyle = "black";
    //     ctx.font = "100px Arial";
    //     ctx.fillText('GAME OVER - RELOADING', 40, canvas.height / 2);
    //     setTimeout(() => { document.location.reload(); }, 2000);
    //     // Will need to add logic for keeping sockets conected  
    // }
    drawTeam(players);
    drawTeam(taggers);

    //Move players if move enabled
    playerMove();
    taggerMove();

    //Update taggers
    updateTaggers();

    // Will need to implement a delay
    requestAnimationFrame(draw);
}

// Have to add the socket here
function playerAdd(newSocket) {
    if (taggers.length == 0) {
        console.log("Added tagger: " + newSocket);
        taggers.push(new player(canvas.width / 3 + random(0, 200), random(0, canvas.height), 1, newSocket, taggers.length));

    } else {
        console.log("Added player: " + newSocket);
        players.push(new player(0, random(0, canvas.height), 0, newSocket, players.length));
    }

    // Any other logic for adding a player
}

function playerMove() {
    for (var i = 0; i < players.length; i++) {
        players[i].move(canvas);
        for (var j = 0; j < taggers.length; j++) {
            //Tagger intersect colission
            var difx = players[i].x - taggers[j].x;
            var dify = players[i].y - taggers[j].y;
            var distance = Math.sqrt(difx * difx + dify * dify);

            if (distance < players[i].radius + taggers[j].radius) {
                tagged.push(players[i])
            }
        }
    }
}

function taggerMove() {
    for (var i = 0; i < taggers.length; i++) {
        taggers[i].move(canvas);
    }
}

function updateTaggers() {
    // Add player to taggers and remove from players
    // Change player properties to equal a taggers. HANDLED IN OBJECT
    for (var i = 0; i < tagged.length; i++) {
        tagged[i].typeChange(1);

        players = arrayRemove(players, tagged[i]);
        taggers.push(tagged[i]);

    }
    tagged.length = 0;
}

function drawTeam(team) {
    if (team.length != null) {
        for (var i = 0; i < team.length; i++) {
            team[i].draw(ctx);
        }
    }
}

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}

// Broken so just place the js file into this file
function include(file) {
    var script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;

    document.getElementsByTagName('head').item(0).appendChild(script);
}

function socketUpdate(num, e) {
    // Itterate through every player until the socket number matches
    if (!loopTeamSocketUpdate(num, e, players))
        loopTeamSocketUpdate(num, e, taggers);
}

function loopTeamSocketUpdate(num, e, team){
    for(var i = 0; i < team.length; i++){
        if (team[i].socketEventHandler(num,e))
            return true;
    }
    return false;
}

class player {
    socket = null;
    type = 0; // 0 - normal player, 1 - tagger, 2 - waiting for new round
    radius = 5;
    x = 0;
    y = 0;
    dx = 2;
    dy = 2;
    moveLeft = false;
    moveRight = false;
    moveUp = false;
    moveDown = false;
    colour = ("#40E0D0"); //turquoise //Red = (255,0,0)

    constructor(newX, newY, newType, newSocket,) {
        this.x = newX;
        this.y = newY;
        this.socket = newSocket;
        this.typeChange(newType);
    }

    socketEventHandler(num, e) {
        // Only allow updates for identical sockets?
        
        if (num == socket){
            switch (e) {
                case "upOn":
                    this.moveUp = true;
                    break;
    
                case "upOff":
                    this.moveup = false;
                    break;
    
                case "leftOn":
                    this.moveLeft = true;
                    break;
    
                case "leftOff":
                    this.moveLeft = false;
                    break;
    
                case "rightOn":
                    this.moveRight = true;
                    break;
    
                case "rightOff":
                    this.moveRight = false;
                    break;
    
                case "downOn":
                    this.moveDown = true;
                    break;
    
                case "downOff":
                    this.moveDown = false;
                    break;
                // Add more socket events here
            }
            return true;
        }        
        return false;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.closePath();
    }

    move(canvas) {
        if (this.moveLeft && this.x - this.dx > 0) {
            this.x -= this.dx;
        }
        if (this.moveRight && this.x < canvas.width - this.dx) {
            this.x += this.dx;
        }
        if (this.moveUp && this.y - this.dx > 0) {
            this.y -= this.dy;
        }
        if (this.moveDown && this.y <= canvas.height - this.dy) {
            this.y += this.dy;
        }

    }

    typeChange(newType) {
        // Set any and all type properties in here
        this.type = newType;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;

        switch (this.type) {
            case 0:
                this.colour = ("#40E0D0"); //turquoise 
                this.dx = random(1, 4);
                this.dy = random(1, 4);
                this.radius = random(4, 8);
                break;

            case 1:
                this.colour = ("#FF0000"); //Red
                this.dx = random(2, 5);
                this.dy = random(2, 5);
                this.radius = random(5, 10);
                break;

            default:
                break;
        }
    }
}
//for (var i = 0; i < 200; i++) {
//    playerAdd(i);
//}
draw();