'use strict';
app.config(function ($stateProvider) {

	$stateProvider.state('signup', {
		url: '/signup', 
		controller: 'SignupController',
		templateUrl: 'js/signup/signup.html'
	});
});

app.controller('SignupController', function ($scope, SignupFactory, $http) {

	$scope.communication = { msg: 'Please enter some credentials' };

	$scope.signupUser = function(newUserData) {
		SignupFactory.signupNewUser(newUserData).then(function (returnMsg) {
			$scope.communication.msg = returnMsg;
		}).catch(function (err) {
			console.log(err);
		});
	}	

	$scope.fbLogin = function () {
		return $http.get('auth/facebook').then(function (response) {
			console.log("HERERE", response);
			//return response.data;
		});
	};
});

app.factory('SignupFactory', function ($http) {

	var signupNewUser = function (newUserData) {
		return $http.post('/api/signup', newUserData).then(function (response) {
			return response.data;
		});
	};

	return {
		signupNewUser: signupNewUser
	};
});

