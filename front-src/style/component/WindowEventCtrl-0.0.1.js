import CreateId from './CreateId-0.0.1'
import _$$ from './DomAPI-0.0.1'
var EventSet = {}
module.exports = {
    register: function(eventName) {
        if (!EventSet[eventName]) {
            EventSet[eventName] = {
                eventName: eventName,
                ctrl: eventCtrl(eventName)
            }
        }
        return EventSet[eventName].ctrl;
    }
}

function eventCtrl(eventName) {
    var handlerObjSet = {};
    _$$.Event.on(window, eventName, function() {
        for (var id in handlerObjSet) {
            if (handlerObjSet.hasOwnProperty(id)) {
                typeof handlerObjSet[id].handler === 'function' && handlerObjSet[id].handler();
            }
        }
    })
    return {
        push: on,
        remove: off
    }

    function on(handler) {
        var id = CreateId();

        var handlerObj = {
            id: id,
            handler: handler
        }
        handlerObjSet[id] = handlerObj;
        // handlerObj.handler && handlerObj.handler();
        return id;
    }

    function off(id) {
        var handlerObj = handlerObjSet[id];

        delete handlerObjSet[id]
    }
}
