/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
    return elem ? elem.querySelector(selector) : document.querySelector(selector);
}

function _$s(selector, elem) {
    return elem ? elem.querySelectorAll(selector) : document.querySelectorAll(selector);
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
};
$$.ClassList = {
    add: addClass,
    remove: removeClass,
    contains: containsClass
};

function containsClass(elem, className) {
    if (!elem) {
        return 'there is no elem';
    }

    var classList = getClassList(elem);
    if (contains(classList, className) < 0) {
        return false;
    }
    return true;
}

function addClass(elem, className) {
    if (!elem) {
        return 'there is no elem';
    }

    var classList = getClassList(elem);
    if (contains(classList, className) < 0) {
        classList.push(className);
    }
    setClassList(elem, classList);
    return elem;
}

function removeClass(elem, className) {
    if (!elem) {
        return 'there is no elem';
    }

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
    var classList = (elem.className || '').split(' ');
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
var CommonAttr = function CommonAttr(elem) {
    return {
        get: get,
        set: set,
        remove: remove
    };

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
};
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
};
$$.render = function (str) {
    if (typeof str === 'string') {
        var elemList = CommonFastRender(str);
    } else if ($$.isDOMElement(str)) {
        var elemList = [str];
    } else if (str instanceof Array || !isNaN(str.length - 0)) {
        var elemList = Array.prototype.slice.call(str);
    }
    return new DomAPI().setElemList(elemList);
};
//########################################################

