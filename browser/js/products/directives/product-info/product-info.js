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

    $scope.addReview = function(product) {
        product.reviews.push($scope.review);
        postReview(product).then(function(review) {
            console.log("this is the review!!!", review);
        });
        $scope.review = {};
    };

        var postReview = function(payload){
        console.log("HERRERERE");
        return $http.post('api/products/shoes/reviews', payload).then(function(response){
            console.log("PAYLOAD TO REVIEW:>>>", response.data);
            return response.data;
        });
     };

});

// app.factory('ProductFactory', function ($http){


// });


// var facebookLogin = function(payload){
//     return $http.post('')
// }
