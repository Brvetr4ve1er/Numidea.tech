// HQ trailer audio: WebAudio sampler that follows the composition clock, plus offline WAV mixdown.
window.HQAudio = (function () {
  const BASE = 'assets/audio/';
  const NAMES = ['music1', 'music2', 'type', 'pop', 'tick', 'whoosh', 'hit', 'glitch', 'chime', 'alert', 'coins', 'burst', 'levelup', 'boop', 'scan', 'riser'];
  let ctx = null, bus = null, comp = null;
  const raw = {}, bufs = {};
  const fetchAll = Promise.all(NAMES.map(n => fetch(BASE + n + '.mp3').then(r => r.arrayBuffer()).then(b => { raw[n] = b; }).catch(e => console.warn('[HQAudio]', n, e))));
  function ensure() {
    if (ctx) return ctx;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3; comp.attack.value = .005; comp.release.value = .2;
    bus = ctx.createGain(); bus.gain.value = .9; bus.connect(comp); comp.connect(ctx.destination);
    fetchAll.then(() => NAMES.forEach(n => { if (raw[n] && !bufs[n]) ctx.decodeAudioData(raw[n].slice(0)).then(b => { bufs[n] = b; }); }));
    return ctx;
  }
  const unlock = () => { ensure(); if (ctx.state !== 'running') ctx.resume(); };
  ['pointerdown', 'keydown'].forEach(ev => window.addEventListener(ev, unlock, { capture: true }));

  // cue: {t, s, g=1, off=0, dur, rate=1}
  function play(cue, at, lateBy = 0) {
    const b = bufs[cue.s]; if (!b || !ctx) return;
    const src = ctx.createBufferSource(); src.buffer = b; src.playbackRate.value = cue.rate || 1;
    const g = ctx.createGain(); g.gain.value = cue.g ?? 1; src.connect(g); g.connect(bus);
    const off = (cue.off || 0) + lateBy, dur = cue.dur ? Math.max(.02, cue.dur - lateBy) : undefined;
    if (cue.dur) { g.gain.setValueAtTime(cue.g ?? 1, at + dur - .06); g.gain.linearRampToValueAtTime(0, at + dur); }
    src.start(at, off, dur);
    return src;
  }

  function useHQAudio({ T, playing, cues, music, musicGain = .5, enabled = true, total = 30 }) {
    const R = window.React;
    const st = R.useRef({ prev: null, m: null, mg: null, mStart: 0, mOff: 0 }).current;
    const stopMusic = () => { if (st.m) { try { st.mg.gain.setTargetAtTime(0, ctx.currentTime, .05); st.m.stop(ctx.currentTime + .2); } catch (e) {} st.m = null; } };
    R.useEffect(() => {
      if (!enabled || !playing || !ctx || ctx.state !== 'running') { if (ctx) stopMusic(); st.prev = null; return; }
      const now = ctx.currentTime, prev = st.prev, seek = prev == null || T < prev || T - prev > .5;
      if (music && bufs[music]) {
        const expected = st.mOff + (now - st.mStart);
        if (!st.m || seek || Math.abs(expected - T) > .25) {
          stopMusic();
          if (T < bufs[music].duration) {
            const src = ctx.createBufferSource(); src.buffer = bufs[music];
            const g = ctx.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(musicGain, now, .03);
            const fadeAt = Math.max(0, total - T - 1.2);
            g.gain.setValueAtTime(musicGain, now + fadeAt); g.gain.linearRampToValueAtTime(0, now + fadeAt + 1.2);
            src.connect(g); g.connect(bus); src.start(now, T); st.m = src; st.mg = g; st.mStart = now; st.mOff = T;
          }
        }
      }
      if (!seek) for (const c of cues) if (c.t > prev && c.t <= T) play(c, now, Math.max(0, T - c.t));
      st.prev = T;
    }, [T, playing, enabled]);
    R.useEffect(() => () => { if (ctx) stopMusic(); }, []);
  }

  async function renderWav(cues, music, total, musicGain = .5, name = 'soundtrack') {
    await fetchAll;
    const sr = 48000, oc = new OfflineAudioContext(2, Math.ceil(sr * total), sr);
    const dec = {}; await Promise.all(NAMES.map(async n => { if (raw[n]) dec[n] = await oc.decodeAudioData(raw[n].slice(0)); }));
    const cp = oc.createDynamicsCompressor(); cp.threshold.value = -14; cp.ratio.value = 3; cp.attack.value = .005; cp.release.value = .2;
    const out = oc.createGain(); out.gain.value = .9; out.connect(cp); cp.connect(oc.destination);
    if (music && dec[music]) {
      const s = oc.createBufferSource(); s.buffer = dec[music]; const g = oc.createGain();
      g.gain.setValueAtTime(musicGain, 0); g.gain.setValueAtTime(musicGain, Math.max(0, total - 1.2)); g.gain.linearRampToValueAtTime(0, total);
      s.connect(g); g.connect(out); s.start(0);
    }
    for (const c of cues) {
      const b = dec[c.s]; if (!b || c.t >= total) continue;
      const s = oc.createBufferSource(); s.buffer = b; s.playbackRate.value = c.rate || 1;
      const g = oc.createGain(); g.gain.value = c.g ?? 1; s.connect(g); g.connect(out);
      if (c.dur) { g.gain.setValueAtTime(c.g ?? 1, c.t + c.dur - .06); g.gain.linearRampToValueAtTime(0, c.t + c.dur); }
      s.start(c.t, c.off || 0, c.dur);
    }
    const buf = await oc.startRendering();
    const wav = toWav(buf), url = URL.createObjectURL(wav);
    const a = document.createElement('a'); a.href = url; a.download = name + '.wav'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
  function toWav(buf) {
    const ch = buf.numberOfChannels, len = buf.length, sr = buf.sampleRate, dv = new DataView(new ArrayBuffer(44 + len * ch * 2));
    const w = (o, s) => [...s].forEach((c, i) => dv.setUint8(o + i, c.charCodeAt(0)));
    w(0, 'RIFF'); dv.setUint32(4, 36 + len * ch * 2, true); w(8, 'WAVE'); w(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true);
    dv.setUint16(22, ch, true); dv.setUint32(24, sr, true); dv.setUint32(28, sr * ch * 2, true); dv.setUint16(32, ch * 2, true); dv.setUint16(34, 16, true);
    w(36, 'data'); dv.setUint32(40, len * ch * 2, true);
    const data = [...Array(ch)].map((_, i) => buf.getChannelData(i)); let o = 44;
    for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) { const v = Math.max(-1, Math.min(1, data[c][i])); dv.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true); o += 2; }
    return new Blob([dv], { type: 'audio/wav' });
  }
  function SoundChip({ enabled }) {
    const R = window.React; const [ready, setReady] = R.useState(false);
    R.useEffect(() => { const id = setInterval(() => setReady(!!ctx && ctx.state === 'running'), 400); return () => clearInterval(id); }, []);
    if (!enabled || ready) return null;
    return R.createElement('div', { onClick: unlock, style: { position: 'fixed', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 50, padding: '8px 14px', borderRadius: 10, background: '#141416', border: '1.5px solid #4d4841', color: '#e8e4dc', font: "500 13px 'IBM Plex Mono', monospace", cursor: 'pointer' } }, '♪ click anywhere to enable sound, then press play');
  }
  return { useHQAudio, renderWav, SoundChip, unlock };
})();
