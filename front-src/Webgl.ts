let vertex_shader = `
  attribute vec2 a_position;
 
	uniform mat3 u_matrix;
	 
	void main() {
	  // 使位置和矩阵相乘
	  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
	}
`;
let fragment_shader = `
  precision mediump float;

	uniform vec4 u_color;

	void main() {
	   gl_FragColor = u_color;
	}
`;
let _window: any = window;
let _webglUtils: any = _window.webglUtils;
export default class Webgl {
	canvas: any;
	gl: any;
	program: any;
	constructor(elem: any) {
		this.canvas = elem;
	}
	draw(image) {

    var gl = this.gl;
    var program = this.program;

    var positionLocation = gl.getAttribLocation(program, "a_position");

	  // lookup uniforms
	  var colorLocation = gl.getUniformLocation(program, "u_color");
	  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

	  // Create a buffer to put positions in
	  var positionBuffer = gl.createBuffer();
	  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
	  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	  setGeometry(gl);
	  var translation = [100, 150];
	  var angleInRadians = 100;
	  	  angleInRadians = (360 - angleInRadians) * Math.PI / 180 ;
	  var scale = [1, 1];
	  var color = [Math.random(), Math.random(), Math.random(), 1];

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

		  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		  var size = 2;          // 2 components per iteration
		  var type = gl.FLOAT;   // the data is 32bit floats
		  var normalize = false; // don't normalize the data
		  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
		  var offset = 0;        // start at the beginning of the buffer
		  gl.vertexAttribPointer(
		      positionLocation, size, type, normalize, stride, offset)

		  // set the color
		  gl.uniform4fv(colorLocation, color);

	    var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
			matrix = m3.translate(matrix, translation[0], translation[1]);
			matrix = m3.translate(matrix, 50, 75);
			matrix = m3.rotate(matrix, angleInRadians);
			matrix = m3.translate(matrix, -50, -75);
			matrix = m3.scale(matrix, scale[0], scale[1]);

		  // Set the matrix.
		  gl.uniformMatrix3fv(matrixLocation, false, matrix);

		  // Draw the geometry.
		  var primitiveType = gl.TRIANGLES;
		  var offset = 0;
		  var count = 18;  // 6 triangles in the 'F', 3 points per triangle
		  gl.drawArrays(primitiveType, offset, count);
		}

  }
	init(){
		let canvas = this.canvas;

	    this.gl = canvas.getContext('webgl')
	    if (!this.gl) {
	      alert('不支持webgl')
	      throw '不支持webgl';
	    }
	    this.clear();
	    this.initShader();
	}
	clear(){
		let gl = this.gl;
		gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    // 清空画布
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
	}
	initShader() {
		let gl = this.gl;
    // 获取着色器的代码
    let vertexShaderSource = vertex_shader;
    let fragmentShaderSource = fragment_shader;
    // 创建着色器 
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // 将两个着色器组装成一个着色器程序
    this.program = createProgram(gl, vertexShader, fragmentShader);
    this.gl.useProgram(this.program);
  }
}
function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          // left column
          0, 0,
          30, 0,
          0, 150,
          0, 150,
          30, 0,
          30, 150,

          // top rung
          30, 0,
          100, 0,
          30, 30,
          30, 30,
          100, 0,
          100, 30,

          // middle rung
          30, 60,
          67, 60,
          30, 90,
          30, 90,
          67, 60,
          67, 90,
      ]),
      gl.STATIC_DRAW);
}


let m3 = {
  translate: function(m, tx, ty) {
    return m3.multiply(m, m3.translation(tx, ty));
  },
 
  rotate: function(m, angleInRadians) {
    return m3.multiply(m, m3.rotation(angleInRadians));
  },
 
  scale: function(m, sx, sy) {
    return m3.multiply(m, m3.scaling(sx, sy));
  },
  projection: function(width, height) {
    // 注意：这个矩阵翻转了 Y 轴，所以 0 在上方
    return [
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    ];
  },
  translation: function(tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ];
  },

  rotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c,-s, 0,
      s, c, 0,
      0, 0, 1,
    ];
  },

  scaling: function(sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },
};
// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
function createShader(gl, type, source) {
  let shader = gl.createShader(type); // 创建着色器对象
  gl.shaderSource(shader, source); // 提供数据源
  gl.compileShader(shader); // 编译 -> 生成着色器
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  gl.deleteShader(shader);
}
// 创建着色器程序
function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  gl.deleteProgram(program);
}