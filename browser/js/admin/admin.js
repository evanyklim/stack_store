'use strict';
app.config(function ($stateProvider) {

	$stateProvider.state('admin', {
		url: '/admin',
		controller: 'AdminController',
		templateUrl: 'js/admin/admin.html' 
	});

	$stateProvider.state('admin.categories', {
		url: '/categories',
		templateUrl: 'js/admin/templates/admin_categories.html',
		controller: 'AdminCategoryCtrl',
		resolve: { showCategoryData: function (MenuFactory) {
			return MenuFactory.AdminGetCategoryData();
		}}
	});

	$stateProvider.state('admin.products', {
		url: '/products',
		templateUrl: 'js/admin/templates/admin_products.html',
		controller: 'AdminProductCtrl',
		resolve: { showProductData: function (MenuFactory) {
			return MenuFactory.AdminGetProductData();
				},
				   showCategoryData: function (MenuFactory) {
			return MenuFactory.AdminGetCategoryData();
				}}
	});

	$stateProvider.state('admin.orders', {
		url: '/orders',
		templateUrl: 'js/admin/templates/admin_orders.html',
		controller: 'AdminOrderCtrl',
		resolve: { showOrderData: function (MenuFactory) {
			return MenuFactory.AdminGetOrderData();
		}}
	});

	$stateProvider.state('admin.users', {
		url: '/users',
		templateUrl: 'js/admin/templates/admin_users.html',
		controller: 'AdminUserCtrl',
		resolve: { showUserData: function (MenuFactory) {
			return MenuFactory.AdminGetUserData();
		}}
	});

	// $stateProvider.state('admin.menu', {
	// 	url: '/:menuName',
	// 	templateUrl: 'js/admin/menu.html',
	// 	controller: 'MenuController'
	// });
});

app.controller('AdminController', function ($scope, $state) {

	$scope.items = { data: ['item 1', 'item 2', 'item 3'] };

	$scope.adminMenus = [
		{ label: 'Categories', menu: 'admin.categories' },
		{ label: 'Products', menu: 'admin.products' },
		{ label: 'Order History', menu: 'admin.orders' },
		{ label: 'User Admins', menu: 'admin.users' },
	];

	$scope.switchMenu = function (menu) {
		$state.go('admin.menu', { menuName: menu });
	};
});

// app.controller('MenuController', function ($scope, $stateParams, MenuFactory) {
  
//   $scope.currentMenu = $stateParams.menuName;    

// });