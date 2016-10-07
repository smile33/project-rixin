define('main/product_index', ['jquery','main/utils','main/server','main/common','main/temple'], function($, utils, server, common, temple){
    var exports  = {},
    $body = $('body');
    // var id = utils.getSearchParam('id');
    var hash = window.location.hash;
    exports.fetchProductData = function(){
        server.categoryLeft({},function(data){
            $body.find('.category').html(temple.categoryLeftProduct(data.data));
        });
        utils.loading('show');
        server.productIndex(function(data){
            utils.loading();
            data = data.data;

            $body.find('.productContainer').html(temple.categoryTreeProduct(data.categories));
            $body.find('.initial-record-count').show();
            $body.find('#matching-records-count').html(data.totalProduct);
            if(hash){
                window.location.href = window.location.pathname+window.location.hash;
            }
            // $body.find('#main-right h1').html('Electronic Components');
        });

    };

    exports.init = function(){
        common.init();
        exports.fetchProductData();
    };
    return exports;
})