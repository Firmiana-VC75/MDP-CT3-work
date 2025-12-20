vec3 rgb(float r, float g, float b){ return vec3(r,g,b)/255.0; }


float inRect(ivec2 P, int x0,int y0,int x1,int y1){
    // inclusive bounds
    return (P.x>=x0 && P.x<=x1 && P.y>=y0 && P.y<=y1) ? 1.0 : 0.0;
}

float inCircle(ivec2 P, int cx,int cy,int r){
    int dx = P.x - cx;
    int dy = P.y - cy;
    return (dx*dx + dy*dy <= r*r) ? 1.0 : 0.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{

    // You can change these to make pixels larger/smaller
    ivec2 G = ivec2(64, 64); // artwork grid
    vec2 uv = fragCoord / iResolution.xy;


    float aspect = iResolution.x / iResolution.y;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= aspect;

    float scale = 0.95;
    vec2 q = (p / scale) * 0.5 + 0.5;


    vec3 bgA = rgb(235.,235.,238.);
    vec3 bgB = rgb(220.,220.,225.);
    vec2 gridUV = q * vec2(G);
    float gridLine = step(0.98, fract(gridUV.x)) + step(0.98, fract(gridUV.y));
    vec3 col = mix(bgA, bgB, clamp(gridLine,0.0,1.0)*0.35);


    if(q.x < 0.0 || q.x > 1.0 || q.y < 0.0 || q.y > 1.0){
        fragColor = vec4(col,1.0);
        return;
    }


    ivec2 P = ivec2(floor(q * vec2(G)));

    vec3 outline = rgb(30., 30., 30.);
    vec3 whiteF  = rgb(240., 240., 240.);
    vec3 grayF   = rgb(185., 185., 185.);
    vec3 blackF  = rgb(25., 25., 25.);
    vec3 hatY    = rgb(235., 180., 35.);
    vec3 coatY   = rgb(215., 150., 20.);
    vec3 brown   = rgb(90., 55., 30.);
    vec3 shadow  = rgb(140., 140., 140.);



    float frame = inRect(P, 6, 6, 57, 57);
    float frameInner = inRect(P, 8, 8, 55, 55);
    if(frame > 0.5 && frameInner < 0.5) col = outline;

\
    float coat = inRect(P, 12, 10, 51, 22);
    if(coat > 0.5) col = coatY;


    if(inCircle(P, 16, 14, 6) > 0.5) col = coatY;
    if(inCircle(P, 47, 14, 6) > 0.5) col = coatY;


    if(inRect(P, 18, 22, 45, 23) > 0.5) col = brown;


    float face = inCircle(P, 32, 33, 16);
    if(face > 0.5) col = whiteF;


    float faceOuter = inCircle(P, 32, 33, 17);
    if(faceOuter > 0.5 && face < 0.5) col = outline;


    float earL = inCircle(P, 20, 45, 5);
    float earR = inCircle(P, 44, 45, 5);
    if(earL > 0.5 || earR > 0.5) col = blackF;


    float earLO = inCircle(P, 20, 45, 6);
    float earRO = inCircle(P, 44, 45, 6);
    if((earLO > 0.5 && earL < 0.5) || (earRO > 0.5 && earR < 0.5)) col = outline;


    if(inRect(P, 26, 33, 27, 34) > 0.5) col = blackF;
    if(inRect(P, 37, 33, 38, 34) > 0.5) col = blackF;


    if(inRect(P, 22, 28, 24, 29) > 0.5) col = mix(col, rgb(255.,170.,170.), 0.35);
    if(inRect(P, 40, 28, 42, 29) > 0.5) col = mix(col, rgb(255.,170.,170.), 0.35);


    float muzzle = inCircle(P, 32, 27, 6);
    if(muzzle > 0.5) col = grayF;

    if(inRect(P, 30, 26, 30, 26) > 0.5) col = shadow;
    if(inRect(P, 34, 26, 34, 26) > 0.5) col = shadow;


    float hat = inRect(P, 23, 48, 41, 57);
    if(hat > 0.5) col = hatY;


    float hatO = inRect(P, 22, 47, 42, 58);
    if(hatO > 0.5 && hat < 0.5) col = outline;


    if(inRect(P, 23, 48, 41, 49) > 0.5) col = brown;


    if(inRect(P, 31, 52, 33, 52) > 0.5) col = brown;
    if(inRect(P, 32, 51, 32, 54) > 0.5) col = brown;

    fragColor = vec4(col, 1.0);
}