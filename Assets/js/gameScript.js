/**
 * Sprites for the game.
 */

var wallImage = document.getElementById('wall');
var pOImage = document.getElementById('primaryObject');
var playerTankImage = document.getElementById('playerTank');
var enemyTankImage = document.getElementById('enemyTank');


/*-------------------- End Sprites Space ---------------------------*/

/**
 *  This class has all the game objects in it.
 *  ("Walls, primary objectives, tanks, bullets, etc").
 *  The parameters to the constructor :
 *      @param {number} w of wall objects.
 *      @param {number} pO of objectives objects.
 *      @param {number} c of level Columns.
 *      @param {number} r of level Rows.
 *      @param {number} s of sprites size in pixels.
 *
 *  Default c = 27, r = 22.
 */
function Level(w, pO, c, r, s) {
    this._walls = w;
    this._primaryObjects = pO;
    this._columns = c;
    this._rows = r;
    this._spriteSize = s;
    this._objectsArrayFill = [];
    this._field = "";
    this._canvas = "";

    this._playerTank = 1;

}

Level.prototype.getPlayerTank = function () {
    return this._playerTank;
};

/**
 *  Initialize a _canvas & _field variables
 *  and set the measurements for the canvas.
 */
Level.prototype.initField = function () {
    this._canvas = document.getElementById("canvasTankGame");
    this._field = this._canvas.getContext("2d");

    this._canvas.width = "" + (this._columns * this._spriteSize);
    this._canvas.height = "" + (this._rows * this._spriteSize);
};

/**
 *  Return _field variable
 *      @returns {string|*}
 */
Level.prototype.getField = function () {
    return this._field;
};

/**
 *  Fill the array with empty values.
 */
Level.prototype.initObjectArray = function () {
    var cont = 0;

    for (var i = 0; i < this._columns; i++) {
        for (var j = 0; j < this._rows; j++) {
            this._objectsArrayFill[cont] = {_status: false};
            cont++;
        }
    }
};

/**
 *  Fill the array with _walls.
 *      @param {number} typeObject values:
 *                                      0 = Empty.
 *                                      1 = PrimaryObject.
 *                                      2 = Wall.
 */
Level.prototype.placeObjects = function (typeObject) {
    var nObjects = (typeObject === 1) ? this._primaryObjects : this._walls;

    for (var i = 0; i < nObjects; i++) {
        while (true) {
            var x = Math.floor((Math.random() * (this._columns - 2)) + 1);
            var y = Math.floor((Math.random() * (this._rows - 2)) + 1);

            var place = (y * this._columns) + x;

            if (!this._objectsArrayFill[place]._status) {
                this._objectsArrayFill[place] = (typeObject === 1) ?
                    new Objective(1, true, pOImage, x, y) :
                    new Wall(true, wallImage, x, y);
                break;
            }
        }
    }
};

/**
 *  Place & draw the user tank
 * @returns {UserTank}
 */
Level.prototype.placePlayerTank =  function () {
    while (true) {
        var x = Math.floor((Math.random() * (this._columns - 2)) + 1);
        var y = Math.floor((Math.random() * (this._rows - 2)) + 1);

        var place = (y * this._columns) + x;

        if (!this._objectsArrayFill[place]._status) {
            this._playerTank = new UserTank(3, true, playerTankImage, x * this._spriteSize, y * this._spriteSize, 1);
            this._playerTank.draw(1, this._field);
            break;
        }
    }
};

/**
 *  Place the objects of the objectsArrayFill variable in the _field canvas 2d.
 */
Level.prototype.drawObjectsInField = function () {
    var cont = this._columns * this._rows;

    for (var i = 0; i < cont; i++) {
        if (!this._objectsArrayFill[i]._status) { continue; }
        this._objectsArrayFill[i].draw(this._spriteSize, this._field);
    }
};

// function to delete, only for testing purposes
Level.prototype.drawBall = function () {
    this._field.beginPath();

    this._field.arc(x, y, ballRadius, 0, Math.PI*2);
    this._field.fillStyle = "#0095DD";
    this._field.fill();

    this._field.closePath();
};

Level.prototype.drawPaddle = function () {
    this._field.beginPath();

    this._field.rect(paddleX, this._canvas.height-paddleHeight*3.3, paddleWidth, paddleHeight);
    this._field.fillStyle = "#0095DD";
    this._field.fill();

    this._field.closePath();
};

