import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

const stages = [
  { minute: 0, label: 'Question', note: 'Find the signal', status: 'INITIALIZING', distance: 0 },
  { minute: 1.25, label: 'Map', note: 'Connect the pieces', status: 'MAPPING SYSTEMS', distance: 1.8 },
  { minute: 2.8, label: 'Prototype', note: 'Make it tangible', status: 'BUILDING PROTOTYPE', distance: 4.6 },
  { minute: 4.1, label: 'Refine', note: 'Tune the details', status: 'REFINING OUTPUT', distance: 7.2 },
  { minute: 5.6, label: 'Ship', note: 'Put it to work', status: 'READY TO SHIP', distance: 10.4 },
];
const routeOrder = [0, 3, 7, 8, 12, 17, 19, 23, 25, 21, 16, 14, 10, 6, 9, 13, 18, 22, 24];

function NetworkCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current, ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return;
    let raf = 0;
    const draw = now => {
      const box = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 1.5), w = Math.max(1, box.width), h = Math.max(1, box.height);
      if (canvas.width !== Math.round(w*dpr) || canvas.height !== Math.round(h*dpr)) { canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr); }
      ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
      const pts = Array.from({length:26},(_,i)=>{const a=i*2.399,r=Math.sqrt(i/26)*.43+.03;return{x:w/2+Math.cos(a)*r*Math.min(w,h)*1.15,y:h/2+Math.sin(a)*r*Math.min(w,h)*.82};});
      ctx.lineWidth=1;ctx.strokeStyle='rgba(233,237,230,.17)';
      pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{if(Math.hypot(a.x-b.x,a.y-b.y)<Math.min(w,h)*.23){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}));
      pts.forEach(p=>{ctx.fillStyle='rgba(233,237,230,.4)';ctx.beginPath();ctx.arc(p.x,p.y,1.7,0,Math.PI*2);ctx.fill();});
      const stage=canvas.closest('[data-scroll-stage]'),p=Number(stage?.style.getPropertyValue('--p')||0),route=routeOrder.map(i=>pts[i]);
      const total=route.reduce((sum,pt,i)=>i?sum+Math.hypot(pt.x-route[i-1].x,pt.y-route[i-1].y):0,0);let left=total*p,head=route[0];
      ctx.beginPath();ctx.moveTo(route[0].x,route[0].y);ctx.strokeStyle='#E44B3C';ctx.lineWidth=2.6;ctx.lineCap='round';ctx.lineJoin='round';
      for(let i=1;i<route.length;i++){const prev=route[i-1],next=route[i],len=Math.hypot(next.x-prev.x,next.y-prev.y);if(left>=len){ctx.lineTo(next.x,next.y);left-=len;head=next;}else{const t=len?left/len:0;head={x:prev.x+(next.x-prev.x)*t,y:prev.y+(next.y-prev.y)*t};ctx.lineTo(head.x,head.y);break;}}
      ctx.stroke();const pulse=4+Math.sin(now*.006)*1.4;ctx.fillStyle='rgba(228,75,60,.18)';ctx.beginPath();ctx.arc(head.x,head.y,pulse*3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#E44B3C';ctx.beginPath();ctx.arc(head.x,head.y,pulse,0,Math.PI*2);ctx.fill();raf=requestAnimationFrame(draw);
    };
    raf=requestAnimationFrame(draw);return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} className="route-canvas" aria-label="Scroll-traced network route"/>;
}

function CurveCanvas() {
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current,ctx=canvas?.getContext('2d');if(!canvas||!ctx)return;let raf=0;
    const draw=now=>{const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5),w=Math.max(1,r.width),h=Math.max(1,r.height);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.strokeStyle='rgba(233,237,230,.09)';for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(0,h*i/5);ctx.lineTo(w,h*i/5);ctx.stroke();}const vals=[92,74,81,52,36,28,19],pts=vals.map((v,i)=>({x:18+(w-36)*i/(vals.length-1),y:18+(h-36)*(1-v/100)})),stage=canvas.closest('[data-scroll-stage]'),p=Number(stage?.style.getPropertyValue('--p')||0);ctx.beginPath();pts.forEach((pt,i)=>i?ctx.lineTo(pt.x,pt.y):ctx.moveTo(pt.x,pt.y));ctx.strokeStyle='rgba(233,237,230,.23)';ctx.lineWidth=1.2;ctx.stroke();const f=p*(pts.length-1),idx=Math.min(pts.length-2,Math.floor(f)),t=f-idx,head={x:pts[idx].x+(pts[idx+1].x-pts[idx].x)*t,y:pts[idx].y+(pts[idx+1].y-pts[idx].y)*t};ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<=idx;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.lineTo(head.x,head.y);ctx.strokeStyle='#E44B3C';ctx.lineWidth=2.4;ctx.lineCap='round';ctx.stroke();ctx.fillStyle='rgba(228,75,60,.17)';ctx.beginPath();ctx.arc(head.x,head.y,13+Math.sin(now*.006)*2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#E44B3C';ctx.beginPath();ctx.arc(head.x,head.y,4,0,Math.PI*2);ctx.fill();raf=requestAnimationFrame(draw);};raf=requestAnimationFrame(draw);return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} className="curve-canvas" aria-label="Scroll-traced process curve"/>;
}

