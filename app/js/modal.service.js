(function (AppSequenza) {
    'use strict';
    AppSequenza.service('modalService', ModalService);
    ModalService.$inject = ['$ngConfirm'];

    function ModalService($ngConfirm) {
        return {
            showConfirmModal: ShowConfirmModal,
            showAlertModal: ShowAlertModal
        };

        function ShowAlertModal(message, error) {
            var config = {
                title: !error ? "Sucesso!" : "Erro :(",
                content: message,
                buttons: {
                    ok: {
                        text: "Ok",
                        btnClass: "btn-blue",
                        action: function (scope) {

                        }
                    }
                }
            };
            $ngConfirm(config);
        }

        function ShowConfirmModal(message, callback) {
            var config = {
                title: "Confirmar",
                content: message,
                buttons: {
                    ok: {
                        text: "Ok",
                        btnClass: "btn-blue",
                        action: function (scope) {
                            if (callback) {
                                callback();
                            }
                        }
                    },
                    cancel: {
                        text: "Cancelar",
                        btnClass: "btn-default",
                        action: function () {

                        }
                    }
                }
            };
            $ngConfirm(config);
        }
    }
})(AppSequenza);