import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,stat,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const require=createRequire('/Users/vineet/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {chromium}=require('playwright');
const root=path.dirname(fileURLToPath(import.meta.url)),folder=path.dirname(root);
const types={'.js':'text/javascript','.json':'application/json','.html':'text/html','.mp3':'audio/mpeg','.ttf':'font/ttf'};
const server=createServer(async(req,res)=>{try{let rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let p=path.join(folder,rel);if((await stat(p)).isDirectory())p=path.join(p,'index.html');let b=await readFile(p);res.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream'});res.end(b);}catch{res.writeHead(404);res.end('Not found');}});
server.listen(0,'127.0.0.1');await once(server,'listening');let port=server.address().port;
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--use-gl=angle','--use-angle=metal','--enable-webgl','--ignore-gpu-blocklist','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
page.on('pageerror',e=>console.error('PAGE_ERROR',e.message));
page.on('console',m=>{if(m.type()==='error')console.error('CONSOLE',m.text());});
await page.goto(`http://127.0.0.1:${port}/production/?render=1`);await page.waitForFunction(()=>window.movieReady,{timeout:120000});
console.log('READY',await page.evaluate(()=>({gpu:document.querySelector('#gl').getContext('webgl2').getParameter(7937),...window.renderFrame(8)})));
await mkdir(path.join(root,'inspect'),{recursive:true});
const args=process.argv.slice(2);
if(args.includes('--stills')){
 for(let t of [2,8.7,24.5,32.5,36,40,48.5,58,80,84,88.4,94,98,115.7]){await page.evaluate(t=>window.renderFrame(t),t);await writeFile(path.join(root,'inspect',`frame-${t}.png`),Buffer.from(await page.evaluate(()=>document.querySelector('#final').toDataURL('image/png').split(',')[1]),'base64'));console.log('STILL',t);}
}else{
 let start=Number(args[0]||0),end=Number(args[1]||120.033),out=args[2]||path.join(folder,'Oats-and-Beans-Family-Farm-Dance-1080p.mp4');
 let frames=Math.round((end-start)*30);let ff=spawn('/opt/homebrew/bin/ffmpeg',['-y','-hide_banner','-loglevel','warning','-f','image2pipe','-vcodec','mjpeg','-r','30','-i','pipe:0','-ss',String(start),'-i',path.join(folder,'Oats_and_Beans_Family_Farm_Dance_2026-09-21T154836.mp3'),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast','-crf','17','-threads','2','-pix_fmt','yuv420p','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-c:a','aac','-b:a','320k','-t',String(end-start),'-movflags','+faststart',out],{stdio:['pipe','ignore','pipe']});
 ff.stderr.on('data',d=>process.stderr.write(d));const began=Date.now();
 for(let f=0;f<frames;f++){const img=await page.evaluate(t=>window.captureFrame(t),start+f/30);if(!ff.stdin.write(Buffer.from(img,'base64')))await once(ff.stdin,'drain');if(f%150===0)console.log(`FRAME ${f}/${frames}; elapsed ${((Date.now()-began)/1000).toFixed(1)}s`);}
 ff.stdin.end();const [code]=await once(ff,'close');if(code)throw Error('Encoder failed: '+code);console.log('COMPLETE',out,'seconds',((Date.now()-began)/1000).toFixed(1));
}
await browser.close();server.close();
