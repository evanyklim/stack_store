'use strict';
app.factory('MenuFactory', function ($http) {

	var AdminGetUserInfo = function () {

		return $http.get('/api/admin/users/info').then(function (response) {
			return response.data;
		});
	};

	var AdminUpdateUserInfo = function (payload) {

		return $http.post('/api/admin/users/info', payload).then(function (response) {
			return response.data;
		});
	}

	return {
		AdminGetUserInfo: AdminGetUserInfo,
		AdminUpdateUserInfo: AdminUpdateUserInfo
	};

});