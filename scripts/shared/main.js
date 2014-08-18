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

                $rootScope.logout = function () {
                    LoginService.logout();
                };

                return $scope.main = {
                    brand: 'Lettoo微信平台',
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
        .controller('ChangePassword', [
            '$scope', '$rootScope', 'RegEpxService', 'resetService', 'LoginService', function ($scope, $rootScope, RegEpxService, resetService, LoginService) {
                $scope.changePassword = function (check) {
                    $scope.disabled = true;
                    resetService.change(check, $scope);

                };

                $scope.logout = function () {
                    LoginService.logout();
                };
                $scope.explain = function () {
                    RegEpxService.explain($scope);
                };
                $scope.explainDisappear = function () {
                    RegEpxService.explainDisappear($scope);
                };
                $scope.confirmPassword = function (check) {

                    if (check) {
                        if (check.password1 && check.password2) {
                            if (check.password1 == check.password2) {
                                $scope.danger2 = false;

                                return false;
                            } else {
                                $scope.danger2 = true;
                                return true;
                            }
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                }
            }])
        .controller('singUpctrl', [
            '$scope', 'signUpService', 'RegEpxService', function ($scope, signUpService, RegEpxService) {
                $scope.signup = function (signup) {
                    signUpService.signUp(signup);
                };
                $scope.explain = function () {
                    RegEpxService.explain($scope);
                };
                $scope.explainDisappear = function () {
                    RegEpxService.explainDisappear($scope);
                };
                $scope.passwordvalid = function (signup) {
                    if (signup) {
                        if (signup.password && $scope.confirmpassword) {
                            return !(signup.password == $scope.confirmpassword);
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                };
                $scope.confirm = function (signup) {
                    if (signup.password != $scope.confirmpassword) {
                        $scope.danger2 = true;
                    } else {
                        $scope.danger2 = false;
                    }
                }
            }])
        .controller('resetCtrl', [
            '$scope', 'resetService', function ($scope, resetService) {
                $scope.resets = function (user) {
                    $scope.disabled = true;
                    resetService.ReSet(user, $scope);
                    $scope.band = true;
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
