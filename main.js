const canvas=document.getElementById("canvas");//get the canvas element
const context=canvas.getContext("2d");//get the canvas drawing context so that we can draw

let LEFT,RIGHT,UP,DOWN;


function Ball(x,y,radius){
	this.x=x;
	this.y=y;
	this.radius=radius;
}


Ball.prototype.draw=function(){
	context.beginPath();
	context.arc(this.x,this.y,this.radius,0,2*Math.PI);
	context.strokeStyle="black";
	context.fillStyle="red";
	context.stroke();
	context.fill();
}


Ball.prototype.keyControl=function(){
	if(LEFT)this.x--;
	if(RIGHT)this.x++;
	if(UP)this.y--;
	if(DOWN)this.y++;
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

let ball1=new Ball(100,100,25);
function loop(){
	context.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
	ball1.keyControl();
	ball1.draw();
	window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);