function formatTime(seconds){const s=Math.round(seconds);return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}

export function ScrollExperiences(){
  useEffect(()=>{
    const stageEls=[...document.querySelectorAll('[data-scroll-stage]')];let raf=0;
    const update=()=>{raf=0;const vh=innerHeight||1;stageEls.forEach(stage=>{const r=stage.getBoundingClientRect(),p=Math.max(0,Math.min(1,-r.top/Math.max(1,stage.offsetHeight-vh)));stage.style.setProperty('--p',p.toFixed(4));stage.style.setProperty('--clip',`${100-p*100}%`);stage.style.setProperty('--percent',`${p*100}%`);stage.style.setProperty('--scale',String(.72+p*.5));if(stage.classList.contains('timeline-stage')){const scaled=p*(stages.length-1),idx=Math.min(stages.length-1,Math.floor(scaled)),t=scaled-idx,a=stages[idx],b=stages[Math.min(idx+1,stages.length-1)],mins=a.minute+(b.minute-a.minute)*t,dist=a.distance+(b.distance-a.distance)*t;stage.querySelectorAll('.timeline-row').forEach((row,i)=>row.classList.toggle('row-lit',i<=Math.floor(p*stages.length)));stage.querySelector('[data-clock]').textContent=formatTime(mins*60);stage.querySelector('[data-distance]').textContent=dist.toFixed(1);stage.querySelector('[data-status]').textContent=a.status;}});};
    const onScroll=()=>{if(!raf)raf=requestAnimationFrame(update);};update();addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);
    const typing=[...document.querySelectorAll('[data-typing]')];let timers=[],typeOffset=0;typing.forEach((el)=>{const text=el.dataset.typing||'';el.innerHTML='';[...text].forEach((char,i)=>{const span=document.createElement('span');span.className='typing-char';span.textContent=char===' '?'\u00a0':char;el.appendChild(span);const id=setTimeout(()=>span.classList.add('typed'),(typeOffset+i)*50+300);timers.push(id);});typeOffset+=text.length;el.classList.add('typing-ready');});
    document.querySelectorAll('[data-vertical-text]').forEach(node=>{if(node.dataset.splitDone)return;const text=(node.innerHTML||'').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]*>/g,'');node.innerHTML='';[...text].forEach((char,i)=>{if(char==='\n'){node.appendChild(document.createElement('br'));return;}const span=document.createElement('span');span.className='vertical-char';span.style.setProperty('--char-delay',`${i*36}ms`);span.textContent=char===' '?'\u00a0':char;node.appendChild(span);});node.dataset.splitDone='true';});
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12});document.querySelectorAll('[data-rev], [data-vertical-text]').forEach((el,i)=>{el.style.setProperty('--d',`${(i%8)*60}ms`);observer.observe(el);});
    return()=>{removeEventListener('scroll',onScroll);removeEventListener('resize',onScroll);if(raf)cancelAnimationFrame(raf);timers.forEach(clearTimeout);observer.disconnect();};
  },[]);
  return <div className="motion-world">
    <section className="wipe-stage" data-scroll-stage style={{height:'260svh'}}><div className="pin-shell"><div className="wipe-content"><p className="eyebrow mono" data-rev>01 / THE THESIS</p><h2 className="wipe-statement" data-rev><span className="wipe-base">We make the next<br/>thing <em>possible.</em></span><span className="wipe-fill" aria-hidden="true">We make the next<br/>thing <em>possible.</em></span></h2><div className="wipe-rule"><i/></div><div className="wipe-facts"><span data-rev>01 / THINK CLEARLY</span><span data-rev>02 / BUILD DELIBERATELY</span><span data-rev>03 / SHIP USEFULLY</span></div></div></div></section>
    <section className="timeline-stage" data-scroll-stage style={{height:'400svh'}}><div className="pin-shell timeline-layout"><div className="timeline-copy"><p className="eyebrow mono" data-rev>02 / THE PROCESS</p><h2 data-vertical-text>Ideas become systems.</h2><p className="timeline-lede" data-rev>Every useful product moves through deliberate decisions. Follow the progress, one stage at a time.</p><div className="timeline-rows">{stages.map((s,i)=><div key={s.label} className="timeline-row" data-rev><span className="mono">{`0${i+1} / ${String(Math.round(s.minute*60)).padStart(2,'0')}s`}</span><strong>{s.label}</strong><span>{s.note}</span></div>)}</div></div><div className="timeline-visual"><aside className="timeline-panel"><div className="panel-top"><span>RUN / RX-05</span><span className="live-state"><i/> <b data-status>INITIALIZING</b></span></div><p className="panel-label">ELAPSED</p><strong className="panel-clock" data-clock>00:00</strong><div className="panel-distance"><span>DISTANCE MAPPED</span><strong><b data-distance>0.0</b> <small>KM</small></strong></div><div className="panel-meter"><i/></div></aside><div className="curve-plot"><CurveCanvas/><div className="plot-caption"><span>PROCESS CURVE / RX-05</span><span>LIVE INTERPOLATION</span></div></div></div></div></section>
    <section className="route-stage" data-scroll-stage style={{height:'300svh'}}><div className="pin-shell route-layout"><div className="route-visual"><NetworkCanvas/></div><div className="route-copy"><p className="eyebrow mono" data-rev>03 / CONNECTED BY DESIGN</p><h2 data-vertical-text>One clear route.<br/><em>Many moving parts.</em></h2><p data-rev>We connect ideas, people, and systems into one purposeful direction. The route draws itself as you move through the story.</p><div className="route-status mono" data-rev><i/> NETWORK TRACE / ACTIVE</div></div></div></section>
    <section className="molten-stage" data-scroll-stage style={{height:'300svh'}}><div className="pin-shell molten-layout"><div className="molten-field" aria-hidden="true"><div className="molten-form form-one"/><div className="molten-form form-two"/><div className="molten-form form-three"/></div><div className="molten-copy"><p className="eyebrow mono" data-rev>04 / THE OUTCOME</p><h2 data-vertical-text>Make ideas<br/><em>matter.</em></h2><p data-rev>Thoughtful engineering, restless curiosity, and a little bit of heat. That is how the next thing starts to take shape.</p><a className="button button-primary" href="#products" data-rev>Explore the universe <ArrowUpRight size={17}/></a></div></div></section>
    <section className="motion-bands section-pad"><div className="motion-band-heading"><p className="eyebrow mono" data-rev>05 / THE METHOD</p><h2 data-vertical-text>Build with intention.</h2></div><div className="motion-columns"><article data-rev><span className="mono">01 / CLARITY</span><h3>Find the signal.</h3><p>Good work begins with understanding the problem, not decorating the solution.</p></article><article data-rev><span className="mono">02 / CRAFT</span><h3>Respect the details.</h3><p>Type, motion, structure, and accessibility are part of the product itself.</p></article><article data-rev><span className="mono">03 / MOMENTUM</span><h3>Ship the useful thing.</h3><p>Progress means turning the right idea into something people can actually use.</p></article></div><div className="motion-rates"><div className="rates-heading"><span className="mono">CAPABILITY / RAYX</span><span className="mono">OUR OPERATING PRINCIPLES</span></div>{[['Product thinking','Make the problem clear first','01'],['Engineering','Build it to last','02'],['Experiments','Learn in public, refine in private','03'],['Delivery','Finish with purpose','04']].map(([name,desc,n])=><div className="rate-row" key={name} data-rev><strong>{name}</strong><span>{desc}</span><b>{n}</b></div>)}</div><div className="motion-faq"><p className="eyebrow mono" data-rev>QUESTIONS, ANSWERED</p><details data-rev><summary>What is RayX?</summary><p>RayX is an independent technology brand exploring useful AI, learning tools, and carefully built digital products.</p></details><details data-rev><summary>What are you building?</summary><p>RayX AI, RayX Exam, RayX Labs, and new experiments as ideas earn their way into reality.</p></details><details data-rev><summary>Can I collaborate with RayX?</summary><p>Yes. Use the contact section below to start a conversation about projects, ideas, or experiments.</p></details></div></section>
  </div>;
}
