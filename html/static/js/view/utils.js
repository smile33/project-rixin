define('main/utils', ['jquery'], function($){
	var exports  = {};
    var prefix = window._c.websiteName;
    var tipTimeOut = null;
    function isType(object,type){
        type = type || 'string';
        if(typeof(type) !== 'string'){
            throw new Error('type must be string');
        }
        return Object.prototype.toString.call(object).slice(8,-1).toLowerCase() === type.toLowerCase();
    }
    function searchToJson(){
        var search = window.location.search;
        if (!search){
            return false;
        }else{
            search = search.substr(1);
            var searchJson = {};
            var searchArr = search.split('&');
            for(var i = 0 , len = searchArr.length ; i < len ; i++){
                var tempArr = searchArr[i].split('=');
                searchJson[tempArr[0]] = tempArr[1];
            }
            return searchJson;
        }
    }
    //获取url参数值
    exports.getSearchParam = function(param){
        var searchJson = searchToJson();
        if(!searchJson || !(searchJson[param])){
            return false;
        }else{
            return searchJson[param];
        }
    }
    //时间转换
    exports.tranTimeYMD = function(time,split){
        split = split || '-';
        var d = new Date();
        d.setTime(time);
        var month = d.getMonth()+1;
        var date = d.getDate();
        month = exports.addZero(month);
        date = exports.addZero(date);
        var timeYMD = d.getFullYear()+split+month+split+date;
        return timeYMD;
    };
    exports.tranTimeHMS = function(time,split){
        split = split || ':';
        var d = new Date();
        d.setTime(time);
        var hours = exports.addZero(d.getHours());
        var minutes = exports.addZero(d.getMinutes());
        var seconds = exports.addZero(d.getSeconds());
        var timeHMS = hours + split + minutes + split + seconds;
        return timeHMS;
    };
    exports.tranTimeYMDHMS = function(time,split){
        var timeYMDHMS = exports.tranTimeYMD(time,split)+' '+exports.tranTimeHMS(time);
        return timeYMDHMS;
    };   

    exports.addZero = function(t){
        if(t < 10){
            t = '0' + t;
        }
        return t;
    };
    exports.accMul = function(num1,num2){//解决js浮点数的乘法精度错误
        var m=0,s1=num1.toString(),s2=num2.toString(); 
        try{m+=s1.split(".")[1].length}catch(e){};
        try{m+=s2.split(".")[1].length}catch(e){};
        return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
    },
    exports.tips = function(text,second){
        var tipID = document.getElementById('tipID');
        if(!tipID){
            tipID = document.createElement('div');
            tipID.setAttribute('id','tipID');
            tipID.style.cssText = 'padding:5px 10px;border-radius:5px;position:fixed;left:50%;max-width:90%;top:33%;margin-top:-20px;background:rgba(0,0,0,0.8);text-align:center;color:#fff;z-index:99999999;';
            document.getElementsByTagName('body')[0].appendChild(tipID);
        }
        tipID.style['left'] = 0;
        tipID.innerHTML = text;
        tipID.style.display = 'block';
        tipID.style['margin-left'] = -(tipID.clientWidth/2)+'px';
        tipID.style['left'] = '50%';
        tipTimeOut && clearTimeout(tipTimeOut);
        tipTimeOut = setTimeout(function(){
            tipID.style.display = 'none';
        },(second || 3)*1000);
    }
    exports.loading = function(action,text){
        var loadingID = document.getElementById('loadWrapper');
        // var loadingMaskID = document.getElementById('loadingMaskID');
        var loadingIcon = document.getElementById('loadingIcon');
        var loadingText = document.getElementById('loadingText');
        if(!loadingID){
            loadingID = document.createElement('div');
            loadingID.setAttribute('id','loadWrapper');
            document.getElementsByTagName('body')[0].appendChild(loadingID);
            // loadingMaskID = document.createElement('div');
            // loadingMaskID.setAttribute('id','loadingMaskID');
            loadingIcon = document.createElement('div');
            loadingIcon.setAttribute('id','loadingIcon');
            loadingText = document.createElement('div');
            loadingText.setAttribute('id','loadingText');
            // loadingID.appendChild(loadingMaskID);
            loadingID.appendChild(loadingIcon);
            loadingID.appendChild(loadingText);
            loadingText.innerHTML = text || 'loading...';
        }
        if(action === 'show'){
            loadingID.style.display = 'block';
        }else{
            loadingID.style.display = 'none';
        }
    };
    exports.TPL = {
        templates:{},
        loadTemplates:function(names,cbf){
            if(isType(names,'string')){
                names = [names];
            }
            if(!isType(names,'array')){
                throw new Error('templateName must be array or string');
            }
            var self = this;
            var tplLength = names.length;
            var loadTemplate = function(index){
                var name = names[index];
                if(self.templates[name] === undefined){
                    $.get('/static/js/tpl/'+name+'.html',function(data){
                        self.templates[name] = data;
                        if(++index < tplLength){
                            loadTemplate(index);
                        }else{
                            cbf();
                        }
                    });
                }else{
                    if(++index < tplLength){
                        loadTemplate(index);
                    }else{
                        cbf();
                    }            
                }
            };
            loadTemplate(0);
        },
        get:function(name){
            return exports.TPL.templates[name];
        }
    };

    exports.STORE = {
        setItem:function(key,val){
            window.localStorage.setItem(prefix+key,JSON.stringify(val));
        },
        getItem:function(key){
            return JSON.parse(window.localStorage.getItem(prefix+key));
        },
        removeItem:function(key){
            window.localStorage.removeItem(prefix+key);
        }
    };    
    return exports;
})