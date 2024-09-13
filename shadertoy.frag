#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.141592653589

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
        
    d.x = smoothstep(-.1, .1, length(uv-o)-r);
    
    float alpha = 1.;
    d.y = cos(dot(uv*10., vec2(cos(alpha), sin(alpha))));
    d.z = sin(uv.x*1.02+uv.y*.71+1.2+ttt*2.7)*sin(uv.x*.67+uv.y*.812+4.*sin(uv.x*.31+uv.y*.79));
    
    
    return vec4(d.zzz, 1.);
}


void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 tx = fragCoord.xy / iResolution.y;
    vec2 uv = vec2(-iResolution.x/iResolution.y, -1.) + 2.0 * tx;
        

    //vec2 corr = sin(iTime*98945.2456)*100.*vec2(1,iResolution.y/iResolution.x);
    vec2 corr = vec2(iTime); // *vec2(1,iResolution.y/iResolution.x);
    vec2 p = uv*corr;

    vec2 pp;
    vec2 pos;


	pp.x = modf(p.x, pos.x)-.5;
    pp.y = modf(p.y, pos.y)-.5;
    pp.x = p.x-floor(p.x)-.5;
    pp.y = p.y-floor(p.y)-.5;
    vec4 c = map(pos/corr, iTime);

    vec2 rot=vec2(cos(c.x*M_PI/2.+iTime), -sin(c.x*M_PI/2.+iTime*2.));
    //rot = vec2(1., 0.);

    float z=smoothstep(.45, .4, length(pp))*cos(M_PI*2.*dot(pp, rot));
    //z = cos(M_PI*2.*dot(pp, rot));
    //z = abs(pp.x);
    //z = abs(sin(pp.x*2.));
    float r=smoothstep(.95, 1.,z); 
    float g=smoothstep(.9, 1.,z); 
    float b=smoothstep(.6, 1.,z); 

    fragColor = vec4(r,g,b,1.);
}
