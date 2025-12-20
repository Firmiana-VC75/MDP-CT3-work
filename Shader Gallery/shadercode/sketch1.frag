float sdBox(vec2 p, vec2 b){
    vec2 d = abs(p) - b;
    return max(d.x, d.y);
}

float fill(float d){
    return 1.0 - smoothstep(0.0, 0.002, d);
}

// half-width (in cells) for each row from TOP (row=0) downward
int halfWidthForRow(int row){
    // tuned for N=19 (rows 0..18)
    // silhouette similar to your reference: fat top lobes, then taper to a point
    if(row==0) return 6;
    if(row==1) return 7;
    if(row==2) return 8;
    if(row==3) return 8;
    if(row==4) return 7;
    if(row==5) return 6;
    if(row==6) return 5;
    if(row==7) return 4;
    if(row==8) return 3;
    if(row==9) return 2;
    if(row==10) return 1;
    if(row==11) return 0;
    return -1; // empty
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;

    // paper-like background
    vec3 bg = vec3(0.97, 0.94, 0.90);
    vec3 col = bg;

    // ===== Grid setup =====
    float Nf  = 19.0;        // grid resolution (odd is best)
    float gap = 0.18;        // spacing between squares (bigger = more white)
    vec2 g = uv * Nf;

    vec2 idF = floor(g);
    vec2 f   = fract(g) - 0.5;

    // square with margin
    float sq = fill(sdBox(f, vec2(0.5 - gap)));

    // convert to int coords
    int N   = int(Nf);
    int ix  = int(idF.x);
    int iy  = int(idF.y);

    // center x coordinate in cell units
    int cx = ix - (N - 1)/2;
    int ax = (cx < 0) ? -cx : cx;

    // row index from TOP
    int row = iy;

    // ===== Heart logic =====
    int w = halfWidthForRow(row);

    // inside silhouette band for this row?
    float inside = 0.0;
    if(w >= 0){
        inside = (ax <= w) ? 1.0 : 0.0;
    }

    // --- carve the top notch (the "dip") like the reference ---
    // Row 0: remove center 3 cells
    if(row == 0 && ax <= 1) inside = 0.0;
    // Row 1: remove center 1 cell (deeper notch)
    if(row == 1 && ax == 0) inside = 0.0;

    // color
    vec3 red = vec3(0.86, 0.18, 0.16);

    // paint only the filled cells
    col = mix(col, red, sq * inside);

    fragColor = vec4(col, 1.0);
}