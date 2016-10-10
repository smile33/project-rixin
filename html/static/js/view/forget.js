define('main/forget', ['jquery','main/server','main/common','main/utils'], function($, server, common, utils){
    var exports  = {},
    $body = $('body'),
    $email = $body.find('#email'),
    $error = $body.find('#error_msg'),
    rExpEmail = /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    isSend = false; //是否在发送中  
    // 初始化

    exports.check = function(){
        var oData = {};
        oData.email = $email.val();

        if($.trim(oData.email) == '' || !rExpEmail.test(oData.email)){
            $email.focus();
            $error.text("email error");
            return false;
        }
        // loading
        if(isSend) return;
        isSend = true;

        server.forgetPassword(oData,function(data){
            isSend = false;
            utils.tips("a email has been send to your account, valid for 24 hours!");  
            setTimeout(function(){
                window.location.href="/member/login.html";
            },3000);
            
        },function(data){
            $error.text(data.msg);
            isSend = false;
        });
    }
    // 事件
    exports.action = function(){
        $body.on('click','#nextStepBtn',function(){
            exports.check();
        })
        // 清除错误信息
        .on('focus','input',function(){
            $error.text('');
        });
    };

    exports.init = function(){
        common.init();
        $body.find('.currentLocation').html('Retrieve password');
        exports.action();
    };
    return exports;
})