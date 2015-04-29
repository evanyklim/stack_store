'use strict';

app.controller('AdminProductCtrl', function ($scope, MenuFactory, showProductData, showCategoryData) {

	$scope.productData = { items: [] };
  $scope.categoryData = { brands: [] };
	$scope.productData.items = showProductData;
  $scope.categoryData.brands = showCategoryData;
  $scope.productComms = { msg: 'Enter new product details' };

	$scope.newProduct = function (newProductData) {
		MenuFactory.AdminUpdateProductData(newProductData)
		.then(function (returnMsg) {
			$scope.productComms.msg = returnMsg;
			MenuFactory.AdminGetProductData().then(function (productData) {
				$scope.productData.items = productData;
			});
		});
	};
});