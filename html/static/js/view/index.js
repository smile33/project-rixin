define('main/index', ['jquery','main/utils','main/server','main/temple','main/common','md5','jqsuperslide'], function($, utils, server, temple, common, md5){
    var exports = {},
        $body = $('body'),
        // $name = $body.find('#name'),
        // $email = $body.find('#email'),
        // $kaptcha = $body.find('#kaptcha'),
        // $content = $body.find('#content'),
        // $error = $body.find('#error_msg'),
        $tabHead = $body.find('#tabHead'),
        $tabHeadPanel = $body.find('#tabHeadPanel'),
        // path = window._c.path,
        // rExpEmail = /^([a-zA-Z0-9]+[_|\_|\.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
        isSend = false;
   //  exports.quickInquiry = function(){
   //      var oData = {};
   //      oData.name = $name.val();
   //      if($.trim(oData.name) == ''){
   //          $name.focus();
   //          $error.text("Please enter your name.");
   //          return false;
   //      }
   //      oData.email = $email.val();
   //      if($.trim(oData.email) == '' || !rExpEmail.test(oData.email)){
   //          $email.focus();
   //          $error.text("Please enter correct email.");
   //          return false;
   //      }
   //      oData.kaptcha = $kaptcha.val();
   //      if($.trim(oData.kaptcha) == '' || oData.kaptcha.length != 4){
   //          $kaptcha.focus();
   //          $error.text("Please enter authcode.");
   //          return false;
   //      }
   //      // oData.kaptcha = '110ee873d70440eb80b10315e23661cf';
   //      oData.lookingFor = $content.val();
   //      if($.trim(oData.lookingFor) == ''){
   //          $content.focus();
   //          $error.text("Please enter looking for.");
   //          return false;
   //      }
   //      // oData.kaptcha = $.md5(oData.kaptcha);
   //      if(isSend) return false;
   //      isSend = true;
   //      server.quickInquiry(oData,function(data){
   //          $name.val('');
   //          $email.val('');
   //          $kaptcha.val('');
   //          $content.val('');
   //          $error.text('');
   //          utils.tips('submit success');
   //          isSend = false;
			// $body.find('.kaptcha').attr('src',path+'kaptcha.wb?t='+Math.random());
   //      },function(data){
   //          $error.text(data.msg);
   //          isSend = false; 
   //      });

   //  };
    exports.fetchHomeData = function(){
        server.home(function(data){
            data = data.data;
            $body.find('.banner img').attr('src',data.bigAdViews[0].logo);
            $body.find('.bannerContainer').html(temple.indexBannerViews(data.bigAdViews));
            var isSlide = data.bigAdViews.length > 1 ? true : false;
            $(".fullSlide").slide({ 
                titCell:".hd ul", 
                mainCell:".bd ul", 
                effect:"leftLoop", 
                vis:"auto", 
                autoPlay:isSlide, 
                autoPage:isSlide, 
                trigger:"click",
                interTime: 5000
            });
            $body.find('.hotProductViews').html(temple.hotProductViews(data.homeHotProductViews));
            $body.find('.specialProductContainer').html(temple.specialProductView(data.specialProductView));
            $body.find('.brandList').html(temple.globalBrandViews(data.globalBrandViews));
            var html = temple.categoryProductUlViews(data.categoryProductViews);
            $tabHead.html(html.tabHeadHtml);
            $tabHeadPanel.html(html.tabPanelHtml);
            
            
        });
    };
    
    exports.action = function(){
        $body.on('click','.quickInquiryBtn,.kaptcha,.buy-more,.buy-reply,.productsChoose li,.TabIntro li',function(){
            var self = $(this);
            var index;
            // if(self.hasClass('quickInquiryBtn')){
            //     exports.quickInquiry();
            // }else if(self.hasClass('kaptcha')){ 
            //     self.attr('src',path+'kaptcha.wb?t='+Math.random());
            // }else 
            if(self.hasClass('buy-more')){
                var $searchInput = $('#searchInput');
                $searchInput.focus();
                $searchInput.val('');
            }else if(self.hasClass('buy-reply')){
                $content.focus();
            }else if(self.closest('ul').hasClass('productsChoose')){
                index = self.index('.productsChoose li');
                self.addClass('tabSelect').siblings('li').removeClass('tabSelect');
                $tabHeadPanel.find('.panel').hide().eq(index).show();
            }else if(self.closest('ul').hasClass('TabIntro')){
                index = self.index('.TabIntro li');
                self.addClass('tabSelect').siblings('li').removeClass('tabSelect');
                $body.find('.TabIntroPanel').hide().eq(index).show();
                // console.log(123);
            }
        })
        // // 清除错误信息
        // .on('focus','quickInquiry input',function(){
        //     $error.text('');
        // });
    }
    exports.init = function(){
        common.init();
        exports.fetchHomeData();
        // $body.find('.kaptcha').attr('src',path+'/kaptcha.wb');
        // exports.tabClick();
        exports.action();
    };
    return exports;
})