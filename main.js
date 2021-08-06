const canvas=document.getElementById("canvas");//get the canvas element
const context=canvas.getContext("2d");//get the canvas drawing context so that we can draw

let x=100;
let y=100;
let LEFT,RIGHT,UP,DOWN;

function drawBall(x,y,radius){
	context.beginPath();
	context.arc(x,y,radius,0,2*Math.PI);
	context.strokeStyle="black";
	context.fillStyle="red";
	context.stroke();
	context.fill();
}

window.addEventListener("keydown",function(event){//listen for keys being pressed
	event.preventDefault();//prevent the browser from scrolling
	//set the direction variables based on keypresses
	if(event.keyCode===37)LEFT=true;
	if(event.keyCode===38)UP=true;
	if(event.keyCode===39)RIGHT=true;
	if(event.keyCode===40)DOWN=true;
})

window.addEventListener("keyup",function(event){//listen for keys being released
	//and unset the direction variables based on keypresses
	if(event.keyCode===37)LEFT=false;
	if(event.keyCode===38)UP=false;
	if(event.keyCode===39)RIGHT=false;
	if(event.keyCode===40)DOWN=false;
})

function move(){
	//change the x and y variables based on the direction variables
	if(LEFT)x--;
	if(RIGHT)x++;
	if(UP)y--;
	if(DOWN)y++;
}
drawBall(x,y,20);

function loop(){
	context.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
	move();
	drawBall(x,y,20);
	window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);