export const timeAgo=(iso:string)=>{const d=Date.now()-new Date(iso).getTime();return d<60000?`${Math.round(d/1000)}s ago`:d<3600000?`${Math.round(d/60000)}m ago`:`${Math.round(d/3600000)}h ago`;};
export const formatFCFA=(n:number)=>n>=1e6?`${(n/1e6).toFixed(1)}M`:n>=1000?`${(n/1000).toFixed(0)}k`:n.toLocaleString();
export const sevColor=(s:string)=>s==='HIGH'?'var(--red)':s==='MEDIUM'?'var(--amber)':'var(--green)';
export const riskColor=(s:number)=>s>=70?'var(--red)':s>=40?'var(--amber)':'var(--green)';
function hav(lat1:number,lon1:number,lat2:number,lon2:number){const R=6371,d2r=Math.PI/180;const a=Math.pow(Math.sin((lat2-lat1)*d2r/2),2)+Math.cos(lat1*d2r)*Math.cos(lat2*d2r)*Math.pow(Math.sin((lon2-lon1)*d2r/2),2);return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
function seg(pLat:number,pLon:number,aLat:number,aLon:number,bLat:number,bLon:number){const dL=bLat-aLat,dO=bLon-aLon;if(!dL&&!dO)return hav(pLat,pLon,aLat,aLon);const t=Math.max(0,Math.min(1,((pLat-aLat)*dL+(pLon-aLon)*dO)/(dL*dL+dO*dO)));return hav(pLat,pLon,aLat+t*dL,aLon+t*dO);}
export const CORRIDORS=[
  {id:'CORRIDOR_DOUALA_NDJAMENA',name:"Douala–N'Djamena",color:'#2a7fff',tol:25,wps:[{lat:4.0511,lon:9.7679},{lat:4.9601,lon:11.8616},{lat:5.9667,lon:14.3167},{lat:7.3667,lon:15.4833},{lat:12.1048,lon:15.0445}]},
  {id:'CORRIDOR_DOUALA_BANGUI',name:'Douala–Bangui',color:'#8b5cf6',tol:30,wps:[{lat:4.0511,lon:9.7679},{lat:4.3612,lon:18.5583}]},
];
export function analyzePos(lat:number,lon:number){let min=Infinity,match:typeof CORRIDORS[0]|null=null;for(const c of CORRIDORS)for(let i=0;i<c.wps.length-1;i++){const d=seg(lat,lon,c.wps[i].lat,c.wps[i].lon,c.wps[i+1].lat,c.wps[i+1].lon);if(d<min){min=d;if(d<=c.tol)match=c;}}return{status:match?'ON_ROUTE':'OFF_ROUTE' as const,corridorId:match?.id||null,minDistanceKm:Math.round(min*10)/10};}
export function calcRisk(v:number,s:string,speed:number,cargo:string,days:number){const M:Record<string,number>={PETROLEUM:1.8,ELECTRONICS:1.6,PHARMACEUTICALS:1.7,FIREARMS:2.0,GENERAL_GOODS:1.0,FOODSTUFFS:0.9};const raw=Math.min(v*15,40)+(s==='OFF_ROUTE'?25:0)+Math.min((Math.abs(speed-72)/72)*15,15)+(new Date().getHours()>=22||new Date().getHours()<=5?8:0)+(days>3?5:0);const score=Math.min(Math.round(raw*(M[cargo]??1)),100);return{score,level:(score>=70?'CRITICAL':score>=40?'HIGH':score>=20?'MEDIUM':'LOW') as 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'};}
