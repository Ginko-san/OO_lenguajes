/**
 * Sprites for the game.
 */

var wallImage = document.getElementById('wall');
var pOImage = document.getElementById('primaryObject');
var pOImage2 = document.getElementById('primaryObject2');
var playerTankImage = document.getElementById('playerTank');
var enemyTankImage = document.getElementById('enemyTank');
var enemyTankImage2 = document.getElementById('enemyTank2');
var enemyTankImage3 = document.getElementById('enemyTank3');


/*-------------------- End Sprites Space ---------------------------*/

/**
 *  This class has all the game objects in it.
 *  ("Walls, primary objectives, tanks, bullets, etc").
 *  The parameters to the constructor :
 *      @param {number} w of wall objects.
 *      @param {number} pO of objectives objects.
 *      @param {number} e of enemys.
 *      @param {number} c of level Columns.
 *      @param {number} r of level Rows.
 *      @param {number} s of sprites size in pixels.
 *
 *  Default c = 27, r = 22.
 */
function Level(w, pO, e, c, r, s) {
    this._walls = w;
    this._primaryObjects = pO;
    this._enemys = e;
    this._columns = c;
    this._rows = r;
    this._spriteSize = s;

    this._field = "";
    this._canvas = "";

    this._playerTank = 1;
    this._objectsArrayFill = [];
    this._enemyTankArray = [];


}

Level.prototype.getPlayerTank = function () { return this._playerTank; };

/**
 *  Return _field variable
 *      @returns {string|*}
 */
Level.prototype.getField = function () { return this._field; };

Level.prototype.getObjectsArrayFill = function () { return this._objectsArrayFill; };

Level.prototype.addEnemyTank = function (value) {
    this._enemyTankArray.push(value);
};

Level.prototype.removeDestroyedEnemys = function () {
    this._enemyTankArray.forEach(function (e, i, a) {
        if (!e.getStatus()) {
            a.splice(i, 1);
        }
    });
};

Level.prototype.drawEnemyTanks = function (ctx, c, r, objectArray, spriteSize, canvas) {
    this._enemyTankArray.forEach(function (e, i, a) {
        if (e.getStatus()) {
            var move = Math.floor((Math.random() * 2));
            e.draw(1, ctx);
            if (move === 1) { e.walk(c, r, objectArray, spriteSize, canvas); }
        }
    });
};

