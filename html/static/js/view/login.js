define('main/login', ['jquery','main/server','main/common','main/utils','md5'], function($, server, common, utils, md5){
    var exports  = {},
        STORE = utils.STORE,
        userInfo = STORE.getItem('userInfo'),
        redirect_url = utils.getSearchParam('redirect_url') || '',
        $body     = $('body'),
        $email    = $body.find('#email'),
        $password = $body.find('#password'),
        $error    = $body.find('#error_msg'),
        rExpEmail = /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
        // rExpPwd   = /^(?!(?:\d*$))[A-Za-z0-9]{6,20}$/,
        rExpPwd = /^[\w\W]{6,16}$/,
        isSend = false; //是否在发送中
    // 校验

    function redirectUrl(){
        if(redirect_url){
            window.location.href = redirect_url;
        }else{
            window.location.href = '/member/index.html';
        }
    }
    exports.check = function(){
        var oData = {};
        // email
        oData.a = $email.val();
        if($.trim(oData.a) == '' || !rExpEmail.test(oData.a)){
            $email.focus();
            $error.text("email error");
            return false;
        }
        // password
        oData.p = $password.val();
        // if(!rExpPwd.test(oData.p)){
        //     $password.focus();
        //     $error.text("password error");
        //     return false;
        // }
        if(!userInfo || userInfo.password !== $password.val()){
            if(!rExpPwd.test(oData.p)){
                $password.focus();
                $error.text("password error");
                return false;
            }
            oData.p = $.md5(oData.p);
        }
        
        if(isSend) return false;
        isSend = true;
        server.login(oData,function(data){
            console.log(data);
            isSend = false;
            if($body.find("input[name='rememberPwd']:checked").length){
                STORE.setItem('userInfo',{
                    account: oData.a,
                    password: oData.p
                });
            }else{
                STORE.removeItem('userInfo');
            }
            exports.mergeShopCart();
        },function(data){
            $error.text(data.msg);
            isSend = false;
        });
    };
    exports.mergeShopCart = function(){
        var oData = {};
        var shopCartArray = utils.STORE.getItem('shopCart') || [];
        var array = [];
        $.each(shopCartArray,function(k,v){
            var sc = v.productId +',' +v.quantity;
            array.push(sc);
        });
        oData.sc = array.join('|');
        if(shopCartArray.length){
            server.mergeShopCart(oData,function(){
                STORE.removeItem('shopCart');
                redirectUrl();
            },function(){
                redirectUrl();
            });
        }else{
            redirectUrl();
        }
    };
    // 事件
    exports.action = function(){
        $body.on('click','#loginBtn',function(){
            exports.check();
        })
        // 清除错误信息
        .on('focus','input',function(){
            $error.text('');
        });
    };
    // 初始化
    exports.init = function(){
        common.init();
        // $body.find('.currentLocation').html('Member Login');
        exports.action();
        if(userInfo){
            $email.val(userInfo.account);
            $password.val(userInfo.password);
            $body.find("input[name='rememberPwd']").attr('checked','checked');
        }
    };
    return exports;
})