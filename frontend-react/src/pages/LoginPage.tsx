import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
const DEMO=[
  {role:'ROLE_ADMIN',user:'admin',pass:'Admin@2024',label:'System Admin',col:'#e84545'},
  {role:'ROLE_DIRECTOR',user:'director',pass:'Director@2024',label:'Customs Director',col:'#f5a623'},
  {role:'ROLE_OFFICER',user:'officer1',pass:'Officer@2024',label:'Customs Officer',col:'#0fb8a0'},
  {role:'ROLE_OPS',user:'ops',pass:'Ops@2024',label:'DevOps Engineer',col:'#8b5cf6'},
  {role:'ROLE_AUDITOR',user:'auditor',pass:'Ops@2024',label:'Court Auditor',col:'#2a7fff'},
];
export default function LoginPage(){
  const{login}=useAuth();const nav=useNavigate();
  const[form,setForm]=useState({username:'',password:''});
  const[error,setError]=useState('');const[loading,setLoading]=useState(false);
  const go=async(u:string,p:string)=>{setError('');setLoading(true);try{await login(u,p);nav('/dashboard',{replace:true});}catch(e:any){setError(e.message||'Invalid credentials');}finally{setLoading(false);};};
  return(
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:20}}>
      <div style={{width:'100%',maxWidth:440}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontSize:40,marginBottom:8}}>🛰</div>
          <h1 style={{fontSize:28,fontWeight:800,color:'var(--white)',letterSpacing:2}}>BORDERWATCH</h1>
          <p style={{color:'var(--text2)',fontSize:13,marginTop:4}}>CEMAC Customs Surveillance System</p>
        </div>
        <div className="card" style={{padding:28,marginBottom:16}}>
          <h2 style={{fontSize:16,fontWeight:700,marginBottom:20}}>Sign In</h2>
          {error&&<div style={{background:'rgba(232,69,69,.1)',border:'1px solid rgba(232,69,69,.3)',borderRadius:6,padding:'10px 14px',marginBottom:16,color:'var(--red)',fontSize:13}}>{error}</div>}
          <form onSubmit={e=>{e.preventDefault();go(form.username,form.password);}} style={{display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <label style={{display:'block',fontSize:10,fontWeight:600,color:'var(--text2)',marginBottom:5,textTransform:'uppercase' as const}}>Username</label>
              <input className="input" value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} placeholder="Enter username" required/>
            </div>
            <div>
              <label style={{display:'block',fontSize:10,fontWeight:600,color:'var(--text2)',marginBottom:5,textTransform:'uppercase' as const}}>Password</label>
              <input className="input" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Enter password" required/>
            </div>
            <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:6}} disabled={loading}>
              {loading?'⏳ Signing in…':'🔐 Sign In'}
            </button>
          </form>
        </div>
        <div className="card" style={{padding:20}}>
          <p style={{fontSize:11,color:'var(--text3)',marginBottom:12,textTransform:'uppercase' as const,letterSpacing:.8,fontWeight:600}}>Quick Access (Demo)</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {DEMO.map(d=>(
              <button key={d.user} onClick={()=>go(d.user,d.pass)} disabled={loading}
                style={{padding:'8px 10px',borderRadius:5,border:`1px solid ${d.col}30`,background:`${d.col}10`,color:d.col,fontSize:11,fontWeight:600,cursor:'pointer',textAlign:'left' as const}}>
                <div style={{fontSize:9,opacity:.7,marginBottom:2}}>{d.role.replace('ROLE_','')}</div>
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <p style={{textAlign:'center',color:'var(--text3)',fontSize:11,marginTop:20}}>SEN3244 Software Architecture · BSE Year 3 · 2025-2026</p>
      </div>
    </div>
  );
}
