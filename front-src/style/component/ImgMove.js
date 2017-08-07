import _$$ from './DomAPI-0.0.2.js';
import AutoprefixerCssStyle from './AutoprefixerCssStyle-0.0.1.js';
import Hammer from './hammer-2.0.8.min.js';

export default function ImgMove(img, model, eventElem) {
    	this.type = 'move';
        this.img = img;
        
        var finger_one = '一阳指';
        var finger_two = '六脉神剑';
        var finger_no  = '垃圾，快去跟武林高手学习武林绝学吧';
    	var self = this;
        var lastTouch = null;
        var lastScaleTouch = null;
        
        this.setConatinerClip = function(clip){
            this.conatinerClip = clip;
        }
        this.getConatinerClip = function(){
            return this.conatinerClip;
        }
        this.setImgNatural = function() {
            this.natural = {
                height: this.img.naturalHeight,
                width: this.img.naturalWidth
            }
        }
        this.setClip = function(clip){
            clip = clip || {
                width: this.img.clientWidth,
                height: this.img.clientHeight,
                clientX: 0,
                clientY: 0
            };

            clip.width = clip.width != undefined ? clip.width : this.clip.width;
            clip.height = clip.height != undefined ? clip.height : this.clip.height;

            clip.clientX = clip.clientX != undefined ? clip.clientX : this.clip.clientX;
            clip.clientY = clip.clientY != undefined ? clip.clientY : this.clip.clientY;
            
            if (model == 'model-icon') {
                this.limit = {
                    widthMin: -Infinity,
                    widthMax: this.conatinerClip.width,
                    heightMin: -Infinity,
                    heightMax: this.conatinerClip.height,

                    clientYMin: -clip.height - this.conatinerClip.height,
                    clientYMax: clip.height,
                    clientXMin: -clip.width,
                    clientXMax: clip.width + this.conatinerClip.width
                }
            }else{
                this.limit = {
                    widthMin: this.conatinerClip.width,
                    widthMax: Infinity,
                    heightMin: this.conatinerClip.height,
                    heightMax: Infinity,

                    clientYMin: 0,
                    clientYMax: clip.height - this.conatinerClip.height,
                    clientXMin: this.conatinerClip.width - clip.width,
                    clientXMax: 0 // lastClip.width - this.conatinerClip.width
                }
            }
            
            // clientX
            if (clip.clientX < this.limit.clientXMin) {
                clip.clientX = this.limit.clientXMin
            }
            if (clip.clientX > this.limit.clientXMax) {
                clip.clientX = this.limit.clientXMax
            }
            // clientY
            if (clip.clientY < this.limit.clientYMin) {
                clip.clientY = this.limit.clientYMin
            }
            if (clip.clientY > this.limit.clientYMax) {
                clip.clientY = this.limit.clientYMax
            }
            if (clip.width >= this.limit.widthMin && clip.width <= this.limit.widthMax && clip.height >= this.limit.heightMin && clip.height <= this.limit.heightMax) {
                this.clip = clip;
                this.img.style.cssText = 'top: 0; left: 0; height: '+clip.height+'px; width: '+clip.width+'px;margin-top: '+(-clip.clientY)+'px; margin-left: '+(clip.clientX)+'px';
            }
            
        };
        eventElem = eventElem || img;
        _$$.render([eventElem]).on('touchstart', function(e){
            self.setType(e);
			self.operate(e);
            return _$$.pdsp(e);
        });
        _$$.render([eventElem]).on('touchmove', function(e){
            self.setType(e);
			self.operate(e);
            return _$$.pdsp(e); 
        })
        _$$.render([eventElem]).on('touchend', function(e){
            lastTouch = null;
            lastScaleTouch = null;
            return _$$.pdsp(e); 
        })
        var ham = new Hammer( eventElem, {
          domEvents: true
        } );
        ham.get('pinch').set({ enable: true });
        
        var pinchThis = this;
        var pinchClip = {};
        _$$.render([eventElem]).on('pinchstart', function(e){
            pinchClip.width = pinchThis.clip.width
            pinchClip.height = pinchThis.clip.height
            pinchClip.clientX = pinchThis.clip.clientX
            pinchClip.clientY = pinchThis.clip.clientY
            return _$$.pdsp(e); 
        })
        _$$.render([eventElem]).on('pinch', function(e){
            pinchThis.typeScale(e);
            return _$$.pdsp(e); 
        })
        _$$.render([eventElem]).on('pinchend', function(e){
            return _$$.pdsp(e); 
        })
        

        this.setType = function(event){
			if (event.targetTouches.length == 1) {
                this.type = finger_one;
            }else if (event.targetTouches.length >= 2) {
                this.type = finger_two;
            }else{
                this.type = finger_no;
            }
        }
        this.operate = function(event){
			if (this.type == finger_one) {
				this.typeMove(event);
			}else if (this.type == finger_two) {
				// this.typeScale(event);
			}
        }
        this.typeMove = function(event){
            var touch = this.TouchObj(event.targetTouches[0]);
            if (lastTouch) {
                // ################################################
                this.setClip({
                    clientX: this.clip.clientX - (lastTouch.clientX - touch.clientX),
                    clientY: this.clip.clientY + (lastTouch.clientY - touch.clientY)
                })
                // ################################################
            }

            lastTouch = touch;
            lastScaleTouch = null;
        }
        this.typeScale = function(event){
            this.setClip({
                width: pinchClip.width * event.gesture.scale,
                height: pinchClip.height * event.gesture.scale
            })
        }

        this.TouchObj = function(Touch){
            return {
                clientX: Touch.clientX,
                clientY: Touch.clientY
            }
        }
        this.clear = function(){
            this.img.style.cssText = '';
        }
    }
