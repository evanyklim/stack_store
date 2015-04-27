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

	$scope.createUser = function(newUserData) {
		CreateFactory.createNewUser(newUserData).then(function (returnMsg) {
			$scope.communication.msg = returnMsg;
		}).catch(function (err) {
			console.log(err);
		});
	};
});

app.factory('CreateFactory', function ($http) {

	var createNewUser = function (newUserData) {
		return $http.post('/api/create/newuser', newUserData).then(function (response) {
			return response.data;
		});
	};

	return {
		createNewUser: createNewUser
	};

});