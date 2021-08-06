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

Vector.prototype.unit=function(){
	if(this.mag()===0)return new Vector(0,0);//this prevents division by 0
	return new Vector(
		this.x/this.mag(),
		this.y/this.mag()
	);
}


Vector.prototype.normal=function(){
	return new Vector(
		-this.y,
		this.x
	).unit();
}


Vector.dot=function(vector1,vector2){
	return vector1.x*vector2.x+vector1.y*vector2.y;
}