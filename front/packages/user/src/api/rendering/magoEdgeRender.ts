import * as Cesium from 'cesium';

let composite: Cesium.PostProcessStageComposite | null = null;

export const MagoEdgeRender = (viewer: Cesium.Viewer) => {
  if (composite) {
    viewer.scene.postProcessStages.remove(composite);
    composite = null;
  }
  init(viewer);
}


const init = (viewer: Cesium.Viewer) => {
  const createDepthProcessStage = new Cesium.PostProcessStage({
    fragmentShader: `
    in vec2 v_textureCoordinates; 
    uniform sampler2D depthTexture;
    void main(void) { 
      float unpackDepth = czm_unpackDepth(texture(depthTexture, v_textureCoordinates.xy));
      vec4 packDepth = czm_packDepth(unpackDepth);
      out_FragColor = packDepth;
    }`, /* @ts-expect-error : //*/
    inputPreviousStageTexture: true,
    name: 'magoDepthTextureForEdge'
  })

  const createNormalProcessStage = new Cesium.PostProcessStage({
    fragmentShader: `
    uniform sampler2D colorTexture;
    uniform sampler2D depthTexture; 
    in vec2 v_textureCoordinates; 
    
    vec3 getEyeCoordinate3FromWindowCoordinate(vec2 fragCoord, float logDepthOrDepth) {
      vec4 eyeCoordinate = czm_windowToEyeCoordinates(fragCoord, logDepthOrDepth);
      return eyeCoordinate.xyz / eyeCoordinate.w;
    }
    vec3 vectorFromOffset(vec4 eyeCoordinate, vec2 positiveOffset) {
      vec2 glFragCoordXY = gl_FragCoord.xy;
      float upOrRightLogDepth = czm_unpackDepth(texture(depthTexture, (glFragCoordXY + positiveOffset) / czm_viewport.zw));
      float downOrLeftLogDepth = czm_unpackDepth(texture(depthTexture, (glFragCoordXY - positiveOffset) / czm_viewport.zw));
      bvec2 upOrRightInBounds = lessThan(glFragCoordXY + positiveOffset, czm_viewport.zw);
      float useUpOrRight = float(upOrRightLogDepth > 0.0 && upOrRightInBounds.x && upOrRightInBounds.y);
      float useDownOrLeft = float(useUpOrRight == 0.0);
      vec3 upOrRightEC = getEyeCoordinate3FromWindowCoordinate(glFragCoordXY + positiveOffset, upOrRightLogDepth);
      vec3 downOrLeftEC = getEyeCoordinate3FromWindowCoordinate(glFragCoordXY - positiveOffset, downOrLeftLogDepth);
      return (upOrRightEC - (eyeCoordinate.xyz / eyeCoordinate.w)) * useUpOrRight + ((eyeCoordinate.xyz / eyeCoordinate.w) - downOrLeftEC) * useDownOrLeft;
    }
    vec3 getNormal(vec2 fragCoord) {
      float logDepthOrDepth = czm_unpackDepth(texture(depthTexture, fragCoord.xy / czm_viewport.zw));
      vec4 eyeCoordinate = czm_windowToEyeCoordinates(fragCoord.xy, logDepthOrDepth);
      vec3 downUp = vectorFromOffset(eyeCoordinate, vec2(0.0, 1.0));
      vec3 leftRight = vectorFromOffset(eyeCoordinate, vec2(1.0, 0.0));
      vec3 normalEC = normalize(cross(leftRight, downUp));
      return normalEC;
    }
    
    void main(void) { 
      out_FragColor = vec4(getNormal(gl_FragCoord.xy), 1.0);
    }`, /* @ts-expect-error : ..*/
    inputPreviousStageTexture: true,
    name: 'magoNormalTextureForEdge'
  })

  const edgeProcess = new Cesium.PostProcessStage({
    fragmentShader: `
      uniform sampler2D colorTexture; 
      uniform sampler2D magoNormalTextureForEdge; 
      uniform sampler2D magoDepthTextureForEdge;
      in vec2 v_textureCoordinates; 

      vec4 getNormal(vec2 screenPos) {
        return texture(magoNormalTextureForEdge, screenPos);
      }
      vec4 getDepth(vec2 screenPos) {
          return texture(magoDepthTextureForEdge, screenPos);
      }
      vec4 getPositionEC(vec2 screenPos){
          vec4 rawDepthColor = getDepth(screenPos);
          float depth = czm_unpackDepth(rawDepthColor);
          vec4 positionEC = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth);
          return positionEC;
      }
      float znkimDepth(vec2 screenPos) {
          vec4 positionEC = getPositionEC(screenPos);
          return abs(positionEC.z / positionEC.w);
      } 
      float getMeterDepth(vec2 screenPos) {
          return znkimDepth(screenPos) * czm_depthRange.far;
      }
      
      float compareNormal(in vec4 normalA, in vec4 normalB) {
        float result = 0.0; 
        result += abs(normalA.x - normalB.x);
        result += abs(normalA.y - normalB.y);
        result += abs(normalA.z - normalB.z);
        return result;
      }

      bool checkNormal() 
      {
          vec2 texelSize = 1.0 / czm_viewport.zw;
          float w = texelSize.x;
          float h = texelSize.y;

          vec2 s = v_textureCoordinates;
          vec2 d = vec2(v_textureCoordinates.x, v_textureCoordinates.y - h);
          vec2 r = vec2(v_textureCoordinates.x + w, v_textureCoordinates.y);
          vec2 dr = vec2(v_textureCoordinates.x + w, v_textureCoordinates.y - h);

          vec4 sn = getNormal(s);
          vec4 dn = getNormal(d);
          vec4 rn = getNormal(r);

          float cd = compareNormal(sn, dn);
          float cr = compareNormal(sn, rn);

          float offset = 0.5;
          return (cd > offset || cr > offset);
      }

      bool checkDepth() 
      {
          vec2 texelSize = 1.0 / czm_viewport.zw;
          float w = texelSize.x;
          float h = texelSize.y;

          vec2 s = v_textureCoordinates;
          vec2 d = vec2(v_textureCoordinates.x, v_textureCoordinates.y - h);
          vec2 r = vec2(v_textureCoordinates.x + w, v_textureCoordinates.y);
          vec2 dr = vec2(v_textureCoordinates.x + w, v_textureCoordinates.y - h);

          float sd = getMeterDepth(s);
          float dd = getMeterDepth(d);
          float rd = getMeterDepth(r);
          float drd = getMeterDepth(dr);

          float offset = sd / 25.0;

          bool isDown = abs(sd - dd) > offset;
          bool isRight = abs(sd - rd) > offset;
          bool isDownRight = abs(sd - drd) > offset;
          return (isDown || isRight || isDownRight);
      }

      vec4 decodeNormal(in vec4 normal) {
        return vec4(normal.xyz * 2.0 - 1.0, normal.w);
      }

      void main(void) {
          float sd = getMeterDepth(v_textureCoordinates);
          float offsetFactor = min((sd / 2000.0), 1.0);
          float offset = max(0.9 * offsetFactor, 0.5);  

          if (checkNormal() || checkDepth()) {
            out_FragColor = texture(colorTexture, v_textureCoordinates) * offset;
          } else {
            out_FragColor = texture(colorTexture, v_textureCoordinates);
          }
          
          vec4 sunDir = vec4(czm_sunDirectionEC, 1.0);
          vec4 normal = getNormal(v_textureCoordinates);
          float dotResult = dot(normal.xyz, sunDir.xyz);
          float value = max(1.0, dotResult);
          out_FragColor = vec4(out_FragColor.xyz * value, 1.0);
      }
    `, uniforms: {
      magoNormalTextureForEdge: 'magoNormalTextureForEdge',
      magoDepthTextureForEdge: 'magoDepthTextureForEdge'
    }
  });

  const createdComposite = new Cesium.PostProcessStageComposite({
    name: 'edgeComposite',
    inputPreviousStageTexture: false,
    stages: [createDepthProcessStage, createNormalProcessStage, edgeProcess]
  })
  viewer.scene.postProcessStages.add(createdComposite)
  composite = createdComposite
  composite.enabled = false
}
export const onEdge = () => {
  if (composite) {
    composite.enabled = true;
  }
}

export const offEdge = () => {
  if (composite) {
    composite.enabled = false;
  }
}