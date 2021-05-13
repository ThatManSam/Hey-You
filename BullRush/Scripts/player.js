class player {
    socket = null;
    type = 0; // 0 - normal player, 1 - tagger, 2 - waiting for new round
    radius = 5;
    x;
    y;
    moveLeft = false;
    moveRight = false;
    moveUp = false;
    moveDown = false;

    constructor(newX, newY, newType = 0, newSocket){
        x = newX;
        y = newY;
        type = newType;
        socket = newSocket;

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);

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
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
}