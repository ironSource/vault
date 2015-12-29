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

        $scope.submitForm = function(token) {
            $http.defaults.headers.get = { 'x-vault-token' : token };
            $http({
                method: 'GET',
                url: '/v1/auth/token/lookup-self'
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