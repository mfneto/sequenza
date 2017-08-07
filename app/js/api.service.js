(function (AppSequenza) {
    'use strict';
    AppSequenza.factory('apiService', ApiService);
    ApiService.$inject = ['$http', '$q'];

    function ApiService($http, $q) {
        var baseUrl = 'http://dev04.sequenza.com.br:9090/api/Cliente';
        var defaultConfigs = {
            headers: { 'Accept': 'application/json; odata=verbose' }
        };

        return {
            get: GetCustomer,
            getById: GetCustomerById,
            addCustomer: AddCustomer,
            updateCustomer: UpdateCustomer,
            deleteCustomer: DeleteCustomer
        };

        function GetCustomer() {
            return $http.get(baseUrl, defaultConfigs)
                .then(function (response) {
                    return response.data;
                })['catch'](function (error) {
                    console.log(error);
                });
        }

        function GetCustomerById(id) {
            return $http.get(baseUrl + "/" + id.trim(), defaultConfigs)
                .then(function (response) {
                    return response.data;
                })['catch'](function (error) {
                    console.log(error);
                });
        }

        function AddCustomer(customer) {
            return $http.post(baseUrl, customer, defaultConfigs)
                .then(function (response) {
                    return response.data;
                })['catch'](function (error) {
                    console.log(error);
                });
        }

        function UpdateCustomer(customer) {
            return $http.put(baseUrl+"/" + customer.id, customer, defaultConfigs)
                .then(function (response) {
                    return response.data;
                })['catch'](function (error) {
                    console.log(error);
                });
        }

        function DeleteCustomer(id) {
            return $http.delete(baseUrl + "/" + id, defaultConfigs)
                .then(function (response) {
                    return response;
                })['catch'](function (error) {
                    console.log(error);
                });
        }
    }
})(AppSequenza);