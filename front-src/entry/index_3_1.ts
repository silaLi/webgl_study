let _$  = require('../style/component/DomAPI-0.0.2.js');
let html = require('../style/common.html');
_$('#app').html(html);

import Webgl from '../Webgl_3.ts';
let webgl = new Webgl( _$('#webgl').getElemList(0) );
webgl.init();

var image = document.createElement('img');
image.src = require("../style/img_2.png");  // 必须在同一域名下
image.onload = function(){webgl.draw(image)};
image.onerror = function(){webgl.draw(image)};