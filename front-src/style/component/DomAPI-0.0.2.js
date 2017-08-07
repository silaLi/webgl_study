/**
 * Dom 元素操作
 *
 * * 1. 元素选择
 * * 2.
 */
function each(list, handle) {
    for (var i = 0; i < list.length; i++) {
        var result = handle.call(this, list[i], i) || { returnBreak: false };
        if (result.returnBreak === true) {
            return result.returnValue;
        }
    }
}

function _$(selector, elem) {
    return elem ? elem.querySelector(selector) : document.querySelector(selector)
}

function _$s(selector, elem) {
    return elem ? elem.querySelectorAll(selector) : document.querySelectorAll(selector)
}

function $$(elemSelector) {
    return new DomAPI(elemSelector);
}
//########################################################
// ClassList
//########################################################
var CommonClassList = {
    add: addClass,
    remove: removeClass,
    contains: containsClass
}
$$.ClassList = {
    add: addClass,
    remove: removeClass,
    contains: containsClass
}

function containsClass(elem, className) {
    if (!elem) {
        return 'there is no elem'; }

    var classList = getClassList(elem);
    if (contains(classList, className) < 0) {
        return false
    }
    return true;
}

function addClass(elem, className) {
    if (!elem) {
        return 'there is no elem'; }

    var classList = getClassList(elem);
    if (contains(classList, className) < 0) {
        classList.push(className)
    }
    setClassList(elem, classList)
    return elem;
}

function removeClass(elem, className) {
    if (!elem) {
        return 'there is no elem'; }

    var classList = getClassList(elem);
    var index = contains(classList, className);
    if (index >= 0) {
        classList.splice(index, 1);
        setClassList(elem, classList);
    }
    return elem;
}

function contains(classList, className) {
    for (var i = 0, len = classList.length; i < len; i++) {
        if (classList[i] == className) {
            return i;
        }
    }
    return -1;
}

function getClassList(elem) {
    var classList = (elem.className || '').split(' ')
    for (var i = classList.length - 1; i >= 0; i--) {
        if (classList[i] === '') {
            classList.splice(i, 1);
        }
    }
    return classList;
}

function setClassList(elem, classList) {
    elem.className = classList.join(' ');
}
//########################################################

//########################################################
// attribute
//########################################################
var CommonAttr = function(elem) {
    return {
        get: get,
        set: set,
        remove: remove
    }

    function get(name) {
        return elem && elem.getAttribute(name);
    }

    function set(name, value) {
        elem && elem.setAttribute(name, value);
        return this;
    }

    function remove(name) {
        elem && elem.removeAttribute(name);
        return this;
    }
}
$$.Attr = CommonAttr;
//########################################################

//########################################################
// fast render
//########################################################
function CommonFastRender(str) {
    var div = document.createElement('div');
    div.innerHTML = str;

    var childElements = [];
    for (var i = 0, len = div.childNodes.length - 1; i <= len; i++) {
        if (div.childNodes[i].nodeType == 1) {
            childElements.push(div.childNodes[i]);
        }
    }
    return childElements;
}
$$.isDOMElement = function (obj) {  
  return !!(obj && typeof window !== 'undefined' && (obj === window || obj.nodeType));  
}  
$$.render = function(str) {
        if (typeof str === 'string') {
            var elemList = CommonFastRender(str)
        }else if ($$.isDOMElement(str)) {
            var elemList = [str];
        } else if (str instanceof Array || !isNaN(str.length - 0) ) {
            var elemList = Array.prototype.slice.call(str);
        }
        return new DomAPI().setElemList(elemList)
    }
    //########################################################

