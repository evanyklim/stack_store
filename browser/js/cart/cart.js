'use strict';
app.config(function ($stateProvider) {

  $stateProvider.state('cart', {
    url: '/cart',
    controller: 'CartController',
    templateUrl: 'js/cart/cart.html'
  });
});

app.controller('CartController', function ($scope, CartFactory) {

	CartFactory.getCart().then(function (cart) {
    console.log("CART THAT IS SENT: ", cart)
		$scope.cart = cart;
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


  $scope.removeFromCart = function(thing){
    console.log("REACHED REMOVE FROM CART FCN", thing)
    CartFactory.removeFromCart(thing).then(function(){
      console.log("CART ITEMS AFTER DELETION OF ITEM : ", cart.items);
      $scope.cart = cart;
      location.reload();
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
  }

   var totalPrice = function(){
    return $http.get('/api/cart/items');
   }; 

   var removeFromCart = function(item){
    console.log("ANGULAR SENDING OUT DELETE", item);
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