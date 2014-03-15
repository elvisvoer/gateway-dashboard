var menuHidden = 'notHidden';



$(document).ready(function() {    
	
	$(window).load(function(){
      $("#sticker").sticky({ topSpacing: 50 });
    });
	
	
	 $('html, body').animate({scrollTop: $("#coverImage").offset().top + 200}, 200);
	
	
	$("#hideButton").click(function() {
		  if (menuHidden=='notHidden') {
			$("#buttonMenuz").toggle('200');
			$("#hideButton").removeClass('hideButton').addClass('hideButtonH');
			menuHidden='hidden';
		  } else {
			  
			$("#buttonMenuz").toggle('200');
			$("#hideButton").removeClass('hideButtonH').addClass('hideButton');
			menuHidden='notHidden';
		  }
		});
		
	$("#schematicsH").click(function() {
		
			$("#schematics").toggle('slow');		
	});
	
	
		
		
});

window.onload = function(){
	//temperature initialization
	
	
	var temperature = document.getElementById("temperature");
	var ctxT = temperature.getContext("2d");
	//dimensions
	var WT = temperature.width;
	var HT = temperature.height;
	
	var humidity = document.getElementById("humidity");
	var ctxH = humidity.getContext("2d");
	//dimensions
	var WH = humidity.width;
	var HH = humidity.height;
	
	//Temperature Variables
	var temp = 0;
	var hum = 0;
	var colorT = "#FF812B";
	var colorH = "#00FFE3"; 
	var bgcolor = "#E6FFEB";
	var text;
	
	function initT(temp)
	{
		//Clear the temperature everytime a chart is drawn
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
		var radians = temp * Math.PI / 25;
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
		text = Math.floor(temp) + "°";
		//Lets center the text
		//deducting half of text width from position x
		text_width = ctxT.measureText(text).width;
		//adding manual value to position y since the height of the text cannot
		//be measured easily. There are hacks but we will keep it manual for now.
		ctxT.fillText(text, WT/2 - text_width/2, HT/2 + 15);
	}
	
	function initH(hum)
	{
		//Clear the temperature everytime a chart is drawn
		ctxH.clearRect(0, 0, WH, HH);		
		//Background 360 degree arc
		ctxH.beginPath();
		ctxH.strokeStyle = bgcolor;
		ctxH.lineWidth = 30;
		ctxH.shadowColor = '#000000';
		ctxH.shadowBlur = 20;
		ctxH.shadowOffsetX = -5;
		ctxH.shadowOffsetY = 2;
		ctxH.arc(WH/2, HH/2, 100, 0, Math.PI*2, false); //you can see the arc now
		ctxH.stroke();
		//gauge will be a simple arc
		//Angle in radians = angle in degrees * PI / 180
		var radians = hum * Math.PI * 1.8 / 90 ;
		ctxH.beginPath();
		ctxH.strokeStyle = colorH;
		ctxH.lineWidth = 30;
		//The arc starts from the rightmost end. If we deduct 90 degrees from the angles
		//the arc will start from the topmost end
		ctxH.arc(WH/2, HH/2, 100, 0 - 90*Math.PI/180, radians - 90*Math.PI/180, false); 
		//you can see the arc now
		ctxH.stroke();
		
		//Lets add the text
		ctxH.fillStyle = colorH;
		ctxH.font = "50px bebas";
		text = Math.floor(hum) + "%";
		//Lets center the text
		//deducting half of text width from position x
		text_width = ctxH.measureText(text).width;
		//adding manual value to position y since the height of the text cannot
		//be measured easily. There are hacks but we will keep it manual for now.
		ctxH.fillText(text, WH/2 - text_width/2, HH/2 + 15);
	}

	initT(23);
	
	initH(90);
	
	
	
};