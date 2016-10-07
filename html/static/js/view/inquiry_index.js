define('main/inquiry_index', ['jquery','jqform','main/utils','main/server','main/common'], function($, jqform, utils, server, common){
    var exports  = {},
    $body = $('body'),
    $name = $body.find('#name'),
    $email = $body.find('#email'),
    $content = $body.find('#content'),
    $file = $body.find('#file');
    $error = $body.find('#error_msg'),
    rExpEmail = /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    isSend = false; //是否在发送中  
    var id = utils.getSearchParam('id') || '';
    var part = utils.getSearchParam('part') || '';
    $body.find('.pageTitle').html(part);
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
        oData.lookingFor = $content.val();
        if($.trim(oData.lookingFor) == ''){
            $content.focus();
            $error.text("Please enter looking for.");
            return false;
        }
        if($file.val()){
            oData.file = $file.val();    
        }         
        // oData.kaptcha = $.md5(oData.kaptcha);
        if(isSend) return false;
        isSend = true;
        $("#fileForm").ajaxSubmit({
            url: window._c.path + 'inquiry/product.wb',
            type:"post",
            dataType: 'json',
            data: {
                productId : id
            },
            success: function(data){
               if(data && data.flag  === 0){
                    $name.val('');
                    $email.val('');
                    $content.val('');
                    $file.val('');
                    $error.text('');
                    utils.tips('submit success');
                    isSend = false;                        
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
        exports.action();
    };
    return exports;
})