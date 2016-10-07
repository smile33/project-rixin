define('main/simple', ['main/common'], function(common){
    var exports  = {};
    // 初始化
    exports.init = function(){
        common.init();
    };
    return exports;
})