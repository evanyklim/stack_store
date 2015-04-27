app.config(function ($stateProvider) {

    $stateProvider.state('checkout', {
        url: '/checkout',
        templateUrl: 'js/checkout/checkout.html',
        controller: 'CheckoutCtrl'
    });

});

app.controller('CheckoutCtrl', function ($scope, CheckoutFactory) {

    CheckoutFactory.getCart().then(function (cart) {
        $scope.cart = cart;
    });


    $scope.postPrice = function(price){
              CheckoutFactory.sendTotal(item).then(function(cart){});
    };
});

app.factory('CheckoutFactory', function ($http) {

  var getCart = function () {
    return $http.get('/api/cart/').then(function (response) {
        return response.data;
    });
  };

   var totalPrice = function(){
    return $http.get('/api/cart/items');
   }; 

  var postPrice = function(price){
    return $http.post('/api/checkout', price).then(function(response){

    return response.data;
    });
  };



  return {
    getCart: getCart,
    postPrice: postPrice
  };

});