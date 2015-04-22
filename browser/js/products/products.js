'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'ProductsController',
        templateUrl: 'js/products/products.html'
    });

});

app.controller('ProductsController', function ($scope, ProductFactory) {

	ProductFactory.getShoes().then(function (shoes) {
		$scope.shoes = shoes
	});

});

app.factory('ProductFactory', function ($http) {

    var getShoes = function () {
        return $http.get('/api/products/shoes').then(function (response) {
            return response.data;
        });
    };

    return {
        getShoes: getShoes
    };

});