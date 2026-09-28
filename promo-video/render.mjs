import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia,renderStill} from '@remotion/renderer';

const browserExecutable=process.env.REMOTION_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
console.log('Bundling video composition...');
const serveUrl=await bundle({entryPoint:path.resolve('src/index.jsx'),publicDir:path.resolve('public'),onProgress:p=>{if(p===100)console.log('Composition bundled.');}});
console.log('Opening renderer...');
const composition=await selectComposition({serveUrl,id:'PortfolioReel',browserExecutable});
fs.mkdirSync('out/stills',{recursive:true});
const frameArgument=process.argv.find(x=>x.startsWith('--frame='));
const frames=frameArgument?[Number(frameArgument.split('=')[1])]:[55,150,190,275,420,560,665,780,900,1040,1125,1230];
if(process.argv.includes('--stills')) {
  for(const frame of frames) {
    await renderStill({composition,serveUrl,frame,output:path.resolve(`out/stills/${String(frame).padStart(4,'0')}.png`),browserExecutable,imageFormat:'png'});
    console.log(`Still ${frame}/${composition.durationInFrames}`);
  }
} else {
  let last=-1;
  await renderMedia({composition,serveUrl,codec:'h264',audioCodec:'aac',crf:18,pixelFormat:'yuv420p',audioBitrate:'192k',outputLocation:path.resolve('out/render.mp4'),browserExecutable,concurrency:2,jpegQuality:95,onProgress:({progress})=>{const bucket=Math.floor(progress*10);if(bucket!==last){last=bucket;console.log(`Render ${bucket*10}%`);}}});
  const ffmpeg=path.resolve('node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
  // Convert the rendered JPEG/full-range source to standard limited-range BT.709.
  execFileSync(ffmpeg,['-y','-v','error','-i','out/render.mp4','-vf','scale=in_range=pc:out_range=tv:out_color_matrix=bt709','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:a','copy','-movflags','+faststart','-metadata','title=Rizki Ramadhan — Portfolio Reel','out/Rizki-Ramadhan-Portfolio-Reel.mp4']);
  execFileSync(ffmpeg,['-y','-v','error','-i','out/Rizki-Ramadhan-Portfolio-Reel.mp4','-an','-c:v','copy','-movflags','+faststart','out/Rizki-Ramadhan-Portfolio-Reel-Tanpa-Musik.mp4']);
  console.log('Completed: 1080 x 1920, 30 fps, 43 seconds.');
}
