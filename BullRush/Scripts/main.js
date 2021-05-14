include("Scripts/player.js");

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var players = [];
var playerCount = 0;
var taggers = [];
var taggerCount = 0;

document.addEventListener("");

function draw(){

    //Draw players

    //Move Players (Collision check)
    
    // Will need to implement a delay
    draw();
}

// Have to add the socket here
function playerAdd(newSocket){
    if (taggerCount == 0){
        taggers[taggerCount]  = player(0,canvas.height/2,1,newSocket,taggerCount++);
        
    } else {
        players[playerCount] = player(0,canvas.height/2,0,newSocket,playerCount++);
    }

    // Any other logic for adding a player

}

function playerMove(){
    // Check if move is possible i.e. doesn't collide with tagger


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