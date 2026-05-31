import {useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {useApi} from '@/hooks';
import api from '@/services/api';
import {useNavigate} from 'react-router-dom';

interface UserRow{id:string;username:string;email:string;full_name:string;role:string;is_active:boolean;last_login:string|null;created_at:string;}
const RC:Record<string,string>={ROLE_ADMIN:'#e84545',ROLE_DIRECTOR:'#f5a623',ROLE_OFFICER:'#0fb8a0',ROLE_OPS:'#8b5cf6',ROLE_AUDITOR:'#2a7fff',ROLE_BEACON:'#6b8aaa'};

function AddUserModal({onClose,onSave}:{onClose:()=>void;onSave:()=>void}){
  const[form,setForm]=useState({username:'',email:'',password:'',fullName:'',role:'ROLE_OFFICER'});
  const[err,setErr]=useState('');
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{setErr('');if(!form.username||!form.email||!form.password||!form.fullName){setErr('All fields required');return;}if(form.password.length<8){setErr('Password min 8 chars');return;}try{await api.post('/api/v1/users',{username:form.username,email:form.email,password:form.password,fullName:form.fullName,role:form.role});onSave();onClose();}catch(e:any){setErr(e.message);}};
  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(8,12,20,.85)',backdropFilter:'blur(4px)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'var(--bg2)',border:'1px solid var(--border2)',borderRadius:10,padding:24,width:440,maxWidth:'90vw'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}><span style={{fontSize:14,fontWeight:700,color:'var(--white)'}}>Add New User</span><button onClick={onClose} style={{background:'none',border:'none',color:'var(--text3)',fontSize:20,cursor:'pointer'}}>×</button></div>
        {err&&<div style={{color:'var(--red)',fontSize:12,marginBottom:12,padding:'8px 12px',background:'rgba(232,69,69,.1)',borderRadius:5}}>{err}</div>}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {[['fullName','Full Name'],['username','Username'],['email','Email'],['password','Password (min 8 chars)']].map(([k,ph])=>(
            <div key={k}><label style={{fontSize:10,fontWeight:600,color:'var(--text2)',textTransform:'uppercase' as const,display:'block',marginBottom:4}}>{ph}</label>
              <input className="input" type={k==='password'?'password':k==='email'?'email':'text'} value={(form as any)[k]} onChange={e=>set(k,e.target.value)} placeholder={ph}/>
            </div>
          ))}
          <div><label style={{fontSize:10,fontWeight:600,color:'var(--text2)',textTransform:'uppercase' as const,display:'block',marginBottom:4}}>Role</label>
            <select className="input" value={form.role} onChange={e=>set('role',e.target.value)}>
              {['ROLE_ADMIN','ROLE_DIRECTOR','ROLE_OFFICER','ROLE_OPS','ROLE_AUDITOR','ROLE_BEACON'].map(r=><option key={r} value={r}>{r.replace('ROLE_','')}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:'flex',gap:8,marginTop:16}}><button className="btn btn-success" onClick={save}>Create User</button><button className="btn btn-ghost" onClick={onClose}>Cancel</button></div>
      </div>
    </div>
  );
}

