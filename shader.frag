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

vec2 scrot(vec2 uv, float sc, float rot)
{
    float s = sin(rot);
    float c = cos(rot);
    return uv*mat2(c,s,-s,c)*sc;
}

vec4 map(in vec2 uv, float ttt, int eff)
{
    vec2 o;
    
    float tpos = mod(ttt, 3.);
    float r;
    vec3 d;

    if (eff == 1)
    {
        if (tpos > 1.)
        {
            d.x = sin(uv.x*1.02+uv.y*.71+1.2+ttt*2.7)*sin(uv.x*.67+uv.y*.812+4.*sin(uv.x*.31+uv.y*.79));
        }
        else
        {
            d.x = smoothstep(-.1, .1, length(uv-o)-r);
        }
    }
    else if (eff == 2)
    {
        d.x = -sdEquilateralTriangle(uv+vec2(.0, .25), 1.);
    }
    else if (eff == 3)
    {
        if (tpos < 1.)
        {
            d.x = smoothstep(-.1, .1, sdEquilateralTriangle(uv+vec2(.0,.25), 1.));
        }
        else
        {
            d.x = smoothstep(-.1, .1, sdCircle(uv, 1.));
        }
        if (sin(tpos*10.)>.5)
        {
            d.x = sin(uv.x*1.02+uv.y*.71+1.2+ttt*2.7)*sin(uv.x*.67+uv.y*.812+4.*sin(uv.x*.31+uv.y*.79));
        }
    }
    else if (eff == 4)
    {
        float alpha = 2. + sin(ttt*.1);
        d.x = cos(dot(uv*10., vec2(cos(alpha), sin(alpha))));
    }
    else if (eff == 5)
    {
        d.x = sin(uv.x*3.22+uv.y*1.71+uv.x*2.7*sin(1.7+8.3*uv.x)+uv.y*3.1*sin(7.-4.1*uv.x*ttt*.3)-1.2+ttt*2.7)*sin(ttt*2.3+uv.x*1.67*ttt-uv.y*2.52-ttt*1.83+2.*sin(uv.x*.41+uv.y*.22-ttt*.4));
    }
    else if (eff == 6)
    {
        d.x = smoothstep(-.7, .7, sdCircle(uv+vec2(.7, 1.2), 2.) * sdCircle(uv-vec2(.7, 1.2), 2.) * sdCircle(uv+vec2(.7, 1.2), 1.5));
    }
    else if (eff == 7)
    {
        float q =   sdEquilateralTriangle(scrot(uv+vec2(.2, -.4), .7, sin(    ttt*.6 -cos(ttt*1.4))*3.5), smoothstep(-.6, .7, sin(ttt+7.1)));
        q = min (q, sdEquilateralTriangle(scrot(uv+vec2(.5,  .5), 1., sin(    ttt +sin(ttt*1.2))*2.8), smoothstep(-.6, .7, sin(ttt+3.7))));
        q = min (q, sdEquilateralTriangle(scrot(uv+vec2(-.6, .1), .8, sin(2.5+ttt*.75+cos(ttt*1.2))*4.1), smoothstep(-.6, .7, sin(ttt-3.2))));
        q = min (q, sdEquilateralTriangle(scrot(uv+vec2(-.2, .3), .5, sin(1.8-ttt*.66+cos(ttt*2.2))*3.1), smoothstep(.6, .7, sin(ttt-2.7))));
        d.x = smoothstep(-.1, .1, q);
    }

    //d.x = smoothstep(-.1, .1, scrot(uv, .1, ttt).x);

    //d.x = sdCircle(uv, 1.);    
    
    return vec4(d.xxx, 1.);
}

float slide(float x0, float x1, float y0, float y1, float t)
{
    return mix(y0, y1, pow(sin((t-x0)/(x1-x0)*PI/2.), 3.));
}

void main()
{
    vec2 iResolution = vec2(1920., 1080.);
    
    vec2 tx = gl_FragCoord.xy / iResolution.y;
    vec2 uv = vec2(-iResolution.x/iResolution.y, -1.) + 2.0 * tx;

    const float hs[7] = float[7](5., 10., 24., 30., 50., 16., 70.);

    float corr = 10.;
    int eff = 0;
    if (t<16.)
    {
        corr = slide(0., 16., hs[0], hs[1], t);
        eff = 2;
    }
    else if (t<32.)
    {
        corr = slide(16., 32., hs[1], hs[2], t);
        eff = 3;
    }
    else if (t < 48.)
    {
        corr = hs[2];
        eff = 4;
    }
    else if (t < 64.)
    {
        eff = 1;
        corr = hs[2];
    }
    else if (t < 70.)
    {
        corr = slide(64., 70., hs[2], hs[3], t);
        eff = 1;
    }
    else if (t < 128.)
    {
        corr = slide(70., 128., hs[3], hs[4], t);
        eff = 5;
    }
    else if (t < 144.)
    {
        corr = slide(128., 144., hs[4], hs[5], t);
        eff = 6;
    }
    else if (t < 160.)
    {
        corr = slide(144., 160., hs[5], hs[6], t);
        eff = 7;
    }
    else
    {
        corr = 100.;
        eff = 5;
    }

    vec2 p = uv*vec2(corr);

    vec2 pp;
    vec2 pos;


    p += vec2(.5);
    pos = floor(p);
    //pos.y = floor(p.y);
    pp.x = p.x-floor(p.x)-.5;
    pp.y = p.y-floor(p.y)-.5;
    vec4 c = map(pos/corr, t, eff);
    //vec4 c = vec4(.5);

    vec2 rot=vec2(cos(c.x*PI/2.+t), -sin(c.x*PI/2.+t*2.+.7));
    //rot = vec2(1., 0.);

    float z=smoothstep(.45, .4, length(pp))*cos(PI*2.*dot(pp, rot));
    //z = cos(M_PI*2.*dot(pp, rot));
    //z = abs(pp.x);
    //z = abs(sin(pp.x*2.));
    float r=smoothstep(.7, 1.,z); 
    float g=smoothstep(.9, 1.,z); 
    float b=smoothstep(.3, 1.,z); 

    gl_FragColor = vec4(r,g,b,1.);
}
