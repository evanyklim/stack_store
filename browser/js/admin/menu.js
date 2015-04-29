'use strict';
// consider putting these into separate files
app.factory('MenuFactory', function ($http) {

	var AdminGetCategoryData = function () {

		return $http.get('/api/admin/categories').then(function (response) {
			return response.data;
		});
	};

	var AdminUpdateCategoryData = function (payload) {

		return $http.post('/api/admin/categories', payload).then(function (response) {
			return response.data;
		});
	};

	var AdminGetProductData = function () {

		return $http.get('/api/admin/products').then(function (response) {
			return response.data;
		});
	};

	var AdminUpdateProductData = function (payload) {

		return $http.post('/api/admin/products', payload).then(function (response) {
			return response.data;
		});
	};

	var AdminGetOrderData = function () {

		return $http.get('/api/admin/orders').then(function (response) {
			return response.data;
		});
	};

	var AdminUpdateOrderData = function (payload) {

		return $http.post('/api/admin/orders', payload).then(function (response) {
			return response.data;
		});
	};

	var AdminGetUserData = function () {

		return $http.get('/api/admin/users').then(function (response) {
			return response.data;
		});
	};

	var AdminUpdateUserData = function (payload) {

		return $http.post('/api/admin/users', payload).then(function (response) {
			return response.data;
		});
	};

	return {
		AdminGetCategoryData: AdminGetCategoryData,
		AdminUpdateCategoryData: AdminUpdateCategoryData,
		AdminGetProductData: AdminGetProductData,
		AdminUpdateProductData: AdminUpdateProductData,
		AdminGetOrderData: AdminGetOrderData,
		AdminUpdateOrderData: AdminUpdateOrderData,
		AdminGetUserData: AdminGetUserData,
		AdminUpdateUserData: AdminUpdateUserData
	};
});