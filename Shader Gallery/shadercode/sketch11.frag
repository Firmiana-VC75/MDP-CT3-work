float hash21(vec2 p){
    p = fract(p*vec2(123.34, 456.21));
    p += dot(p, p+45.32);
    return fract(p.x*p.y);
}

vec3 palette(float t){
    // 4-color palette close to your image
    vec3 c0 = vec3(0.95, 0.82, 0.18); // yellow
    vec3 c1 = vec3(0.98, 0.58, 0.18); // orange
    vec3 c2 = vec3(0.80, 0.12, 0.14); // red
    vec3 c3 = vec3(0.16, 0.78, 0.72); // teal

    if(t < 0.25) return c0;
    if(t < 0.50) return c1;
    if(t < 0.75) return c2;
    return c3;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;

    float N = 42.0;

    vec2 g = uv * N;
    vec2 id = floor(g);
    vec2 f  = fract(g);

    float r = hash21(id);
    float sz;
    if(r < 0.55) sz = 1.0;
    else if(r < 0.78) sz = 2.0;
    else if(r < 0.92) sz = 3.0;
    else sz = 4.0;

    vec2 bid = floor(id / sz) * sz; // block anchor cell

    float t = hash21(bid + 13.7);

    t = mix(t, t*t, 0.55);

    vec3 col = palette(t);

    float v = 0.92 + 0.12 * hash21(bid + 91.3);
    col *= v;


    float line = step(0.98, f.x) + step(0.98, f.y);
    col = mix(col, col*0.88, clamp(line,0.0,1.0)*0.25);

    fragColor = vec4(col, 1.0);
}