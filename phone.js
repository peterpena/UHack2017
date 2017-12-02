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

	//Set touch functions
	canvas.addEventListener("touchstart", handleTouchStart, false);
	canvas.addEventListener("touchmove", handleTouchMove, false);
	canvas.addEventListener("touchend", handleTouchEnd, false);

	try {
		sphere.loadBuffers(gl);
	} catch (err) {
		console.log(err.message);
	}

	setPerspective(10);

	var w = canvasWidth;
	var h = canvasHeight;

	//Handle connection
	connection = new WebSocket('ws://peaceful-lake-7978.herokuapp.com/');
	connection.onmessage = receiveMessage;

	// start the drawing loop
	tick();
};

function lookAt(eye, at, up) {

	var uz = eye.minus(at);

	uz = uz.times(1 / uz.length());

	var ux = up.cross(uz);

	ux = ux.times(1 / ux.length());

	var uy = uz.cross(ux);

	var R = new Mat(ux, uy, uz);

	var T = Mat.transMatrix(eye);

	view2world = T.times(R);

	var Rinv = R.transpose();

	var Tinv = Mat.transMatrix(eye.minus());

	world2view = Rinv.times(Tinv);
};

function setPerspective(far) {

	var a = -(far + 1) / (far - 1);
	var b = a - 1;

	view2clip = new Mat();
	view2clip.set(2, 2, a);
	view2clip.set(2, 3, b);
	view2clip.set(3, 2, -1);
	view2clip.set(3, 3, 0);

	view2clip = view2clip.times(Mat.scaleMatrix(new PV(canvasHeight
			/ canvasWidth, 1, 1, true)));

	clip2view = new Mat();
	clip2view.set(2, 2, 0);
	clip2view.set(2, 3, -1);
	clip2view.set(3, 2, 1 / b);
	clip2view.set(3, 3, a / b);

	clip2view = Mat.scaleMatrix(new PV(canvasWidth / canvasHeight, 1, 1, true))
			.times(clip2view);

	updateMat();
};

function updateMat() {
	model2clip = view2clip.times(world2view).times(tran).times(rot);
};

function render() {

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.uniformMatrix4fv(shader.getUniform(gl, "mat"), false, new Float32Array(
			model2clip.getBuffer()));

	var lightP = rotInv.times(tranInv.times(new PV(-10, 0, 10, true)));
	var lightI = new PV(1, 1, 1, true);
	lightI.set(3, 0.9);
	var eyeP = rotInv.times(tranInv.times(view2world.times(new PV(true))));

	gl.uniform4fv(shader.getUniform(gl, "lightP"), lightP.array);
	gl.uniform4fv(shader.getUniform(gl, "lightI"), lightI.array);
	gl.uniform4fv(shader.getUniform(gl, "eyeP"), eyeP.array);

	sphere.draw(gl, shader, "vs_position", "vs_color", "vs_normal");
};

var mouseDown = false;
var windowPress;
var vMin;

//Handles what happens when the canvas is touched
function handleTouchStart(event){
	event.preventDefault();
	var touches = event.changedTouches;

	//Process max 2 touches at a time (one for each joystick)
	if(touches.length >= 2)
		return;
	
}

function handleTouchMove(event){

}

function handleTouchEnd(event){

}

function handleMouseDown(event) {
	mouseDown = true;

	var pixelDistance = 4;

	windowPress = client2canvas.times(new PV(event.clientX, event.clientY, 0,
			true));

	vMin = null;
	var dMin = 1e9;
	for ( var i = 0; i < sphere.verts.length; i++) {
		var v = sphere.verts[i];

		var windowV = clip2window.times(model2clip.times(v.p));
		// ...and set its z to zero because that's the z of windowPress.
		windowV.set(2, 0.0);

		var d = windowPress.distance(windowV);
		if (d <= dMin) {
			dMin = d;
			vMin = v;
		}
	}

	if (dMin > pixelDistance)
		vMin = null;

}

function handleMouseUp(event) {
	mouseDown = false;
}

function handleMouseMove(event) {
	if (!mouseDown) {
		return;
	}

	var windowDrag = client2canvas.times(new PV(event.clientX, event.clientY,
			0, true));
	if (vMin == null) {

		var clipPress = window2clip.times(windowPress);

		var clipDrag = window2clip.times(windowDrag);

		var clipO = model2clip.times(new PV(true));

		clipPress.set(2, clipO.get(2));
		clipDrag.set(2, clipO.get(2));

		var worldPress = view2world.times(clip2view.times(clipPress));

		var worldDrag = view2world.times(clip2view.times(clipDrag));

		var t = worldDrag.minus(worldPress);
		
		var tr = Mat.transMatrix(t).times(tran);
		var trInv = tranInv.times(Mat.transMatrix(t.minus()));
		
		translate(tr, trInv);
		
		var s = "trans";
		
		for(var i = 0; i < tr.array.length; i++) {
			s += " " + tr.array[i];
		}
		
		for(var i = 0; i < trInv.array.length; i++) {
			s += " " + trInv.array[i];
		}

		connection.send(s);
		
	} else {

		var o = new PV(true);

		var v = rot.times(vMin.p.minus(o));

		var clipDragFront = window2clip.times(windowDrag);
		clipDragFront.set(2, -1.0);

		clipDragBack = window2clip.times(windowDrag);
		clipDragBack.set(2, 1.0);

		var wFront = tranInv.times(view2world.times(clip2view
				.times(clipDragFront)));

		var wBack = tranInv.times(view2world.times(clip2view
				.times(clipDragBack)));

		var of = wFront.minus(o);

		var fb = wBack.minus(wFront);
		fb = fb.times(1 / fb.length());

		var s = -of.dot(fb);

		var w = of.plus(fb.times(s));

		var r = v.length();
		var l = w.length();

		if (l <= r) {

			var z = Math.sqrt(r * r - l * l);

			if (v.dot(fb) > 0)
				w = w.plus(fb.times(z));
			else
				w = w.minus(fb.times(z));
		} else {
			w.times(r / l);
		}

		var vx = v;
		vx = vx.times(1 / vx.length());

		var wx = w;
		wx = wx.times(1 / wx.length());

		var vz = vx.cross(wx);

		if (vz.length() < 1e-3)
			return;

		vz = vz.times(1 / vz.length());

		var wz = vz;

		var vy = vz.cross(vx);

		var wy = wz.cross(wx);

		var vMat = new Mat(vx, vy, vz);

		var wMat = new Mat(wx, wy, wz);

		var vwMat = wMat.times(vMat.transpose());

		var vwMatInv = vwMat.transpose();
		
		var r = vwMat.times(rot);
		var rInv = rotInv.times(vwMatInv);
		
		rotate(r, rInv);
		
		var s = "rot";
		
		for(var i = 0; i < r.array.length; i++) {
			s += " " + r.array[i];
		}
		
		for(var i = 0; i < rInv.array.length; i++) {
			s += " " + rInv.array[i];
		}
		
		connection.send(s);
	}
	windowPress = windowDrag;
}


function translate(t, tInv) {
	tran = t;
	tranInv = tInv;
	updateMat();
}

function rotate(r, rInv) {
	rot = r;
	rotInv = rInv;
	updateMat();
}

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

}

function move(a) {
	if(a.length == 4) {
		var t = new PV(false);
		t.array = a;
		translate(t);
	} else if(a.length == 16) {
		var m = new Mat();
		m.array = a;
		rotate(m);
	}
}
