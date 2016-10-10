define('main/server', ['jquery','main/utils'], function($, utils){
    var exports = {};
    var path  = window._c.path;

    // 首页数据
    exports.path_home = path + 'home/data.wb';
    // 获取页面左侧分类
    exports.path_category_left = path + 'category/left.wb';
    // 获取页面左侧分类
    exports.path_category_tree = path + 'category/tree.wb';
    // 首页quick inquiry
    exports.path_quick_inquiry = path+'inquiry/quick.wb';
    // 发布商品inquiry
    exports.path_inquiry_product = path+'inquiry/product.wb';
    // 搜索datasheet
    exports.path_search_datasheet = path+'search/data_sheet.wb';
    // 供应商列表
    exports.path_brand_index = path+'manufacture/brand_index.wb';
    // 供应商详情
    exports.path_brand_detail = path+'manufacture/detail.wb';
    // 分页获取某个供应商的新商品
    exports.path_brand_new_product = path+'product/mfr/new_product.wb';
    //Product Index页面
    exports.path_product_index = path+'product/product_index.wb';
    //分类商品列表
    exports.path_product_category = path+'product/category.wb';
    // 商品详情
    exports.path_product_detail = path+'product/detail.wb';
    // 商品搜索
    exports.path_product_search = path+'search/product.wb';
    // 获取商品单价
    exports.path_product_unit_price = path+'product/unit_price.wb';
    // 查询我的购物车
    exports.path_my_shop_cart = path+'shop_cart/my/list.wb';
    // 添加购物车
    exports.path_add_shop_cart = path+'shop_cart/my/add.wb';
    // 删除购物车
    exports.path_delete_shop_cart = path+'shop_cart/my/delete.wb';
    // 下单
    exports.path_add_order = path+'order/my/add.wb';
    // 合并购物车
    exports.path_merge_shop_cart = path+'/shop_cart/my/merge.wb';


    // 注册-获取国家列表
    exports.path_country   = path+'common/regions.wb';
    // 注册
    exports.path_register  = path+'user/register.wb';
    // 登录
    exports.path_login     = path+'user/login.wb';
    // 用户邮件验证
    exports.path_verify   = path+'/user/verify.wb'
    // 退出登录
    exports.path_logout     = path+'user/logout.wb';
    // 发送忘记密码邮件
    exports.path_forget_password = path+'user/forget_password.wb';
    // 邮件重置密码
    exports.path_reset_forget_password = path+'user/reset_forget_password.wb';
    // 密码重设
    exports.path_reset_password = path+'user/my/reset_password.wb';
    // 登录信息
    exports.path_loginInfo  = path+'user/login_info.wb';
    // 个人信息
    exports.path_home_profile   = path+'user/my/home_profile.wb';
    // 个人中心-获取个人资料
    exports.path_get_profile = path+'user/my/user_profile.wb';
    // 个人中心-更新个人资料
    exports.path_update_profile = path+'user/my/update_user_profile.wb';
    
    //我的inquiry列表
    exports.path_inquiry_list = path+'inquiry/my/list.wb';
    //取消inquiry
    exports.path_delete_inquiry = path+'inquiry/my/cancel.wb';
    
    //我的订单列表
    exports.path_order_list = path+'order/my/list.wb';
    //取消order
    exports.path_delete_order = path+'order/my/cancel.wb';
    //各种状态订单数
    exports.path_order_status_count = path+'/order/my/order_total_by_status.wb';
    //订单详情
    exports.path_order_detail = path+'order/my/detail/';
   

    //收货地址列表
    exports.path_delivery_address_list = path+'delivery_address/my/list.wb';
    //收货地址详情
    // exports.path_delivery_address_detail = path+'delivery_address/my/detail/1.wb';
    //获取默认收货地址
    exports.path_get_delivery_address_default = path+'/delivery_address/my/get_default.wb';
    //设置默认收货地址
    exports.path_set_delivery_address_default = path+'delivery_address/my/set_default.wb';
    //新增收货地址
    exports.path_add_delivery_address = path+'delivery_address/my/add.wb';
    // //修改收货地址
    exports.path_update_delivery_address = path+'delivery_address/my/edit.wb';
    //删除收货地址
    exports.path_delete_delivery_address = path+'delivery_address/my/delete.wb';


    // 出错处理
    exports.error = function(data){
        utils.tips(data && data.msg || 'error');
    };
    exports.ajax = function(param,callback,callback2){
        callback2 = callback2 || exports.error;
        param = param;
        param.dataType = 'json';
        param.cache = false;
        param.success = function(data){
            if(data && data.flag  === 0){
                callback(data);
            }else{
                callback2(data);
            }
        };
        param.error = function(data){
            exports.error(data);
        };
        $.ajax(param);
    };


    // 首页
    exports.home = function(callback){
        exports.ajax({
            url : exports.path_home,
            type : 'get'
        },callback);
    };
    //获取页面左侧分类
    exports.categoryLeft = function(data,callback){
        exports.ajax({
            url : exports.path_category_left,
            type : 'get',
            data: data
        },callback);
    };
    exports.categoryTree = function(data,callback){
        exports.ajax({
            url : exports.path_category_tree,
            type : 'get',
            data: data
        },callback);
    };
    
    // 首页quick inquiry
    exports.quickInquiry = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_quick_inquiry,
            type : 'post',
            data : data
        },callback,callback2);
    };
    // 发布商品inquiry
    exports.inquiryProduct = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_inquiry_product,
            type : 'post',
            data : data
        },callback,callback2);
    };
    // // 搜索datasheet
    // exports.searchDatasheet = function(data,callback,callback2){
    //     exports.ajax({
    //         url : exports.path_search_datasheet,
    //         type : 'get',
    //         data : data
    //     },callback,callback2);
    // };
    

    // 供应商详情
    exports.brandDetail = function(data,callback){
        exports.ajax({
            url : exports.path_brand_detail,
            type : 'get',
            data : data
        },callback);
    };
    // // 分页获取某个供应商的新商品
    // exports.brandNewProduct = function(data,callback){
    //     exports.ajax({
    //         url : exports.path_brand_new_product,
    //         type : 'get',
    //         data : data
    //     },callback);
    // };

    //Product Index页面
    exports.productIndex = function(callback){
        exports.ajax({
            url : exports.path_product_index,
            type : 'get'
        },callback);
    };
    // 商品详情
    exports.productDetail = function(data,callback){
        exports.ajax({
            url : exports.path_product_detail,
            type : 'get',
            data : data
        },callback);
    };
    // 商品搜索
    exports.productSearch = function(data,callback){
        exports.ajax({
            url : exports.path_product_search,
            type : 'get',
            data : data
        },callback);
    };
    // 获取商品单价
    exports.productUnitPrice = function(data,callback){
        exports.ajax({
            url : exports.path_product_unit_price,
            type : 'get',
            data : data
        },callback);
    };

    // 查询我的购物车
    exports.myShopCart = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_my_shop_cart,
            type : 'get',
            data : data
        },callback);
    };
    // 添加购物车
    exports.addShopCart = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_add_shop_cart,
            type : 'post',
            data : data
        },callback,callback2);
    };
    // 删除购物车
    exports.deleteShopCart = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_delete_shop_cart,
            type : 'post',
            data : data
        },callback,callback2);
    };
    // 下单
    exports.addOrder = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_add_order,
            type : 'post',
            data : data
        },callback,callback2);
    };
    // 合并购物车
    exports.mergeShopCart = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_merge_shop_cart,
            type : 'post',
            data : data
        },callback,callback2);
    };

    
    // 注册-获取国家列表
    exports.country = function(callback){
        exports.ajax({
            url : exports.path_country,
            type : 'get',
        },callback);
    };

    //获取登录信息
    exports.loginInfo = function(callback,callback2){
        exports.ajax({
            url : exports.path_loginInfo,
            type : 'get',
            // data : data,
        },callback,callback2);
    };

    // 注册
    exports.register = function(data, callback, callback2){
        exports.ajax({
            url : exports.path_register,
            type : 'post',
            data : data,
        },callback, callback2);
    };

    // 登录
    exports.login = function(data, callback, callback2){
        exports.ajax({
            url : exports.path_login,
            type : 'post',
            data : data,
        },callback, callback2);
    };
    // 用户邮件验证
    exports.verify = function(data, callback, callback2){
        exports.ajax({
            url : exports.path_verify,
            type : 'post',
            data : data
        },callback, callback2);
    };
    // 退出登录
    exports.logout = function(callback){
        exports.ajax({
            url : exports.path_logout,
            type : 'post'
        },callback);
    };
    // 发送忘记密码邮件
    exports.forgetPassword = function(data, callback, callback2){
        exports.ajax({
            url : exports.path_forget_password,
            type : 'post', 
            data : data,
        },callback, callback2);
    };
    // 邮件重置密码
    exports.resetForgetPassword = function(data, callback, callback2){
        exports.ajax({
            url : exports.path_reset_forget_password,
            type : 'post', 
            data : data,
        },callback, callback2);
    };
    // 密码重设
    exports.resetPassword = function(data, callback, callback2){
        exports.ajax({
            url : exports.path_reset_password,
            type : 'post', 
            data : data,
        },callback, callback2);
    };

    // 个人中心
    exports.profile = function(callback, callback2){
        exports.ajax({
            url : exports.path_home_profile,
            type : 'get', 
        },callback, callback2);
    };
    // 获取个人信息
    exports.getProfile = function(callback,callback2){
        exports.ajax({
            url : exports.path_get_profile,
            type : 'get', 
        },callback, callback2);
    };
    // 修改个人信息
    exports.updateProfile = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_update_profile,
            type : 'post', 
            data : data,
        },callback, callback2);
    };
    // 取消inquiry
    exports.deleteInquiry = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_delete_inquiry,
            type : 'post', 
            data : data
        },callback,callback2);
    };
    // //我的inquiry详情
    // exports.inquiryDetail = function(data,callback){
    //     exports.ajax({
    //         url : exports.path_inquiry_detail,
    //         type : 'get', 
    //     },callback);
    // };

    // 取消order
    exports.deleteOrder = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_delete_order,
            type : 'post', 
            data : data
        },callback,callback2);
    };
    //各种状态订单数
    exports.orderStatusCount = function(callback){
        exports.ajax({
            url : exports.path_order_status_count,
            type : 'get'
        },callback);
    };
    //订单详情
    exports.orderDetail = function(id,callback){
        exports.ajax({
            url : exports.path_order_detail + id + '.wb',
            type : 'get'
        },callback);
    };

    //新增收货地址
    exports.addDeliveryAddress = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_add_delivery_address,
            type : 'post',
            data : data
        },callback,callback2);
    };
    // // 收货地址列表
    exports.deliveryAddressList = function(data,callback){
        exports.ajax({
            url : exports.path_delivery_address_list,
            type : 'get', 
            data : data
        },callback);
    };
    //收货地址详情
    exports.deliveryAddressDetail = function(id,callback){
        exports.ajax({
            url : path +'delivery_address/my/detail/' + id + '.wb',
            type : 'get'
        },callback);
    };

    //获取默认收货地址
    exports.getDeliveryAddressDefault = function(callback){
        exports.ajax({
            url : exports.path_get_delivery_address_default,
            type : 'get'
        },callback);
    };
    //设置默认收货地址
    exports.setDeliveryAddressDefault = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_set_delivery_address_default,
            type : 'post',
            data : data
        },callback,callback2);
    };
    //修改收货地址
    exports.updateDeliveryAddress = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_update_delivery_address,
            type : 'post',
            data : data
        },callback,callback2);
    };
    //删除收货地址
    exports.deleteDeliveryAddress = function(data,callback,callback2){
        exports.ajax({
            url : exports.path_delete_delivery_address,
            type : 'post',
            data : data
        },callback,callback2);
    };


    // 首页banner
    exports.banner = function(callback){
        $.ajax({
            url: exports.path_banner,
            dataType:'json',
            cache:false,
            type:'get',
            success:function(jData){
                if(jData.length >0){
                    callback(jData);
                }else{
                    exports.error();
                }
            },
            error: function(){
                exports.error();
            }
        })
    };

    // 头部-分类
    exports.category = function(callback){
        $.ajax({
            url: exports.path_category,
            dataType:'json',
            cache:false,
            type:'get',
            success:function(jData, status){
                if(jData){
                    callback(jData);
                }else{
                    var adata = [];
                    callback(adata);
                }
            },
            error: function(){
                exports.error();
            }
        })
    };

    // 列表页-商品分类
    exports.product = function(id, callback){
        $.ajax({
            url: exports.path_product+id,
            dataType:'json',
            cache:false,
            type:'get',
            success:function(jData, status){
                if(jData.length >0){
                    callback(jData);
                }else{
                    exports.error();
                }
            },
            error: function(){
                exports.error();
            }
        })
    };

    // 列表页-二级分类
    exports.category2 = function(id, callback){
        $.ajax({
            url: exports.path_category2+id,
            dataType:'json',
            cache:false,
            type:'get',
            success:function(jData, status){
                if(jData.length>0){
                    callback(jData);
                }else{
                    exports.error();
                }
            },
            error: function(){
                exports.error();
            }
        })
    };

    // 列表页-热销产品
    exports.hot = function(callback){
        $.ajax({
            url: exports.path_hot,
            dataType:'json',
            cache:false,
            type:'get',
            success:function(jData, status){
                if(jData.length >0){
                    callback(jData);
                }else{
                    exports.error();
                }
            },
            error: function(){
                exports.error();
            }
        })
    };

    // 商品详情
    exports.detail = function(id, callback){
        $.ajax({
            url: exports.path_detail+id,
            dataType:'json',
            cache:false,
            type:'get',
            success:function(jData, status){
                if(jData){
                    callback(jData);
                }else{
                    exports.error();
                }
            },
            error: function(){
                exports.error();
            }
        })
    };

    // 消息中心
    exports.msg = function(data,callback1,callback2){
        $.ajax({
            url: exports.path_msg,
            dataType:'json',
            cache:false,
            type:'get',
            data:data,
            success:function(jData, status){
                if(jData.items && jData.items.length >0){
                    callback1(jData);
                }else{
                    callback2();
                }
            },
            error: function(){
                callback2();
            }
        })
    };

    // 上传头像
    exports.upload = function(data,callback1,callback2){
        $.ajax({
            url: exports.path_upload,
            dataType:'json',
            cache:false,
            type:'get',
            data:data,
            success:function(jData, status){
                if(jData.items && jData.items.length >0){
                    callback1(jData);
                }else{
                    callback2();
                }
            },
            error: function(){
                callback2();
            }
        })
    };
    // 修改密码
    exports.changepwd = function(data,callback1,callback2){
        $.ajax({
            url: exports.path_changepwd,
            dataType:'json',
            cache:false,
            type:'post',
            data:data,
            success:function(jData){
                if(jData.flag == '0'){
                    callback1();
                }else{
                    callback2(jData.msg);
                }
            },
            error: function(){
                callback2('Server not responding');
            }
        })
    };



    // 商品详情的评论提交
    exports.addCont = function(data,callback1,callback2){
        $.ajax({
            url: exports.path_addconent,
            dataType:'json',
            cache:false,
            type:'post',
            data:data,
            success:function(jData){
                if(jData.flag == '0'){
                    callback1();
                }else{
                    callback2(jData.msg);
                }
            },
            error: function(){
                callback2('Server not responding');
            }
        })
    };

    // 商品详情的postList列表
    exports.postList = function(id,option, callback){
        $.ajax({
            url: exports.path_postList+id,
            dataType:'json',
            cache:false,
            data:option,
            type:'get',
            success:function(jData, status){
                if(jData.items && jData.items.length >0){
                    callback(jData);
                }else{
                    exports.error();
                }
            },
            error: function(){
                exports.error();
            }
        })
    };

    // 商品详情的postList的回复列表
    exports.replies = function(id, callback){
        $.ajax({
            url: exports.path_replies+id,
            dataType:'json',
            cache:false,
            type:'get',
            success:function(jData){
                if(jData){
                    callback(jData);
                }else{
                    exports.error();
                }
            },
            error: function(){
                exports.error();
            }
        })
    };

    // 商品详情的postList的回复submit
    exports.reply = function(id,data, callback1,callback2){
        $.ajax({
            url: exports.path_reply+id,
            dataType:'json',
            cache:false,
            data:{content:data},
            type:'post',
            success:function(jData){
                if(jData.flag == '0'){
                    callback1(jData.msg);
                }else{
                    callback2(jData.msg);
                }
            },
            error: function(){
                callback2(jData.msg);
            }
        })
    };

    // 商品详情的review
    exports.review = function(id,option,callback){
        $.ajax({
            url: exports.path_review+id,
            dataType:'json',
            cache:false,
            data:option,
            type:'get',
            success:function(jData){
                callback(jData);
            },
            error: function(){
                exports.error();
            }
        })
    };


  
    return exports;
})