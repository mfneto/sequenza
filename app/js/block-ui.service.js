(function(AppSequenza) {
    'use strict';
	AppSequenza.factory('blockWindowService', BlockUiService);
	BlockUiService.$inject = [ '$q', '$timeout', '$window', 'blockUI'];

	function BlockUiService($q, $timeout, $window, blockUI) {

		var objTimeout = {};
		var objRegexHidePreloader = /(^|&)(hidePreloader)=(true)/i;
  
		return {
            //implementações para interceptor
			request: InterceptorRequest,
			requestError: InterceptorError,
			response: InterceptorResponse,
			responseError: InterceptorError,

            //funcções auxiliares
            blockWindow: BlockWindow,
            unblockWindow: UnblockWindow
		};

        //interceptor: request
        function InterceptorRequest(config) {
            if(config && config.params && config.params.hidePreloader === true) {
                delete config.params.hidePreloader;
            } else if(config.data && objRegexHidePreloader.test(config.data)) {
            } else {
                BlockWindow();
            }
            return config;
        }

        //interceptor: responseError / requestError
        function InterceptorError(rejection) {
            UnblockWindow();
            return $q.reject(rejection);
        }

        //interceptor: response
        function InterceptorResponse(response) {
            UnblockWindow();
            return response;
        }

        //exibe componente de bloqueio de tela
		function BlockWindow() {
			blockUI.start();
		}

        //oculta componente de bloqueio de tela
		function UnblockWindow() {
    		$timeout(function(){
      			blockUI.stop();
			});
		}
	}
})(AppSequenza);  