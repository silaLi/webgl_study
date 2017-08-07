"use strict";
import './rolling-1.0.1.scss';

(function(factory) {
    var Ro = factory();
    module.exports = Ro;
    return;
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(Ro);
    } else {
        // Add to a global object.
        window.Ro = Ro
    }
}(function() {
    var Ro = {
        id: new Date().getTime(),
        RoCount: 0,
        supportTransition: support_css3('transition') === '' ? '' : 'transition',
        initialize: outsider_initialize,
        showIntoView: outsider_showIntoView,
        update: outsider_update,
        updateState: outsider_updateState,
        setScrollTop: outsider_setScrollTop,
        getCache: outsider_temporary_getCacheCheck,
        test: outsider_temporary_test
    };
    var Cache = {};
    /** 
     * scrollbar: visible/hover/hidden
     * state: run/stop
     */
    var settingDefault = {
        handleEvent: ['wheel', 'barDarg', 'touch'],
        scrollLength: 100,
        stopPropagation: true,
        scrollbarBtn: false,
        scrollbar: 'visible',
        scrollbarY: true,
        state: 'run',
        scrollbarWitdh: 6,
        scrollbarHoverWidth: 13,
        scrollbarColor: 'rgba(170,170,170,1)',
        scrollbarHoverColor: 'rgba(255, 255, 255, .6)',
        scrollbarRailColor: 'rgba(212,212,212,1)',
        scrollbarRailHoverColor: 'rgba(0, 0, 0, .6)',
    }

    return Ro;

    /********************************************************************************************************************************************
     * 开发临时开放的api函数
     ********************************************************************************************************************************************/
    /**
     * 查看组件缓存数据
     * show the component cache data
     * @return {[type]} [缓存数据 the component cache data]
     */
    function outsider_temporary_getCacheCheck() {
        return Cache;
    }

    function outsider_temporary_test(view, color) {
        if (view) {
            var roCache = getCache(view);
        } else {
            var roCache = Cache['roid-' + (Ro.id + 1)];
        }
        color = color || '#000'
        return backgroundIE8WithIeFlilter(color)
    }

    /********************************************************************************************************************************************
     * 初始化函数
     ********************************************************************************************************************************************/

    /**
     * Ro构造函数
     * @param  {[type]} elem    [对某个元素进行组件化]
     * @param  {[type]} setting [组件化的设置]
     * @return {[type]}         [description]
     */
    function constructor(elem, setting) {
        ++Ro.RoCount;
        var roCache = {
            roid: 'roid-' + (Ro.id + Ro.RoCount),
            container_elem: elem,
            wrapper_elem: $$('.rolling-wrapper', elem),
            scrollTop: 0,
            barTop: 0,
            setting: setting
        };
        AttributeSetter(elem, 'roid', roCache.roid);

        elem.appendChild(CreatScrollBar(roCache));

        RoBindEvent(roCache)
        Cache[roCache.roid] = roCache;
    }

    /**
     * 创建滚动条
     * @param {[type]} roCache [ro缓存数据]
     */
    function CreatScrollBar(roCache) {
        var setting = roCache.setting;

        var bar = document.createElement('div');
        bar.className = 'rolling-scrollbar rolling-scrollbar-' + setting.scrollbar + ' ' + Ro.supportTransition;

        roCache.container_elem.className = addClassName(addClassName(roCache.container_elem.className, 'rolling-barshow-' + setting.scrollbar), Ro.supportTransition);

        if (setting.scrollbarY === true) {
            bar.innerHTML += '<div class="rolling-scrollbar-y-rail">\
                <div class="rolling-scrollbar-y">\
                    <!--[if IE 8]><div class="ie8-filter-mask"></div><![endif]-->\
                </div>\
                <!--[if IE 8]><div class="ie8-filter-mask"></div><![endif]-->\
            </div>'
        }

        roCache.scrollBarRailY_elem = $$('.rolling-scrollbar-y-rail', bar);
        roCache.scrollBarY_elem = $$('.rolling-scrollbar-y', bar);

        _setScrollBar(roCache)
        return bar;
    }

    /**
     * 进行组件的事件绑定
     * @param {[type]} roCache [description]
     */
    function RoBindEvent(roCache) {
        var setting = roCache.setting;
        var handleEvent = setting.handleEvent
        for (var i = handleEvent.length - 1; i >= 0; i--) {
            if (handleEvent[i] === 'wheel') {
                bindMousewheel(roCache);
            }
            if (handleEvent[i] === 'barDarg') {
                bindDrag(roCache);
            }
            if (handleEvent[i] === 'touch') {
                bindTouch(roCache);
            }
        }
    }


    /********************************************************************************************************************************************
     * 事件绑定
     ********************************************************************************************************************************************/

    /**
     * [bindTouch 绑定touch事件，支持手机使用]
     * @param  {[type]} roCache [description]
     * @return {[type]}         [description]
     */
    function bindTouch(roCache) {
        bindEvent(roCache.container_elem, 'touchstart', touchstart);

        var y = null;

        function touchmove(event) {
            var curY = touchGetClient(event).y;

            var changeY = curY - y;
            y = curY;

            if (changeY !== 0) {
                var before_scrollTop = roCache.scrollTop
                var after_scrollTop = rollingByScrollTopPlus(roCache, -changeY).scrollTop
                if (roCache.setting.stopPropagation || after_scrollTop !== before_scrollTop) {
                    stopProp(event);
                }
            }
        }

        function touchstart(event) {
            bindEvent(roCache.container_elem, 'touchmove', touchmove);
            bindEvent(roCache.container_elem, 'touchend', touchend);

            y = touchGetClient(event).y;
        }

        function touchend() {
            unbindEvent(roCache.container_elem, 'touchmove', touchmove);
            unbindEvent(roCache.container_elem, 'touchend', touchend);
        }

        function touchGetClient(touchEvent) {
            var y = 0;
            var x = 0;
            try {
                x = touchEvent.touches[0].clientX;
                y = touchEvent.touches[0].clientY;
            } catch (e) {
                x = touchEvent.changedTouches[0].clientX;
                y = touchEvent.changedTouches[0].clientY;
            }
            return {
                x: x,
                y: y
            }
        }
    }

    /**
     * 绑定滚动条的拖动事件
     * @param  {[type]} roCache [description]
     * @return {[type]}         [description]
     */
    function bindDrag(roCache) {
        bindEvent(roCache.scrollBarY_elem, 'mousedown', mousedown);

        var y = null;
        var notMouseupTime = null;

        function mousemove(event) {
            event = event || window.event;

            // 第一次的y值已经在mousdown中获取到了
            // 获取当前Y值
            var curY = event.clientY;
            // 计算变化的Y值
            var changeY = curY - y;
            y = curY;
            stopProp(event)

            // 更新显示 
            // 变化不等于0的时候更新组件显示
            if (changeY !== 0) {
                rollingByBarTopPlus(roCache, changeY)
            }

            clearTimeout(notMouseupTime);
            notMouseupTime = setTimeout(haveNoMouseup, 3000)
        }

        function mousedown(event) {
            bindEvent(document.body, 'mousemove', mousemove);
            bindEvent(document.body, 'mouseup', mouseup);

            roCache.container_elem.className = addClassName(roCache.container_elem.className, 'bar-fixed-hover')

            y = event.clientY;
        }

        function mouseup() {
            unbindEvent(document.body, 'mousemove', mousemove);
            unbindEvent(document.body, 'mouseup', mouseup);

            roCache.container_elem.className = removeClassName(roCache.container_elem.className, 'bar-fixed-hover')
        }

        // 鼠标不在网页中的时候，自动执行mouseup
        // 比如鼠标没有在网页中松开，那么将不会执行mouseup事件
        function haveNoMouseup() {
            clearTimeout(notMouseupTime);
            mouseup();
        }
    }
    /**
     * 元素绑定鼠标的滚动事件
     * @param  {[type]} roCache [ro缓存数据]
     */
    function bindMousewheel(roCache) {
        var setting = roCache.setting;
        var container_elem = roCache.container_elem;
        var wrapper_elem = roCache.wrapper_elem;

        // 为什么是给container_elem绑定事件而不是wrapper_elem
        // 因为当鼠标在滚动条的时候，要保证可以同时使用鼠标的滚动事件
        // 火狐浏览器的滚动事件
        container_elem.addEventListener && container_elem.addEventListener("DOMMouseScroll", function(event) {
            handleEvent(event, wrapper_elem);
        });
        container_elem.onmousewheel = function(event) {
            event = event || window.event;
            handleEvent(event, wrapper_elem);
        };

        /**
         * 滚动事件的处理函数
         * @param  {[type]} event          [事件event对象]
         * @param  {[type]} container_elem [捕获事件的对象]
         */
        function handleEvent(event, wrapper_elem) {
            var direction = event.wheelDelta || (-event.detail);
            var before_scrollTop = wrapper_elem.scrollTop;
            var scrollTop = before_scrollTop;
            if (direction < 0) {
                scrollTop += setting.scrollLength;
            } else {
                scrollTop -= setting.scrollLength;
            }

            var after_scrollTop = rollingByScrollTop(roCache, scrollTop).scrollTop;

            if (setting.stopPropagation || after_scrollTop !== before_scrollTop) {
                stopProp(event);
            }
        }
    }

    /********************************************************************************************************************************************
     * 组件对外api
     ********************************************************************************************************************************************/

    /**
     * Ro对外开放的初始化函数
     * @param  {[type]} elem    [进行初始化的元素对象，可以接受类数组对象，和元素对象]
     * @param  {[type]} setting [Ro设置]
     */
    function outsider_initialize(elem, setting) {
        var setting = extendObj(settingDefault, setting || {});

        if (elem.length) {
            for (var i = 0, len = elem.length; i < len; i++) {
                constructor(elem[i], setting);
            }
        } else {
            constructor(elem, setting);
        }
    }

    /**
     * update Ro component state
     * @param  {[type]} view  [Ro组件元素]
     * @param  {[type]} state [状态]
     */
    function outsider_updateState(view, state) {
        var roCache = getCache(view)
        roCache.setting.state = state;
    }
    /**
     * 设置元素的scrollTop 
     * 向外开放api
     * @param {[type]} view      [元素对象]
     * @param {[type]} scrollTop [scrollTop value]
     */
    function outsider_setScrollTop(view, scrollTop) {
        var roCache = getCache(view);
        rollingByScrollTop(roCache, scrollTop)
    }

    /**
     * 在滚动之中显示某个元素，参考scrollIntoView功能
     * @param  {[type]} view      [滚动的元素]
     * @param  {[type]} elem      [需要显示的元素]
     * @param  {[type]} direction [方向在滚动的前方显示还是在后方显示， 可选值为：'front/end', 默认为'front']
     */
    function outsider_showIntoView(view, elem, direction) {
        var roCache = getCache(view);
        var scrollTop, elemHeight;

        var elemInView = elemIntoView(roCache, elem);

        if (direction !== 'end' && direction !== 'front') {
            if (elemInView === true) {
                // 没有必要滚动，因为元素节点在可视框内
                return;
            } else {
                scrollTop = elemInView.scrollTop;
                elemHeight = elemInView.elemHeight;
                direction = direction || elemInView.direction;
            }
        } else {
            scrollTop = elem.offsetTop;
            elemHeight = elem.clientHeight;
        }

        scrollTop = direction === 'end' ? scrollTop - roCache.wrapperHeight + elemHeight : scrollTop;
        scrollTop = _setElemScrollTop(roCache, scrollTop);
        rollingByScrollTop(roCache, scrollTop)
    }

    /**
     * 更新组件
     * update the component, reset the component scroll date
     * @param  {[type]} view [滚动的元素]
     */
    function outsider_update(view) {
        resetScrollBar(getCache(view))
    }


    /********************************************************************************************************************************************
     * 对内支持函数（底层函数与对外api中间连接函数）
     ********************************************************************************************************************************************/

    /**
     * [resetScrollBar 重新设置组件数据]
     * @param  {[type]} roCache [description]
     * @return {[type]}         [description]
     */
    function resetScrollBar(roCache) {
        _setScrollBar(roCache);
    }

    /**
     * [elemIntoView 判断元素是否在网页的可视区域范围]
     * @param  {[type]} roCache [description]
     * @param  {[type]} elem    [description]
     * @return {[type]}         [description]
     */
    function elemIntoView(roCache, elem) {
        var scrollTop = elem.offsetTop;
        var elemHeight = elem.clientHeight;

        if (scrollTop < roCache.scrollTop) {
            return {
                direction: 'front',
                scrollTop: scrollTop,
                elemHeight: elemHeight
            }
        }
        if (elemHeight + scrollTop > roCache.scrollTop + roCache.wrapperHeight) {
            return {
                direction: 'end',
                scrollTop: scrollTop,
                elemHeight: elemHeight
            }
        }
        return true;
    }
    /**
     * [rollingByBarTopPlus 更新组件srollTop值]
     * @param {[type]} roCache       [缓存数据]
     * @param {[type]} topDifference [top变化差值， 单位px]
     */
    function rollingByBarTopPlus(roCache, topDifference) {
        var top = roCache.barTop + topDifference;
        return rollingByBarTop(roCache, top)
    }
    /**
     * [rollingByScrollTopPlus 更新组件srollTop值]
     * @param {[type]} roCache             [缓存数据]
     * @param {[type]} scrolltopDifference [scrollTop变化差值， 单位px]
     */
    function rollingByScrollTopPlus(roCache, scrollTopDifference) {
        var scrollTop = roCache.scrollTop + scrollTopDifference;
        return rollingByScrollTop(roCache, scrollTop)
    }

    /**
     * [rollingByBarTop 执行组件滚动，通过top值]
     * 包括执行scrollTop的赋值
     */
    function rollingByBarTop(roCache, top) {
        top = _setBarTop(roCache, top);
        var scrollTop = barTopToScrollTop(roCache, top);
        _setElemScrollTop(roCache, scrollTop);
        return {
            top: top,
            scrollTop: scrollTop
        }
    }

    /**
     * [rollingByScrollTop 执行组件滚动，通过scrollTop值]
     * 包括执行BarTop的赋值
     */
    function rollingByScrollTop(roCache, scrollTop) {
        scrollTop = _setElemScrollTop(roCache, scrollTop);
        var top = scrollTopToBarTop(roCache, scrollTop);
        _setBarTop(roCache, top);
        return {
            top: top,
            scrollTop: scrollTop
        }
    }

    /**
     * 获取组件缓存数据
     * get the component cache data
     * @param  {[type]} elem [被Ro初始化的元素]
     */
    function getCache(elem) {
        var roid = AttributeGetter(elem, 'roid');
        if (!Cache[roid]) {
            throw new 'has no roCache';
        }
        return Cache[roid];
    }
    /**
     * [barTopToScrollTop 转换函数]
     * barTop to scrollTop
     * @param  {[type]} roCache [description]
     * @param  {[type]} top     [description]
     * @return {[type]}         [scrollTop]
     */
    function barTopToScrollTop(roCache, top) {
        return Math.floor(top / roCache.wrapperHeight * roCache.scrollYlength);
    }
    /**
     * [scrollTopToBarTop 转换函数]
     * scrollTop to barTop
     * @param  {[type]} roCache   [description]
     * @param  {[type]} scrollTop [description]
     * @return {[type]}           [barTop]
     */
    function scrollTopToBarTop(roCache, scrollTop) {
        return Math.ceil(scrollTop / roCache.scrollYlength * roCache.wrapperHeight);
    }


    /********************************************************************************************************************************************
     * 对内底层支持函数（操作Element函数）
     ********************************************************************************************************************************************/

    /**
     * 设置滚动条的数据
     * @param {[type]} roCache [description]
     */
    function _setScrollBar(roCache) {
        var setting = roCache.setting;
        var container_elem = roCache.container_elem;
        var wrapper_elem = roCache.wrapper_elem;


        var wrapperHeight = container_elem.clientHeight;;
        var scrollYlength = getScrollHeight(roCache);
        var scrollBarYHeight = Math.floor(wrapperHeight / scrollYlength * wrapperHeight);

        roCache.wrapperHeight = wrapperHeight;
        roCache.scrollYlength = scrollYlength;
        roCache.barYLength = scrollBarYHeight;

        // 最大bar.style.top值
        roCache.maxBarTop = wrapperHeight - scrollBarYHeight;
        // 最大warpper.srollTop值
        roCache.maxScrollTop = scrollYlength - wrapperHeight;

        roCache.scrollBarY_elem.style.cssText = 'height: ' + scrollBarYHeight + 'px;'

        var cssString = '.rolling-scrollbar .rolling-scrollbar-y-rail, .rolling-barshow-hover:hover .rolling-scrollbar .rolling-scrollbar-y-rail{\
                            width: '+setting.scrollbarWitdh+'px;\
                            '+backgroundIE9Plus(setting.scrollbarRailColor)+';\
                        }\
                        .rolling-scrollbar-y-rail .rolling-scrollbar-y, .rolling-barshow-hover:hover .rolling-scrollbar-y-rail .rolling-scrollbar-y{\
                            '+backgroundIE9Plus(setting.scrollbarColor)+';\
                        }\
                        .rolling-scrollbar .rolling-scrollbar-y-rail:hover, .bar-fixed-hover .rolling-scrollbar .rolling-scrollbar-y-rail{\
                            width: '+setting.scrollbarHoverWidth+'px !important;\
                            '+backgroundIE9Plus(setting.scrollbarHoverColor, ' !important')+';\
                        }\
                        .rolling-scrollbar-y-rail:hover .rolling-scrollbar-y, .bar-fixed-hover .rolling-scrollbar-y-rail .rolling-scrollbar-y{\
                            background: '+backgroundIE9Plus(setting.scrollbarRailHoverColor, ' !important')+';\
                        }\
                        .rolling-scrollbar .rolling-scrollbar-y-rail > .ie8-filter-mask, .rolling-barshow-hover:hover .rolling-scrollbar .rolling-scrollbar-y-rail > .ie8-filter-mask{\
                            '+backgroundIE8WithIeFlilter(setting.scrollbarRailColor)+'\
                        }\
                        .rolling-scrollbar-y-rail .rolling-scrollbar-y > .ie8-filter-mask, .rolling-barshow-hover:hover .rolling-scrollbar-y-rail .rolling-scrollbar-y > .ie8-filter-mask{\
                            '+backgroundIE8WithIeFlilter(setting.scrollbarColor)+'\
                        }\
                        .rolling-scrollbar .rolling-scrollbar-y-rail:hover > .ie8-filter-mask, .bar-fixed-hover .rolling-scrollbar .rolling-scrollbar-y-rail > .ie8-filter-mask{\
                            '+backgroundIE8WithIeFlilter(setting.scrollbarHoverColor, ' !important')+'\
                        }\
                        .rolling-scrollbar-y-rail:hover .rolling-scrollbar-y > .ie8-filter-mask, .bar-fixed-hover .rolling-scrollbar-y-rail .rolling-scrollbar-y > .ie8-filter-mask{\
                            '+backgroundIE8WithIeFlilter(setting.scrollbarRailHoverColor, ' !important')+'\
                        }';
        _setComponentStyle(roCache, cssString);
    }

    /**
     * [_setComponentStyle description set the component style]
     * @param {[type]} roCache   [description]
     * @param {[type]} cssString [description]
     */
    function _setComponentStyle(roCache, cssString) {
        var style = _createStyleElement(cssString);

        $$('head').appendChild(style);
        roCache.style_elem = style;
    }

    /**
     * [_createStyleElement create a style Element by cssText, and adapte ie8]
     * @param  {[type]} cssString [description]
     * @return {[type]}           [description]
     */
    function _createStyleElement(cssString) {
        var style = document.createElement("style");
        style.type = 'text/css';
        var cssString = cssString || '';

        if (style.styleSheet) { // IE  
            style.styleSheet.cssText = cssString;
        } else { // w3c  
            var cssText = document.createTextNode(cssString);
            style.appendChild(cssText);
        }

        return style;
    }

    /**
     * [_resetComponentStyle reset the component style, and replace the style element]
     * @param  {[type]} roCache   [description]
     * @param  {[type]} cssString [description]
     * @return {[type]}           [description]
     */
    function _resetComponentStyle(roCache, cssString) {
        var style = _createStyleElement(cssString);

        $$('head').replaceChild(style, roCache.style_elem)
    }

    /**
     * [getScrollHeight 获取元素区域scrollheight]
     * element.scrollHeight 这种方式会出现scrollheight 多了5px的问题
     * @param  {[type]} roCache [description]
     * @return {[type]}         [description]
     */
    function getScrollHeight(roCache, cssString) {
        var div = document.createElement('div');
        div.style.height = 0;

        roCache.wrapper_elem.appendChild(div);
        var srcollheight = div.offsetTop;

        roCache.wrapper_elem.removeChild(div);
        return srcollheight;
    }

    /**
     * 设置滚动元素的scrollTop值
     * 底层实现
     * @param {[type]} roCache   [description]
     * @param {[type]} scrollTop [description]
     */
    function _setElemScrollTop(roCache, scrollTop) {
        if (roCache.setting.state !== 'run') {
            return roCache.scrollTop
        }
        if (scrollTop > roCache.maxScrollTop) {
            scrollTop = roCache.maxScrollTop;
        } else if (scrollTop < 0) {
            scrollTop = 0;
        }
        roCache.wrapper_elem.scrollTop = scrollTop;
        roCache.scrollTop = roCache.wrapper_elem.scrollTop;
        return roCache.scrollTop;
    }

    /**
     * 设置Bar的top值
     * 底层实现
     * @param {[type]} roCache [description]
     * @param {[type]} top     [description]
     */
    function _setBarTop(roCache, Top) {
        if (roCache.setting.state !== 'run') {
            return roCache.top
        }
        if (Top > roCache.maxBarTop) {
            Top = roCache.maxBarTop;
        } else if (Top < 0) {
            Top = 0;
        }
        roCache.scrollBarY_elem.style.top = Top + 'px';
        roCache.barTop = Top;
        return Top;
    }


    /********************************************************************************************************************************************
     * 工具类函数
     ********************************************************************************************************************************************/

    function backgroundIE8WithIeFlilter(color, suffix){
        suffix = suffix || '';
        var matchRegExpRgb = /^rgb/;

        var matchRegExp = /^#/;

        if (matchRegExpRgb.test(color)) {
            try {
                color = eval(color);
            } catch (e) {
                throw 'the rgba format is incorrect  : ' + color
            }
        }else if (matchRegExp.test(color)){
            color = normalToFilterColor(color);
        }

        return 'filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr={{color}},endcolorstr={{color}})'.replace(/\{\{color\}\}/g, color) + suffix;

        function rgba(r, g, b, a){
            return normalToFilterColor(rgbToNormal(r, g, b), a);
        }
        function rgb(r, g, b){
            return rgba(r, g, b, 1);
        }
        function normalToFilterColor(color, a){
            a = a || 1;
            return color.replace('#', '#' + Math.floor(a * 255).toString(16))
        }
        function rgbToNormal(r, g, b){
            r = (+r).toString(16); r = r.length === 1 ? '0' + r : r;
            g = (+g).toString(16); g = g.length === 1 ? '0' + g : g;
            b = (+b).toString(16); b = b.length === 1 ? '0' + b : b;
            return '#' + r + g + b;
        }
    }

    function backgroundIE9Plus(color, suffix){
        suffix = suffix || '';
        return 'background: center, ' + color + suffix;
    }

    /**
     * 元素属性设置函数
     * @param {[type]} elem      [Element]
     * @param {[type]} attribute [attribute name]
     * @param {[type]} value     [attribute value]
     */
    function AttributeSetter(elem, attribute, value) {
        elem.setAttribute(attribute, value);
    }
    /**
     * 元素属性获取函数
     * @param {[type]} elem      [Element]
     * @param {[type]} attribute [attribute name]
     */
    function AttributeGetter(elem, attribute) {
        return elem.getAttribute(attribute);
    }

    /**
     * 兼容绑定事件
     * @param  {[type]}   elem       [需要绑定事件的元素]
     * @param  {[type]}   eventType  [事件类型名字]
     * @param  {Function} next       [事件回调函数]
     * @param  {[type]}   useCapture [事件类型，冒泡/捕获]
     */
    function bindEvent(elem, eventType, next, useCapture) {
        useCapture = useCapture || false;
        if (elem.addEventListener) {
            elem.addEventListener(eventType, next, useCapture);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + eventType, next, useCapture);
        } else {
            elem['on' + eventType] = next;
        }
    }
    /**
     * 兼容取消绑定事件
     * @param  {[type]}   elem       [需要取消绑定事件的元素]
     * @param  {[type]}   eventType  [事件类型名字]
     * @param  {Function} next       [事件回调函数]
     * @param  {[type]}   useCapture [事件类型，冒泡/捕获]
     */
    function unbindEvent(elem, eventType, next, useCapture) {
        useCapture = useCapture || false;
        if (elem.removeEventListener) {
            elem.removeEventListener(eventType, next, useCapture);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + eventType, next, useCapture);
        } else {
            elem['on' + eventType] = null;
        }
    }
    /**
     * 停止滚动事件冒泡
     * @param  {[type]} event [事件event对象]
     */
    function stopProp(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        if (window.event) {
            event.returnValue = false;
            event.cancelBubble = true;
        }
    }

    /**
     * css3的样式支持查询
     * @param  {[type]} prop [css prop]
     * @return {[type]}      [Boolean]
     */
    function support_css3(prop) {
        var div = document.createElement('div'),
            vendors = 'Ms O Moz Webkit'.split(' ');
        if (prop in div.style) return prop;

        prop = prop.replace(/^[a-z]/, function(val) {
            return val.toUpperCase();
        });

        for (var i = vendors.length - 1; i >= 0; i--) {
            if (vendors[i] + prop in div.style) {
                return vendors[i] + prop;
            }
        }
        return '';
    }

    /**
     * [hasClassName check the className_check exist in the className]
     * @param  {[type]}  className       [description]
     * @param  {[type]}  className_check [description]
     * @return {Boolean}                 [description]
     */
    function hasClassName(className, className_check) {
        var classNameArr = className.split(' ');
        for (var i = classNameArr.length - 1; i >= 0; i--) {
            if (classNameArr[i] === className_check) {
                return true;
            }
        }
        return false;
    }

    /**
     * [addClassName add className for element]
     * @param {[type]} className     [description]
     * @param {[type]} className_add [description]
     * return {string} new className
     */
    function addClassName(className, className_add) {
        if (className_add === '' || className_add == null) {
            return className;
        }
        if (!hasClassName(className, className_add)) {
            className += ' ' + className_add;
        }
        return className
    }
    /**
     * [addClassName remove className for element]
     * @param {[type]} className        [description]
     * @param {[type]} className_remove [description]
     * return {string} new className
     */
    function removeClassName(className, className_remove) {
        if (className_remove === '' || className_remove == null) {
            return className;
        }
        var classNameArr = className.split(' ');
        for (var i = classNameArr.length - 1; i >= 0; i--) {
            if (classNameArr[i] === className_remove) {
                classNameArr.splice(i, 1);
            }
        }
        return classNameArr.join(' ');
    }
    /**
     * [classNameChange handle the assignment of the element className]
     * @param  {[type]} elem          [description]
     * @param  {[type]} className_new [description]
     * @param  {[type]} className_old [description]
     * @return {[type]}               [description]
     */
    function classNameChange(elem, className_new, className_old) {
        if (className_new != className_old) {
            elem.className = className_new;
        }
    }
    /**
     * 元素查找函数
     * @param  {[type]} selector [选择器]
     * @param  {[type]} p        [父元素，默认为document]
     * @return {[type]}          [Element]
     */
    function $$(selector, p) {
        return p ? p.querySelector(selector) : document.querySelector(selector);
    };
    /**
     * 元素查找函数
     * @param  {[type]} selector [选择器]
     * @param  {[type]} p        [父元素，默认为document]
     * @return {[type]}          [Array Element]
     */
    function $$s(selector, p) {
        return p ? p.querySelectorAll(selector) : document.querySelectorAll(selector);
    };

    /**
     * 对象c继承对象p的属性
     * @param  {[type]} p [父类]
     * @param  {[type]} c [子类]
     * @return {[type]}   [新对象]
     */
    function extendObj(p, c) {
        var newobj = {};
        for (var key in p) {
            if (p.hasOwnProperty(key)) {
                newobj[key] = (typeof c[key] !== 'undefined') ? c[key] : p[key];
            }
        }
        return newobj;
    }

}));
