vec3 hex3(float r,float g,float b){ return vec3(r,g,b)/255.0; }

vec3 paletteColor(int i){
    // Approx palette (tune if you want)
    // A19 pink, A26 yellow, B25 green, C8/C10/C26/C28 blues, F7/F15 reds, H2 white, H7 black
    if(i==0)  return hex3(235.,140.,150.); // A19
    if(i==1)  return hex3(245.,205., 70.); // A26
    if(i==2)  return hex3(155.,190.,120.); // B25
    if(i==3)  return hex3( 35., 75.,150.); // C8
    if(i==4)  return hex3( 95.,190.,215.); // C10
    if(i==5)  return hex3( 70.,150.,210.); // C26
    if(i==6)  return hex3( 55.,120.,195.); // C28
    if(i==7)  return hex3(120., 30., 45.); // F7
    if(i==8)  return hex3(200., 55., 65.); // F15
    if(i==9)  return hex3(245.,245.,245.); // H2
    return            hex3( 20., 20., 20.); // H7
}

vec3 quantizeToPalette(vec3 c){
    float bestD = 1e9;
    vec3 best = c;
    for(int i=0;i<11;i++){
        vec3 p = paletteColor(i);
        float d = dot(c-p, c-p);
        if(d < bestD){
            bestD = d;
            best = p;
        }
    }
    return best;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;


    vec2 grid = vec2(52.0, 52.0);


    vec2 cell = floor(uv * grid);
    vec2 cellUV = (cell + 0.5) / grid;     // sample center of each cell


    vec3 src = texture(iChannel0, cellUV).rgb;

    vec3 col = quantizeToPalette(src);


    vec2 f = fract(uv * grid);
    float line = step(0.98, f.x) + step(0.98, f.y);
    line = clamp(line, 0.0, 1.0);

    vec2 m = mod(cell, 5.0);
    float thick = (step(m.x, 0.0) + step(m.y, 0.0)) * 0.6; // subtle
    thick = clamp(thick, 0.0, 1.0);

    vec3 gridColThin  = vec3(0.55);
    vec3 gridColThick = vec3(0.35);

    col = mix(col, gridColThin, line * 0.35);
    col = mix(col, gridColThick, thick * 0.25);

    fragColor = vec4(col, 1.0);
}