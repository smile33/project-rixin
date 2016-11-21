define('main/order_detail', ['jquery','main/utils','main/server','main/temple'], function($, utils, server, temple){
    var exports  = {},
    $body = $('body'),
    id = utils.getSearchParam('id');
    // 我的order详情
    exports.getOrderDetail = function(){
        server.orderDetail(id, function(data){
            if(data.data){
                data = data.data;
                $body.find('.orderItems').after(temple.orderDetailList(data.orderItems));
                
                $body.find('#companyLogo').attr('src', data.companyLogo);
                $body.find('.salesAddress').html(data.salesAddress);
                $body.find('.salesEmail').html(data.salesEmail);
                $body.find('.salesTel').html(data.salesTel);
                $body.find('.companyName').html(data.companyName);
                $body.find('.bankAccountNo').html(data.bankAccountNo);
                $body.find('.invoiceNo').html(data.invoiceNo);
                if(data.invoiceDate){
                    $body.find('.invoiceDate').html(utils.tranTimeYMD(data.invoiceDate));
                }
                $body.find('.bankName').html(data.bankName);
                $body.find('.purchaseOrder').html(data.purchaseOrder);
                $body.find('.swiftCode').html(data.swiftCode);
                $body.find('.masterTracker').html(data.masterTracker);
                $body.find('.region').html(data.region);

                $body.find('.salesName').html(data.salesName);

                $body.find('.shipVia').html(data.shipVia);
                $body.find('.customerNum').html(data.customerNum);
                $body.find('.orderDate').html(utils.tranTimeYMD(data.orderDate || 0));
                $body.find('.terms').html(data.terms);
                $body.find('.billToCompany').html(data.billToCompany);
                $body.find('.shipToCompany').html(data.shipToCompany);
                $body.find('.billToAddress').html(data.billToAddress);
                $body.find('.shipToAddress').html(data.shipToAddress);
                $body.find('.tel').html(data.tel);
                $body.find('.fax').html(data.fax);
                $body.find('.email').html(data.email);

                $body.find('.orderAmt').html(data.orderAmt);
                $body.find('.wireTransferFee').html(data.wireTransferFee);
                $body.find('.freight').html(data.freight);
                $body.find('.totalAmt').html(data.totalAmt);             
            }
        });
    };
    // 事件
    exports.action = function(){
        $body.on('click','.toPrintBtn',function(){
            window.print();
        });
        
    };
    exports.init = function(){
        exports.getOrderDetail();
        exports.action();
    };
    return exports;
})