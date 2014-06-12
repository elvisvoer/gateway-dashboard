var app = angular.module('project', [ 'ngResource' ]).config(function($routeProvider) {
	$routeProvider.when('/', {
		controller : IndexCtrl,
		templateUrl : 'views/main.html'
	}).when('/new', {
		controller : IndexCtrl,
		templateUrl : 'views/new.html'
	}).when('/check', {
		controller : CheckCtrl,
		templateUrl : 'views/check.html'
	}).otherwise({
		redirectTo : '/'
	});
});

	
function IndexCtrl($scope, $location, $routeParams) {
	

}

var socket = io.connect('http://127.0.0.1:3700');
// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}
// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}
function restart()
{
	console.log("Restarting");
	socket.emit('doRestart', {  });
}

function CheckCtrl($rootScope, $scope, $location, $routeParams) {
	
	var customers = [];
	$scope.customers = customers;
    
	$rootScope.doRestart = restart;


	
    socket.on('message', function (data) {
        if(data.UID) {
			var d = new Date();
			var customer = { UID: data.UID, reader: data.reader, time: d.today()+' '+ d.timeNow()  };
			$scope.customers.push(customer);
			$scope.$apply();
        } else {
            console.log("There is a problem:", data);
        }
    });
}

