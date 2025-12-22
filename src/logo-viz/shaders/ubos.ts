const out = `
uniform Camera {
  mat4 projMatrix;
  mat4 viewMatrix;
  float zNear;
  float zFar;
  vec3 cameraPosition;
  float time;
};

#ifdef USE_PBR
  // uniform Lighting {
  //   vec3 pointLightPositions[POINT_LIGHTS_COUNT];
  //   vec3 pointLightColors[POINT_LIGHTS_COUNT];
  //   float pointLightIntensity;
  //   float diffuseEnvLightMixFactor;
  //   float specularEnvLightMixFactor;
  // };
#endif
`;

export default out;
