// Namespace Global

var APPLICATION = APPLICATION || {}; // check if the NameSpace exist as var or function.


// Variable Declariations


// Defining Objects

function playerTank() {
    this.image = new Image();
    this.image.src = '../images/tank_player.png';
    this.image.onload = function(){
        context.drawImage(base_image, 100, 100);
    }
    
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

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // This line clear the canvas every 10 miliseconds

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
    else if(leftPressed && paddleX > 0+wallSize) {
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

setInterval(draw, 10);
