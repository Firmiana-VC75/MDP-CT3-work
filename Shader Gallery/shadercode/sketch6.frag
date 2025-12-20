
#define PI 3.141592653589

float sdCircle(vec2 p, float r){ return length(p) - r; }


float sdCapsule(vec2 p, vec2 a, vec2 b, float r){
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba*h) - r;
}


float ring(float d, float w){
    return 1.0 - smoothstep(w, w + 0.002, abs(d));
}


float fill(float d){
    return 1.0 - smoothstep(0.0, 0.002, d);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;


    vec3 bg = vec3(0.30, 0.70, 0.85);
    vec3 col = bg;


    vec2 p = uv * 2.0 - 1.0;
    p.x *= iResolution.x / iResolution.y;


    p -= vec2(0.0, 0.10);


    float s = 1.35;
    p *= s;

    float body = sdCircle(p, 0.42);
    float cap  = sdCircle(p - vec2(-0.12, 0.38), 0.10); // small bump
    float bodyFill = fill(min(body, cap));

    vec3 yellow = vec3(0.98, 0.86, 0.12);
    col = mix(col, yellow, bodyFill);

    vec3 ink = vec3(0.05);

    float outline = ring(body, 0.025);
    outline = max(outline, ring(cap, 0.020));

    float stripe = 1.0 - smoothstep(0.018, 0.020, sdCapsule(p, vec2(-0.46, 0.05), vec2(0.46, 0.20), 0.030));

    float clapperStem = 1.0 - smoothstep(0.018, 0.020, sdCapsule(p, vec2(0.08, -0.05), vec2(0.10, -0.26), 0.030));
    float clapperBall = fill(sdCircle(p - vec2(0.08, -0.05), 0.070));

    float inkMask = clamp(outline + stripe + clapperStem + clapperBall, 0.0, 1.0);
    col = mix(col, ink, inkMask);

    float shadow = fill(sdCircle(p - vec2(0.02, -0.02), 0.44)) * (1.0 - bodyFill);
    col = mix(col, col * 0.92, shadow * 0.25);

    fragColor = vec4(col, 1.0);
}