import _$$ from './DomAPI-0.0.2.js';

let htmlfontsize = _$$('html').getElemList(0).style.fontSize;
let htmlfontsizeNumber = parseFloat(htmlfontsize);
export default function CanvasImg(rem, designSize) {
   	return Math.ceil(rem / (designSize || 640) * 3.2 * htmlfontsizeNumber);
   	// $rem / 640 * 3.2 * 1rem;
}