define('main/add_address', ['jquery','main/utils','main/server','main/temple','main/common'], function($, utils, server, temple, common){
    var exports  = {},
    size = 10,
    index = 0,
    $body = $('body');
    $error = $body.find('#error_msg'),
    $mail = $body.find('#mail'),
    $companyName = $body.find('#companyName');
    $linkMan = $body.find('#linkMan');
    $phone1 = $body.find('#phone1');
    $phone2 = $body.find('#phone2');
    $region = $body.find('#region'),
    $address = $body.find('#address'),
    $telephone = $body.find('#telephone'),
    $postCode   = $body.find('#postCode'),
    $fax   = $body.find('#fax'),
    rExpEmail = /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    isDefault = 0,
    isSend = false; //是否在发送中

    var id = utils.getSearchParam('id');
    function successCbf(data){
        isSend = false;
        utils.tips('success!');
        setTimeout(function(){
            window.location.href = "/account/address.html";
        },3000);
        
    } 
    function errorCbf(data){
        $error.text(data.msg);
        isSend = false;
    } 
    //显示收货地址详情
    exports.deliveryAddressDetail = function(){
        server.deliveryAddressDetail(id,function(data){
            data = data.data || {};
            $linkMan.val(data.linkMan);
            $region.val(data.region);
            $address.val(data.address);
            $postCode.val(data.postCode);
            $phone1.val(data.areaCode);
            $phone2.val(data.linkPhone);
            
            $mail.val(data.email);
            $companyName.val(data.companyName);
            $fax.val(data.fax);
            isDefault = data.isDefault;
            // $phone1.closest('li').hide();
        });
    };
    exports.getPostData = function(){
        $error.text("");
        var oData = {};
        // consignee：
        oData.linkMan = $linkMan.val();
        if(oData.linkMan == ''){
            $linkMan.focus();
            $error.text("Please enter the consignee.");
            return false;
        }
        // country
        oData.region = parseInt($region.val());
        if(!oData.region){
            $error.text("please choose region");
            return false;
        }
        // phone
        var phone1 = $phone1.val();
        var phone2 = $phone2.val();
        if(phone1 == ''){
            $phone1.focus();
            $error.text("Please enter the phone.");
            return false;
        }
        if(phone2 == ''){
            $phone2.focus();
            $error.text("Please enter the phone.");
            return false;
        }
        oData.areaCode =  phone1;
        oData.linkPhone = phone2;


        // Mail
        oData.email = $mail.val();
        if($.trim(oData.email) == '' || !rExpEmail.test(oData.email)){
            $mail.focus();
            $error.text("Please enter the email.");
            return false;
        }
        // Company Name
        oData.companyName = $companyName.val();
        // if(oData.companyName == ''){
        //     $companyName.focus();
        //     $error.text("Please enter the company name.");
        //     return false;
        // }
        // Fax
        oData.fax = $fax.val();
        // if(oData.fax == ''){
        //     $fax.focus();
        //     $error.text("Please enter the fax.");
        //     return false;
        // }

        // address
        oData.address = $address.val();
        if(oData.address == ''){
            $address.focus();
            $error.text("Please enter the address.");
            return false;
        }
        
        // postCode
        oData.postCode = $postCode.val();
        if(oData.postCode == ''){
            $postCode.focus();
            $error.text("Please enter the postcode.");
            return false;
        }
        oData.isDefault = isDefault;
        // loading
        if(isSend) return;
        isSend = true;
        return oData;
    };
    // 获取国家列表
    exports.country = function(){
        server.country(function(data){
            $body.find('#region').html(temple.country(data.data));
            if(id){
                exports.deliveryAddressDetail();
            }
        });
    };
    // 事件
    exports.action = function(){
        $body.on('click','.saveBtn',function(){
            var oData = exports.getPostData();
            if(oData){
                if(id){
                    oData.id = id;
                    server.updateDeliveryAddress(oData,successCbf,errorCbf);
                }else{
                    server.addDeliveryAddress(oData,successCbf,errorCbf);
                }
            }
        })
        // 清除错误信息
        .on('focus','input',function(){
            $error.text('');
        });
    };

    exports.init = function(){
        common.init(true);
        common.userSideBar();
        exports.country();
        exports.action();
    };
    return exports;
})