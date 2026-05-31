import {useState,useEffect,useCallback,useRef} from 'react';
import api from '@/services/api';

export function useClock(tz='Africa/Douala'){const [t,setT]=useState('');useEffect(()=>{const up=()=>setT(new Date().toLocaleTimeString('en-GB',{timeZone:tz,hour12:false}));up();const id=setInterval(up,1000);return()=>clearInterval(id);},[tz]);return t;}

export function useLiveTick(cb:()=>void,ms=2000){useEffect(()=>{const id=setInterval(cb,ms);return()=>clearInterval(id);},[cb,ms]);}

export function useApi<T>(url:string,deps:unknown[]=[]){
  const [data,setData]=useState<T|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);
  const run=useCallback(async()=>{setLoading(true);setError(null);try{const r=await api.get(url);setData(r.data);}catch(e:any){setError(e.message);}finally{setLoading(false);}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[url,...deps]);
  useEffect(()=>{run();},[run]);
  return {data,loading,error,refetch:run};
}

export function useChartWindow(size=30){
  const [rpsWin,setRps]=useState<number[]>(Array(size).fill(0));
  const [p95Win,setP95]=useState<number[]>(Array(size).fill(0));
  const push=useCallback((rps:number,p95:number)=>{setRps(w=>[...w.slice(1),rps]);setP95(w=>[...w.slice(1),p95]);},[]);
  const labels=Array.from({length:size},(_,i)=>i===0?`-${size}s`:i===size-1?'now':'');
  return {rpsWin,p95Win,labels,push};
}

export function useSimulator(){
  const [running,setRunning]=useState(false);
  const [elapsed,setElapsed]=useState(0);
  const [sent,setSent]=useState(0);
  const ref=useRef<ReturnType<typeof setInterval>>();
  const start=(rps:number,dur:number)=>{setRunning(true);setElapsed(0);setSent(0);ref.current=setInterval(()=>{setElapsed(e=>{if(e+1>=dur){stop();return e;}return e+1;});setSent(s=>s+rps);},1000);};
  const stop=()=>{setRunning(false);if(ref.current)clearInterval(ref.current);};
  useEffect(()=>()=>{if(ref.current)clearInterval(ref.current);},[]);
  return {running,elapsed,sent,start,stop};
}
