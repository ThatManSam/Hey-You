include("Scripts/player.js");

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var players = [];
var taggers = [];

function draw(){

    //Draw players

    playerMove();
    
    // Will need to implement a delay
    draw();
}

// Have to add the socket here
function playerAdd(newSocket){
    if (taggers.length == 0){
        taggers[taggers.length] = player(0,canvas.height/2,1,newSocket,taggers.length);
        
    } else {
        players[players.length] = player(0,canvas.height/2,0,newSocket,players.length);
    }

    // Any other logic for adding a player

}

function playerMove(){
    // Check if move is possible i.e. doesn't collide with tagger
    for(var i=0; i<players.length; i++) {
        players[i].move()
        for(var j=0; j<taggers.length; j++){
            var difx = players[i].x - taggers[j].x;
            var dify = players[i].y - taggers[j].y;
            var distance = Math.sqrt(difx * difx + dify * dify);

            if (distance < players[i].radius + taggers[j].radius){
                // Become tagger
            }
        }
    }

}

function taggerMove(){
    for(var i=0; i<taggers.length; i++) {

        if (tagegrs[i].x - tagegrs[i].radius < 15 ) {
            
        }

        taggers[i].move()

        // Boundary collision check
            
            
            

        
    }
}

function tagged(playerTug){

    playerTug.tagged
}

function include(file) {
  
    var script  = document.createElement('script');
    script.src  = file;
    script.type = 'text/javascript';
    script.defer = true;
    
    document.getElementsByTagName('head').item(0).appendChild(script);
    
  }