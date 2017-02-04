define('main/category_index', ['jquery','main/utils','main/server','main/common','main/temple','page_turning_plugin'], function($, utils, server, common, temple){
    var exports  = {},
    $body = $('body'),
    pageSize = 10;
    var categoryId = utils.getSearchParam('categoryId') || '';
    var categoryName = utils.getSearchParam('categoryName') || '';
    exports.productCategory = function(params){
        params = {
            index: params && params.pageIndex || 1,
            size : pageSize,
            categoryId : categoryId
        };
		utils.loading('show');
        PageTurningPlugin.pageServer(server.path_product_category,params,function(data){
			utils.loading();
            if(data.data && data.data.items){
                data = data.data;
                console.log(data.items);
                $body.find('#productTable tbody').html(temple.productCategory(data.items));
                $body.find('.headline strong').html(data.total);
                PageTurningPlugin.setPageObj({
                    pageIndex : data.page,
                    pageLast : data.maxPage
                },exports.productCategory);
            }

        });
    };
    exports.init = function(){
        common.init();
        $body.find('.currentLocation').html('<a href="/product/index.html">Product List</a> &gt; '+decodeURIComponent(categoryName));
        exports.productCategory();
    };
    return exports;
})