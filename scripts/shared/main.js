(function () {
    'use strict';
    angular.module('app.controllers', [])
        .controller('AppCtrl', [
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

        .controller('LoginCtrl', [
            '$scope', 'LoginService', function ($scope, LoginService) {
                $scope.login = function (signin) {
                    LoginService.login(signin);
                }
            }
        ])

        .controller('singUpctrl', [
            '$scope', 'singUpService', function ($scope,singUpService){
                $scope.signup = function (signup) {
                    singUpService.signUp(signup);
                }
                $scope.passwordvalid = function(signup) {
                    if(signup){
                        if(signup.password && signup.confirmpassword){
                            return !(signup.password == signup.confirmpassword);
                        }else{
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
                $scope.confirm = function(user){
                    if (user.password != user.confirmpassword) {
                        $scope.message2 = true;
                    }else{
                        $scope.message2 = false;
                    }
                }
        }])
        .controller('resetCtrl',[
            '$scope','resetService',function ($scope,resetService){
                $scope.resets = function (user){
                    $scope.tips = "邮件已经发送，请按邮件中提示内容找回密码！";
                    resetService.ReSet(user);
                    $scope.band = true;
                }                
        }])
        .controller('ChangePassword',[
            '$scope','resetService','LoginService',function ($scope,resetService,LoginService){
                $scope.changePassword = function (password){
                    resetService.change(password);
                    LoginService.logout();
                }
                $scope.confirmPassword =function(password){
                    if (password.password1 != password.password2) {
                        $scope.message2 = "两次输入的密码不一致，请重新输入";
                    }else{
                        $scope.message2 = "";
                    }
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
