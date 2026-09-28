const fs=require('node:fs');
const path=require('node:path');
const sharp=require(process.argv[2]||'sharp');
(async()=>{
  const files=fs.readdirSync('out/stills').filter(x=>x.endsWith('.png')).sort();
  const tiles=[];
  for(let i=0;i<files.length;i++){
    const bytes=await sharp(path.join('out/stills',files[i])).resize(270,480).png().toBuffer();
    tiles.push({input:bytes,left:(i%4)*270,top:Math.floor(i/4)*480});
  }
  await sharp({create:{width:1080,height:Math.ceil(files.length/4)*480,channels:3,background:'#151614'}}).composite(tiles).jpeg({quality:95}).toFile('out/Storyboard.jpg');
})();
