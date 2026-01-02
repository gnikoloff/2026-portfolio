import fresnelSchlickRoughness from "./pbr/fresnelSchlickRoughness";
import lottes from "./tonemapping/lottes";
import uchimura from "./tonemapping/uchimura";

const out = `#version 300 es
  precision highp float;

  -- DEFINES_HOOK --

  ${uchimura}
  ${lottes}


  #ifdef USE_UV
    in vec2 vUv;
  #endif

  uniform vec3 cameraPosition;

  #ifdef IS_SKYBOX
    uniform samplerCube u_environmentMap;
    uniform float blurFactor;
  #endif

  #ifdef IS_TO_CUBEMAP_CONVERT
    uniform sampler2D u_environmentMap;
  #endif

  #ifdef USE_WORLD_POS
    in vec3 vWorldPos;
  #endif

  #ifdef USE_NORMAL
    in vec3 vNormal;
  #endif

  #ifdef USE_TANGENT
    in vec3 vTangent;
    in vec3 vBitangent;
  #endif

  #ifdef USE_PBR
    // uniform sampler2D u_aoMap;
    // uniform sampler2D u_heightMap;
    uniform sampler2D u_albedoMap;
    uniform sampler2D u_metallicMap;
    uniform sampler2D u_roughnessMap;
    uniform sampler2D u_normalMap;

    uniform samplerCube u_irradianceMap;
    uniform samplerCube u_prefilterMap;
    uniform sampler2D u_brdfLUT;

    ${fresnelSchlickRoughness}
  #endif

  #ifdef HAS_LOADING_ANIM
    uniform float loadingT;
  #endif

  #ifdef IS_FULLSCREEN_TRIANGLE
    uniform sampler2D inTexture;
    uniform sampler2D bloomTexture;
    uniform float bloomMixFactor;
    uniform float renderModeMixFactor;
  #endif

  #ifdef IS_GAUSSIAN_BLUR
    uniform vec2 u_resolution;
    uniform vec2 u_direction;
  #endif

  #ifdef USE_MRT
    layout(location = 0) out vec4 fragColor;
    layout(location = 1) out vec4 brightColor;
  #else
    out vec4 finalColor;
  #endif

  void main() {

    #ifdef IS_SKYBOX
      vec3 envColor = texture(u_environmentMap, vWorldPos, blurFactor * 6.0).rgb;
      // finalColor = vec4(envColor, 1.0);
      #ifdef USE_MRT
        fragColor = vec4(envColor, 1.0);
        brightColor = vec4(0.0);
      #endif
    #else
      #ifdef IS_TO_CUBEMAP_CONVERT
        vec4 envColor = texture(u_environmentMap, vUv);
        // envColor.rgb *= pow(2.0,envColor.a*255.0-128.0);  
        finalColor = envColor;
        // finalColor = vec4(vUv, 0.0, 1.0);
      #else
        #ifdef USE_PBR
          vec3 N = normalize(vNormal);
          vec3 T = normalize(vTangent);
        
          // Gram-Schmidt orthogonalization
          T = normalize(T - dot(T, N) * N);
        
          // Reconstruct bitangent
          vec3 B = cross(N, T);
          
          mat3 TBN = mat3(T, B, N);
          vec2 uv = vUv * 1.0;
          vec3 normalMap = texture(u_normalMap, uv).xyz * 2.0 - 1.0;
          N = normalize(TBN * normalMap);

          vec3 albedo = texture(u_albedoMap, uv).xyz; // vec3(1.0, 1.0, 1.0);
          float metallic = texture(u_metallicMap, uv).r;
          float roughness = texture(u_roughnessMap, uv).r;
          float ao = 1.0; // texture(u_aoMap, uv).r;

          vec3 V = normalize(cameraPosition - vWorldPos);
          float NdotV = max(dot(N, V), 0.0000001);
          vec3 F0 = mix(vec3(0.04), albedo, metallic);

          vec3 Lo = vec3(0.0);

          vec3 F = fresnelSchlickRoughness(NdotV, F0, roughness);
          vec3 kS = F;
          vec3 kD = 1.0 - kS;
          kD *= 1.0 - metallic;

          vec3 irradiance = texture(u_irradianceMap, N).rgb;
          vec3 diffuse = irradiance * albedo * 1.0; // diffuseEnvLightMixFactor;

          vec3 R = reflect(-V, N);
          vec3 prefilteredColor = textureLod(u_prefilterMap, R, roughness * MAX_REFLECTION_LOD).rgb;   
          vec2 envBRDF = texture(u_brdfLUT, vec2(NdotV, roughness)).rg;
          vec3 specular = prefilteredColor * (F * envBRDF.x + envBRDF.y) * 1.0; // specularEnvLightMixFactor;

          vec3 ambient = (kD * diffuse + specular) * ao;
  
          vec3 color = ambient + Lo;
          fragColor = vec4(color, 1.0);

          #ifdef HAS_LOADING_ANIM
            fragColor.a = loadingT;
          #endif

          // fragColor = vec4(vec3(metallic), 1.0);
          

          float brightness = max(color.r, max(color.g, color.b));
          float bloom = step(1.0, brightness);
          brightColor = vec4(vec3(bloom) * color, 1.0);

        #else
          #ifdef IS_FULLSCREEN_TRIANGLE
            #ifdef IS_GAUSSIAN_BLUR
              vec2 texelSize = 1.0 / u_resolution;
    
              vec4 color = vec4(0.0);
              vec2 off1 = vec2(1.411764705882353) * u_direction;
              vec2 off2 = vec2(3.2941176470588234) * u_direction;
              vec2 off3 = vec2(5.176470588235294) * u_direction;
              color += texture(inTexture, vUv) * 0.1964825501511404;
              color += texture(inTexture, vUv + (off1 * texelSize)) * 0.2969069646728344;
              color += texture(inTexture, vUv - (off1 * texelSize)) * 0.2969069646728344;
              color += texture(inTexture, vUv + (off2 * texelSize)) * 0.09447039785044732;
              color += texture(inTexture, vUv - (off2 * texelSize)) * 0.09447039785044732;
              color += texture(inTexture, vUv + (off3 * texelSize)) * 0.010381362401148057;
              color += texture(inTexture, vUv - (off3 * texelSize)) * 0.010381362401148057;
              
              finalColor = color;
            #else
              vec3 bloomColor = texture(bloomTexture, vUv).rgb;
              vec3 sceneColor = texture(inTexture, vUv).rgb;

              vec3 color = sceneColor + bloomColor * bloomMixFactor;

              finalColor.rgb = lottes(color);
              finalColor.rgb = pow(color, vec3(1.0 / 2.2));
              finalColor.a = 1.0;

              finalColor = mix(vec4(bloomColor * bloomMixFactor, 1.0), finalColor, renderModeMixFactor);

              // finalColor = vec4(vUv, 0.0, 1.0);

              // finalColor = vec4(bloomColor, 1.0);
            #endif
          #else
            finalColor = vec4(vUv, 0.0, 1.0);
          #endif
        #endif
      #endif
    #endif
  }
`;

export default out;