Level.prototype.addRandomEnemy = function () {
    var x = Math.floor((Math.random() * (this._columns - 2)) + 1);
    var y = Math.floor((Math.random() * (this._rows - 2)) + 1);
    var randomTank = Math.floor((Math.random() * 3) + 1);

    var place = (y * this._columns) + x;
    if (!this._objectsArrayFill[place]._status) {
        if (randomTank === 1)
        {
            this.addEnemyTank(new EnemyTank(4, true, enemyTankImage, x * 32, y *32, 32, randomTank)); // Enemy tank with strong full life
        } else if (randomTank === 2)
        {
            this.addEnemyTank(new EnemyTank(2, true, enemyTankImage2, x * 32, y *32, 32, randomTank)); // Enemy tank with medium life and strong shoot
        } else {
            this.addEnemyTank(new EnemyTank(1, true, enemyTankImage3, x * 32, y *32, 32, randomTank)); // Enemy tank with teleport power
        }
    }
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
Level.prototype.placeObjects = function () {
    for (var i = 0; i < this._walls; i++) {
        while (true) {
            var x = Math.floor((Math.random() * (this._columns - 2)) + 1);
            var y = Math.floor((Math.random() * (this._rows - 2)) + 1);

            var place = (y * this._columns) + x;

            if (!this._objectsArrayFill[place]._status) {
                this._objectsArrayFill[place] = new Wall(1, true, wallImage, x, y);
                break;
            }
        }
    }
};

Level.prototype.placePrimaryObjectives = function () {
    var specialObjective = Math.floor((Math.random() * (this._primaryObjects - 2)) + 1);

    for (var i = 0; i < this._primaryObjects; i++) {
        while (true) {
            var x = Math.floor((Math.random() * (this._columns - 2)) + 1);
            var y = Math.floor((Math.random() * (this._rows - 2)) + 1);

            var place = (y * this._columns) + x;

            if (!this._objectsArrayFill[place]._status) {
                if (specialObjective !== 0) {
                    this._objectsArrayFill[place] = new Objective(3, true, pOImage2, x, y);
                    specialObjective--;
                } else {
                    this._objectsArrayFill[place] = new Objective(1, true, pOImage, x, y);
                }
                break;
            }
        }
    }
};

Level.prototype.placeEnemyTanks = function () {
    var tanks = Math.floor(this._enemys * 0.15);
    var rest = this._enemys - (tanks * 3);
    var y = 0;
    var x = 0;
    var place = 0;

    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < tanks; j++) {
            while (true) {
                x = Math.floor((Math.random() * (this._columns - 2)) + 1);
                y = Math.floor((Math.random() * (this._rows - 2)) + 1);

                place = (y * this._columns) + x;

                if (!this._objectsArrayFill[place]._status) {
                    if (i === 1)
                    {
                        this.addEnemyTank(new EnemyTank(4, true, enemyTankImage, x * 32, y *32, 32, i)); // Enemy tank with strong full life
                    } else if (i === 2)
                    {
                        this.addEnemyTank(new EnemyTank(2, true, enemyTankImage2, x * 32, y *32, 32, i)); // Enemy tank with medium life and strong shoot
                    } else {
                        this.addEnemyTank(new EnemyTank(1, true, enemyTankImage3, x * 32, y *32, 32, i)); // Enemy tank with teleport power
                    }
                    break;
                }
            }
        }
    }

    for (var l = 0; l < rest; l++) {
        while (true) {
            x = Math.floor((Math.random() * (this._columns - 2)) + 1);
            y = Math.floor((Math.random() * (this._rows - 2)) + 1);
            var randomTank = Math.floor((Math.random() * 3) + 1);

            place = (y * this._columns) + x;

            if (!this._objectsArrayFill[place]._status) {
                if (randomTank === 1)
                {
                    this.addEnemyTank(new EnemyTank(4, true, enemyTankImage, x * 32, y *32, 32, randomTank)); // Enemy tank with strong full life
                } else if (randomTank === 2)
                {
                    this.addEnemyTank(new EnemyTank(2, true, enemyTankImage2, x * 32, y *32, 32, randomTank)); // Enemy tank with medium life and strong shoot
                } else {
                    this.addEnemyTank(new EnemyTank(1, true, enemyTankImage3, x * 32, y *32, 32, randomTank)); // Enemy tank with teleport power
                }
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
            this._playerTank = new UserTank(3, true, playerTankImage, x * this._spriteSize, y * this._spriteSize, 32);
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

Level.prototype.bulletCollisionDetection = function (bulletArray, c, r, objectsArray, pO) {
    bulletArray.forEach(function (e, i, a) {
        var place = ((e.getY()/32) * c) + (e.getX()/32);

        if ( place < c || place >= (c * (r -1)) || place % c === 0 ){
            e.destroy();
        } else if (objectsArray[place]._status) {
            e.destroy();
            objectsArray[place].loseLife(1);
            //objectsArray[place]._status = false;
        } else {
            if (e.getDirection() === 1) { e.setY(-e.getVelocity()); }
            else if (e.getDirection() === 2) { e.setY(e.getVelocity()); }
            else if (e.getDirection() === 3) { e.setX(-e.getVelocity()); }
            else if (e.getDirection() === 4) { e.setX(e.getVelocity()); }
        }
    });
};

Level.prototype.updatePrimaryObjectiveQuantity = function (actualQuantity) {
    var cont = 0;

    this._objectsArrayFill.forEach(function (e, i, a) {
        if (e instanceof Objective)
        {
            cont += (e.getStatus()) ? 1 : 0;
            if (cont === actualQuantity) { return cont; }
        }
    });
    return cont;
};


Level.prototype.drawInField = function () {
    this._field.clearRect(0, 0, this._canvas.width, this._canvas.height); // This line clear the canvas every 10 ms

    this._primaryObjects = this.updatePrimaryObjectiveQuantity(this._primaryObjects);

    this.drawObjectsInField();
    this.drawEnemyTanks(this._field, this._columns, this._rows, this._objectsArrayFill, this._spriteSize, this._canvas);
    this._playerTank.draw(1, this._field);
    this._playerTank.drawBullets(this._field);

    this.bulletCollisionDetection(this._playerTank.getFiredBullets(), this._columns, this._rows, this._objectsArrayFill, this._primaryObjects);

    this._playerTank.removeDestroyedBullets();
    this.removeDestroyedEnemys();

    this._playerTank.walk(this._columns, this._rows, this._objectsArrayFill, this._spriteSize, this._canvas);

    this._playerTank.fire();



    if (this._primaryObjects === 0) {
        alert("You Win!");
        //window.location.href += "?timesWon=1";
        document.location.reload();
        //stopLevel = true;
    }

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
    this._firedBullets = [];

    //throw new Error ("Can't instantiate an Abstract Class.");
}

Tank.prototype.addFiredBullet = function (value) {
    this._firedBullets.push(value);
};

Tank.prototype.removeDestroyedBullets = function () {
    this._firedBullets.forEach(function (e, i, a) {
        if (!e.getStatus()) {
            a.splice(i, 1);
        }
    });
};

Tank.prototype.drawBullets = function (ctx) {
    this._firedBullets.forEach(function (e, i, a) {
        if (e.getStatus()) {
            e.draw(ctx);
        }
    });
};

Tank.prototype.getX = function () { return this._x; };

Tank.prototype.getY = function () { return this._y; };

Tank.prototype.getVelocity = function () { return this._velocity; };

Tank.prototype.getFiredBullets = function () { return this._firedBullets; };

Tank.prototype.getStatus = function () { return this._status; };

Tank.prototype.setX = function (value) { this._x += value; };

Tank.prototype.setY = function (value) { this._y += value; };

Tank.prototype.setLife = function (value) { this._life = value; };

Tank.prototype.walk = function () { Console.log("Walking."); };

Tank.prototype.fire = function () { Console.log("Shooting."); };

Tank.prototype.speedUp = function () { Console.log("Speeding Up."); };

Tank.prototype.collisionDetection = function () { Console.log("Paoh..."); };

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

    this._bulletUpPressed = false;
    this._bulletDownPressed = false;
    this._bulletRightPressed = false;
    this._bulletLeftPressed = false;

}

/**
 * Create the UserTank.prototype object that inherits from Tank Class.
 * @type {Tank}
 */
UserTank.prototype = Object.create(Tank.prototype);

UserTank.prototype.constructor = UserTank;  // Setting the 'constructor' property for UserTank references.

UserTank.prototype.setRightPressed = function (value) { this._rightPressed = value; };

UserTank.prototype.setLeftPressed = function (value) { this._leftPressed = value; };

UserTank.prototype.setUpPressed = function (value) { this._upPressed = value; };

UserTank.prototype.setDownPressed = function (value) { this._downPressed = value; };

UserTank.prototype.setSpacePressed = function (value) { this._spacePressed = value; };

UserTank.prototype.setBulletUpPressed = function (value) { this._bulletUpPressed = value; };

UserTank.prototype.setBulletDownPressed = function (value) { this._bulletDownPressed = value; };

UserTank.prototype.setBulletRightPressed = function (value) { this._bulletRightPressed = value; };

UserTank.prototype.setBulletLeftPressed = function (value) { this._bulletLeftPressed = value; };

UserTank.prototype.getRightPressed = function () { return this._rightPressed; };

UserTank.prototype.getLeftPressed = function () { return this._leftPressed; };

UserTank.prototype.getUpPressed = function () { return this._upPressed; };

UserTank.prototype.getDownPressed = function () { return this._downPressed; };

UserTank.prototype.getSpacePressed = function () { return this._spacePressed; };

UserTank.prototype.getBulletUpPressed = function () { return this._bulletUpPressed; };

UserTank.prototype.getBulletDownPressed = function () { return this._bulletDownPressed; };

UserTank.prototype.getBulletRightPressed = function () { return this._bulletRightPressed; };

UserTank.prototype.getBulletLeftPressed = function () { return this._bulletLeftPressed; };

UserTank.prototype.collisionDetection = function (c, r, objectArray, sprintSize) {
    var cont = 0;
    var placeTank = Math.round(((this._y / sprintSize) * c) + (this._x / sprintSize));
    var placeUp = placeTank - c;
    var placeDown = placeTank + c;
    var placeRight = placeTank + 1;
    var placeLeft = placeTank - 1;

    var coll = { Up: false,
                 Down: false,
                 Left: false,
                 Right: false,
                 NoColl: false
    };

    if (objectArray[placeUp]._status) {
       if (this._y <= (objectArray[placeUp].getY()*sprintSize) + sprintSize) { coll.Up = true; cont++; }
    }
    if (objectArray[placeDown]._status) {
        if (this._y + sprintSize >= (objectArray[placeDown].getY()*sprintSize)) { coll.Down = true; cont++; }
    }
    if (objectArray[placeLeft]._status) {
        if (this._x <= (objectArray[placeLeft].getX()*sprintSize)+ sprintSize) { coll.Left = true; cont++; }
    }
    if (objectArray[placeRight]._status) {
        if (this._x + sprintSize >= (objectArray[placeRight].getX()*sprintSize)) { coll.Right = true; cont++; }
    }
    if (cont === 0) { coll.NoColl = true; }

    return coll;
};

UserTank.prototype.walk = function (c, r, objectArray, spriteSize, canvas) {
    var coll = this.collisionDetection(c, r, objectArray, spriteSize);

    if(this.getRightPressed() && this.getX() < canvas.width-(spriteSize * 2)) {
        if (!coll.Right) { this.setX(this.getVelocity()); }
    } else if(this.getLeftPressed() && this.getX() > spriteSize) {
        if (!coll.Left) { this.setX(-this.getVelocity()); }
    } else if(this.getDownPressed() && this.getY() < canvas.height-(spriteSize * 2)) {
        if (!coll.Down) { this.setY(this.getVelocity()); }
    } else if(this.getUpPressed() && this.getY() > spriteSize) {
        if (!coll.Up) { this.setY(-this.getVelocity()); }
    }
};

UserTank.prototype.fire = function () {
    if (this.getSpacePressed()) {
        if (this.getBulletRightPressed()) {
            this.addFiredBullet(new Bullet(true, this.getX(), this.getY(), 32, 4));
        } else if (this.getBulletLeftPressed()) {
            this.addFiredBullet(new Bullet(true, this.getX(), this.getY(), 32, 3));
        } else if (this.getBulletUpPressed()) {
            this.addFiredBullet(new Bullet(true, this.getX(), this.getY(), 32, 1));
        } else if (this.getBulletDownPressed()) {
            this.addFiredBullet(new Bullet(true, this.getX(), this.getY(), 32, 2));
        }
    }
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
 *      @param {number} t type of the tank.
 *
 *  The methods change between it & the user tank. (the same name, but different actions)
 */
function EnemyTank(l, s, img, x, y, v, t) {
    Tank.call(this, l, s, img, x, y, v);

    this._type = t;
}

/**
 * Create the EnemyTank.prototype object that inherits from Tank Class.
 * @type {Tank}
 */
EnemyTank.prototype = Object.create(Tank.prototype);

EnemyTank.prototype.constructor = EnemyTank;  // Setting the 'constructor' property for EnemyTank references.

EnemyTank.prototype.getType = function () { return this._type; };

EnemyTank.prototype.collisionDetection = function (c, r, objectArray, sprintSize) {
    var cont = 0;
    var placeTank = Math.round(((this._y / sprintSize) * c) + (this._x / sprintSize));

    var placeUp = placeTank - c;
    var placeDown = placeTank + c;
    var placeRight = placeTank + 1;
    var placeLeft = placeTank - 1;

    var coll = { Up: false,
        Down: false,
        Left: false,
        Right: false,
        NoColl: false
    };

    if (objectArray[placeUp]._status) {
        if (this._y <= (objectArray[placeUp].getY()*sprintSize) + sprintSize) { coll.Up = true; cont++; }
    }
    if (objectArray[placeDown]._status) {
        if (this._y + sprintSize >= (objectArray[placeDown].getY()*sprintSize)) { coll.Down = true; cont++; }
    }
    if (objectArray[placeLeft]._status) {
        if (this._x <= (objectArray[placeLeft].getX()*sprintSize)+ sprintSize) { coll.Left = true; cont++; }
    }
    if (objectArray[placeRight]._status) {
        if (this._x + sprintSize >= (objectArray[placeRight].getX()*sprintSize)) { coll.Right = true; cont++; }
    }
    if (cont === 0) { coll.NoColl = true; }

    return coll;
};

EnemyTank.prototype.walk = function (c, r, objectArray, spriteSize, canvas) {
    var coll = this.collisionDetection(c, r, objectArray, spriteSize);
    var dir = Math.floor((Math.random() * 5));

    if(dir === 1 && this.getX() < canvas.width-(spriteSize * 2)) {
        if (!coll.Right) { this.setX(this.getVelocity()); }
    } else if(dir === 2 && this.getX() > spriteSize) {
        if (!coll.Left) { this.setX(-this.getVelocity()); }
    } else if(dir === 3 && this.getY() < canvas.height-(spriteSize * 2)) {
        if (!coll.Down) { this.setY(this.getVelocity()); }
    } else if(dir === 4 && this.getY() > spriteSize) {
        if (!coll.Up) { this.setY(-this.getVelocity()); }
    }
};

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

Objective.prototype.getX = function () { return this._x; };

Objective.prototype.getY = function () { return this._y; };

Objective.prototype.getStatus = function () { return this._status; };

Objective.prototype.destroy = function () { this._status = false; };

Objective.prototype.loseLife = function (hitSize) {
    this._life -= hitSize;
    this._status = (this._life !== 0);
    console.log((this._status) ? "Losing life." : "Dead.");
};

Objective.prototype.draw = function (sizeInPx, ctx) {
    if (this._status) {
        ctx.beginPath();
        ctx.drawImage(this._objectSprint, this._x * sizeInPx, this._y * sizeInPx);
        ctx.fill();
        ctx.closePath();
    }
};

/*------------------------------ End Objective Parent Class --------------------------------*/

/**
 *  Well, this object is the walls. Nothing to do xD.
 *      @param {number} l
 *      @param {boolean} s
 *      @param {Image} img
 *      @param {number} x
 *      @param {number} y
 */
function Wall(l, s, img, x, y) {
    this._life = l;
    this._status = s;
    this._objectSprint = img;
    this._x = x;
    this._y = y;
}

Wall.prototype.getX = function () { return this._x; };

Wall.prototype.getY = function () { return this._y; };

Wall.prototype.getStatus = function () { return this._status; };

Wall.prototype.destroy = function () { this._status = false; };

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

Wall.prototype.loseLife = function (hitSize) {
    this._life -= hitSize;
    this._status = (this._life !== 0);
    console.log((this._status) ? "Losing life." : "Destroyed.");
};

/*------------------------------ End Wall Class --------------------------------*/

/**
 *  This object is the ball that the tank will shoot for defeating his enemies.
 *      @param {boolean} s shooted or not "true/false".
 *      @param {number} x position in columns.
 *      @param {number} y position in rows.
 *      @param {number} v
 *      @param {number} d direction
 */
function Bullet(s, x, y, v, d) {
    this._status = s;
    this._x = x;
    this._y = y;
    this._velocity = v;
    this._direction = d;
}

Bullet.prototype.setX = function (value) { this._x += value; };

Bullet.prototype.setY = function (value) { this._y += value; };

Bullet.prototype.getX = function () { return this._x; };

Bullet.prototype.getY = function () { return this._y; };

Bullet.prototype.getVelocity = function () { return this._velocity; };

Bullet.prototype.getStatus = function () { return this._status; };

Bullet.prototype.getDirection = function () { return this._direction; };

Bullet.prototype.destroy = function () { this._status = false; };

Bullet.prototype.draw = function (ctx) {
    if (this._status) {
        ctx.beginPath();
        ctx.arc(this._x + 16, this._y + 16, 6, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
};

Bullet.prototype.collision = function (wallInFront, sprintSize) {
    if ((wallInFront.getX() <= this._x && this._x <= (wallInFront.getY() + sprintSize)) ||
        (wallInFront.getY() <= this._y && this._y <= (wallInFront.getY() + sprintSize))) {
        wallInFront.destroy();
        this._status = false;
    }
};

/*------------------------------ End Bullet Class --------------------------------*/


/*------------------------------ Begin of Canvas Functions & Settings --------------------------------*/

var x = 432;
var y = 584;

var dx = -2;
var dy = -2;

var bulletRadius = 12;
var bulletColor = "#FFCE21";
var wallSize = 32;

var stopLevel = false;

var timesWon = 0;

/*------------------------------ End of Canvas Functions & Settings --------------------------------*/

/**
 *  Main function
 */

function main() {
    var keyDownHandler  = function (e) {
        if (e.keyCode === 40) { level1.getPlayerTank().setDownPressed(true); }
        else if(e.keyCode === 39) { level1.getPlayerTank().setRightPressed(true); }
        else if (e.keyCode === 38) { level1.getPlayerTank().setUpPressed(true); }
        else if(e.keyCode === 37) { level1.getPlayerTank().setLeftPressed(true); }
        else if (e.keyCode === 87) { level1.getPlayerTank().setBulletUpPressed(true); }
        else if(e.keyCode === 83) { level1.getPlayerTank().setBulletDownPressed(true); }
        else if (e.keyCode === 68) { level1.getPlayerTank().setBulletRightPressed(true); }
        else if(e.keyCode === 65) { level1.getPlayerTank().setBulletLeftPressed(true); }
        else if(e.keyCode === 32) { level1.getPlayerTank().setSpacePressed(true); }
    };

    var keyUpHandler = function (e) {
        if (e.keyCode === 40) { level1.getPlayerTank().setDownPressed(false); }
        else if(e.keyCode === 39) { level1.getPlayerTank().setRightPressed(false); }
        else if (e.keyCode === 38) { level1.getPlayerTank().setUpPressed(false); }
        else if(e.keyCode === 37) { level1.getPlayerTank().setLeftPressed(false); }
        else if (e.keyCode === 87) { level1.getPlayerTank().setBulletUpPressed(false); }
        else if(e.keyCode === 83) { level1.getPlayerTank().setBulletDownPressed(false); }
        else if (e.keyCode === 68) { level1.getPlayerTank().setBulletRightPressed(false); }
        else if(e.keyCode === 65) { level1.getPlayerTank().setBulletLeftPressed(false); }
        else if(e.keyCode === 32) { level1.getPlayerTank().setSpacePressed(false); }
    };

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    var timesWon = 0;
    var time = 0;

    var level1 = new Level(120, 5, 5, 27, 22, 32);
    level1.initField();
    level1.initObjectArray();
    level1.placeObjects(); // put all the _walls in place
    level1.placePrimaryObjectives(); // put all the _primaryObjects in place
    level1.placePlayerTank();  // put the playerTank in place

    level1.placeEnemyTanks();  // put the enemys in place


    var firstLevel = setInterval(function () {
        level1.drawInField();
        if (time % 5000 === 0) {
            console.log("Put Tank");
            level1.addRandomEnemy();
        }

        if (stopLevel) {
            clearInterval(firstLevel);
        }
        time += 100;
    }, 100);


}

main();