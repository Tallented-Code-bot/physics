const canvas=document.getElementById("canvas");//get the canvas element
const context=canvas.getContext("2d");//get the canvas drawing context so that we can draw

const balls=[];

let LEFT,RIGHT,UP,DOWN;


function Ball(x,y,radius){
	this.x=x;
	this.y=y;
	this.radius=radius;
	this.vel_x=0
	this.vel_y=0;
	this.acc_x=0;
	this.acc_y=0;
	balls.push(this);
}


Ball.prototype.draw=function(){
	context.beginPath();
	context.arc(this.x,this.y,this.radius,0,2*Math.PI);
	context.strokeStyle="black";
	context.fillStyle="red";
	context.stroke();
	context.fill();
}


Ball.prototype.keyControl=function(){//if the arrow keys are pressed
	//set the value of the acceleration
	if(LEFT)this.acc_x=-1;
	if(RIGHT)this.acc_x=1;
	if(UP)this.acc_y=-1;
	if(DOWN)this.acc_y=1;
	if(!UP&&!DOWN)this.acc_y=0;
	if(!LEFT&&!RIGHT)this.acc_x=0;
	//set the velocity from the acceleration
	this.vel_x+=this.acc_x;
	this.vel_y+=this.acc_y;
	//add friction
	this.vel_x*=0.9;
	this.vel_y*=0.9;
	//set the position from the velocity
	this.x+=this.vel_x;
	this.y+=this.vel_y;

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
	balls.forEach((b)=>{
		b.draw();
	})
	window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);