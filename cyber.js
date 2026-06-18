/* ============================================================
   CYBER.JS — shared interaction layer (auto-inits on load)
   - scanlines / vignette / cursor-follow glow
   - [data-type] typewriter, [data-glitch] auto data-text
   - .mag magnetic hover, hover-reveal handled in CSS
   - WebAudio click blips + haptics, with mute toggle (persisted)
   - .progress scroll bar
   ============================================================ */
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- inject ambient overlays ---- */
  function el(cls){ const d=document.createElement('div'); d.className=cls; return d; }
  document.body.appendChild(el('bgimg'));
  document.body.appendChild(el('bgscrim'));
  document.body.appendChild(el('vignette'));
  document.body.appendChild(el('atmos'));
  document.body.appendChild(el('cyber-floor'));
  document.body.appendChild(el('noise'));
  document.body.appendChild(el('scanlines'));
  if(!reduce) document.body.appendChild(el('scan-sweep'));
  ['tl','tr','bl','br'].forEach(c=>document.body.appendChild(el('hud-corner '+c)));
  const glow = el('cursor-glow'); glow.style.opacity='0'; document.body.appendChild(glow);

  /* crosshair follower */
  const xh=el('xhair'); xh.innerHTML='<i></i>'; document.body.appendChild(xh);

  /* HUD telemetry readout */
  const ro=el('hud-readout'); document.body.appendChild(ro);

  /* matrix data-rain */
  if(!reduce){
    const cv=document.createElement('canvas'); cv.className='rain'; document.body.appendChild(cv);
    const rctx=cv.getContext('2d'); let cols=[], cw, ch, fs=14;
    function sizeRain(){ cw=cv.width=innerWidth; ch=cv.height=innerHeight; const n=Math.floor(cw/fs); cols=Array.from({length:n},()=>Math.random()*-40); }
    sizeRain(); addEventListener('resize', sizeRain);
    const glyphs='\u30A2\u30AB\u30B5\u30BF\u30CA\u30CF\u30DE01<>/[]{}#$%';
    let last=0;
    (function rain(t){
      requestAnimationFrame(rain);
      if(t-last<55) return; last=t;
      rctx.fillStyle='rgba(6,7,13,0.20)'; rctx.fillRect(0,0,cw,ch);
      rctx.font=fs+"px 'Share Tech Mono', monospace";
      for(let i=0;i<cols.length;i++){
        const ch2=glyphs[Math.floor(Math.random()*glyphs.length)];
        const x=i*fs, y=cols[i]*fs;
        rctx.fillStyle = Math.random()<0.06 ? '#ffffff' : (Math.random()<0.5?'#00e5ff':'#1f9a78');
        rctx.fillText(ch2, x, y);
        if(y>ch && Math.random()>0.975) cols[i]=0; else cols[i]+=1;
      }
    })(0);
  }

  /* ---- cursor-follow glow ---- */
  let gx=innerWidth/2, gy=innerHeight/2, cx=gx, cy=gy;
  addEventListener('pointermove', e=>{ gx=e.clientX; gy=e.clientY; glow.style.opacity='1'; xh.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)'; }, {passive:true});
  addEventListener('pointerleave', ()=> glow.style.opacity='0');
  (function loop(){ cx+=(gx-cx)*.12; cy+=(gy-cy)*.12; glow.style.left=cx+'px'; glow.style.top=cy+'px'; requestAnimationFrame(loop); })();

  /* ---- HUD readout: clock + cursor coords ---- */
  let mx=0,my=0; addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;},{passive:true});
  setInterval(()=>{
    const d=new Date();
    const t=[d.getHours(),d.getMinutes(),d.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':');
    ro.innerHTML='SYS//ONLINE <span class="m">\u25CF</span> '+t+'<br>CRS X:'+String(mx).padStart(4,'0')+' Y:'+String(my).padStart(4,'0')+'<br>JORDAN.LEE <span class="m">v2.6</span>';
  },200);

  /* ---- glitch: auto-fill data-text ---- */
  const glitchEls=[...document.querySelectorAll('.glitch')];
  glitchEls.forEach(n=>{ if(!n.getAttribute('data-text')) n.setAttribute('data-text', n.textContent.trim()); });

  /* ---- random auto-glitch bursts ---- */
  if(!reduce && glitchEls.length){
    setInterval(()=>{
      const n=glitchEls[Math.floor(Math.random()*glitchEls.length)];
      n.classList.add('zap'); setTimeout(()=>n.classList.remove('zap'), 520);
    }, 2200);
  }

  /* ---- typewriter ---- */
  function typeIn(node){
    const full = node.getAttribute('data-type') || node.textContent;
    const speed = +(node.getAttribute('data-type-speed')||38);
    const delay = +(node.getAttribute('data-type-delay')||0);
    if(reduce){ node.textContent=full; return; }
    node.textContent=''; node.classList.add('caret');
    let i=0;
    setTimeout(function step(){
      if(i<=full.length){ node.textContent=full.slice(0,i); i++; setTimeout(step, speed + (Math.random()<.12?90:0)); }
      else { setTimeout(()=>node.classList.remove('caret'), 1200); }
    }, delay);
  }
  const typers=[...document.querySelectorAll('[data-type]')];
  if(typers.length){
    const io=new IntersectionObserver((ents)=>{
      ents.forEach(en=>{ if(en.isIntersecting){ typeIn(en.target); io.unobserve(en.target); } });
    },{threshold:.6});
    typers.forEach(t=>io.observe(t));
  }

  /* ---- magnetic elements ---- */
  if(!reduce) document.querySelectorAll('.mag').forEach(m=>{
    const strength = +(m.getAttribute('data-mag')||0.4);
    m.addEventListener('pointermove', e=>{
      const r=m.getBoundingClientRect();
      const dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2);
      m.style.transform=`translate(${dx*strength}px, ${dy*strength}px)`;
    });
    m.addEventListener('pointerleave', ()=> m.style.transform='translate(0,0)');
  });

  /* ---- scroll progress bar ---- */
  const bar=document.querySelector('.progress');
  if(bar) addEventListener('scroll', ()=>{
    const h=document.documentElement;
    const p=h.scrollTop/(h.scrollHeight-h.clientHeight||1);
    bar.style.width=(p*100)+'%';
  }, {passive:true});

  /* ---- audio: click blips + haptics ---- */
  let AC, muted = localStorage.getItem('cyber-muted')==='1';
  function ctx(){ if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return AC; }
  function blip(freq, dur, type){
    if(muted) return; const ac=ctx(); if(!ac) return;
    if(ac.state==='suspended') ac.resume();
    const o=ac.createOscillator(), g=ac.createGain();
    o.type=type||'square'; o.frequency.value=freq;
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.05, ac.currentTime+0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime+(dur||0.08));
    o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime+(dur||0.08));
  }
  function haptic(ms){ if(!muted && navigator.vibrate) navigator.vibrate(ms||8); }

  document.addEventListener('pointerenter', e=>{
    const t=e.target; if(t.closest && t.closest('.btn,.nav a,.chip,[data-sfx]')) blip(880,0.05,'sine');
  }, true);
  document.addEventListener('click', e=>{
    const t=e.target; if(t.closest && t.closest('.btn,.nav a,.chip,a,button,[data-sfx]')){ blip(420,0.1,'square'); haptic(10); }
  }, true);

  /* sound toggle button */
  const st=document.createElement('button');
  st.className='sound-toggle'; st.setAttribute('aria-label','toggle sound');
  st.textContent = muted ? 'SND\u00d7' : 'SND';
  st.addEventListener('click', ()=>{
    muted=!muted; localStorage.setItem('cyber-muted', muted?'1':'0');
    st.textContent = muted ? 'SND\u00d7' : 'SND';
    if(!muted) blip(660,0.08,'sine');
  });
  document.body.appendChild(st);

  /* ---- chip toggle (filters, purely visual) ---- */
  document.querySelectorAll('[data-chipgroup]').forEach(group=>{
    group.querySelectorAll('.chip').forEach(c=>{
      c.addEventListener('click', ()=>{
        if(c.hasAttribute('data-multi')){ c.classList.toggle('on'); return; }
        group.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));
        c.classList.add('on');
      });
    });
  });
})();
