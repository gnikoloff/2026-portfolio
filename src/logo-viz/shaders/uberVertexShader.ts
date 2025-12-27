import boxTwistChunk from "./boxTwist";

const out = `#version 300 es

  -- DEFINES_HOOK --

  ${boxTwistChunk}

  uniform mat4 projMatrix;
  uniform mat4 viewMatrix;

  // uniform PostFX {
  //   highp int tonemappingMode;
  // };

  uniform mat4 u_worldMatrix;

  in vec4 aPosition;

  #ifdef USE_UV
    in vec2 aUv;
    out vec2 vUv;
  #endif

  #ifdef USE_NORMAL
    in vec3 aNormal;
    out vec3 vNormal;
  #endif

  #ifdef USE_TANGENT
    in vec4 aTangent;
    out vec3 vTangent;
    out vec3 vBitangent;
  #endif

  #ifdef USE_WORLD_POS
    out vec3 vWorldPos;
  #endif

  #ifdef HAS_LOADING_ANIM
    uniform float loadingT;
  #endif

  void main () {
    vec4 worldPos = u_worldMatrix * aPosition;

    #ifdef IS_SKYBOX
      mat4 rotView = mat4(mat3(viewMatrix));
      vec4 clipPos = projMatrix * rotView * worldPos;
      gl_Position = clipPos.xyww;
    #else
      #ifdef IS_TEXT_MESH
        float deformScale = 2.0;
        float deformAngle = deformScale - loadingT * deformScale;
        float ang = (aPosition.x * 0.5 + 0.5) * sin(deformAngle) * deformAngle;
        worldPos = doBoxTwistX(worldPos, ang);
        deformScale = 2.0;
        deformAngle = deformScale - loadingT * deformScale;
        ang = (aPosition.y * 0.5 + 0.5) * sin(deformAngle) * deformAngle;
        worldPos = doBoxTwistY(worldPos, ang);
        gl_Position = projMatrix * viewMatrix * worldPos;
      #else
        #ifdef IS_FULLSCREEN_TRIANGLE
          gl_Position = aPosition;
        #else
          gl_Position = projMatrix * viewMatrix * worldPos;
        #endif
      #endif
    #endif
    
    #ifdef USE_NORMAL
      vNormal = aNormal;
    #endif

    #ifdef USE_TANGENT
      vTangent = normalize(aTangent.xyz);
      vBitangent = cross(vNormal, vTangent) * aTangent.w;
    #endif

    #ifdef USE_UV
      vUv = aUv;
    #endif

    #ifdef USE_WORLD_POS
      vWorldPos = worldPos.xyz;
    #endif
  }
`;
export default out;