//########################################################
// dom 事件 ctrl
//########################################################
$$.Event = {
    on: function on(elem, eventType, next, useCapture) {
        useCapture = useCapture ? true : false;
        if (!elem) {
            return 'has no element in bindEvent';
        }
        if (elem != window && typeof elem.length === 'number' && !elem.nodeType) {
            for (var i = elem.length - 1; i >= 0; i--) {
                bind(elem[i], eventType, next, useCapture);
            }
        } else {
            bind(elem, eventType, next, useCapture);
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
    off: function off(elem, eventType, next, useCapture) {
        useCapture = useCapture || false;

        if (!elem) {
            return 'has no element in bindEvent';
        }
        if (elem != window && typeof elem.length === 'number') {
            for (var i = elem.length - 1; i >= 0; i--) {
                unbind(elem[i], eventType, next, useCapture);
            }
        } else {
            unbind(elem, eventType, next, useCapture);
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
    //########################################################
};function DomAPI(elemSelector, elemParent) {
    var self = this;
    if (elemSelector !== undefined) {
        self.elemSelector = elemSelector;
    }

    self.elemParent = elemParent || [];
    self.elemExecute = false;

    self.elemList = null;

    self.length = 0;
    self.size = function () {
        return self.getElemList().length;
    };
    self.getElemList = function (index) {
        if (self.elemList == null) {

            self.elemParent = [].slice.call(self.elemParent);

            if (self.elemParent.length === 0) {
                self.elemList = _$s(self.elemSelector);
            } else {
                self.elemList = [];
                each(self.elemParent, function (elemParent) {
                    self.elemList = [].slice.call(_$s(self.elemSelector, elemParent)).concat(self.elemList);
                });
            }
        }
        if (index === undefined) {
            return self.elemList;
        } else {
            return self.elemList[index];
        }
    };
    self.setElemList = function (elemList) {
        self.elemList = elemList;
        return self;
    };
    //########################################################
    // Class ctrl
    //########################################################
    //
    self.find = function (selector) {
        return new DomAPI(selector, self.getElemList());
        var elemList = self.getElemList();
        var findElemList = [];
        each(elemList, function (elem) {
            findElemList = [].slice.call(_$s(selector, elem)).concat(findElemList);
        });
        self.setElemList(findElemList);
    };
    //########################################################
    // Class ctrl
    //########################################################
    //
    self.addClass = function (className) {
        each(self.getElemList(), function (elem) {
            CommonClassList.add(elem, className);
        });
        return self;
    };
    self.removeClass = function (className) {
        each(self.getElemList(), function (elem) {
            CommonClassList.remove(elem, className);
        });
        return self;
    };
    // 元素列表是否每个元素都存在这个className
    // 每个元素存在ClassName，返回true
    // 每个元素不存在ClassName，返回false
    self.containClass = function (className) {
        var defaultValue = true;
        var value = each(self.getElemList(), function (elem) {
            if (CommonClassList.contains(elem, className) === false) {
                return {
                    returnValue: false,
                    returnBreak: true
                };
            }
        });

        return value === undefined ? defaultValue : value;
    };
    // 元素列表
    self.containClassFilter = function (className, containHandler, notContainHandler) {
        each(self.getElemList(), function (elem, i) {
            if (CommonClassList.contains(elem, className)) {
                containHandler && containHandler(elem, i);
            } else {
                notContainHandler && notContainHandler(elem, i);
            }
        });
        return self;
    };
    //########################################################


    //########################################################
    // attribute ctrl
    //########################################################
    self.getAttr = function (name, handle) {
        var elemList = self.getElemList();
        if (typeof handle == 'function') {
            each(elemList, function (elem) {
                handle(CommonAttr(elem).get(name));
            });
        } else {
            return CommonAttr(elemList[0]).get(name);
        }
    };
    self.setAttr = function (name, value) {
        each(self.getElemList(), function (elem) {
            CommonAttr(elem).set(name, value);
        });
    };
    self.removeAttr = function (name) {
        each(self.getElemList(), function (elem) {
            CommonAttr(elem).remove(name);
        });
    };
    //######################################################## 

    //########################################################
    // dom 插入删除 ctrl
    //########################################################
    self.append = function (insertElemList) {
        each(self.getElemList(), function (elem) {
            if (typeof insertElemList.length == 'number') {
                each(insertElemList, function (insertElem) {
                    elem.appendChild(insertElem);
                });
            } else {
                elem.appendChild(insertElemList);
            }
        });
    };
    self.appendBefore = function (insertElemList) {
        each(self.getElemList(), function (elem) {
            if (typeof insertElemList.length == 'number') {
                each(insertElemList, function (insertElem) {
                    elem.insertBefore(insertElem, elem.children[0]);
                });
            } else {
                elem.insertBefore(insertElem, elem.children[0]);
            }
        });
    };
    self.remove = function () {
        each(self.getElemList(), function (elem) {
            if (elem.parentNode) {
                elem.parentNode.removeChild(elem);
            }
        });
    };
    //########################################################

    //########################################################
    // dom 事件 ctrl
    //########################################################
    self.on = function (eventType, next, useCapture) {
        $$.Event.on(this.getElemList(), eventType, next, useCapture);
    };

    self.off = function (eventType, next, useCapture) {
        $$.Event.off(this.getElemList(), eventType, next, useCapture);
    };
    self.each = function (handle) {
        var elemList = this.getElemList();
        for (var i = elemList.length - 1; i >= 0; i--) {
            handle(elemList[i], i);
        }
    };
    //########################################################


    //########################################################
    // style 样式 ctrl
    //########################################################
    self.css = function (cssStyle) {
        var elemList = self.getElemList();
        each(elemList, function (elem) {
            for (var styleName in cssStyle) {
                if (cssStyle.hasOwnProperty(styleName)) {
                    elem.style[styleName] = cssStyle[styleName];
                }
            }
        });
    };
    self.cssArray = function (cssStyleList) {
        var self = this;
        cssStyleList = cssStyleList || [];
        each(cssStyleList, function (cssStyle) {
            self.css(cssStyle);
        });
    };
    self.index = function (index) {
        return $$.render([this.getElemList(index)]);
    };

    self.height = function (value) {
        each(self.getElemList(), function (elem) {
            elem.style.height = value + 'px';
        });
    };
    self.width = function (value) {
        each(self.getElemList(), function (elem) {
            elem.style.width = value + 'px';
        });
    };

    //########################################################
    // innerhtml innerText  ctrl
    //########################################################
    self.text = function (text) {
        var elemList = self.getElemList();
        each(elemList, function (elem) {
            elem.innerText = text;
            elem.textContext = text;
        });
    };
    self.html = function (html) {
        var elemList = self.getElemList();
        each(elemList, function (elem) {
            elem.innerHTML = html;
        });
    };

    //########################################################
    // position  ctrl
    //########################################################
    self.positionTop = function () {
        var elemList = self.getElemList();
        var top = 0;
        if (elemList[0]) {
            var elem = elemList[0];
            while (elem.tagName != 'BODY' && elem.tagName != 'HTML') {
                top += elem.offsetTop;
                elem = elem.parentNode;
            }

            return top;
        } else {
            return 0;
        }
    };
    self.parents = function (parentNodeSelector) {
        var elemList = [];
        if (parentNodeSelector) {
            var parentCandidate = $$(parentNodeSelector).getElemList();
            var elem = this.getElemList(0).parentNode;
            var parentNodeFind = false;
            while (elem.tagName !== 'BODY' && parentNodeFind === false) {
                each(parentCandidate, function (elemCandidate) {
                    if (elem == elemCandidate) {
                        elemList.push(elemCandidate);
                        parentNodeFind = true;
                    }
                });
                elem = elem.parentNode;
            }
        } else {
            each(this.getElemList(), function (elem) {
                elemList.push(elem.parentNode);
            });
        }
        return $$.render(elemList);
    };
}

//########################################################
// event preventDefault and stopPropagation  ctrl
//########################################################
$$.pdsp = function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
};
//########################################################


//########################################################
// Class mark
//########################################################
$$.Class = DomAPI;
module.exports = $$;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = "<canvas id=\"webgl\" height=\"300\" width=\"300\"></canvas>";

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(3);module.exports = path.resolve("img_2.26e4f3b95b4fc7050f81cb6505bc7780.png");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var a = document.createElement('a');
var a_pathname = document.createElement('a');
var __dirname__list = null;
var __dirname = null;

var __protocol = location.protocol;
var __host = location.host;
var __origin = __protocol + '//' + __host;

setDirName(location.pathname);

function dir2List(path) {
    var pathListNew = [],
        pathList = path.split('/');

    for (var i = 0, len = pathList.length - 1; i < len; i++) {
        if (pathList[i] != '') {
            pathListNew.push(pathList[i]);
        }
    }

    return pathListNew;
}
function dirList2String(pathList) {
    return '/' + pathList.join('/') + '/';
}
function setDirName(path) {
    a.href = path;
    path = a.pathname;
    __protocol = a.protocol;
    __host = a.host;
    __origin = __protocol + '//' + __host;
    __dirname__list = dir2List(path);
    __dirname = dirList2String(__dirname__list);
}

var Cache = {
    update: setDirName,
    getPath: function getPath() {
        return __dirname;
    },
    resolve: function resolve(url) {
        a_pathname.href = __origin + __dirname + url;

        var search = a_pathname.search;
        var hash = a_pathname.hash;

        return a_pathname.href;
    }
};

try {
    Cache.update(document.querySelector('[main-js]').src);
} catch (e) {
    console.error('script 缺少 main-js 属性');
}

module.exports = Cache;

/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m4_ts_1 = __webpack_require__(8);
var vertex_shader = "\n  attribute vec4 a_position;\n  \n  attribute vec4 a_color;\n  varying vec4 v_color;\n\n  uniform mat4 u_matrix;\n   \n  void main() {\n    // \u5C06\u4F4D\u7F6E\u548C\u77E9\u9635\u76F8\u4E58\n    gl_Position = u_matrix * a_position;\n\n    // \u5C06\u989C\u8272\u4F20\u9012\u7ED9\u7247\u6BB5\u7740\u8272\u5668\n    v_color = a_color;\n  }\n";
var fragment_shader = "\n  precision mediump float;\n\n\t// \u4ECE\u9876\u70B9\u7740\u8272\u5668\u4E2D\u4F20\u5165\n  varying vec4 v_color;\n   \n  void main() {\n     gl_FragColor = v_color;\n  }\n";
var _window = window;
var _webglUtils = _window.webglUtils;
var Webgl = (function () {
    function Webgl(elem) {
        this.canvas = elem;
    }
    Webgl.prototype.draw = function (image) {
        var gl = this.gl;
        var program = this.program;
        var positionLocation = gl.getAttribLocation(program, "a_position");
        // lookup uniforms
        var colorLocation = gl.getAttribLocation(program, "a_color");
        var matrixLocation = gl.getUniformLocation(program, "u_matrix");
        // Create a buffer to put positions in
        var positionBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        setGeometry_1(gl);
        var translation = [50, 50, 0];
        var rotation = [degToRad(10), degToRad(0), degToRad(0)];
        var scale = [1, 1, 1];
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        // 将颜色值传入缓冲
        setColors_1(gl);
        drawScene(gl, program, positionLocation);
        // Draw the scene.
        function drawScene(gl, program, positionLocation) {
            _webglUtils.resizeCanvasToDisplaySize(gl.canvas);
            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            // Clear the canvas.
            gl.clear(gl.COLOR_BUFFER_BIT);
            // Tell it to use our program (pair of shaders)
            gl.useProgram(program);
            // Turn on the attribute
            gl.enableVertexAttribArray(positionLocation);
            // Bind the position buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
            // set the color
            // gl.uniform4fv(colorLocation, color);
            // 启用颜色属性
            gl.enableVertexAttribArray(colorLocation);
            // 绑定颜色缓冲
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.vertexAttribPointer(colorLocation, 4, gl.UNSIGNED_BYTE, false, 0, 0);
            // var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
            // matrix = m3.translate(matrix, translation[0], translation[1]);
            // matrix = m3.translate(matrix, 50, 75);
            // matrix = m3.rotate(matrix, angleInRadians);
            // matrix = m3.translate(matrix, -50, -75);
            // matrix = m3.scale(matrix, scale[0], scale[1]);
            var matrix = m4_ts_1.default.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
            matrix = m4_ts_1.default.translate(matrix, translation[0], translation[1], translation[2]);
            matrix = m4_ts_1.default.translate(matrix, 50, 50, 50);
            matrix = m4_ts_1.default.xRotate(matrix, rotation[0]);
            matrix = m4_ts_1.default.yRotate(matrix, rotation[1]);
            matrix = m4_ts_1.default.zRotate(matrix, rotation[2]);
            matrix = m4_ts_1.default.translate(matrix, -50, -50, -50);
            matrix = m4_ts_1.default.scale(matrix, scale[0], scale[1], scale[2]);
            // Set the matrix.
            gl.uniformMatrix4fv(matrixLocation, false, matrix);
            // Draw the geometry.
            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = 6 * 6; // 6 triangles in the 'F', 3 points per triangle
            gl.drawArrays(primitiveType, offset, count);
        }
    };
    Webgl.prototype.init = function () {
        var canvas = this.canvas;
        this.gl = canvas.getContext('webgl');
        if (!this.gl) {
            alert('不支持webgl');
            throw '不支持webgl';
        }
        this.clear();
        this.initShader();
    };
    Webgl.prototype.clear = function () {
        var gl = this.gl;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        // 清空画布
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    };
    Webgl.prototype.initShader = function () {
        var gl = this.gl;
        // 获取着色器的代码
        var vertexShaderSource = vertex_shader;
        var fragmentShaderSource = fragment_shader;
        // 创建着色器 
        var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        // 将两个着色器组装成一个着色器程序
        this.program = createProgram(gl, vertexShader, fragmentShader);
        this.gl.useProgram(this.program);
    };
    return Webgl;
}());
exports.default = Webgl;
// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
function createShader(gl, type, source) {
    var shader = gl.createShader(type); // 创建着色器对象
    gl.shaderSource(shader, source); // 提供数据源
    gl.compileShader(shader); // 编译 -> 生成着色器
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    gl.deleteShader(shader);
}
// 创建着色器程序
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    gl.deleteProgram(program);
}
function degToRad(d) {
    return d * Math.PI / 180;
}
function createCube(W, H, D, x, y, z) {
    var Cube = [
        // front
        x, y, z,
        W + x, y, z,
        x, H + y, z,
        x, H + y, z,
        W + x, y, z,
        W + x, H + y, z,
        // end
        x, y, D + z,
        W + x, y, D + z,
        x, H + y, D + z,
        x, H + y, D + z,
        W + x, y, D + z,
        W + x, H + y, D + z,
        // left
        x, y, z,
        x, y, D + z,
        x, H + y, z,
        x, H + y, z,
        x, y, D + z,
        x, H + y, D + z,
        // top
        x, y, z,
        x, y, D + z,
        W + x, y, z,
        W + x, y, z,
        x, y, D + z,
        W + x, y, D + z,
        // right
        W + x, y, z,
        W + x, H + y, z,
        W + x, y, D + z,
        W + x, y, D + z,
        W + x, H + y, z,
        W + x, H + y, D + z,
        // bottom
        x, H + y, z,
        W + x, H + y, z,
        x, H + y, D + z,
        x, H + y, D + z,
        W + x, H + y, z,
        W + x, H + y, D + z,
    ];
    return Cube;
}
function createCubeColor() {
    var color = [];
    return color
        .concat(createRectColor(1, 0, 0)) // front
        .concat(createRectColor(0, 1, 0)) // end
        .concat(createRectColor(0, 0, 1)) // left
        .concat(createRectColor(0, 1, 1)) // top
        .concat(createRectColor(1, 0, 1)) // right
        .concat(createRectColor(1, 1, 0)); // bottom
}
function createRectColor(r, g, b, a) {
    if (a === void 0) { a = 1; }
    return [
        r, g, b, a,
        r, g, b, a,
        r, g, b, a,
        r, g, b, a,
        r, g, b, a,
        r, g, b, a,
    ];
}
function setGeometry_1(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(createCube(100, 100, 100, 0, 0, 0)), gl.STATIC_DRAW);
}
function setColors_1(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(createCubeColor()), gl.STATIC_DRAW);
}


