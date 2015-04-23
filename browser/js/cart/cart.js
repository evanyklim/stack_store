'use strict';
app.config(function ($stateProvider) {

  $stateProvider.state('cart', {
    url: '/cart',
    controller: 'CartController',
    templateUrl: 'js/cart/cart.html'
  });
});

app.controller('CartController', function ($scope, CartFactory) {

	// CartFactory.getCart().then(function (cart) {
	// 	$scope.cart = cart;
	// });
  $scope.cart = "this is your cart :)";

  $scope.post = function(payload){
    CartFactory.postCart(payload).then(function(cart){
      console.log(cart);
      // $scope.cart.items.push(cart);
      $scope.cart = cart;
    });
  };
});

app.factory('CartFactory', function ($http) {

  var getCart = function () {
    return $http.get('/api/cart/CartItems').then(function (response) {
        console.log(response.data);
        return response.data;
    });
  };

  var postCart = function(payload){
    return $http.post('/api/cart/CartItems', payload).then(function(response){
      console.log(response.data);
      return response.data;
    });
  };

  return {
    getCart: getCart,
    postCart: postCart
  };

});