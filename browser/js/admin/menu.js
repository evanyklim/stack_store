'use strict';
// consider putting into separate files
app.factory('MenuFactory', function ($http) {

	var AdminGetCategoryInfo = function () {

		return $http.get('/api/admin/categories/info').then(function (response) {
			return response.data;
		});
	};

	var AdminUpdateCategoryInfo = function (payload) {

		return $http.post('/api/admin/categories/info', payload).then(function (response) {
			return response.data;
		});
	};

	var AdminGetProductInfo = function () {

		return $http.get('/api/admin/users/info').then(function (response) {
			return response.data;
		});
	};

	var AdminUpdateProductInfo = function (payload) {

		return $http.post('/api/admin/users/info', payload).then(function (response) {
			return response.data;
		});
	};

	var AdminGetOrderInfo = function () {

		return $http.get('/api/admin/users/info').then(function (response) {
			return response.data;
		});
	};

	var AdminUpdateOrderInfo = function (payload) {

		return $http.post('/api/admin/users/info', payload).then(function (response) {
			return response.data;
		});
	};

	var AdminGetUserInfo = function () {

		return $http.get('/api/admin/users/info').then(function (response) {
			return response.data;
		});
	};

	var AdminUpdateUserInfo = function (payload) {

		return $http.post('/api/admin/users/info', payload).then(function (response) {
			return response.data;
		});
	};

	return {
		AdminGetCategoryInfo: AdminGetCategoryInfo,
		AdminUpdateCategoryInfo: AdminUpdateCategoryInfo,
		AdminGetProductInfo: AdminGetProductInfo,
		AdminUpdateProductInfo: AdminUpdateProductInfo,
		AdminGetOrderInfo: AdminGetOrderInfo,
		AdminUpdateOrderInfo: AdminUpdateOrderInfo,
		AdminGetUserInfo: AdminGetUserInfo,
		AdminUpdateUserInfo: AdminUpdateUserInfo
	};
});