#define PI 3.141592653589

float sdCircle(vec2 p, float r){ return length(p) - r; }

float sdBox(vec2 p, vec2 b){
    vec2 d = abs(p) - b;
    return max(d.x, d.y);
}

float sdRoundBox(vec2 p, vec2 b, float r){
    vec2 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,q.y),0.0) - r;
}

float fill(float d){
    // Anti-aliasing still ok; pixelation already provides the "steppy" look.
    return 1.0 - smoothstep(0.0, 0.002, d);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    float px = 16.0; // 14..18 (bigger = chunkier pixels like the reference)
    vec2 pc = floor(fragCoord / px) * px + 0.5*px;
    vec2 uv = pc / iResolution.xy;

    vec3 col = vec3(0.98);

    vec2 p = uv*2.0 - 1.0;
    p.x *= iResolution.x / iResolution.y;

    p -= vec2(0.0, -0.02);
    p *= 1.05;

    vec3 ink   = vec3(0.06, 0.06, 0.07); // outline / black
    vec3 dk    = vec3(0.12, 0.13, 0.15); // body dark
    vec3 mid   = vec3(0.22, 0.23, 0.26); // body mid
    vec3 belly = vec3(0.93, 0.94, 0.96); // belly light
    vec3 belly2= vec3(0.84, 0.86, 0.90); // belly shade
    vec3 bandC = vec3(0.22, 0.22, 0.24); // hat band
    vec3 gold1 = vec3(0.95, 0.78, 0.28); // beak highlight
    vec3 gold2 = vec3(0.65, 0.46, 0.15); // beak shadow

    float dBodyTop = sdRoundBox(p - vec2(0.0, 0.38), vec2(0.48, 0.34), 0.18);
    float dBodyMid = sdRoundBox(p - vec2(0.0, 0.05), vec2(0.62, 0.40), 0.20);
    float dBodyBot = sdRoundBox(p - vec2(0.0,-0.38), vec2(0.74, 0.30), 0.18);
    float dBody    = min(dBodyTop, min(dBodyMid, dBodyBot));
    float mBody    = fill(dBody);

    float dAL_h = sdBox(p - vec2(-0.98, 0.00), vec2(0.26, 0.17));
    float dAL_v = sdBox(p - vec2(-0.72,-0.12), vec2(0.18, 0.30));
    float mArmL = fill(min(dAL_h, dAL_v)) * mBody;

    float dAR_h = sdBox(p - vec2( 0.98, 0.00), vec2(0.26, 0.17));
    float dAR_v = sdBox(p - vec2( 0.72,-0.12), vec2(0.18, 0.30));
    float mArmR = fill(min(dAR_h, dAR_v)) * mBody;

    float mArms = clamp(mArmL + mArmR, 0.0, 1.0);

    float dBelly = sdRoundBox(p - vec2(0.0,-0.18), vec2(0.44, 0.46), 0.18);
    float mBelly = fill(dBelly) * mBody;

    float dBrim  = sdBox(p - vec2(0.0, 0.92), vec2(0.82, 0.06));

    float dCrown = sdBox(p - vec2(0.0, 1.10), vec2(0.36, 0.24));

    float dBand  = sdBox(p - vec2(0.0, 1.05), vec2(0.36, 0.045));

    float mHat   = fill(min(dBrim, dCrown));
    mHat *= fill(sdRoundBox(p - vec2(0.0, 0.45), vec2(0.78, 0.70), 0.25));

    float mBand  = fill(dBand) * mHat;

    float dG1 = sdBox(p - vec2(-0.23, 0.55), vec2(0.22, 0.085));
    float dG2 = sdBox(p - vec2( 0.23, 0.55), vec2(0.22, 0.085));
    float dGb = sdBox(p - vec2(0.00, 0.55), vec2(0.07, 0.02));
    float mGlass = fill(min(min(dG1, dG2), dGb)) * mBody;

    float h1 = fill(sdBox(p - vec2(-0.33, 0.585), vec2(0.020, 0.030))) * mGlass;
    float h2 = fill(sdBox(p - vec2( 0.12, 0.585), vec2(0.020, 0.030))) * mGlass;

    float dBeak = sdRoundBox(p - vec2(0.0, 0.37), vec2(0.22, 0.10), 0.03);
    float mBeak = fill(dBeak) * mBody;


    float dTieStem = sdBox(p - vec2(0.0, 0.02), vec2(0.045, 0.38));
    float dTieKnot = sdCircle(p - vec2(0.0, 0.25), 0.06);
    float mTie = fill(min(dTieStem, dTieKnot)) * mBelly;


    float dAll = min(dBody, min(dBrim, dCrown));
    float mAll = fill(dAll);

    float o = 0.035;
    float outline = step(0.0, dAll + o) - step(0.0, dAll);
    outline = clamp(outline, 0.0, 1.0);

    float bodyStep = step(0.10, p.y);
    vec3 bodyCol = mix(dk, mid, bodyStep);

    float bellyStep = step(-0.10, p.y);
    vec3 bellyCol = mix(belly2, belly, bellyStep);

    float beakStep = step(0.38, p.y);
    vec3 beakCol = mix(gold2, gold1, beakStep);

    col = mix(col, bodyCol, mBody);
    col = mix(col, ink,     mArms);
    col = mix(col, bellyCol,mBelly);

    col = mix(col, ink,     mHat);
    col = mix(col, bandC,   mBand);

    col = mix(col, ink,     mGlass);
    col = mix(col, vec3(1.0), h1);
    col = mix(col, vec3(1.0), h2);

    col = mix(col, beakCol, mBeak);
    col = mix(col, ink,     mTie);

    col = mix(col, ink,     outline);

    fragColor = vec4(col, 1.0);
}