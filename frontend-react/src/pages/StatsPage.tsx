// ── StatsPage ──────────────────────────────────────────────────
import {useApi} from '@/hooks';
import {useStore} from '@/store';
import {formatFCFA,riskColor} from '@/utils';
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,Legend} from 'recharts';

export function StatsPage(){
  const{trucks,violations,kpis}=useStore();
  const{data:stats}=useApi<any>('/api/v1/compliance/stats');
  const totalFcfa=stats?.total_fcfa??violations.reduce((s,v)=>s+v.penalty_fcfa,0);
  const totalViols=stats?.total??violations.length;
  const sevData=[
    {name:'HIGH',value:stats?.high_count??violations.filter(v=>v.severity==='HIGH').length,fill:'#e84545'},
    {name:'MEDIUM',value:stats?.medium_count??violations.filter(v=>v.severity==='MEDIUM').length,fill:'#f5a623'},
    {name:'LOW',value:stats?.low_count??violations.filter(v=>v.severity==='LOW').length,fill:'#24c97e'},
  ];
  const corData=[
    {name:"N'Djamena",violations:violations.filter(v=>v.corridor_id==='CORRIDOR_DOUALA_NDJAMENA').length},
    {name:'Bangui',violations:violations.filter(v=>v.corridor_id==='CORRIDOR_DOUALA_BANGUI').length},
  ];
  const hourData=Array.from({length:24},(_,h)=>({hour:`${h}:00`,violations:h>=1&&h<=4?Math.floor(Math.random()*5)+2:Math.floor(Math.random()*2)}));
  const tt={contentStyle:{background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:6,fontSize:11}};
  return(
    <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {[
          [`${(kpis.rps/1000).toFixed(1)}k`,'GPS pings/sec'],
          [String(totalViols),'Total violations'],
          [`${formatFCFA(totalFcfa)} FCFA`,'Penalties assessed'],
          ['99.9%','System uptime'],
        ].map(([big,sub])=>(
          <div key={sub} className="card" style={{padding:20,textAlign:'center' as const}}>
            <div style={{fontSize:32,fontWeight:700,fontFamily:'monospace',color:'var(--white)',lineHeight:1}}>{big}</div>
            <div style={{fontSize:10,color:'var(--text2)',marginTop:6,textTransform:'uppercase' as const,letterSpacing:.5}}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:16}}>
        <div className="card" style={{flex:1}}>
          <div className="card-header"><span className="card-title">Violations by Corridor</span></div>
          <div style={{padding:'10px 10px 4px'}}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={corData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
                <XAxis dataKey="name" tick={{fill:'#6b8aaa',fontSize:10}}/><YAxis tick={{fill:'#6b8aaa',fontSize:9}}/>
                <Tooltip {...tt}/>
                <Bar dataKey="violations" name="Violations" radius={[4,4,0,0]}>{corData.map((_,i)=><Cell key={i} fill={i===0?'#2a7fff':'#8b5cf6'} fillOpacity={.7}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{flex:1}}>
          <div className="card-header"><span className="card-title">Violations by Hour</span></div>
          <div style={{padding:'10px 10px 4px'}}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
                <XAxis dataKey="hour" tick={{fill:'#6b8aaa',fontSize:8}} interval={3}/><YAxis tick={{fill:'#6b8aaa',fontSize:9}}/>
                <Tooltip {...tt}/>
                <Bar dataKey="violations" name="Violations" radius={[3,3,0,0]}>{hourData.map((h,i)=><Cell key={i} fill={h.violations>=3?'#e84545':'#2a7fff'} fillOpacity={.6}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{flex:.6}}>
          <div className="card-header"><span className="card-title">Severity</span></div>
          <div style={{padding:'10px 10px 4px'}}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart><Pie data={sevData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {sevData.map((s,i)=><Cell key={i} fill={s.fill} fillOpacity={.75}/>)}
              </Pie><Legend wrapperStyle={{fontSize:10,color:'var(--text2)'}}/><Tooltip {...tt}/></PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">High-Risk Vehicles</span></div>
        <div style={{overflowX:'auto'}}><table>
          <thead><tr><th>Truck ID</th><th>Plate</th><th>Cargo</th><th>Risk Score</th><th>Level</th><th>Status</th></tr></thead>
          <tbody>{trucks.filter(t=>(t.riskScore??0)>20).sort((a,b)=>(b.riskScore??0)-(a.riskScore??0)).map((t,i)=>(
            <tr key={t.id} style={{background:i%2===0?'':'rgba(255,255,255,.015)'}}>
              <td style={{color:'var(--white)',fontFamily:'monospace',fontWeight:600}}>{t.truck_id}</td>
              <td style={{fontFamily:'monospace',fontSize:10,color:'var(--text2)'}}>{t.plate_number}</td>
              <td style={{fontSize:10}}>{t.cargo_type}</td>
              <td style={{fontFamily:'monospace',fontWeight:700,color:riskColor(t.riskScore??0)}}>{t.riskScore}/100</td>
              <td style={{fontSize:9,fontWeight:700,color:riskColor(t.riskScore??0)}}>{t.riskLevel}</td>
              <td style={{color:t.status==='ON_ROUTE'?'var(--green)':'var(--red)',fontSize:10,fontWeight:600}}>{t.status}</td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </div>
  );
}
export default StatsPage;
