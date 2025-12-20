float sdBox(vec2 p, vec2 b){
    vec2 d = abs(p) - b;
    return max(d.x, d.y);
}

float fill(float d){
    return 1.0 - smoothstep(0.0, 0.002, d);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;

    vec3 topCol = vec3(0.93, 0.95, 0.98);
    vec3 botCol = vec3(0.10, 0.30, 0.90);
    float g = smoothstep(0.05, 0.95, 1.0 - uv.y);
    vec3 col = mix(topCol, botCol, g);

    float cells = 70.0; // try 60~100
    vec2 gv = fract(uv * cells);

    float t = 0.055; // try 0.04~0.08

    float vLine = fill(sdBox(gv - vec2(0.0, 0.5), vec2(t, 0.55))) +
                  fill(sdBox(gv - vec2(1.0, 0.5), vec2(t, 0.55)));

    float hLine = fill(sdBox(gv - vec2(0.5, 0.0), vec2(0.55, t))) +
                  fill(sdBox(gv - vec2(0.5, 1.0), vec2(0.55, t)));

    float grid = clamp(vLine + hLine, 0.0, 1.0);

    float gridStrength = mix(0.18, 0.42, smoothstep(0.0, 1.0, 1.0 - uv.y));

    vec3 gridCol = vec3(0.10, 0.22, 0.55);

    col = mix(col, mix(col, gridCol, 0.65), grid * gridStrength);

    fragColor = vec4(col, 1.0);
}