Level.prototype.collisionDetection = function () {
    var cont = this._columns * this._rows;

    for (var c = 0; c < cont; c++) {
        var objectToColl = this._objectsArrayFill[c];

        if (objectToColl._status)
        {
            if (y < (objectToColl._y*wallSize)+ wallSize && y > (objectToColl._y*wallSize) &&
                x < (objectToColl._x*wallSize)+ wallSize && x > (objectToColl._x*wallSize)) {
                dy = -dy;
                objectToColl._status = false;
            }
        }
    }
};


Level.prototype.drawInField = function () {
    this._field.clearRect(0, 0, this._canvas.width, this._canvas.height); // This line clear the canvas every 10 ms

    this.drawObjectsInField();
    this._playerTank.draw(1, this._field);
    //this.drawBall();
    //this.drawPaddle();
    this.collisionDetection();


    /*
    if (x + dx < wallSize+ballRadius || x + dx > this._canvas.width-(wallSize+ballRadius)) {
        dx = -dx;
    }

    if (y + dy < wallSize+ballRadius || y + dy > this._canvas.height-(wallSize+ballRadius)) {
        dy = -dy;
    }*/
    /*
    if(rightPressed && paddleX < this._canvas.width-(wallSize+paddleWidth)) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > wallSize) {
        paddleX -= 7;
    }*/
    var coll = this._playerTank.collisionDetection(this._columns, this._rows, this._objectsArrayFill, this._spriteSize);

    if(this._playerTank.getRightPressed() && this._playerTank.getX() < this._canvas.width-(this._spriteSize * 2)) {
        if (coll !== 4) { this._playerTank.setX(this._playerTank.getVelocity()); }
    } else if(this._playerTank.getLeftPressed() && this._playerTank.getX() > this._spriteSize) {
        if (coll !== 3) { this._playerTank.setX(-this._playerTank.getVelocity()); }
    } else if(this._playerTank.getDownPressed() && this._playerTank.getY() < this._canvas.height-(this._spriteSize * 2)) {
        if (coll !== 2) { this._playerTank.setY(this._playerTank.getVelocity()); }
    } else if(this._playerTank.getUpPressed() && this._playerTank.getY() > this._spriteSize) {
        if (coll !== 1) { this._playerTank.setY(-this._playerTank.getVelocity()); }
    }



    //x += dx;
    //y += dy;
};

/*------------------------------ End Level Class --------------------------------*/

/**
 *  This object is the parent of User Tank & Enemy Tank Objects,
 *  can't be instantiated cuz is a abstract class.
 *      @param {number} l is the number of tank lives.
 *      @param {boolean} s visible or invisible "true/false".
 *      @param {Image} img Sprint's object.
 *      @param {number} x position in columns.
 *      @param {number} y position in rows.
 *      @param {number} v velocity of the tank.
 *
 */
function Tank(l, s, img, x, y, v) {
    this._life = l;
    this._status = s;
    this._objectSprint = img;
    this._x = x;
    this._y = y;
    this._velocity = v;

    //throw new Error ("Can't instantiate an Abstract Class.");
}

Tank.prototype.getX = function () {
    return this._x;
};

Tank.prototype.getY = function () {
    return this._y;
};

Tank.prototype.getVelocity = function () {
    return this._velocity;
};

Tank.prototype.setX = function (value) {
    this._x += value;
    console.log(this._x);
};

Tank.prototype.setY = function (value) {
    this._y += value;
    console.log(this._y);
};

Tank.prototype.walk = function () {
    Console.log("Walking.");
};

Tank.prototype.fire = function () {
    Console.log("Shooting.");
};

Tank.prototype.speedUp = function () {
    Console.log("Speeding Up.");
};

Tank.prototype.setLife = function (l) {
    this._life = l;
    console.log("Established life");
};

Tank.prototype.loseLife = function (hitSize) {
    this._life -= hitSize;
    this._status = (this._life !== 0);
    console.log("Losing life.");
};

Tank.prototype.collision = function () {

};

Tank.prototype.setObjectSprint = function (img) {
    this._objectSprint = img;
};

Tank.prototype.draw = function (sizeInPx, ctx) {
    if (this._status) {
        ctx.beginPath();
        ctx.drawImage(this._objectSprint,
            this._x * sizeInPx,
            this._y * sizeInPx);
        ctx.fill();
        ctx.closePath();
    }
};

/*------------------------------ End Tank Parent Class --------------------------------*/

/**
 *  This object is the one that the user will use to play,
 *  can be instantiated cuz is a child object.
 *      @param {number} l is the number of tank lives.
 *      @param {boolean} s visible or invisible "true/false".
 *      @param {Image} img Sprint's object.
 *      @param {number} x position in columns.
 *      @param {number} y position in rows.
 *      @param {number} v velocity of the tank.
 *
 *  The methods change between it & the enemy tank. (the same name, but different actions)
 */
