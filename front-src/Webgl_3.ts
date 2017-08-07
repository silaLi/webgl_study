import m4 from './m4.ts';

let vertex_shader = `
  attribute vec4 a_position;
  
  attribute vec4 a_color;
  varying vec4 v_color;

  uniform mat4 u_matrix;
   
  void main() {
    // 将位置和矩阵相乘
    gl_Position = u_matrix * a_position;

    // 将颜色传递给片段着色器
    v_color = a_color;
  }
`;
let fragment_shader = `
  precision mediump float;

	// 从顶点着色器中传入
  varying vec4 v_color;
   
  void main() {
     gl_FragColor = v_color;
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

      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)

		  // set the color
		  // gl.uniform4fv(colorLocation, color);

      // 启用颜色属性
      gl.enableVertexAttribArray(colorLocation);
       
      // 绑定颜色缓冲
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
       
     
      gl.vertexAttribPointer(colorLocation, 4, gl.UNSIGNED_BYTE, false, 0, 0)

	    // var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
			// matrix = m3.translate(matrix, translation[0], translation[1]);
			// matrix = m3.translate(matrix, 50, 75);
			// matrix = m3.rotate(matrix, angleInRadians);
			// matrix = m3.translate(matrix, -50, -75);
			// matrix = m3.scale(matrix, scale[0], scale[1]);

      var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
      matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
      matrix = m4.translate(matrix, 50, 50, 50);
      matrix = m4.xRotate(matrix, rotation[0]);
      matrix = m4.yRotate(matrix, rotation[1]);
      matrix = m4.zRotate(matrix, rotation[2]);
      matrix = m4.translate(matrix, -50, -50, -50);
      matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);


		  // Set the matrix.
		  gl.uniformMatrix4fv(matrixLocation, false, matrix);

		  // Draw the geometry.
		  var primitiveType = gl.TRIANGLES;
		  var offset = 0;
		  var count = 6 * 6;  // 6 triangles in the 'F', 3 points per triangle
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
function degToRad(d) {
  return d * Math.PI / 180;
}

function createCube(W, H, D, x, y, z){
  let Cube = [
    // front
      x,   y,   z,
    W+x,   y,   z,
      x, H+y,   z,
      x, H+y,   z,
    W+x,   y,   z,
    W+x, H+y,   z,

    // end
      x,   y, D+z,
    W+x,   y, D+z,
      x, H+y, D+z,
      x, H+y, D+z,
    W+x,   y, D+z,
    W+x, H+y, D+z,

    // left
      x,   y,   z,
      x,   y, D+z,
      x, H+y,   z,
      x, H+y,   z,
      x,   y, D+z,
      x, H+y, D+z,

    // top
      x,   y,   z,
      x,   y, D+z,
    W+x,   y,   z,
    W+x,   y,   z,
      x,   y, D+z,
    W+x,   y, D+z,

    // right
    W+x,   y,   z,
    W+x, H+y,   z,
    W+x,   y, D+z,
    W+x,   y, D+z,
    W+x, H+y,   z,
    W+x, H+y, D+z,

    // bottom
      x, H+y,   z,
    W+x, H+y,   z,
      x, H+y, D+z,
      x, H+y, D+z,
    W+x, H+y,   z,
    W+x, H+y, D+z,
  ]
  return Cube;
}
function createCubeColor(){
  let color = [];
  return color
  .concat(createRectColor(1, 0, 0)) // front
  .concat(createRectColor(0, 1, 0)) // end
  .concat(createRectColor(0, 0, 1)) // left
  .concat(createRectColor(0, 1, 1)) // top
  .concat(createRectColor(1, 0, 1)) // right
  .concat(createRectColor(1, 1, 0)) // bottom
}
function createRectColor(r: number, g: number, b: number, a = 1){
  return [
    r, g, b, a, // 1
    r, g, b, a, // 2
    r, g, b, a, // 3
    r, g, b, a, // 4
    r, g, b, a, // 5
    r, g, b, a, // 6
  ]
}
function setGeometry_1(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(
      createCube(100, 100, 100, 0, 0, 0)
    ),
    gl.STATIC_DRAW
  )
}
function setColors_1(gl){
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array(
      createCubeColor()
    ),
    gl.STATIC_DRAW
  )
}
