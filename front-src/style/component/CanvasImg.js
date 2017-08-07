export default function CanvasImg() {
        var canvas = document.createElement('canvas');
		this.ImgMoveList = [];
		this.devicePixelRatio = window.devicePixelRatio;

		this.setConatinerClip = function(conatinerClip){
			this.conatinerClip = conatinerClip;
		}
        this.pushImgMove = function(ImgMove){
			this.ImgMoveList = this.ImgMoveList.concat(ImgMove);
        }
        this.render = function(handler){
        	canvas.width = this.conatinerClip.width * this.devicePixelRatio;
			canvas.height = this.conatinerClip.height * this.devicePixelRatio;
			
        	var context = canvas.getContext('2d');

			for (var i = 0, len = this.ImgMoveList.length - 1; i <= len; i++) {
				var imgMove = this.ImgMoveList[i];
				imgMove.img.width = imgMove.clip.width * this.devicePixelRatio;
				imgMove.img.height = imgMove.clip.height * this.devicePixelRatio;
				context.drawImage(
					imgMove.img,
					imgMove.clip.clientX * this.devicePixelRatio,
					-imgMove.clip.clientY * this.devicePixelRatio,
					imgMove.clip.width * this.devicePixelRatio,
					imgMove.clip.height * this.devicePixelRatio
				);
			}
			
			var base64 = canvas.toDataURL('image/jpeg', 1.0);
			return base64
			// handler(base64);
			
			// context.drawImage(this.Bg.img, this.Bg.clientX, this.Bg.clientY, this.Bg.width * this.devicePixelRatio, this.Bg.height * this.devicePixelRatio);
        }
    }