export default function UsersPage(){
  const{hasRole}=useAuth();const nav=useNavigate();const[showAdd,setAdd]=useState(false);
  const{data,loading,refetch}=useApi<{users:UserRow[]}>('/api/v1/users');
  if(!hasRole('ROLE_ADMIN'))return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh',flexDirection:'column',gap:12}}>
      <div style={{fontSize:48}}>🔒</div><h2 style={{color:'var(--text2)'}}>Access Denied</h2>
      <p style={{color:'var(--text3)',fontSize:13}}>Only ROLE_ADMIN can access user management.</p>
      <button className="btn btn-ghost" onClick={()=>nav('/dashboard')}>← Back</button>
    </div>
  );
  const users=data?.users??[];
  const toggle=async(uid:string,active:boolean)=>{if(!confirm(`${active?'Deactivate':'Activate'} this user?`))return;await api.put(`/api/v1/users/${uid}/${active?'deactivate':'activate'}`);refetch();};
  return(
    <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <h2 style={{fontSize:13,fontWeight:700,color:'var(--text2)',letterSpacing:1,textTransform:'uppercase' as const,fontFamily:'monospace',marginRight:'auto'}}>User Management</h2>
        <button className="btn btn-ghost btn-sm" onClick={refetch}>↺</button>
        <button className="btn btn-success" onClick={()=>setAdd(true)}>+ Add User</button>
      </div>
      <div className="card"><div style={{overflowX:'auto'}}><table>
        <thead><tr><th>Full Name</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody>
          {loading&&<tr><td colSpan={8} style={{textAlign:'center',color:'var(--text3)',padding:32}}>Loading…</td></tr>}
          {!loading&&users.map((u,i)=>(
            <tr key={u.id} style={{background:i%2===0?'':'rgba(255,255,255,.015)'}}>
              <td style={{color:'var(--white)',fontWeight:600}}>{u.full_name}</td>
              <td style={{fontFamily:'monospace',fontSize:10,color:'var(--text2)'}}>{u.username}</td>
              <td style={{fontSize:10,color:'var(--text2)'}}>{u.email}</td>
              <td><span style={{padding:'2px 8px',borderRadius:10,fontSize:9,fontWeight:700,background:`${RC[u.role]||'#6b8aaa'}20`,color:RC[u.role]||'var(--text2)'}}>{u.role.replace('ROLE_','')}</span></td>
              <td><span style={{fontSize:9,fontWeight:700,color:u.is_active?'var(--green)':'var(--red)'}}>{u.is_active?'● ACTIVE':'● INACTIVE'}</span></td>
              <td style={{fontSize:9,color:'var(--text3)'}}>{u.last_login?new Date(u.last_login).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'Never'}</td>
              <td style={{fontSize:9,color:'var(--text3)'}}>{new Date(u.created_at).toLocaleDateString('en-GB')}</td>
              <td><button className={`btn btn-sm ${u.is_active?'btn-danger':'btn-success'}`} style={{fontSize:9}} onClick={()=>toggle(u.id,u.is_active)}>{u.is_active?'Deactivate':'Activate'}</button></td>
            </tr>
          ))}
          {!loading&&users.length===0&&<tr><td colSpan={8} style={{textAlign:'center',color:'var(--text3)',padding:32}}>No users found</td></tr>}
        </tbody>
      </table></div></div>
      <div className="card" style={{padding:16}}>
        <div style={{fontSize:11,fontWeight:700,color:'var(--text2)',marginBottom:12,textTransform:'uppercase' as const}}>Role Permissions</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
          {[['ROLE_ADMIN','#e84545','Full access — users, trucks, corridors, all data'],['ROLE_DIRECTOR','#f5a623','Stats, AI briefings, violations, reports, map'],['ROLE_OFFICER','#0fb8a0','Map, violations, acknowledge, GPS submit, trucks'],['ROLE_OPS','#8b5cf6','Monitoring, health, Grafana, map, trucks'],['ROLE_AUDITOR','#2a7fff','Read-only: violations, blockchain, certificates'],['ROLE_BEACON','#6b8aaa','GPS API only — POST /api/v1/telemetry (X-API-Key)']].map(([role,col,desc])=>(
            <div key={role} style={{background:'var(--bg3)',borderRadius:6,padding:10,border:`1px solid ${col}20`}}>
              <span style={{display:'inline-block',padding:'2px 8px',borderRadius:10,fontSize:9,fontWeight:700,background:`${col}20`,color:col,marginBottom:6}}>{role.replace('ROLE_','')}</span>
              <div style={{fontSize:10,color:'var(--text2)',lineHeight:1.5}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
      {showAdd&&<AddUserModal onClose={()=>setAdd(false)} onSave={refetch}/>}
    </div>
  );
}
