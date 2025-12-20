import ubosChunk from "./ubos";

const out = `#version 300 es

  -- DEFINES_HOOK --

  #ifdef USE_UBOS
    ${ubosChunk}
  #else
    uniform mat4 u_projectionViewMatrix;
  #endif

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

  #ifdef USE_WORLD_POS
    out vec3 vWorldPos;
  #endif


  void main () {
    vec4 worldPos = u_worldMatrix * aPosition;

    #ifdef IS_SKYBOX
      mat4 rotView = mat4(mat3(viewMatrix));
      vec4 clipPos = projMatrix * rotView * worldPos;
      gl_Position = clipPos.xyww;
    #else
      #ifdef USE_UBOS
        gl_Position = projMatrix * viewMatrix * worldPos;
      #else
        gl_Position = u_projectionViewMatrix * worldPos;
      #endif
    #endif
    
    #ifdef USE_NORMAL
      vNormal = mat3(u_worldMatrix) * aNormal;
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
