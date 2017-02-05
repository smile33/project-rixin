define('main/post_inquiry', ['jquery','jqform','main/utils','main/server','main/common','jqui'], function($, jqform, utils, server, common, jqui){
    var exports = {},
    path  = window._c.path,
    $body   = $('body'),

    //inquiry begin
    path = window._c.path,
    rExpEmail = /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    rExpNumber = /^\+?[1-9][0-9]*$/,
    rExpPositive = /^[0-9].*$/,
    isSend = false;
    //post inquiry
    var id = utils.getSearchParam('id') || '';
    exports.toPostInquiry = function(productId, successCbf) {
        var $name = $body.find('#post_inquiry_name');
        var $email = $body.find('#post_inquiry_email');
        var $price = $body.find('#post_inquiry_price');
        var $quantity = $body.find('#post_inquiry_quantity');
        var $content = $body.find('#post_inquiry_content');
        var $file = $body.find('#file');
        var $error = $body.find('.postInquiryContainer .error_msg');
        var oData = {
            productId : productId
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
                        inquiryProduct(oData, successCbf);                    
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
            inquiryProduct(oData, successCbf);
        }
        function inquiryProduct(data,successCbf) {
            server.inquiryProduct(data,function(data){
                $name.val('');
                $email.val('');
                $price.val('');
                $quantity.val('');
                $content.val('');
                $file.val('');
                $body.find('.postInquiryContainer .title').html('Upload BOM from EXCEL Spreadsheet');
                $error.text('');
                utils.tips('submit success');
                successCbf && successCbf();
                // setTimeout(function(){
                //     window.location.href = "/inquiry/success.html";
                // },1000);
                isSend = false;  
            },function(data){
                $error.text(data.msg);
                isSend = false;   
            });
        };
    };
    // 事件
    exports.action = function(){
        $body.on('click','.inquiry,.postInquirySubmit,.title',function(){
            var self = $(this);
            if(self.hasClass('inquiry')){
                $("#postInquiry").dialog("open");
            }else if(self.hasClass('postInquirySubmit')){
                exports.toPostInquiry(id,function(){
                    $("#postInquiry").dialog("close");
                });
            }else if(self.hasClass('title')){
                $body.find('#file').click();
            }
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
        common.inquiryDialog($("#postInquiry"));
        exports.action();
    };
    return exports;
})