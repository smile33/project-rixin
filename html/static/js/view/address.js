define('main/address', ['jquery','main/server','main/common','main/temple','main/utils','jqui','page_turning_plugin'], function($, server, common, temple, utils, jqui){
    var exports  = {},
    id,
    $body = $('body'),
    count = 0,//total address count
    pageSize = 10;

    // 获取收货地址列表
    exports.deliveryAddressList = function(params){
        params = {
            index: params && params.pageIndex || 1,
            size : pageSize
        };
        PageTurningPlugin.pageServer(server.path_delivery_address_list,params,function(data){
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
        // server.deliveryAddressList(params,function(data){
        //     data = data.data;
        //     var items = data.items || [];
        //     $body.find('.addressNumber').html(data.total);
        //     $body.find('.addressContent').html(temple.addressList(items));

        //     addressPageObj = temple.getPageParam({
        //         pageIndex : data.page,
        //         pageLast : data.maxPage,
        //         pageDom : $body.find('.pageContainer')
        //     });
        // });
    };

    //设置默认收货地址
    exports.setDeliveryAddressDefault = function(){
        var params = {
            id: id
        };
        server.setDeliveryAddressDefault(params,function(data){
            isSend = false;
            utils.tips('success');
            $body.find('.addressContent .operate').show();
            $body.find('.addressContent ul[_id='+id+'] .operate').hide();
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
            $body.find('.addressContent ul[_id='+id+']').remove();
            $body.find('.addressNumber').html(--count);
        },function(data){
            utils.tips(data.msg);
        });
    }
    // 事件
    exports.action = function(){
        $body.on('click','.operate,.deleteBtn',function(){
            var self = $(this);
            id = self.closest('ul').attr('_id');
            if(self.hasClass('operate')){
                $("#setAsDefaultDialog").dialog("open");
            }else if(self.hasClass('deleteBtn')){
                $("#deleteDialog").dialog("open");
            }
        });
    };

    exports.init = function(){
        common.init(true);
        common.userSideBar();
        exports.deliveryAddressList();
        exports.action();
        common.sureDialog($("#setAsDefaultDialog"),exports.setDeliveryAddressDefault);
        common.sureDialog($("#deleteDialog"),exports.deleteDeliveryAddress);
    };

    return exports;
})