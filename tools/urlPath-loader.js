/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var fs = require('fs');
var path = require("path");
var loaderUtils = require("loader-utils");
var ToolsContainer = require('../tools.config.js');

module.exports = function(content) {
	this.cacheable && this.cacheable();
	if(!this.emitFile) throw new Error("emitFile is required from module system");
	
	
	var query = loaderUtils.getOptions(this) || {};
	
	var configKey = query.config || "urlPathLoader";
	var options = this.options[configKey] || {};
	
	var state = fs.statSync(this.resourcePath);
	var config = {
		publicPath: undefined,
		useRelativePath: false,
		// name: "[name]."+FormatDate(state.ctime, 'yyyyMMddhhmmss')+".[ext]"
		// name: "[hash].[ext]"
		name: "[name].[hash].[ext]"
	};

	// options takes precedence over config
	Object.keys(options).forEach(function(attr) {
		config[attr] = options[attr];
	});

	// query takes precedence over config and options
	Object.keys(query).forEach(function(attr) {
		config[attr] = query[attr];
	});
	
	var context = config.context || this.options.context;

	var url = loaderUtils.interpolateName(this, config.name, {
		context: context,
		content: content,
		regExp: config.regExp
	});
	
	var outputPath = "";

	var filePath = this.resourcePath;
	
	if (config.useRelativePath) {
		var issuerContext = this._module && this._module.issuer && this._module.issuer.context || context;
		var relativeUrl = issuerContext && path.relative(issuerContext, filePath).split(path.sep).join("/");
		var relativePath = relativeUrl && path.dirname(relativeUrl) + "/";
		if (~relativePath.indexOf("../")) {
			outputPath = path.posix.join(outputPath, relativePath, url);
		} else {
			outputPath = relativePath + url;
		}
		url = relativePath + url;
	} else if (config.outputPath) {
		// support functions as outputPath to generate them dynamically
		outputPath = (
			typeof config.outputPath === "function"
			? config.outputPath(url)
			: config.outputPath + url
		);
		url = outputPath;
	} else {
		outputPath = url;
	}

	var publicPath = "__webpack_public_path__ + " + JSON.stringify(url);
	
	if (config.publicPath !== undefined) {
		// support functions as publicPath to generate them dynamically
		publicPath = JSON.stringify(
			typeof config.publicPath === "function"
			? config.publicPath(url)
			: config.publicPath + url
		);
	}

	if (query.emitFile === undefined || query.emitFile) {
		this.emitFile(outputPath, content);
	}

	return "var path = require('"+ToolsContainer.getDependencies('Path')+"');module.exports = path.resolve(" + JSON.stringify(url) + ");";
	return "var path = require('./tools/Path');module.exports = " + publicPath + ";";
};

module.exports.raw = true;

function FormatDate(date,fmt) { //author: meizz 
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
