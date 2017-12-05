metaBalls = {
	uniforms: {
		"points": { type:"v2v", value: [] },
		"rads": { type:"fv1", value: [] },
		"_Time": {value : 1.0},
	},
	vertexShader: [
		"varying vec2 vUv;",
		"void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),
	fragmentShader: [

  		"uniform vec2 points[ 52 ];",
		"uniform float rads[ 52 ];",

		"vec3 Sphere(vec2 uv, vec2 position, float radius)",
		"{",
		"float dist = radius / distance(uv, position);",
		"return vec3(dist * dist);",
		"}",

		"float line( in vec2 p, in vec2 a, in vec2 b )",
		"{",
		"	vec2 pa = -p - a;",
		"	vec2 ba = b - a;",
		"	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );",
		"	float d = length( pa - ba*h );",
		"	return clamp(((1.0 - d)-0.99)*100.0, 0.0, 1.0);",
		"}",

		"varying vec2 vUv;",
		"uniform float _Time;",

		"void main() {",
		"vec2 uv = vUv * 2.0 - 1.0;",
		"vec3 pixel = vec3(0.0, 0.0, 0.0);",

		"for (int i = 0; i < 52; i++)",
		"{",
			"pixel += Sphere(uv, points[i], rads[i]) ;",
		"}",
		
		"pixel = clamp(step(1.0, pixel) * pixel, 0.0, 1.0);",
		"pixel = 1.0 - sqrt(pixel);",

		"if(pixel.r == 0.0)",
		"pixel = vec3(0.976, 0.6, 0.129);",

		"gl_FragColor = vec4(pixel, 1.0) ;",
		
		"}"
	].join( "\n" )
};