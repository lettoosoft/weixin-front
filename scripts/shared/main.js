(function () {
    'use strict';
    angular.module('app.controllers', ['app.services'])
        .controller('AppCtrl', [
            '$scope', '$location', function ($scope, $location) {
                $scope.isSpecificPage = function () {
                    var path;
                    path = $location.path();
                    return _.contains(['/404', '/pages/500', '/pages/login', '/pages/signin', '/pages/signin1', '/pages/signin2', '/pages/signup', '/pages/signup1', '/pages/signup2', '/pages/forgot', '/pages/lock-screen'], path);
                };
                return $scope.main = {
                    brand: '微信平台',
                    name: 'Lisa Doe'
                };


            }
        ])

        .controller('LoginCtrl', [
            '$scope', 'LoginService',  function ($scope, LoginService) {
                $scope.login = function (user) {
                    LoginService.login(user);
                }
            }
        ])

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
            $rootScope.apiHost = 'http://121.40.126.220';
            $rootScope.user = null;

            var url = $rootScope.apiHost + '/api/v1/me/';
            $http.post(url)
                .success(function (data, status, headers, config) {
                    $rootScope.user = data;
                })
                .error(function (data, status, headers, config) {
                    console.log("Error occurred.  Status:" + status);
                });

            $rootScope.$on('event:auth-loginRequired', function (e, rejection) {
                /*delete $cookies.is_login;
                 delete $cookies.authorization;
                 AuthenticationService.saveAttemptUrl();
                 $location.path('/access/signin');
                 //$state.go('access.signin', {}, {reload: true, inherit: false});*/
                console.log('login required');
                $location.path('/pages/signin');
            });

            $rootScope.$on('event:auth-loginConfirmed', function () {
                console.log("loginConfirmed");
                $location.path('/dashboard');
                //AuthenticationService.redirectToAttemptedUrl();
                //$state.go('app.dashboard', {}, {reload: true, inherit: false});
            });

            $rootScope.$on('event:auth-logout-complete', function () {
                //delete $cookies.is_login;
                //delete $cookies.authorization;
                //$location.path('/access/signin');
            });

        }]);

}).call(this);

//# sourceMappingURL=main.js.map
