const out = `
  // https://www.ozone3d.net/tutorials/mesh_deformer_p3.php
  vec4 doBoxTwistX(vec4 pos, float t) {
    float st = sin(t);
    float ct = cos(t);
    vec4 new_pos;
    
    new_pos.y = pos.y * ct - pos.z * st;
    new_pos.z = pos.y * st + pos.z * ct;
    
    new_pos.x = pos.x;
    new_pos.w = pos.w;

    return new_pos;
  }

  vec4 doBoxTwistY(vec4 pos, float t) {
    float st = sin(t);
    float ct = cos(t);
    vec4 new_pos;
    
    new_pos.x = pos.x * ct - pos.z * st;
    new_pos.z = pos.x * st + pos.z * ct;
    
    new_pos.y = pos.y;
    new_pos.w = pos.w;

    return new_pos;
  }
`;

export default out;
