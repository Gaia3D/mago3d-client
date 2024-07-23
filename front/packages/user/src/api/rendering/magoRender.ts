let gl: WebGLRenderingContext | null = null;
let program: WebGLProgram | null = null;

export class MagoRender {
init(webgl: WebGL2RenderingContext): void {
  if (gl) {
    return;
  }

  gl = webgl;
  program = gl.createProgram();

  if (!program) {
    console.error('WebGL 프로그램 생성 실패');
    return;
  }

  const vertexShader = this.createShader(gl.VERTEX_SHADER, `
      attribute vec2 a_texcoord;
      attribute vec2 a_position;
      varying vec2 v_texcoord;
      void main() {
        v_texcoord = a_texcoord;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `);

  const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    uniform sampler2D u_texture;
    varying vec2 v_texcoord;
    void main() {
      vec4 textureData = texture2D(u_texture, v_texcoord);
      gl_FragColor = textureData;
    }
  `);

  if (!vertexShader || !fragmentShader) {
    return;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('프로그램 링크 실패:', gl.getProgramInfoLog(program));
    return;
  }

  console.log(gl.getShaderInfoLog(vertexShader));
  console.log(gl.getShaderInfoLog(fragmentShader));
  console.log(gl.getProgramInfoLog(program));
}

  private createShader(type: number, source: string): WebGLShader | null {
    if (!gl) {return null;}
    const shader = gl.createShader(type);
    if (!shader) {
      console.error(`타입 ${type} 셰이더 생성 실패`);
      return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('셰이더 컴파일 실패:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  useProgram(): void {
    if (!gl) {return;}
    if (program) {
      gl.useProgram(program);
    }
  }

  draw(texture: WebGLTexture): void {
    if (!gl) {return;}
    if (!program) {
      console.error('WebGL 프로그램 생성 실패');
      return;
    }

  const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const textureLocation = gl.getUniformLocation(program, "uSampler");

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(textureLocation, 0);

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
}

  unuseProgram(): void {
    if (gl) {
      gl.useProgram(null);
    }
  }
}

export default new MagoRender();
