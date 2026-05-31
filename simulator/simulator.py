#!/usr/bin/env python3
"""BorderWatch GPS Simulator
Usage: pip install aiohttp && python3 simulator.py --rps 100 --duration 30
"""
import asyncio,aiohttp,argparse,random,time,sys
CORRIDORS=[[(4.0511,9.7679),(4.9601,11.8616),(5.9667,14.3167),(7.3667,15.4833),(12.1048,15.0445)],[(4.0511,9.7679),(4.3612,18.5583)]]
TRUCKS=["CE-2024-ALPHA","CE-2024-BETA","CE-2024-GAMMA","CE-SIM-0021","CE-SIM-0087","CM-2024-001"]
def rand_pos(off=0.1):
    c=random.choice(CORRIDORS);a,b=random.choice([(c[i],c[i+1]) for i in range(len(c)-1)]);t=random.random()
    lat=a[0]+t*(b[0]-a[0])+(random.gauss(0,.3) if random.random()<off else random.gauss(0,.05))
    lon=a[1]+t*(b[1]-a[1])+(random.gauss(0,.3) if random.random()<off else random.gauss(0,.05))
    return lat,lon
async def ping(session,url,api_key,stats):
    lat,lon=rand_pos()
    try:
        t0=time.time()
        hdrs={"X-API-Key":api_key} if api_key else {}
        async with session.post(f"{url}/api/v1/telemetry",json={"truck_id":random.choice(TRUCKS),"latitude":lat,"longitude":lon,"speed_kmh":round(40+random.random()*80,1)},headers=hdrs,timeout=aiohttp.ClientTimeout(total=5)) as r:
            stats["lat"].append((time.time()-t0)*1000);stats["sent"]+=1
            if r.status==202:stats["ok"]+=1
            else:stats["err"]+=1
    except:stats["err"]+=1
async def run(url,rps,dur,api_key):
    stats={"sent":0,"ok":0,"err":0,"lat":[]}
    conn=aiohttp.TCPConnector(limit=500)
    async with aiohttp.ClientSession(connector=conn) as s:
        start=time.time();tasks=[]
        while time.time()-start<dur:
            tasks.append(asyncio.create_task(ping(s,url,api_key,stats)))
            if len(tasks)>=max(1,rps//10):await asyncio.gather(*tasks);tasks=[]
            await asyncio.sleep(1.0/rps)
        if tasks:await asyncio.gather(*tasks)
    ls=sorted(stats["lat"]);p95=ls[int(len(ls)*.95)] if ls else 0
    print(f"\nSent:{stats['sent']:,} OK:{stats['ok']:,} Err:{stats['err']} P95:{p95:.1f}ms {'✅ SLA met' if p95<200 else '❌ SLA breached'}")
    return p95<200
if __name__=="__main__":
    p=argparse.ArgumentParser();p.add_argument("--url",default="http://localhost:80");p.add_argument("--rps",type=int,default=100);p.add_argument("--duration",type=int,default=30);p.add_argument("--api-key",default="borderwatch-test-key-2024")
    args=p.parse_args()
    print(f"🚀 Simulator: {args.rps} rps × {args.duration}s → {args.url}")
    sys.exit(0 if asyncio.run(run(args.url,args.rps,args.duration,args.api_key)) else 1)
