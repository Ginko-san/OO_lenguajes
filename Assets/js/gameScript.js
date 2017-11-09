// Namespace Global

var APPLICATION = APPLICATION || {}; // check if the NameSpace exist as var or function.


// Variable Declariations


// Defining Objects
// 27 * 22
function Level(w, pO, c, r, s) {
    this.walls = w;
    this.primaryObjects = pO;
    this.objectsArrayFill = [];
    this.columns = c;
    this.rows = r;
    this.spriteSize = s;

}

// Fill the array with empty values
//  0 = empty
Level.prototype.initObjectArray = function () {
    var cont = 0;
    for (var i=0; i<this.columns; i++) {
        for (var j=0; j<this.rows; j++) {
            this.objectsArrayFill[cont] = { type: 0, dx: i, dy: j };
            cont++;
        }
    }
};

// Fill the array with walls
//  0 = empty
//  1 = primaryObject
//  2 = wall
Level.prototype.placeObjects = function ( typeObject) {
    var nObjects = (typeObject === 1) ? this.primaryObjects : this.walls;

    for (var i=0; i < nObjects; i++) {
        while (true) {
            var x = Math.floor((Math.random() * (this.columns-2)) +1);
            var y = Math.floor((Math.random() * (this.rows-2)) +1);

            var place = (y * this.columns) + x;

            console.log("Place: " + place + ", dx: " + x + ", dy: " + y + ";");
            if (this.objectsArrayFill[place].type === 0) {
                this.objectsArrayFill[place].type = (typeObject === 1) ? 1 : 2;
                this.objectsArrayFill[place].dx = x;
                this.objectsArrayFill[place].dy = y;
                break;
            }
        }
    }
};





function playerTank() {
    this.image = new Image();
    this.image.src = '../images/tank_player.png';
    this.image.onload = function(){
        context.drawImage(base_image, 100, 100);
    };
    
    this.size = 32;

}


var canvas = document.getElementById("canvasTankGame");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-120;

var dx = -2;
var dy = -2;

var ballRadius = 12;
var ballColor = getRandomColor();
var wallSize = 32;


//paddle vars
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

// Bottoms
var rightPressed = false;
var leftPressed = false;

var wallImage = document.getElementById('wall');
var pOImage = document.getElementById('primaryObject');


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode === 39) {
        rightPressed = true;
    }
    else if(e.keyCode === 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode === 39) {
        rightPressed = false;
    }
    else if(e.keyCode === 37) {
        leftPressed = false;
    }
}

function draw(level) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // This line clear the canvas every 10 miliseconds

    drawObjects(level);
    drawBall(ballColor);
    drawPaddle();

    if (x + dx < wallSize+ballRadius || x + dx > canvas.width-(wallSize+ballRadius)) {
        dx = -dx;
        ballColor = getRandomColor();
    }

    if (y + dy < wallSize+ballRadius) {
        dy = -dy;
        ballColor = getRandomColor();
    } else if (y + dy > canvas.height-(wallSize+ballRadius)) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            alert("Game Over");
            document.location.reload();
        }
    }

    if(rightPressed && paddleX < canvas.width-(wallSize+paddleWidth)) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > wallSize) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
}

function drawBall(color) {
    // All game instructions are btw .beginPath & .closePath
    ctx.beginPath();

    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight*3.3, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawObjects(level) {
    var cont = level.columns * level.rows;

    for (var i=0; i<cont; i++) {
            if (level.objectsArrayFill[i].type === 0) { continue; }
            ctx.beginPath();
            ctx.drawImage((level.objectsArrayFill[i].type === 1) ? pOImage : wallImage,
                           level.objectsArrayFill[i].dx*32,
                           level.objectsArrayFill[i].dy*32);
            ctx.fill();
            ctx.closePath();
    }
}

var level1 = new Level(100, 3, 27, 22, 32);
level1.initObjectArray();
level1.placeObjects(1); // put all the walls in place
level1.placeObjects(2); // put all the primaryObjects in place

setInterval(draw(level1), 10);
