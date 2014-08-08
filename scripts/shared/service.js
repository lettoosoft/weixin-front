'use strict';

angular.module('app.services', [])
    .factory('LoginService', function ($rootScope, $http, authService) {
        var service = {
            login: function (user) {
                var url = $rootScope.apiHost + '/api/v1/user/login/';
                $http.post(url, user, { ignoreAuthModule: true })
                    .success(function (data, status, headers, config) {
                        $rootScope.user = data;
                        var auth = 'ApiKey ' + data.username + ':' + data.apikey;
                        $http.defaults.headers.common.Authorization = auth;  // Step 1

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
                    });
            }
        };
        return service;
    });