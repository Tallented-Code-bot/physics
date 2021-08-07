const canvas=document.getElementById("canvas");//get the canvas element
const context=canvas.getContext("2d");//get the canvas drawing context so that we can draw

const balls=[];
const walls=[];

let LEFT,RIGHT,UP,DOWN;

let friction=0.1;
let elasticity=1;

function Ball(x,y,radius,mass){
	this.position=new Vector(x,y);
	this.velocity=new Vector(0,0);
	this.acceleration=new Vector(0,0);
	this.radius=radius;
	this.mass=mass;
	if(mass===0){
		this.inverseMass=0;
	}else{
		this.inverseMass=1/this.mass;
	}
	balls.push(this);
}


Ball.prototype.draw=function(){
	context.beginPath();
	context.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI);
	context.strokeStyle="black";
	context.fillStyle="red";
	context.stroke();
	context.fill();
}


Ball.prototype.keyControl=function(){//if the arrow keys are pressed
	//set the value of the acceleration
	if(LEFT)this.acceleration.x=-1;
	if(RIGHT)this.acceleration.x=1;
	if(UP)this.acceleration.y=-1;
	if(DOWN)this.acceleration.y=1;
	if(!UP&&!DOWN)this.acceleration.y=0;
	if(!LEFT&&!RIGHT)this.acceleration.x=0;
}

Ball.prototype.move=function(){
	this.acceleration=this.acceleration.unit();//set the acceleration to have a magnitude of 1
	//set the velocity from the acceleration
	this.velocity=this.velocity.add(this.acceleration);
	//add friction
	this.velocity=this.velocity.mult(1-friction);
	//set the position from the velocity
	this.position=this.position.add(this.velocity);
}



function Wall(x1,y1,x2,y2){
	this.start=new Vector(x1,y1);
	this.end=new Vector(x2,y2);
}


Wall.prototype.draw=function(){
	context.beginPath();
	context.moveTo(this.start.x,this.start.y);
	context.lineTo(this.end.x,this.end.y);
	context.strokeStyle="black";
	context.stroke();
}


function are2BallsColliding(b1,b2){
	if(b1.radius+b2.radius>=b2.position.sub(b1.position).mag()){
		//if the distance between the balls is smaller than the sum of the radii, they are colliding
		return true;
	}
	return false;
}


function resolvePenetrationFor2Balls(b1,b2){
	let distance=b1.position.sub(b2.position);
	let penetration_depth=b1.radius+b2.radius-distance.mag();
	let penetration_resolution=distance.unit().mult(penetration_depth/2);
	b1.position=b1.position.add(penetration_resolution);
	b2.position=b2.position.add(penetration_resolution.mult(-1));
}



function resolveCollisionFor2Balls(b1,b2){
	let normal=b1.position.sub(b2.position).unit();
	let relativeVelocity=b1.velocity.sub(b2.velocity);
	let separatingVelocity=Vector.dot(relativeVelocity,normal);
	let new_separatingVelocity=-separatingVelocity*elasticity;

	let vsep_diff=new_separatingVelocity-separatingVelocity;
	let impulse=vsep_diff/(b1.inverseMass+b2.inverseMass);
	let impulseVector=normal.mult(impulse);

	b1.velocity=b1.velocity.add(impulseVector.mult(b1.inverseMass));
	b2.velocity=b2.velocity.add(impulseVector.mult(-b2.inverseMass));
}

window.addEventListener("keydown",function(event){//listen for keys being pressed
	event.preventDefault();//prevent the browser from scrolling
	//set the direction variables based on keypresses
	if(event.keyCode===37)LEFT=true;
	if(event.keyCode===38)UP=true;
	if(event.keyCode===39)RIGHT=true;
	if(event.keyCode===40)DOWN=true;
	if(event.keyCode===65)LEFT=true;
	if(event.keyCode===68)RIGHT=true;
	if(event.keyCode===87)UP=true;
	if(event.keyCode===83)DOWN=true;
})

window.addEventListener("keyup",function(event){//listen for keys being released
	//and unset the direction variables based on keypresses
	if(event.keyCode===37)LEFT=false;
	if(event.keyCode===38)UP=false;
	if(event.keyCode===39)RIGHT=false;
	if(event.keyCode===40)DOWN=false;
	if(event.keyCode===65)LEFT=false;
	if(event.keyCode===68)RIGHT=false;
	if(event.keyCode===87)UP=false;
	if(event.keyCode===83)DOWN=false;
})

let ball1=new Ball(100,100,25,5);
let ball2=new Ball(200,200,50,50);
let ball3=new Ball(300,300,10,2);
function loop(){
	context.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
	ball1.keyControl();
	ball1.draw();
	balls.forEach((b,index)=>{
		b.move();
		b.draw();
		for(let i=index+1;i<balls.length;i++){
			if(are2BallsColliding(balls[index],balls[i])){
				resolvePenetrationFor2Balls(balls[index],balls[i]);
				resolveCollisionFor2Balls(balls[index],balls[i]);
			}
		}	
	})
	if(are2BallsColliding(ball1,ball2)){
		resolvePenetrationFor2Balls(ball1,ball2);		
	}	
	window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);