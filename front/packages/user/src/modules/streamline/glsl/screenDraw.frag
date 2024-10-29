uniform sampler2D trailsColorTexture;
uniform sampler2D trailsDepthTexture;

in vec2 textureCoordinate;

out vec4 fragColor_1;

void main() {
    vec4 trailsColor = texture(trailsColorTexture, textureCoordinate);
    fragColor_1 = trailsColor;
}