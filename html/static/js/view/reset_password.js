define('main/reset_password', ['jquery','main/utils','main/server','main/common','md5'], function($, utils, server, common, md5){
    var exports  = {},
    $body = $('body'),
    $old_password = $body.find('#old_password'),
    $new_password = $body.find('#new_password'),
    $re_pwd   = $body.find('#re_password'),
    $error = $body.find('#error_msg'),
    rExpPwd = /^[\w\W]{6,16}$/,
    isSend = false; //是否在发送中  
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
        $new_password.keyup(function(){
            var pwd = $(this).val();
            console.log(pwd);
             if (pwd==null||pwd==''){
                $body.find('.passwordStatus').removeClass('passwordWeekBg passwordMiddleBg passwordStrongBg');
             }else{
                 S_level=checkStrong(pwd);
                console.log( S_level);
                 switch(S_level) {
                 case 0:
                 case 1:
                    $body.find('.passwordWeek').addClass('passwordWeekBg');
                    $body.find('.passwordMiddle').removeClass('passwordMiddleBg');
                    $body.find('.passwordStrong').removeClass('passwordStrongBg');
                 break;
                 case 2:
                    $body.find('.passwordWeek').addClass('passwordWeekBg');
                    $body.find('.passwordMiddle').addClass('passwordMiddleBg');
                    $body.find('.passwordStrong').removeClass('passwordStrongBg');
                 break;
                 default:
                    $body.find('.passwordWeek').addClass('passwordWeekBg');
                    $body.find('.passwordMiddle').addClass('passwordMiddleBg');
                    $body.find('.passwordStrong').addClass('passwordStrongBg');
                 }
             } 

        });
    };
    //测试某个字符是属于哪一类.
    function CharMode(iN){
        if (iN>=48 && iN <=57) //数字
            return 1;
        if (iN>=65 && iN <=90) //大写字母
            return 2;
        if (iN>=97 && iN <=122) //小写
            return 4;
        else
            return 8; //特殊字符
    }
    //计算出当前密码当中一共有多少种模式
    function bitTotal(num){
        var modes = 0;
        for (i=0;i<4;i++){
            if (num & 1) modes++;
            num /= 2;
        }
        return modes;
    }
    //返回密码的强度级别
    function checkStrong(sPW){
        if (sPW.length<=4)
            return 0; //密码太短
        var Modes = 0;
        for (i=0;i<sPW.length;i++){
            //测试每一个字符的类别并统计一共有多少种模式.
            Modes|=CharMode(sPW.charCodeAt(i));//|= 按位或．然后赋值
        }
        return bitTotal(Modes);
    }
    exports.init = function(){
        common.init();
        common.userSideBar();
        exports.action();
    };
    return exports;
})