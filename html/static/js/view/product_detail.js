define('main/product_detail', ['jquery','main/utils','main/server','main/common','main/temple','jqsuperslide'], function($, utils, server, common, temple){
    var exports  = {},
    profile,
    $body = $('body'),
    $Large = $body.find('.large'),
    // $quantity = $body.find('.quantity'),
    // $inputBox = $body.find("#inputBox"),
    // $error_msg = $inputBox.find(".error_msg"),
    $txtCount = $body.find('#txtCount'),
    rExpNumber = /^\+?[1-9][0-9]*$/,
    isSend    = false; //是否在发送中
    // pageSize = 6;
    var id = utils.getSearchParam('id') || '';
    var part = utils.getSearchParam('part') || '';
    
    var shopCart = {
        // id : '',
        productId : '',
        moq : '',
        productImg: '',
        mfrPartNum: '',
        quantity : '',
        unitPrice : ''
    };

    $body.find('.inquiry').attr('href','/inquiry/index.html?id=' + id + '&part=' + part);
    function setQuantityHtml(product,val) {
        $body.find('#CountPlace b').html(product.unitPrice);
        $body.find('#CountPlace strong').html(utils.accMul(product.unitPrice,val));
    }
    function setQuantityVal(){
        var val = parseInt($txtCount.val())
        shopCart.quantity = val;
        var product;
        $.each(profile.productExtPrices,function(k,v){
            if((k === 0 && val < v.priceBreak) || (val >= v.priceBreak && val <= v.priceBreakEnd)){
                product = v;
                setQuantityHtml(product,val);
                return false;
            }
        });
    }
    function setLargePic(productImg){
        $Large.html('<img src="' + (productImg.bigImg || '/static/img/default_pic.jpg') + '" title="'+productImg.imgTip+'">');
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
    function addToCart(){
        var oData = {
            id: shopCart.productId,
            quantity : shopCart.quantity
        };
        // oData.quantity = $quantity.val();
        // if($.trim(oData.quantity) == ''){
        //     $quantity.focus();
        //     $error_msg.html('Please enter the quantity');
        //     return false;
        // }
        // if(parseInt(oData.quantity) < shopCart.moq){
        //     $error_msg.html('Do not reach the MOQ!');
        //     return false;
        // }
        shopCart.quantity = oData.quantity;
        common.addShopCart(oData,productUnitPrice,function(data){
            // $inputBox.dialog( "close" );
            // $error_msg.html('');
            utils.tips('add success');
            // common.headShopCart();
            
        });
    };
    function toBuy(){
        var oData = {
            id: shopCart.productId,
            quantity : shopCart.quantity
        };
        common.addShopCart(oData,productUnitPrice,function(data){
            window.location.href = "/home/cart.html";
        });
    };

    //获取产品详情内容
    exports.getProductDetailData = function(){
        server.productDetail({
            productId : id
        },function(data){
            data = data.data || {};
            profile = data.profile;
            if(profile){
                $body.find('.currentLocation').html('<a href="/product/index.html">Product List</a> &gt; '+profile.mfrPartNum);
                $body.find('.infoList').html(temple.productInfo(profile));
                $body.find('.manufacturer').html(profile.manufacturerName);
                if(profile.productImgs && profile.productImgs.length){
                    setLargePic(profile.productImgs[0]);
                    $body.find('.small').html(temple.productSmallPic(profile.productImgs));
                    shopCart.productImg = profile.productImgs[0].thumbImg;
                }
                if(profile.productExtPrices){
                    $body.find('.extendedPrice').html(temple.extendedPrice(profile.productExtPrices));
                    var product = profile.productExtPrices[0];
                    $txtCount.val(product.priceBreak);
                    setQuantityHtml(product,product.priceBreak);
                    shopCart.moq = product.priceBreak;
                    shopCart.quantity = product.priceBreak;
                }
                // if(data.favorProduct){
                //     $body.find('.favorProductContainer').html(temple.favorProduct(data.favorProduct));
                // }
                if(profile.productAttrs){
                    $body.find('.attributes-table-main tbody').html(temple.productAttributes(profile.productAttrs));
                }
                shopCart.productId = profile.productId;
                shopCart.mfrPartNum = profile.mfrPartNum;
                document.title = profile.mfrPartNum + ',' + profile.description;
                var keyword = 'PartNo:' + profile.mfrPartNum + ';Manufacturer:' + profile.manufacturerName + ';Description:' + profile.description;
                $('meta[name=keywords]').attr('content',keyword);
                $('meta[name=description]').attr('content',keyword)
            }
        });
    };
    
    //获取相关产品内容
    exports.getRelateProducts = function(){
        server.relateProducts({
            productId : id
        },function(data){
            data = data.data || {};
            console.log(data);
            // if(data.favorProduct){
                $body.find('.favorProductContainer').html(temple.favorProduct(data));
            $(".fullSlide").slide({ 
                titCell:".hd ul", 
                mainCell:".bd ul", 
                effect:"leftLoop", 
                vis:6, 
                scroll: 6,
                autoPlay:true, 
                // defaultIndex: 12,
                autoPage:true, 
                trigger:"click" 
            });
            // }
        });
    };
    // exports.quantityPopup = function(){
    //     $inputBox.dialog({
    //       autoOpen: true,
    //       width: 360,
    //       minHeight:160,
    //       show: { effect: "blind", duration: 300 },
    //       modal: true,
    //       close: function(){
    //         $quantity.val('');
    //         $error_msg.html('');
    //       }
    //     });
    // };


    // 事件
    exports.action = function(){
        $body.on('click','.sub,.add,.imgTab,.addCart,.purchaseBtn',function(){
            var self = $(this);
            var val = parseInt($txtCount.val());
            if(self.hasClass('sub')){
                if(val-1 < shopCart.moq){
                    utils.tips('Do not reach the MOQ!');
                    return false;
                }
                $txtCount.val(Math.max(1,val-1));
                setQuantityVal();
            }else if(self.hasClass('add')){
                $txtCount.val(val+1);
                setQuantityVal();
            }else if(self.hasClass('imgTab')){
                self.addClass('imgChoose').siblings('a').removeClass('imgChoose');
                setLargePic(profile.productImgs[self.index('.imgTab')]);
            }else if(self.hasClass('addCart')){
                // exports.quantityPopup();
                addToCart();
            }else if(self.hasClass('purchaseBtn')){
                toBuy();
            }
            // else if(self.hasClass('quantityBtn')){
            //     addToCart();
            // }
        });
        $txtCount.blur(function(){
            var val = parseInt($txtCount.val());
            if(val < shopCart.moq || !rExpNumber.test(val)){
                utils.tips('Do not reach the MOQ!');
                $txtCount.val(shopCart.moq);
            }
            setQuantityVal();
        });
    };
    exports.init = function(){
        common.init();
        exports.getProductDetailData();
        exports.getRelateProducts();
        exports.action();
    };
    return exports;
});