//Handles the Joystick
//center = initial center position (and rest position for joystick)
//radius = joystick radius
//tiltPos = where the user is tilting the joystick
function Joystick(centerX, centerY, radius) {
	this.centerX = centerX;
	this.centerY = centerY;
	this.radius = radius;
	this.tiltPosX = centerX;
	this.tiltPosY = centerY;
}