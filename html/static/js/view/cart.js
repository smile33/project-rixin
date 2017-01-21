define('main/cart', ['jquery','main/server','main/common','main/temple','main/utils','jqui'], function($, server, common, temple, utils, jqui){
    var exports  = {},
    $body = $('body'),
    $addressBox = $body.find("#addressBox"),
    $error = $body.find('#error_msg'),
    $linkMan = $body.find('#linkMan'),
    $phone1 = $body.find('#phone1'),
    $phone2 = $body.find('#phone2'),
    $region = $body.find('#region'),
    $address = $body.find('#address'),
    $telephone = $body.find('#telephone'),
    $postCode   = $body.find('#postCode'),
    rExpNumber = /^\+?[1-9][0-9]*$/,
    isDefault = 0,
    orderData = {},
    addressArray = [],
    isSend = false,//是否在发送中
    id = '',
    trObj,
    index; 
    function setAddress(data){
        //$body.find('.addReceiptAddress').hide();
        $body.find('.changeAddress').show();
        $body.find('.changeAddress .addressContent').html(temple.shopCartAddressList([data]));
    }
    //选择全部
    function selectAll(sender) {
        var checked = sender.attr("checked");
        if(checked){
            $("input[name='shopCartOrder']").attr("checked",checked);
            $("input[name='shopCartOrder_all']").attr("checked",checked);
        }else{
            $("input[name='shopCartOrder']").removeAttr("checked");
            $("input[name='shopCartOrder_all']").removeAttr("checked");
        }
    }
    //计算总费用
    function calTotalAmount() {
        var $trs = $body.find('#ShoppingCartItems tr');
        var totalamount = 0;
        //获取总金额
        for (var i = 0, max = $trs.length; i < max; i++) {
            //获取选中
            var cb = $trs.eq(i).find("input[name='shopCartOrder']")[0];
            if (cb.checked) {
                var td = $trs.eq(i).find('.price');
                totalamount += parseFloat(td.html());
            }
        }
        $body.find('#TotalAmount').html(totalamount.toFixed(5));
    }
    function getOrderData(data){
        var orderData = {
            linkMan : data.linkMan,
            region : data.region,
            areaCode : data.areaCode,
            linkPhone : data.linkPhone,
            address : data.address,
            postCode : data.postCode,
            email : data.email,
            fax : data.fax,
            companyName : data.companyName
        };
        return orderData;
    }
    function getItems(){
        var $trs = $body.find('#ShoppingCartItems tr');
        var items = [];
        for (var i = 0, max = $trs.length; i < max; i++) {
            //获取选中
            var cb = $trs.eq(i).find("input[name='shopCartOrder']")[0];
            var item = {};
            if (cb.checked) {
                var $tr = $trs.eq(i);
                item = {
                    productId: $tr.attr('product_id'),
                    quantity: parseInt($tr.find('.count').val()),
                    remark: $tr.find('.remark').val()
                }
                items.push(item);
            }
        }
        return items;
    }
    function setChangeAddressDialog(){
        $addressBox.dialog({
          autoOpen: false,
          width: 1000,
          minHeight: 300,
          show: { effect: "blind", duration: 300 },
          modal: true
        });
    }
    function setDeleteDialog(){
        $("#deleteDialog").dialog({
          autoOpen: false,
          modal: true,
          buttons : {
            "Confirm" : function() {
              common.deleteShopCart(id,trObj,index);
              $(this).dialog("close");
            },
            "Cancel" : function() {
             $(this).dialog("close");
            }
          }
        });
    }
    //获取购物车内容
    exports.getMyShopCart = function(){
        server.myShopCart({
            size: 50,
            index: 1
        },function(data){
            if(data.data){
                $body.find('#ShoppingCartItems').html(temple.myShopCart(data.data));
                calTotalAmount();
            }else{
                console.log(data);
            }
        });
    };
    //获取收货地址
    exports.getDeliveryAddressDefault = function(){
        server.deliveryAddressList({
            size: 20,
            index: 1
        },function(data){
            if(data.data && data.data.items){
                addressArray = data.data.items; 
                if(addressArray.length > 0){
                    $body.find('.changeAddressBtn').show();
                } else {
					$body.find('.addReceiptAddress').show();
					$body.find('.changeAddress').hide();
					exports.country();
				}
                $body.find('#addressBox .addressContent').html(temple.shopCartAddressList(addressArray));
                var chooseAddressData = addressArray[0];
                setAddress(chooseAddressData);
                orderData = getOrderData(chooseAddressData);
            }else{
                $body.find('.addReceiptAddress').show();
                $body.find('.changeAddress').hide();
                exports.country();
            }
        });
        // server.getDeliveryAddressDefault(function(data){
        //     if(data.data){
        //         setAddress(data.data);
        //         orderData = getOrderData(data.data);
        //     }else{
        //         $body.find('.addReceiptAddress').show();
        //         $body.find('.changeAddress').hide();
        //         exports.country();
        //     }
        // });
    };
    // 添加收货地址
    exports.addDeliveryAddress = function(){
        $error.text("");
        var oData = {};
        // consignee：
        oData.linkMan = $linkMan.val();
        if(oData.linkMan == ''){
            $linkMan.focus();
            $error.text("Please enter the username.");
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
        server.addDeliveryAddress(oData,function(data){
            isSend = false;
            setAddress(oData);
            orderData = getOrderData(oData);
            utils.tips('success!');
			$body.find('.addReceiptAddress').hide();
        },function(data){
            $error.text(data.msg);
            isSend = false;
        });
        // return oData;
    };
    // 下单
    exports.addOrder = function(){
        if(!orderData.linkMan){
            utils.tips('Please Add Address');
            return false;
        }
        orderData.items = {
            "items": getItems()
        };
        orderData.items = JSON.stringify(orderData.items);
        server.addOrder(orderData,function(data){
            utils.tips('success');
            setTimeout(function(){
                //window.location.reload();
				window.location.href = "/order/index.html";
            },2000);
        },function(data){
            utils.tips('fail');
            console.log(data);
        });
    }
    // 获取国家列表
    exports.country = function(){
        server.country(function(data){
            $body.find('#region').html(temple.country(data.data));
        });
    };
    // 事件
    exports.action = function(){
        $body.on('click','.changeAddressBtn,.saveBtn,.deleteBtn,.selectAll,.submitOrder,#addressBox .addressList',function(){
            var self = $(this);
            if(self.hasClass('changeAddressBtn')){
                $addressBox.dialog("open");
            }else if(self.hasClass('saveBtn')){
                exports.addDeliveryAddress();
            }else if(self.hasClass('deleteBtn')){
                trObj = self.closest('tr');
                index = self.closest('tr').index('tbody tr');
                id = trObj.attr('_id');
                $("#deleteDialog").dialog("open");
                // if(confirm('Are you sure to delete?')){
                //     common.deleteShopCart(id,trObj,index);
                // }
            }else if(self.hasClass('selectAll')){
                selectAll(self);
                calTotalAmount();
            }else if(self.hasClass('submitOrder')){
                exports.addOrder();
            }else if(self.hasClass('addressList')){
                var addressData = addressArray[self.index('#addressBox .addressList')];
                setAddress(addressData);
                orderData = getOrderData(addressData);
                $addressBox.dialog( "close" );
                
            }
        })        // 清除错误信息
        .on('focus','.addReceiptAddress input',function(){
            var self = $(this);
            $error.text('');
        })
        .on('blur','.count',function(){
            var self = $(this);
            var stock = parseInt(self.closest('td').siblings('.stock').html());
            var oData = {};
            oData.quantity = parseInt(self.val());
            if(!rExpNumber.test(oData.quantity)){
                utils.tips('Please enter number!');
                self.val(self.attr('quantity'));
                return false;
            }
            if(oData.quantity < 0){
                utils.tips('Do not reach the MOQ!');
                return false;
            }
            if(oData.quantity > stock){
                utils.tips('one or more goods are out of stock!');
                self.val(stock);
                return false;
            }
            var productId = self.closest('tr').attr('product_id');
            oData.productId = productId;
            server.productUnitPrice(oData, function(data){
                var obj = self.closest('td');
                if(data.data !== -1){
                    setPrice(obj, data.data, oData.quantity);
                }else{
                    utils.tips('Do not reach the MOQ!');
                    self.val(Math.min(self.attr('quantity'),stock));
                    setPrice(obj, obj.siblings('.unitPrice').attr('unit_price'), self.attr('quantity'));
                }
                calTotalAmount();
            });
        })
        .on('change','input[name="shopCartOrder"]',function(){
            var self = $(this);
            calTotalAmount();
        });
        
    };
    function setPrice(obj,unitPrice,quantity){
        obj.siblings('.unitPrice').html(unitPrice);
        obj.siblings('.price').html(utils.accMul(unitPrice,quantity));
    }
    exports.init = function(){
        common.init(true);
        // $body.find('.currentLocation').html('Brand Index');
        exports.getDeliveryAddressDefault();
        exports.getMyShopCart();
        exports.action();
        setDeleteDialog();
        setChangeAddressDialog();

    };
    return exports;
})