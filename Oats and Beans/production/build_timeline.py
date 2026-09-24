import json
from pathlib import Path

P=Path(__file__).parent
raw=json.loads((P/'transcript-raw.json').read_text())
words=[dict(w) for s in raw['segments'] for w in s['words']]
for w in words:
    w['word']=w['word'].strip().strip(',')
    if w['word']=='vain': w['word']='rain'
    if w['word']=='leads': w['word']='leaves'

# Each caption follows a musical phrase; movement changes follow the instruction.
lengths=[6,6,7,7,7,7,6,7,8,6,7,7,6,6,7,7,6,6,6,6,6,6,7,7,6,6]
actions=['grow','grow','wonder','grow','plant','pat','rain','reach','sway','reach','partner','copy',
         'grow','grow','wonder','grow','stamp','clap','turn','freeze','grow','grow','wonder','grow','seedtree','wave']
labels={'grow':'GROW, GROW, GROW!','wonder':'HOW DO THEY GROW?','plant':'PLANT YOUR SEEDS','pat':'PAT THE GROUND',
        'rain':'WIGGLE YOUR FINGERS','reach':'REACH UP HIGH!','sway':'SWAY LEFT & RIGHT','partner':'FIND YOUR GROWN-UP',
        'copy':'COPY THE MOVES','stamp':'STAMP YOUR FEET!','clap':'CLAP YOUR HANDS!','turn':'TURN & BEND','freeze':'STAND TALL... FREEZE!',
        'seedtree':'LITTLE SEED, BIG TREE','wave':'THANKS FOR DANCING!'}
lines=[]; idx=0
for n,act in zip(lengths,actions):
    ws=words[idx:idx+n]; idx+=n
    lines.append({'start':ws[0]['start'],'end':ws[-1]['end'],'text':' '.join(w['word'] for w in ws),
                  'words':ws,'action':act,'cue':labels[act]})
assert idx==len(words),(idx,len(words))
timeline={'duration':120.032653,'fps':30,'width':1920,'height':1080,'lines':lines,
          'beats':json.loads((P/'beats.json').read_text())['beats']}
(P/'timeline.json').write_text(json.dumps(timeline,indent=2))
def stamp(t):
    ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
(P.parent/'Oats-and-Beans-Lyrics.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(l["start"])} --> {stamp(l["end"])}\n{l["text"]}' for i,l in enumerate(lines))+'\n')
(P.parent/'Oats-and-Beans-Lyrics.txt').write_text('\n'.join(l['text'] for l in lines)+'\n')
print('\n'.join(f'{l["start"]:6.2f} {l["end"]:6.2f} {l["action"]:9} {l["text"]}' for l in lines))
