uniform sampler2D segmentsColorTexture;
uniform sampler2D segmentsDepthTexture;

uniform sampler2D currentTrailsColor;
uniform sampler2D trailsDepthTexture;

uniform float fadeOpacity;

in vec2 textureCoordinate;

out vec4 fragColor_1;

void main() {
    vec4 pointsColor = texture(segmentsColorTexture, textureCoordinate);
    vec4 trailsColor = texture(currentTrailsColor, textureCoordinate);

    trailsColor = floor(fadeOpacity * 255.0 * trailsColor) / 255.0; // make sure the trailsColor will be strictly decreased

    float pointsDepth = texture(segmentsDepthTexture, textureCoordinate).r;
    float trailsDepth = texture(trailsDepthTexture, textureCoordinate).r;
    float globeDepth = czm_unpackDepth(texture(czm_globeDepthTexture, textureCoordinate));

    fragColor_1 = vec4(0.0);
    if (pointsDepth < globeDepth || globeDepth == 0.0) {
        fragColor_1 = fragColor_1 + pointsColor;
    }
    if (trailsDepth < globeDepth || globeDepth == 0.0) {
        fragColor_1 = fragColor_1 + trailsColor;
    }
    // gl_FragDepthEXT = min(pointsDepth, trailsDepth);
    gl_FragDepth = min(pointsDepth, trailsDepth);
}