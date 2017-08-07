(function (AppSequenza) {
    'use strict';

    AppSequenza.directive('ngInput', Input);

    Input.$inject = ['$document', '$timeout', '$location'];

    function Input($document,  $timeout, $location) {
        return {
            restrict: 'A',
            link: Link,
            require: 'ngModel',
            scope: {
                ngOnChange: '=',
                typeMask: '@'
            },
            templateUrl: '/js/templates/input/input.template.html'
        };

        function Link(scope, element, attr, ctrl) {
            Init();

            function Init() {
                $timeout(function () {
                    angular.element(element).prev(".cs-item-field-label")
                        .on('click',
                        function () {
                            angular.element(this).next('input')[0].focus();
                        });

                    //Aplicar máscaras
                    if (scope.typeMask) {
                        if(scope.typeMask === 'tel') {
                            TelMask();
                        }
                        else if (scope.typeMask == "email") {
                            GenericMask(/^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})$/);
                        }
                        else {
                            GenericMask();
                        }
                    } else {
                        GenericMask();
                    }

                    //Aplicar Efeito
                    SetEfectChange();
                });
            }

            // Efeito input/label novo facelift.
            function SetEfectChange() {
                var objDomElement = element[0];
                var objLabel = angular.element(objDomElement).prev('.cs-item-field-label');
                if (!angular.element(objDomElement).val() && !ctrl.$modelValue) {
                    objLabel.removeClass('on-focus', 100);
                }
                else {
                    objLabel.addClass('on-focus', 100);
                }
            }
            //
           
            function TelMask() {
                var objDomElement = element[0];
                var objRegex = /^\((\d{2})\)[_ ]?(\d{4,5})-(\d{4})$/;
                var intCursorIndex = 0;

                ctrl.$parsers.push(function (value) {
                    var bolValid;
                    if (typeof value === 'undefined' || value === null || value === '') {
                        ctrl.$setValidity('mask', false);
                        SetEfectChange();
                        return undefined;
                    }

                    intCursorIndex = GetCaretPosition(objDomElement);
                    var strPrevValue = value;
                    var strNextValue = value.replace(/[\D]/gi, "").substring(0, 15);

                    if (strNextValue.indexOf(0) === 0) {
                        strNextValue = "";
                    }

                    if (strNextValue.length >= 3 && strNextValue[2] === '9') {
                        if (strNextValue.length >= 3 && strNextValue.length <= 6) {
                            strNextValue = strNextValue.replace(/([0-9]{2})([0-9]{4,5})?/, "($1) $2");
                        } else if (strNextValue.length >= 7 && strNextValue.length == 10) {
                            strNextValue = strNextValue.replace(/([0-9]{2})([0-9]{4})([0-9]{4})?/, "($1) $2-$3");
                        } else if (strNextValue.length >= 7 && strNextValue.length < 14) {
                            strNextValue = strNextValue.replace(/([0-9]{2})([0-9]{4,5})([0-9]{4})?/, "($1) $2-$3");
                        }
                        strNextValue = strNextValue.substring(0, 15);
                    } else {
                        if (strNextValue.length >= 3 && strNextValue.length <= 5) {
                            strNextValue = strNextValue.replace(/([0-9]{2})([0-9]{4})?/, "($1) $2");
                        } else if (strNextValue.length >= 4 && strNextValue.length < 14) {
                            strNextValue = strNextValue.replace(/([0-9]{2})([0-9]{4})([0-9]{4})?/, "($1) $2-$3");
                        }
                        strNextValue = strNextValue.substring(0, 14);
                    }

                    if (strPrevValue != strNextValue) {
                        ctrl.$setViewValue(strNextValue);
                    }

                    ctrl.$render();

                    if (intCursorIndex == 3) {
                        intCursorIndex = intCursorIndex + 3;
                    } else if (intCursorIndex == 10) {
                        intCursorIndex = intCursorIndex + 1;
                    }     

                    bolValid = objRegex.test(strNextValue);
                    ctrl.$setValidity('mask', bolValid);
                    SetCaretPosition(objDomElement, intCursorIndex, intCursorIndex);

                    SetEfectChange();
                    return bolValid ? parseInt(strNextValue.replace(/[\D]/gi, ""), 10) : undefined;
                });

                ctrl.$formatters.push(function (value) {
                    SetEfectChange();
                    return AplicarMascara(value);
                });

                ctrl.$modelValue = '';

                //aplica a máscara de telefone (XX) XXXXX-XXXX ou (XX) XXXX-XXXX no valor da model
                function AplicarMascara(value) {
                    if (typeof value === "undefined" || value === null || value === "") {
                        return "";
                    } else {
                        value = value.toString().substring(0, 11);
                        if(value.length === 11) {
                            return value.replace(/([0-9]{2})([0-9]{5})([0-9]{4})/, '($1) $2-$3');
                        } else {
                            return value.replace(/([0-9]{2})([0-9]{4})([0-9]{4})/, '($1) $2-$3');
                        }
                    }
                }
            }

            function GenericMask(objRegex) {

                ctrl.$parsers.push(function (value) {
                    if (typeof value === 'undefined' || value === null || value === '') {
                        if (objRegex) {
                            ctrl.$setValidity('mask', false);
                        }

                        ctrl.$modelValue = value;

                        SetEfectChange();
                        return undefined;
                    }

                    if (objRegex) {
                        ctrl.$setValidity('mask', objRegex.test(value));
                    }

                    SetEfectChange();
                    return value;
                });

                ctrl.$formatters.push(function (value) {
                    SetEfectChange();
                    if (typeof value === "undefined" || value === null || value === "") {
                        return "";
                    } else {
                        if (objRegex) {
                            ctrl.$setValidity('mask', objRegex.test(value));
                        }

                        SetEfectChange();
                        return value;
                    }
                });
            }
            /* Fim Máscaras*/

            //obtém a posição do cursor
            function GetCaretPosition(el) { 
                if (el.selectionStart) { 
                    return el.selectionStart; 
                } else if (document.selection) { 
                    el.focus(); 
                    var r = document.selection.createRange(); 
                    if (r === null) { 
                        return 0; 
                    } 
                    var re = el.createTextRange(), 
                    rc = re.duplicate(); 
                    re.moveToBookmark(r.getBookmark()); 
                    rc.setEndPoint('EndToStart', re); 
                    return rc.text.length; 
                }  
                return 0; 
            }

            function SetCaretPosition(ctrl, start, end) {
                // IE >= 9 and other browsers
                if(ctrl.setSelectionRange) {
                    ctrl.focus();
                    ctrl.setSelectionRange(start, end);
                }
                // IE < 9
                else if (ctrl.createTextRange) {
                    var range = ctrl.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', start);
                    range.select();
                }
            }
        }
    }
})(AppSequenza);