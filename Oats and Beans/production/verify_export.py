from pathlib import Path
import json,subprocess
import numpy as np
from PIL import Image,ImageDraw,ImageOps

P=Path(__file__).parent; F=P.parent
video=F/'Oats-and-Beans-Family-Farm-Dance-1080p.mp4'
audio=F/'Oats_and_Beans_Family_Farm_Dance_2026-09-21T154836.mp3'
def run(args): return subprocess.check_output(args)
meta=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]))
v=next(s for s in meta['streams'] if s['codec_type']=='video')
a=next(s for s in meta['streams'] if s['codec_type']=='audio')
assert (v['width'],v['height'])==(1920,1080)
assert v['avg_frame_rate']=='30/1'
assert abs(float(meta['format']['duration'])-120.033)<.10
def decode(p):
    return np.frombuffer(run(['ffmpeg','-v','error','-i',str(p),'-vn','-ar','22050','-ac','1','-f','f32le','-']),dtype='<f4')
source=decode(audio); encoded=decode(video);n=min(len(source),len(encoded))
corr=float(np.corrcoef(source[:n],encoded[:n])[0,1])
assert corr>.99,corr
checks={'width':v['width'],'height':v['height'],'fps':v['avg_frame_rate'],'duration_seconds':float(meta['format']['duration']),
 'audio_codec':a['codec_name'],'audio_waveform_correlation_to_original':corr,'source_audio_duration_seconds':len(source)/22050,
 'encoded_audio_duration_seconds':len(encoded)/22050,'size_bytes':video.stat().st_size}
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'],check=True)
checks['complete_decode_without_errors']=True
times=[2,8.7,12,24.5,28,32.8,36,40,48.5,53,58,68,80,84,87,88.9,94,101.2,110,115.7]
out=Image.new('RGB',(1600,252*5),'#fff9ec');d=ImageDraw.Draw(out)
for i,t in enumerate(times):
    f=P/'inspect'/f'final-{t}.jpg'
    subprocess.run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(video),'-frames:v','1','-q:v','2',str(f)],check=True)
    im=ImageOps.contain(Image.open(f),(400,225));x=i%4*400;y=i//4*252
    out.paste(im,(x,y));d.text((x+9,y+232),f'{t:g} seconds',fill='#295d6d')
out.save(P/'inspect/final-contact-sheet.jpg',quality=94)
def frame(t):
    b=run(['ffmpeg','-v','error','-ss',str(t),'-i',str(video),'-frames:v','1','-vf','scale=480:270','-f','rawvideo','-pix_fmt','rgb24','-'])
    return np.frombuffer(b,dtype=np.uint8).astype(float)
freeze_difference=float(np.mean(np.abs(frame(94)-frame(95))))
movement_difference=float(np.mean(np.abs(frame(79.45)-frame(79.75))))
checks['freeze_mean_pixel_difference_0_to_255']=freeze_difference
checks['stamp_movement_mean_pixel_difference_0_to_255']=movement_difference
assert freeze_difference<1.0,freeze_difference
assert movement_difference>0.5,movement_difference
(P/'quality-check.json').write_text(json.dumps(checks,indent=2)+'\n')
print(json.dumps(checks,indent=2))
