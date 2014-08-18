(function() {
  'use strict';
  angular.module('app.page.ctrls', []).controller('invoiceCtrl', [
    '$scope', '$window', function($scope, $window) {
      return $scope.printInvoice = function() {
        var originalContents, popupWin, printContents;
        printContents = document.getElementById('invoice').innerHTML;
        originalContents = document.body.innerHTML;
        popupWin = window.open();
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + '</html>');
        return popupWin.document.close();
      };
    }
    
  ]);
  angular.module('app.page.ctrls', []).controller('profileCtrl',[ '$scope','UpdateUser','weixin','$rootScope',function($scope,UpdateUser,weixin,$rootScope){
    $scope.message="123";
    $scope.edit=0;
    $scope.tab=0;
    $scope.way=1;
    $scope.weixin=weixin.select();
    $scope.add=function(addItem){
      $scope.weixin=weixin.add($scope.weixin,addItem);
    }
    $scope.Update=function(profile){
      UpdateUser.Update(profile,$scope);
    }
    $scope.cTab=function(n){
      $scope.tab=n;
    }
  }]);
}).call(this);

//# sourceMappingURL=PageCtrl.js.map

