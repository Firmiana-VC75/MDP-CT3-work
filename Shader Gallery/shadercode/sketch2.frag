float hash21(vec2 p){
    return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453123);
}

vec3 sat(vec3 c){
    return clamp(c, 0.0, 1.0);
}

vec3 rgb2lin(vec3 c){ return c*c; }
vec3 lin2rgb(vec3 c){ return sqrt(max(c, 0.0)); }

// Gentle warp to imitate imperfect printing registration
vec2 W(vec2 p){
    p = (p + 1.7) * 2.2;
    float t = iTime * 0.25;
    for(int i=0;i<2;i++){
        p += cos(p.yx*1.8 + vec2(t, 1.57))/5.0;
        p += sin(p.yx*1.1 + t)/6.0;
        p *= 1.12;
    }
    return p;
}

// luminance
float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }

// posterize
float poster(float x, float steps){
    return floor(x * steps) / steps;
}

// simple edge accent from image (cheap)
float edgeMeasure(vec2 uv, vec2 px){
    vec3 c  = rgb2lin(texture(iChannel0, uv).rgb);
    vec3 cx = rgb2lin(texture(iChannel0, uv + vec2(px.x,0)).rgb);
    vec3 cy = rgb2lin(texture(iChannel0, uv + vec2(0,px.y)).rgb);
    float e = abs(luma(cx)-luma(c)) + abs(luma(cy)-luma(c));
    return clamp(e*6.0, 0.0, 1.0);
}

// palette per panel (pop-art)
vec3 palette(int pid, float t){
    // t in [0,1] mapped from posterized luma
    // Four different “screen ink” looks
    if(pid==0) return mix(vec3(0.95,0.85,0.10), vec3(0.85,0.10,0.70), t); // yellow -> magenta
    if(pid==1) return mix(vec3(0.10,0.85,0.75), vec3(0.95,0.20,0.10), t); // cyan -> red
    if(pid==2) return mix(vec3(0.15,0.25,0.95), vec3(0.95,0.90,0.15), t); // blue -> yellow
    return      mix(vec3(0.10,0.95,0.20), vec3(0.90,0.10,0.20), t);        // green -> pinkish red
}

// halftone dots
float halftone(vec2 uv, float freq, float v){
    // uv in 0..1 within a panel
    vec2 p = uv*freq;
    vec2 f = fract(p) - 0.5;
    float d = length(f);
    // dot radius controlled by tone v (darker = bigger dot)
    float r = mix(0.08, 0.45, 1.0 - v);
    // soft edge
    return 1.0 - smoothstep(r, r+0.06, d);
}

// main pop-art stylizer (returns albedo and a bump value)
vec4 popArt(vec2 uvPanel, int pid, vec2 px){
    // Slight misregistration per channel
    float seed = float(pid)*31.7;
    vec2 jitter = (hash21(vec2(seed, 2.0)) - 0.5) * 0.002 * vec2(1.0, 1.0);
    vec2 warp = W(uvPanel - 0.5) * 0.012;

    vec2 uvr = uvPanel + warp + jitter;
    vec2 uvg = uvPanel + warp - jitter*0.7;
    vec2 uvb = uvPanel + warp + jitter*0.4;

    vec3 cr = rgb2lin(texture(iChannel0, uvr).rgb);
    vec3 cg = rgb2lin(texture(iChannel0, uvg).rgb);
    vec3 cb = rgb2lin(texture(iChannel0, uvb).rgb);
    vec3 c  = vec3(cr.r, cg.g, cb.b);

    float lum = luma(c);

    // Strong contrast + posterize
    lum = pow(clamp(lum,0.0,1.0), 0.85);
    float steps = 5.0; // fewer steps = more screenprint look
    float pl = poster(lum, steps);

    // Halftone overlay
    float ht = halftone(uvPanel, 120.0, pl);
    float ink = mix(pl, pl*0.65 + ht*0.35, 0.75);

    // Edge accent for “ink boundaries”
    float e = edgeMeasure(uvPanel, px);
    ink = clamp(ink - e*0.12, 0.0, 1.0);

    // panel palette
    vec3 col = palette(pid, ink);

    // bright background paper
    vec3 paper = vec3(0.97, 0.96, 0.94);
    // blend paper into highlights
    col = mix(col, paper, smoothstep(0.78, 1.0, ink));

    // bump: emphasize edges + halftone texture
    float bump = clamp(e*0.8 + ht*0.15, 0.0, 1.0);

    return vec4(col, bump);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    // ---- Reference-style plane setup ----
    vec2 uv = (fragCoord - iResolution.xy*0.5)/iResolution.y;

    vec3 sp = vec3(uv, 0.0);
    vec3 rd = normalize(vec3(uv, 1.0));
    vec3 lp = vec3(cos(iTime)*0.55, sin(iTime)*0.22, -1.0);
    vec3 sn = vec3(0.0, 0.0, -1.0);

    // Map plane to 0..1
    vec2 uv01 = sp.xy*0.85 + 0.5;

    // Make 2x2 panels
    vec2 panelUV = uv01 * 2.0;
    vec2 pid2 = floor(panelUV);
    vec2 inPanel = fract(panelUV);

    // clamp outside
    if(uv01.x<0.0||uv01.x>1.0||uv01.y<0.0||uv01.y>1.0){
        fragColor = vec4(0.0);
        return;
    }

    int pid = int(pid2.x) + int(pid2.y)*2; // 0..3

    // Pixel size for sampling
    vec2 px = vec2(1.0/iResolution.x, 1.0/iResolution.y);

    // ---- Color + bump source ----
    vec4 pa = popArt(inPanel, pid, px);
    vec3 albedo = pa.rgb;
    float f = pa.a;

    // ---- Bump mapping (finite differences) ----
    vec2 eps = vec2(4.0/iResolution.y, 0.0);
    float fx = popArt(fract((uv01*2.0 - vec2(eps.x,0.0))*0.5*2.0), pid, px).a; // cheap-ish reuse
    float fy = popArt(fract((uv01*2.0 - vec2(0.0,eps.x))*0.5*2.0), pid, px).a;

    fx = (fx - f)/eps.x;
    fy = (fy - f)/eps.x;

    const float bumpFactor = 0.06;
    sn = normalize(sn + vec3(fx, fy, 0.0)*bumpFactor);

    // ---- Lighting (soft gallery light) ----
    vec3 ld = lp - sp;
    float lDist = max(length(ld), 0.0001);
    ld /= lDist;

    float atten = 1.0/(1.0 + lDist*lDist*0.18);
    atten *= f*0.65 + 0.35;

    float diff = max(dot(sn, ld), 0.0);
    diff = pow(diff, 2.6)*0.7 + pow(diff, 8.0)*0.3;

    float spec = pow(max(dot(reflect(-ld, sn), -rd), 0.0), 28.0);

    // panel separators (thin cream gutters)
    float g = 0.012;
    float gutter = step(inPanel.x, g) + step(inPanel.y, g) + step(1.0-g, inPanel.x) + step(1.0-g, inPanel.y);
    gutter = clamp(gutter, 0.0, 1.0);
    vec3 gutterCol = vec3(0.98,0.97,0.93);
    albedo = mix(albedo, gutterCol, gutter);

    vec3 col = (albedo*(diff*1.25 + 0.40) + vec3(1.0)*spec*0.12) * atten;

    fragColor = vec4(lin2rgb(sat(col)), 1.0);
}