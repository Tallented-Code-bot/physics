const canvas=document.getElementById("canvas");//get the canvas element
const context=canvas.getContext("2d");//get the canvas drawing context so that we can draw

//the pool table has a 2:1 ratio
canvas.width=window.innerWidth-10;
canvas.height=canvas.width/2
console.log(window.innerWidth);

const headString=canvas.width/4;//the headstring is the 1st quarter of the board
const headSpot=new Vector(headString,canvas.height/2);

const footString=canvas.width-canvas.width/4;
const footSpot=new Vector(footString,canvas.height/2);
const ballRadius=canvas.width/90;
const ballMass=20;

const balls=[];
const walls=[];

let mouseDown=false;
let mouse=new Vector(0,0);
let shooting=false;

let cue=new Ball(headSpot.x,headSpot.y,ballRadius,ballMass,"white");//the cue ball
new Ball(footSpot.x,footSpot.y,ballRadius,ballMass,"yellow");
new Ball(footSpot.x+2*ballRadius,footSpot.y-ballRadius-2,ballRadius,ballMass,"yellow");
new Ball(footSpot.x+2*ballRadius,footSpot.y+ballRadius+2,ballRadius,ballMass,"red");
new Ball(footSpot.x+4*ballRadius,footSpot.y+ballRadius*2+2,ballRadius,ballMass,"yellow");
new Ball(footSpot.x+4*ballRadius,footSpot.y,ballRadius,ballMass,"black");
new Ball(footSpot.x+4*ballRadius,footSpot.y-ballRadius*2,ballRadius,ballMass,"red");
new Ball(footSpot.x+6*ballRadius,footSpot.y-ballRadius*3,ballRadius,ballMass,"yellow");
new Ball(footSpot.x+6*ballRadius,footSpot.y-ballRadius*1,ballRadius,ballMass,"red");
new Ball(footSpot.x+6*ballRadius,footSpot.y+ballRadius*1,ballRadius,ballMass,"yellow");
new Ball(footSpot.x+6*ballRadius,footSpot.y+ballRadius*3,ballRadius,ballMass,"red");

new Ball(footSpot.x+8*ballRadius,footSpot.y,ballRadius,ballMass,"yellow");
new Ball(footSpot.x+8*ballRadius,footSpot.y+ballRadius*2,ballRadius,ballMass,"red");
new Ball(footSpot.x+8*ballRadius,footSpot.y+ballRadius*4,ballRadius,ballMass,"yellow");
new Ball(footSpot.x+8*ballRadius,footSpot.y-ballRadius*2,ballRadius,ballMass,"red");
new Ball(footSpot.x+8*ballRadius,footSpot.y-ballRadius*4,ballRadius,ballMass,"red");


let friction=0.02;
let elasticity=1;


/**
 * Checks if the mouse is inside a ball
 * @param {Ball} ball The ball to check
 * @param {Vector} mouse The mouse vector
 * @returns Boolean
 */
function isMouseInBall(ball,mouse){
	if(ball.position.sub(mouse).mag()<ball.radius){
		return true;
	}	
	return false
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

function keepBallInside(b){
	//the ball is to the left of the left side of the canvas
	if(b.position.x-b.radius<0){
		b.position.x=b.radius;//push the ball out of the edge
		b.velocity.x=b.velocity.x*-1;//reverse the x velocity
	}
	//the ball is to the right of the right side of the canvas
	if(b.position.x+b.radius>canvas.width){
		b.position.x=canvas.width-b.radius//push the ball out of the edge
		b.velocity.x=b.velocity.x*-1;//reverse the x velocity
	}
	//the ball is above the top of the canvas
	if(b.position.y-b.radius<0){
		b.position.y=b.radius;//push the ball out of the edge
		b.velocity.y=b.velocity.y*-1;
	}
	//the ball is below the bottom of the canvas
	if(b.position.y+b.radius>canvas.height){
		b.position.y=canvas.height-b.radius;//push the ball out of the edge
		b.velocity.y=b.velocity.y*-1;
	}
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


/**
 * Generates the rotation matrix for a given angle
 * @param {number} angle The angle to rotate to
 * @returns The rotation matrix
 */
function rotationMatrix(angle){
	/*
	The rotation matrix is a 2x2 matrix that looks like this:
	[cos(angle),-sin(angle)]
	[sin(angle),cos(angle)]

	It is used to rotate vectors
	*/
	let matrix=new Matrix(2,2);
	matrix.data[0][0]=Math.cos(angle);
	matrix.data[0][1]=-Math.sin(angle);
	matrix.data[1][0]=Math.sin(angle);
	matrix.data[1][1]=Math.cos(angle);
	return matrix;
}


function drawStick(){
	let toDraw=cue.position.add(cue.position.sub(mouse));
	context.beginPath()
	context.moveTo(cue.position.x,cue.position.y);
	context.lineTo(toDraw.x,toDraw.y);
	context.strokeStyle="black";
	context.stroke();
}

window.addEventListener("mousedown",(event)=>{
	mouseDown=true;
})

window.addEventListener("mouseup",(event)=>{
	mouseDown=false;
});



window.addEventListener("mousemove",(event)=>{
	mouse=getMousePosition(event);
})




function getMousePosition(event){
	let rect=canvas.getBoundingClientRect();
	return new Vector(event.clientX-rect.left,event.clientY-rect.top);	
}

function loop(){
	context.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
	//we are not already shooting
	//and the mouse is down
	//and the mouse is inside of the ball
	if(!shooting&&mouseDown&&isMouseInBall(cue,mouse)&&Math.abs(cue.velocity.mag())<1){
		shooting=true;//set shooting mode when the ball is clicked	
	}
	if(shooting&&!mouseDown){
		shooting=false;//we are finished shooting
		cue.velocity=cue.position.sub(mouse).mult(0.2);//set the ball velocity
	}
	if(shooting){//if it is in shooting mode
		drawStick();//draw the stick
	}
	balls.forEach((b,index)=>{
		b.move();
		keepBallInside(b);
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