'use strict';
app.config(function ($stateProvider) {

	$stateProvider.state('admin', {
		url: '/admin',
		controller: 'AdminController',
		templateUrl: 'js/admin/admin.html'
	});

	$stateProvider.state('admin.categories', {
		
	});
});

app.controller('AdminController', function ($scope) {

	$scope.items = { data: ['item 1', 'item 2', 'item 3'] }

});