function PWidget(pw_id) {
	//elem initialization
	
	var elem = document.getElementById(pw_id);
	var ctxT = elem.getContext("2d");
	//dimensions
	var WT = elem.width;
	var HT = elem.height;
	
	//elem Variables
	var colorT = "#FF812B"; 
	var bgcolor = "#E6FFEB";
	var text;
	
	
	this.draw = function(value)
	{
		//Clear the elem everytime a chart is drawn
		ctxT.clearRect(0, 0, WT, HT);		
		//Background 360 degree arc
		ctxT.beginPath();
		ctxT.strokeStyle = bgcolor;
		ctxT.lineWidth = 30;
		ctxT.shadowColor = '#000000';
		ctxT.shadowBlur = 20;
		ctxT.shadowOffsetX = -5;
		ctxT.shadowOffsetY = 2;
		ctxT.arc(WT/2, HT/2, 100, 0, Math.PI*2, false); //you can see the arc now
		ctxT.stroke();
		//gauge will be a simple arc
		//Angle in radians = angle in degrees * PI / 180
		var radians = value * Math.PI / 25;
		ctxT.beginPath();
		ctxT.strokeStyle = colorT;
		ctxT.lineWidth = 30;
		//The arc starts from the rightmost end. If we deduct 90 degrees from the angles
		//the arc will start from the topmost end
		ctxT.arc(WT/2, HT/2, 100, 0 - 90*Math.PI/180, radians - 90*Math.PI/180, false); 
		//you can see the arc now
		ctxT.stroke();
		
		//Lets add the text
		ctxT.fillStyle = colorT;
		ctxT.font = "50px bebas";
		text = Math.floor(value) + "°";
		//Lets center the text
		//deducting half of text width from position x
		text_width = ctxT.measureText(text).width;
		//adding manual value to position y since the height of the text cannot
		//be measured easily. There are hacks but we will keep it manual for now.
		ctxT.fillText(text, WT/2 - text_width/2, HT/2 + 15);
	}

	this.draw(0);
	
};