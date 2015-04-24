'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'ProductsCtrl',
        templateUrl: 'js/products/products.html'

    });

});

app.controller('ProductsCtrl', function ($scope, ProductFactory, CartFactory) {
    $scope.learnMore = false;

	ProductFactory.getShoes().then(function (shoes) {
		$scope.products = shoes;
	});

    $scope.showInfo = function() {
                $scope.learnMore = !$scope.learnMore;
            };

    $scope.addToCart = function(item){
        console.log("ADDED TO CART :", item);
        CartFactory.postCart(item).then(function(cart){
      // console.log(cart);
      // $scope.cart.items.push(cart);
      $scope.cart = cart;
        });
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
        console.log("PAYLOAD TO CART:", response.data);
        return response.data;
        });
  };

    return {
        getShoes: getShoes,
        postCart: postCart
    };

});

app.controller("PanelController", function ($scope) {
    $scope.tab = 1;

    $scope.selectedTab = function(setTab) {
        $scope.tab = setTab;
    };

    $scope.isSelected = function(checkTab) {
        return $scope.tab === checkTab;
    };

});

app.controller("ReviewController", function ($scope) {
    $scope.review = {};

    $scope.addReview = function(product) {
        product.reviews.push($scope.review);
        $scope.review = {};
    };
});