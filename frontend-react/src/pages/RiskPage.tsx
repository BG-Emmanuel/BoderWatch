// ── RiskPage ──────────────────────────────────────────────────
import {useState} from 'react';
import {useStore} from '@/store';
import {riskColor} from '@/utils';
import type {Truck} from '@/types';

const AI={
  '24h':`BORDERWATCH INTELLIGENCE — ${new Date().toLocaleDateString('en-GB')}\n\n📊 24-HOUR SUMMARY\n${'━'.repeat(30)}\nPeak hour: 02:00–04:00 WAT\nTop offender: CE-2024-BETA (6 violations)\nTotal FCFA: 18.6M FCFA\n\nRECOMMENDATION: Deploy 2 field units tonight near Ngaoundéré.`,
  'top':`TOP RISK TRUCK\n${'━'.repeat(30)}\nTruck: CE-2024-BETA\nScore: 94/100 (CRITICAL)\nCargo: Petroleum ×1.8\nViolations: 6 historical\n\nACTION: STOP AND INSPECT IMMEDIATELY`,
  'hot':`HOTSPOT DETECTION\n${'━'.repeat(30)}\n🔴 ~6.1°N, 14.8°E\nWindow: 01:00–04:00 WAT\n12 trucks within 15km · Z=3.4\n\nACTION: Deploy 2 field units tonight.`,
};

function RiskCard({t,selected,onClick}:{t:Truck;selected:boolean;onClick:()=>void}){
  const col=riskColor(t.riskScore??0);
  const bar=(t.riskScore??0)>=70?'#e84545':(t.riskScore??0)>=40?'#f5a623':'#24c97e';
  return(
    <div onClick={onClick} style={{background:'var(--bg3)',borderRadius:6,padding:12,border:`1px solid ${selected?'var(--blue)':'var(--border)'}`,cursor:'pointer',transition:'all .2s'}}>
      <div style={{fontFamily:'monospace',fontSize:10,fontWeight:600,color:'var(--white)',marginBottom:3}}>{t.truck_id}</div>
      <div style={{fontSize:9,color:'var(--text3)',marginBottom:8}}>{t.cargo_type}</div>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
        <div style={{flex:1,background:'rgba(255,255,255,.06)',borderRadius:3,height:5,overflow:'hidden'}}>
          <div style={{height:'100%',borderRadius:3,background:bar,width:`${t.riskScore??0}%`,transition:'width .5s'}}/>
        </div>
        <div style={{fontFamily:'monospace',fontSize:15,fontWeight:700,color:col,minWidth:28,textAlign:'right' as const}}>{t.riskScore}</div>
      </div>
      <div style={{fontSize:9,fontWeight:700,color:col}}>{t.riskLevel}</div>
    </div>
  );
}

export function RiskPage(){
  const{trucks}=useStore();
  const[selIdx,setSelIdx]=useState<number|null>(null);
  const[chat,setChat]=useState('Click a query or type a question…');
  const[query,setQuery]=useState('');
  const ask=(q:string)=>{setChat('⏳ Analyzing with claude-sonnet-4-6…');setTimeout(()=>{const k=Object.keys(AI).find(k=>q.toLowerCase().includes(k));setChat(AI[(k??'24h') as keyof typeof AI]);setQuery('');},500+Math.random()*500);};
  const sel=selIdx!==null?trucks[selIdx]:null;
  return(
    <div className="fade-in" style={{display:'flex',gap:16,alignItems:'flex-start'}}>
      <div className="card" style={{flex:6}}>
        <div className="card-header"><span className="card-title">🧠 AI Risk Scores</span><span style={{fontSize:9,color:'var(--purple)',fontFamily:'monospace'}}>Z-score + Kalman filter</span></div>
        <div className="card-body">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:sel?8:0}}>
            {trucks.map((t,i)=><RiskCard key={t.id} t={t} selected={selIdx===i} onClick={()=>setSelIdx(selIdx===i?null:i)}/>)}
          </div>
          {sel&&(
            <div style={{background:'var(--bg3)',borderRadius:6,padding:12,border:'1px solid var(--border)',marginTop:8}}>
              <div style={{fontSize:10,color:'var(--text2)',marginBottom:8,fontFamily:'monospace',textTransform:'uppercase' as const}}>Breakdown — {sel.truck_id}</div>
              {[['Historical violations',`${Math.min((sel.riskScore??0)*0.4,40).toFixed(0)}/40`],['Corridor deviation',sel.status==='OFF_ROUTE'?'25/30':'0/30'],['Speed anomaly',`${Math.round(Math.abs((sel.speed??0)-72)/72*15)}/15`],['Time of day','0/10'],['Journey','0/5'],['Cargo multiplier',`×${sel.cargo_type==='PETROLEUM'?1.8:sel.cargo_type==='ELECTRONICS'?1.6:1.0}`],['SCORE',`${sel.riskScore}/100`]].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'3px 0',borderBottom:'1px solid rgba(255,255,255,.04)',fontSize:10}}>
                  <span style={{color:'var(--text2)'}}>{k}</span><span style={{fontFamily:'monospace',fontWeight:600}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:8,padding:'6px 10px',borderRadius:4,textAlign:'center' as const,fontSize:10,fontWeight:600,fontFamily:'monospace',background:(sel.riskScore??0)>=70?'rgba(232,69,69,.15)':'rgba(245,166,35,.15)',color:riskColor(sel.riskScore??0)}}>
                {(sel.riskScore??0)>=70?'🚨 STOP AND INSPECT IMMEDIATELY':(sel.riskScore??0)>=40?'⚠ FLAG FOR PRIORITY INSPECTION':'✓ ROUTINE MONITORING'}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="card" style={{flex:6}}>
        <div className="card-header"><span className="card-title">✨ AI Intelligence</span><span style={{fontSize:9,color:'var(--purple)',fontFamily:'monospace'}}>claude-sonnet-4-6</span></div>
        <div className="card-body" style={{display:'flex',flexDirection:'column',gap:10}}>
          <div style={{display:'flex',gap:6,flexWrap:'wrap' as const}}>
            {[['24h','24h Summary'],['top','Top Risk Truck'],['hot','Hotspot Alert']].map(([k,l])=>(
              <button key={k} className="btn btn-ghost btn-sm" onClick={()=>ask(k)}>{l}</button>
            ))}
          </div>
          <pre style={{background:'var(--bg3)',borderRadius:6,padding:12,fontSize:10,fontFamily:'monospace',color:'var(--teal)',minHeight:220,whiteSpace:'pre-wrap' as const,lineHeight:1.7,overflowY:'auto',flex:1}}>{chat}</pre>
          <div style={{display:'flex',gap:8}}>
            <input className="input" style={{flex:1,fontSize:11}} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ask a question…" onKeyDown={e=>e.key==='Enter'&&query&&ask(query)}/>
            <button className="btn btn-primary btn-sm" onClick={()=>query&&ask(query)}>Ask</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RiskPage;
