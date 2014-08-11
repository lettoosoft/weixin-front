'use strict';

angular.module('app.services', [])
    .factory('LoginService', function ( $rootScope, $http, authService, $cookies, $location, redirectToUrlAfterLogin) {
        var service = {
            login: function (user) {
                var url = $rootScope.apiHost + '/api/v1/user/login/';
                $http.post(url, user, { ignoreAuthModule: true })
                    .success(function (data, status, headers, config) {
                        $rootScope.user = data;
                        var auth = 'ApiKey ' + data.username + ':' + data.apikey;
                        $http.defaults.headers.common.Authorization = auth;  // Step 1

                        // Save auth apikey in cookie
                        $cookies.is_login = true;
                        $cookies.authorization = auth;

                        // Need to inform the http-auth-interceptor that
                        // the user has logged in successfully.  To do this, we pass in a function that
                        // will configure the request headers with the authorization token so
                        // previously failed requests(aka with status == 401) will be resent with the
                        // authorization token placed in the header
                        authService.loginConfirmed(data, function (config) {  // Step 2 & 3
                            config.headers.Authorization = auth;
                            return config;
                        });
                    })
                    .error(function (data, status, headers, config) {
                        $rootScope.$broadcast('event:auth-login-failed', status);
                        $rootScope.message = data.error;
                    });
            },
            logout: function (user) {
                var url = $rootScope.apiHost + '/v1/user/logout/';
                $http.post(url, {}, { ignoreAuthModule: true })
                    .finally(function (data) {
                        delete $http.defaults.headers.common.Authorization;
                        $rootScope.$broadcast('event:auth-logout-complete');
                    });
            },
            loginCancelled: function () {
                authService.loginCancelled();
            },
            isLoggedIn: function () {
                if ($cookies.is_login) {
                    $http.defaults.headers.common.Authorization = $cookies.authorization;
                    return true;
                }
                return false;
            },
            saveAttemptUrl: function () {
                if ($location.path().toLowerCase() != '/pages/signin') {
                    redirectToUrlAfterLogin.url = $location.path();
                }
                else
                    redirectToUrlAfterLogin.url = '/dashboard';
            },
            redirectToAttemptedUrl: function () {
                $location.path(redirectToUrlAfterLogin.url);
            }
        };
        return service;

    })
    .factory('singUpService',function ($http,$rootScope,$location,authService,$cookies,redirectToUrlAfterLogin){
        var service = {
            signUp: function(user){
                var url = $rootScope.apiHost+'/api/v1/createuser/';
                return $http.post(url,user)
                    .success(function (data, status, headers, config) {
                        $rootScope.user = data;
                        var auth = 'ApiKey ' + data.username + ':' + data.apikey;
                        $http.defaults.headers.common.Authorization = auth;  // Step 1

                        // Save auth apikey in cookie
                        $cookies.is_login = true;
                        $cookies.authorization = auth;

                        // Need to inform the http-auth-interceptor that
                        // the user has logged in successfully.  To do this, we pass in a function that
                        // will configure the request headers with the authorization token so
                        // previously failed requests(aka with status == 401) will be resent with the
                        // authorization token placed in the header
                        authService.loginConfirmed(data, function (config) {  // Step 2 & 3
                            config.headers.Authorization = auth;
                            return config;
                        });
                    })
                    .error(function (data) {
                    });
                },
            };
        return service;
    })
    .factory('UpdateUser', ['$http', function ($http) {
        var service = {
            Update: function(user){
                var url ='http://121.40.126.220/api/v1/user/1';
                return $http.put(url,user).success(function (data) {
            //IMPORTANT: You need to activate always_return_data in your ressource (see example)
                    console.log("success");
                    console.log(data);
                    }).error(function (data) {
                    console.log(data);
                    console.log("fail");
                    });
                },
            };
        return service;
}]);
