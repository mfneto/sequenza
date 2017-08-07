(function (AppSequenza) {
    'use strict';
    AppSequenza.controller('GridController', GridController);
    GridController.$inject = ['$scope', 'apiService', 'NgTableParams', '$location', 'modalService'];

    function GridController($scope, $apiService, NgTableParams, $location, $modalService) {
        $scope.vm = {};

        $scope.fn = {
            formatarTelefone: FormatarTelefone,
            go: GoToRoute,
            showConfirmDeleteModal: ShowConfirmDeleteModal
        };

        Init();

        function Init() {
            $apiService.get().then(function (res) {
                $scope.vm.clientes = res;
                $scope.vm.table = new NgTableParams({}, { dataset: $scope.vm.clientes });
            });
        }

        function FormatarTelefone(tel) {
            return ((tel || "").toString()).replace(/([1-9]{2})[_ ]?([1-9]{1}[0-9]{3,4})([0-9]{4})/, "($1) $2-$3");
        }

        function GoToRoute(path) {
            $location.path(path);
        }

        function ShowConfirmDeleteModal(idCustomer, nameCustomer) {
            $scope.vm.idDeleteCustomer = idCustomer;
            $modalService.showConfirmModal("Tem certesa que deseja excluir: " + (nameCustomer || ""), DeleteCustomer);
        }

        function DeleteCustomer() {
            if ($scope.vm.idDeleteCustomer > 0) {
                $apiService.deleteCustomer($scope.vm.idDeleteCustomer).then(function (res) {
                    if (res.data > 0 && res.status == 200) {
                        $modalService.showAlertModal("Cliente excluído com sucesso!");
                        GoToRoute("/Reload");
                    } else {
                        $modalService.showAlertModal("Ops... Ocorreu alguem problema !", true);
                    }
                });
            }
        }
    }
})(AppSequenza);