'use strict';
// consider putting these into separate files
app.factory('MenuFactory', function ($http) {

	var AdminGetCategoryData = function () {

		return $http.get('/api/admin/categories/data').then(function (response) {
			return response.data;
		});
	};

	var AdminUpdateCategoryData = function (payload) {

		return $http.post('/api/admin/categories/data', payload).then(function (response) {
			return response.data;
		});
	};

	var AdminGetProductData = function () {

		return $http.get('/api/admin/products/data').then(function (response) {
			return response.data;
		});
	};

	var AdminUpdateProductData = function (payload) {

		return $http.post('/api/admin/products/data', payload).then(function (response) {
			return response.data;
		});
	};

	var AdminGetOrderData = function () {

		return $http.get('/api/admin/orders/data').then(function (response) {
			return response.data;
		});
	};

	var AdminUpdateOrderData = function (payload) {

		return $http.post('/api/admin/orders/data', payload).then(function (response) {
			return response.data;
		});
	};

	var AdminGetUserData = function () {

		return $http.get('/api/admin/users/data').then(function (response) {
			return response.data;
		});
	};

	var AdminUpdateUserData = function (payload) {

		return $http.post('/api/admin/users/data', payload).then(function (response) {
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