/* Text Content */ 
function waitForBattery(x) {	
	$('#batteryField').text(x);	
}
			

$(document).ready(function(){
	$('#defaultCountdown').countdown({until: '+5m',  format: 'MS'});
	
	$("#bLogOut").on("click", 'a' , function(){
		
		var receivedString = $("#bLogOut").find('input').eq(0).val();
		waitForBattery(receivedString);
		
		});
	
	
	$("#bNC").on("click", function(){
		
		$('#newCustomerForm').show();
		$('#mainButtons').hide();		
	
	});
	
	$("#cNC").on("click", function(){
		
		$('#newCustomerForm').hide();		
	
	});
	
	$("#okNC").on("click", function(){
		
		var myDate = new Date();
		var uName = $("#newCustomerForm").find('input').eq(0).val();
		var uCPR = $("#newCustomerForm").find('input').eq(1).val();
		var uTime = myDate.getMonth() + '/' + myDate.getDate() + '/' + myDate.getFullYear(); // + '/' + myDate.getFullYear() + '-' + myDate.getHours() + ':' + myDate().getMinutes();
		var uBattery = $("#batteryField").text();
		var uContainer = "A";
		var uSync = "NO";
		var uIn = "O";
		
		$('#customerTable > tbody:last').append('<tr><td>'+ uName +'</td><td>'+ uCPR +'</td><td>'+ uTime +'</td><td>'+ uBattery +'</td><td>'+ uContainer +'</td><td>'+ uSync +'</td><td>'+ uIn +'</td></tr>');
		
		$('#newCustomerForm').hide();
		$('#mainButtons').show();	
		
		
	});
	
		
	
	$("#bCR").on("click", function(){
		
		$('#customerRecords').toggle();		
	
	});
	
	
})
