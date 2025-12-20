#define PI 3.141592653589

float sdCircle(vec2 p, float r){
    return length(p) - r;
}

float sdBox(vec2 p, vec2 b){
    vec2 d = abs(p) - b;
    return max(d.x, d.y);
}

float sdCapsule(vec2 p, vec2 a, vec2 b, float r){
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h) - r;
}

float sdRoundBox(vec2 p, vec2 b, float r){
    vec2 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float fill(float d){
    return 1.0 - smoothstep(0.0, 0.002, d);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;

    vec3 bgA = vec3(0.92, 0.95, 0.98);
    vec3 bgB = vec3(0.86, 0.92, 0.97);
    vec3 col = mix(bgA, bgB, uv.y);

    vec2 p = uv * 2.0 - 1.0;
    p.x *= iResolution.x / iResolution.y;

    p -= vec2(0.0, -0.03);
    p *= 1.35;

    vec3 ink      = vec3(0.08, 0.08, 0.09);
    vec3 red1     = vec3(0.93, 0.20, 0.18);
    vec3 red2     = vec3(0.72, 0.10, 0.12);
    vec3 red3     = vec3(0.98, 0.42, 0.34); // highlight tint
    vec3 green1   = vec3(0.18, 0.70, 0.30);
    vec3 green2   = vec3(0.10, 0.50, 0.20);
    vec3 shadowC  = vec3(0.78, 0.84, 0.92);

    vec2 pb = p;
    pb.y *= 1.06;                      
    pb.x *= 0.98;
    float dBody = sdCircle(pb, 0.44);

    float dBulge = sdCircle(p - vec2(0.0, -0.20), 0.28);
    dBody = min(dBody, dBulge + 0.10);

    float body = fill(dBody);

    float dDent = sdCircle(p - vec2(0.0, 0.30), 0.14);
    float dent = fill(dDent);


    float bodyNoDent = clamp(body - dent * 0.85, 0.0, 1.0);

    float dCalyx = 1e5;


    dCalyx = min(dCalyx, sdCircle(p - vec2(0.0, 0.34), 0.06));


    for(int i=0;i<5;i++){
        float a = (float(i)/5.0) * (PI*2.0) + 0.2;
        vec2 dir = vec2(cos(a), sin(a));
        vec2 c0 = vec2(0.0, 0.32) + dir * 0.02;
        vec2 c1 = vec2(0.0, 0.32) + dir * 0.18;
        dCalyx = min(dCalyx, sdCapsule(p, c0, c1, 0.045));
    }

    float calyx = fill(dCalyx);


    vec2 ps = p - vec2(0.05, -0.52);
    ps.x *= 1.4;
    float dShadow = sdCircle(ps, 0.22);
    float shadow = fill(dShadow) * 0.45;

    col = mix(col, shadowC, shadow);


    float shade = clamp(0.55 + 0.85*(p.x*0.6 - p.y*0.25), 0.0, 1.0);
    vec3 bodyCol = mix(red1, red2, shade);

    // highlight blob
    float dHi = sdCircle(p - vec2(-0.14, 0.05), 0.15);
    float hi = fill(dHi) * bodyNoDent;
    bodyCol = mix(bodyCol, red3, hi * 0.55);


    float gshade = clamp(0.45 + 0.9*(p.x*0.4 + p.y*0.2), 0.0, 1.0);
    vec3 calyxCol = mix(green1, green2, gshade);


    float dAll = min(dBody, dCalyx);
    float allMask = fill(dAll);

    float o = 0.020; // outline thickness
    float outer = fill(dAll + o);
    float outline = clamp(outer - allMask, 0.0, 1.0);


    col = mix(col, bodyCol, bodyNoDent);
    col = mix(col, calyxCol, calyx);


    float dStem = sdCapsule(p, vec2(0.0, 0.37), vec2(0.0, 0.46), 0.03);
    float stem = fill(dStem);
    col = mix(col, green2, stem);


    col = mix(col, ink, outline);

    fragColor = vec4(col, 1.0);
}