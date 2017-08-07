(function (AppSequenza) {
    'use strict';
    AppSequenza.controller('CustomerController', [
        '$scope', '$routeParams', 'apiService', '$window', '$location', 'modalService',
        function ($scope, $routeParams, $apiService, $window, $location, $modalService) {
            $scope.vm = {};
            $scope.fn = {
                goBack: GoBack,
                addCustomer: AddCustomer
            };

            Init();

            function Init() {
                if ($routeParams.id) {
                    $apiService.getById($routeParams.id).then(function (res) {
                        $scope.vm.customer = res;
                        $scope.pageTitle = "Editar";
                    });
                } else {
                    $scope.pageTitle = "Novo";
                }
            }

            function GoBack() {
                $window.history.back()
            }

            function AddCustomer() {
                if ($scope.customerForm.$invalid) {
                    $scope.customerForm.$dirty = true;

                    angular.forEach($scope.customerForm, function (control, name) {
                        if (name && name[0] !== '$') {
                            $scope.customerForm[name].$setViewValue($scope.customerForm[name].$viewValue);
                            $scope.customerForm[name].$pristine = false;
                        }
                    });
                    return false;
                }

                if ($scope.vm.customer.id > 0) {
                    $apiService.updateCustomer($scope.vm.customer).then(function (res) {
                        if (res && res.id > 0) {
                            $modalService.showAlertModal("Cliente atualizado com sucesso!");
                            $location.path('/');
                        } else {
                            $modalService.showAlertModal("Ops... Ocorreu alguem problema !", true);
                        }
                    });
                } else {
                    $apiService.addCustomer($scope.vm.customer).then(function (res) {
                        if (res && res.id > 0) {
                            $modalService.showAlertModal("Cliente inserido com sucesso!");
                            $location.path('/');
                        } else {
                            $modalService.showAlertModal("Ops... Ocorreu alguem problema !", true);
                        }
                    });
                }
            }
        }
    ]);
})(AppSequenza);