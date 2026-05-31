// ViolationsPage
import {useState,useMemo,useEffect} from 'react';
import {useStore} from '@/store';
import {timeAgo} from '@/utils';
import type {Violation} from '@/types';

function Modal({v,onClose,onAck}:{v:Violation;onClose:()=>void;onAck:()=>void}){
  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(8,12,20,.85)',backdropFilter:'blur(4px)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'var(--bg2)',border:'1px solid var(--border2)',borderRadius:10,padding:24,width:480,maxWidth:'90vw',maxHeight:'80vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <span style={{fontSize:14,fontWeight:700,color:'var(--white)'}}>Violation — {v.id}</span>
          <button onClick={onClose} style={{background:'none',border:'none',color:'var(--text3)',fontSize:20,cursor:'pointer'}}>×</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,fontFamily:'monospace',fontSize:11}}>
          {[['Truck',v.truck_id],['Corridor',v.corridor_id||'—'],['Location',`${v.latitude?.toFixed(4)}°N, ${v.longitude?.toFixed(4)}°E`],['Deviation',`${v.deviation_km} km`],['Severity',v.severity],['Penalty',`${v.penalty_fcfa?.toLocaleString()} FCFA`],['Status',v.status],['Detected',new Date(v.detected_at).toLocaleString()],['Ack by',v.acknowledged_by||'—']].map(([k,val])=>(
            <div key={k}><div style={{color:'var(--text3)',fontSize:9,marginBottom:3}}>{k}</div><div style={{color:'var(--white)'}}>{val}</div></div>
          ))}
        </div>
        <div style={{display:'flex',gap:8,marginTop:16}}>
          {v.status==='PENDING'&&<button className="btn btn-success" onClick={onAck}>✓ Acknowledge</button>}
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export function ViolationsPage(){
  const{violations,loadViolations,acknowledgeViolation}=useStore();
  const[sev,setSev]=useState('');const[cor,setCor]=useState('');const[st,setSt]=useState('');const[q,setQ]=useState('');const[sel,setSel]=useState<Violation|null>(null);
  useEffect(()=>{loadViolations();},[loadViolations]);
  const filtered=useMemo(()=>violations.filter(v=>{if(sev&&v.severity!==sev)return false;if(cor&&v.corridor_id!==cor)return false;if(st&&v.status!==st)return false;if(q&&!v.truck_id.toLowerCase().includes(q.toLowerCase()))return false;return true;}),[violations,sev,cor,st,q]);
  const ss={background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:5,padding:'6px 10px',color:'var(--text)',fontFamily:'monospace',fontSize:11,outline:'none'};
  return(
    <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap' as const}}>
        <h2 style={{fontSize:13,fontWeight:700,color:'var(--text2)',letterSpacing:1,textTransform:'uppercase' as const,fontFamily:'monospace',marginRight:'auto'}}>Violations</h2>
        <select style={ss} value={sev} onChange={e=>setSev(e.target.value)}><option value="">All Severity</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select>
        <select style={ss} value={cor} onChange={e=>setCor(e.target.value)}><option value="">All Corridors</option><option value="CORRIDOR_DOUALA_NDJAMENA">N'Djamena</option><option value="CORRIDOR_DOUALA_BANGUI">Bangui</option></select>
        <select style={ss} value={st} onChange={e=>setSt(e.target.value)}><option value="">All Status</option><option>PENDING</option><option>ACKNOWLEDGED</option><option>CONTESTED</option><option>RESOLVED</option></select>
        <input className="input" style={{width:170,fontSize:11}} placeholder="Search truck…" value={q} onChange={e=>setQ(e.target.value)}/>
        <button className="btn btn-ghost btn-sm" onClick={loadViolations}>↺</button>
      </div>
      <div className="card">
        <div style={{overflowX:'auto'}}><table><thead><tr><th>#</th><th>Truck</th><th>Corridor</th><th>Deviation</th><th>Severity</th><th>Penalty</th><th>Status</th><th>Detected</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map((v,i)=>(
              <tr key={v.id} onClick={()=>setSel(v)}>
                <td style={{color:'var(--text3)'}}>{i+1}</td>
                <td style={{color:'var(--white)',fontWeight:600,fontFamily:'monospace'}}>{v.truck_id}</td>
                <td>{v.corridor_id==='CORRIDOR_DOUALA_NDJAMENA'?<span className="tag-ndjamena">N'Djamena</span>:v.corridor_id?<span className="tag-bangui">Bangui</span>:<span style={{color:'var(--text3)',fontSize:10}}>—</span>}</td>
                <td style={{color:v.deviation_km>100?'var(--red)':'var(--amber)',fontWeight:600,fontFamily:'monospace'}}>{v.deviation_km}km</td>
                <td><span className={`badge-${v.severity.toLowerCase()}`}>{v.severity}</span></td>
                <td style={{fontFamily:'monospace',color:'var(--amber)'}}>{v.penalty_fcfa?.toLocaleString()}</td>
                <td style={{color:v.status==='RESOLVED'?'var(--green)':v.status==='PENDING'?'var(--amber)':'var(--text2)',fontSize:10,fontWeight:600}}>{v.status}</td>
                <td style={{fontSize:9,color:'var(--text2)'}}>{new Date(v.detected_at).toLocaleString('en-GB',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'})}</td>
                <td>{v.status==='PENDING'&&<button className="btn btn-ghost btn-sm" style={{fontSize:9,color:'var(--green)',borderColor:'rgba(36,201,126,.3)'}} onClick={e=>{e.stopPropagation();acknowledgeViolation(v.id);}}>Ack</button>}</td>
              </tr>
            ))}
            {filtered.length===0&&<tr><td colSpan={9} style={{textAlign:'center',color:'var(--text3)',padding:32}}>No violations matching filters</td></tr>}
          </tbody>
        </table></div>
      </div>
      {sel&&<Modal v={sel} onClose={()=>setSel(null)} onAck={()=>{acknowledgeViolation(sel.id);setSel(null);}}/>}
    </div>
  );
}
export default ViolationsPage;
