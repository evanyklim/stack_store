'use strict';
app.config(function ($stateProvider) {

  $stateProvider.state('cart', {
    url: '/cart',
    controller: 'CartController',
    templateUrl: 'js/cart/cart.html'
  });
});

app.controller('CartController', function ($scope, CartFactory) {

  $scope.itemsCounter = '';

	CartFactory.getCart().then(function (cart) {
		$scope.cart = cart;
    $scope.itemsCounter = cart.items.length;
	});

  $scope.post = function(item){
    // post request will only work with JSON payload
    var payload = { items: item };
    CartFactory.postCart(payload).then(function(cart){
      // console.log(cart);
      // $scope.cart.items.push(cart);
      $scope.cart = cart;
    });
  };
  
  $scope.addToCart = function(item){
      CartFactory.postCart(item).then(function(cart){
        // console.log(cart);
        // $scope.cart.items.push(cart);
          $scope.cart = cart;
              $scope.itemsCounter = $scope.itemsCounter + 1;

      });
  };

  $scope.removeFromCart = function(thing){
    CartFactory.removeFromCart(thing).then(function(){
      $scope.cart = cart;
      location.reload(); //need to use sockets to update in real-time on deletion, for later
    });
  };

});




app.factory('CartFactory', function ($http) {

  var getCart = function () {
    return $http.get('/api/cart/').then(function (response) {
        return response.data;
    });
  };

  var postCart = function(payload){
    return $http.post('/api/cart/items', payload).then(function(response){
      return response.data;
    });
  };

   var totalPrice = function(){
    return $http.get('/api/cart/items');
   }; 

   var removeFromCart = function(item){
      return $http.delete('api/cart/items/' + item._id).then(function(response){
        return response.data;
      });
   };


  return {
    getCart: getCart,
    postCart: postCart,
    removeFromCart: removeFromCart
  };

});