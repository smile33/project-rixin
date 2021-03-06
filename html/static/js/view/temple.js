define('main/temple', ['jquery','xss','main/utils',], function($, xss, utils){
    var exports    = {};
    // 格式化数据
    exports.formatText = function(text){
        return ((!text) ? '' : text);
    };
    //首页globalBrand
    exports.globalBrandViews = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<li><a href="/brand/detail.html?id=' + v.manufactureId + '"><img src="' + (v.logo || '/static/img/default_pic.jpg' ) + '"><br><span>'+v.manufactureName+'</span></a></li>';
        });
        return html;
        
    }
    //首页分类商品
    exports.categoryProductUlViews = function(data){
        var tabHeadHtml = '',tabPanelHtml = '';
        $.each(data, function(k, v){
            var className = '';
            var style = '';
            if(k === 0){
                className = ' class="tabSelect"';
                style = ' style="display:block"'
            }
            tabHeadHtml += '<li'+className+'>'+v.categoryName+'</li>';
            tabPanelHtml += '<div class="Panel"'+style+'>';
            $.each(v.products, function(i, product){
                tabPanelHtml += '<a class="productItem" href="/product/detail.html?id='+product.productId+'&part='+product.productName+'">' +
                                    '<img src="'+(product.logo || '/static/img/default_pic.jpg' ) +'">' +
                                    '<p class="title">'+product.productName+'</p>' +
                                    '<p class="price">Price: $ '+product.price+'</p>' +
                                '</a>';
            });
            tabPanelHtml += '<div class="Clear"></div></div>';
        });
        var html = {
            tabHeadHtml: tabHeadHtml,
            tabPanelHtml: tabPanelHtml
        };
        return html;
    }
    //首页
    exports.categoryLeftIndex = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<dt><a href="/product/index.html">'+v.categoryName+'</a></dt>';
            $.each(v.subCats, function(i, subCat){
                html += '<dd><a href="/product/index.html#'+subCat.categoryId+'">'+subCat.categoryName+'</a></dd>';
            });
        });
        return html;
    };
    exports.categoryProductViews = function(data){
        var html = '';
        $.each(data, function(k, v){
            var className = '';
            if(k === 0){
                className = ' class="tabSelect"';
            }
            html += '<li'+className+'>'+v.categoryName+'</li>';
        });
        return html;
    }
    //首页specialProduct
    exports.specialProductView = function(data){
        var html = '';
        $.each(data, function(k, v){
            if(k === 0){
                html += '<div class="tabProduct">' + 
                            '<img src="'+ (v.logo || '/static/img/default_pic.jpg') + '">' +
                            '<a href="/product/detail.html?id='+v.productId+'&part='+v.productName+'">'+v.productName+'</a>' +
                            '<p class="price">$ '+v.price+'</p>' +
                        '</div>' +
                        '<div class="moreItem">';
            }else{
                html += '<a href="/product/detail.html?id='+v.productId+'&part='+v.productName+'">'+v.productName+'<span class="price">$ '+v.price+'</span></a>';
            }
        });
        html += '</div>'
        return html;
    };
    //购物车页面新建地址
    exports.shopCartAddressList = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<ul class="addressList">' +
                '<li>' +
                    '<label>UserName:</label>' +
                    '<span>' + (v.linkMan || '') + '</span>' +
                    '<label>Region:</label>' +
                    '<span>' + (v.regionName || '') + '</span>' +
                    '<label>Phone:</label>' +
                    '<span>' + (v.areaCode || '') + '-' + (v.linkPhone || '') + '</span>' +
                '</li>' +
                '<li>' +
                    '<label>E-mail:</label>' +
                    '<span>' + (v.email || '') + '</span>' +
                    '<label>Fax:</label>' +
                    '<span>' + (v.fax || '') + '</span>' +

                    '<label>PostCode:</label>' +
                    '<span>' + (v.postCode || '') + '</span>' +
                '</li>' +
                '<li>' +
                    '<label>Company Name:</label>' +
                    '<span>' + (v.companyName || '') + '</span>' +
                    '<label>Address:</label>' +
                    '<span>' + (v.address || '') + '</span>' +
                '</li>' +
            '</ul>';
        });
        return html;
    }
    //购物车页面展示购物车商品
    exports.myShopCart = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<tr _id="'+v.id+'" product_id="'+v.productId+'">' +
                            '<td><input type="checkbox" checked="checked" name="shopCartOrder"></td>' +
                            '<td>'+v.mfrPartNum+'</td>' +
                            '<td>' + v.manufacture + '</td>' +
                            '<td>' + v.description +'</td>' +
                            '<td></td>' +
                            '<td class="stock">' + v.stock + '</td>' +
                            '<td><input type="text" class="count" size="6" placeholder="0" value="' + v.quantity + '" quantity="' + v.quantity + '"></td>' +
                            '<td class="unitPrice" unit_price="' + v.unitPrice + '">' + v.unitPrice + '</td>' +
                            '<td class="price">'+utils.accMul(v.unitPrice,v.quantity)+'</td>' +
                            '<td><input type="text" class="remark" value=""></td>' +
                            '<td><a href="javascript:;" class="deleteBtn">Delete</a></td>' +
                        '</tr>';
        });
        return html;
    };
    //头部购物车展示购物车商品
    exports.headShopCart = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<li class="blockItem" _id="' + (v.id || k) + '">' +
                        '<img src="'+(v.productImg || v.logo || '/static/img/default_pic.jpg' )+'">' +
                        '<p>' +
                            '<a href="/product/detail.html?id=' + v.productId + '&part=' + v.mfrPartNum + '" target="_blank">' + v.mfrPartNum + '</a>' +
                            '<span>Price:' + utils.accMul(v.unitPrice,v.quantity) + ' Quantity:' + v.quantity + '</span>' +
                        '</p>' +
                        '<a href="javascript:;" class="headDeleteShopCartBtn delete">delete</a>' +
                    '</li>';
        });
        if(data.length){
            html += '<li class="CartGoto"><a href="/home/cart.html">Go to Shopping Cart</a></li>';
        }
        return html;
    };
    //productIndex左栏
    exports.categoryLeftProduct = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<dt><a href="#'+v.categoryId+'">'+v.categoryName+'</a></dt>';
            $.each(v.subCats, function(i, subCat){
                html += '<dd><a href="#'+subCat.categoryId+'">'+subCat.categoryName+'</a></dd>';
            });
        });
        return html;
    };
    //productIndex右栏
    exports.categoryTreeProduct = function(data){
        var html = '';
        $.each(data, function(k1, v1){
            html += '<h1><a name="'+v1.cid+'"></a>'+v1.cn+'</h1>';
            if(v1.sc){
                $.each(v1.sc, function(k2, v2){
                    html += '<div>' +
                        '<h2 class="catfiltertopitem"><a name="'+v2.cid+'"></a>'+v2.cn+'</h2>' +
                        '<span class="newProductCategory itemNum">'+v2.npc+' New Products</a></span>' +
                        '<ul class="catfiltersub">';
                    if(v2.sc){
                        $.each(v2.sc, function(k3, v3){
                            html += '<li>' +
                                        '<a href="/category/index.html?categoryId='+ v3.cid +'&categoryName='+v3.cn+'" class="catfilterlink">'+v3.cn+'</a>' +
                                    '<span class="itemNum">('+v3.pc+' items)</span>' +
                                '</li>';
                        });
                        html += '</ul></div>';
                    }
                });
            }
        });
        return html;
    };
    //datasheetList
    exports.datasheetList = function(data){
        var html = '';
        console.log(data);
        $.each(data, function(k, v){
            var colorClass = k%2 ? 'bgcolor':'';
            html += '<li class="DataItem ' + colorClass + '">' +
                '<span class="type">' + v.mfrPartNum + '</span>' +
                '<span class="down"><a href="/open_datasheet.html?url=' + encodeURIComponent(window.btoa(v.url)) + '" target="_blank">Preview</a></span>' +
            '</li>';
        });
        return html;
    }
    //brandList
    exports.brandList = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<li><a href="/brand/detail.html?id='+v.mfrId+'">'+v.mfrName+'</a></li>';
        });
        return html;
    }; 
    //brandNewProduct
    exports.brandNewProduct = function(data){
        var html = '';
        $.each(data, function(k, v){
            var tdHtml = '';
            tdHtml += '<td class="tdbody">' +
                '<div class="newestProductImageHolder">' +
                    '<a href="/product/detail.html?id='+v.productId+'&part=' + v.productName + '">' +
                        '<img src="'+(v.logo || '/static/img/default_pic.jpg') +'" class="newestProductImg" alt="'+v.productName+'" title="'+v.productName+'" />' +
                    '</a>' +
                '</div>' +
                '<p class="newestProductTitle">' +
                    '<a href="/product/detail.html?id='+v.productId+'&part=' + v.productName + '" class="title">'+v.productName+'</a>' +
                '</p>' +
                '<p class="newestProductDescription">'+ v.description +'</p>' +
            '</td>';
            if(k%2 === 0){
                html += '<tr class="trbody">'+tdHtml;
            }else{
                html += tdHtml+'</tr>';
            }
        });
        return html;
    };
    //分类商品列表
    exports.productCategory = function(data){
        var html = '';
        $.each(data, function(k, v){
            var datasheetHtml = '';
            if(v.dataSheets.length){
                var datasheet = v.dataSheets[0];
                datasheetHtml = '<a class="lnkDatasheet" href="/open_datasheet.html?url=' + encodeURIComponent(window.btoa(datasheet.url)) + '" target="_blank">' +
                                '<img class="datasheet-img" src="/static/img/pdf_logo.png" alt="' + datasheet.text + ' Datasheet" title="' + datasheet.text + ' Datasheet">' +
                            '</a>';
            }
            html += '<tr>' +
                        '<td>' + datasheetHtml +'</td>' +
                        '<td>' +
                            '<a href="/product/detail.html?id=' + v.productId + '&part=' + v.productName + '">' +
                                '<img border="0" height="64" src="' + (v.productImg || '/static/img/default_pic.jpg') + '" alt="' + v.productName + '" title="' + v.productName + '">' +
                            '</a>' +
                        '</td>' +
                        '<td>' +
                            '<a href="/product/detail.html?id=' + v.productId + '&part=' + v.productName + '">' + v.manufacturePartNumber + '</a>' +
                        '</td>' +
                        '<td>' +
                            '<span>' +
                                '<a href="/brand/detail.html?id=' + (v.manufacture && v.manufacture.mfrId || '') + '">' +
                                    '<span itemprop="name">' + (v.manufacture && v.manufacture.mfrName || '') + '</span>' +
                                '</a>' +
                            '</span>' +
                        '</td>' +
                        '<td>' + v.description + '</td>' +
                        '<td>' +
                            '<span>' + v.quantityAvaliable + '<br></span>' +
                        '</td>' +
                        '<td>' + v.unitPrice + '</td>' +
                        '<td>' + v.minQuantity + '</td>' +
                    '</tr>';
        });
        return html;
    };
    //产品详情图片
    exports.productSmallPic = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<a href="javascript:;" class="'+ (k === 0 ? 'imgChoose imgTab' : 'imgTab') +'">' +
                        '<img src="'+(v.thumbImg || '/static/img/default_pic.jpg' )+'" title="'+v.imgTip+'" bigImgUrl="' + v.bigImg + '">' +
                    '</a>';
        });
        return html;
    }; 
    //产品详情ProductInfo
    exports.productInfo = function(data){
        var html = '<dt><h1>' + data.mfrPartNum + '</h1></dt>' +
                    '<dd><label>Quantity Available：</label>' + (data.quantityAvaliable || '-') + '</dd>' +
                    '<dd><label>Manufacturer：</label>' + (data.manufacturerName || '-') + '</dd>' +
                    '<dd><label>Description：</label>' + (data.description || '-') + '</dd>' +
                    '<dd><label>Lead Free Status / RoHS Status：</label>' + (data.rohsStatus || '-') + '</dd>' +
                    '<dd><label>Manufacturer Standard Lead Time：</label>' + (data.manufacturerLeadTime || '-') + '</dd>' +
                    '<dd><label>Moisture Sensitivity Level (MSL)：</label>' + (data.msl || '-') + '</dd>' +
                    '<dd><label>Stocks：</label>' + data.stock + '</dd>';

        if(data.dataSheets && data.dataSheets.length){
            var datasheet = data.dataSheets[0];
            html += '<dd><label>DataSheet：</label><a href="/open_datasheet.html?url=' + encodeURIComponent(window.btoa(datasheet.url)) + '" target="_blank" class="lnkDatasheet"><img class="datasheet-img" src="/static/img/pdf_logo.png" alt="' + datasheet.text + ' Datasheet" title="' + datasheet.text + ' Datasheet"> View Datasheet</a> </dd>';
        }
        return html;
    }; 
    //产品详情Extended Price
    exports.extendedPrice = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<li>' +
                        '<label class="count">' + v.priceBreak + '</label>' +
                        '<label>$' + v.unitPrice + '</label>' +
                        '<label>$' + v.extPrice + '</label>' +
                    '</li>';
        });
        return html;
    }; 
    //产品详情Product Attributes
    exports.productAttributes = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<tr>' +
                        '<th>' + v.attrKey + '</th><td>';
            var attrValue = v.attrValue[0];
            var attrValueHtml = '';
            $.each(v.attrValue,function(k2,v2){
                if(k2 > 0){
                    html += '</br>';
                }
                if(v2.url){
                    html += '<a href="'+v2.url+'">'+v2.text+'</a></td>';
                }else{
                    html += v2.text;
                }
                
            });
            html += '</td></tr>';
        });
        return html;
    };
    //产品详情favor Product
    exports.favorProduct = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<a class="productItem" href="/product/detail.html?id=' + v.productId + '&part=' + v.productName + '"><img src="' + (v.logo || '/static/img/default_pic.jpg') + '" alt="' + v.productName + '" title="' + v.description + '"><p class="title">' + v.productName + '</p><p class="price">Price: $ ' + v.price + '</p></a>';
        });
        return html;
    }; 
    exports.searchMatch = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<a href="/product/search.html?key=' + v + '">' + v + '</a>';
        });
        return html;
    };
    exports.searchDeliveryTime = function(data){
        var html = '<a href="javascript:;" class="setDeliveryTime" delivery="all">All</a>';
        $.each(data, function(k, v){
            html += '<a href="javascript:;" class="setDeliveryTime" delivery="'+v+'">' + v + '</a>';
        });
        return html;
    };
    // exports.datasheetContainer = function(){

    // };
    exports.searchProductArea = function(data,key){
        var html = '';
        $.each(data, function(k1, v1){
            html += '<div class="productList">';
            if(v1.datasheets && v1.datasheets.length){
                var datasheet = v1.datasheets[0];
                html += '<div class="pr_data">' +
                            '<a class="downloadDatasheet" href="/open_datasheet.html?url=' + encodeURIComponent(window.btoa(datasheet.url)) + '" title="' + datasheet.text + '" target="_blank">Datasheet</a>' +
                            // (v1.datasheets.length == 1 ? '<a href="javascript:;" class="moreDatasheet">more</a>':'') +
                        '</div>';
            }
            $.each(v1.products, function(k2, v2){
                if(k2 === 0){
                    html += 
                    '<div class="pl_info">' +
                        '<a href="/product/detail.html?id=' + v2.productId + '&part=' + v2.sku + '" class="pic"><img src="' + (v2.mfrLogo || '/static/img/default_pic.jpg')+ '" style="max-width:100%;max-height:100%;"></a>' +
                        '<ul class="info">' +
                            '<li>' + v2.manufacturer +'</li>' +
                            '<li><strong><a href="/product/detail.html?id=' + v2.productId + '&part=' + v2.sku + '">' + v2.sku + '</a></strong></li>' +
                            '<li>Description:<span class="desc">' + v2.description + '</span></li>' +
                        '</ul>' +
                    '</div>';
                    html += 
                    '<div class="Clear"></div>' +
                    '<div class="pi_list listTitle">' +
                        // '<span class="dis" style="display:none">Distributor</span>' +
                        '<span class="sku">SKU</span>' +
                        '<span class="manu">Manufacturer</span>' +
                        '<span class="descs">Description</span>' +
                        '<span class="stock">Stock</span>' +
                        '<span class="moq">MOQ</span>' +
                        '<span class="price">Price</span>' +
                        '<span class="delivery">Delivery</span>' +
                        '<span class="operate">Operate</span>' +
                        '<div class="Clear"></div>' +
                    '</div>';
                }
                html += 
                '<div pos="product">' +
                    '<div class="pi_list listItem colorItem" day="' + v2.delivery + '">' +
                        // '<span class="dis" style="display:none"></span>' +
                        '<span class="sku"><a href="/product/detail.html?id=' + v2.productId + '&part=' + v2.sku + '">' + v2.sku.replace(key,'<u>'+key+'</u>') + '</a></span>' +
                        '<span class="manu">' + v2.manufacturer + '</span>' +
                        '<span class="descs">' + v2.description + '</span>' +
                        '<span class="stock">' + v2.stock + '</span>' +
                        '<span class="moq">' + v2.moq + '</span>' +
                        '<span class="price"">';
                        $.each(v2.price, function(k3, v3){
                            var morePriceClass = '';
                            if(k3 > 3){
                                morePriceClass = 'hide';
                            }
                            html += '<p class="'+morePriceClass+'"><span class="priceBreak">'+v3.priceBreak+' :</span> $' + v3.unitPrice + '</p>';
                        });
                        if(v2.price.length > 3){
                            html += '<p><a href="javascript:;" class="morePrice"><i></i>More ('+v2.price.length+')</a><a href="javascript:;" class="lessPrice hide"><i></i>Hidden</a></p>'
                        }
                html += '</span>' +
                        '<span class="delivery">' + v2.delivery + '</span>' +
                        '<span class="operate" _id=' + v2.productId + ' moq="' + v2.moq + '" logo="' + v2.mfrLogo + '" mfrPartNum="' + v2.sku + '">';
                if(v2.stock){
                    html += '<a href="javascript:;" class="addToCartBtn">Add to cart</a>' +
                            '<a href="javascript:;" class="buyBtn">Buy now</a>';
                }                
                html += '<a href="/inquiry/index.html?id=' + v2.productId + '&part=' + v2.sku + '" target="_blank" class="btnInquiry">Post inquiry</a>' +
                        '</span>' +
                        '<div class="Clear"></div>' +
                    '</div>' +
                '</div>';
            });
            html += '</div>';
        });
        return html;
    };



    // 注册-国家
    exports.country = function(data){
        var aHtml = ['<option value="0">Please choose</option>'];
        $.each(data, function(k, v){
            aHtml.push('<option label="'+exports.formatText(v.regionName)+'" value="'+exports.formatText(v.id)+'">'+exports.formatText(v.regionName)+'</option>');
        });
        return aHtml.join('');
    };

    // 收货地址列表
    exports.addressList = function(data){
        var html = '';
        $.each(data, function(k, v){
            // aHtml.push('<option label="'+exports.formatText(v.regionName)+'" value="'+exports.formatText(v.id)+'">'+exports.formatText(v.regionName)+'</option>');
            html += '<ul _id="' + v.id + '">'+
            '<li>' +
                '<label>UserName：</label>' +
                v.linkMan +
                '<a href="/account/add_address.html?id=' + v.id + '" class="linkBtn">Edit</a>' +
                '<a href="javascript:;" class="linkBtn deleteBtn">Delete</a>' +
            '</li>' +
            '<li>' +
                '<label>Region：</label>' +
                v.regionName +
                '<label>E-mail：</label>' +
                (v.email || '') +
            '</li>' +
            '<li>' +
                '<label>Phone：</label>' +
                v.areaCode + '-' + v.linkPhone +
                '<label>Fax：</label>' +
                (v.fax || '') +
            '</li>' +
            // '<li>' +
            //     '<label>E-mail：</label>' +
            //     (v.email || '') +
            // '</li>' +
            '<li>' +
                '<label>Company Name：</label>' +
                (v.companyName || '') +
            '</li>' +
            // '<li>' +
            //     '<label>Fax：</label>' +
            //     (v.fax || '') +
            // '</li>' +  
            '<li>' +
                '<label>Address：</label>' +
                v.address +
                '<label>PostalCode:</label>' +
                v.postCode +
            '</li>';

            // if(!v.isDefault){
            html += '<li class="operate" style="display:'+(v.isDefault?'none':'block')+'">' +
                        '<a href="javascript:;">Set as default</a>' +
                    '</li>';
            // }
            html += '</ul>';
        });
        
        return html;
    };

    exports.inquiryList = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<tr>' +
                        '<td>' + utils.tranTimeYMDHMS(v.inquiryTime) + '</td>' +
                        '<td class="status">' + v.statusText + '</td>' +
                        '<td>' + v.email + '</td>' +
                        '<td>' + v.userName + '</td>' +
                        '<td>' + (v.mfrPartNum || '') + '</td>' +
                        '<td>' + v.lookingFor + '</td>' +
                        '<td>' + (v.file ? '<a href="' + v.file + '" target="_blank">file</a>' : '') + '</td>' +
                        '<td>' + (v.status != 8 ? '<a href="javascript:;" class="deleteBtn" _id="' + v.id + '">Cancel</a>':'') + '</td>' +
                    '<tr>';
        });
        return html;
    };

    exports.orderList = function(data){
        var html = '';
        $.each(data, function(k, v){
            html += '<tr _id="' + v.id + '">' +
                        '<td>' + utils.tranTimeYMDHMS(v.orderTime) + '</td>' +
                        '<td class="status">' + v.orderStatusText + '</td>' +
                        '<td>' + v.address + '</td>' +
                        '<td>' + v.linkMan + '</td>' +
                        '<td>' + v.linkPhone + '</td>' +
                        '<td>' + v.freight + '</td>' +
                        '<td>' + v.orderAmt + '</td>' +
                        '<td>' + v.totalAmt + '</td>' +
                        '<td>' + (v.orderStatus == 0 ? '<a href="javascript:;" class="deleteBtn">Cancel</a>':'') + '</td>' +
                        '<td><a href="/order/detail.html?id='+ v.id +'" target="_blank">查看订单详情</a></td>' +
                        // '<td>' + (v.status != 9 ? '<a href="javascript:;" class="deleteBtn">Cancel</a>':'') + '</td>' +
                    '<tr>';
        });
        return html;
    };

    exports.orderDetailList = function(data){
        var html = '';
        $.each(data, function(k, v){
        html += '<tr height="24">' +
                    '<td>' + v.orderId + '</td>' +
                    '<td>' + v.mfrPartNumber + '</td>' +
                    '<td colspan="2">' + v.quantity + '</td>' +
                    '<td>' + v.manufacture + '</td>' +
                    '<td colspan="4">' + v.pkg + '</td>' +
                    '<td colspan="2">' + v.unitPrice + '</td>' +
                    '<td colspan="2">' + v.totalAmt + '</td>' +
                '</tr>';
        });
        return html;
    };
    return exports;
})