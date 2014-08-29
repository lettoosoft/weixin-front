(function () {
    'use strict';
    var isOnGitHub = window.location.hostname === 'blueimp.github.io',
        url = isOnGitHub ? '//jquery-file-upload.appspot.com/' : 'http://121.40.126.220/api/v1/user/avatarupload/';      
    angular.module('app.controllers', ['blueimp.fileupload']) 
        .config([
            '$httpProvider', 'fileUploadProvider',
            function ($httpProvider, fileUploadProvider) {
                delete $httpProvider.defaults.headers.common['X-Requested-With'];
                fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                );
                if (isOnGitHub) {
                    // Demo settings:
                    angular.extend(fileUploadProvider.defaults, {
                        // Enable image resizing, except for Android and Opera,
                        // which actually support image resizing, but fail to
                        // send Blob objects via XHR requests:
                        disableImageResize: /Android(?!.*Chrome)|Opera/
                            .test(window.navigator.userAgent),
                        maxFileSize: 5000000,
                        previewMaxWidth: 300,
                        previewMaxHeight: 280,                        
                        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
                    });
                }
            }
        ])


        .controller('AppCtrl', [
            '$scope', '$location', '$rootScope', 'LoginService', '$cookies', function ($scope, $location, $rootScope, LoginService, $cookies) {


                $scope.isSpecificPage = function () {
                    var path;
                    path = $location.path();
                    if ($.trim(path)=='/'){
                        return true;
                    }else{
                        return _.contains(['/404','/pages/500', '/pages/login', '/pages/signin', '/pages/signin1', '/pages/signin2', '/pages/signup', '/pages/signup1', '/pages/signup2', '/pages/forgot', '/pages/lock-screen','/landingPage'], path);
                    }
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
        .controller('appNeedPaid' ,['$scope', function ($scope){
            $scope.modalDisabled = function (){
                $(".modal-backdrop").hide();
            }
        }])
        .controller('appsList',['$scope','appService',function ($scope,appService){

                appService.select($scope);
                $scope.addApp=function(item){
                    appService.addApp($scope.addedApp,item);
                    $scope.$emit('to-parent', 'parent');
                }
            }])
        .controller('AppDetailController',['$scope','$routeParams',
            function ($scope,$routeParams){
                $scope.appId = $routeParams.appId;
                $scope.myInterval = 5000;
                var slides = $scope.slides = [];
                $scope.addSlide = function() {
                    var newWidth = 700 + slides.length;
                    slides.push({
                        image: 'http://placekitten.com/' + newWidth + '/300',
                    });
                };
                for (var i=0; i<4; i++) {
                    $scope.addSlide();
                }

        }])
        .controller('landingPage',[
            function ($scope){
                $scope.isSleected = function (){

                }
                $scope.setClass = function (){
                    console.log(123);
                }
        }])
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
            '$scope', 'signUpService', 'RegEpxService', function ( $scope, signUpService, RegEpxService) {
                $scope.signup = function (signup) {
                    $scope.disabled = true;
                    signUpService.signUp(signup,$scope);
                };
                $scope.signUpSuccess = function (){
                    $scope.success = true;
                }
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
        .controller('DemoFileUploadController', [
            '$scope', '$http', '$filter', '$window',
            function ($scope, $http) {
                $scope.options = {
                    url: url
                };

                if (!isOnGitHub) {
                    $scope.loadingFiles = true;
                    $http.get(url)
                        .then(
                            function (response) {
                                $scope.loadingFiles = false;
                                //$scope.queue = response.data.files || [];
                            },
                            function () {
                                $scope.loadingFiles = false;
                            }
                        );
                }
            }
        ])

        .controller('FileDestroyController', [
            '$scope', '$http',
            function ($scope, $http) {
                var file = $scope.file,
                    state;
                    console.log(file.$response());
                if (file.url) {

                    file.$state = function () {
                        return state;
                    };
                    file.$destroy = function () {
                        state = 'pending';
                        return $http({
                            url: file.deleteUrl,
                            method: file.deleteType
                        }).then(
                            function () {
                                state = 'resolved';
                                $scope.clear(file);
                            },
                            function () {
                                state = 'rejected';
                            }
                        );
                    };
                } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
                }
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
