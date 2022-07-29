uniform vec2 u_resolution;
uniform float u_rotation;
uniform float u_skew;
uniform float u_time;

uniform vec3 u_color;

#define iterations 25
#define PI 3.14159265

mat2 rotate2d(float angle){
    return mat2(cos(angle), sin(angle),
                -sin(angle), cos(angle));
}

void main() {
    vec2 st = (gl_FragCoord.xy - u_resolution.xy*0.5)/u_resolution.y; // make st go from -0.5 to 0.5 instead of 0 to 1920
	
	float skewmult = (1.0 / (u_skew + 1.0));
    
    float s = sin(u_rotation);
    float c = cos(u_rotation);
    mat2 rot = mat2(c, s / skewmult, -s, c / skewmult); // rotate and scale the coordinates with the level
    st = st * rot;
	
	vec3 color2 = u_color * 0.5;
	
	float color = 0.0;
    
    for (int i = 0; i < iterations; i++) {
        color += smoothstep(-0.0023, 0.00, st.x) - smoothstep(0.00, 0.0023, st.x);
        color += smoothstep(-0.0023, 0.00, st.y) - smoothstep(0.00, 0.0023, st.y);
        st = st * rotate2d(PI / float(iterations));
    }
	
    color = clamp(color, 0.0, 0.6);
	
	gl_FragColor = vec4(mix(u_color, color2, color), 1.0); // mix the 2 colors based on the stripes
}