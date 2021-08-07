const canvas=document.getElementById("canvas");//get the canvas element
const context=canvas.getContext("2d");//get the canvas drawing context so that we can draw

const balls=[];
const walls=[];

let LEFT,RIGHT,UP,DOWN;

let friction=0.05;
let elasticity=1;


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
	//add friction
	this.velocity=this.velocity.mult(1-friction);
	//set the position from the velocity
	this.position=this.position.add(this.velocity);
}


/**
 * A basic wall class
 * @param {number} startX The x position of the start of the wal
 * @param {number} startY The y position of the start of the wall
 * @param {number} endX The x position of the end of the wall
 * @param {number} endY The y position of the end of the wall
 */
function Wall(startX,startY,endX,endY){
	this.start=new Vector(startX,startY);
	this.end=new Vector(endX,endY);
	walls.push(this);
}

/**
 * Draws the wall to the canvas
 */
Wall.prototype.draw=function(){
	context.beginPath();
	context.moveTo(this.start.x,this.start.y);
	context.lineTo(this.end.x,this.end.y);
	context.strokeStyle="black";
	context.stroke();
}

/**
 * Gets the unit vector of the wall
 * @returns The wall vector as a unit vector
 */
Wall.prototype.wallUnit=function(){
	return this.end.sub(this.start).unit();
}

/**
 * Finds the closest point of the wall relative to the ball 
 * @param {Ball} b1 The ball
 * @param {Wall} w1 The wall
 * @returns The closest point of the wall to the ball 
 */
function closestPoint(b1,w1){
	let ballToWallStart=w1.start.sub(b1.position);
	if(Vector.dot(w1.wallUnit(),ballToWallStart)>0){
		return w1.start;
	}
	let wallEndToBall=b1.position.sub(w1.end);
	if(Vector.dot(w1.wallUnit(),wallEndToBall)>0){
		return w1.end;
	}
	let closestDistance=Vector.dot(w1.wallUnit(),ballToWallStart);
	let closestVector=w1.wallUnit().mult(closestDistance);
	return w1.start.sub(closestVector);
}

/**
 * Checks if a ball and a wall are colliding
 * @param {Ball} b The ball to check
 * @param {Wall} w The wall to check
 * @returns Boolean
 */
function areBallAndWallColliding(b,w){
	let ballToClosest=closestPoint(b,w).sub(b.position);
	if(ballToClosest.mag()<=b.radius){
		return true;
	}
	return false
}

/**
 * Resolves a collision between a ball and a wall,
 * giving the ball a new velocity.
 * @param {Ball} b The ball to resolve
 * @param {Wall} w The wall to resolve
 */
function resolveCollisionForBallAndWall(b,w){
	let normal=b.position.sub(closestPoint(b,w)).unit();
	let separatingVelocity=Vector.dot(b.velocity,normal);
	let new_separatingVelocity=-separatingVelocity*elasticity;
	let vseparatingDifference=separatingVelocity-new_separatingVelocity;
	b.velocity=b.velocity.add(normal.mult(-vseparatingDifference));
}

/**
 * Moves the ball so it is not penetrating the wall
 * @param {Ball} b The ball to move
 * @param {Wall} w The wall to check
 */
function resolvePenetrationForBallAndWall(b,w){
	let penetrationVector=b.position.sub(closestPoint(b,w));
	b.position=b.position.add(penetrationVector.unit().mult(b.radius-penetrationVector.mag()));
}

/**
 * `Checks if two balls are colliding
 * @param {Ball} b1 ball 1
 * @param {Ball} b2 ball 2
 * @returns Boolean 
 */
function are2BallsColliding(b1,b2){
	if(b1.radius+b2.radius>=b2.position.sub(b1.position).mag()){
		//if the distance between the balls is smaller than the sum of the radii, they are colliding
		return true;
	}
	return false;
}

/**
 * Moves the two balls out of each other
 * @param {Ball} b1 ball 1
 * @param {Ball} b2 ball 2
 */
function resolvePenetrationFor2Balls(b1,b2){
	let distance=b1.position.sub(b2.position);
	let penetration_depth=b1.radius+b2.radius-distance.mag();
	let penetration_resolution=distance.unit().mult(penetration_depth/2);
	b1.position=b1.position.add(penetration_resolution);
	b2.position=b2.position.add(penetration_resolution.mult(-1));
}


/**
 * Resolves a collision between two balls, giving each
 * of them new velocities
 * @param {Ball} b1 ball 1
 * @param {Ball} b2 ball 2
 */
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
let wall1=new Wall(400,100,450,350);
function loop(){
	context.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
	ball1.keyControl();
	balls.forEach((b,index)=>{
		b.move();
		if(areBallAndWallColliding(b,wall1)){
			resolvePenetrationForBallAndWall(b,wall1);
			resolveCollisionForBallAndWall(b,wall1);
		}
		for(let i=index+1;i<balls.length;i++){
			if(are2BallsColliding(balls[index],balls[i])){
				resolvePenetrationFor2Balls(balls[index],balls[i]);
				resolveCollisionFor2Balls(balls[index],balls[i]);
			}
		}	
		b.draw();
	})
	walls.forEach((w)=>{
		w.draw();
	})
	window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);