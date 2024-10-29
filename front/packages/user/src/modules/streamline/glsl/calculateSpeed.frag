// the size of UV textures: width = lon, height = lat
uniform sampler2D U0; // eastward wind 
uniform sampler2D V0; // northward wind
uniform sampler2D W0; // upward wind
uniform sampler2D U1; // eastward wind 
uniform sampler2D V1; // northward wind
uniform sampler2D W1; // upward wind
uniform sampler2D U2; // eastward wind 
uniform sampler2D V2; // northward wind
uniform sampler2D W2; // upward wind
uniform sampler2D currentParticlesPosition; // (lon, lat, lev)
uniform float altitudesOfLevel[3];

uniform vec3 dimension; // (lon, lat, lev)
uniform vec3 minimum; // minimum of each dimension
uniform vec3 maximum; // maximum of each dimension
uniform vec3 interval; // interval of each dimension
uniform vec3 cameraPosition;    // camera (lon, lat, lev)

// used to calculate the wind norm
uniform vec2 uSpeedRange; // (min, max);
uniform vec2 vSpeedRange;
uniform vec2 wSpeedRange;
uniform float pixelSize;
uniform float speedFactor;

float speedScaleFactor;

in vec2 v_textureCoordinates;

out vec4 fragColor_1;

vec2 mapPositionToNormalizedIndex2D(vec2 lonLat) {
    return vec2((lonLat.x - minimum.x) / (maximum.x-minimum.x), (lonLat.y - minimum.y) / (maximum.y-minimum.y));
    // ensure the range of longitude and latitude
    //lonLat.x = mod(lonLat.x, 360.0);
    //lonLat.y = clamp(lonLat.y, -90.0, 90.0);

    //vec2 index2D = vec2(0.0);
    //index2D.x = (lonLat.x - minimum.x) / interval.x;
    //index2D.y = (lonLat.y - minimum.y) / interval.y;

    //vec2 normalizedIndex2D = vec2(index2D.x / dimension.x, index2D.y / dimension.y);
    //return normalizedIndex2D;
}

float getWindComponent(sampler2D componentTexture, vec2 lonLat) {
    vec2 normalizedIndex2D = mapPositionToNormalizedIndex2D(lonLat);
    float result = texture(componentTexture, normalizedIndex2D).r;
    return result;
}

float interpolateTexture(sampler2D componentTexture, vec2 lonLat) {
    float lon = lonLat.x;
    float lat = lonLat.y;

    float lon0 = floor((lon-minimum.x) / interval.x) * interval.x + minimum.x;
    float lon1 = lon0 + 1.0 * interval.x;
    float lat0 = floor((lat-minimum.y) / interval.y) * interval.y + minimum.y;
    float lat1 = lat0 + 1.0 * interval.y;

    float lon0_lat0 = getWindComponent(componentTexture, vec2(lon0, lat0));
    float lon1_lat0 = getWindComponent(componentTexture, vec2(lon1, lat0));
    float lon0_lat1 = getWindComponent(componentTexture, vec2(lon0, lat1));
    float lon1_lat1 = getWindComponent(componentTexture, vec2(lon1, lat1));

    float lon_lat0 = mix(lon0_lat0, lon1_lat0, (lon - lon0) / interval.x);
    float lon_lat1 = mix(lon0_lat1, lon1_lat1, (lon - lon0) / interval.x);
    float lon_lat = mix(lon_lat0, lon_lat1, (lat - lat0) / interval.y);
    return lon_lat;
}

vec3 linearInterpolation0(vec2 lonLat) {
    // https://en.wikipedia.org/wiki/Bilinear_interpolation
    float u = interpolateTexture(U0, lonLat);
    float v = interpolateTexture(V0, lonLat);
    float w = interpolateTexture(W0, lonLat);
    return vec3(u, v, w);
}

vec3 linearInterpolation1(vec2 lonLat) {
    // https://en.wikipedia.org/wiki/Bilinear_interpolation
    float u = interpolateTexture(U1, lonLat);
    float v = interpolateTexture(V1, lonLat);
    float w = interpolateTexture(W1, lonLat);
    return vec3(u, v, w);
}

vec3 linearInterpolation2(vec2 lonLat) {
    // https://en.wikipedia.org/wiki/Bilinear_interpolation
    float u = interpolateTexture(U2, lonLat);
    float v = interpolateTexture(V2, lonLat);
    float w = interpolateTexture(W2, lonLat);
    return vec3(u, v, w);
}

