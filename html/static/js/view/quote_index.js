define('main/quote_index', ['jquery','main/utils','main/server','main/common','main/temple','jqui','page_turning_plugin'], function($, utils, server, common, temple,jqui){
    var exports  = {},
    $body = $('body'),
    $inquiryStatus = $body.find('#inquiryStatus'),
    $inquiryTime = $body.find('#inquiryTime'),
    $keyword = $body.find('#keyword'),
    pageSize = 10;
    // var m = 'all';
    // $SelectLink.find('.'+m).addClass('select');
    // 我的inquiry列表
    exports.inquiryList = function(params){
        params = {
            index: params && params.pageIndex || 1,
            size : pageSize,
            m : $inquiryStatus.val() || 'all',
            t : $inquiryTime.val() || 0,
            keyword : $keyword.val()  || ''
        };
        utils.loading('show');
        PageTurningPlugin.pageServer(server.path_inquiry_list,params,function(data){
            utils.loading();
            data = data.data;
            var items = data.items || [];
            $body.find('.listContainer').html(temple.inquiryList(items));
            PageTurningPlugin.setPageObj({
                pageIndex : data.page,
                pageLast : data.maxPage
            },exports.inquiryList);
        });
    };
    //删除inquiry
    exports.deleteInquiry = function(){
        var params = {
            id: id
        };
        server.deleteInquiry(params,function(data){
            utils.tips('success');
            var deleteBtnObj = $body.find('.listContainer .deleteBtn[_id='+id+']');
            deleteBtnObj.closest('tr').find('.status').html('Cancel');
            deleteBtnObj.remove();
        },function(data){
            utils.tips(data.msg);
        });
    }
    // 事件
    exports.action = function(){
        $body.on('click','.deleteBtn,.searchBtn',function(){
            var self = $(this);
            if(self.hasClass('deleteBtn')){
                id = self.attr('_id');
                $("#deleteDialog").dialog("open");
            }else if(self.hasClass('searchBtn')){
                exports.inquiryList();
            }
        });
        $inquiryStatus.change(function(){
            exports.inquiryList();
        });
        $inquiryTime.change(function(){;
            exports.inquiryList();
        });

        
    };
    exports.init = function(){
        common.init(true);
        common.userSideBar();
        exports.inquiryList();
        exports.action();
        common.sureDialog($("#deleteDialog"),exports.deleteInquiry);
    };
    return exports;
})