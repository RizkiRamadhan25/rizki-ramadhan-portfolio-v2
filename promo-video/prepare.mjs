import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
process.chdir(decodeURIComponent(root));
const ffmpeg = path.resolve('node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const ffprobe = path.resolve('node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');
const captures = 'public/captures';
fs.mkdirSync('public/sections', {recursive:true});
fs.mkdirSync('out', {recursive:true});
fs.mkdirSync('src', {recursive:true});

// Browser captures are JPEG bytes; keep their file extension accurate.
for (const file of fs.readdirSync(captures)) {
  if (!file.endsWith('.png')) continue;
  const p = path.join(captures,file);
  const bytes = fs.readFileSync(p);
  if (bytes[0]===255 && bytes[1]===216) fs.renameSync(p,p.replace(/\.png$/,'.jpg'));
}
const dimensions = p => JSON.parse(execFileSync(ffprobe,['-v','error','-show_entries','stream=width,height','-of','json',p],{encoding:'utf8'})).streams[0];
const assets = {};
for (const file of fs.readdirSync(captures).filter(f=>f.endsWith('.jpg')&&!f.includes('-full'))) {
  const meta=dimensions(`${captures}/${file}`);
  const key=file.replace('.jpg','');
  // The regular viewport capture preserves scroll-triggered content reliably.
  const width=meta.width-16;
  execFileSync(ffmpeg,['-y','-v','error','-i',`${captures}/${file}`,'-vf',`crop=${width}:${meta.height}:0:0`,'-frames:v','1','-q:v','2',`public/sections/${key}.jpg`]);
  assets[key]={src:`sections/${key}.jpg`,width,height:meta.height};
}
fs.writeFileSync('src/assets.json',JSON.stringify(assets,null,2));
fs.copyFileSync('../public/videos/learning-python-preview.mp4','public/learning.mp4');
fs.copyFileSync('../public/images/profile-cutout.png','public/portrait.png');
const projectFiles = fs.readdirSync('../img-source-project');
for (const [key,pattern] of [['cpu','gantt'],['savepoint','savepoint-home'],['laras','laras-home'],['warteg','dashboard-owner']]) {
  const file=projectFiles.find(f=>f.toLowerCase().includes(pattern));
  if(file) fs.copyFileSync(`../img-source-project/${file}`,`public/${key}.png`);
}
console.log(`Prepared ${Object.keys(assets).length} web captures.`);
