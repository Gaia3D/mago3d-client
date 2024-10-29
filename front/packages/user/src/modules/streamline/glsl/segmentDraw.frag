
out vec4 fragColor_1;

in vec2 textureCoordinate;

uniform sampler2D previousParticlesPosition;
uniform sampler2D currentParticlesPosition;
uniform sampler2D postProcessingPosition;
uniform vec3 minimum; // minimum of each dimension
uniform vec3 maximum; // maximum of each dimension
uniform float verticalScale;

uniform sampler2D particlesSpeed; // (u, v, w, norm) Unit converted to degrees of longitude and latitude 
uniform vec2 uSpeedRange; // (min, max);
uniform vec2 vSpeedRange;
uniform vec2 wSpeedRange;

float rRange[2] = float[2] (log(1000.0), log(20000.0));
float gRange[2] = float[2] (log(1.0), log(1000.0));
float bRange[2] = float[2] (log(10000.0), log(30000.0));

void main() {

    vec3 previousPosition = texture(previousParticlesPosition, textureCoordinate).rgb;
    vec3 currentPosition = texture(currentParticlesPosition, textureCoordinate).rgb;
    vec3 nextPosition = texture(postProcessingPosition, textureCoordinate).rgb;

    vec4 speed = texture(particlesSpeed, textureCoordinate).rgba;

    float altitude = nextPosition.z;

    float r = (log(altitude / verticalScale)-rRange[0]) / (rRange[1]-rRange[0]);
    float g = (log(altitude / verticalScale)-gRange[0]) / (gRange[1]-gRange[0]);
    float b = (log(altitude / verticalScale)-bRange[0]) / (bRange[1]-bRange[0]);
    float rate = speed.a;

    vec4 white = vec4(1.0, 1.0, 1.0, 1.0);//pow(rate, 1.0));
    //vec4 white = vec4(1.0);
    fragColor_1 = white;
}