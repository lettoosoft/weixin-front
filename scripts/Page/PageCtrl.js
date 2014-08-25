
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
    
  ]).controller('profileCtrl',[ '$scope','UpdateUser','weixin','$rootScope',
        function ($scope,UpdateUser,weixin,$rootScope){
          $scope.message="123";
          $scope.edit=0;
          $scope.tab=0;
          $scope.way=1;
          $scope.addedApp=$rootScope.addedApp;
          weixin.select($scope);
          $scope.addNewUser = function (newUser){
            console.log(newUser);
            weixin.autoAdd(newUser,$scope);
    }
    // 添加微信公众号
    $scope.add=function(addItem){
      if($scope.weixin_num>=3){
         alert("普通用户最多只能添加三个微信号！");
         return;
      }       
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

