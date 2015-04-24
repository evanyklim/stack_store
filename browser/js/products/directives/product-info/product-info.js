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

app.controller("ReviewController", function ($scope) {
    $scope.review = {};

    $scope.addReview = function(product) {
        product.Reviews.push($scope.review);
        $scope.review = {};
    };
});