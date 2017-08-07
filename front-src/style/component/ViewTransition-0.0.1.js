// 页面过渡
import _$$ from './DomAPI-0.0.2.js';

var a = 'transition-view-';
export default function(option){
        var elem = _$$.render([option.elem]),
            start = option.start,
            end = option.end,
            complete = option.complete;

        var transitionName = a + start + '-' + end;

        elem.removeClass(start).addClass(transitionName)
        // ClassList.remove(elem, start);
        // ClassList.add(elem, transitionName);
        
        elem.on('animationend webkitAnimationEnd', animationend)
        // Event.bind(elem, 'animationend', animationend)
        // Event.bind(elem, 'webkitAnimationEnd', animationend)
        
        function animationend(e){
            elem.removeClass(transitionName).addClass(end)
            // ClassList.remove(elem, transitionName);
            // ClassList.add(elem, end);
            complete && complete()
            
            elem.off('animationend webkitAnimationEnd', animationend)
            // Event.unbind(elem, 'animationend', animationend)
            // Event.unbind(elem, 'webkitAnimationEnd', animationend)
        }
    }
