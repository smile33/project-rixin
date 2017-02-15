define('main/order_index', ['jquery','main/utils','main/server','main/common','main/temple','jqui','page_turning_plugin'], function($, utils, server, common, temple, jqui){
    var exports  = {},
    $body = $('body'),
    $orderStatus = $body.find('#orderStatus'),
    $orderTime = $body.find('#orderTime'),
    $keyword = $body.find('#keyword'),
    pageSize = 10;
 //    unpaidCount = 0,
 //    cancelCount = 0;
	// confirmCount = 0;
    // var m = utils.getSearchParam('m') || 'all';
  //   $SelectLink.find('.'+m).addClass('select');
  //   function setStatusCount(){
  //       $SelectLink.find('.unpaid span').html(unpaidCount);
  //       $SelectLink.find('.cancel span').html(cancelCount);
		// $SelectLink.find('.confirm span').html(confirmCount);
  //   }
    // 我的order列表
    exports.orderList = function(params){
        params = {
            index: params && params.pageIndex || 1,
            size : pageSize,
            m : $orderStatus.val(),
            t : $orderTime.val() || 0,
            keyword : $keyword.val()  || ''
        };
        utils.loading('show');
        PageTurningPlugin.pageServer(server.path_order_list,params,function(data){
            utils.loading();
            data = data.data;
            var items = data.items || [];
            $body.find('.listContainer').html(temple.orderList(items));
            PageTurningPlugin.setPageObj({
                pageIndex : data.page,
                pageLast : data.maxPage
            },exports.orderList);
        });
    };

    // exports.getOrderStatusCount = function(){
    //     server.orderStatusCount(function(data){
    //         if(data.data){ 
    //             data = data.data;
    //             $SelectLink.find('.all span').html(data.all);
    //             unpaidCount = data.unpaid;
    //             cancelCount = data.cancel;
				// confirmCount = data.confirm;
    //             setStatusCount();
    //             $SelectLink.find('.completed span').html(data.complete);
    //         }
    //     });
    // };
    //删除order地址
    exports.deleteOrder = function(){
        var params = {
            id: id
        };
        server.deleteOrder(params,function(data){
            utils.tips('success');
            exports.orderList();
            // var trObj = $body.find('.listContainer .table[_id='+id+']');
            // trObj.find('.status').html('Canceled');
            // trObj.find('.deleteBtn').closest('div').remove();
            // unpaidCount--;
            // cancelCount++;
            // setStatusCount();
        },function(data){
            utils.tips(data.msg);
        });
    }
    // 事件
    exports.action = function(){
        $body.on('click','.deleteBtn,.searchBtn',function(){
            var self = $(this);
            if(self.hasClass('deleteBtn')){
                id = self.closest('.orderTable').attr('_id');
                $("#deleteDialog").dialog("open");
            }else if(self.hasClass('searchBtn')){
                exports.orderList();
            }
        });
        $orderStatus.change(function(){
            exports.orderList();
        });
        $orderTime.change(function(){;
            exports.orderList();
        });
        
    };
    exports.init = function(){
        common.init(true);
        common.userSideBar();
        // exports.getOrderStatusCount();
        exports.orderList();
        exports.action();
        common.sureDialog($("#deleteDialog"),exports.deleteOrder);
    };
    return exports;
})