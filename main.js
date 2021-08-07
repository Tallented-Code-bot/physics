const canvas=document.getElementById("canvas");//get the canvas element
const context=canvas.getContext("2d");//get the canvas drawing context so that we can draw

const balls=[];
const walls=[];

let LEFT,RIGHT,UP,DOWN;

let friction=0.05;
let elasticity=1;

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

canvas.addEventListener("click",function(event){
	let rect=canvas.getBoundingClientRect();
	let x=event.clientX-rect.left;
	let y=event.clientY-rect.top;
	new Ball(x,y,30,100);
})



let ball1=new Ball(100,100,25,10);
let ball2=new Ball(200,200,50,2);
let wall1=new Wall(400,100,450,350);
let wall2=new Wall(200,100,150,350);

let leftEdge=new Wall(0,0,0,context.canvas.height);
let rightEdge=new Wall(context.canvas.width,0,context.canvas.width,context.canvas.height);
let topEdge=new Wall(0,0,context.canvas.width,0);
let bottomEdge=new Wall(0,context.canvas.height,context.canvas.width,context.canvas.height);
function loop(){
	context.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
	balls.forEach((b,index)=>{
		b.move();
		walls.forEach((w)=>{
			if(areBallAndWallColliding(balls[index],w)){
				resolvePenetrationForBallAndWall(balls[index],w);
				resolveCollisionForBallAndWall(balls[index],w);
			}
		})
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
	context.fillText(`Balls: ${balls.length}`,context.canvas.width-50,15);
	window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);