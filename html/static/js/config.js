require.config({
	urlArgs: "v=1.212",
    "baseUrl": "../static/",	
    "paths": {
        "main/common": "./js/view/common",
        "main/server": "./js/view/server",
        "main/temple": "./js/view/temple",
        "main/index": "./js/view/index",
        "main/login": "./js/view/login",
        "main/register": "./js/view/register",
        "main/verify": "./js/view/verify",
        "main/forget": "./js/view/forget",
        "main/forget_password": "./js/view/forget_password",
        "main/reset_password": "./js/view/reset_password",
        "main/member_index": "./js/view/member_index",
        "main/quote_index": "./js/view/quote_index",
        "main/order_index": "./js/view/order_index",
        "main/order_detail": "./js/view/order_detail",
        "main/account_index": "./js/view/account_index",
        "main/brand_index": "./js/view/brand_index",
        "main/brand_detail": "./js/view/brand_detail",
        "main/product_index": "./js/view/product_index",
        "main/product_detail": "./js/view/product_detail",
        "main/product_search": "./js/view/product_search",
        "main/datasheet_index": "./js/view/datasheet_index",
        "main/category_index": "./js/view/category_index",
        "main/inquiry_index": "./js/view/inquiry_index",
        "main/address": "./js/view/address",
        "main/add_address": "./js/view/add_address",
        "main/search": "./js/view/search",
        "main/article": "./js/view/article",
        "main/cart": "./js/view/cart",
        "main/post_inquiry": "./js/view/post_inquiry",
        "main/simple": "./js/view/simple",
        "main/base64": "./js/view/base64",
        "main/utils": "./js/view/utils",
        "main/server": "./js/view/server",
        "page_turning_plugin": './js/view/page_turning_plugin',
        // "jquery": "./js/vendor/jquery/jquery-1.8.3.min",
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min",
        // "jqui": "./js/vendor/jqui/jquery-ui-1.9.2.custom.min",
        "jqui": "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min",
        // "jqform": "./js/vendor/jqform/jquery.form.min",
        "jqform": "https://cdnjs.cloudflare.com/ajax/libs/jquery.form/3.51/jquery.form.min",
        // "jqsuperslide": "http://superslide2.com/SuperSlide.2.1.2/jquery.SuperSlide.2.1.2",
        "jqsuperslide": "./js/vendor/jqsuperslide/jquery.SuperSlide.2.1.2",
        "md5": "./js/vendor/md5/md5-min",
        // "md5": "https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.5.0/js/md5.min",
        "require": "./js/vendor/require/require",
        //"require": "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.2/require.min"
        // "webuploader": "./js/vendor/webuploader/webuploader.min",
        // "xss": "./js/vendor/xss/xss",

        // "zepto": "./js/vendor/zepto/zepto.min",
        // "swiper": "./js/vendor/swiper/swiper.3.1.2.min",
        // "m/main/common": "./m/js/view/common",
        // "m/main/index": "./m/js/view/index",
        // "m/main/server": "./m/js/src/main/server",
    },
    "shim": {
        "md5": [
            "jquery"
        ],
        "jqform": [
            "jquery"
        ],
        "jqui": [
            "jquery"
        ],
        "jqsuperslide": [
            "jquery"
        ]
        // "webuploader": {
        //     "deps": [
        //         "jquery"
        //     ],
        //     "exports": "WebUploader"
        // },
        // "xss": {
        //     "exports": "filterXSS"
        // }
    }
});
 window['_c'] = {
    "basePath": "./",
    "path": "/bmall/rixin/",
    "websiteName": "rixin",
    // "webuploaderSwf": "./js/vendor/webuploader/Uploader.swf",
    "ENV": "dev"
}