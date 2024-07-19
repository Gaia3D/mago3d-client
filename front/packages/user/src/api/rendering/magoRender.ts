
let gl : WebGL2RenderingContext;
let program : WebGLProgram;

export const MagoRender = function MagoRender() : void {

}

MagoRender.prototype.init  = (webgl : WebGL2RenderingContext) => {
  if (gl) {
    return;
  }

  gl = webgl;
  program = gl.createProgram();
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, `
    attribute vec2 a_texcoord;
    attribute vec2 a_position;
    varying vec2 v_texcoord;
    void main() {
      v_texcoord = a_texcoord;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `);
  gl.shaderSource(fragmentShader, `
    precision mediump float;
    uniform sampler2D u_texture;
    varying vec2 v_texcoord;
    void main() {
      vec4 textureData = texture2D(u_texture, v_texcoord);
      gl_FragColor = textureData;
    }
  `);
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  console.log(gl.getShaderInfoLog(vertexShader));
  console.log(gl.getShaderInfoLog(fragmentShader));
  console.log(gl.getProgramInfoLog(program));
  gl.linkProgram(program);
}

MagoRender.prototype.useProgram = () => {
  gl.useProgram(program)
}

MagoRender.prototype.draw = (texture : WebGLTexture) => {
  const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const textureLocation = gl.getUniformLocation(program, "u_texture");

  //const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(gl.getUniformLocation(program, "uSampler"), 0);

  const texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  const texcoords = [
    0.0, 0.0,
    0.0, 1,
    1, 0.0,

    1, 0.0,
    0.0, 1,
    1, 1,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texcoordAttributeLocation);
  let size = 2;
  let type = gl.FLOAT;
  let normalize = true;
  let stride = 0;
  let offset = 0;
  gl.vertexAttribPointer(texcoordAttributeLocation, size, type, normalize, stride, offset);

  const positionsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
  const positions = [
    0.5, 0.5,
    0.5, 1,
    1, 0.5,

    1, 0.5,
    0.5, 1,
    1, 1,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  size = 2;
  type = gl.FLOAT;
  normalize = true;
  stride = 0;
  offset = 0;
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);


  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.disableVertexAttribArray(texcoordAttributeLocation);
  gl.disableVertexAttribArray(positionAttributeLocation);

  //gl.bindTexture(gl.TEXTURE_2D, null);
  //gl.bindBuffer(gl.ARRAY_BUFFER, null);
  //gl.useProgram(null);
}

MagoRender.prototype.unuseProgram = () => {
  gl.useProgram(null)
}

