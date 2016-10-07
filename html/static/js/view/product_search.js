define('main/product_search', ['jquery','main/utils','main/server','main/common','main/temple','jqui'], function($, utils, server, common, temple, jqui){
    var exports  = {},
    profile,
    $body = $('body'),
    $quantity = $body.find('.quantity'),
    $inputBox = $body.find("#inputBox"),
    $datasheetContainer = $body.find("#datasheetContainer"),
    $error_msg = $inputBox.find(".error_msg"),
    $typeMatch = $body.find('.typeMatch'),
    rExpNumber = /^\+?[1-9][0-9]*$/;
    // $txtCount = $body.find('#txtCount');
    // pageSize = 6;
    var shopCart = {
        // id : '',
        productId : '',
        moq : '',
        logo: '',
        mfrPartNum: '',
        quantity : '',
        unitPrice : ''
    };
    var key = utils.getSearchParam('key') || '';
    var delivery = decodeURIComponent(utils.getSearchParam('delivery')) || 'all';
    $body.find('.searchInput').html(key);
    exports.getProductSearchData = function(){
        server.productSearch({
            key : key,
            delivery : delivery
        },function(data){
            if(data.data){
                data = data.data;
                $body.find('.typeItem').html(temple.searchMatch(data.matchResult));
                $typeMatch.find('a').html(key);
                $typeMatch.find('span').html(data.totalPartNum);
                $body.find('.filterItem dd').append(temple.searchDeliveryTime(data.deliveryTime));
                $body.find('#ProductArea').html(temple.searchProductArea(data.skus,key));
                $body.find('.supplierTab span').html(data.skus && data.skus.length);
            }
        });
    };
    exports.quantityPopup = function(){
        $inputBox.dialog({
          autoOpen: true,
          width: 360,
          minHeight:160,
          show: { effect: "blind", duration: 300 },
          modal: true,
          close: function(){
            $quantity.val('');
            $error_msg.html('');
          }
        });
    };
    // exports.datasheetPopup = function(){
    //     $datasheetContainer.dialog({
    //       autoOpen: true,
    //       width: 500,
    //       // minHeight:160,
    //       show: { effect: "blind", duration: 300 },
    //       modal: true
    //     });
    // };
    function addToCart(){
        var oData = {
            id: shopCart.productId
        };
        oData.quantity = $quantity.val();
        if($.trim(oData.quantity) == ''){
            $quantity.focus();
            $error_msg.html('Please enter the quantity!');
            return false;
        }
        if(!rExpNumber.test(oData.quantity)){
            $error_msg.html('Please enter number!');
            return false;
        }
        if(parseInt(oData.quantity) < shopCart.moq){
            $error_msg.html('Do not reach the MOQ!');
            return false;
        }
        shopCart.quantity = oData.quantity;
        common.addShopCart(oData,productUnitPrice,function(data){
            $inputBox.dialog( "close" );
            $error_msg.html('');
            utils.tips('add success');
            common.headShopCart();
        });
    };
    function toBuy(){
        var oData = {
            id: shopCart.productId,
            quantity : shopCart.moq
        };
        common.addShopCart(oData,productUnitPrice,function(data){
            window.location.href = "/home/cart.html";
        });
    };

    function getShopCartData(obj){
        shopCart = {
            productId : obj.attr('_id'),
            moq : parseInt(obj.attr('moq')),
            productImg: obj.attr('logo'),
            mfrPartNum: obj.attr('mfrPartNum'),
            quantity : parseInt(obj.attr('moq'))
        };
        return shopCart;
    }
    function productUnitPrice(){
        var oData = {
            quantity : shopCart.quantity,
            productId : shopCart.productId
        };
        var shopCartArray = utils.STORE.getItem('shopCart') || [];
        $.each(shopCartArray,function(k,v){
            if(oData.productId === v.productId){
                oData.quantity = parseInt(oData.quantity) + parseInt(v.quantity);
                shopCart.quantity = oData.quantity;
                shopCartArray.splice(k,1);
                return false;
            }
        });
        server.productUnitPrice(oData, function(data){
            if(data.data !== -1){
                shopCart.unitPrice = data.data;
                shopCartArray.push(shopCart);
                utils.STORE.setItem('shopCart',shopCartArray);
            }else{
                utils.tips('fail');
            }
        });
    }
    // 事件
    exports.action = function(){
        $body.on('click','.setDeliveryTime,.morePrice,.lessPrice,.addToCartBtn,.buyBtn,.quantityBtn,.moreDatasheet',function(){
            var self = $(this);
            if(self.hasClass('setDeliveryTime')){
                var delivery = self.attr('delivery');
                window.location.href = '/product/search.html?key=' + key + '&delivery=' + delivery;
            }else if(self.hasClass('morePrice')){
                self.closest('.price').find('.hide').removeClass('hide').addClass('show');
                self.hide().siblings('.lessPrice').show();
            }else if(self.hasClass('lessPrice')){
                self.closest('.price').find('.show').removeClass('show').addClass('hide');
                self.hide().siblings('.morePrice').show();
            }else if(self.hasClass('addToCartBtn')){
                var operateObj = self.closest('.operate');
                shopCart = getShopCartData(operateObj);
                // shopCart.productId = self.closest('.operate').attr('_id');
                // shopCart.moq = parseInt(operateObj.attr('moq'));
                exports.quantityPopup();
            }else if(self.hasClass('buyBtn')){
                var operateObj = self.closest('.operate');
                shopCart = getShopCartData(operateObj);
                // shopCart.productId = operateObj.attr('_id');
                // shopCart.moq = parseInt(operateObj.attr('moq'));
                // shopCart.logo = 
                toBuy();
            }else if(self.hasClass('quantityBtn')){
                addToCart();
            }
            // else if(self.hasClass('moreDatasheet')){
            //     exports.datasheetPopup();
            // }
        });
    };
    function setSearchInputValue(){
        setTimeout(function(){
            if($body.find('.tabSearch').length){
                $body.find('.tabSearch').eq(0).addClass('sele').siblings('a').removeClass('sele');
                $body.find('#searchInput').val(key);
            }else{
                setSearchInputValue();
            }
        },500);
    }
    exports.init = function(){
        common.init();
        setSearchInputValue();
        $body.find('.currentLocation').html('<a href="/product/index.html">Product List</a> &gt; '+key);
        exports.getProductSearchData();
        exports.action();
    };
    return exports;
})