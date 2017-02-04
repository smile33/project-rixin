define('main/forget_password', ['jquery','main/utils','main/server','main/common','md5'], function($, utils, server, common, md5){
    var exports  = {},
    $body = $('body'),
    $password = $body.find('#password'),
    $re_pwd   = $body.find('#re_password'),
    $error = $body.find('#error_msg'),
    // rExpPwd   = /^(?!(?:\d*$))[A-Za-z0-9]{6,20}$/,
    rExpPwd = /^[\w\W]{6,16}$/,
    isSend = false; //是否在发送中  
    // 初始化
   
    var code = utils.getSearchParam('code');
    exports.check = function(){
        $error.text("");
        var oData = {};
        oData.code = code;
        // password
        oData.np = $password.val();
        if(!rExpPwd.test(oData.np)){
            $password.focus();
            $error.text("password error");
            return false;
        }
        // re_password
        var re_password = $re_pwd.val();
        if(re_password != oData.np){
            $re_pwd.focus();
            $error.text("password must be the same");
            return false;
        }
        oData.np = $.md5(oData.np); 

        // loading
        if(isSend) return;
        isSend = true;

        server.resetForgetPassword(oData,function(data){
            isSend = false;
            utils.tips('reset passward success!');
            setTimeout(function(){
                window.location.href = "/member/login.html";
            },3000);
            
        },function(data){
            $error.text(data.msg);
        });
    }
    // 事件
    exports.action = function(){
        $body.on('click','#confirmBtn',function(){
            exports.check();
        })
        // 清除错误信息
        .on('focus','input',function(){
            $error.text('');
        });
    };

    exports.init = function(){
        common.init();
        // $body.find('.currentLocation').html('Reset Password');
        exports.action();
    };
    return exports;
})