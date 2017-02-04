define('main/brand_index', ['jquery','main/utils','main/server','main/common','main/temple','page_turning_plugin'], function($, utils, server, common, temple){
    var exports  = {},
    $body = $('body'),
    $brandKey = $body.find('#brandKey'),
    $keyword = $body.find('#keyword'),
    $keyTitle = $body.find('.keyTitle'),
    pageSize = 20;
    var key = utils.getSearchParam('key') || '';
    var keyword = '';
    exports.getBrandData = function(params){
        params = {
            index: params && params.pageIndex || 1,
            size : pageSize,
            key : key,
            keyword: $keyword.val()  || ''
        };
        utils.loading('show');
        PageTurningPlugin.pageServer(server.path_brand_index,params,function(data){
            utils.loading();
            if(data.data && data.data.items){
                data = data.data;
                $body.find('.brandItem').html(temple.brandList(data.items));
                PageTurningPlugin.setPageObj({
                    pageIndex : data.page,
                    pageLast : data.maxPage
                },exports.getBrandData);
            }

        });
    };
    // 事件
    exports.action = function(){
        // $body.on('click','.filter',function(){
        //     var self = $(this);
        //     key = self.attr('v');
        //     exports.getBrandData();
        // });
        $body.on('click','.searchBtn',function(){
            exports.getBrandData();
        });
        $brandKey.change(function(){
            key = $brandKey.val();
            $keyTitle.html(key);
            exports.getBrandData();
        });
        
    };
    exports.init = function(){
        common.init();
        $body.find('.currentLocation').html('Brand Index');
        exports.getBrandData();
        exports.action();

    };
    return exports;
})