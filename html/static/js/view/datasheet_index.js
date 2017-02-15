define('main/datasheet_index', ['jquery','main/utils','main/server','main/common','main/temple','page_turning_plugin'], function($, utils, server, common, temple){
    var exports  = {},
    $body = $('body'),
    pageSize = 20;
    var key = utils.getSearchParam('key') || '';
    exports.getDatasheet = function(params){
        params = {
            page: params && params.pageIndex || 1,
            size : pageSize,
            key : key
        };
		utils.loading('show');
        PageTurningPlugin.pageServer(server.path_search_datasheet,params,function(data){
            utils.loading();
            if(data.data){
                data = data.data;
                if((data.items && !data.items.length) && data.page === 1){
                    showNoData();
                }else{
                    $body.find('.headline strong').html(data.total);
                    $body.find('.dataItem').html(temple.datasheetList(data.items));
                    PageTurningPlugin.setPageObj({
                        pageIndex : data.page,
                        pageLast : data.maxPage
                    },exports.getDatasheet);
                    $body.find('.searchResultContainer').show();
                }
            }else{
                showNoData();
            }

        });
    };
    function showNoData(){
        $body.find('.SiteMap').hide();
        $body.find('.noDataContainer').show().find('.key').html(key);
    }
    function setSearchInputValue(){
        setTimeout(function(){
            if($body.find('.tabSearch').length){
                $body.find('.tabSearch').eq(1).addClass('sele').siblings('a').removeClass('sele');
                $body.find('#searchInput').val(key);
            }else{
                setSearchInputValue();
            }
        },500);
    }
    // 事件
    exports.action = function(){
        $body.on('click','.redirectInquiryPage',function(){
            var self = $(this);
            if(self.hasClass('redirectInquiryPage')){
                window.location.href = '/inquiry/index.html?part='+key;
            }
        });
    };
    exports.init = function(){
        common.init();
        setSearchInputValue();
        $body.find('.currentLocation').html('Datasheet');
        exports.getDatasheet();
        exports.action();
    };
    return exports;
})