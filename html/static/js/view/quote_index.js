define('main/quote_index', ['jquery','main/utils','main/server','main/common','main/temple','jqui','page_turning_plugin'], function($, utils, server, common, temple,jqui){
    var exports  = {},
    $body = $('body'),
    $headList = $body.find('.headList'),
    $SelectLink = $body.find('.SelectLink'),
    pageSize = 10;
    var m = utils.getSearchParam('m') || 'all';
    $SelectLink.find('.'+m).addClass('select');
    // 我的inquiry列表
    exports.inquiryList = function(params){
        params = {
            index: params && params.pageIndex || 1,
            size : pageSize,
            m : m
        };
        PageTurningPlugin.pageServer(server.path_inquiry_list,params,function(data){
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
        $body.on('click','.deleteBtn',function(){
            var self = $(this);
            id = self.attr('_id');
            if(self.hasClass('deleteBtn')){
                $("#deleteDialog").dialog("open");
            }
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