// app.js — v3 advanced UI (no backend). Uses CONFIG from config.js
(function(){
  const LS_KEY = CONFIG.analyticsKeyPrefix + CONFIG.alias;
  const root = document.documentElement;
  // init theme default
  const storedTheme = localStorage.getItem('dorm_theme') || 'dark';
  root.setAttribute('data-theme', storedTheme);

  // apply accents to CSS variables
  function applyAccents(){
    root.style.setProperty('--accent-a', CONFIG.accentA || '#7c3aed');
    root.style.setProperty('--accent-b', CONFIG.accentB || '#06b6d4');
    root.style.setProperty('--accent-gradient', `linear-gradient(90deg, ${CONFIG.accentA}, ${CONFIG.accentB})`);
  }

  function qs(sel, el=document){ return el.querySelector(sel) }
  function qsa(sel, el=document){ return Array.from(el.querySelectorAll(sel)) }
  function saveJSON(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  function loadJSON(k){ try{ const r = localStorage.getItem(k); return r?JSON.parse(r):{} }catch(e){return{}} }
  function nowStr(){ return new Date().toLocaleString() }

  // particles background (canvas)
  function createParticles(){
    const canvas = document.createElement('canvas');
    canvas.style.position='fixed'; canvas.style.inset='0'; canvas.style.zIndex='0'; canvas.style.pointerEvents='none';
    const ctx = canvas.getContext('2d');
    let w=canvas.width=innerWidth, h=canvas.height=innerHeight;
    window.addEventListener('resize', ()=>{ w=canvas.width=innerWidth; h=canvas.height=innerHeight; });
    document.getElementById('particles-bg').appendChild(canvas);
    const pts = [];
    for(let i=0;i<60;i++){
      pts.push({x:Math.random()*w, y:Math.random()*h, r:Math.random()*1.8+0.6, vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3});
    }
    function tick(){
      ctx.clearRect(0,0,w,h);
      for(let p of pts){
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0) p.x=w; if(p.x>w) p.x=0;
        if(p.y<0) p.y=h; if(p.y>h) p.y=0;
        // draw soft dot
        const g = ctx.createRadialGradient(p.x,p.y,p.r,p.x,p.y,p.r*10);
        g.addColorStop(0, CONFIG.accentA+'22');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*8,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  function init(){
    applyAccents();
    createParticles();
    renderProfile();
    renderLinks();
    wireActions();
    fancyEntrance();
    setupTilt('#profileCard');
    setupRipple();
    qs('#timeNow').textContent = nowStr();
  }

  function renderProfile(){
    qs('#displayName').textContent = CONFIG.displayName;
    qs('#bio').textContent = CONFIG.bio;
    qs('#alias').textContent = CONFIG.alias;
    const img = qs('#avatar img'); img.src = CONFIG.avatar;
    qs('#pinnedCount').textContent = CONFIG.links.filter(x=>x.pinned).length;
  }

  function totalClicks(stats){
    return Object.values(stats).reduce((s,n)=>s+(+n||0),0);
  }

  function renderLinks(filter=''){
    const container = qs('#links');
    container.innerHTML='';
    const stats = loadJSON(LS_KEY);
    const items = CONFIG.links.filter(l=>{
      if(!filter) return true;
      const f = filter.toLowerCase();
      return (l.title||'').toLowerCase().includes(f) || (l.emoji||'').includes(f);
    }).sort((a,b)=> (b.pinned?1:0)-(a.pinned?1:0));

    items.forEach(l=>{
      const el = document.createElement('a');
      el.className='link-card';
      el.href = l.url;
      el.target = '_blank'; el.rel='noopener noreferrer';
      el.dataset.id = l.id;
      el.innerHTML = `<div class="link-left"><div class="pin" aria-hidden>${l.emoji||'🔗'}</div><div><div class="link-title">${l.title}</div><div class="link-sub">${l.url.replace(/^https?:\/\//,'')}</div></div></div><div class="link-meta"><div class="tiny muted">${stats[l.id]||0}</div></div>`;
      el.addEventListener('click', (e)=>{
        const s = loadJSON(LS_KEY); s[l.id] = (s[l.id]||0)+1; saveJSON(LS_KEY,s);
        qs('#totalClicks').textContent = totalClicks(s);
        // tiny pop
        el.animate([{transform:'scale(1)'},{transform:'scale(.985)'}],{duration:140,fill:'forwards'});
      });
      container.appendChild(el);
    });
  }

  function wireActions(){
    qs('#copyAliasBtn').addEventListener('click', ()=>{
      const url = `${location.origin}/${CONFIG.alias}`;
      navigator.clipboard.writeText(url).then(()=>{ const b=qs('#copyAliasBtn'); b.textContent='Copied!'; setTimeout(()=>b.textContent='Copy',1200); }).catch(()=>alert('Copy failed.'));
    });
    qs('#shareBtn').addEventListener('click', ()=>{
      const url = `${location.origin}/${CONFIG.alias}`;
      if(navigator.share){ navigator.share({title:CONFIG.displayName,text:CONFIG.bio,url}).catch(()=>{}); } else { navigator.clipboard.writeText(url).then(()=>alert('Link copied to clipboard!')); }
    });
    qs('#resetAnalytics').addEventListener('click', ()=>{ if(confirm('Reset local analytics?')){ localStorage.removeItem(LS_KEY); qs('#totalClicks').textContent='0'; renderLinks(qs('#searchInput').value||''); } });
    qs('#ctaBtn').addEventListener('click', ()=>{ const pinned = CONFIG.links.find(l=>l.pinned) || CONFIG.links[0]; if(pinned) window.open(pinned.url,'_blank'); });
    qs('#searchInput').addEventListener('input', (e)=> renderLinks(e.target.value||''));
    qs('#themeToggle').addEventListener('click', ()=>{ const cur = root.getAttribute('data-theme')||'dark'; const next = cur==='dark'?'light':'dark'; root.setAttribute('data-theme', next); localStorage.setItem('dorm_theme', next); });
  }

  function fancyEntrance(){
    // fade in cards sequentially
    const cards = Array.from(document.querySelectorAll('.card'));
    cards.forEach((c,i)=>{ c.style.opacity=0; c.style.transform='translateY(18px)'; setTimeout(()=>{ c.style.transition='opacity .6s var(--ease), transform .6s var(--ease)'; c.style.opacity=1; c.style.transform='translateY(0)'; }, 120 + i*80); });
  }

  // simple tilt on hover for element selector (desktop only)
  function setupTilt(sel){
    const el = qs(sel);
    if(!el) return;
    let rect = null;
    function onMove(e){
      if(window.innerWidth < 880) return;
      rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rx = y * 6; const ry = x * -8;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
    function onLeave(){ el.style.transform = ''; }
    el.addEventListener('mousemove', onMove); el.addEventListener('mouseleave', onLeave);
  }

  // ripple effect when clicking links
  function setupRipple(){
    document.addEventListener('click', (e)=>{
      const target = e.target.closest('.link-card');
      if(!target) return;
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      ripple.style.left = x + 'px'; ripple.style.top = y + 'px';
      ripple.style.background = CONFIG.accentA || '#7c3aed';
      target.appendChild(ripple);
      ripple.animate([{opacity:0.16, transform:'scale(0)'},{opacity:0, transform:'scale(18)'}],{duration:600,easing:'cubic-bezier(.2,.8,.2,1)'});
      setTimeout(()=>{ try{ target.removeChild(ripple) }catch(e){} },700);
    });
  }

  // tiny helper: animate avatar hover pulse
  qs('#avatar') && qs('#avatar').addEventListener('mouseenter', ()=>{ qs('#avatar').style.transform='translateY(-6px) scale(1.02)'; });
  qs('#avatar') && qs('#avatar').addEventListener('mouseleave', ()=>{ qs('#avatar').style.transform=''; });

  // init sequence
  applyAccents();
  document.addEventListener('DOMContentLoaded', init);
})();
