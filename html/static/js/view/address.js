define('main/address', ['jquery','main/server','main/common','main/temple','main/utils','jqui','page_turning_plugin'], function($, server, common, temple, utils, jqui){
    var exports  = {},
    id,
    $body = $('body'),
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
    $setAsDefault = $body.find("input[type='checkbox']"),
    // $setAsDefault = $body.find('setAsDefault'),
    $fax   = $body.find('#fax'),
    rExpEmail = /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    id = '',
    editId = '',
    isSend = false, //是否在发送中
    count = 0,//total address count
    pageSize = 10;

    function successCbf(data){
        isSend = false;
        utils.tips('success!');
        clearInput();
        editId = '';
        $body.find('.addressTitle').html('Add receipt address');
        exports.deliveryAddressList();
        

        // setTimeout(function(){
        //     window.location.href = "/account/address.html";
        // },3000);
        
    } 
    function errorCbf(data){
        $error.text(data.msg);
        isSend = false;
    } 
    function clearInput(){
        $linkMan.val('');
        $region.val('')
        $phone1.val('');
        $phone2.val('')
        $mail.val('');
        $companyName.val('');
        $address.val('');
        $fax.val('');
        $postCode.val('');
        $error.text('');
    }
    // 获取收货地址列表
    exports.deliveryAddressList = function(params){
        params = {
            index: params && params.pageIndex || 1,
            size : pageSize
        };
        utils.loading('show');
        PageTurningPlugin.pageServer(server.path_delivery_address_list,params,function(data){
            utils.loading();
            data = data.data;
            var items = data.items || [];
            count = data.total;
            $body.find('.addressNumber').html(data.total);
            $body.find('.addressContent').html(temple.addressList(items));
            PageTurningPlugin.setPageObj({
                pageIndex : data.page,
                pageLast : data.maxPage
            },exports.deliveryAddressList);
        });
    };

    //设置默认收货地址
    exports.setDeliveryAddressDefault = function(){
        var params = {
            id: id
        };
        server.setDeliveryAddressDefault(params,function(data){
            isSend = false;
            utils.tips('success');
            $body.find('.addressContent .operate a').show();
            $body.find('.addressContent tr[_id='+id+'] .operate a').hide();
        },function(data){
            utils.tips(data.msg);
        });
    }
    //删除收货地址
    exports.deleteDeliveryAddress = function(){
        var params = {
            id: id
        };
        server.deleteDeliveryAddress(params,function(data){
            utils.tips('success');
            $body.find('.addressContent tr[_id='+id+']').remove();
            $body.find('.addressNumber').html(--count);
        },function(data){
            utils.tips(data.msg);
        });
    }

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
        // Fax
        oData.fax = $fax.val();

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
        oData.isDefault = $setAsDefault.is(':checked') ? 1: 0;
        // loading
        if(isSend) return;
        isSend = true;
        return oData;
    };

    // 获取国家列表
    exports.country = function(){
        server.country(function(data){
            $body.find('#region').html(temple.country(data.data));
            // if(id){
            //     exports.deliveryAddressDetail();
            // }
        });
    };
    //显示收货地址详情
    exports.deliveryAddressDetail = function(){
        utils.loading('show');
        server.deliveryAddressDetail(id,function(data){
            utils.loading();
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
            $setAsDefault.attr('checked',(data.isDefault ? 'checked': null));
        });
    };

    // 事件
    exports.action = function(){
        $body.on('click','.operate,.deleteBtn,.saveBtn,.editBtn',function(){
            var self = $(this);
            id = self.closest('tr').attr('_id');
            if(self.hasClass('operate')){
                $("#setAsDefaultDialog").dialog("open");
            }else if(self.hasClass('deleteBtn')){
                $("#deleteDialog").dialog("open");
            }else if(self.hasClass('saveBtn')){
                var oData = exports.getPostData();
                if(oData){
                    if(editId){
                        console.log(editId);
                        oData.id = editId;
                        server.updateDeliveryAddress(oData,successCbf,errorCbf);
                    }else{
                        server.addDeliveryAddress(oData,successCbf,errorCbf);
                    }
                }
            }else if(self.hasClass('editBtn')){
                editId = self.closest('tr').attr('_id');
                $body.find('.addressTitle').html('Edit receipt address');
                exports.deliveryAddressDetail();
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
        exports.deliveryAddressList();
        exports.country();
        exports.action();
        common.sureDialog($("#setAsDefaultDialog"),exports.setDeliveryAddressDefault);
        common.sureDialog($("#deleteDialog"),exports.deleteDeliveryAddress);
    };

    return exports;
})