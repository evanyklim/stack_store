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
	});

    $scope.showInfo = function() {
                $scope.learnMore = !$scope.learnMore;
            }
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