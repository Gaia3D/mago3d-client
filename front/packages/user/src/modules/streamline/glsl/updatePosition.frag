uniform sampler2D currentParticlesPosition; // (lon, lat, lev)
uniform sampler2D particlesSpeed; // (u, v, w, norm) Unit converted to degrees of longitude and latitude 

in vec2 v_textureCoordinates;

out vec4 fragColor_1;

void main() {
    // texture coordinate must be normalized
    vec3 lonLatLev = texture(currentParticlesPosition, v_textureCoordinates).rgb;
    vec3 speed = texture(particlesSpeed, v_textureCoordinates).rgb;
    vec3 nextParticle = lonLatLev + speed;

    fragColor_1 = vec4(nextParticle, 0.0);
}