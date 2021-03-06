'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'ProductsCtrl',
        templateUrl: 'js/products/products.html'

    });
});

app.controller('ProductsCtrl', function ($scope, ProductFactory) {
    $scope.learnMore = false;

	ProductFactory.getShoes().then(function (shoes) {
		$scope.products = shoes;
        // $scope.products.map(function(elem){
        //     elem.Reviews = [];
        // })

	});

    $scope.showInfo = function() {
                $scope.learnMore = !$scope.learnMore;
            };

});

app.factory('ProductFactory', function ($http) {

    var getShoes = function () {
            return $http.get('/api/products/shoes').then(function (response) {
            return response.data;
        });
    };


      var postCart = function(payload){
        return $http.post('/api/cart/items', payload).then(function(response){

        return response.data;
        });
  };

    return {
        getShoes: getShoes,
        postCart: postCart
    };

});

// app.factory('ReviewsFactory', function )
