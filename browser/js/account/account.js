'use strict';
app.config(function ($stateProvider) {

	$stateProvider.state('account', {
		url: '/account', 
		controller: 'AccountController',
		templateUrl: 'js/account/account.html'
	});
});

app.controller('AccountController', function ($scope, AccountFactory) {

	AccountFactory.getUserInfo().then(function (userInfo) {
		console.log(userInfo);
		$scope.userInfo = userInfo;
	});

});

app.factory('AccountFactory', function ($http) {

	var getUserInfo = function () {

		return $http.get('/api/account/userinfo').then(function (response) {
			return response.data;
		});
	};

	return {
		getUserInfo: getUserInfo
	};

});

