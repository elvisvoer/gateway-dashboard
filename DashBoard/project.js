angular.module('project', [ 'device' ]).config(function($routeProvider) {
	$routeProvider.when('/', {
		controller : IndexCtrl,
		templateUrl : 'main.html'
	}).otherwise({
		redirectTo : '/'
	});
}).value('RoleList', [ {
	name : 'admin',
	value : '0'
}, {
	name : 'user',
	value : '1'
} ]);

var Token = function() {

};
Token.prototype.token = "BnFmMHroIllxSDbOaSXmUNF1ddYt9G94VAVnaC0w4GI";
Token.prototype.getToken = function() {
	return this.token;
};

function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1) {
		c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1) {
		c_value = null;
	} else {
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1) {
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start, c_end));
	}
	return c_value;
}

function setCookie(c_name, value, exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value)
			+ ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = c_name + "=" + c_value + ";domain=" + document.domain
			+ ";path=/";
}

function IndexCtrl($scope, $location, Device) {
	
	//init devices value on 0
	$scope.temperature = 0;
	$scope.humidity = 0;

	
	setInterval( function (){
		//temperature
		var d = new Date();
		var now = d.getTime();
		var from = now - 120000;
		Device.get({
			id : "00000000F6B14876_0_0_1",
			to : now,
			from : from
		}, function(device) {
			if(device.data.length > 0)
			{
				$scope.temperature = device.data[device.data.length - 1].v;
			}
		});
		
		//humidity
		Device.get({
			id : "00000000F6B14876_0_0_8",
			to : now,
			from : from
		}, function(device) {
			if(device.data.length > 0)
			{
				$scope.humidity = device.data[device.data.length - 1].v;
			}
		});
		
	}, 5000);
	
}

angular.module('device', [ 'ngResource' ]).factory(
		'Device',
		function($resource) {
			var user_access_token = 'BnFmMHroIllxSDbOaSXmUNF1ddYt9G94VAVnaC0w4GI';
			var interval = '1min';
			var Device = $resource('https://api.ninja.is/rest/v0/device/:id/data?fn=mean&from=:from&to=:to&interval=:intv&user_access_token=:token',
			{
				token : user_access_token,
				intv : interval
			});

			return Device;
		});