

//var app = angular.module('Product', []);

app.config(function ($stateProvider) {

	$stateProvider.state('product', {
		url: '/product',
		templateUrl: 'js/product/product.html',
		controller: 'ProductCtrl'

	});

});

app.controller("ProductCtrl", function ($scope){
	$scope.product = shoes[0];

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

	var shoes = [{
		name: 'Nike Air Jordan XI "45" Sample',
		image: "http://images.complex.com/complex/image/upload/t_article_image/xzw3tp7k39lld4h2eu23.jpg",
		description: 'Michael Jordan wore this sneakers in the early 1990s. Of all the samples of Air Jordans, the "45" XIs remain the most coveted' ,
		category: "Jordans",
		price: 500.00,
		Reviews: ""
	}];






/////////

