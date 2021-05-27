class player {
    socket = null;
    type = 0; // 0 - normal player, 1 - tagger, 2 - waiting for new round
    radius = 5;
    x;
    y;
    dx = 2;
    dy = 2;
    moveLeft = false;
    moveRight = false;
    moveUp = false;
    moveDown = false;
    colour = color(64,224,208); //turquoise //Red = (255,0,0)

    constructor(newX, newY, newType, newSocket, ){
        x = newX;
        y = newY;
        this.typeChange(newType);
        socket = newSocket;

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);

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

    tagged(){
        this.colour = color(255,0,0);
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.closePath();
    }

    move(ctx){
        if (this.moveLeft && x >= 0 + this.dx){
            this.x -= this.dx;
        }
        if (this.moveRight && x <= ctx.width - this.dx){
            this.x += this.dx;
        }
        if (this.moveUp && y >= 0 + this.dy){
            this.y -= this.dy;
        }
        if (this.moveDown && y <= ctx.height - this.dy){
            this.y += this.dy;
        }

    }

    typeChange(newType){
        // Set any and all type properties in here
        this.type = newType;

        switch (this.type) {
            case 0:
                this.color = color(64,224,208); //turquoise 
                this.dx = 2;
                this.dx = 2;
                this.radius = 5;
                break;
        
            case 1:
                this.color = color(255,0,0); //Red
                this.dx = 3;
                this.dx = 3;
                this.radius = 5;
                break;

            default:
                break;
        }
    }
}