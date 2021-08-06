function Vector(x,y){
	this.x=x;
	this.y=y;
}


Vector.prototype.add=function(vector){
	return new Vector(
		this.x+vector.x,
		this.y+vector.y
	);
}

Vector.prototype.sub=function(vector){
	return new Vector(
		this.x-vector.x,
		this.y-vector.y
	);
}


Vector.prototype.mag=function(){
	return Math.sqrt(this.x**2+this.y**2);
}


Vector.prototype.mult=function(number){
	return new Vector(
		this.x*number,
		this.y*number
	);
}