var a = document.createElement('a');
var a_pathname = document.createElement('a');
var __dirname__list = null;
var __dirname = null;

var __protocol = location.protocol
var __host = location.host
var __origin = __protocol+ '//'+ __host; 

setDirName(location.pathname);

function dir2List(path){
    var pathListNew = [], pathList = path.split('/');

    for (var i = 0, len = pathList.length - 1; i < len; i++) {
        if (pathList[i] != '') {
            pathListNew.push(pathList[i])
        }
    }

    return pathListNew;
}
function dirList2String(pathList){
    return '/' + pathList.join('/') + '/'
}
function setDirName(path){
    a.href = path;
    path = a.pathname;
    __protocol = a.protocol;
    __host = a.host;
    __origin = __protocol+ '//'+ __host; 
    __dirname__list = dir2List(path);
    __dirname = dirList2String(__dirname__list);
}


var Cache = {
    update: setDirName,
    getPath: function(){
        return __dirname;
    },
    resolve: function(url){
        a_pathname.href = __origin + __dirname + url;
       
        var search = a_pathname.search
        var hash = a_pathname.hash

        return a_pathname.href;
    }
};

try{
    Cache.update(document.querySelector('[main-js]').src)
}catch(e){
    console.error('script 缺少 main-js 属性');
}

module.exports = Cache;