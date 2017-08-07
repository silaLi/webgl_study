var i = 0;
var base_id = new Date().getTime();
module.exports = function() {
    i++;
    return 'creatid__id__' + base_id + i;
}