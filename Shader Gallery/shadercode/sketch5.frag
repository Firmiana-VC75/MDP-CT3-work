#define PI 3.141592653589


float hash21(vec2 p){
    return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
}

vec2 pixelize(vec2 uv, vec2 res){
    return floor(uv * res) / res;
}


void mainImage(out vec4 fragColor, in vec2 fragCoord)
{

    vec2 pixelRes = vec2(240.0, 135.0); // 16:9 pixel grid
    
    vec2 uv = fragCoord / iResolution.xy;
    vec2 puv = pixelize(uv, pixelRes);


    vec2 p = puv * 2.0 - 1.0;
    p.x *= iResolution.x / iResolution.y;


    vec3 skyTop    = vec3(0.15, 0.05, 0.25); // deep purple
    vec3 skyBottom = vec3(0.02, 0.01, 0.05); // near black
    float skyGrad = smoothstep(-0.2, 1.0, p.y);
    vec3 color = mix(skyBottom, skyTop, skyGrad);


    color += 0.08 * vec3(0.8, 0.2, 1.0) * exp(-p.y * p.y * 2.0);


    float city = 0.0;


    float colId = floor((puv.x) * pixelRes.x);
    float colRand = hash21(vec2(colId, 12.3));


    float height = -0.2 - colRand * 0.9;

    if(p.y < height){
        city = 1.0;
    }


    vec3 buildingCol = vec3(0.03, 0.04, 0.06);
    color = mix(color, buildingCol, city);


    if(city > 0.5){

        float wx = mod(puv.x * pixelRes.x, 4.0);
        float wy = mod(puv.y * pixelRes.y, 4.0);

        float windowMask = step(1.0, wx) * step(1.0, wy);
        float lightChance = hash21(floor(puv * pixelRes / 4.0));

        float windowOn = step(0.65, lightChance) * windowMask;


        vec3 neonA = vec3(0.2, 0.9, 1.0); // cyan
        vec3 neonB = vec3(1.0, 0.2, 0.8); // magenta
        vec3 neon = mix(neonA, neonB, hash21(vec2(colId, wy)));

        color = mix(color, neon, windowOn);
    }

    float scan = sin(puv.y * pixelRes.y * PI);
    color *= 0.95 + 0.05 * scan;

    fragColor = vec4(color, 1.0);
}