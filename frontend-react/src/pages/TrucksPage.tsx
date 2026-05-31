import {useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {useApi} from '@/hooks';
import api from '@/services/api';
import type {Truck} from '@/types';

function AddModal({onClose,onSave}:{onClose:()=>void;onSave:()=>void}){
  const[form,setForm]=useState({truck_id:'',plate_number:'',operator_name:'',operator_email:'',cargo_type:'GENERAL_GOODS'});
  const[err,setErr]=useState('');
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{setErr('');if(!form.truck_id||!form.plate_number||!form.operator_name){setErr('Truck ID, Plate and Operator required');return;}try{await api.post('/api/v1/trucks',form);onSave();onClose();}catch(e:any){setErr(e.message);}};
  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(8,12,20,.85)',backdropFilter:'blur(4px)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'var(--bg2)',border:'1px solid var(--border2)',borderRadius:10,padding:24,width:460,maxWidth:'90vw'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}><span style={{fontSize:14,fontWeight:700,color:'var(--white)'}}>Register New Truck</span><button onClick={onClose} style={{background:'none',border:'none',color:'var(--text3)',fontSize:20,cursor:'pointer'}}>×</button></div>
        {err&&<div style={{color:'var(--red)',fontSize:12,marginBottom:12,padding:'8px 12px',background:'rgba(232,69,69,.1)',borderRadius:5}}>{err}</div>}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {[['truck_id','Truck ID (e.g. CE-2024-NEW)'],['plate_number','Plate Number'],['operator_name','Operator Name'],['operator_email','Operator Email']].map(([k,ph])=>(
            <div key={k}><label style={{fontSize:10,fontWeight:600,color:'var(--text2)',textTransform:'uppercase' as const,letterSpacing:.5,display:'block',marginBottom:4}}>{ph.split(' (')[0]}</label>
            <input className="input" value={(form as any)[k]} onChange={e=>set(k,e.target.value)} placeholder={ph}/></div>
          ))}
          <div><label style={{fontSize:10,fontWeight:600,color:'var(--text2)',textTransform:'uppercase' as const,display:'block',marginBottom:4}}>Cargo Type</label>
            <select className="input" value={form.cargo_type} onChange={e=>set('cargo_type',e.target.value)}>
              {['PETROLEUM','ELECTRONICS','PHARMACEUTICALS','FIREARMS','GENERAL_GOODS','FOODSTUFFS'].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:'flex',gap:8,marginTop:16}}><button className="btn btn-success" onClick={save}>Register</button><button className="btn btn-ghost" onClick={onClose}>Cancel</button></div>
      </div>
    </div>
  );
}

export default function TrucksPage(){
  const{hasRole}=useAuth();const[showAdd,setAdd]=useState(false);const[search,setSearch]=useState('');
  const{data,loading,refetch}=useApi<{trucks:Truck[]}>('/api/v1/trucks?limit=200');
  const trucks=(data?.trucks??[]).filter(t=>!search||t.truck_id.toLowerCase().includes(search.toLowerCase())||t.operator_name.toLowerCase().includes(search.toLowerCase()));
  const deactivate=async(tid:string)=>{if(!confirm(`Deactivate ${tid}?`))return;await api.delete(`/api/v1/trucks/${tid}`);refetch();};
  return(
    <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <h2 style={{fontSize:13,fontWeight:700,color:'var(--text2)',letterSpacing:1,textTransform:'uppercase' as const,fontFamily:'monospace',marginRight:'auto'}}>Truck Registry</h2>
        <input className="input" style={{width:200,fontSize:11}} placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <button className="btn btn-ghost btn-sm" onClick={refetch}>↺</button>
        {hasRole('ROLE_ADMIN')&&<button className="btn btn-success" onClick={()=>setAdd(true)}>+ Register Truck</button>}
      </div>
      <div className="card"><div style={{overflowX:'auto'}}><table>
        <thead><tr><th>Truck ID</th><th>Plate</th><th>Operator</th><th>Cargo</th><th>Status</th><th>Registered</th>{hasRole('ROLE_ADMIN')&&<th>Actions</th>}</tr></thead>
        <tbody>
          {loading&&<tr><td colSpan={7} style={{textAlign:'center',color:'var(--text3)',padding:32}}>Loading…</td></tr>}
          {!loading&&trucks.map((t,i)=>(
            <tr key={t.id} style={{background:i%2===0?'':'rgba(255,255,255,.015)'}}>
              <td style={{color:'var(--white)',fontWeight:600,fontFamily:'monospace'}}>{t.truck_id}</td>
              <td style={{fontFamily:'monospace',fontSize:10,color:'var(--text2)'}}>{t.plate_number}</td>
              <td>{t.operator_name}</td><td style={{fontSize:10}}>{t.cargo_type}</td>
              <td><span style={{fontSize:9,fontWeight:700,color:t.is_active?'var(--green)':'var(--red)'}}>{t.is_active?'● ACTIVE':'● INACTIVE'}</span></td>
              <td style={{fontSize:9,color:'var(--text3)'}}>{new Date(t.registered_at).toLocaleDateString()}</td>
              {hasRole('ROLE_ADMIN')&&<td>{t.is_active&&<button className="btn btn-danger btn-sm" onClick={()=>deactivate(t.truck_id)}>Deactivate</button>}</td>}
            </tr>
          ))}
          {!loading&&trucks.length===0&&<tr><td colSpan={7} style={{textAlign:'center',color:'var(--text3)',padding:32}}>No trucks found</td></tr>}
        </tbody>
      </table></div></div>
      {showAdd&&<AddModal onClose={()=>setAdd(false)} onSave={refetch}/>}
    </div>
  );
}
