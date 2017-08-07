import './Page.scss';
import _$$ from './DomAPI-0.0.2.js';
import ViewTransition from './ViewTransition-0.0.1.js';

export default class {
	constructor(option){

        if (this.domElem) {

        }else if (option.el instanceof _$$.Class) {
        	this.domElem = opt.el;
        }else if (typeof option.el == 'string') {
        	// 字符串
        	this.domElem = _$$(option.el);
        }else if (option.el.nodeType && (option.el.nodeType == 1 || option.el.nodeType == 9) ) {
        	// 元素对象
        	this.domElem = _$$.render([option.el]);
        }
        this.domElem.addClass('view').addClass('hide');
        this.showMark = false;
        
        option.init && option.init.call(this, this.getElem());
        option.Event && option.Event.call(this, this.getElem());

        this.__event = {};
        this.__event.beforeshow = option.beforeshow;
        this.__event.aftershow = option.aftershow;
        this.__event.beforehide = option.beforehide;
        this.__event.afterhide = option.afterhide;

        this.__disposableEvent = {};
        this.__disposableEvent.beforeshow = () => { this.__disposableEvent.beforeshow = () => {}; option.beforeshowInit && option.beforeshowInit.call(this, this.getElem()) };
        this.__disposableEvent.aftershow = () => { this.__disposableEvent.aftershow = () => {}; option.aftershowInit && option.aftershowInit.call(this, this.getElem()) };
        this.__disposableEvent.beforehide = () => { this.__disposableEvent.beforeshow = () => {}; option.beforehideInit && option.beforehideInit.call(this, this.getElem()) };
        this.__disposableEvent.afterhide = () => { this.__disposableEvent.beforeshow = () => {}; option.afterhideInit && option.afterhideInit.call(this, this.getElem()) };
        this.hide();
    }
    distory(){
        this.domElem && this.domElem.remove();
    }
	getElem(){
        return this.domElem;
    }
    getOriginalElem(){
    	return this.domElem.getElemList(0);
    }
    showWithAnimate(animateHandle){
        if (this.isShow() === true) {
            return 'page is showing'
        }
        this.showMark = true;
        ViewTransition({
            elem: this.getOriginalElem(),
            start: 'hide',
            end: 'show',
            complete: () =>{
            	this.__event.aftershow && this.__event.aftershow.call(this, this.getElem());
                this.__disposableEvent.aftershow()
                typeof animateHandle == 'function' && animateHandle.call(this);
            }
        })
        this.__event.beforeshow && this.__event.beforeshow.call(this, this.getElem());
        this.__disposableEvent.beforeshow()
    }
	hideWithAnimate(animateHandle){
        if (this.isShow() === false) {
            return 'page is hidding'
        }
        this.showMark = false;
        this.__disposableEvent.beforehide()
        ViewTransition({
            elem: this.getOriginalElem(),
            start: 'show',
            end: 'hide',
            complete: () => {
                this.__event.afterhide && this.__event.afterhide.call(this, this.getElem());
                this.__disposableEvent.afterhide();
                typeof animateHandle == 'function' && animateHandle.call(this);
            }
        })
        this.__event.beforehide && this.__event.beforehide.call(this, this.getElem());
        this.__disposableEvent.beforehide()
    }
	show(){
        if (this.isShow() === true) {
            return 'page is showing'
        }
        this.showMark = true;
        this.__event.beforeshow && this.__event.beforeshow.call(this, this.getElem());
        this.__disposableEvent.beforeshow()
        this.getElem().removeClass('hide')
        this.getElem().addClass('show')

        this.__event.aftershow && this.__event.aftershow.call(this, this.getElem());
        this.__disposableEvent.aftershow()
    }
	hide(){
        if (this.isShow() === false) {
            return 'page is hidding'
        }
        this.showMark = false;
        this.__event.beforehide && this.__event.beforehide.call(this, this.getElem());
        this.__disposableEvent.beforehide()
        this.getElem().removeClass('show')
        this.getElem().addClass('hide')

        this.__event.afterhide && this.__event.afterhide.call(this, this.getElem());
        this.__disposableEvent.afterhide()
    }
	isShow(){
        return this.showMark
    }
}
