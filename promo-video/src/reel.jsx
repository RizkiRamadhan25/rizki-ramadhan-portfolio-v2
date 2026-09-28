import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/dela-gothic-one/latin-400.css';
import '@fontsource/space-mono/latin-400.css';
import '@fontsource/space-mono/latin-700.css';
import assets from './assets.json';

const C={ink:'#22201c',dark:'#151614',paper:'#edeae2',orange:'#f04e2a',muted:'#a8a397'};
const mono='"Space Mono", monospace',display='"Dela Gothic One", sans-serif';
const ease=Easing.bezier(.22,1,.36,1);
const tween=(f,a,b,x,y)=>interpolate(f,[a,b],[x,y],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
const linear=(f,a,b,x,y)=>interpolate(f,[a,b],[x,y],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const pos=(x,y,w)=>({position:'absolute',left:x,top:y,width:w});

function Brand({size=70,color=C.paper,dot=C.orange}) {
  return <span style={{fontFamily:display,fontSize:size,letterSpacing:-size*.16,color,lineHeight:1}}>R<span style={{display:'inline-block',transform:'rotate(-12deg)'}}>R</span><span style={{color:dot}}>.</span></span>;
}
function Background({light=false,orange=false,number}) {
  const f=useCurrentFrame();
  const ink=orange||light?C.ink:C.paper;
  return <AbsoluteFill style={{background:orange?C.orange:light?C.paper:C.dark,color:ink}}>
    <div style={{...pos(580,560,980),height:980,border:`1px solid ${ink}17`,borderRadius:'50%',transform:`translateY(${Math.sin(f/80)*20}px)`}} />
    <div style={{...pos(-440,760,950),height:950,border:`1px solid ${ink}0d`,borderRadius:'50%'}} />
    <div style={{...pos(72,135,936),display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:`1px solid ${ink}40`,paddingBottom:27}}>
      <Brand size={48} color={ink} dot={orange?C.paper:C.orange}/>
      <span style={{fontFamily:mono,fontSize:20,letterSpacing:2}}>PORTFOLIO / 2026</span>
    </div>
    <div style={{...pos(72,1740,936),display:'flex',justifyContent:'space-between',fontFamily:mono,fontSize:18,letterSpacing:2,color:ink,opacity:.65}}>
      <span>RIZKI RAMADHAN</span><span>{String(number).padStart(2,'0')} / 11</span>
    </div>
  </AbsoluteFill>;
}
function Heading({eyebrow,lines,light=false,orange=false,size=82}) {
  const f=useCurrentFrame(), ink=light||orange?C.ink:C.paper;
  return <div style={{...pos(76,236,930),color:ink}}>
    <div style={{fontFamily:mono,fontSize:23,letterSpacing:3,color:orange?C.ink:C.orange,marginBottom:30,opacity:tween(f,0,16,0,1)}}>{eyebrow}</div>
    {lines.map((line,i)=><div key={line} style={{overflow:'hidden',paddingBottom:9}}><div style={{fontFamily:display,fontSize:size,lineHeight:1.15,letterSpacing:-3,transform:`translateY(${tween(f,i*3,22+i*3,130,0)}%)`}}>{line}</div></div>)}
  </div>;
}
function Footnote({children,y=1610,light=false}) {
  const f=useCurrentFrame();
  return <div style={{...pos(78,y,910),fontFamily:mono,fontSize:25,lineHeight:1.6,color:light?C.ink:C.paper,opacity:tween(f,15,35,0,.8),transform:`translateY(${tween(f,15,35,15,0)}px)`}}>{children}</div>;
}
function Screen({name,width,height,pan=0,children}) {
  const asset=assets[name];
  const scale=Math.max(width/asset.width,height/asset.height);
  const actualHeight=asset.height*scale, actualWidth=asset.width*scale;
  return <div style={{position:'relative',width,height,overflow:'hidden',background:C.paper}}>
    <Img src={staticFile(asset.src)} style={{position:'absolute',left:-(actualWidth-width)/2,top:-Math.max(0,actualHeight-height)*pan,width:actualWidth,height:actualHeight,maxWidth:'none'}}/>
    {children}
  </div>;
}
function Device({name,x,y,width=980,kind='desktop',rotate=0,delay=0,pan=0,children,tilt=0}) {
  const f=useCurrentFrame(),enter=tween(f,delay,delay+28,0,1),float=Math.sin(f/40)*5;
  const bezel=kind==='desktop'?14:kind==='tablet'?20:12;
  const screenW=width-bezel*2;
  const screenH=kind==='desktop'?screenW*.695:kind==='tablet'?screenW*1.37:screenW*2.16;
  const radius=kind==='phone'?52:kind==='tablet'?36:20;
  return <div style={{...pos(x,y,width),opacity:enter,transform:`perspective(2200px) translateY(${(1-enter)*150+float}px) rotate(${rotate}deg) rotateY(${tilt}deg) scale(${.96+.04*enter})`,transformOrigin:'50% 55%'}}>
    <div style={{padding:bezel,background:'linear-gradient(145deg,#66665e,#11120f 20%,#41413a 80%,#8b8b80)',borderRadius:radius,boxShadow:'0 42px 80px #00000048, 0 0 0 2px #88887c',position:'relative'}}>
      <div style={{borderRadius:radius-bezel*.7,overflow:'hidden',position:'relative'}}>
        {kind==='desktop'&&<div style={{height:34,background:'#e4e0d6',display:'flex',alignItems:'center',gap:7,padding:'0 15px'}}><span style={{width:7,height:7,borderRadius:8,background:'#f04e2a'}}/><span style={{width:7,height:7,borderRadius:8,background:'#b9b5ab'}}/><span style={{width:7,height:7,borderRadius:8,background:'#b9b5ab'}}/><span style={{fontFamily:mono,fontSize:12,color:'#6d685e',marginLeft:42}}>rizki-ramadhan-portfolio.vercel.app</span></div>}
        <Screen name={name} width={screenW} height={screenH} pan={pan}>{children}</Screen>
      </div>
      {kind==='phone'&&<><div style={{position:'absolute',top:17,left:'39%',width:'22%',height:13,borderRadius:20,background:'#161715'}}/><div style={{position:'absolute',bottom:18,left:'34%',width:'32%',height:4,borderRadius:9,background:'#26221e'}}/></>}
    </div>
    {kind==='desktop'&&<><div style={{position:'absolute',left:'-3%',bottom:-21,width:'106%',height:30,background:'linear-gradient(#b5b5ab,#5b5b53)',borderRadius:'4px 4px 40px 40px',boxShadow:'0 20px 30px #0004'}}/><div style={{position:'absolute',left:'41%',bottom:-7,width:'18%',height:12,background:'#61615a',borderRadius:'0 0 14px 14px'}}/></>}
  </div>;
}
function Pill({children,x,y,light=false,rotate=0}) {
  return <div style={{position:'absolute',left:x,top:y,padding:'16px 23px',fontFamily:mono,fontSize:22,background:light?C.paper:C.ink,color:light?C.ink:C.paper,border:`1px solid ${light?'#b8b1a2':'#67665c'}`,borderRadius:4,transform:`rotate(${rotate}deg)`,boxShadow:'0 12px 28px #0002'}}>{children}</div>;
}
function Opening() {
  const f=useCurrentFrame();
  return <AbsoluteFill><Background number={1}/>
    <div style={{...pos(150,465,780),height:780,background:C.orange,borderRadius:'50%',transform:`scale(${tween(f,0,35,.2,1)})`,opacity:tween(f,0,14,0,1)}}/>
    <div style={{...pos(0,710,1080),textAlign:'center',transform:`rotate(${tween(f,0,60,-18,-6)}deg) scale(${tween(f,5,40,.7,1)})`,opacity:tween(f,5,25,0,1)}}><Brand size={340} color={C.ink} dot={C.paper}/></div>
    <Pill x={85} y={515} rotate={-8}>WEB / DATA / AI</Pill>
    <Pill x={635} y={1120} rotate={8} light>MADE BY RIZKI ↗</Pill>
    <div style={{...pos(76,1350,960),fontFamily:display,fontSize:78,color:C.paper,lineHeight:1.2,letterSpacing:-3,opacity:tween(f,16,37,0,1),transform:`translateY(${tween(f,16,37,40,0)}px)`}}>DARI IDE<br/><span style={{color:C.orange}}>JADI KARYA.</span></div>
    <Footnote y={1595}>Sebuah perjalanan dalam satu portfolio.</Footnote>
  </AbsoluteFill>;
}
function Hero() {
  const f=useCurrentFrame();
  return <AbsoluteFill><Background light number={2}/><Heading light eyebrow="01 / INTRODUCING" lines={['MEET','RIZKI.']} size={98}/>
    <Device name="desktop-home" x={48} y={635} width={978} rotate={-3} tilt={-3}/>
    <Device name="mobile-home" x={730} y={1040} width={268} kind="phone" rotate={8} delay={12}>
      <div style={{position:'absolute',inset:0,clipPath:`inset(0 0 ${tween(f,69,90,100,0)}% 0)`}}><Screen name="mobile-menu" width={244} height={244*2.16}/></div>
    </Device>
    <div style={{...pos(84,1460,620),fontFamily:display,fontSize:42,lineHeight:1.3,color:C.ink,opacity:tween(f,22,45,0,1)}}>Belajar.<br/>Membangun.<br/><span style={{color:C.orange}}>Berkembang.</span></div>
  </AbsoluteFill>;
}
function Learning() {
  return <AbsoluteFill><Background number={3}/><Heading eyebrow="02 / LEARNING BY DOING" lines={['BELAJAR','LEWAT KARYA.']} size={80}/>
    <Device name="desktop-learning" x={46} y={650} width={987} rotate={2}>
      <OffthreadVideo muted src={staticFile('learning.mp4')} style={{position:'absolute',left:'49.3%',top:'28.6%',width:'46.8%',height:'40.1%',objectFit:'cover'}}/>
    </Device>
    <Pill x={78} y={1440}>PYTHON · EXPERIMENTS · PROCESS</Pill>
    <Footnote y={1550}>Dari eksperimen pertama<br/>ke sesuatu yang bisa digunakan.</Footnote>
  </AbsoluteFill>;
}
function Projects() {
  const f=useCurrentFrame();
  return <AbsoluteFill><Background light number={4}/><Heading light eyebrow="03 / SELECTED WORK" lines={['IDE NYATA.','PROYEK NYATA.']} size={74}/>
    <Device name="desktop-projects" x={58} y={620} width={950} rotate={-2}/>
    {['savepoint','cpu','laras'].map((name,i)=><div key={name} style={{...pos(54+i*310,1255+(i%2)*64,350),padding:9,background:C.paper,borderRadius:13,boxShadow:'0 20px 38px #0003',opacity:tween(f,25+i*9,48+i*9,0,1),transform:`translateY(${tween(f,25+i*9,48+i*9,130,0)}px) rotate(${[-6,3,8][i]}deg)`}}><Img src={staticFile(name+'.png')} style={{width:'100%',height:240,objectFit:'cover',objectPosition:'top',borderRadius:6}}/><div style={{padding:'14px 5px 7px',fontFamily:mono,fontSize:18,color:C.ink}}>{['SAVEPOINT','CPU SIMULATOR','LARAS'][i]} ↗</div></div>)}
    <Footnote light y={1660}>5 proyek. Beragam cara memecahkan masalah.</Footnote>
  </AbsoluteFill>;
}
function Gallery() {
  const f=useCurrentFrame(),p=tween(f,34,65,0,150);
  return <AbsoluteFill><Background number={5}/><Heading eyebrow="04 / PROJECT DETAILS" lines={['LIHAT LEBIH','DEKAT.']} size={86}/>
    <Device name="desktop-detail" x={45} y={650} width={985} rotate={tween(f,0,100,-3,1)}>
      <div style={{position:'absolute',inset:0,clipPath:`circle(${p}% at 60% 55%)`}}><Screen name="desktop-gallery" width={957} height={957*.695}/></div>
    </Device>
    <div style={{...pos(160,1460,760),display:'flex',justifyContent:'space-between',fontFamily:mono,fontSize:26,color:C.paper}}>{['KLIK','PERBESAR','JELAJAHI'].map((s,i)=><span key={s} style={{opacity:tween(f,12+i*16,32+i*16,0,1)}}><span style={{color:C.orange}}>0{i+1}</span> {s}</span>)}</div>
    <Footnote y={1580}>Detail proses, fitur, dan galeri<br/>dalam satu pengalaman.</Footnote>
  </AbsoluteFill>;
}
function About() {
  const f=useCurrentFrame();
  return <AbsoluteFill><Background light number={6}/><Heading light eyebrow="05 / ABOUT ME" lines={['DI BALIK','SETIAP KARYA.']} size={78}/>
    <div style={{...pos(565,765,520),height:520,background:C.orange,borderRadius:'50%',transform:`scale(${tween(f,4,35,.6,1)})`}}/>
    <Img src={staticFile('portrait.png')} style={{...pos(565,710,520),height:660,objectFit:'contain',objectPosition:'bottom',opacity:tween(f,8,35,0,1),transform:`translateY(${tween(f,8,35,70,0)}px)`}}/>
    <Device name="mobile-about" kind="phone" x={95} y={630} width={455} rotate={-5}/>
    <div style={{...pos(607,1390,375),fontFamily:mono,fontSize:28,lineHeight:1.75,color:C.ink,opacity:tween(f,16,36,0,1)}}>Informatika.<br/>Web development.<br/>Data & AI.</div>
    <Footnote light y={1680}>Membangun sesuatu yang bermakna.</Footnote>
  </AbsoluteFill>;
}
function Skills() {
  return <AbsoluteFill><Background orange number={7}/><Heading orange eyebrow="06 / THE TOOLKIT" lines={['TERUS','BERTUMBUH.']} size={86}/>
    <Device name="tablet-skills" kind="tablet" x={195} y={600} width={690} rotate={3}/>
    <Pill x={69} y={815} rotate={-8}>REACT</Pill><Pill x={781} y={1070} rotate={7}>PYTHON</Pill><Pill x={72} y={1450} rotate={-5}>LARAVEL</Pill>
    <Footnote light y={1660}>Teknologi yang dipakai, dipelajari, dan diuji.</Footnote>
  </AbsoluteFill>;
}
function Journey() {
  const f=useCurrentFrame();
  return <AbsoluteFill><Background number={8}/><Heading eyebrow="07 / LEARNING JOURNEY" lines={['PROSES JADI','PROGRES.']} size={84}/>
    <Device name="mobile-journey" kind="phone" x={95} y={630} width={430} rotate={-4}/>
    <div style={{...pos(613,745,355),borderLeft:'1px solid #77766a',paddingLeft:37}}>
      {['Dasar pemrograman','Membangun proyek','GitHub & portfolio','Langkah berikutnya'].map((s,i)=><div key={s} style={{position:'relative',height:188,opacity:tween(f,10+i*10,28+i*10,0,1),transform:`translateX(${tween(f,10+i*10,28+i*10,25,0)}px)`}}><div style={{position:'absolute',left:-44,top:12,width:13,height:13,borderRadius:'50%',background:C.orange}}/><div style={{fontFamily:mono,fontSize:20,color:C.orange,marginBottom:19}}>0{i+1} / {['FOUNDATION','PROJECTS','NOW','NEXT'][i]}</div><div style={{fontFamily:display,fontSize:29,lineHeight:1.5,color:C.paper}}>{s}</div></div>)}
    </div>
    <div style={{position:'absolute',left:0,top:1645,width:1080,overflow:'hidden',color:C.orange,fontFamily:display,fontSize:38,whiteSpace:'nowrap'}}><div style={{transform:`translateX(${-f*2}px)`}}>RIZKI RAMADHAN ✳ RIZKI RAMADHAN ✳ RIZKI RAMADHAN</div></div>
  </AbsoluteFill>;
}
function Theme() {
  const f=useCurrentFrame(),p=tween(f,29,78,0,150),switchP=tween(f,29,55,0,1);
  return <AbsoluteFill><Background number={9}/><Heading eyebrow="08 / LIGHT ↔ DARK" lines={['DUA MODE.','SATU KARAKTER.']} size={69}/>
    <Device name="desktop-home" x={45} y={670} width={990} rotate={-2}>
      <div style={{position:'absolute',inset:0,clipPath:`circle(${p}% at 88% 6%)`}}><Screen name="desktop-dark" width={962} height={962*.695}/></div>
    </Device>
    <div style={{...pos(443,1480,194),height:86,borderRadius:50,background:'#44473e',border:'1px solid #6e7166'}}><div style={{position:'absolute',top:9,left:10+switchP*108,width:66,height:66,borderRadius:'50%',background:C.orange,display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,color:C.ink}}>{switchP>.5?'☾':'☀'}</div></div>
    <Footnote y={1620}>Nyaman di setiap suasana.</Footnote>
  </AbsoluteFill>;
}
function Contact() {
  return <AbsoluteFill><Background light number={10}/><Heading light eyebrow="09 / CONTACT" lines={["LET'S",'CONNECT.']} size={97}/>
    <Device name="tablet-contact" kind="tablet" x={100} y={610} width={680} rotate={-3}/>
    <Device name="mobile-contact" kind="phone" x={690} y={990} width={285} rotate={7} delay={10}/>
    <Footnote light y={1660}>Terbuka untuk ide, kolaborasi, dan peluang.</Footnote>
  </AbsoluteFill>;
}
function Closing() {
  const f=useCurrentFrame();
  return <AbsoluteFill><Background orange number={11}/>
    <div style={{...pos(80,340,920),fontFamily:mono,fontSize:26,letterSpacing:3,color:C.ink,opacity:tween(f,0,20,0,1)}}>EXPLORE THE FULL EXPERIENCE</div>
    <div style={{...pos(76,575,930),fontFamily:display,fontSize:87,lineHeight:1.22,letterSpacing:-3,color:C.ink,transform:`translateY(${tween(f,0,25,80,0)}px)`,opacity:tween(f,0,25,0,1)}}>LET'S BUILD<br/>WHAT'S<br/><span style={{color:C.paper}}>NEXT.</span></div>
    <div style={{...pos(780,1040,250),transform:`rotate(${tween(f,0,80,-18,-8)}deg)`}}><Brand size={148} color={C.ink} dot={C.paper}/></div>
    <div style={{...pos(77,1330,927),borderTop:`2px solid ${C.ink}`,borderBottom:`2px solid ${C.ink}`,padding:'31px 0',color:C.ink,fontFamily:mono,fontSize:29,opacity:tween(f,15,37,0,1)}}>rizki-ramadhan-portfolio.vercel.app <span style={{fontSize:44}}>↗</span></div>
    <div style={{...pos(77,1545,900),fontFamily:mono,fontSize:25,color:C.ink}}>Kunjungi website · Kenali prosesnya</div>
  </AbsoluteFill>;
}
const scenes=[{start:0,end:90,component:Opening},{start:90,end:210,component:Hero},{start:210,end:330,component:Learning},{start:330,end:480,component:Projects},{start:480,end:600,component:Gallery},{start:600,end:720,component:About},{start:720,end:840,component:Skills},{start:840,end:960,component:Journey},{start:960,end:1080,component:Theme},{start:1080,end:1170,component:Contact},{start:1170,end:1290,component:Closing}];
export function PortfolioReel() {
  const f=useCurrentFrame();
  return <AbsoluteFill style={{background:C.dark,overflow:'hidden'}}>
    <Audio src={staticFile('soundtrack.wav')} volume={.8}/>
    {scenes.map(({start,end,component:Component})=><Sequence key={start} from={start} durationInFrames={end-start} premountFor={15}><Component/></Sequence>)}
    {scenes.slice(1).map(({start})=>f>=start-7&&f<=start+9&&<div key={start} style={{position:'absolute',inset:0,background:C.orange,transform:`translateY(${interpolate(f,[start-7,start,start+9],[1920,0,-1920],{easing:Easing.inOut(Easing.cubic)})}px)`,display:'flex',alignItems:'center',justifyContent:'center'}}><Brand size={160} color={C.ink} dot={C.paper}/></div>)}
    <div style={{position:'absolute',bottom:0,left:0,width:`${f/1289*100}%`,height:7,background:C.orange}}/>
    <AbsoluteFill style={{background:'#10110f',opacity:linear(f,1271,1289,0,1),pointerEvents:'none'}}/>
  </AbsoluteFill>;
}
