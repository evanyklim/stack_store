'use strict';
app.directive('adminProducts', function () {

  return {
    restrict: 'E',
    templateUrl: 'js/admin/templates/admin_products.html',
    controller: 'AdminProductCtrl'
  };

});

app.controller('AdminProductCtrl', function ($scope, MenuFactory) {

	$scope.productData = { items: [] };
  $scope.productComms = { msg: 'Enter new product details' };

	MenuFactory.AdminGetProductData().then(function (productData) {
		$scope.productData.items = productData;
	});

	$scope.newProduct = function (newProductData) {
		MenuFactory.AdminUpdateProductData(newProductData)
		.then(function (returnMsg) {
			$scope.productComms.msg = returnMsg;
			MenuFactory.AdminGetProductData().then(function (productData) {
				$scope.productdata.items = productData;
			});
		});
	};
});