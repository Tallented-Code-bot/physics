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