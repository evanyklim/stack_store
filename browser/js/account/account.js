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
		$scope.userInfo = userInfo;
	});

});

app.factory('AccountFactory', function ($http, Session) {

	var getUserInfo = function () {
		var session = {
			data: Session.user
		};
		// is a post request ideal here?
		return $http.post('/api/account/userinfo', session).then(function (response) {
			return response.data;
		});
	};

	return {
		getUserInfo: getUserInfo
	};

});

