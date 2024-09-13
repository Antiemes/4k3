#version 120

uniform float t;
#define PI 3.1415926538

float sdCircle(vec2 p, float r)
{
    return length(p) - r;
}

float sdEquilateralTriangle(in vec2 p, in float r)
{
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}

vec4 map(in vec2 uv, float ttt)
{
    vec2 o;
    
    float tpos = mod(ttt, 3.);
    float r;
    if (tpos<.5)
    {
        r = 1.;
        o = vec2(0., 0.);
    }
    else if (tpos<1.5)
    {
        r = .6;
        o = vec2(0., 0.);
    }
    else if (tpos<2.3)
    {
        r = .7;
        o = vec2(0., 0.);
    }
    else
    {
        r = 2.1;
        o = vec2(-1., -.5);
    }
    
    vec3 d;
    if (tpos > 1.)
    {
        d.x = sin(uv.x*1.02+uv.y*.71+1.2+ttt*2.7)*sin(uv.x*.67+uv.y*.812+4.*sin(uv.x*.31+uv.y*.79));
    }
    else
    {
        d.x = smoothstep(-.1, .1, length(uv-o)-r);
    }
    d.x = -sdEquilateralTriangle(uv, 1.);
    if (tpos < 1.)
    {
        d.x = smoothstep(-.1, .1, sdEquilateralTriangle(uv, 1.));
    }
    else
    {
        d.x = smoothstep(-.1, .1, sdCircle(uv, 1.));
    }

    if (sin(tpos*10.)>.5)
    {
        d.x = sin(uv.x*1.02+uv.y*.71+1.2+ttt*2.7)*sin(uv.x*.67+uv.y*.812+4.*sin(uv.x*.31+uv.y*.79));
    }

    //d.x = sdCircle(uv, 1.);
    
    float alpha = 1.;
    d.y = cos(dot(uv*10., vec2(cos(alpha), sin(alpha))));
    
    
    return vec4(d.xxx, 1.);
}

void main()
{
    vec2 iResolution = vec2(1920., 1080.);
    
    vec2 tx = gl_FragCoord.xy / iResolution.y;
    vec2 uv = vec2(-iResolution.x/iResolution.y, -1.) + 2.0 * tx;
        
    float corr = 10.;
    for (int i=1; i<5 ; i++)
    {
        corr -= PI/float(i)*sin(float(i)*PI*t/4.);
    }
    if (t<16.)
    {
    }
    else if (t < 32.)
    {
        corr *= 2.;
    }
    else
    {
        corr *= 16.;
    }

    vec2 p = uv*vec2(corr);

    vec2 pp;
    vec2 pos;


    pos.x = floor(p.x);
    pos.y = floor(p.y);
    pp.x = p.x-floor(p.x)-.5;
    pp.y = p.y-floor(p.y)-.5;
    vec4 c = map(pos/corr, t);
    //vec4 c = vec4(.5);

    vec2 rot=vec2(cos(c.x*PI/2.+t), -sin(c.x*PI/2.+t*2.));
    //rot = vec2(1., 0.);

    float z=smoothstep(.45, .4, length(pp))*cos(PI*2.*dot(pp, rot));
    //z = cos(M_PI*2.*dot(pp, rot));
    //z = abs(pp.x);
    //z = abs(sin(pp.x*2.));
    float r=smoothstep(.95, 1.,z); 
    float g=smoothstep(.9, 1.,z); 
    float b=smoothstep(.6, 1.,z); 

    gl_FragColor = vec4(r,g,b,1.);
}
