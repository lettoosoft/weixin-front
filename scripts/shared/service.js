'use strict';

angular.module('app.services', [])
    .factory('resetService', function ($rootScope,$http,authService){
        var service = {
            ReSet:  function(check,$scope){
                        var url = $rootScope.apiHost + '/api/v1/user/password/reset/';
                        $http.post(url,check).success(function (data){
                            $scope.send = true;
                            $scope.sendError = false;
                        }).error(function (data){
                            $scope.disabled = false;
                            $scope.sendError = true;
                            console.log(data);
                        })
                    },
            change: function(check,$scope){
                        var url = $rootScope.apiHost + '/api/v1/user/password/change/';
                        $http.post(url,check)
                        .success(function (data){
                            $scope.disabled = true;
                            //修改密码成功之后
                            //调用controller里面的logout方法
                            $scope.logout();
                        })
                        .error(function (data){
                            $scope.disabled = false;
                            $scope.error = "原密码输入错误！请重新输入！";               
                        })
            }
        }
        console.log(service);
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
                            
                            return config;
                        });
                        $rootScope.message = "";
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
    .factory('signUpService', function ($http, $rootScope, $location, authService, $cookies, redirectToUrlAfterLogin) {
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
    .factory('RegEpxService', [ function () {
        var service = {
            explain: function($scope){
                $scope.info = true;
            },
            explainDisappear:function($scope){
                var re = /[a-zA-Z0-9_]+/g;
                    if (re.test($scope.check.password)) {
                        $scope.danger1 = false;
                        $scope.disabled = false;

                    }else{
                        $scope.danger1 = true;
                        $scope.disabled = true;
                    }
                    $scope.info = false;

            }
        };
        return service;
    }])
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
            select:function(scope){
                /*var data=[
                    {'id':1,'title':'乐土软件','weixin_id':'common'},
                    {'id':2,'title':'开发者联盟','weixin_id':'hfutlod'},
                    {'id':3,'title':'吃货口袋','weixin_id':'mileechkd'}
                ];*/
                var url = $rootScope.apiHost +  '/api/v1/publicaccount/';
                $http.get(url).success(function(data){
                    scope.weixin = data.objects;
                    scope.weixin_num = data.objects.length;
                });
                //return data;
            },
            add:function(json,addItem){
                //var arr  = {'id':3,'name':'吃货口袋','wid':'mileechkd'};
                var url = $rootScope.apiHost + '/api/v1/publicaccount/';
                $http.post(url,addItem).success(function(data){
                   console.log(data);
                });
                json.push(addItem);
                return json;
            }
        };
        return service;
    }]);
