angular.module('views.loginCtrl', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'loginCtrl'
            });
    }])
    .controller('loginCtrl', ['$scope', 'isVaultUi', function ($scope, isVaultUi) {
        $scope.section = 'token';

        $scope.setCurrent = function(val) {
            $scope.current = val;
        }

    }]);
