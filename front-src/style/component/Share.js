var defaults = {
	social: ['weibo', 'tqq', 'qzone', 'renren'],
	theme: 'icon',
	shareConfig: {
		// 标题
    	title: document.title,
    	// 链接
    	url: window.location.href,
    	// 图片路径，使用多张图片以||隔开[a.jpg||b.jpg] bug 多张不一样
    	pic: '',
    	// 分享摘要
    	summary: '',
    	// 分享理由 (QQ)
    	desc: '',
    	// 自动抓取页面上的图片 (新浪微博)
    	searchPic: true,
    	// 分享来源
    	source: {
    		appkey: {
	    		weibo: '',
	    		tqq: ''
	    	},
	    	ralateUid: {
	    		weibo: '',
	    		tqq: ''
	    	},
	    	// 分享来源 (QQ空间、QQ)
	    	siteName: ''
    	}
	},
	// 设置按扭
	buttons: {
		'weibo': {
			text: '新浪微博', 
			className: 'weibo', 
			url: 'http://service.weibo.com/share/share.php?url={url}&title={title}&pic={pic}&appkey={appkey}&ralateUid={ralateUid}&searchPic={searchPic}'
		},
    	'tqq': {
    		text: '腾讯微博', 
    		className: 'tqq', 
    		url: 'http://share.v.t.qq.com/index.php?url={url}&title={title}&pic={pic}&appkey={appkey}'
    	},
    	'qzone': {
    		text: 'QQ空间', 
    		className: 'qzone',
    		url: 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&pics={pic}&summary={summary}&site={site}'
    	},
    	'renren': {
    		text: '人人网', 
    		className: 'renren', 
    		url: 'http://widget.renren.com/dialog/share?link={url}&title={title}&pic={pic}'
    	},
    	'qq': {
    		text: 'QQ', 
    		className: 'qq', 
    		url: 'http://connect.qq.com/widget/shareqq/index.html?url={url}&title={title}&pics={pic}&summary={summary}&desc={desc}&site={site}'
    	},
    	'weixin': {
    		text: '微信', 
    		className: 'weixin', 
    		url: 'http://mns.hupu.com/michelin-pilot-sport/qr_share?url={url}'
    	},
    	'douban': {
    		text: '豆瓣', 
    		className: 'douban', 
    		url: 'http://www.douban.com/share/service?href={url}&name={title}&text={summary}'
    	},
    	'twitter': {
    		text: 'twitter', 
    		className: 'twitter', 
    		url: 'https://twitter.com/share?url={url}&text={title}'
    	},
    	'facebook': {
    		text: 'facebook', 
    		className: 'facebook', 
    		url: 'http://www.facebook.com/sharer.php?u={url}&t={title}'
    	}
	}
}

/**
 * 分享API
 * @param  {string}  site        类型(*必写)
 * @param  {object}  options     分享配置
 * @config {string}  [title]     可选，分享标题
 * @config {string}  [url]       可选，分享链接
 * @config {string}  [pic]       可选，分享图片的路径。使用多张图片以||隔开[a.jpg||b.jpg] bug 多张不一样
 * @config {string}  [summary]   可选，分享摘要
 */
var ShareAPI = function( site, options ) {

	// 分享配置
	var config = defaults.shareConfig;
		config.buttons = defaults.buttons;
console.log(site, options)
	var opts = Object.assign({}, defaults, config, options || {}); //$.extend(true,{}, config, options || {}),
	var title = encodeURIComponent( opts.title ),
		url = encodeURIComponent( opts.url ),
		pic = opts.pic,
		summary = encodeURIComponent( opts.summary ),
		desc = encodeURIComponent( opts.desc ),
		sites = encodeURIComponent( opts.source.site ),
		appkey = Converted( opts.source.appkey.weibo, opts.source.appkey.tqq ),
		ralateUid = Converted( opts.source.ralateUid.weibo, opts.source.ralateUid.tqq );


	// 无分享类型
	if ( typeof opts.buttons[ site ] === "undefined" ) {
		return;
	};

	// 新浪微博分享使用多张图片路径
	var piaArray = pic.split('||');

	if ( piaArray.length > 1 && site !== 'weibo' ) {
		pic = piaArray[0];
	};

	pic = encodeURIComponent( pic );


	// 类型appkey
	function Converted( weibo, tqq ) {
		var newAppkey = '';

		if ( site === 'tqq' ) {
			newAppkey = tqq;
		} else {
			newAppkey = weibo;
		}

		return newAppkey;
	}

	var width = 600,
		height = 500,
		screenTop = ( window.screen.availHeight - 30 - height ) / 2,
		screenLeft = ( window.screen.availWidth - 10 - width ) / 2,
		features = '';

	// QQ分享全屏
	if ( site !== 'qq' ) {
		features = 'scrollbars=no,width=' + width + ',height=' + height + ',left=' + screenLeft + ',top=' + screenTop + ',status=no,resizable=yes';  
	}

	var sitesURL = opts.buttons[ site ]['url'].replace('{url}', url).replace('{title}', title)
											  .replace('{pic}', pic).replace('{appkey}', appkey)
											  .replace('{ralateUid}', opts.ralateUid).replace('{summary}', summary)
											  .replace('{site}', sites).replace('{desc}', desc)
											  .replace('{searchPic}', opts.searchPic);
	window.open(sitesURL, site, features);
};

module.exports = ShareAPI;