'use strict';
app.directive('productInfo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/products/directives/product-info/product-info.html',
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

app.controller("ReviewController", function ($scope, $http) { //reviews
    $scope.review = {};
    //$scope.review.user.nickname;

    $scope.addReview = function(product) {
        $scope.review.user = "";
        $scope.review.date = "";    


        product.reviews.push($scope.review);
        postReview(product);
        $scope.review = {};
    };

    var postReview = function(shoe){

        var product = shoe;

    return $http.post('api/products/shoes/reviews', product)
        .then(function (response){
            return response.data; })
                .then(function (productData) {
                    //console.log("response", response);
                    console.log("product", productData);
                    var productReview = product.reviews[product.reviews.length-1];
                    var user = productData.reviews[productData.reviews.length-1].user;
                    console.log("user", user);
                    
                    if(user) { productReview.user = user; }
                    else { productReview.user = { nickname: "Guest" }; }

                    productReview.date = productData.reviews[productData.reviews.length-1].date; 
                    return productData;
                });
    };

});

// app.factory('ProductFactory', function ($http){


// });


// var facebookLogin = function(payload){
//     return $http.post('')
// }
