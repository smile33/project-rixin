define('main/member_index', ['jquery','main/utils','main/server','main/common'], function($, utils, server, common){
    var exports  = {},
    $body = $('body'),
    $headList = $body.find('.headList');
	// 获取个人信息
	exports.profile = function(){
		server.profile(function(data){
			var userInfo = data.data;
			$headList.find('.wel span').html(userInfo.account);
			$headList.find('.lastLog span').html(utils.tranTimeYMDHMS(userInfo.lastLoginTime,'/'));
			$headList.find('.inquiryCount').html(userInfo.inquiryTotal);
			$headList.find('.orderCount').html(userInfo.orderTotal);
		},function(data){
			// 还没登录
			window.location.href = '/member/login.html';
		});

	};
    exports.init = function(){
        common.init(true);
        common.userSideBar();
        exports.profile();
    };
    return exports;
})