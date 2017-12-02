var canvasWidth, canvasHeight;

//Create joysticks
var joystick1 = new Joystick(16, 8);
var joystick2 = new Joystick(16, 8);

var client2canvas;
var canvas2client;

var connection;

function tick() {

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
};

function webGLStart() {

	// get the canvas DOM element
	var canvas = document.getElementById("canvas");

	canvas.width = screen.width;
	canvas.height = screen.height;

	rect = canvas.getBoundingClientRect();

	canvasWidth = canvas.width;
	canvasHeight = canvas.height;

	// Using the google provided WebGLUtils to grab the gl
	// context in the safest way possible
	gl = WebGLUtils.setupWebGL(canvas);


	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	/*
	// set the mouse functions
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	canvas.onmousemove = handleMouseMove;

	// set the key functions
	document.onkeydown = handleKeyDown;
	document.onkeypress = handleKeyPress;
	*/

	/*
	//Set touch functions
	canvas.addEventListener("touchstart", handleTouchStart, false);
	canvas.addEventListener("touchmove", handleTouchMove, false);
	canvas.addEventListener("touchend", handleTouchEnd, false);
	*/

	try {
		sphere.loadBuffers(gl);
	} catch (err) {
		console.log(err.message);
	}

	setPerspective(10);

	var w = canvasWidth;
	var h = canvasHeight;

	//Handle connection
	//connection = new WebSocket('ws://peaceful-lake-7978.herokuapp.com/');
	//connection.onmessage = receiveMessage;

	// start the drawing loop
	tick();
};

function render() {

	//Clear the screen
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Draw the joysticks
	var canvas = document.getElementById("canvas");
	joystick1.draw(canvas);
	joystick2.draw(canvas);

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
