import _$$ from './DomAPI-0.0.1'
import CreateId from './CreateId-0.0.1'

export default function AjaxPost(options) {
    var Cache = {};
    Cache.url = options.url;
    Cache.data = options.data || {};
    Cache.async = options.async === false ? false : true;
    Cache.noCache = options.noCache  === true ? true : false;
    Cache.type = options.type || 'POST';
    Cache.type = Cache.type.toUpperCase();
    Cache.dataType = options.dataType || '';
    Cache.dataType = Cache.dataType.toUpperCase();
    Cache.autoSend = options.autoSend === false ? false : true;

    Cache.success = function(){};
    Cache.error = function(){};
    Cache.complete = function(){};
    Cache.beforeSend = function(){};
    Cache.afterSend = function(){};
    // ajax 状态
    // ajax state
    // 0，对应常量UNSENT，表示XMLHttpRequest实例已经生成，但是open()方法还没有被调用。
    // 1，对应常量OPENED，表示send()方法还没有被调用，仍然可以使用setRequestHeader()，设定HTTP请求的头信息。
    // 2，对应常量HEADERS_RECEIVED，表示send()方法已经执行，并且头信息和状态码已经收到。
    // 3，对应常量LOADING，表示正在接收服务器传来的body部分的数据，如果responseType属性是text或者空字符串，responseText就会包含已经收到的部分信息。
    // 4，对应常量DONE，表示服务器数据已经完全接收，或者本次接收已经失败了。
    Cache.STATE_UNSENT = 0;
    Cache.STATE_OPENED = 1;
    Cache.STATE_HEADERS_RECEIVED = 2;
    Cache.STATE_LOADING = 3;
    Cache.STATE_DONE = 4;
    Cache.state = Cache.STATE_UNSENT;

    Cache.success = options.success || Cache.success;
    Cache.error = options.error || Cache.error;
    Cache.complete = options.complete || Cache.complete;
    Cache.beforeSend = options.beforeSend || Cache.beforeSend;
    Cache.afterSend = options.afterSend || Cache.afterSend;

    Constructor();

    var CacheAPI = {};
    // 回调函数
    // set callback function
    CacheAPI.setSuccess = setSuccess;
    CacheAPI.setError = setError;
    CacheAPI.setComplete = setComplete;
    CacheAPI.setBeforeSend = setBeforeSend;
    CacheAPI.setAfterSend = setAfterSend;
    // 运行函数
    // run function
    CacheAPI.send = AJAX_Send;
    
    CacheAPI.distory = distory;

    return CacheAPI;

    function AJAX_Send(){
        if (Cache.state === Cache.STATE_OPENED) {
            Cache.beforeSend();
            Cache.xmlhttp.send(Cache.reqData + '');
            Cache.afterSend();
            readystatechange(Cache.STATE_HEADERS_RECEIVED)
        }
    }
    function AJAX_Success(JSONP_Data){
        Cache.success(JSONP_Data);
        Cache.complete();
    }
    function AJAX_Error(){
        Cache.error();
        Cache.complete();
    }
    function AJAX_Complete(){
        _$('body').removeChild(script);
        window[Cache.data[Cache.CallBackName]] = null;
    }
    function setSuccess(success){
        Cache.success = success;
        return CacheAPI;
    }
    function setError(error){
        Cache.error = error;
        return CacheAPI;
    }
    function setComplete(complete){
        Cache.complete = complete;
        return CacheAPI;
    }
    function setBeforeSend(beforeSend){
        Cache.beforeSend = beforeSend;
        return CacheAPI;
    }
    function setAfterSend(afterSend){
        Cache.afterSend = afterSend;
        return CacheAPI;
    }

    function distory(){
        Cache = null;
        CacheAPI = null;
    }
    function Constructor(){
        if (window.XMLHttpRequest) {
            Cache.xmlhttp = new window.XMLHttpRequest();
        } else {
            Cache.xmlhttp = new ActiveXObject("Microsoft.Cache.XMLHTTP");
        }
        if (!Cache.xmlhttp) {
            return 'not support ajax';
        }
        Cache.data = AjaxData(Cache.data, Cache.type);

        // 设置 ajax 状态变化
        readystatechange(Cache.xmlhttp.readyState);
        Cache.xmlhttp.onreadystatechange = readystatechange
        
        if (Cache.type === 'POST') {
            Cache.reqURL = Cache.url;
            Cache.reqData = Cache.data;
        } else if (Cache.type === 'GET') {
            Cache.reqURL = Cache.url + (Cache.noCache ? Cache.data.push({ajaxtimestamp: new Date().getTime()}) : Cache.data); // 设置是否清楚缓存
            Cache.reqData = undefined;
        }
        Cache.xmlhttp.open(Cache.type, Cache.reqURL, Cache.async);
        Cache.xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        if (Cache.autoSend) {
            AJAX_Send();
        }
    }
    function AJAX_Done(){
        if (Cache.xmlhttp.status == 200 || Cache.xmlhttp.status == 304) {
            try{
                Cache.res = window.decodeURI(Cache.xmlhttp.responseText);
            }catch(e){
                Cache.res = Cache.xmlhttp.responseText;
            }

            if (Cache.dataType === 'JSON') {
                Cache.res = eval('('+Cache.res+')');
            }

            AJAX_Success(Cache.res);
        }else{
            AJAX_Error();
        }
    }

    function readystatechange(state) {
        var state = typeof state === 'number' ? state : Cache.xmlhttp.readyState;
        if (Cache.state === state) {
            return 'state not change'
        }
        Cache.state = state;
        switch (state) {
            case Cache.STATE_UNSENT:

                break;
            case Cache.STATE_OPENED:
                
                break;
            case Cache.STATE_HEADERS_RECEIVED:

                break;
            case Cache.STATE_LOADING:
                
                break;
            case Cache.STATE_DONE:
                AJAX_Done();
                CacheAPI.distory();
                break;
            default:
        }
    }
}