/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _$ = __webpack_require__(0);
var html = __webpack_require__(1);
_$('#app').html(html);
var Webgl_3_ts_1 = __webpack_require__(5);
var webgl = new Webgl_3_ts_1.default(_$('#webgl').getElemList(0));
webgl.init();
var image = document.createElement('img');
image.src = __webpack_require__(2); // 必须在同一域名下
image.onload = function () { webgl.draw(image); };
image.onerror = function () { webgl.draw(image); };


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m4 = {
    projection: function (width, height, depth) {
        // Note: This matrix flips the Y axis so 0 is at the top.
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ];
    },
    multiply: function (a, b) {
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    },
    translation: function (tx, ty, tz) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1,
        ];
    },
    xRotation: function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    },
    yRotation: function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ];
    },
    zRotation: function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    },
    scaling: function (sx, sy, sz) {
        return [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1,
        ];
    },
    translate: function (m, tx, ty, tz) {
        return m4.multiply(m, m4.translation(tx, ty, tz));
    },
    xRotate: function (m, angleInRadians) {
        return m4.multiply(m, m4.xRotation(angleInRadians));
    },
    yRotate: function (m, angleInRadians) {
        return m4.multiply(m, m4.yRotation(angleInRadians));
    },
    zRotate: function (m, angleInRadians) {
        return m4.multiply(m, m4.zRotation(angleInRadians));
    },
    scale: function (m, sx, sy, sz) {
        return m4.multiply(m, m4.scaling(sx, sy, sz));
    },
};
exports.default = m4;


/***/ })
/******/ ]);