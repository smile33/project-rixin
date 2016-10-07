define('main/brand_detail', ['jquery','main/utils','main/server','main/common','main/temple','page_turning_plugin'], function($, utils, server, common, temple){
    var exports  = {},
    $body = $('body'),
    pageSize = 6;
    var id = utils.getSearchParam('id') || '';
    exports.getBrandDetailData = function(params){
        server.brandDetail({
            id : id
        },function(data){
            console.log(data);
            data = data.data || {};
            var logoHtml = '<img height="54" alt="'+data.mfrName+' logo" width="175" src="'+data.logo+'" title="'+data.mfrName+' logo"/>';
            $body.find('.supplier-logo').html(logoHtml);
            $body.find('.supplier-description h1').html(data.mfrName);
            $body.find('.supplier-description p').html(data.shortDescription);
            $body.find('.currentLocation').html('<a href="/brand/index.html">Brand Index</a> &gt; '+data.mfrName);
        });
    };
    exports.brandNewProduct = function(params){
        params = {
            index: params && params.pageIndex || 1,
            size : pageSize,
            mfrId : id
        };
        PageTurningPlugin.pageServer(server.path_brand_new_product,params,function(data){
            if(data.data && data.data.items){
                data = data.data;
                $body.find('.newproducttable').html(temple.brandNewProduct(data.items));
                PageTurningPlugin.setPageObj({
                    pageIndex : data.page,
                    pageLast : data.maxPage
                },exports.brandNewProduct);
            }

        });
    };
    exports.init = function(){
        common.init();
        exports.getBrandDetailData();
        exports.brandNewProduct();
    };
    return exports;
})