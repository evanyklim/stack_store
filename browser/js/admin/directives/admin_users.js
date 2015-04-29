'use strict';

app.controller('AdminUserCtrl', function ($scope, MenuFactory, showUserData) {

	$scope.userData = { users: [] };
  $scope.userData.users = showUserData;
  $scope.userComms = { msg: 'Current User Administrative Rights' };

  $scope.ChangeAdmin = function (userAdminData) {
  	console.log(this);
  	userAdminData._id = this.user._id;
  	MenuFactory.AdminUpdateUserData(userAdminData)
  	.then(function (returnMsg) {
  		$scope.userComms.msg = returnMsg;
  	});
  };
});