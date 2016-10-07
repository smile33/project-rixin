define('main/article', ['jquery','main/utils','main/server','main/common','main/temple'], function($, utils, server, common, temple){
    var exports  = {},
    $body = $('body');
    var tpl = utils.getSearchParam('tpl');

    exports.init = function(){
        common.init();
        common.articleSideBar();
        common.articleContent(tpl);
       
    };
    return exports;
})