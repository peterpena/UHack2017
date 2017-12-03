//asteroid clone (core mechanics only)
//arrow keys to move + x to shoot

var bullets;
var asteroids;
var ship;
var shipImage, bulletImage, particleImage;
var MARGIN = 40;

function setup() {
    createCanvas(1400,800);

    bulletImage = loadImage("assets/asteroids_bullet_20.png");
    shipImage = loadImage("assets/ship_rot.png");
    particleImage = loadImage("assets/asteroids_particle.png");

    ship = createSprite(width/2, height/2);
    ship.maxSpeed = 6;
    ship.friction = .1;
    ship.setCollider("circle", 0,0, 20);

    ship.addImage(shipImage, "normal");
    ship.addAnimation("thrust", "assets/ship_rot_fire1.png", "assets/ship_rot_fire2.png");

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

    asteroids = new Group();
    bullets = new Group();

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
  
    asteroids.overlap(bullets, asteroidHit);
  
    ship.bounce(asteroids);
  
    if(keyDown(LEFT_ARROW))
	ship.rotation -= 4;
    if(keyDown(RIGHT_ARROW))
	ship.rotation += 4;
    if(keyDown(UP_ARROW))
	{
	    ship.addSpeed(2.9, ship.rotation);
	    ship.changeAnimation("thrust");
	}
    else
	ship.changeAnimation("normal");
    
    if(keyWentDown("x"))
	{
	    var bullet = createSprite(ship.position.x, ship.position.y);
	    bullet.addImage(bulletImage);
	    bullet.setSpeed(10+ship.getSpeed(), ship.rotation);
	    bullet.rotation = ship.rotation;
	    bullet.life = 60;
	    bullets.add(bullet);
	}
  
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