vec2 lengthOfLonLat(vec3 lonLatLev) {
    // unit conversion: meters -> longitude latitude degrees
    // see https://en.wikipedia.org/wiki/Geographic_coordinate_system#Length_of_a_degree for detail

    // Calculate the length of a degree of latitude and longitude in meters
    float latitude = radians(lonLatLev.y);

    float term1 = 111132.92;
    float term2 = 559.82 * cos(2.0 * latitude);
    float term3 = 1.175 * cos(4.0 * latitude);
    float term4 = 0.0023 * cos(6.0 * latitude);
    float latLength = term1 - term2 + term3 - term4;

    float term5 = 111412.84 * cos(latitude);
    float term6 = 93.5 * cos(3.0 * latitude);
    float term7 = 0.118 * cos(5.0 * latitude);
    float longLength = term5 - term6 + term7;

    return vec2(longLength, latLength);
}

vec3 convertSpeedUnitToLonLat(vec3 lonLatLev, vec3 speed) {
    vec2 lonLatLength = lengthOfLonLat(lonLatLev);
    float u = speed.x / lonLatLength.x;
    float v = speed.y / lonLatLength.y;
    float w = speed.z;  // altitude itself is altitude in meter unit
    vec3 windVectorInLonLatLev = vec3(u, v, w);

    return windVectorInLonLatLev;
}

vec3 getWindComponentAt(vec3 lonLatLev) {
    // get lower wind
    vec3 lower = vec3(0.0); 
    // get upper wind
    vec3 upper = vec3(0.0);

    //
    float normalizedElevation = 0.5;

    if(lonLatLev.z > altitudesOfLevel[1])   // lonLatLev is above middle level
    {
        // get lower wind
        lower = linearInterpolation1(lonLatLev.xy);
        // get upper wind
        upper = linearInterpolation2(lonLatLev.xy);
        
        normalizedElevation = (lonLatLev.z-altitudesOfLevel[1])/(altitudesOfLevel[2] - altitudesOfLevel[1]);
    }
    else    // lonLatLev is below middle level
    {
        // get lower wind
        lower = linearInterpolation0(lonLatLev.xy);
        // get upper wind
        upper = linearInterpolation1(lonLatLev.xy);
        
        normalizedElevation = (lonLatLev.z-altitudesOfLevel[0])/(altitudesOfLevel[1] - altitudesOfLevel[0]);
    }

    // interpolate altitude
    vec3 wind = mix(lower, upper, normalizedElevation);

    return wind;
}

float calculateWindNorm(vec3 speed) {

    //vec3 minSpeed = vec3(uSpeedRange.x, vSpeedRange.x, wSpeedRange.x);
    //vec3 maxSpeed = vec3(uSpeedRange.y, vSpeedRange.y, wSpeedRange.y);
    float minSpeed = 0.0;//length(minSpeed)
    float maxSpeed = length(vec3(max(abs(uSpeedRange.x),abs(uSpeedRange.y)), max(abs(vSpeedRange.x),abs(vSpeedRange.y)), max(abs(wSpeedRange.x),abs(wSpeedRange.y))));

    return length(speed) / (maxSpeed-minSpeed);

    // 아래는 잘못 구해진 것. valueRange의 최소최대값은 음수를 포함하기 때문에 원점으로부터의 거리의 minmax를 구해서 정규화 해야 함
    vec3 percent = vec3(0.0);
    percent.x = (speed.x - uSpeedRange.x) / (uSpeedRange.y - uSpeedRange.x);
    percent.y = (speed.y - vSpeedRange.x) / (vSpeedRange.y - vSpeedRange.x);
    percent.z = (speed.z - wSpeedRange.x) / (wSpeedRange.y - wSpeedRange.x);
    
    if((uSpeedRange.y - uSpeedRange.x) == 0.0)
        percent.x = 0.0;
    if((vSpeedRange.y - vSpeedRange.x) == 0.0)
        percent.y = 0.0;
    if((wSpeedRange.y - wSpeedRange.x) == 0.0)
        percent.z = 0.0;

    float norm = length(percent);

    return norm;
}

void main() {
    speedScaleFactor = speedFactor * pow(pixelSize, 0.9);
    // texture coordinate must be normalized
    vec3 lonLatLev = texture(currentParticlesPosition, v_textureCoordinates).rgb;
    vec3 speed = getWindComponentAt(lonLatLev);
    vec3 speedInLonLat = convertSpeedUnitToLonLat(lonLatLev, speed * speedScaleFactor);

    vec4 particleSpeed = vec4(speedInLonLat, calculateWindNorm(speed));
    fragColor_1 = particleSpeed;
    // fragColor_1 = vec4(0.0, 1.0, 0.0, 0.0);
}