'use strict';
app.config(function ($stateProvider) {

	$stateProvider.state('account', {
		url: '/account', 
		controller: 'AccountController',
		templateUrl: 'js/account/account.html'
	});
});

app.controller('AccountController', function ($scope, AccountFactory) {

	$scope.accountComms = { msg: '' };

	AccountFactory.getUserInfo().then(function (userInfo) {
		$scope.userInfo = userInfo;
	});

	$scope.updateUser = function (userInfo) {
		AccountFactory.updateUserInfo(userInfo).then(function (returnMsg) {
			$scope.accountComms.msg = returnMsg;
		}).catch(function (err) {
			console.log(err);
		});
	};
});

app.factory('AccountFactory', function ($http) {

	var getUserInfo = function () {
		return $http.get('/api/account/userinfo').then(function (response) {
			return response.data;
		});
	};

	var updateUserInfo = function (payload) {
		return $http.post('/api/account/userinfo', payload).then(function (response) {
			return response.data;
		});
	};

	return {
		getUserInfo: getUserInfo,
		updateUserInfo: updateUserInfo
	};

});

