define('main/product_search', ['jquery','jqform','main/utils','main/server','main/common','main/temple','jqui','main/post_inquiry'], function($, jqform, utils, server, common, temple, jqui, post_inquiry){
    var exports  = {},
    profile,
    $body = $('body'),
    $quantity = $body.find('.quantity'),
    $inputBox = $body.find("#inputBox"),
    $datasheetContainer = $body.find("#datasheetContainer"),
    $error_msg = $inputBox.find(".error_msg"),
    $typeMatch = $body.find('.typeMatch'),

    // $partNum = $body.find('#partNum'),
    // $name = $body.find('#name'),
    // $email = $body.find('#email'),
    // $price = $body.find('#price'),
    // $inquiry_quantity = $body.find('#quantity'),
    // $content = $body.find('#content'),
    // $file = $body.find('#file');
    // $error = $body.find('#error'),
    isSend = false, //是否在发送中  
    rExpEmail = /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    rExpNumber = /^\+?[1-9][0-9]*$/,
	rExpPositive = /^[0-9].*$/;
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
    var skuArray = [];
    $body.find('.searchInput').html(key);
    exports.getProductSearchData = function(){
        utils.loading('show');
        server.productSearch({
            key : key,
            delivery : delivery
        },function(data){
            if(data.data){
                data = data.data;
                if((data.items && !data.items.length) && data.page === 1){
                    showNoData();
                }else{
                    skuArray = data.skus;
                    $body.find('.typeItem .itemContainer').html(temple.searchMatch(data.matchResult));
                    $typeMatch.find('a').html(key);
                    $typeMatch.find('strong').html(data.totalPartNum + 'stock');
                    $body.find('.filterItem .itemContainer').html(temple.searchDeliveryTime(data.deliveryTime));
                    $body.find('#ProductArea').html(temple.searchProductArea(data.skus,key));
                    // $body.find('.supplierTab span').html(data.skus && data.skus.length);
                    $body.find('.searchResultContainer').show();
                }
            }else{
                showNoData();

                // $body.find('.inquiryContainer').show().find('#partNum').val(key);

            }
            utils.loading();
        });
    };
    function showNoData(){
        $body.find('.SiteMap').hide();
        $body.find('.noDataContainer').show().find('.key').html(key);
    }
    // //校验Inquiry参数
    // exports.inquiry = function(){
    //     var oData = {
    //         productId : '0'
    //     };
    //     oData.partNum = $partNum.val();
    //     if($.trim(oData.partNum) == ''){
    //         $partNum.focus();
    //         $error.text("Please enter your  Part No.");
    //         return false;
    //     }
    //     oData.name = $name.val();
    //     if($.trim(oData.name) == ''){
    //         $name.focus();
    //         $error.text("Please enter your name.");
    //         return false;
    //     }
    //     oData.email = $email.val();
    //     if($.trim(oData.email) == '' || !rExpEmail.test(oData.email)){
    //         $email.focus();
    //         $error.text("Please enter correct email.");
    //         return false;
    //     }
    //     oData.targetPrice = $price.val();
    //     if(!rExpPositive.test(oData.targetPrice)){
    //         $price.focus();
    //         $error.text("Pleast enter correct target price.");
    //         return false;
    //     }
    //     oData.quantity = $inquiry_quantity.val();

    //     if(!rExpNumber.test(oData.quantity)){
    //         $inquiry_quantity.focus();
    //         $error.text("Pleast enter correct quantity.");
    //         return false;
    //     }
    //     oData.lookingFor = $content.val();
    //     if($.trim(oData.lookingFor) == ''){
    //         $content.focus();
    //         $error.text("Please enter looking for.");
    //         return false;
    //     }
    //     if(isSend) return false;
    //     isSend = true;
    //     if($file.val()){
    //         $("#fileForm").ajaxSubmit({
    //             url: window._c.path + 'upload/uploadSigle.wb',
    //             type:"post",
    //             dataType: 'json',
    //             success: function(data){
    //                if(data.flag  === 0 && data.data){
    //                     oData.fileMd5 = data.data.attMd5; 
    //                     exports.inquirySearch(oData);                    
    //                 }else{
    //                     $error.text(data.msg);
    //                     isSend = false;                
    //                 }                            
    //             },
    //             error:function(data){
    //                 $error.text(data.msg);
    //                 isSend = false;
    //             },
    //             // clearForm: true, 
    //             timeout: 300000                         
    //         }); 
    //     }else{
    //         exports.inquirySearch(oData);
    //     }
    // };

    // // 发布商品inquiry
    // exports.inquirySearch = function(data){
    //     server.inquirySearch(data,function(data){
    //         $name.val('');
    //         $email.val('');
    //         $price.val('');
    //         $inquiry_quantity.val('');
    //         $content.val('');
    //         $file.val('');
    //         $error.text('');
    //         utils.tips('submit success');
    //         setTimeout(function(){
    //             window.location.href = "/inquiry/success.html";
    //         },1000);
    //         isSend = false;  
    //     },function(data){
    //         $error.text(data.msg);
    //         isSend = false;   
    //     });
    // };

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
    exports.datasheetPopup = function(){
        $datasheetContainer.dialog({
          autoOpen: true,
          width: 500,
          // minHeight:160,
          show: { effect: "blind", duration: 300 },
          modal: true
        });
    };
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
        $body.on('click','.setDeliveryTime,.morePrice,.lessPrice,.addToCartBtn,.buyBtn,.quantityBtn,.moreDatasheet,.redirectInquiryPage',function(){
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
            else if(self.hasClass('moreDatasheet')){
                var index = parseInt(self.closest('.productList').attr('p_index'));
                $datasheetContainer.html(temple.moreDatasheet(skuArray[index].datasheets));
                exports.datasheetPopup();
            }else if(self.hasClass('redirectInquiryPage')){
                window.location.href = '/inquiry/index.html?part='+key;
            }
            // else if(self.hasClass('checkBtn')){
            //     exports.inquiry();
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
        post_inquiry.init();
    };
    return exports;
})