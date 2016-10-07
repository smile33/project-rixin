define('main/common', ['jquery','main/utils','main/server','main/temple'], function($, utils, server, temple){

    var exports = {},
    path  = window._c.path,
    isLogin = 0,
    $body   = $('body');    
    
    // 头部-用户登录模块
    function setLoiginSiteNav(data){
        var html = '';
        if(isLogin === 1){
            html = '<span style="margin:5px;">Hello! Welcome to ' + window._c.websiteName + '!</span>' +
                '<a href="/member/index.html" id="aLogin">'+(data.data.realname || data.data.account)+'</a>' +
                '<a href="/member/logout.html" id="aLogout">Logout</a>';
            $body.find('.TopSum').html(html);    
        }else{
            html = '<span style="margin:5px;">Hello! Welcome to ' + window._c.websiteName + '!</span>';
            $body.find('.TopSum span').html(html);
            $body.find('.logout').remove();
        }
    };
    function hasLoadedSiteNav(data){
        if($body.find('.TopSum').length && isLogin !== 0 ){
            setLoiginSiteNav(data);
        }else{
            setTimeout(function(){
                hasLoadedSiteNav(data);
            },500);
        }
    }
    //渲染头部购物车样式
    function setHeadShopCart(data){
        if(data.length){
            $body.find('#ShoppingCart').html(temple.headShopCart(data));
            $body.find('.Cart .shopCartCount').html(data.length);
        }
    }
    //判断头部购物车是否清空
    function isEmptyHeadShopCart(){
        var $ShoppingCart = $body.find('#ShoppingCart');
        if(!$ShoppingCart.find('.blockItem').length){
            $ShoppingCart.html('<li class="emptyCart"><a href="/product/index.html">Shopping Cart empty Oh! Just try to find sth</a></li>');
        }
    }

    function handlerKeyup(e) {
        if (e.keyCode === 13) {
            $body.find('.searchSubmit').click();
        }
    }

    function bindKeyEvent() {
        if(document.getElementById('searchInput')){
            document.getElementById('searchInput').addEventListener('keyup', handlerKeyup, false);
        }else{
            setTimeout(function(){
                bindKeyEvent()
            },500);
        }
    }

    //重置title
    exports.setPageTitle = function(){
        document.title = document.title + ' - ' + window._c.websiteName;
    };
    // 导航栏
    exports.siteNav = function(){
        utils.TPL.loadTemplates(['site_nav'],function(){        
            var html = utils.TPL.get.call(exports.TPL,'site_nav');
            $body.find('#site-nav').html(html);
        });
    };
    // 头部
    exports.header = function(){
        utils.TPL.loadTemplates(['header'],function(){        
            var html = utils.TPL.get.call(exports.TPL,'header');
            var $header = $body.find('#header');
            $header.html(html);
            var url = window.location.pathname;
            if(url === '/article/about.html'){
                url += '?tpl=about_us';
            }
            $header.find('.navTab[href="'+url+'"]').addClass('highlight');
            exports.headShopCart();
        });
    };
    // 尾部
    exports.footer = function(){
        utils.TPL.loadTemplates(['footer'],function(){        
            var html = utils.TPL.get.call(exports.TPL,'footer');
            $body.find('#footer').html(html);
        });
    };
    exports.siteMap = function(){
        $body.find('.SiteMap').html('Current Location:<a href="/">'+window._c.websiteName+'</a> &gt; <span class="currentLocation"></span>');
    };
    // 个人中心左侧栏
    exports.userSideBar = function(){
        utils.TPL.loadTemplates(['user_side_bar'],function(){        
            var html = utils.TPL.get.call(exports.TPL,'user_side_bar');
            $body.find('.sidebar').html(html);
            var url = window.location.pathname;
            $body.find('.oneMenuItem[href="'+url+'"]').addClass('select');
            // select
        });
    };
    // 文章左侧栏
    exports.articleSideBar = function(){
        utils.TPL.loadTemplates(['article_site_bar'],function(){        
            var html = utils.TPL.get.call(exports.TPL,'article_site_bar');
            $body.find('.sidebar').html(html);
            var url = window.location.pathname;
            $body.find('.oneMenuItem[href="'+url+'"]').addClass('select');
            // select
        });
    };
    // 文章内容
    exports.articleContent = function(tpl){
        if(tpl){
            tpl = window._c.websiteName.toLowerCase() + '_' + tpl;
            utils.TPL.loadTemplates([tpl],function(){        
                var html = utils.TPL.get.call(exports.TPL,tpl);
                $body.find('.content').html(html);
                $body.find('.currentLocation').html($body.find('.topic').html());
                // select
            });
        }
    };
    //获取登录信息
    exports.isLogin = function(isNeedLogin){
        server.loginInfo(function(data){
            window.userInfo = data.data;
            hasLoadedSiteNav(data);
            isLogin = 1;
        },function(data){
            isLogin = -1;
            if(isNeedLogin){
                window.location.href = '/member/login.html?redirect_url='+window.location.pathname+window.location.search;
            }
            hasLoadedSiteNav(data);
        });
    };

    // 获取头部购物车数据
    exports.headShopCart = function(){
        if(!isLogin){
            setTimeout(function(){
                exports.headShopCart();
            },500);
        }else{
            if(isLogin === 1){//已登录，则请求购物车数据
                server.myShopCart({
                    size: 50,
                    index: 1
                },function(data){
                    if(data.data){
                        setHeadShopCart(data.data);
                    }
                });
            }else if(isLogin === -1){//未登录，则读取缓存数据
                var data = utils.STORE.getItem('shopCart') || [];
                setHeadShopCart(data);
            }
        }
    };
    //添加购物车
    exports.addShopCart = function(oData,unloginCbf,cbf){
        if(isLogin === 1){
            //已登录，添加购物车
            server.addShopCart(oData,function(data){
                cbf();
            },function(data){
                utils.tips('fail!');
            });
        }else if(isLogin === -1){
            //未登录，缓存本地
            unloginCbf();
            setTimeout(function(){
                cbf();
            },500);//本地缓存数据需要时间
            // utils.STORE.setItem('shopCart',oData);
        };
    };

    // 删除购物车
    exports.deleteShopCart = function(id,obj,index){
        var params = {
            id: id
        };
        var $ShoppingCart = $body.find('#ShoppingCart');
        if(isLogin === 1){
            server.deleteShopCart(params,function(data){
                utils.tips('success');
                obj.remove();
                var num = parseInt($body.find('.Cart .shopCartCount').html());
                $body.find('.Cart .shopCartCount').html(num-1);
                if(index !== undefined){//若删除的是购物车页面，则需要删除头部购物车数据
                    $ShoppingCart.find('.blockItem').eq(index).remove();
                }
                isEmptyHeadShopCart();
            },function(data){
                utils.tips(data.msg);
            });
        }else if(isLogin === -1){
            var shopCartArray = utils.STORE.getItem('shopCart') || [];
            shopCartArray.splice(id,1);
            utils.STORE.setItem('shopCart',shopCartArray);
            utils.tips('success');
            obj.remove();
            var num = parseInt($body.find('.Cart .shopCartCount').html());
            $body.find('.Cart .shopCartCount').html(num-1);
            isEmptyHeadShopCart();
            // window.location.reload();
        };
        // '<li class="emptyCart"><a href="/product/index.html">Shopping Cart empty Oh! Just try to find sth</a></li>';
    }
    exports.sureDialog = function(dialogObj,cbf){
        dialogObj.dialog({
          autoOpen: false,
          modal: true,
          buttons : {
            "Confirm" : function() {
                cbf();
              // exports.deleteDeliveryAddress();
                $(this).dialog("close");
            },
            "Cancel" : function() {
                $(this).dialog("close");
            }
          }
        });
    }
    // 事件
    exports.action = function(){
        $body.on('mouseover','.TopMenu .Item',function(){
            var ul = this.getElementsByTagName("ul")[0];
            if(ul){
                ul.style.display = "block";
                this.style.backgroundColor = "#FFF";
                this.onmouseout = function () {
                    ul.style.display = "none";
                    this.style.backgroundColor = "";
                }  
            }

        }).on('click','.tabSearch,.searchSubmit,.headDeleteShopCartBtn,.needLogin',function(){
            var self = $(this);
            var index;
            if(self.hasClass('tabSearch')){
                index = self.index('.tabSearch');
                self.addClass('sele').siblings('a').removeClass('sele');
            }else if(self.hasClass('searchSubmit')){
                var searchType = $body.find('.sele').attr('v');
                var searchValue = $body.find('#searchInput').val();
                if(searchValue.length <= 3){
                    utils.tips('Key words need to be more precise!');
                    return false;
                }
                if(searchType === 'Product'){
                    window.location.href = '/product/search.html?key='+searchValue;
                }else{
                    window.location.href = '/datasheet/index.html?key='+searchValue;
                }
            }else if(self.hasClass('headDeleteShopCartBtn')){
                var itemObj = self.closest('.blockItem');
                var id = itemObj.attr('_id');
                exports.deleteShopCart(id,itemObj);
            }else if(self.hasClass('needLogin')){
                if(isLogin === 1){
                    window.location.href = self.attr('link');
                }else{
                    window.location.href = '/member/login.html?redirect_url='+self.attr('link');
                }
                
            }
        })


    };

    // 返回头部
    exports.back = function(){
        
    };

    exports.init = function(isNeedLogin){
        isNeedLogin = isNeedLogin || '';
        exports.isLogin(isNeedLogin);
        exports.siteNav();
        exports.header();
        exports.siteMap();
        exports.footer();
        exports.setPageTitle();
        exports.action();
        bindKeyEvent();
    };

    return exports;
})