'use strict';
app.directive('adminCategories', function () {

  return {
    restrict: 'E',
    templateUrl: 'js/admin/templates/admin_categories.html',
    controller: 'AdminCategoryCtrl'
  };

});

app.controller('AdminCategoryCtrl', function ($scope, MenuFactory) {

	$scope.categoryData = { brands: [] };
  $scope.categoryComms = { msg: 'Enter a new category' };

	MenuFactory.AdminGetCategoryData().then(function (categoryData) {
		$scope.categoryData.brands = categoryData;
	});

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