export function JSONP(options){
    var Cache = {};
    Cache.id = CreateId();

    Cache.success = function(){};
    Cache.error = function(){};
    Cache.complete = function(){};

    Cache.success = options.success || Cache.success;
    Cache.error = options.error || Cache.error;
    Cache.complete = options.complete || Cache.complete;

    Cache.url = options.url;
    Cache.CallBackName = options.CallBackName || 'jsonp';
    Cache.data = options.data || {};

    function Constructor(){
        Cache.data[Cache.CallBackName] = 'jsonp_'+Cache.id;
        var data = AjaxData(Cache.data);

        window[Cache.data[Cache.CallBackName]] = JSONP_Success;

        var script = document.createElement('script');
            script.setAttribute("type","text/javascript");
            script.src = Cache.url + data;
            script.onerror = JSONP_Error;
        Cache.script = script;

        _$$('body').append([script]);
    }
    Constructor();
    
    var CacheAPI = {};
    CacheAPI.setSuccess = setSuccess;
    CacheAPI.setError = setError;
    CacheAPI.setComplete = setComplete;

    return CacheAPI;
    function JSONP_Success(JSONP_Data){
        Cache.success(JSONP_Data);
        Cache.complete();
    }
    function JSONP_Error(){
        Cache.error();
        Cache.complete();
    }
    function JSONP_Complete(){
        _$('body').removeChild(script);
        window[Cache.data[Cache.CallBackName]] = null;
    }
    function setSuccess(success){
        Cache.success = success;
        return CacheAPI;
    }
    function setError(error){
        Cache.error = error;
        return CacheAPI;
    }
    function setComplete(complete){
        Cache.complete = complete;
        return CacheAPI;
    }
}
export function AjaxData(data, type) {
    type = type || ''
    type = type.toUpperCase() === 'POST' ? 'POST' : 'GEt';
    var dataArr = [];

    var ajaxData = dealData(data, type);
    return returnData();

    function returnData(){
        var theData = {}
        theData.push = pushData;
        theData.valueOf = function(){
            return window.encodeURI(ajaxData);
        }
        return theData;
    }

    function pushData(data){
        ajaxData = dealData(data, type);
        return returnData();
    }
    function dealData(data, type){
        
        for (var key in data) {
            dataArr.push(key + '=' + data[key]);
        }
        if (type === 'GET') {
            return '?' + dataArr.join('&');
        }else if(type === 'POST'){
            return  dataArr.join('&');
        }else{
            return '?' + dataArr.join('&');
        }
    }
}
