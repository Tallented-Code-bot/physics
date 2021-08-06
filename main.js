const canvas=document.getElementById("canvas");//get the canvas element
const context=canvas.getContext("2d");//get the canvas drawing context so that we can draw

function drawBall(x,y,radius){
	context.beginPath();
	context.arc(x,y,radius,0,2*Math.PI);
	context.strokeStyle="black";
	context.fillStyle="red";
	context.stroke();
	context.fill();
}