define('main/account_index', ['jquery','main/server','main/common'], function($, server, common){
    var exports  = {},
    $body = $('body'),
    $mail = $body.find('.mail'),
    $companyName = $body.find('#companyName');
    $realName   = $body.find('#realName'),
    $mobilePhone    = $body.find('#mobilePhone'),
    $telephone = $body.find('#telephone'),
    $fax   = $body.find('#fax'),
    $skype = $body.find('#skype'),

    isSend    = false; //是否在发送中
    
    // 获取个人信息
    exports.getProfile = function(){
        server.getProfile(function(data){
            var userInfo = data.data;
            $mail.html(userInfo.account);
            $companyName.val(userInfo.companyName);
            $realName.val(userInfo.realname);
            $mobilePhone.val(userInfo.mobilePhone);
            $telephone.val(userInfo.telephone);
            $fax.val(userInfo.fax);
            $skype.val(userInfo.skype);
        },function(data){
            // 还没登录
            window.location.href = '/member/login.html?redirect_url=/account/index.html';
        });
    };
    
    //修改个人信息
    exports.updateProfile = function(){
        var oData = {
            companyName: $companyName.val() || '',
            realname: $realName.val() || '',
            mobilePhone: $mobilePhone.val() || '',
            telephone: $telephone.val() || '',
            fax: $fax.val() || '',
            skype: $skype.val() || ''
        };

        // loading
        if(isSend) return;
        isSend = true;
        server.updateProfile(oData,function(data){
            isSend = false;
            utils.tips('update success');
        },function(data){
            utils.tips(data.msg);
            isSend = false;
        });
    };
    // 事件
    exports.action = function(){
        $body.on('click','#saveBtn',function(){
            exports.updateProfile();
        });
    };
    exports.init = function(){
        common.init(true);
        common.userSideBar();
        exports.getProfile();
        exports.action();
    };
    return exports;
})