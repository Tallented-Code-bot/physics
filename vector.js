/**
 * A basic vector class
 * @param {number} x The x value of the vector
 * @param {number} y The y value of the vector
 */
function Vector(x,y){
	this.x=x;
	this.y=y;
}

/**
 * Adds two vectors together
 * @param {Vector} vector The vector to add
 * @returns The sum of the current vector and the new vector
 */
Vector.prototype.add=function(vector){
	return new Vector(
		this.x+vector.x,
		this.y+vector.y
	);
}

/**
 * Subtracts two vectors
 * @param {Vector} vector The Vector to subtract
 * @returns The difference of the current vector and the new vector
 */
Vector.prototype.sub=function(vector){
	return new Vector(
		this.x-vector.x,
		this.y-vector.y
	);
}

/**
 * Gets the magnitude of the current vector
 * @returns The magnitude of the vector
 */
Vector.prototype.mag=function(){
	return Math.sqrt(this.x**2+this.y**2);
	//use the pythagorean theorem to get the magnitude
}

/**
 * Multiplies a vector and a scalar
 * @param {number} number The number to multiply the vector by
 * @returns The product of the current vector and the new vector
 */
Vector.prototype.mult=function(number){
	return new Vector(
		this.x*number,
		this.y*number
	);
}

/**
 * Gets the unit vector from the current vector
 * @returns The unit vector of the current vector
 */
Vector.prototype.unit=function(){
	if(this.mag()===0)return new Vector(0,0);//this prevents division by 0
	return new Vector(
		this.x/this.mag(),
		this.y/this.mag()
	);
}

/**
 * Gets the normal vector of the current vector
 * @returns A vector perpendicular to the current vector
 */
Vector.prototype.normal=function(){
	return new Vector(
		-this.y,
		this.x
	).unit();
}


Vector.prototype.draw=function(startX,startY,n,color){
	context.beginPath();
	context.moveTo(startX,startY);
	context.lineTo(startX+this.x*n,startY+this.y*n);
	context.strokeStyle=color;
	context.stroke();
	context.closePath();
}

/**
 * Gets the dot product of two vectors.
 * @param {Vector} vector1 The 1st vector to multiply
 * @param {Vector} vector2 The 2nd vector to multiply
 * @returns The dot product of the two vectors
 */
Vector.dot=function(vector1,vector2){
	return vector1.x*vector2.x+vector1.y*vector2.y;
}