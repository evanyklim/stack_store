'use strict';
app.directive('adminUsers', function () {

  return {
    restrict: 'E',
    templateUrl: 'js/admin/templates/admin_users.html',
    controller: 'AdminUserCtrl'
  };
});

app.controller('AdminUserCtrl', function ($scope, MenuFactory) {

	$scope.userData = { users: [] };
  $scope.userComms = { msg: 'Current User Administrative Rights' };

  MenuFactory.AdminGetUserData().then(function (userData) {
  	$scope.userData.users = userData;
  });

  $scope.ChangeAdmin = function (userAdminData) {
  	MenuFactory.AdminUpdateUserData(userAdminData)
  	.then(function (returnMsg) {
  		$scope.userComms.msg = returnMsg;
  	});
  };
});