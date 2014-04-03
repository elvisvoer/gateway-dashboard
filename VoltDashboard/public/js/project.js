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

var socket = io.connect('http://localhost:3700');
function doScan()
{
	socket.emit('scan', {  });
}

function CheckCtrl($rootScope, $scope, $location, $routeParams) {
	
	var customers = [];
	$scope.customers = customers;

	$rootScope.scanBattery = doScan;


	
    socket.on('message', function (data) {
        if(data.UID) {
			var customer = { UID: data.UID, reader: data.reader };
			$scope.customers.push(customer);
			$scope.$apply();
        } else {
            console.log("There is a problem:", data);
        }
    });
}

