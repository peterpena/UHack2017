var canvasWidth, canvasHeight;

//Create joysticks
var radius = 40;
//var joystick1 = new Joystick(screen.width / 4, screen.height / 2, radius);
//var joystick2 = new Joystick(3 * screen.width / 4, screen.height / 2, radius);

var client2canvas;
var canvas2client;

var connection;

//Controls the nipples
var manager;

//Holds the nipple IDs for easy reference
var joystickL = -1;
var joystickR = -1;

//The X and Y that the ship will move in the next frame
var moveX = 0;
var moveY = 0;

//The speed at which the ship will move
var speed = 1; //2.9?

var buttonX = 50;
var buttonY;
var buttonWidth = 150;
var buttonHeight = 50;
var buttonRegionWidth = 250;
var buttonClicked;


//var options = { color: "#FF0000", size: 40, threshold: 5, maxNumberOfNipples: 2, mode: "dynamic" };
//var manager = nipplejs.create(options);

function tick() {
    //console.log("tick");
	// asks the browser to use this callback on the next animation
	// this function is redefined in WebGLUtils to behave in a cross
	// browser way
	requestAnimFrame(tick);// set the key functions

	// call the render function
	try {
		render();
	} catch (err) {
		console.log(err.message);
	}

  drawShootButton(buttonCanvas);

	//console.log(manager.ids);
	console.log("moveX = " + moveX);
	console.log("moveY = " + moveY);
  if (moveX > 0  || moveY > 0) {
    //send message
    // console.log(new Date() + " " + moveX + ", " +moveY);
  }
};

function drawShootButton(canvas) {
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'green';
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
  ctx.fillStyle = 'black';

  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle"; 
  ctx.fillText("SHOOT", buttonX+buttonWidth/2, buttonY+buttonHeight/2);
}

// function getButtonClick() {
//   var x;
//   var y;
//   if (e.pageX || e.pageY) { 
//     x = e.pageX;
//     y = e.pageY;
//   }
//   else { 
//     x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
//     y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
//   } 
//   x -= gCanvasElement.offsetLeft;
//   y -= gCanvasElement.offsetTop;
// }

function webGLStart() {
    //var locked = screen.lockOrientation("landscape");

    //if(!locked)
    	//console.log("Didn't lock orientation");
	// get the canvas DOM element
  var canvas = document.getElementById("canvas");
	var buttonCanvas = document.getElementById("buttonCanvas");

	canvas.width = screen.width-buttonRegionWidth;
	canvas.height = screen.height;

  buttonCanvas.width = buttonRegionWidth;
  buttonCanvas.height = screen.height;

	rect = canvas.getBoundingClientRect();

	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
  buttonY = canvasHeight/2;

	// Using the google provided WebGLUtils to grab the gl
	// context in the safest way possible
	//gl = WebGLUtils.setupWebGL(canvas);


	//gl.clearColor(0.0, 0.0, 0.0, 1.0);

	/*
	// set the mouse functions
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	canvas.onmousemove = handleMouseMove;
	// set the key functions
	document.onkeydown = handleKeyDown;
	document.onkeypress = handleKeyPress;
	*/

	
	//Set touch functions
	canvas.addEventListener("touchstart", handleTouchStart, false);
	canvas.addEventListener("touchmove", handleTouchMove, false);
	canvas.addEventListener("touchend", handleTouchEnd, false);


	var w = canvasWidth;
	var h = canvasHeight;

	//Handle connection
	//connection = new WebSocket('ws://peaceful-lake-7978.herokuapp.com/');
	//connection.onmessage = receiveMessage;

	var options = { zone: document.getElementById('canvas'), color: "#FF0000", multitouch: "true",  maxNumberOfNipples: 2 };
	manager = nipplejs.create(options);

	//Nipple Event Listeners
	manager.on('added', function (evt, nipple) {
    	nipple.on('start', function (evt) {
        	//console.log("created nipple #" + nipple.id);

        	//Properly assign nipples to left or right
        	//Prevent two joysticks from being created in the same half of the screen
        	if(nipple.position.x <= screen.width / 2){
        		//If a nipple already exists in the region, destroy the new one
        		if(joystickL != -1){
        			nipple.destroy();
        		}
        		//If not, then save the new one's info
        		else{
        			joystickL = nipple.id;
        		}
        	} else{
        		//If a nipple already exists in the region, destroy the new one
        		if(joystickR != -1){
        			nipple.destroy();
        		}
        		//If not, then save the new one's info
        		else{
        			joystickR = nipple.id;
        		}
        	}

        	//console.log("left nipple = " + joystickL);
        	//console.log("right nipple = " + joystickR);
   		});
   		nipple.on('move', function (evt) {
        	//console.log("moved nipple");
        	
        	//Calculate movement angle
        	var angle = Math.atan2(nipple.frontPosition.y, nipple.frontPosition.x);

        	//Move with left stick
        	if(nipple.id == joystickL){
        		moveX = (speed * Math.cos(angle));
        		moveY = (speed * Math.sin(angle));
        	}
        	

        	//Shoot with right stick
        	if(nipple.id == joystickR){

        	}
   		});
   		nipple.on('end', function (evt) {
        	//console.log("destroyed nipple");

        	//Uncouple nipples
        	if(nipple.position.x <= screen.width / 2)
        		joystickL = -1;
        	else
        		joystickR = -1;

        	//Set move values to 0
        	moveX = 0;
        	moveY = 0;
   		});
	}).on('removed', function (evt, nipple) {
    	nipple.off('start move end');
	});

	// start the drawing loop
	tick();

}



