import ubosChunk from "./ubos";

const out = `#version 300 es
  precision highp float;

  -- DEFINES_HOOK --

  #ifdef USE_UBOS
    ${ubosChunk}
  #endif

  #ifdef USE_UV
    in vec2 vUv;
  #endif

  #ifdef IS_SKYBOX
    uniform sampler2D u_environmentMap;
  #endif

  #ifdef USE_WORLD_POS
    in vec3 vWorldPos;
  #endif

  out vec4 finalColor;

  void main() {
    #ifdef IS_SKYBOX
      vec3 envColor = texture(u_environmentMap, vUv).rgb;
      finalColor = vec4(envColor, 1.0);
    #else
      finalColor = vec4(vUv, 0.0, 1.0);
    #endif
  }
`;

export default out;
