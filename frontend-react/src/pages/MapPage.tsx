// MapPage
import {MapContainer,TileLayer,Polyline,CircleMarker,Popup,Tooltip as LTooltip} from 'react-leaflet';
import {useStore} from '@/store';
import {useLiveTick} from '@/hooks';
import {CORRIDORS,riskColor} from '@/utils';
export function MapPage(){
  const{trucks,tickLive}=useStore(); useLiveTick(tickLive,2000);
  const on=trucks.filter(t=>t.status==='ON_ROUTE').length,off=trucks.filter(t=>t.status==='OFF_ROUTE').length;
  return(
    <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:16}}>
      <div className="card" style={{height:480}}>
        <div className="card-header">
          <span className="card-title">🗺 CEMAC Live Corridor Map</span>
          <div style={{display:'flex',gap:16,fontSize:10,fontFamily:'monospace'}}>
            <span style={{color:'var(--green)'}}>● ON_ROUTE: {on}</span>
            <span style={{color:'var(--red)'}}>● OFF_ROUTE: {off}</span>
            <span style={{color:'var(--text3)'}}>Total: {trucks.length}</span>
          </div>
        </div>
        <div style={{height:'calc(100% - 45px)',position:'relative'}}>
          <MapContainer center={[7.5,13.5]} zoom={5} style={{height:'100%',width:'100%',borderRadius:'0 0 8px 8px'}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {CORRIDORS.map(c=>(
              <Polyline key={c.id} positions={c.wps.map(w=>[w.lat,w.lon] as [number,number])} pathOptions={{color:c.color,weight:3,opacity:.7}}>
                <LTooltip sticky>{c.name} (±{c.tol}km)</LTooltip>
              </Polyline>
            ))}
            {trucks.filter(t=>t.lat&&t.lon).map(t=>{const col=t.status==='ON_ROUTE'?'#24c97e':(t.riskScore??0)>=70?'#e84545':'#f5a623';return(
              <CircleMarker key={t.id} center={[t.lat!,t.lon!]} radius={6} pathOptions={{fillColor:col,fillOpacity:.9,color:'#0d1520',weight:1.5}}>
                <LTooltip><div style={{fontFamily:'monospace',fontSize:11,lineHeight:1.6}}><b>{t.truck_id}</b><br/>Status: <span style={{color:col}}>{t.status}</span><br/>Speed: {Math.round(t.speed??0)} km/h<br/>Risk: <span style={{color:riskColor(t.riskScore??0)}}>{t.riskScore}/100</span></div></LTooltip>
                <Popup><div style={{fontFamily:'monospace',fontSize:11}}><strong>{t.truck_id}</strong><br/>{t.cargo_type}<br/>Risk: {t.riskScore}/100 ({t.riskLevel})<br/>{t.lat?.toFixed(4)}°N, {t.lon?.toFixed(4)}°E</div></Popup>
              </CircleMarker>
            );})}
          </MapContainer>
          <div style={{position:'absolute',bottom:16,left:16,zIndex:1000,background:'rgba(8,12,20,.85)',border:'1px solid var(--border)',borderRadius:6,padding:'6px 12px',display:'flex',gap:12}}>
            {[['#24c97e','ON_ROUTE'],['#f5a623','DEVIATION'],['#e84545','CRITICAL'],['#2a7fff',"N'Djamena"],['#8b5cf6','Bangui']].map(([c,l])=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:5,fontSize:9,color:'var(--text2)',fontFamily:'monospace'}}><div style={{width:7,height:7,borderRadius:'50%',background:c}}/>{l}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="card"><div className="card-header"><span className="card-title">Tracked Vehicles</span></div>
        <div style={{overflowX:'auto'}}><table><thead><tr><th>Truck ID</th><th>Plate</th><th>Cargo</th><th>Status</th><th>Lat</th><th>Lon</th><th>Speed</th><th>Risk</th></tr></thead>
          <tbody>{trucks.map((t,i)=>(
            <tr key={t.id} style={{background:i%2===0?'':'rgba(255,255,255,.015)'}}>
              <td style={{color:'var(--white)',fontFamily:'monospace',fontWeight:600}}>{t.truck_id}</td>
              <td style={{color:'var(--text2)',fontFamily:'monospace',fontSize:10}}>{t.plate_number}</td>
              <td style={{fontSize:10}}>{t.cargo_type}</td>
              <td style={{color:t.status==='ON_ROUTE'?'var(--green)':'var(--red)',fontWeight:600,fontSize:10}}>{t.status}</td>
              <td style={{fontFamily:'monospace',fontSize:10,color:'var(--text2)'}}>{t.lat?.toFixed(4)}</td>
              <td style={{fontFamily:'monospace',fontSize:10,color:'var(--text2)'}}>{t.lon?.toFixed(4)}</td>
              <td style={{fontFamily:'monospace',fontSize:10}}>{Math.round(t.speed??0)} km/h</td>
              <td style={{color:riskColor(t.riskScore??0),fontWeight:700,fontFamily:'monospace',fontSize:10}}>{t.riskScore}/100</td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </div>
  );
}
export default MapPage;
