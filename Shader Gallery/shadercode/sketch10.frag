#define PI 3.141592653589

float sdCircle(vec2 p, float r){
    return length(p) - r;
}

float sdBox(vec2 p, vec2 b){
    vec2 d = abs(p) - b;
    return max(d.x, d.y);
}

// Capsule SDF: a → b with radius r
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

    vec3 bgA = vec3(0.94, 0.96, 0.99);
    vec3 bgB = vec3(0.86, 0.92, 0.98);
    vec3 col = mix(bgA, bgB, uv.y);

    vec2 p = uv * 2.0 - 1.0;
    p.x *= iResolution.x / iResolution.y;

    p -= vec2(0.0, -0.02);
    p *= 1.30;

    vec3 ink     = vec3(0.08, 0.08, 0.09);
    vec3 red1    = vec3(0.92, 0.18, 0.16);
    vec3 red2    = vec3(0.70, 0.10, 0.12);
    vec3 redHi   = vec3(0.98, 0.42, 0.34);
    vec3 green1  = vec3(0.18, 0.75, 0.30);
    vec3 green2  = vec3(0.10, 0.55, 0.22);
    vec3 stem1   = vec3(0.42, 0.26, 0.14);
    vec3 stem2   = vec3(0.26, 0.16, 0.10);
    vec3 shadowC = vec3(0.78, 0.84, 0.92);



vec2 pb = p;
pb.y *= 1.05;            // very slight vertical stretch
float dBody = sdCircle(pb, 0.42);


float dBottom = sdCircle(p - vec2(0.0, -0.22), 0.30);
dBody = min(dBody, dBottom + 0.12);


float body = fill(dBody);


float dDent = sdCircle(p - vec2(0.0, 0.36), 0.12);
float dent = fill(dDent);


float bodyNoDent = clamp(body - dent * 0.55, 0.0, 1.0);


    vec2 lp = p - vec2(0.18, 0.45);
    float ang = -0.65;
    mat2 R = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
    lp = R * lp;

    float dLeaf = sdCapsule(lp, vec2(-0.12, 0.00), vec2(0.18, 0.00), 0.09);
    dLeaf = min(dLeaf, sdCircle(lp - vec2(0.20, 0.00), 0.10));
    float leaf = fill(dLeaf);

    float dStem = sdCapsule(p, vec2(0.02, 0.32), vec2(0.02, 0.50), 0.05);
    float stem = fill(dStem);

    vec2 ps = p - vec2(0.05, -0.62);
    ps.x *= 1.5;
    float dShadow = sdCircle(ps, 0.24);
    float shadow = fill(dShadow) * 0.45;
    col = mix(col, shadowC, shadow);

    float shade = clamp(0.55 + 0.90*(p.x*0.55 - p.y*0.20), 0.0, 1.0);
    vec3 bodyCol = mix(red1, red2, shade);


    float dHi = sdCircle(p - vec2(-0.22, 0.08), 0.17);
    float hi = fill(dHi) * bodyNoDent;
    bodyCol = mix(bodyCol, redHi, hi * 0.55);


    float gshade = clamp(0.45 + 0.9*(lp.x*0.4 + lp.y*0.2), 0.0, 1.0);
    vec3 leafCol = mix(green1, green2, gshade);


    float sShade = clamp(0.55 + 0.8*(p.x*0.3 + p.y*0.2), 0.0, 1.0);
    vec3 stemCol = mix(stem1, stem2, sShade);


    float dAll = min(dBody, min(dStem, dLeaf));
    float allMask = fill(dAll);

    float o = 0.020; // outline thickness
    float outer = fill(dAll + o);
    float outline = clamp(outer - allMask, 0.0, 1.0);

    col = mix(col, bodyCol, bodyNoDent);
    col = mix(col, stemCol, stem);
    col = mix(col, leafCol, leaf);

    col = mix(col, ink, outline);

    fragColor = vec4(col, 1.0);
}