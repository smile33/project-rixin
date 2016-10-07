define('main/reset_password', ['jquery','main/utils','main/server','main/common','md5'], function($, utils, server, common, md5){
    var exports  = {},
    $body = $('body'),
    $old_password = $body.find('#old_password'),
    $new_password = $body.find('#new_password'),
    $re_pwd   = $body.find('#re_password'),
    $error = $body.find('#error_msg'),
    rExpPwd = /^[\w\W]{6,16}$/,
    isSend = false; //是否在发送中  
    // 初始化
   
    exports.check = function(){
        $error.text("");
        var oData = {};
        // old password
        oData.op = $old_password.val();
        if(!rExpPwd.test(oData.op)){
            $old_password.focus();
            $error.text("current password error");
            return false;
        }
        // new password
        oData.np = $new_password.val();
        if(!rExpPwd.test(oData.np)){
            $new_password.focus();
            $error.text("new password error");
            return false;
        }
        // re_password
        var re_password = $re_pwd.val();
        if(re_password != oData.np){
            $re_pwd.focus();
            $error.text("password must be the same");
            return false;
        }
        oData.op = $.md5(oData.op);
        oData.np = $.md5(oData.np);

        // loading
        if(isSend) return;
        isSend = true;

        server.resetPassword(oData,function(data){
            isSend = false;
            utils.tips('reset passward success!');
            setTimeout(function(){
                window.location.href = "/member/index.html";
            },3000);
        },function(data){
            $error.text(data.msg);
            isSend = false;
        });
    }
    // 事件
    exports.action = function(){
        $body.on('click','#resetPasswordBtn',function(){
            exports.check();
        })
        // 清除错误信息
        .on('focus','input',function(){
            $error.text('');
        });
    };

    exports.init = function(){
        common.init();
        common.userSideBar();
        exports.action();
    };
    return exports;
})