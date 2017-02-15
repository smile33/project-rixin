define('main/product_index', ['jquery','main/utils','main/server','main/common','main/temple'], function($, utils, server, common, temple){
    var exports  = {},
    $body = $('body');
    var cid = utils.getSearchParam('cid') || '40d4f62b7bad45dcb2a7e2c0f60da131';
    console.log(cid);
    exports.fetchProductData = function(){
        // server.categoryLeft({},function(data){
        //     $body.find('.category').html(temple.categoryLeftProduct(data.data));
        // });
        utils.loading('show');
        server.productIndex({
            categoryId: cid
        },function(data){
            utils.loading();
            data = data.data;
            $body.find('.productContainer').html(temple.categoryTreeProduct(data.categories));
            // $body.find('.initial-record-count').show();
            // $body.find('#matching-records-count').html(data.totalProduct);
            $body.find('.currentLocation').html('Products Index ( results: ' + data.totalProduct + ' )');
            if(window.location.hash){//为了跳转锚点
                window.location.href = window.location.href;
            }
            // $body.find('#main-right h1').html('Electronic Components');
        });

    };
    exports.fetchCategoryLeftProductData = function(){
        server.categoryLeft({},function(data){
            $body.find('.category').html(temple.categoryLeftProduct(data.data,cid));
        });
    };
    exports.action = function(){
        $body.on('click','.firstCategory,.secondCategory',function(){
            var self = $(this);
            if(self.hasClass('firstCategory')){
                cid = self.attr('cid');
                $body.find('.category .choose').removeClass('choose');
                self.addClass('choose');
                exports.fetchProductData();
            }else if(self.hasClass('secondCategory')){
                cid = self.attr('cid');
                exports.fetchProductData();
            }
        });
    };
    
    exports.init = function(){
        common.init();
        $body.find('.currentLocation').html('Products Index (results: 0)');
        exports.fetchCategoryLeftProductData();
        exports.fetchProductData();
        exports.action();
    };
    return exports;
})