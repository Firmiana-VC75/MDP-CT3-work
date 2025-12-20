#define PI 3.141592653589

float sstep(float a, float b, float x){
    return smoothstep(a, b, x);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{

    vec2 uv = fragCoord / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    vec2 p = uv;
    float r = length(p);
    float a = atan(p.y, p.x); // [-PI, PI]


    float ang = (a + PI) / (2.0 * PI);


    float ringFreq = 22.0;               
    float rings = abs(sin(r * ringFreq * PI));

    float pulls = 14.0;                   
    float drag = abs(sin(ang * pulls * PI));

    float pattern = rings * (0.55 + 0.45 * drag);

    pattern = smoothstep(0.55, 0.72, pattern);

    float centerFade = sstep(0.02, 0.10, r);
    float edgeFade   = 1.0 - sstep(0.85, 0.98, r);
    pattern *= centerFade * edgeFade;

    vec3 chocolate = vec3(0.18, 0.06, 0.05);  // dark chocolate
    vec3 cream     = vec3(0.97, 0.96, 0.94);  // white chocolate

    vec3 col = mix(chocolate, cream, pattern);

    fragColor = vec4(col, 1.0);
}