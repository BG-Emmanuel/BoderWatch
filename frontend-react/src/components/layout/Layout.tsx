import {Outlet,NavLink} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
const NAV=[
  {path:'/dashboard',label:'Dashboard',roles:['ROLE_ADMIN','ROLE_DIRECTOR','ROLE_OFFICER','ROLE_OPS','ROLE_AUDITOR']},
  {path:'/map',label:'Live Map',roles:['ROLE_ADMIN','ROLE_DIRECTOR','ROLE_OFFICER','ROLE_OPS']},
  {path:'/violations',label:'Violations',roles:['ROLE_ADMIN','ROLE_DIRECTOR','ROLE_OFFICER','ROLE_AUDITOR']},
  {path:'/trucks',label:'Trucks',roles:['ROLE_ADMIN','ROLE_DIRECTOR','ROLE_OFFICER','ROLE_OPS']},
  {path:'/telemetry',label:'Submit GPS',roles:['ROLE_ADMIN','ROLE_OFFICER']},
  {path:'/risk',label:'AI Risk',roles:['ROLE_ADMIN','ROLE_DIRECTOR','ROLE_OFFICER']},
  {path:'/blockchain',label:'Audit Chain',roles:['ROLE_ADMIN','ROLE_DIRECTOR','ROLE_OFFICER','ROLE_AUDITOR']},
  {path:'/stats',label:'Statistics',roles:['ROLE_ADMIN','ROLE_DIRECTOR','ROLE_OPS']},
  {path:'/users',label:'Users',roles:['ROLE_ADMIN']},
  {path:'/about',label:'About Us',roles:['ROLE_ADMIN','ROLE_DIRECTOR','ROLE_OFFICER','ROLE_OPS','ROLE_AUDITOR']},
];
const RC:Record<string,string>={ROLE_ADMIN:'#e84545',ROLE_DIRECTOR:'#f5a623',ROLE_OFFICER:'#0fb8a0',ROLE_OPS:'#8b5cf6',ROLE_AUDITOR:'#2a7fff',ROLE_BEACON:'#6b8aaa'};
export default function Layout(){
  const{user,logout}=useAuth();
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'}}>
      <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',height:52,flexShrink:0,background:'var(--bg2)',borderBottom:'1px solid var(--border)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:30,height:30,border:'1.5px solid var(--teal)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15}}>BW</div>
          <span style={{fontFamily:'monospace',fontSize:14,fontWeight:700,color:'var(--white)',letterSpacing:1}}>BORDER<span style={{color:'var(--teal)'}}>WATCH</span></span>
        </div>
        <nav style={{display:'flex',gap:2}}>
          {NAV.filter(n=>n.roles.includes(user?.role??'')).map(n=>(
            <NavLink key={n.path} to={n.path} style={({isActive})=>({padding:'5px 12px',borderRadius:4,textDecoration:'none',fontSize:11,fontWeight:600,letterSpacing:.6,textTransform:'uppercase' as const,color:isActive?'var(--teal)':'var(--text2)',background:isActive?'rgba(15,184,160,.1)':'transparent',borderBottom:isActive?'2px solid var(--teal)':'2px solid transparent'})}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{padding:'3px 8px',borderRadius:10,fontSize:10,fontWeight:700,background:`${RC[user?.role??'ROLE_OFFICER']}20`,color:RC[user?.role??'ROLE_OFFICER']}}>{user?.role.replace('ROLE_','')}</span>
          <span style={{fontSize:12,color:'var(--text2)'}}>{user?.fullName}</span>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Sign out</button>
        </div>
      </header>
      <main style={{flex:1,overflow:'auto',padding:20}}><Outlet/></main>
    </div>
  );
}
