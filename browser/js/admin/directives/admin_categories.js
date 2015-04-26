'use strict';
app.directive('adminCategories', function () {

  return {
    restrict: 'E',
    templateUrl: 'js/admin/templates/admin_categories.html',
    link: function (scope) {
      console.log(scope);
    }
  };

});