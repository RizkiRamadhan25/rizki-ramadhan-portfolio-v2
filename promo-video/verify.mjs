import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

const bin=path.resolve('node_modules/@remotion/compositor-win32-x64-msvc');
const outputs=['Rizki-Ramadhan-Portfolio-Reel.mp4','Rizki-Ramadhan-Portfolio-Reel-Tanpa-Musik.mp4'];
const report=[];
for(const file of outputs) {
  const p=path.resolve('out',file);
  const data=JSON.parse(execFileSync(path.join(bin,'ffprobe.exe'),['-v','error','-show_entries','format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt,sample_rate,channels','-of','json',p],{encoding:'utf8'}));
  const video=data.streams.find(s=>s.codec_type==='video');
  const audio=data.streams.find(s=>s.codec_type==='audio');
  assert.equal(video.width,1080);assert.equal(video.height,1920);
  assert.equal(video.codec_name,'h264');assert.equal(video.pix_fmt,'yuv420p');
  assert.equal(video.r_frame_rate,'30/1');
  assert.ok(Math.abs(Number(data.format.duration)-43)<.1);
  assert.equal(Boolean(audio),!file.includes('Tanpa-Musik'));
  if(audio) assert.equal(audio.codec_name,'aac');
  report.push({file,...data});
}
execFileSync(path.join(bin,'ffmpeg.exe'),['-v','error','-i',path.resolve('out',outputs[0]),'-c:v','rawvideo','-c:a','pcm_s16le','-f','null','-'],{stdio:['ignore','ignore','pipe']});
const wav=fs.readFileSync('public/soundtrack.wav');
let peak=0,squares=0;
for(let i=44;i<wav.length;i+=2){const v=wav.readInt16LE(i)/32768;peak=Math.max(peak,Math.abs(v));squares+=v*v;}
const audio={peakDb:20*Math.log10(peak),rmsDb:20*Math.log10(Math.sqrt(squares/((wav.length-44)/2)))};
assert.ok(peak<1);
fs.writeFileSync('out/render-report.json',JSON.stringify({passed:true,outputs:report,soundtrack:audio},null,2));
console.log(JSON.stringify({passed:true,duration:43,resolution:'1080x1920',fps:30,outputs:report.map(r=>({file:r.file,bytes:Number(r.format.size)})),soundtrack:audio},null,2));
