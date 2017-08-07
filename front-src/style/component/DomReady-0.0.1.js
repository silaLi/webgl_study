import _$$ from './DomAPI-0.0.1'
var Cache = {
    complete: document.readyState === 'complete',
    handler: []
}
_$$.render([document]).on('DOMContentLoaded', completeHandlde)

completeHandlde();

function completeHandlde(event) {
    Cache.complete = true;
    for (var i = 0, len = Cache.handler.length; i < len; i++) {
        complete(Cache.handler[i]);
    }
}

function complete(obj) {
    if (Cache.complete && obj.duration > 0) {
        setTimeout(function() {
            obj.handler && obj.handler();
        }, obj.duration);
    } else if (Cache.complete && obj.duration <= 0) {
        obj.handler && obj.handler();
    }
}
module.exports = function(handler, duration) {
    duration = duration || 0;
    var obj = {
        duration: duration,
        handler: handler
    }
    Cache.handler.push(obj);

    complete(obj);
}
