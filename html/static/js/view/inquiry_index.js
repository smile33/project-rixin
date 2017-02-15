define('main/inquiry_index', ['jquery','jqform','main/utils','main/server','main/common','main/temple'], function($, jqform, utils, server, common, temple){
    var exports  = {},
    $body = $('body'),
    $partNum = $body.find('#post_inquiry_partNum'),
    $name = $body.find('#post_inquiry_name'),
    $email = $body.find('#post_inquiry_email'),
    $price = $body.find('#post_inquiry_price'),
    $quantity = $body.find('#post_inquiry_quantity'),
    $content = $body.find('#post_inquiry_content'),
    $file = $body.find('#file');
    $error = $body.find('.error_msg'),
    rExpEmail = /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    rExpNumber = /^\+?[1-9][0-9]*$/,
	rExpPositive = /^[0-9].*$/,
    isSend = false; //是否在发送中  
    // var id = utils.getSearchParam('id') || '';
    var part = utils.getSearchParam('part') || '';
    $body.find('.partName').html(part);
    $partNum.val(part);
    //校验Inquiry参数
    exports.inquiry = function(){
        var oData = {
            productId : '0'
        };
        oData.partNum = $partNum.val();
        if($.trim(oData.partNum) == ''){
            $partNum.focus();
            $error.text("Please enter your  Part No.");
            return false;
        }
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
        if(!rExpPositive.test(oData.targetPrice)){
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
                        exports.inquirySearch(oData);                    
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
            exports.inquirySearch(oData);
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
    exports.inquirySearch = function(data){
        server.inquirySearch(data,function(data){
            $name.val('');
            $email.val('');
            $price.val('');
            $quantity.val('');
            $content.val('');
            $file.val('');
            $error.text('');
            $body.find('.postInquiryContainer .title').html('Upload BOM from EXCEL Spreadsheet');
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
    // //获取产品详情内容
    // exports.getProductDetailData = function(){
    //     server.productDetail({
    //         productId : id
    //     },function(data){
    //         data = data.data || {};
    //         profile = data.profile;
    //         $body.find('.productDetail').html(temple.inquiryProductInfo(profile));
            
    //     });
    // };


    // 事件
    exports.action = function(){
        $body.on('click','.postInquirySubmit,.postInquiryContainer .title',function(){
            
            var self = $(this);
            if(self.hasClass('postInquirySubmit')){
                console.log(34);
                exports.inquiry();
            }else if(self.hasClass('title')){
                $body.find('#file').click();
            }
        })
        // 清除错误信息
        .on('focus','input',function(){
            $error.text('');
        });
        $body.find('#file').change(function(){
            var fileVal = $body.find('#file').val();
            var html = 'Upload BOM from EXCEL Spreadsheet';
            if(fileVal){
                html = fileVal;
            }
            $body.find('.postInquiryContainer .title').html(html);
        })
    };

    exports.init = function(){
        common.init();
        $body.find('.currentLocation').html('Inquiry');
        // exports.getProductDetailData();
        exports.action();
    };
    return exports;
})