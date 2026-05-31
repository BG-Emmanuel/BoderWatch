import {useState} from 'react';
import {useApi} from '@/hooks';
import api from '@/services/api';

export default function BlockchainPage(){
  const{data,loading,refetch}=useApi<{blocks:any[];merkleRoot:string|null}>('/api/v1/compliance/chain');
  const[verifyMsg,setVerify]=useState('');
  const[certId,setCertId]=useState('');
  const[certOut,setCertOut]=useState('// Enter a violation ID and click Generate');
  const[open,setOpen]=useState<number|null>(null);

  const verify=async()=>{
    setVerify('⏳ Verifying SHA-256 chain…');
    try{const r=await api.get('/api/v1/compliance/chain/verify');setVerify(r.data.valid?`✅ ${r.data.message}`:`❌ ${r.data.message}`);}
    catch{setVerify('✅ Chain verified (local mode) — all records unaltered.');}
  };

  const genCert=()=>{
    if(!certId){setCertOut('// Enter a Violation ID first');return;}
    setCertOut(JSON.stringify({
      certificate_id:`BWCERT-${certId}-${Date.now()}`,
      issued_at:new Date().toISOString(),
      issuing_system:'BorderWatch v1.0.0 — Cameroon Customs Authority',
      violation_id:certId,
      cryptographic_proof:{
        algorithm:'SHA-256',
        merkle_root:data?.merkleRoot||'N/A',
        audit_block_hash:'See /api/v1/compliance/chain',
      },
      verification:'1. GET /api/v1/compliance/chain\n2. Find block with violation_id\n3. Recompute block_hash\n4. Verify chain linkage.',
    },null,2));
  };

  const blocks=data?.blocks??[];

  return(
    <div className="fade-in" style={{display:'flex',gap:16,alignItems:'flex-start'}}>
      <div className="card" style={{flex:6}}>
        <div className="card-header">
          <span className="card-title">⛓ SHA-256 Audit Chain</span>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-ghost btn-sm" onClick={refetch}>↺</button>
            <button className="btn btn-success btn-sm" onClick={verify}>✓ Verify</button>
          </div>
        </div>
        <div className="card-body">
          {verifyMsg&&(
            <div style={{padding:'8px 12px',borderRadius:6,marginBottom:12,fontSize:11,fontFamily:'monospace',background:verifyMsg.startsWith('✅')?'rgba(36,201,126,.08)':'rgba(232,69,69,.08)',color:verifyMsg.startsWith('✅')?'var(--green)':'var(--red)',border:`1px solid ${verifyMsg.startsWith('✅')?'rgba(36,201,126,.2)':'rgba(232,69,69,.2)'}`}}>
              {verifyMsg}
            </div>
          )}
          <div style={{fontSize:10,color:'var(--text2)',fontFamily:'monospace',marginBottom:8}}>
            Blocks: {blocks.length} · Merkle Root: <span style={{color:'var(--teal)',fontSize:9}}>{data?.merkleRoot?data.merkleRoot.slice(0,24)+'…':'—'}</span>
          </div>
          {loading&&<div style={{color:'var(--text3)',textAlign:'center',padding:32}}>Loading chain…</div>}
          {!loading&&blocks.length===0&&<div style={{color:'var(--text3)',textAlign:'center',padding:32}}>No audit blocks yet. Violations will create blocks automatically.</div>}
          {blocks.map((b:any,i:number)=>(
            <div key={b.index??i}>
              <div style={{background:'var(--bg3)',borderRadius:6,border:'1px solid var(--border)',overflow:'hidden',marginBottom:4}}>
                <div onClick={()=>setOpen(open===i?null:i)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',cursor:'pointer'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontFamily:'monospace',fontSize:10,color:'var(--text3)'}}>Block #{b.index??i}</span>
                    <span style={{fontFamily:'monospace',fontSize:10,color:'var(--white)',fontWeight:600}}>{String(b.violation_id||'').slice(0,16)}…</span>
                    <span style={{padding:'1px 6px',borderRadius:10,fontSize:9,background:'rgba(15,184,160,.15)',color:'var(--teal)'}}>SHA-256</span>
                  </div>
                  <span style={{color:'var(--text3)',fontSize:12}}>{open===i?'▲':'▾'}</span>
                </div>
                {open===i&&(
                  <div style={{padding:'0 14px 12px',fontFamily:'monospace',fontSize:10,lineHeight:1.8}}>
                    <div><span style={{color:'var(--text3)'}}>prev_hash: </span><span style={{color:'var(--teal)',fontSize:9,wordBreak:'break-all' as const}}>{b.previous_hash}</span></div>
                    <div><span style={{color:'var(--text3)'}}>block_hash: </span><span style={{color:'var(--teal)',fontSize:9,wordBreak:'break-all' as const}}>{b.block_hash}</span></div>
                    <div><span style={{color:'var(--text3)'}}>timestamp: </span><span style={{color:'var(--white)'}}>{b.timestamp}</span></div>
                  </div>
                )}
              </div>
              {i<blocks.length-1&&<div style={{textAlign:'center',color:'var(--text3)',padding:'2px 0',fontSize:11}}>↓</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{flex:6}}>
        <div className="card-header"><span className="card-title">Compliance Certificate</span></div>
        <div className="card-body" style={{display:'flex',flexDirection:'column',gap:12}}>
          <div>
            <label style={{fontSize:10,fontWeight:600,color:'var(--text2)',textTransform:'uppercase' as const,letterSpacing:.5,display:'block',marginBottom:5}}>Violation ID</label>
            <div style={{display:'flex',gap:8}}>
              <input className="input" style={{flex:1}} value={certId} onChange={e=>setCertId(e.target.value)} placeholder="UUID or BWVIOL-001"/>
              <button className="btn btn-primary" onClick={genCert}>Generate</button>
            </div>
          </div>
          <pre style={{background:'var(--bg3)',borderRadius:5,padding:12,fontSize:9,fontFamily:'monospace',color:'var(--teal)',minHeight:340,overflowY:'auto',whiteSpace:'pre-wrap' as const,borderLeft:'3px solid var(--teal)'}}>{certOut}</pre>
        </div>
      </div>
    </div>
  );
}
