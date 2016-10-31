define('main/inquiry_index', ['jquery','jqform','main/utils','main/server','main/common','main/temple'], function($, jqform, utils, server, common, temple){
    var exports  = {},
    $body = $('body'),
    $name = $body.find('#name'),
    $email = $body.find('#email'),
    $price = $body.find('#price'),
    $quantity = $body.find('#quantity'),
    $content = $body.find('#content'),
    $file = $body.find('#file');
    $error = $body.find('#error_msg'),
    rExpEmail = /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    rExpNumber = /^\+?[1-9][0-9]*$/,
    isSend = false; //是否在发送中  
    var id = utils.getSearchParam('id') || '';
    var part = utils.getSearchParam('part') || '';
    $body.find('.pageTitle').html(part);
    //校验Inquiry参数
    exports.inquiry = function(){
        var oData = {
            productId : id
        };
        oData.name = $name.val();
        if($.trim(oData.name) == ''){
            $name.focus();
            $error.text("Please enter your name.");
            return false;
        }
        oData.email = $email.val();
        if($.trim(oData.email) == '' || !rExpEmail.test(oData.email)){
            $email.focus();
            $error.text("Please enter correct email.");
            return false;
        }
        oData.targetPrice = $price.val();
        if(!rExpNumber.test(oData.targetPrice)){
            $price.focus();
            $error.text("Pleast enter correct target price.");
            return false;
        }
        oData.quantity = $quantity.val();
        if(!rExpNumber.test(oData.quantity)){
            $quantity.focus();
            $error.text("Pleast enter correct quantity.");
            return false;
        }
        oData.lookingFor = $content.val();
        if($.trim(oData.lookingFor) == ''){
            $content.focus();
            $error.text("Please enter looking for.");
            return false;
        }
        // if($file.val()){
        //     oData.file = $file.val();    
        // }         
        // oData.kaptcha = $.md5(oData.kaptcha);
        if(isSend) return false;
        isSend = true;
        if($file.val()){
            $("#fileForm").ajaxSubmit({
                url: window._c.path + 'upload/uploadSigle.wb',
                type:"post",
                dataType: 'json',
                success: function(data){
                   if(data.flag  === 0 && data.data){
                        oData.fileMd5 = data.data.attMd5; 
                        exports.inquiryProduct(oData);                    
                    }else{
                        $error.text(data.msg);
                        isSend = false;                
                    }                            
                },
                error:function(data){
                    $error.text(data.msg);
                    isSend = false;
                },
                // clearForm: true, 
                timeout: 300000                         
            }); 
        }else{
            exports.inquiryProduct(oData);
        }

        // $("#fileForm").ajaxSubmit({
        //     url: window._c.path + 'inquiry/product.wb',
        //     type:"post",
        //     dataType: 'json',
        //     data: {
        //         productId : id
        //     },
        //     success: function(data){
        //        if(data && data.flag  === 0){
        //             $name.val('');
        //             $email.val('');
        //             $content.val('');
        //             $file.val('');
        //             $error.text('');
        //             utils.tips('submit success');
        //             isSend = false;                        
        //         }else{
        //             $error.text(data.msg);
        //             isSend = false;                
        //         }                            
        //     },
        //     error:function(data){
        //         $error.text(data.msg);
        //         isSend = false;
        //     },
        //     // clearForm: true, 
        //     timeout: 300000                         
        // });
    };

    // 发布商品inquiry
    exports.inquiryProduct = function(data){
        server.inquiryProduct(data,function(data){
            $name.val('');
            $email.val('');
            $price.val('');
            $quantity.val('');
            $content.val('');
            $file.val('');
            $error.text('');
            utils.tips('submit success');
            setTimeout(function(){
                window.location.href = "/inquiry/success.html";
            },1000);
            isSend = false;  
        },function(data){
            $error.text(data.msg);
            isSend = false;   
        });
    };
    //获取产品详情内容
    exports.getProductDetailData = function(){
        server.productDetail({
            productId : id
        },function(data){
            data = data.data || {};
            profile = data.profile;
            $body.find('.productDetail').html(temple.inquiryProductInfo(profile));
            
        });
    };


    // 事件
    exports.action = function(){
        $body.on('click','.checkBtn',function(){
            exports.inquiry();
        })
        // 清除错误信息
        .on('focus','input',function(){
            $error.text('');
        });
    };

    exports.init = function(){
        common.init();
        $body.find('.currentLocation').html('Inquiry');
        exports.getProductDetailData();
        exports.action();
    };
    return exports;
})