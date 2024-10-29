uniform sampler2D nextParticlesPosition;
uniform sampler2D particlesSpeed; // (u, v, w, norm)

// range (min, max)
uniform vec3 minimum; // minimum of each dimension
uniform vec3 maximum; // maximum of each dimension
uniform float altitudesOfLevel[3];

uniform float randomCoefficient; // use to improve the pseudo-random generator
uniform float dropRate; // drop rate is a chance a particle will restart at random position to avoid degeneration
uniform float dropRateBump;

in vec2 v_textureCoordinates;

out vec4 fragColor_1;

// pseudo-random generator
const vec3 randomConstants = vec3(12.9898, 78.233, 4375.85453);
const vec2 normalRange = vec2(0.0, 1.0);
float rand(vec2 seed, vec2 range) {
    vec2 randomSeed = randomCoefficient * seed;
    float temp = dot(randomConstants.xy, randomSeed);
    temp = fract(sin(temp) * (randomConstants.z + temp));
    return temp * (range.y - range.x) + range.x;
}

vec3 generateRandomParticle(vec2 seed) {
    // ensure the longitude is in [0, 360]
    //float randomLon = mod(rand(seed, vec2(minimum.x, maximum.x)), 360.0);
    float randomLon = rand(seed, vec2(minimum.x, maximum.x));
    float randomLat = rand(-seed, vec2(minimum.y, maximum.y));
    float randomAlt = altitudesOfLevel[1];//(maximum.z+minimum.z)/2.0;//rand(seed*seed, vec2(minimum.z, maximum.z));

    return vec3(randomLon, randomLat, randomAlt);
}

bool particleOutbound(vec3 particle) {
    return particle.x < minimum.x || maximum.x < particle.x ||
        particle.y < minimum.y || maximum.y < particle.y ||
        //particle.z < minimum.z || maximum.z < particle.z ||
        particle.y < -90.0 || particle.y > 90.0;
}

void main() {
    vec3 nextParticle = texture(nextParticlesPosition, v_textureCoordinates).rgb;
    vec4 nextSpeed = texture(particlesSpeed, v_textureCoordinates);
    float speedNorm = nextSpeed.a;
    float particleDropRate = dropRate + dropRateBump * speedNorm;

    vec2 seed1 = nextParticle.xy + v_textureCoordinates;
    vec2 seed2 = nextSpeed.xy + v_textureCoordinates;
    vec3 randomParticle = generateRandomParticle(seed1);
    float randomNumber = rand(seed2, normalRange);

    if (randomNumber < particleDropRate || particleOutbound(nextParticle)) {
        fragColor_1 = vec4(randomParticle, 1.0); // 1.0 means this is a random particle
    } else {
        fragColor_1 = vec4(nextParticle, 0.0);
    }
}