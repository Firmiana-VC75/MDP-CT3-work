float sdBox(vec2 p, vec2 b){
    vec2 d = abs(p) - b;
    return max(d.x, d.y);
}

float fill(float d){
    return 1.0 - smoothstep(0.0, 0.002, d);
}

// diamond SDF (L1 ball)
float sdDiamond(vec2 p, float r){
    return (abs(p.x) + abs(p.y)) - r;
}

vec3 pal(int id){
    if(id==0) return vec3(0.10,0.14,0.12); // dark background
    if(id==1) return vec3(0.05,0.06,0.06); // grid / ink
    if(id==2) return vec3(0.13,0.75,0.74); // cyan
    if(id==3) return vec3(0.52,0.72,0.20); // green
    if(id==4) return vec3(0.98,0.52,0.10); // orange
    if(id==5) return vec3(0.10,0.55,0.95); // blue
    if(id==6) return vec3(0.95,0.15,0.12); // red
    if(id==7) return vec3(0.98,0.90,0.12); // yellow
    return vec3(1.0); // white
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{

    float px = 10.0;                    // try 8..14
    vec2 pc = floor(fragCoord/px)*px + px*0.5;
    vec2 uv = pc / iResolution.xy;

    float tiles = 5.0;                  // number of big repeats across screen
    vec2 T = uv * tiles;
    vec2 id = floor(T);
    vec2 f  = fract(T) - 0.5;           // local tile space [-0.5,0.5]

    vec3 col = pal(0);

    float dOuter = sdDiamond(f, 0.42);
    float dInner = sdDiamond(f, 0.30);

    float outer = clamp(fill(dOuter) - fill(dInner), 0.0, 1.0);
    col = mix(col, pal(3), outer);

    float cyanFill = fill(dInner);
    col = mix(col, pal(2), cyanFill);

    float dEye = sdDiamond(f, 0.16);
    float eye = fill(dEye);
    col = mix(col, pal(0), eye);

    float dCore = sdDiamond(f, 0.07);
    float core = fill(dCore);
    col = mix(col, pal(2), core);

    float a = abs(abs(f.x) - abs(f.y));        // 0 on diagonals
    float diag = 1.0 - smoothstep(0.00, 0.03, a);

    float ring = clamp(fill(sdDiamond(f, 0.28)) - fill(sdDiamond(f, 0.23)), 0.0, 1.0);
    float accent = diag * ring;

    float k = step(0.0, f.x*f.y); // quadrant selector
    vec3 accCol = mix(pal(7), pal(6), k);      // yellow / red
    col = mix(col, accCol, accent);

    vec2 c1 = vec2( 0.22, 0.22);
    vec2 c2 = vec2(-0.22, 0.22);
    vec2 c3 = vec2( 0.22,-0.22);
    vec2 c4 = vec2(-0.22,-0.22);
    float w =
        fill(sdDiamond(f - c1, 0.04)) +
        fill(sdDiamond(f - c2, 0.04)) +
        fill(sdDiamond(f - c3, 0.04)) +
        fill(sdDiamond(f - c4, 0.04));
    w = clamp(w, 0.0, 1.0);
    col = mix(col, pal(8), w);

    float oTop = fill(sdDiamond(f - vec2(0.0, 0.45), 0.10));
    float oBot = fill(sdDiamond(f - vec2(0.0,-0.45), 0.10));
    col = mix(col, pal(4), clamp(oTop + oBot, 0.0, 1.0));

    float bL = clamp(fill(sdDiamond(f - vec2(-0.45,0.0), 0.18)) - fill(sdDiamond(f - vec2(-0.45,0.0), 0.10)), 0.0, 1.0);
    float bR = clamp(fill(sdDiamond(f - vec2( 0.45,0.0), 0.18)) - fill(sdDiamond(f - vec2( 0.45,0.0), 0.10)), 0.0, 1.0);
    col = mix(col, pal(5), clamp(bL + bR, 0.0, 1.0));

    float bLc = fill(sdDiamond(f - vec2(-0.45,0.0), 0.06));
    float bRc = fill(sdDiamond(f - vec2( 0.45,0.0), 0.06));
    col = mix(col, pal(4), clamp(bLc + bRc, 0.0, 1.0));

    float sub = 16.0;                   
    vec2 g = fract((f + 0.5) * sub);    
    float t = 0.10;                     
    float grid = step(g.x, t) + step(1.0 - g.x, t) + step(g.y, t) + step(1.0 - g.y, t);
    grid = clamp(grid, 0.0, 1.0);
    col = mix(col, pal(1), grid * 0.85);

    fragColor = vec4(col, 1.0);
}