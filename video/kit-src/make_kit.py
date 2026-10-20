# HiddenClean sound kit, generated ONCE (2026-10-20). Do not regenerate: same sounds every video.
# python3 kit-src/make_kit.py -> public/audio/*.wav
import numpy as np, wave, os
SR=44100; rng=np.random.default_rng(7)
def save(name,x):
    x=x/ (np.max(np.abs(x))+1e-9)*0.89; d=(x*32767).astype(np.int16)
    with wave.open(f"public/audio/{name}.wav","wb") as w: w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(d.tobytes())
t=lambda s: np.arange(int(SR*s))/SR
def bell(f,dur,dec):
    tt=t(dur); return sum(a*np.sin(2*np.pi*f*m*tt)*np.exp(-tt*dec*m**.5) for m,a in [(1,1),(2.01,.35),(3.02,.15),(4.2,.08)])
def place(buf,x,at):
    i=int(at*SR); buf[i:i+len(x)]+=x[:len(buf)-i]
# signature sting: soft "button press" thock + rising sparkle arpeggio (E6 G#6 B6 E7) + shimmer tail
s=np.zeros(int(SR*1.8)); tt=t(.08); place(s,np.sin(2*np.pi*180*tt*np.exp(-tt*20))*np.exp(-tt*60)*1.2,0)
for k,f in enumerate([1318.5,1661.2,1975.5,2637.0]): place(s,bell(f,1.4,6)*.55,0.07+k*0.065)
sh=rng.standard_normal(int(SR*1.2)); sh=np.convolve(sh,np.ones(3)/3,'same'); env=np.exp(-t(1.2)*4)*(t(1.2)>0)
place(s,sh*env*np.sin(2*np.pi*7*t(1.2))**2*.06,0.3)
save("sting",s)
# sparkle: tiny twinkle for reveals / captions-emphasis
sp=np.zeros(int(SR*.7)); [place(sp,bell(f,.6,9)*.5,i*.04) for i,f in enumerate([2349,3136,3951])]; save("sparkle",sp)
# pop: soft UI tap for each step
tt=t(.12); save("pop",np.sin(2*np.pi*(520+600*np.exp(-tt*40))*tt)*np.exp(-tt*35))
# swish: filtered noise sweep for beat changes
n=rng.standard_normal(int(SR*.35)); e=np.sin(np.pi*t(.35)/.35)**2; f=np.cumsum(n); f-=np.convolve(f,np.ones(40)/40,'same'); save("swish",f*e)
# bed: calm 16s loop, soft Rhodes-like chords Fmaj9 - Am7 - Dm9 - Bbmaj7 + light shaker on 8ths, 96 BPM
bpm=96; beat=60/bpm; L=int(SR*beat*16); b=np.zeros(L)
ch=[[174.6,220,261.6,329.6,392],[220,261.6,329.6,392],[146.8,220,261.6,349.2,329.6],[116.5,233.1,293.7,349.2,440]]
for i,c in enumerate(ch):
    for f0 in c: place(b,bell(f0,beat*4,1.2)*.25,i*beat*4)
    place(b,np.sin(2*np.pi*c[0]/2*t(beat*4))*np.exp(-t(beat*4)*.8)*.5,i*beat*4)
for k in range(32):
    tt=t(.06); place(b,rng.standard_normal(len(tt))*np.exp(-tt*80)*(.05 if k%2 else .03),k*beat/2)
save("bed",b)
