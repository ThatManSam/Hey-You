//include("Scripts/player.js");

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var players = [];
var taggers = [];
var tagged = [];

function draw(){

    //Draw players
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
function playerAdd(newSocket){
    if (taggers.length == 0){
        taggers.push(new player(canvas.width/2,canvas.height/2,1,newSocket,taggers.length));
        
    } else {
        players.push(new player(0,canvas.height/2,0,newSocket,players.length));
    }

    // Any other logic for adding a player
}

function playerMove(){
    for(var i=0; i<players.length; i++) {
        //Canvas boundary colission
        // Is done in each player object
        //if (tagegrs[i].x - tagegrs[i].radius <= 0 || taggers[i].x + taggers[i].radius >= canvas.width) {
        //    taggers[i].dx = -taggers[i].dx;
        //}
//
        //if (tagegrs[i].y - tagegrs[i].radius <= 0 || taggers[i].y + taggers[i].radius >= canvas.height) {
        //    taggers[i].dy = -taggers[i].dy;
        //}

        players[i].move(ctx);
        for(var j=0; j<taggers.length; j++){
            //Tagger intersect colission
            var difx = players[i].x - taggers[j].x;
            var dify = players[i].y - taggers[j].y;
            var distance = Math.sqrt(difx * difx + dify * dify);

            if (distance < players[i].radius + taggers[j].radius){
                tagged.push(players[i])
            }
        }
    }
}

function taggerMove(){
    //Canvas boundary colission, with extra space for players to stay put in
    for(var i=0; i<taggers.length; i++) {
        // Is done in each player object
        //if (tagegrs[i].x - tagegrs[i].radius <= 15 || taggers[i].x + taggers[i].radius >= canvas.width - 15) {
        //    taggers[i].dx = -taggers[i].dx;
        //}
        //if (tagegrs[i].y - tagegrs[i].radius <= 0 || taggers[i].y + taggers[i].radius >= canvas.height) {
        //    taggers[i].dy = -taggers[i].dy;
        //}

        taggers[i].move(ctx);
    }
}

function updateTaggers(){
    // Add player to taggers and remove from players
    // Change player properties to equal a taggers. HANDLED IN OBJECT
    for (var i = 0; i < tagged.length; i++) {
        tagged[i].typeChange(1);
        
        arrayRemove(players, tagged[i]);
        taggers.push(tagged[i]);

    }
    tagged.length = 0;
}

function drawTeam(team){
    if (team.length != null){
        for (var i=0; i<team.length; i++){
            team[i].draw(ctx);
        }
    }    
}

function arrayRemove(arr, value) {     
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

function include(file) {
  
    var script  = document.createElement('script');
    script.src  = file;
    script.type = 'text/javascript';
    script.defer = true;
    
    document.getElementsByTagName('head').item(0).appendChild(script);
    
}

class player {
    socket = null;
    type = 0; // 0 - normal player, 1 - tagger, 2 - waiting for new round
    radius = 5;
    x;
    y;
    dx = 2;
    dy = 2;
    moveLeft;
    moveRight;
    moveUp;
    moveDown;
    colour; //turquoise //Red = (255,0,0)

    constructor(newX, newY, newType, newSocket, ){
        this.x = newX;
        this.y = newY;
        this.socket = newSocket;

        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);

        this.typeChange(newType);
    }

    position(){
        let position = [this.x - this.radius, this.x + this.radius, this.y - this.radius, this.y + this.radius]
        return position;
    }

    keyDownHandler(e){
        switch (e.key) {
            case "Right","ArrowRight":
                this.moveRight = true;
                break;
            case "Left","ArrowLeft":
                this.moveLeft = true;
                break;
            case "Up","ArrowUp":
                this.moveUp = true;
                break;
            case "Down","ArrowDown":
                this.moveDown = true;
                break;
        }
    }

    keyUpHandler(e){
        switch (e.key) {
            case "Right","ArrowRight":
                this.moveRight = false;
                break;
            case "Left","ArrowLeft":
                this.moveLeft = false;
                break;
            case "Up","ArrowUp":
                this.moveUp = false;
                break;
            case "Down","ArrowDown":
                this.moveDown = false;
                break;
        }
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.closePath();
    }

    move(ctx){
        if (this.moveLeft){
            this.x -= this.dx;
        }
        if (this.moveRight && this.x <= ctx.width - this.dx){
            this.x += this.dx;
        }
        if (this.moveUp && this.y >= 0 + this.dy){
            this.y -= this.dy;
        }
        if (this.moveDown && this.y <= ctx.height - this.dy){
            this.y += this.dy;
        }

    }

    typeChange(newType){
        // Set any and all type properties in here
        this.type = newType;

        switch (this.type) {
            case 0:
                this.colour = ("#40E0D0"); //turquoise 
                this.dx = 2;
                this.dy = 2;
                this.radius = 5;
                break;
        
            case 1:
                this.colour = ("#FF0000"); //Red
                this.dx = 3;
                this.dy = 3;
                this.radius = 5;
                break;

            default:
                break;
        }
    }
}

playerAdd(23912);
draw();