import {useCallback,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from 'recharts';
import {useStore} from '@/store';
import {useLiveTick,useClock,useChartWindow} from '@/hooks';
import {formatFCFA,sevColor,timeAgo,riskColor} from '@/utils';

function KpiCard({label,value,sub,color}:{label:string;value:string|number;sub:string;color:string}){
  return(
    <div className="card" style={{padding:'14px 16px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:color}}/>
      <div style={{fontSize:9,color:'var(--text3)',letterSpacing:1,textTransform:'uppercase' as const,fontWeight:700,marginBottom:6}}>{label}</div>
      <div style={{fontSize:22,fontWeight:700,color:'var(--white)',fontFamily:'monospace',lineHeight:1}}>{value}</div>
      <div style={{fontSize:9,color:'var(--text2)',marginTop:4}}>{sub}</div>
    </div>
  );
}

export default function DashboardPage(){
  const{kpis,violations,alerts,trucks,tickLive,initLive}=useStore();
  const{rpsWin,p95Win,labels,push}=useChartWindow(30);
  const nav=useNavigate(); const clock=useClock();
  useEffect(()=>{initLive();},[initLive]);
  const tick=useCallback(()=>{tickLive();push(kpis.rps,kpis.p95);},[tickLive,push,kpis.rps,kpis.p95]);
  useLiveTick(tick,2000);
  const recent=[...violations].reverse().slice(0,5);
  const topRisk=[...trucks].sort((a,b)=>(b.riskScore??0)-(a.riskScore??0)).slice(0,4);
  const chartData=labels.map((l,i)=>({l,rps:rpsWin[i],p95:p95Win[i]}));
  const tt={contentStyle:{background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:6,fontSize:11}};
  return(
    <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10}}>
        <KpiCard label="GPS Pings/sec" value={kpis.rps.toLocaleString()} sub="target: 10,000" color="var(--blue)"/>
        <KpiCard label="P95 Latency"   value={`${kpis.p95}ms`}           sub="SLA: <200ms"   color="var(--teal)"/>
        <KpiCard label="Replicas"      value={kpis.replicas}              sub="all nominal"   color="var(--green)"/>
        <KpiCard label="Violations"    value={kpis.violations}            sub="today"         color="var(--amber)"/>
        <KpiCard label="FCFA Penalties" value={formatFCFA(kpis.totalFcfa)} sub="assessed"     color="var(--red)"/>
        <KpiCard label="Active Trucks"  value={trucks.length}             sub="reporting"     color="var(--purple)"/>
      </div>
      <div style={{display:'flex',gap:16}}>
        <div className="card" style={{flex:8,height:220}}>
          <div className="card-header"><span className="card-title">Throughput</span><span style={{fontSize:9,color:'var(--blue)',fontFamily:'monospace'}}>{clock} WAT</span></div>
          <div style={{padding:'8px 10px 0'}}>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
                <XAxis dataKey="l" tick={{fill:'#3d5470',fontSize:9}}/><YAxis tick={{fill:'#3d5470',fontSize:9}} tickFormatter={v=>v>=1000?`${Math.round(v/1000)}k`:String(v)}/>
                <Tooltip {...tt}/><Line type="monotone" dataKey="rps" stroke="var(--blue)" strokeWidth={1.5} dot={false} name="RPS"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{flex:4,height:220}}>
          <div className="card-header"><span className="card-title">Latency</span><span style={{fontSize:9,color:'var(--amber)',fontFamily:'monospace'}}>P95</span></div>
          <div style={{padding:'8px 10px 0'}}>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
                <XAxis dataKey="l" tick={{fill:'#3d5470',fontSize:9}}/><YAxis tick={{fill:'#3d5470',fontSize:9}} tickFormatter={v=>`${v}ms`}/>
                <Tooltip {...tt}/><Line type="monotone" dataKey="p95" stroke="var(--amber)" strokeWidth={2} dot={false} name="P95"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div style={{display:'flex',gap:16}}>
        <div className="card" style={{flex:6}}>
          <div className="card-header"><span className="card-title">Recent Violations</span><button className="btn btn-ghost btn-sm" onClick={()=>nav('/violations')}>View all</button></div>
          <div style={{overflowX:'auto'}}><table><thead><tr><th>Truck</th><th>Deviation</th><th>Severity</th><th>Penalty</th><th>Status</th><th>Time</th></tr></thead>
            <tbody>{recent.map(v=>(
              <tr key={v.id} onClick={()=>nav('/violations')}>
                <td style={{color:'var(--white)',fontFamily:'monospace',fontWeight:600}}>{v.truck_id}</td>
                <td style={{color:v.deviation_km>100?'var(--red)':'var(--amber)',fontWeight:600}}>{v.deviation_km}km</td>
                <td><span className={`badge-${v.severity.toLowerCase()}`}>{v.severity}</span></td>
                <td style={{fontFamily:'monospace',color:'var(--amber)'}}>{v.penalty_fcfa.toLocaleString()}</td>
                <td style={{color:v.status==='RESOLVED'?'var(--green)':v.status==='PENDING'?'var(--amber)':'var(--text2)',fontSize:10}}>{v.status}</td>
                <td style={{color:'var(--text3)',fontSize:10}}>{timeAgo(v.detected_at)}</td>
              </tr>
            ))}
            {recent.length===0&&<tr><td colSpan={6} style={{textAlign:'center',color:'var(--text3)',padding:20}}>No violations yet</td></tr>}
            </tbody>
          </table></div>
        </div>
        <div className="card" style={{flex:3}}>
          <div className="card-header"><span className="card-title">Alerts</span><span style={{padding:'2px 7px',borderRadius:10,fontSize:9,background:'rgba(232,69,69,.2)',color:'var(--red)',fontWeight:600}}>{alerts.filter(a=>a.type==='critical').length}</span></div>
          <div style={{padding:10,display:'flex',flexDirection:'column',gap:6,maxHeight:200,overflowY:'auto'}}>
            {alerts.slice(0,6).map(a=>(
              <div key={a.id} style={{display:'flex',gap:8,padding:'7px 10px',borderRadius:5,borderLeft:`3px solid ${a.type==='critical'?'var(--red)':a.type==='warning'?'var(--amber)':'var(--green)'}`,background:a.type==='critical'?'rgba(232,69,69,.08)':a.type==='warning'?'rgba(245,166,35,.08)':'rgba(36,201,126,.08)',fontSize:10}}>
                <span style={{color:a.type==='critical'?'var(--red)':a.type==='warning'?'var(--amber)':'var(--green)',fontWeight:700,fontSize:9,whiteSpace:'nowrap' as const}}>{a.type.toUpperCase()}</span>
                <span style={{flex:1}}>{a.msg}</span>
                <span style={{color:'var(--text3)',fontSize:9,whiteSpace:'nowrap' as const}}>{timeAgo(a.ts)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{flex:3}}>
          <div className="card-header"><span className="card-title">Top Risk</span><span style={{fontSize:9,color:'var(--purple)',fontFamily:'monospace'}}>AI scored</span></div>
          <div style={{padding:12,display:'flex',flexDirection:'column',gap:4}}>
            {topRisk.map(t=>(
              <div key={t.id} onClick={()=>nav('/risk')} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',borderBottom:'1px solid var(--border)',cursor:'pointer'}}>
                <div style={{width:28,height:28,borderRadius:4,background:'rgba(42,127,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:riskColor(t.riskScore??0),fontFamily:'monospace',flexShrink:0}}>{t.riskScore}</div>
                <div><div style={{fontSize:10,fontWeight:600,color:'var(--white)',fontFamily:'monospace'}}>{t.truck_id}</div><div style={{fontSize:9,color:'var(--text3)'}}>{t.cargo_type}</div></div>
                <div style={{marginLeft:'auto',fontSize:9,fontWeight:700,color:riskColor(t.riskScore??0)}}>{t.riskLevel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
