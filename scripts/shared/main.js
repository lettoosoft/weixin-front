(function () {
    'use strict';
    angular.module('app.controllers', [])
        .controller('AppCtrl', [
<<<<<<< HEAD
            '$scope', '$location', '$rootScope', 'LoginService', '$cookies', 
                function ($scope, $location, $rootScope, LoginService, $cookies) {
                    $scope.isSpecificPage = function () {
                        var path;
                        path = $location.path();
                        return _.contains(['/404', '/pages/500', '/pages/login', '/pages/signin', '/pages/signin1', '/pages/signin2', '/pages/signup', '/pages/signup1', '/pages/signup2', '/pages/forgot', '/pages/lock-screen'], path);
                    };
                    $rootScope.logout = function(){
                        LoginService.logout();
                    };  
                    return $scope.main = {
                        brand: '微信平台',
                        name: 'Name'
                    };
                }
            ])
=======
            '$scope', '$location', '$rootScope', 'LoginService', '$cookies', function ($scope, $location, $rootScope, LoginService, $cookies) {


                $scope.isSpecificPage = function () {
                    var path;
                    path = $location.path();
                    return _.contains(['/404', '/pages/500', '/pages/login', '/pages/signin', '/pages/signin1', '/pages/signin2', '/pages/signup', '/pages/signup1', '/pages/signup2', '/pages/forgot', '/pages/lock-screen'], path);
                };

                $rootScope.logout = function(){
                    LoginService.logout();
                };

                return $scope.main = {
                    brand: '微信平台',
                    name: 'Name'
                };
            }
        ])
>>>>>>> 6ac92f8fe98d3485712af201cc2701087825bd35

        .controller('LoginCtrl', [
            '$scope', 'LoginService', function ($scope, LoginService) {
                $scope.login = function (user) {
                    LoginService.login(user);
                }
            }
        ])

        .controller('singUpctrl', [
            '$scope', 'singUpService', function ($scope,singUpService){
                $scope.signup = function (user) {
                    singUpService.signUp(user);
                }
                $scope.passwordvalid = function(user) {
                    if(user){
                        if(user.password && user.confirmpassword){
                            return !(user.password == user.confirmpassword);
                        }else{
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
                $scope.confirm = function(user){
                    if (user.password != user.confirmpassword) {
                        $scope.message = "两次输入的密码不一致，请重新输入";
                    }else{
                        $scope.message = "";
                    }
                }
        }])
        .controller('resetCtrl',[
            '$scope','resetService',function ($scope,resetService){
                $scope.resets = function (user){
                    resetService.ReSet(user);
            }
        }])

        .controller('NavCtrl', [
            '$scope', 'taskStorage', 'filterFilter', function ($scope, taskStorage, filterFilter) {
                var tasks;
                tasks = $scope.tasks = taskStorage.get();
                $scope.taskRemainingCount = filterFilter(tasks, {
                    completed: false
                }).length;
                return $scope.$on('taskRemaining:changed', function (event, count) {
                    return $scope.taskRemainingCount = count;
                });
            }
        ])

        .controller('DashboardCtrl', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
            var url = $rootScope.apiHost + '/api/v1/me/';
            $http.post(url)
                .success(function (data, status, headers, config) {
                    $rootScope.user = data;
                })
                .error(function (data, status, headers, config) {
                    console.log("Error occurred.  Status:" + status);
                });
        }]);

}).call(this);
