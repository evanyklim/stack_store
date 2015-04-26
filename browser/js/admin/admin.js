'use strict';
app.config(function ($stateProvider) {

	$stateProvider.state('admin', {
		url: '/admin',
		controller: 'AdminController',
		templateUrl: 'js/admin/admin.html' 
	});

	$stateProvider.state('admin.menu', {
		url: '/:menuName',
		templateUrl: 'js/admin/menu.html',
		controller: 'MenuController'
	});
});

app.controller('AdminController', function ($scope, $state) {

	$scope.items = { data: ['item 1', 'item 2', 'item 3'] };

	$scope.adminMenus = [
		{ label: 'Categories', menu: 'categories' },
		{ label: 'Products', menu: 'products' },
		{ label: 'Order History', menu: 'orders' },
		{ label: 'User Admins', menu: 'users' },
	];

	$scope.switchMenu = function (menu) {
		$state.go('admin.menu', { menuName: menu });
	};
});

app.controller('MenuController', function ($scope, $stateParams, MenuFactory) {
	$scope.currentMenu = $stateParams.menuName;

	// MenuFactory.AdminGetUserInfo().then(function (userInfo) {
	// 		console.log('users: ', userInfo); 
	// 		$scope.userInfo = userInfo;
	// });       

	MenuFactory.AdminGetCategoryInfo().then(function (categoryInfo) {
			console.log('categories: ', categoryInfo); 
			$scope.userInfo = userInfo;
	});     

	
});