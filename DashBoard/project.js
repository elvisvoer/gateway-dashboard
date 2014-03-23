var app = angular.module('project', [ 'device', 'blocks' ]).config(function($routeProvider) {
	$routeProvider.when('/', {
		controller : IndexCtrl,
		templateUrl : 'main.html'
	}).otherwise({
		redirectTo : '/'
	});
});

/*
app.value("RoundWidget", null)
   .factory("RoundWidget", function() { 
		// returns anonymous object with Factory method 'createWidgets' which creates PWidgets
		return { createWidget: function(id){ return new PWidget(id); } }; 
});
*/

// User object 
var User = { token : 'BnFmMHroIllxSDbOaSXmUNF1ddYt9G94VAVnaC0w4GI' };
	
function IndexCtrl($scope, $location, $routeParams, Block, Devices, DeviceData) {

	//var self = this;
	// query the registered devices
	 Devices.get(function(d)
	 {
		var sensors = []
		for(var i in d.data)
	    {
			// only devices that are sensors and not silent and has time series
			if(d.data[i].is_sensor == 1 /*&& d.data[i].is_silent == 0*/ && d.data[i].has_time_series)
				sensors.push( { id: i, data: d.data[i], value: 0 } );
		}
		$scope.sensors = sensors;
		console.log(d);
		
		
		setInterval( function (){
			//temperature
			var d = new Date();
			var now = d.getTime();
			var from = now - 120000;
			for(var i in sensors)
			{
//				console.log(sensors[i].id);
				DeviceData.get({
					id : sensors[i].id,
					to : now,
					from : from
				}, 
				// closure function for passing the sensor index
				(function(x){
					return function(device) {
						//console.log(x);
						if(device.data.length > 0)
						{
							$scope.sensors[x].value = device.data[device.data.length - 1].v.toFixed(2);
						}
						else
						{
							$scope.sensors[x].value = 0;
						}
					}
				})(i));
			}
		}, 20000);
	 });

	$scope.getBlocks = function(){
		
		Block.get(function(b)
		{
			var blocks = [];
			for(var i in b.data)
			{
				blocks.push( { id: i, data: b.data[i] } );
			}
			$scope.blocks = blocks;
			console.log(blocks);
		});
	};
	
	$scope.unpairBlock = function(id){
		
		console.log(id);
		Block.get({ id: id }, function(b)
		{
			console.log(b);
			b.destroy(id, function() {
				$scope.getBlocks();
			});
		});
	};
	
	/*
	
	*/
}

angular.module('device', [ 'ngResource' ]).factory(
		'DeviceData',
		function($resource) {
			var user_access_token = User.token;
			var interval = '1min';
			var Device = $resource('https://api.ninja.is/rest/v0/device/:id/data?fn=mean&from=:from&to=:to&interval=:intv&user_access_token=:token',
			{
				token : user_access_token,
				intv : interval
			});

			return Device;
		}).factory(
		'Devices',
		function($resource) {
			var user_access_token = User.token;
			return $resource('https://api.ninja.is/rest/v0/devices?user_access_token=:token',
			{
				token : user_access_token,
			});

			//return Devices;
		});
		
angular.module('blocks', [ 'ngResource' ]).factory(
		'Block',
		function($resource) {
			var user_access_token = User.token;
			var Block = $resource('https://api.ninja.is/rest/v0/block/:id/?user_access_token=:token', {
				token : user_access_token,
			});

			Block.prototype.destroy = function(bid, cb) {
				console.log(this);
				return Block.remove({
					id : bid
				}, cb);
			};

			return Block;
		});
		