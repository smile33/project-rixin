define('main/register', ['jquery','main/server','main/temple','main/common','jqui','md5'], function($, server, temple, common, jqui, md5){
    var exports  = {};   
    var $body     = $('body'),
    $email    = $body.find('#email'),
    $region = $body.find('#region'),
    $password = $body.find('#password'),
    $re_pwd   = $body.find('#re_password'),
    $error    = $body.find('#error_msg'),
    $tips    = $body.find('.tips'),
    rExpEmail = /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    rExpPwd = /^[\w\W]{6,16}$/,
    isSend    = false; //是否在发送中
    function tip(msg){
        $tips.html(msg);
        $tips.dialog({
            modal: true,
            buttons: [
                {
                  text: "Ok",
                  icons: {
                    primary: "ui-icon-heart"
                  },
                  click: function() {
                    $( this ).dialog( "close" );
                    window.location.href = '/member/login.html';
                  }
                }
            ]
        });
    }
    // 校验
    exports.check = function(){
        $error.text("");
        var oData = {};

        // email
        oData.userAccount = $email.val();
        if($.trim(oData.userAccount) == '' || !rExpEmail.test(oData.userAccount)){
            $email.focus();
            $error.text("email error");
            return false;
        }
        // country
        // oData.region = parseInt($body.find('#region').val());
        oData.region = parseInt($region.val());
        if(!oData.region){
            $error.text("please choose region");
            return false;
        }
        // password
        oData.password = $password.val();
        if(!rExpPwd.test(oData.password)){
            $password.focus();
            $error.text("password error");
            return false;
        }
        // re_password
        var re_password = $re_pwd.val();
        if(re_password != oData.password){
            $re_pwd.focus();
            $error.text("password must be the same");
            return false;
        }
        oData.password = $.md5(oData.password);
        if(!$body.find("input[name='agreement']:checked").length){
            $error.text("You doesn't agree the Privacy Policy!");
            return false;
        }
        // loading
        if(isSend) return;
        isSend = true;
        server.register(oData,function(data){
            console.log(data);
            isSend = false;
            tip(data.msg);
            // window.location.href = '/member/login.html';
        },function(data){
            $error.text(data.msg);
            isSend = false;
        });
    };
    // 获取国家列表
    exports.country = function(){
        server.country(function(data){
            $body.find('#region').html(temple.country(data.data));
        });
    };
    // 事件
    exports.action = function(){
        $body.on('click','#registerBtn',function(){
            exports.check();
        })
        // 清除错误信息
        .on('focus','input',function(){
            $error.text('');
        });
    };

    exports.init = function(){
        common.init();
        // $body.find('.currentLocation').html('Account Register');
        exports.country();
        exports.action();
    };
    return exports;
})