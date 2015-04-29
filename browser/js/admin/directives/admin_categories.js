'use strict';

app.controller('AdminCategoryCtrl', function ($scope, MenuFactory, showCategoryData) {

	$scope.categoryData = { brands: [] };
  $scope.categoryData.brands = showCategoryData;
  $scope.categoryComms = { msg: 'Enter a new category' };

	$scope.newCategory = function (newCategoryData) {
		MenuFactory.AdminUpdateCategoryData(newCategoryData)
		.then(function (returnMsg) {
			$scope.categoryComms.msg = returnMsg;
			MenuFactory.AdminGetCategoryData().then(function (categoryData) {
				$scope.categoryData.brands = categoryData;
			});	
		});
	};
});