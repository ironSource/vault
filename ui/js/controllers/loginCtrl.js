angular.module('views.loginCtrl', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'loginCtrl'
            });
    }])
    .controller('loginCtrl', ['$scope','$http', '$state' ,function ($scope, $http, $state) {
        $scope.section = 'token';
        $scope.current = 1;

        $scope.setCurrent = function(val) {
            $scope.current = val;
        };

        $scope.alerts = [];

        $scope.submitForm = function(type, a, b) {

            var type = type || 'token';
            var requestUrl = requestMethod = '';
            var data = {};

            if( type == 'token' ) {
                $http.defaults.headers.get = { 'x-vault-token' : a };    
                requestMethod = 'GET';
                requestUrl = '/v1/auth/token/lookup-self';
            } else if( type == 'userpass' ) {
                requestMethod = 'POST';
                console.info(a);
                console.info(b);
                requestUrl = '/v1/auth/userpass/login/'+a;
                data = JSON.stringify({password:b});
            }

            $http({
                method: requestMethod,
                url: requestUrl,
                data: data
            }).then(function successCallback(response) {
                var obj = response.data.data;
                    $scope.closeAlert();
                    $state.go('mounts');
            }, function errorCallback(response) {
                $scope.showError(response.data.errors[0]);
            });
        };

        $scope.showError = function( msg ) {
            $scope.alerts[0] = ({msg: msg});
        }

        $scope.closeAlert = function() {
            $scope.alerts = [];
        }
    }]);