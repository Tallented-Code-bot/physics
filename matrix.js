/**
 * A basic matrix class
 * @param {number} rows The number of rows in the matrix
 * @param {number} columns The number of columns in the matrix
 */
function Matrix(rows,columns){
	this.rows=rows;
	this.columns=columns;
	this.data=[];

	for(let i=0;i<this.rows;i++){
		this.data[i]=[];
		for(let j=0;j<this.columns;j++){
			this.data[i][j]=0;
		}
	}
}



/**
 * Multiplies the matrix by a vector
 * @param {Vector} vector The vector to multiply the matrix by
 * @returns Vector
 */
Matrix.prototype.multiplyVector=function(vector){
	let result=new Vector(0,0);
	result.x=this.data[0][0]*vector.x + this.data[0][1]*vector.y;
	result.y=this.data[1][0]*vector.x+this.data[1][1]*vector.y;
	return result;
}