//########################################################
// dom 事件 ctrl
//########################################################
$$.Event = {
        on: function(elem, eventType, next, useCapture) {
            useCapture = useCapture ? true : false;
            if (!elem) {
                return 'has no element in bindEvent'
            }
            if (elem != window && typeof elem.length === 'number' && !elem.nodeType) {
                for (var i = elem.length - 1; i >= 0; i--) {
                    bind(elem[i], eventType, next, useCapture);
                }
            } else {
                bind(elem, eventType, next, useCapture)
            }

            function bind(elem, eventType, next, useCapture) {
                var eventTypes = eventType.split(' ');
                for (var i = eventTypes.length - 1; i >= 0; i--) {
                    if (elem.addEventListener) {
                        elem.addEventListener(eventTypes[i], next, useCapture);
                    } else if (elem.detachEvent) {
                        elem.detachEvent('on' + eventTypes[i], next);
                    } else {
                        elem['on' + eventTypes[i]] = next;
                    }
                }
            }
        },
        off: function(elem, eventType, next, useCapture) {
            useCapture = useCapture || false;

            if (!elem) {
                return 'has no element in bindEvent'
            }
            if (elem != window && typeof elem.length === 'number') {
                for (var i = elem.length - 1; i >= 0; i--) {
                    unbind(elem[i], eventType, next, useCapture);
                }
            } else {
                unbind(elem, eventType, next, useCapture)
            }

            function unbind(elem, eventType, next, useCapture) {
                var eventTypes = eventType.split(' ');
                for (var i = eventTypes.length - 1; i >= 0; i--) {
                    if (elem.removeEventListener) {
                        elem.removeEventListener(eventTypes[i], next, useCapture);
                    } else if (elem.detachEvent) {
                        elem.detachEvent('on' + eventTypes[i], next);
                    } else {
                        elem['on' + eventTypes[i]] = null;
                    }
                }
            }
        }
    }
    //########################################################
