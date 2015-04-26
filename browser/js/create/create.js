'use strict';
app.config(function ($stateProvider) {

	$stateProvider.state('create', {
		url: '/create', 
		controller: 'CreateController',
		templateUrl: 'js/create/create.html'
	});
});

app.controller('CreateController', function ($scope, CreateFactory) {

	$scope.communication = { msg: 'Please enter some credentials' };

	$scope.createUser = function(userData) {

		CreateFactory.createNewUser(userData).then(function (returnMsg) {
			console.log(returnMsg);
			$scope.communication.msg = returnMsg;
		}).catch(function (err) {
			console.log(err);
		});
	}
});

app.factory('CreateFactory', function ($http) {

	var createNewUser = function (userData) {

		return $http.post('/api/create/newuser', userData).then(function (response) {
			return response.data;
		});
	};

	return {
		createNewUser: createNewUser
	};

});