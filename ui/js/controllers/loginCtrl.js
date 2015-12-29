angular.module('views.loginCtrl', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'loginCtrl'
            });
    }])
    .controller('loginCtrl', ['$scope','$http' ,function ($scope, $http) {
        $scope.section = 'token';
        $scope.current = 1;

        $scope.setCurrent = function(val) {
            $scope.current = val;
        };

        $scope.alerts = [];

        $scope.submitForm = function() {
            $http.defaults.headers.get = { 'x-vault-token' : '9c258fe7-8cdb-fcec-a9a3-72a59762dd96s' };
            $http({
                method: 'GET',
                url: '/v1/auth/token/lookup-self'
            }).then(function successCallback(response) {
                var obj = response.data.data;
                console.info(obj);

            }, function errorCallback(response) {
                $scope.showError(response.data.errors[0]);
            });
        };

        $scope.showError = function( msg ) {
            $scope.alerts[0] = ({msg: msg});
        }
    }]);
