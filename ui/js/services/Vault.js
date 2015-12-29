(function(angular) {
    "use strict";

    function Vault($q, $http) {
        var vaultToken = "set me";
        return {
            setToken: function(token) {
                vaultToken = token;
            },
            mounts: function() {
                return $http({
                    method: "GET",
                    url: "/v1/sys/mounts",
                    headers: {
                        "X-Vault-Token": vaultToken
                    }
                }).then(function(resp) {
                    if (resp.status !== 200) {
                        return $q.reject(new Error("bad status"));
                    }
                    return resp.data;
                });
            }
        };
    }

    Vault.$inject = ["$q", "$http"];

    angular.module("services.Vault", [])
        .factory("Vault", Vault);
})(angular);