function UserTank(l, s, img, x, y, v) {
    Tank.call(this, l, s, img, x, y, v);

    this._rightPressed = false;
    this._leftPressed = false;
    this._upPressed = false;
    this._downPressed = false;
    this._spacePressed = false;
}

/**
 * Create the UserTank.prototype object that inherits from Tank Class.
 * @type {Tank}
 */
UserTank.prototype = Object.create(Tank.prototype);

UserTank.prototype.constructor = UserTank;  // Setting the 'constructor' property for UserTank references.

UserTank.prototype.setRightPressed = function (value) {
    this._rightPressed = value;
};

UserTank.prototype.setLeftPressed = function (value) {
    this._leftPressed = value;
};

UserTank.prototype.setUpPressed = function (value) {
    this._upPressed = value;
};

UserTank.prototype.setDownPressed = function (value) {
    this._downPressed = value;
};

UserTank.prototype.setSpacePressed = function (value) {
    this._spacePressed = value;
};

UserTank.prototype.getRightPressed = function () {
    return this._rightPressed;
};

UserTank.prototype.getLeftPressed = function () {
    return this._leftPressed;
};

UserTank.prototype.getUpPressed = function () {
    return this._upPressed;
};

UserTank.prototype.getDownPressed = function () {
    return this._downPressed;
};

UserTank.prototype.getSpacePressed = function () {
    return this._spacePressed;
}

UserTank.prototype.collisionDetection = function (c, r, objectArray, sprintSize) {
    var cont = c * r;

    var placeTank = Math.floor(((this._y / sprintSize) * c) + (this._x / sprintSize));
    var placeUp = placeTank - c;
    var placeDown = placeTank + c;
    var placeRight = placeTank + 1;
    var placeLeft = placeTank - 1;
    //console.log(placeTank);
    //console.log("up: "+ placeUp + ", " + (placeTank - c));

    if (objectArray[placeUp]._status) {
       if (this._y <= (objectArray[placeUp].getY()*sprintSize) + sprintSize) { return 1; }
    }
    if (objectArray[placeDown]._status) {
        if (this._y >= (objectArray[placeDown].getY()*sprintSize)) { return 2; }
    }
    if (objectArray[placeLeft]._status) {
        if (this._x <= (objectArray[placeLeft].getX()*sprintSize)+ sprintSize) { return 3; }
    }
    if (objectArray[placeRight]._status) {
        if (this._x >= (objectArray[placeRight].getX()*sprintSize)) { return 4; }
    }
    return 0;

    /*for (var i = 0; i < cont; i++) {
        var objectToColl = objectArray[i];

        if (objectToColl._status)
        {
            if (this._y < (objectToColl.getY()*sprintSize)+ sprintSize && this._y > (objectToColl.getY()*sprintSize)) {
                this._upPressed = false;
                this._downPressed = false;
            } else if (this._x < (objectToColl.getX()*sprintSize)+ sprintSize && this._x > (objectToColl.getX()*sprintSize)) {
                this._leftPressed = false;
                this._rightPressed = false;
            }
        }
    }*/
};




/*------------------------------ End User Tank Class --------------------------------*/

/**
 *  This object is the one that the enemy's will use to kill the UserTank,
 *  can be instantiated cuz is a child object.
 *      @param {number} l is the number of tank lives.
 *      @param {boolean} s visible or invisible "true/false".
 *      @param {Image} img Sprint's object.
 *      @param {number} x position in columns.
 *      @param {number} y position in rows.
 *      @param {number} v velocity of the tank.
 *
 *  The methods change between it & the user tank. (the same name, but different actions)
 */
function EnemyTank(l, s, img, x, y, v) {
    Tank.call(this, l, s, img, x, y, v);
}

/**
 * Create the EnemyTank.prototype object that inherits from Tank Class.
 * @type {Tank}
 */
EnemyTank.prototype = Object.create(Tank.prototype);

EnemyTank.prototype.constructor = EnemyTank;  // Setting the 'constructor' property for EnemyTank references.


/*------------------------------ End Enemy Tank Class --------------------------------*/

/**
 *  Well, this object is the Objective. Nothing to do xD.
 *      @param l
 *      @param s
 *      @param img
 *      @param x
 *      @param y
 */
function Objective(l, s, img, x, y) {
    this._life = l;
    this._status = s;
    this._objectSprint = img;
    this._x = x;
    this._y = y;
}

