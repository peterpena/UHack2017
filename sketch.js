//asteroid clone (core mechanics only)
//arrow keys to move + x to shoot

var bullets;
var asteroids;
var redShips;
var blueShips;
var domain;
var shipImage, bulletImage, particleImage;
var MARGIN = 40;
var domainRadius = 200;
var initialTime;
var domainChangeInterval = 5000;
var timeLastDomainChange;

function setup() {
    createCanvas(1400,800);

    bulletImage = loadImage("assets/asteroids_bullet_20.png");
    shipImage = loadImage("assets/ship_rot.png");
    particleImage = loadImage("assets/asteroids_particle.png");

    redShips = [createShip()];
    blueShips = [createShip()];

    // specify width and height of each frame and number of frames
    // explode_sheet = loadSpriteSheet('assets/fire_sheet.png', 219, 219, 48);
    explode_animation = loadAnimation("assets/exp1.png", 
				      "assets/exp2.png",
				      "assets/exp3.png",
				      "assets/exp4.png",
				      "assets/exp5.png",
				      "assets/exp6.png",
				      "assets/exp7.png",
				      "assets/exp8.png",
				      "assets/exp9.png",
				      "assets/exp10.png",
				      "assets/exp11.png",
				      "assets/exp12.png");
    //ship.addAnimation("thrust", "assets/ship_20.png", "assets/ship_20.png");

    asteroids = new Group();
    bullets = new Group();
    domain = {x: Math.random()*width, y: Math.random()*height};

    initialTime = new Date();
    timeLastDomainChange = initialTime;

    for(var i = 0; i<8; i++) {
	var ang = random(360);
	var px = width/2 + 1000 * cos(radians(ang));
	var py = height/2+ 1000 * sin(radians(ang));
	createAsteroid(3, px, py);
    }


}

function draw() {
    clear();
    background(0);

    // animate the sprite sheet
    animation(explode_animation, 100, 130);
  
    fill(255, 0, 0);
    textAlign(CENTER);
    text("Time:", width/2-40, 20);

    fill(0, 0, 255);
    textAlign(CENTER);
    text("Time:", width/2+40, 20);
  
    for(var i=0; i<allSprites.length; i++) {
	var s = allSprites[i];
	if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
	if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
	if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
	if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
    }

    var currentTime = new Date();
    if (currentTime.getTime() - timeLastDomainChange.getTime() > domainChangeInterval) {
        timeLastDomainChange = currentTime;
        domain = {x: Math.random()*width, y: Math.random()*height};
    }

    asteroids.overlap(bullets, asteroidHit);
  
    redShips[0].bounce(asteroids);
  
    if(keyDown(LEFT_ARROW))
    redShips[0].rotation -= 4;
    if(keyDown(RIGHT_ARROW))
    redShips[0].rotation += 4;
    if(keyDown(UP_ARROW))
    {
        redShips[0].addSpeed(2.9, redShips[0].rotation);
        redShips[0].changeAnimation("thrust");
    }
    else
	redShips[0].changeAnimation("normal");
    }
    
    if(keyDown("a"))
    blueShips[0].rotation -= 4;
    if(keyDown("d"))
    blueShips[0].rotation += 4;
    if(keyDown("s"))
    {
        blueShips[0].addSpeed(2.9, blueShips[0].rotation);
        blueShips[0].changeAnimation("thrust");
    }
    else
	blueShips[0].changeAnimation("normal");
        //ship.changeAnimation("thrust");
    }
    
    if(keyWentDown("x"))
    {
        var bullet = createSprite(redShips[0].position.x, redShips[0].position.y);
        bullet.addImage(bulletImage);
        bullet.setSpeed(10+redShips[0].getSpeed(), redShips[0].rotation);
        bullet.rotation = redShips[0].rotation;
        bullet.life = 60;
        bullets.add(bullet);
    }

    if(keyWentDown("w"))
    {
        var bullet = createSprite(blueShips[0].position.x, blueShips[0].position.y);
        bullet.addImage(bulletImage);
        bullet.setSpeed(10+blueShips[0].getSpeed(), blueShips[0].rotation);
        bullet.rotation = blueShips[0].rotation;
        bullet.life = 60;
        bullets.add(bullet);
    }

  
    drawDomain();
    drawSprites();
  
}

function createAsteroid(type, x, y) {
    var a = createSprite(x, y);
    var img  = loadImage("assets/asteroid.png");
    a.addImage(img);
    a.setSpeed(2.5-(type/2), random(360));
    a.rotationSpeed = .5;
    //a.debug = true;
    a.type = type;
  
    if(type == 2)
	a.scale = .6;
    if(type == 1)
	a.scale = .3;
  
    a.mass = 2+a.scale;
    a.setCollider("circle", 0, 0, 50);
    asteroids.add(a);
    return a;
}

function createShip() {
    var ship = createSprite(width/2, height/2);
    ship.maxSpeed = 6;
    ship.friction = .1;
    ship.setCollider("circle", 0,0, 20);
    ship.addImage(shipImage, "normal");
    ship.addAnimation("thrust", "assets/ship_rot_fire1.png", "assets/ship_rot_fire2.png");
    ship.addImage(shipImage);
    return ship; 
}

function asteroidHit(asteroid, bullet) {
    var newType = asteroid.type-1;

    if(newType>0) {
	createAsteroid(newType, asteroid.position.x, asteroid.position.y);
	createAsteroid(newType, asteroid.position.x, asteroid.position.y);
    }

    /*for(var i=0; i<10; i++) {
	var p = createSprite(bullet.position.x, bullet.position.y);
	p.addImage(particleImage);
	p.setSpeed(random(3,5), random(360));
	p.friction = 0.95;
	p.life = 15;
	}*/

    bullet.remove();
    asteroid.remove();
}

function changeDomainPos() {
    domain = {x: Math.random()*width, y: Math.random()*height};
}

function drawDomain() {
    var redCount = 0;
    var blueCount = 0;
    
    // console.log(redShips[0].position.x + " " + redShips[0].position.y);
    // console.log(blueShips[0].position.x + " " + blueShips[0].position.y);

    for (var i=0; i<redShips.length; i++) 
        if (Math.sqrt(Math.pow(redShips[i].position.x-domain.x, 2) + Math.pow(redShips[i].position.y-domain.y, 2)) <domainRadius)
            redCount++;
    for (var i=0; i<blueShips.length; i++) 
        if (Math.sqrt(Math.pow(blueShips[i].position.x-domain.x, 2) + Math.pow(blueShips[i].position.y-domain.y, 2)) <domainRadius)
            blueCount++;

    if (redCount == 0 && blueCount > 0)
        fill(0, 0, 255, 100);
    else if (blueCount == 0 && redCount > 0)
        fill(255, 0, 0, 100);
    else
        fill(125, 125, 125, 100);

    noStroke();
    ellipse(domain.x, domain.y, 2*domainRadius, 2*domainRadius);
}