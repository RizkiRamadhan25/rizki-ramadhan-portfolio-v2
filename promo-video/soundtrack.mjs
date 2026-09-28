import fs from 'node:fs';

// Original instrumental: deterministic synthesis, no third-party recordings.
const rate=48000, duration=43, beat=60/112;
const count=rate*duration, left=new Float32Array(count),right=new Float32Array(count);
let seed=9282026;
const noise=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/2147483648-1;};
const hz=n=>440*2**((n-69)/12);
function tone(start,length,note,vol,type='pluck',pan=0) {
  const first=Math.floor(start*rate),n=Math.floor(length*rate),frequency=hz(note);
  for(let j=0;j<n&&first+j<count;j++) {
    const t=j/rate,phase=2*Math.PI*frequency*t;
    const env=type==='pad'?Math.min(1,t/.2)*Math.min(1,(length-t)/.55):Math.min(1,t/.007)*Math.exp(-t*6);
    const wave=type==='pad'?(Math.sin(phase)+.2*Math.sin(phase*1.002)+.1*Math.sin(phase*2))*.7:Math.sin(phase)+.16*Math.sin(phase*2)+.06*Math.sin(phase*3);
    left[first+j]+=wave*env*vol*(1-pan*.3);right[first+j]+=wave*env*vol*(1+pan*.3);
  }
}
const chords=[[50,57,60,65],[46,53,57,62],[53,60,64,69],[48,55,58,62]];
for(let b=0;b<duration/beat;b++) {
  const start=b*beat,chord=chords[Math.floor(b/8)%4];
  if(b%8===0) for(const note of chord) tone(start,beat*8+.3,note,.025,'pad',.1);
  if(start>2&&start<39) {
    tone(start,.5,chord[0]-12,.09);
    tone(start+beat*.5,.4,chord[1]+12,.055,'pluck',-.5);
    tone(start+beat*.75,.4,chord[2]+12,.035,'pluck',.5);
    const first=Math.floor(start*rate);
    for(let j=0;j<rate*.22&&first+j<count;j++) {
      const t=j/rate,kick=Math.sin(2*Math.PI*(48*t+7*(1-Math.exp(-t*22))))*Math.exp(-t*24)*.22;
      left[first+j]+=kick;right[first+j]+=kick;
    }
    for(let h=0;h<2;h++) {
      const at=Math.floor((start+h*beat/2)*rate);
      for(let j=0;j<rate*.065&&at+j<count;j++) {
        const val=noise()*Math.exp(-j/rate*80)*.035;
        left[at+j]+=val;right[at+j]-=val*.8;
      }
    }
    if(b%2===1) {
      const at=Math.floor(start*rate);
      for(let j=0;j<rate*.14&&at+j<count;j++) {
        const t=j/rate,val=noise()*Math.exp(-t*32)*.055;
        left[at+j]+=val;right[at+j]+=val;
      }
    }
  }
}
for(const at of [3,7,11,16,20,24,28,32,36,39]) {
  const first=Math.floor((at-.3)*rate);
  for(let j=0;j<rate*.55&&first+j<count;j++) {
    const t=j/(rate*.55),val=noise()*Math.sin(Math.PI*t)**3*.028;
    left[first+j]+=val*(1-t);right[first+j]+=val*t;
  }
}
const wav=Buffer.alloc(44+count*4);
wav.write('RIFF',0);wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);
wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);
wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*4,28);wav.writeUInt16LE(4,32);wav.writeUInt16LE(16,34);
wav.write('data',36);wav.writeUInt32LE(count*4,40);
for(let i=0;i<count;i++) {
  const t=i/rate,fade=Math.min(1,t/1.2,(duration-t)/2);
  wav.writeInt16LE(Math.round(Math.tanh(left[i]*1.8)*fade*26000),44+i*4);
  wav.writeInt16LE(Math.round(Math.tanh(right[i]*1.8)*fade*26000),46+i*4);
}
fs.writeFileSync('public/soundtrack.wav',wav);
console.log('Created original 43-second instrumental.');
