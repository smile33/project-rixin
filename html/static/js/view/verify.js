define('main/verify', ['main/common','main/utils','main/server'], function(common, utils, server){
    var exports  = {};
    var $body = $('body');
    var email = utils.getSearchParam('email') || '';
    var code = utils.getSearchParam('code') || '';
    
    exports.verify = function(){
    	var oData = {
    		email: email,
    		code: code
    	};	
        server.verify(oData,function(data){
        	setTimeout(function(){
        		window.location.href = '/member/login.html';
        	},3000);
        },function(data){
        	$body.find('.PageFrame h2').html('Verify error');
        	$body.find('.sum').html('Click here to register&nbsp;<a href="/member/register.html">Register</a>');
        });
    };
    exports.init = function(){
        common.init();
        exports.verify();
    };
    return exports;
})