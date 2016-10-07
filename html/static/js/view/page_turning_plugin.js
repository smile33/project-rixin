(function() {
    var PageTurningPlugin = {
        pageObj : {},
        isFirst : true,
        pageListUI : function(result,place){
            var html = '<a href="#'+place+'" class="pageBtn" pageIndex="'+result.pageFirst+'"> &lt;&lt; </a>';
            html +='<a href="#'+place+'" class="pageBtn prevBtn">&lt;</a>'; 
            for(var i=result.from;i<=result.to;i++){
                html +='<a ';
                if(result.pageIndex == i){
                    html +='class="active" ';
                } 
                html +=' id="page_'+i+'" class="pageBtn" href="#'+place+'" pageIndex="'+i+'">'+i+'</a>'; 
            }       
            html +='<a href="#'+place+'"  class="pageBtn nextBtn">&gt;</a>'; 
            html +='<a href="#'+place+'" class="pageBtn" pageIndex="'+result.pageLast+'">&gt;&gt;</a>'; 
            return html; 
        },
        addClickAction : function(cbf){
            var _this = this;
            $('body').on('click','.pageContainer .pageBtn',function(){
                var target = $(this);
                var pageObj = _this.pageObj;
                
                if(target.hasClass('prevBtn')){
                    if(pageObj.pageIndex > 1){
                        cbf({pageIndex:--pageObj.pageIndex});
                    }
                }else if(target.hasClass('nextBtn')){
                    if(pageObj.pageIndex < pageObj.pageLast){
                        cbf({pageIndex:++pageObj.pageIndex});
                    }
                }else{
                    var page = target.attr('pageIndex');
                    if(page == pageObj.pageIndex){
                        return;
                    }
                    cbf({pageIndex:page});                
                }
            })
        },
        getPageParam : function(data){
            var showPageCount = data.showPageCount || 7;//显示多少页数
            var pageObj = {
                pageIndex : data.pageIndex || 1,
                pageFirst: 1,
                pageLast:data.pageLast
            };
            if(pageObj.pageLast - pageObj.pageIndex  >= showPageCount){
                pageObj.from = Math.max(pageObj.pageIndex - 2,1);
            }else{
                pageObj.from = Math.max(pageObj.pageLast-(showPageCount+2),1);
            }
            pageObj.to = Math.min(pageObj.from + (showPageCount+2),pageObj.pageLast);
            $('body').find('.pageContainer').html(this.pageListUI(pageObj,''));
            return pageObj;

        },
        setPageObj : function(data,cbf){
            this.pageObj = this.getPageParam(data);
            if(this.isFirst){
                this.addClickAction(cbf);
                this.isFirst = false;
            }
        },
        pageServer : function(url,params,cbf){
            $.ajax({
                url: url,
                dataType:'json',
                cache:false,
                type:'get',
                data:params,
                success:function(data){
                    if(data.flag  === 0){
                        cbf(data);
                    }
                }
            })

        }
    }
    window.PageTurningPlugin = PageTurningPlugin;

})(window);