Objective.prototype.getX = function () {
    return this._x;
};

Objective.prototype.getY = function () {
    return this._y;
};

Objective.prototype.getStatus = function () {
    return this._status;
};

Objective.prototype.loseLife = function (hitSize) {
    this._life -= hitSize;
    this._status = (this._life !== 0);
    console.log((this._status) ? "Losing life." : "Dead.");
};

Objective.prototype.destroy = function () {
    this._status = false;
};

Objective.prototype.draw = function (sizeInPx, ctx) {
    if (this._status) {
        ctx.beginPath();
        ctx.drawImage(this._objectSprint,
            this._x * sizeInPx,
            this._y * sizeInPx);
        ctx.fill();
        ctx.closePath();
    }
};

/*------------------------------ End Objective Parent Class --------------------------------*/

/**
 *  Well, this object is the walls. Nothing to do xD.
 *      @param {boolean} s
 *      @param {Image} img
 *      @param {number} x
 *      @param {number} y
 */
function Wall(s, img, x, y) {
    this._status = s;
    this._objectSprint = img;
    this._x = x;
    this._y = y;
}

Wall.prototype.getX = function () {
    return this._x;
};

Wall.prototype.getY = function () {
    return this._y;
};

Wall.prototype.getStatus = function () {
    return this._status;
};

Wall.prototype.destroy = function () {
    this._status = false;
};

Wall.prototype.draw = function (sizeInPx, ctx) {
    if (this._status) {
        ctx.beginPath();
        ctx.drawImage(this._objectSprint,
            this._x * sizeInPx,
            this._y * sizeInPx);
        ctx.fill();
        ctx.closePath();
    }
};

/*------------------------------ End Wall Class --------------------------------*/

/**
 *  This object is the ball that the tank will shoot for defeating his enemies.
 *      @param {boolean} s shooted or not "true/false".
 *      @param {number} x position in columns.
 *      @param {number} y position in rows.
 */
function Bullet(s, x ,y) {
    this._status = s;
    this._x = x;
    this._y = y;
}

Bullet.prototype.getX = function () {
    return this._x;
};

Bullet.prototype.getY = function () {
    return this._y;
};

Bullet.prototype.getStatus = function () {
    return this._status;
};

Bullet.prototype.shoot = function () {

}


/*------------------------------ End Bullet Class --------------------------------*/


/*------------------------------ Begin of Canvas Functions & Settings --------------------------------*/

var x = 432;
var y = 584;

var dx = -2;
var dy = -2;

var ballRadius = 12;
var ballColor = #FFCE21;
var wallSize = 32;


//paddle vars
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = 395;

// Bottoms
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false;

/*function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}*/

/*------------------------------ End of Canvas Functions & Settings --------------------------------*/

/**
 *  Main function
 */
function main() {
    var level1 = new Level(100, 3, 27, 22, 32);
    level1.initField();
    level1.initObjectArray();
    level1.placeObjects(1); // put all the _walls in place
    level1.placeObjects(2); // put all the _primaryObjects in place
    level1.placePlayerTank();  // put the playerTank in place

    var keyDownHandler  = function (e) {
        if (e.keyCode === 40) { downPressed = true; level1.getPlayerTank().setDownPressed(true); }
        else if(e.keyCode === 39) { rightPressed = true; level1.getPlayerTank().setRightPressed(true); }
        else if (e.keyCode === 38) { upPressed = true; level1.getPlayerTank().setUpPressed(true);}
        else if(e.keyCode === 37) { leftPressed = true;  level1.getPlayerTank().setLeftPressed(true);}
        else if(e.keyCode === 32) { spacePressed = true; level1.getPlayerTank().setSpacePressed(true); } 
    };

    var keyUpHandler = function (e) {
        if (e.keyCode === 40) { downPressed = false; level1.getPlayerTank().setDownPressed(false); }
        else if(e.keyCode === 39) { rightPressed = false;  level1.getPlayerTank().setRightPressed(false); }
        else if (e.keyCode === 38) { upPressed = false;  level1.getPlayerTank().setUpPressed(false); }
        else if(e.keyCode === 37) { leftPressed = false;  level1.getPlayerTank().setLeftPressed(false); }
        else if(e.keyCode === 32) { spacePressed = false; level1.getPlayerTank().setSpacePressed(false);
    };

    var keySpaceHandler = function (e) {
        if (e.keyCode === 32) { spacePressed = true; level1.getPlayerTank().setSpacePressed(true);}
    };

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("keyspace",keySpaceHandler, false);


    setInterval(function () {
        level1.drawInField();
    }, 10);
}

main();