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
	//canvas initialization
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	//dimensions
	var W = canvas.width;
	var H = canvas.height;
	//Variables
	var degrees = 0;
	var new_degrees = 0;
	var difference = 0;
	var color = "lightgreen"; //green looks better to me
	var bgcolor = "#222";
	var text;
	
	function init()
	{
		//Clear the canvas everytime a chart is drawn
		ctx.clearRect(0, 0, W, H);
		
		//Background 360 degree arc
		ctx.beginPath();
		ctx.strokeStyle = bgcolor;
		ctx.lineWidth = 30;
		ctx.arc(W/2, H/2, 100, 0, Math.PI*2, false); //you can see the arc now
		ctx.stroke();
		
		//gauge will be a simple arc
		//Angle in radians = angle in degrees * PI / 180
		var radians = degrees * Math.PI / 180;
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = 30;
		//The arc starts from the rightmost end. If we deduct 90 degrees from the angles
		//the arc will start from the topmost end
		ctx.arc(W/2, H/2, 100, 0 - 90*Math.PI/180, radians - 90*Math.PI/180, false); 
		//you can see the arc now
		ctx.stroke();
		
		//Lets add the text
		ctx.fillStyle = color;
		ctx.font = "50px bebas";
		text = Math.floor(degrees/360*100) + "°";
		//Lets center the text
		//deducting half of text width from position x
		text_width = ctx.measureText(text).width;
		//adding manual value to position y since the height of the text cannot
		//be measured easily. There are hacks but we will keep it manual for now.
		ctx.fillText(text, W/2 - text_width/2, H/2 + 15);
	}

	init();
	
	
	
}