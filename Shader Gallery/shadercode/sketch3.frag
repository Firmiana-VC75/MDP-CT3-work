#define PI 3.141592653589

float hash21(vec2 p){
    return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453123);
}
float sstep(float a, float b, float x){ return smoothstep(a,b,x); }


void polar(vec2 p, out float r, out float a){
    r = length(p);
    a = atan(p.y, p.x); // [-PI, PI]
}


float petalLayer(vec2 p, float r0, float r1, float swirl, float freq, float width0, float width1, float wav, float seed){
    float r, a; polar(p, r, a);
    float rr = clamp((r - r0) / max(r1 - r0, 1e-4), 0.0, 1.0);


    float swirlAmt = swirl * (1.0 - rr);
    float aw = a + swirlAmt * (1.2 - r) * 2.2;

    float ridge = 0.5 + 0.5 * cos(aw * freq + rr * 3.2);

    ridge = pow(ridge, 1.6);

    float w = mix(width0, width1, rr);

    float noise = (hash21(vec2(floor(rr*12.0), floor((aw+PI)*2.0)) + seed) - 0.5);
    float wavy = wav * (0.35*sin(aw*3.0 + rr*10.0) + 0.65*noise);

    float fill = smoothstep(w + wavy, w + wavy + 0.15, ridge);


    float inBand = sstep(r0, r0 + 0.01, r) * (1.0 - sstep(r1, r1 + 0.01, r));

    return fill * inBand;
}


float roseShade(vec2 p, float mask){
    float r = length(p);
    vec2 light2D = normalize(vec2(-0.5, 0.8));
    float lam = clamp(dot(normalize(p + 1e-6), light2D)*0.5 + 0.5, 0.0, 1.0);

    float center = 1.0 - smoothstep(0.0, 0.55, r);
    float edge   = smoothstep(0.18, 0.95, r);

    float sh = 0.35 + 0.55*lam + 0.25*edge - 0.22*center;
    return clamp(sh, 0.0, 1.0) * mask;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{

    vec2 uv = fragCoord / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    vec2 p = uv - vec2(0.0, -0.02);
    p *= 1.10;


    float L1 = petalLayer(p, 0.00, 0.22, 3.2, 18.0, 0.62, 0.72, 0.03, 10.1);

    float L2 = petalLayer(p, 0.12, 0.52, 2.2, 12.0, 0.55, 0.68, 0.04, 20.2);
    float L3 = petalLayer(p, 0.28, 0.82, 1.6,  8.0, 0.52, 0.66, 0.05, 30.3);

    float L4 = petalLayer(p, 0.52, 1.05, 1.0,  6.0, 0.50, 0.64, 0.06, 40.4);

    float petals = clamp(0.55*L1 + 0.65*L2 + 0.75*L3 + 0.85*L4, 0.0, 1.0);


    float r = length(p);
    float silhouette = 1.0 - smoothstep(0.98, 1.05, r);
    float flower = petals * silhouette;


    float feather = 0.015;
    flower = smoothstep(0.0, feather, flower);

    vec3 bg = vec3(0.98, 0.97, 0.96);

    vec3 deep = vec3(0.20, 0.02, 0.06);
    vec3 mid  = vec3(0.62, 0.06, 0.16);
    vec3 lite = vec3(0.94, 0.46, 0.56);

    float sh = roseShade(p, flower);
    vec3 roseCol = mix(deep, mid, sh);
    roseCol = mix(roseCol, lite, pow(sh, 2.2) * 0.50);

    float grain = (hash21(fragCoord*0.8) - 0.5) * 0.012;
    roseCol += grain * flower;

    vec3 col = mix(bg, roseCol, flower);

    fragColor = vec4(col, 1.0);
}