//Handles what happens when the joystick is touched
function handleTouchStart(event){
	event.preventDefault();

	/*
	if(touches.length >= 2)
		return;
	var touch = touches[touches.length-1];
	var dx = touch.clientX - joystick1.centerX;
	var dy = touch.clientY - joystick1.centerY;
	if((dx * dx + dy * dy) <= (joystick1.radius * joystick1.radius))
		joystick1.handleTouchStart(touch);
	dx = touch.clientX - joystick2.centerX;
	dy = touch.clientY - joystick2.centerY;
	if((dx * dx + dy * dy) <= (joystick2.radius * joystick2.radius))
		joystick2.handleTouchStart(touch);
	*/



}

//Move the joystick to the touch
function handleTouchMove(event){
	event.preventDefault();

	var touch = touches[touches.length-1];

	var dx = touch.clientX - joystick1.centerX;
	var dy = touch.clientY - joystick1.centerY;

	if((dx * dx + dy * dy) <= (joystick1.radius * joystick1.radius))
		joystick1.handleTouchMove(touch);

	dx = touch.clientX - joystick2.centerX;
	dy = touch.clientY - joystick2.centerY;

	if((dx * dx + dy * dy) <= (joystick2.radius * joystick2.radius))
		joystick2.handleTouchMove(touch);
}

//On touch end, snap the joystick back to its starting position
function handleTouchEnd(event){
	event.preventDefault();

	var touch = touches[touches.length-1];

	var dx = touch.clientX - joystick1.centerX;
	var dy = touch.clientY - joystick1.centerY;

	if((dx * dx + dy * dy) <= (joystick1.radius * joystick1.radius))
		joystick1.handleTouchEnd(touch);

	dx = touch.clientX - joystick2.centerX;
	dy = touch.clientY - joystick2.centerY;

	if((dx * dx + dy * dy) <= (joystick2.radius * joystick2.radius))
		joystick2.handleTouchEnd(touch);
}

function render() {

	//Clear the screen
	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

	//Draw the joysticks
	var canvas = document.getElementById("canvas");
	//joystick1.draw(canvas);
	//joystick2.draw(canvas);

	//Send info

};

var mouseDown = false;
var windowPress;
var vMin;


function receiveMessage(e) {

//receiving data as binary
	
//	var reader = new FileReader();
//	var a;
//	reader.addEventListener("loadend", function() {
//	   a = reader.result;
//	   move(new Float64Array(a));
//	});
//	
//	reader.readAsArrayBuffer(e.data);

	/*
	var a = e.data.split(' ');
		
	var m = new Mat();
	var mInv = new Mat();
	
	for(var i = 1; i <= 16; i++) {
		m.array[i - 1] = Number(a[i]);
	}
	
	for(var i = 17; i <= 32; i++) {
		mInv.array[i - 17] = Number(a[i]);
	}
	
	if(a[0] === 'trans') {
		translate(m, mInv);
	} else if(a[0] === 'rot') {
		rotate(m, mInv);
	}
	*/
}