import {useState} from 'react';
import {analyzePos} from '@/utils';
import {useSimulator} from '@/hooks';
import api from '@/services/api';
const PRESETS=[
  {label:'Yaoundé (ON)',lat:4.9601,lon:11.8616,truck:'CE-2024-ALPHA',spd:72},
  {label:'Libreville (OFF)',lat:0.4162,lon:9.4673,truck:'CE-2024-BETA',spd:28},
  {label:'Douala Port',lat:4.0511,lon:9.7679,truck:'CE-PORT-001',spd:5},
  {label:"N'Djamena",lat:12.1048,lon:15.0445,truck:'CE-CHAD-001',spd:60},
];
export default function TelemetryPage(){
  const[form,setForm]=useState({truck_id:'CE-2024-ALPHA',lat:'4.9601',lon:'11.8616',speed:'72.5',heading:'45'});
  const[resp,setResp]=useState('// Waiting for request…');
  const[geo,setGeo]=useState('// Press Analyze Position');
  const[code,setCode]=useState('—');
  const sim=useSimulator();
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));
  const submit=async()=>{
    setResp('// Submitting…');setCode('...');
    try{const r=await api.post('/api/v1/telemetry',{truck_id:form.truck_id,latitude:+form.lat,longitude:+form.lon,speed_kmh:+form.speed||undefined});setResp(JSON.stringify(r.data,null,2));setCode('202 Accepted');}
    catch(e:any){setResp(`// Error: ${e.message}`);setCode('Error');}
  };
  const analyze=()=>setGeo(JSON.stringify(analyzePos(+form.lat,+form.lon),null,2));
  const inp=(k:string,ph:string,type='text')=>(
    <div>
      <label style={{display:'block',fontSize:10,fontWeight:600,color:'var(--text2)',textTransform:'uppercase' as const,letterSpacing:.5,marginBottom:5}}>{ph}</label>
      <input className="input" type={type} value={(form as any)[k]} onChange={e=>set(k,e.target.value)} placeholder={ph}/>
    </div>
  );
  return(
    <div className="fade-in" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <div className="card">
        <div className="card-header"><span className="card-title">Submit GPS Ping</span><code style={{fontSize:9,color:'var(--blue)'}}>POST /api/v1/telemetry</code></div>
        <div className="card-body" style={{display:'flex',flexDirection:'column',gap:12}}>
          {inp('truck_id','Truck ID')}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {inp('lat','Latitude','number')}{inp('lon','Longitude','number')}
            {inp('speed','Speed km/h','number')}{inp('heading','Heading °','number')}
          </div>
          <div>
            <label style={{fontSize:10,fontWeight:600,color:'var(--text2)',textTransform:'uppercase' as const,display:'block',marginBottom:6}}>Quick Presets</label>
            <div style={{display:'flex',gap:6,flexWrap:'wrap' as const}}>
              {PRESETS.map(p=><button key={p.label} className="btn btn-ghost btn-sm" onClick={()=>setForm({truck_id:p.truck,lat:String(p.lat),lon:String(p.lon),speed:String(p.spd),heading:'45'})}>{p.label}</button>)}
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-primary" onClick={submit}>📡 Submit Ping</button>
            <button className="btn btn-success" onClick={analyze}>🔍 Analyze</button>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">API Response</span><span style={{fontSize:9,color:'var(--green)',fontFamily:'monospace'}}>{code}</span></div>
        <div className="card-body" style={{display:'flex',flexDirection:'column',gap:10}}>
          <pre style={{background:'var(--bg3)',borderRadius:5,padding:12,fontSize:11,fontFamily:'monospace',color:'var(--teal)',minHeight:100,whiteSpace:'pre-wrap' as const,borderLeft:'3px solid var(--teal)'}}>{resp}</pre>
          <div>
            <div style={{fontSize:10,fontWeight:600,color:'var(--text2)',textTransform:'uppercase' as const,marginBottom:5}}>Geofence Result</div>
            <pre style={{background:'var(--bg3)',borderRadius:5,padding:12,fontSize:11,fontFamily:'monospace',color:geo.includes('ON_ROUTE')?'var(--green)':geo.includes('OFF_ROUTE')?'var(--red)':'var(--text2)',minHeight:70,whiteSpace:'pre-wrap' as const}}>{geo}</pre>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">GPS Simulator</span></div>
        <div className="card-body" style={{display:'flex',flexDirection:'column',gap:12}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div><label style={{fontSize:10,color:'var(--text2)',display:'block',marginBottom:5}}>TARGET RPS</label><input className="input" type="number" id="sim-rps" defaultValue={100} min={1} max={10000}/></div>
            <div><label style={{fontSize:10,color:'var(--text2)',display:'block',marginBottom:5}}>DURATION (s)</label><input className="input" type="number" id="sim-dur" defaultValue={30}/></div>
          </div>
          <button className={`btn ${sim.running?'btn-danger':'btn-success'}`} onClick={()=>{if(sim.running){sim.stop();}else{sim.start(+(document.getElementById('sim-rps') as HTMLInputElement)?.value||100,+(document.getElementById('sim-dur') as HTMLInputElement)?.value||30);}}}>
            {sim.running?'⏹ Stop':'▶ Start Simulator'}
          </button>
          <pre style={{background:'var(--bg3)',borderRadius:5,padding:12,fontSize:11,fontFamily:'monospace',color:'var(--text)',minHeight:70,whiteSpace:'pre-wrap' as const}}>
            {sim.running?`Elapsed: ${sim.elapsed}s\nSent: ${sim.sent.toLocaleString()} pings\nStatus: RUNNING`:'Simulator ready — press Start'}
          </pre>
        </div>
      </div>
    </div>
  );
}
