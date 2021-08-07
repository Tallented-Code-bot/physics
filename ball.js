/**
 * A ball class
 * @param {number} x The starting x position of the ball
 * @param {number} y The starting y position of the ball
 * @param {number} radius The radius of the ball
 * @param {number} mass The mass of the ball
 */
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

/**
 * Draws the ball onto the canvas
 */
Ball.prototype.draw=function(){
	context.beginPath();
	context.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI);
	context.strokeStyle="black";
	context.fillStyle="red";
	context.stroke();
	context.fill();
}

/**
 * Moves the ball according to the global keyboard variables
 */
Ball.prototype.keyControl=function(){//if the arrow keys are pressed
	//set the value of the acceleration
	if(LEFT)this.acceleration.x=-1;
	if(RIGHT)this.acceleration.x=1;
	if(UP)this.acceleration.y=-1;
	if(DOWN)this.acceleration.y=1;
	if(!UP&&!DOWN)this.acceleration.y=0;
	if(!LEFT&&!RIGHT)this.acceleration.x=0;
}
/**
 * Applies acceleration and velocity to move the ball
 */
Ball.prototype.move=function(){
	this.acceleration=this.acceleration.unit();//set the acceleration to have a magnitude of 1
	//set the velocity from the acceleration
	this.velocity=this.velocity.add(this.acceleration);
	this.acceleration.y=1
	//add friction
	this.velocity=this.velocity.mult(1-friction);
	//set the position from the velocity
	this.position=this.position.add(this.velocity);
}