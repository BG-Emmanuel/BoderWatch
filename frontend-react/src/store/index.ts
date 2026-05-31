import {create} from 'zustand';
import {calcRisk,CORRIDORS} from '@/utils';
import type {Truck,Violation,DashKPIs} from '@/types';
import api from '@/services/api';
const CARGOS=['PETROLEUM','ELECTRONICS','PHARMACEUTICALS','GENERAL_GOODS','FOODSTUFFS'];
const TIDS=['CE-2024-ALPHA','CE-2024-BETA','CE-2024-GAMMA','CE-SIM-0021','CE-SIM-0087','CM-2024-001'];
function mkTruck(tid:string,idx:number):Truck{const cor=CORRIDORS[idx%2];const wp=cor.wps[Math.floor(Math.random()*(cor.wps.length-1))];const cargo=CARGOS[idx%CARGOS.length];const status=Math.random()>.2?'ON_ROUTE':'OFF_ROUTE' as Truck['status'];const{score,level}=calcRisk(Math.floor(Math.random()*4),status??'ON_ROUTE',50+Math.random()*50,cargo,Math.floor(Math.random()*4)+1);return{id:String(idx),truck_id:tid,plate_number:`LT-${1000+idx*111}`,operator_name:`Operator ${idx+1}`,cargo_type:cargo,is_active:true,registered_at:new Date().toISOString(),lat:wp.lat+(Math.random()-.5)*.3,lon:wp.lon+(Math.random()-.5)*.3,speed:50+Math.random()*50,status,riskScore:score,riskLevel:level};}
interface BwState{trucks:Truck[];violations:Violation[];kpis:DashKPIs;alerts:{id:string;type:string;msg:string;ts:string}[];initLive:()=>void;tickLive:()=>void;loadViolations:()=>Promise<void>;acknowledgeViolation:(id:string)=>void;}
export const useStore=create<BwState>((set,get)=>({
  trucks:TIDS.map((t,i)=>mkTruck(t,i)),
  violations:[],
  kpis:{rps:850,p95:137,replicas:'9/9',violations:0,totalFcfa:0,activeTrucks:6},
  alerts:[
    {id:'a1',type:'critical',msg:'CE-2024-BETA: OFF_ROUTE 87km — Risk 94/100',ts:new Date().toISOString()},
    {id:'a2',type:'warning',msg:'CE-SIM-0087: Speed anomaly Z=2.8',ts:new Date(Date.now()-300000).toISOString()},
    {id:'a3',type:'info',msg:'ingestion-2 restarted, healed in 14s',ts:new Date(Date.now()-600000).toISOString()},
  ],
  initLive:()=>get().loadViolations(),
  tickLive:()=>{const{trucks,kpis}=get();const rps=Math.max(100,kpis.rps*(0.95+Math.random()*.1));const p95=Math.min(200,Math.max(110,kpis.p95*(0.97+Math.random()*.06)));set({kpis:{...kpis,rps:Math.round(rps),p95:Math.round(p95)},trucks:trucks.map(t=>{const speed=Math.max(20,Math.min(130,(t.speed??60)+(Math.random()-.5)*8));const{score,level}=calcRisk(0,t.status??'ON_ROUTE',speed,t.cargo_type,1);return{...t,lat:(t.lat??0)+(Math.random()-.5)*.015,lon:(t.lon??0)+(Math.random()-.5)*.015,speed,riskScore:score,riskLevel:level};})});},
  loadViolations:async()=>{try{const r=await api.get('/api/v1/compliance/violations?limit=100');const v:Violation[]=r.data.violations||[];set({violations:v,kpis:{...get().kpis,violations:v.length,totalFcfa:v.reduce((s,x)=>s+x.penalty_fcfa,0)}});}catch{/*api not ready*/}},
  acknowledgeViolation:(id:string)=>{set(s=>({violations:s.violations.map(v=>v.id===id&&v.status==='PENDING'?{...v,status:'ACKNOWLEDGED' as Violation['status']}:v)}));api.post(`/api/v1/compliance/violations/${id}/acknowledge`,{officer_id:'OFFICER-WEB'}).catch(()=>{});},
}));
