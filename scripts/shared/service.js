'use strict';

angular.module('app.services', [])
    .factory('resetService', function ($rootScope,$http,authService){
        var service = {
            ReSet:  function(user){
                        var url = $rootScope.apiHost + '/api/v1/user/password/reset/';
                        $http.post(url,user).success(function (data){
                            console.log(data);
                        }).error(function (data){
                            console.log(data);
                        })
                    },
            change:function(password){
                        var url = $rootScope.apiHost + '/api/v1/user/password/change/';
                        $http.post(url,password).success(function (data){
                            
                        }).error(function (data){
                            $rootScope.message2 = "原密码输入错误！请重新输入！";                         
                        })
            }
        }
        return service;
    })
    .factory('LoginService', function ( $rootScope, $http, authService, $cookies, $location, redirectToUrlAfterLogin) {
        var service = {
            login: function (signin) {
                var url = $rootScope.apiHost + '/api/v1/user/login/';
                $http.post(url, signin, { ignoreAuthModule: true })
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
                            $rootScope.message = "";
                            return config;
                        });
                    })
                    .error(function (data, status, headers, config) {
                        $rootScope.$broadcast('event:auth-login-failed', status);
                        $rootScope.message = data.error;
                    });
            },
            logout: function () {
                        delete $http.defaults.headers.common.Authorization;
                        $rootScope.$broadcast('event:auth-logout-complete');
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
            },
            get_currentuser: function () {
                var url = $rootScope.apiHost + '/api/v1/me/';
                $http.post(url)
                    .success(function (data, status, headers, config) {
                        $rootScope.user = data;
                    })
                    .error(function (data, status, headers, config) {
                        console.log("Error occurred.  Status:" + status);
                    });
            }
        };
        return service;

    })
    .factory('singUpService', function ($http, $rootScope, $location, authService, $cookies, redirectToUrlAfterLogin) {
        var service = {
            signUp: function (signup) {
                var url = $rootScope.apiHost + '/api/v1/createuser/';
                return $http.post(url, signup)
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
                        console.log(data);
                    });
            }
        };
        return service;
    })
    .factory('UpdateUser', ['$http','$rootScope',function ($http,$rootScope) {
        var service = {
            Update: function(profile){
                var url ='http://121.40.126.220/api/v1/user/'+$rootScope.user.id+'/';
                return $http.put(url,profile).success(function (data) {
            //IMPORTANT: You need to activate always_return_data in your ressource (see example)
                    $rootScope.user=data;

                    console.log("success");
                    console.log(data);
                }).error(function (data) {
                    console.log(data);
                    console.log("fail");
                });
            }
        };
        return service;
    }])
    .factory('weixin', ['$http','$rootScope',function ($http,$rootScope) {
        var service = {
            select:function(){
                var data=[
                    {'id':1,'name':'乐土软件','wid':'common'},
                    {'id':2,'name':'开发者联盟','wid':'hfutlod'},
                    {'id':3,'name':'吃货口袋','wid':'mileechkd'}
                ];
                return data;
            },
            add:function(json,addItem){
                var arr  = {'id':3,'name':'吃货口袋','wid':'mileechkd'};
                json.push(addItem);
                return json;
            }
        };
        return service;
    }]);
