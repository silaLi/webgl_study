// import EXIF from './exif.min.js';
// import EXIF from './exif.min.js';

export default class{
    constructor(){
    	this.cvs1 = document.createElement('canvas');
		this.ctx1 = this.cvs1.getContext('2d');
		this.cvs2 = document.createElement('canvas');
		this.ctx2 = this.cvs2.getContext('2d');
		
    }
    setCilp(width, height){
    	this.width = width;
    	this.height = height;

    	this.cvs1.width = this.width;
    	this.cvs1.height = this.height;
    	this.cvs2.width = this.width;
    	this.cvs2.height = this.height;
    }

    render(image1src, image2src, handle, customizeColorCalculation){
    	this.customizeColorCalculation = customizeColorCalculation;
    	this.renderHandle = handle;
    	var img1 = document.createElement('img');
    	img1.src = image1src;
    	img1.onload = (e) => {
    		var this_img = e.currentTarget;
    		this.setRenderData(null, null, this_img.naturalWidth, this_img.naturalHeight);
    	}
    	ImgLoaded(image1src, (img) => {
    		this.setRenderData(img)
    	});
    	
    	ImgLoaded(image2src, (img) => {
    		this.setRenderData(null, img)
    	});
    }
    renderMultiply(image1src, image2src, handle){
    	this.render(image1src, image2src, handle, function(colorVal1, colorVal2, index){
    		let colorArr = [];
    		for (let i = 0; i < colorVal1.length; i++) {
    			colorArr[i] = colorVal1[i] * colorVal2[i] / 255
    		}
    		return colorArr;
    	});
    }
    setRenderData(img1, img2, width, height){
    	this.img1 = img1 || this.img1;
    	this.img2 = img2 || this.img2;

    	this.width = width || this.width;
    	this.height = height || this.height;
    	if (
    		this.img1 !== undefined && 
    		this.img2 !== undefined && 
    		this.width !== undefined && 
    		this.height !== undefined 
    	) {
    		this.startRender();
    	}
    }
    startRender(){
    	this.setCilp(this.width, this.height);

    	this.ctx1.drawImage(this.img1, 0, 0, this.width, this.height);
    	this.ctx2.drawImage(this.img2, 0, 0, this.width, this.height);

    	this.cvsr = document.createElement('canvas');
    	this.ctxr = this.cvsr.getContext('2d');
    	this.cvsr.width = this.width;
    	this.cvsr.height = this.height;

    	var ImagesData1 = this.ctx1.getImageData(0, 0, this.width, this.height);
    	var ImagesData2 = this.ctx2.getImageData(0, 0, this.width, this.height);

		for (let i = 0, len = ImagesData1.data.length; i < len; i+=4) {

			let colorData = this.customizeColorCalculation(
			[
				ImagesData1.data[i+0], ImagesData1.data[i+1], ImagesData1.data[i+2], ImagesData1.data[i+3] 
			], 
			[
				ImagesData2.data[i+0], ImagesData2.data[i+1], ImagesData2.data[i+2], ImagesData2.data[i+3]
			],
			i
			);
			
			ImagesData1.data[i+0] = colorData[0];
			ImagesData1.data[i+1] = colorData[1];
			ImagesData1.data[i+2] = colorData[2];
			ImagesData1.data[i+3] = colorData[3];
		}
		this.ctxr.putImageData(ImagesData1, 0, 0);

		this.renderHandle( this.cvsr.toDataURL('image/jpeg', 1.0) );
    }
}
export function ImgLoaded(url, handle){
    var img = document.createElement('img');
    img.src = url;
    img.onload = function(){ handle(img) }
}
// #
// arguments
// img: Element
// hanlde: function, such function(imgElem){console.log(imgElem)}
// #
// return
// imgElem: Elemnet
// 
export function ImageRotateFilterForUrl(url, handle){
	var img = document.createElement('img');
	img.src = url;
	img.onload = function(){ ImageRotateFilter(img, handle) }
}
export function ImageRotateFilter(img1, handle){
	let url;
	if ((img1.nodeType == 1 || img1.nodeType == 9) && img1.tagName == 'IMG') {
		url = img1.src;
	}else if (img1 instanceof File) {
		url = getObjectURL(img1);
	}
	window.EXIF.getData(img1, function() {
        var orientation = EXIF.getTag(this, "Orientation");
        var height = EXIF.getTag(this, "PixelXDimension");
    	var width = EXIF.getTag(this, "PixelYDimension");
    	
        
        var img = document.createElement('img');
        var canvas = document.createElement('canvas');

        if (orientation == 6 ) {
        	var height = EXIF.getTag(this, "PixelXDimension");
        	var width = EXIF.getTag(this, "PixelYDimension");

        	img.onload = function(){
        		height = height || img.width;
        		width = width || img.height;
	            canvas.width = width;
	            canvas.height = height;

	            var c1 = canvas.getContext("2d");
	            c1.translate(canvas.height / 2, canvas.width / 2);
	            c1.rotate(90 * Math.PI / 180);
    			c1.drawImage(img, -canvas.width / 2, -canvas.height / 4, canvas.height, canvas.width);
    			var n_img = document.createElement('img');
    			n_img.onload = function(){
    				handle(n_img)
    			}
    			n_img.src = canvas.toDataURL("image/jpeg");
	    	}
        	img.src = url;

        }else{
        	var height = EXIF.getTag(this, "PixelYDimension");
        	var width = EXIF.getTag(this, "PixelXDimension");

        	img.onload = function(){
        		height = height || img.height;
        		width = width || img.width;
        		canvas.width = width;
	            canvas.height = height;

	            var c1 = canvas.getContext("2d");
	            c1.drawImage(img, 0, 0, width, height);
	            handle(img)
	    	}
	    	img.src = url;
        }
    });
}
export function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
export function Base64toURL(baseData){
    return getObjectURL(dataURLtoBlob(baseData));
}
export function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}