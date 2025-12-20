float hash21(vec2 p){
    // simple stable hash
    p = fract(p*vec2(123.34, 456.21));
    p += dot(p, p+78.233);
    return fract(p.x*p.y);
}

vec2 rot45(vec2 p){
    float s = 0.70710678; // 1/sqrt(2)
    return vec2(p.x*s - p.y*s, p.x*s + p.y*s);
}

vec3 pal(float t){

    vec3 c0 = vec3(0.05, 0.25, 0.55); // deep blue
    vec3 c1 = vec3(0.06, 0.06, 0.08); // near-black
    vec3 c2 = vec3(0.98, 0.80, 0.15); // yellow
    vec3 c3 = vec3(0.98, 0.55, 0.10); // orange
    vec3 c4 = vec3(0.65, 0.85, 0.95); // light blue

    if(t < 0.25) return mix(c0, c1, smoothstep(0.0, 0.25, t));
    if(t < 0.55) return mix(c1, c2, smoothstep(0.25, 0.55, t));
    if(t < 0.75) return mix(c2, c3, smoothstep(0.55, 0.75, t));
    return mix(c3, c4, smoothstep(0.75, 1.0, t));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;

    float px = 18.0; // try 14..26
    vec2 pc = floor(fragCoord/px)*px + px*0.5;
    uv = pc / iResolution.xy;

    vec2 p = uv*2.0 - 1.0;
    p.x *= iResolution.x / iResolution.y;

    vec2 pr = rot45(p);


    float cells = 18.0; // try 14..24
    vec2 g = pr * cells;

    vec2 gid = floor(g);
    vec2 gf  = fract(g) - 0.5;

    vec2 q = (gid + 0.5) / cells;       
    float d = max(abs(q.x), abs(q.y));  

    float n = hash21(gid);
    d += (n - 0.5) * 0.03;

    float t = clamp(d / 1.05, 0.0, 1.0);

    vec3 col = pal(t);

    float steps = 10.0; // increase for more rings
    float tt = floor(t * steps) / steps;
    vec3 bandCol = pal(tt);
    col = mix(col, bandCol, 0.65);

    float center = smoothstep(0.22, 0.0, t);
    float sparkle = step(0.92, hash21(gid + 13.7)) * center;
    col = mix(col, vec3(0.95), sparkle*0.8);

    fragColor = vec4(col, 1.0);
}