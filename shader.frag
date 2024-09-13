#version 120

uniform float t;
#define PI 3.1415926538

void main()
{
    vec2 iResolution = vec2(1920., 1080.);
    
    vec2 tx = gl_FragCoord.xy / iResolution.y;
    vec2 uv = vec2(-iResolution.x/iResolution.y, -1.) + 2.0 * tx;
        
    //vec2 corr = sin(iTime*98945.2456)*100.*vec2(1,iResolution.y/iResolution.x);
    vec2 corr = vec2(t); // *vec2(1,iResolution.y/iResolution.x);
    vec2 p = uv*corr;

    vec2 pp;
    vec2 pos;


	pp.x = modf(p.x, pos.x)-.5;
    pp.y = modf(p.y, pos.y)-.5;
    pp.x = p.x-floor(p.x)-.5;
    pp.y = p.y-floor(p.y)-.5;
    //vec4 c = map(pos/corr, iTime);
    vec4 c = vec4(.5);

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

//void main()
//{
//    vec2 iResolution = vec2(1920., 1080.);
//	  vec2 uv = (gl_FragCoord.xy - iResolution.xy / 2.) / iResolution.y;
//    uv *= 1.9;
//    //vec2 uv = (fragCoord*2.0-iResolution.xy)/iResolution.y;
//    float d=0.;
//    //int ww=int(fract(t/(8.*12.)+1./12.)*12.);
//    int ww=int(t/8.);
//    const float hs[5] = float[5](0., .4, .7, .23, 0.);
//
//    float ss = fract(t/8.)*4.-2.;
//
//    float beat = 1.-smoothstep(.0, .3, fract(t));
//    float hh = 1.-smoothstep(.0, .45, fract(t*2.-.35));
//
//    float cmul = 1.0;
//    float kmul = 1.0;
//    float rc = 0.;
//    int w = 0;
//    if (t<4.)
//    {
//      cmul = hh;
//      kmul = 0.;
//    }
//    else if (t<8.)
//    {
//      cmul = smoothstep(0., 1., hh + (t-12.)/4.);
//      cmul = beat;
//      ss = 0.;
//      w = int(t - 4.);
//    }
//    else
//    {
//      rc = 1.-cos(fract(t/8.)*2.-1.);
//      if (ww/2 == (ww-1)/2)  // 3/2 == 1,  2/2 == 1
//      {
//        w=12;
//      }
//      else
//      {
//        w=ww/2+2;
//      }
//      if (t > 152.)
//      {
//        w=2;
//        ss/=(t-88.);
//        kmul/=(t/10.-10.4);
//        kmul+=beat/1.3;
//      }
//    }
//
//    float ss1=0.;
//    if (t>172.)
//    {
//      ss1*=(t-172.);
//    }
//    d = kmul*kacsa(scrot(uv-vec2(ss-sin(ss)), pow(.3+cos(ss/2.8*PI/1.),.5)+ss1, sin(ss*1.2)-ss*1.2), w, ss, rc);
//   
//    float cmx=pow(sin(ss*PI/8.+PI/2.),31.)*.5+.5;
//    
//    vec3 col = hueshift(pal(smoothstep(-10., 10., d*4.-2.+hash13(vec3(uv*9873., t*99.45)))),
//        mix(hs[w],hs[w+1],cmx));
//    ////vec3 color = vec3(smoothstep(0., 1., d));
//
//    col = clamp(col*0.5+0.5*col*col*1.2,0.0,1.0);
//    col *= 0.5 + 1.*(1.77-uv.x)*(1.77+uv.x)*(1.-uv.y)*(1.+uv.y);
//    col *= vec3(0.95,1.05,0.95);
//    col *= 0.9 +0.1*sin(10.0*t+uv.y*1000.0);
//    col *= 0.99 +0.01*sin(55.0*t);
//
//    col *= cmul;
//    //col = smoothstep(.2, .8, col);
//
//    // Output to screen
//    gl_FragColor = vec4(col, 1.0);
//}