function DomAPI(elemSelector, elemParent) {
    var self = this;
    if (elemSelector !== undefined) {
        self.elemSelector = elemSelector;
    }

    self.elemParent = elemParent || [];
    self.elemExecute = false;

    self.elemList = null;

    self.length = 0;
    self.size = function() {
        return self.getElemList().length;
    }
    self.getElemList = function(index) {
        if (self.elemList == null) {

            self.elemParent = [].slice.call(self.elemParent);

            if (self.elemParent.length === 0) {
                self.elemList = _$s(self.elemSelector);
            } else {
                self.elemList = [];
                each(self.elemParent, function(elemParent) {
                    self.elemList = ([].slice.call(_$s(self.elemSelector, elemParent))).concat(self.elemList);
                });
            }
        }
        if (index === undefined) {
            return self.elemList;
        } else {
            return self.elemList[index];
        }

    }
    self.setElemList = function(elemList) {
            self.elemList = elemList;
            return self
        }
        //########################################################
        // Class ctrl
        //########################################################
        //
    self.find = function(selector) {
            return new DomAPI(selector, self.getElemList())
            var elemList = self.getElemList();
            var findElemList = [];
            each(elemList, function(elem) {
                findElemList = [].slice.call(_$s(selector, elem)).concat(findElemList);
            })
            self.setElemList(findElemList);
        }
        //########################################################
        // Class ctrl
        //########################################################
        //
    self.addClass = function(className) {
        each(self.getElemList(), function(elem) {
            CommonClassList.add(elem, className)
        })
        return self;
    }
    self.removeClass = function(className) {
            each(self.getElemList(), function(elem) {
                CommonClassList.remove(elem, className)
            })
            return self;
        }
        // 元素列表是否每个元素都存在这个className
        // 每个元素存在ClassName，返回true
        // 每个元素不存在ClassName，返回false
    self.containClass = function(className) {
            var defaultValue = true;
            var value = each(self.getElemList(), function(elem) {
                if (CommonClassList.contains(elem, className) === false) {
                    return {
                        returnValue: false,
                        returnBreak: true
                    }
                }
            });

            return value === undefined ? defaultValue : value;
        }
        // 元素列表
    self.containClassFilter = function(className, containHandler, notContainHandler) {
            each(self.getElemList(), function(elem, i) {
                if (CommonClassList.contains(elem, className)) {
                    containHandler && containHandler(elem, i);
                } else {
                    notContainHandler && notContainHandler(elem, i);
                }
            })
            return self;
        }
        //########################################################


    //########################################################
    // attribute ctrl
    //########################################################
    self.getAttr = function(name, handle) {
        var elemList = self.getElemList();
        if (typeof handle == 'function') {
            each(elemList, function(elem) {
                handle(CommonAttr(elem).get(name));
            })
        } else {
            return CommonAttr(elemList[0]).get(name);
        }
    }
    self.setAttr = function(name, value) {
        each(self.getElemList(), function(elem) {
            CommonAttr(elem).set(name, value);
        });
    }
    self.removeAttr = function(name) {
            each(self.getElemList(), function(elem) {
                CommonAttr(elem).remove(name);
            });
        }
        //######################################################## 

    //########################################################
    // dom 插入删除 ctrl
    //########################################################
    self.append = function(insertElemList) {
        each(self.getElemList(), function(elem) {
            if (typeof insertElemList.length == 'number') {
                each(insertElemList, function(insertElem) {
                    elem.appendChild(insertElem)
                })
            } else {
                elem.appendChild(insertElemList)
            }
        });
    }
    self.appendBefore = function(insertElemList) {
        each(self.getElemList(), function(elem) {
            if (typeof insertElemList.length == 'number') {
                each(insertElemList, function(insertElem) {
                    elem.insertBefore(insertElem, elem.children[0])
                })
            } else {
                elem.insertBefore(insertElem, elem.children[0])
            }
        });
    }
    self.remove = function() {
            each(self.getElemList(), function(elem) {
                if (elem.parentNode) {
                    elem.parentNode.removeChild(elem);
                }
            });
        }
        //########################################################

    //########################################################
    // dom 事件 ctrl
    //########################################################
    self.on = function(eventType, next, useCapture) {
        $$.Event.on(this.getElemList(), eventType, next, useCapture)
    }

    self.off = function(eventType, next, useCapture) {
        $$.Event.off(this.getElemList(), eventType, next, useCapture)
    }
    self.each = function(handle) {
            var elemList = this.getElemList();
            for (var i = elemList.length - 1; i >= 0; i--) {
                handle(elemList[i], i)
            }
        }
        //########################################################


    //########################################################
    // style 样式 ctrl
    //########################################################
    self.css = function(cssStyle) {
        var elemList = self.getElemList();
        each(elemList, function(elem) {
            for (var styleName in cssStyle) {
                if (cssStyle.hasOwnProperty(styleName)) {
                    elem.style[styleName] = cssStyle[styleName];
                }
            }
        })
    }
    self.cssArray = function(cssStyleList) {
        var self = this;
        cssStyleList = cssStyleList || [];
        each(cssStyleList, function(cssStyle) {
            self.css(cssStyle);
        })
    }
    self.index = function(index) {
        return $$.render([this.getElemList(index)])
    }

    self.height = function(value) {
        each(self.getElemList(), function(elem) {
            elem.style.height = value + 'px'
        })
    }
    self.width = function(value) {
        each(self.getElemList(), function(elem) {
            elem.style.width = value + 'px'
        })
    }

    //########################################################
    // innerhtml innerText  ctrl
    //########################################################
    self.text = function(text) {
        var elemList = self.getElemList();
        each(elemList, function(elem) {
            elem.innerText = text;
            elem.textContext = text;
        })
    }
    self.html = function(html) {
        var elemList = self.getElemList();
        each(elemList, function(elem) {
            elem.innerHTML = html;
        })
    }

    //########################################################
    // position  ctrl
    //########################################################
    self.positionTop = function() {
        var elemList = self.getElemList();
        var top = 0
        if (elemList[0]) {
            var elem = elemList[0];
            while (elem.tagName != 'BODY' && elem.tagName != 'HTML') {
                top += elem.offsetTop
                elem = elem.parentNode;
            }

            return top;
        } else {
            return 0;
        }
    }
    self.parents = function(parentNodeSelector){
        var elemList = [];
        if (parentNodeSelector) {
            var parentCandidate = $$(parentNodeSelector).getElemList();
            var elem = this.getElemList(0).parentNode;
            var parentNodeFind = false;
            while(elem.tagName !== 'BODY' && parentNodeFind === false){
                each(parentCandidate, function(elemCandidate){
                    if (elem == elemCandidate) {
                        elemList.push(elemCandidate);
                        parentNodeFind = true;
                    }
                })
                elem = elem.parentNode;
            }
        }else{
            each(this.getElemList(), function(elem){
                elemList.push(elem.parentNode);
            })
        }
        return $$.render(elemList);
    }
}

//########################################################
// event preventDefault and stopPropagation  ctrl
//########################################################
$$.pdsp = function(e) {
        e.preventDefault()
        e.stopPropagation()
        return false
    }
    //########################################################


//########################################################
// Class mark
//########################################################
$$.Class = DomAPI;
module.exports = $$;
