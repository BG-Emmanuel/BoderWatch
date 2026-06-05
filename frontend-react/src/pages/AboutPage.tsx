import {Activity, Boxes, GitBranch, HeartPulse, ShieldCheck, Users} from 'lucide-react';

const teamMembers = [
  {
    name: 'Team Member Name',
    regNo: 'Registration Number',
    role: 'Project Lead / Scrum Master',
    contribution:
      'Coordinated sprint planning, tracked deliverables, managed documentation, and helped align the implementation with the project requirements.',
  },
  {
    name: 'Team Member Name',
    regNo: 'Registration Number',
    role: 'Frontend Developer',
    contribution:
      'Designed and implemented the user interface, application pages, navigation flow, and responsive dashboard experience.',
  },
  {
    name: 'Team Member Name',
    regNo: 'Registration Number',
    role: 'Backend Developer',
    contribution:
      'Implemented backend services, APIs, business logic, data handling, authentication flow, and service integration.',
  },
  {
    name: 'Team Member Name',
    regNo: 'Registration Number',
    role: 'DevOps / QA Engineer',
    contribution:
      'Handled Docker, Kubernetes, Jenkins CI/CD, VPS deployment, monitoring setup, testing evidence, and release support.',
  },
];

const architectureHighlights = [
  {
    icon: Boxes,
    title: 'Microservice-Oriented Design',
    body: 'BorderWatch separates gateway, ingestion, tracking, compliance, simulator, frontend, monitoring, and infrastructure concerns into focused deployable units.',
    color: 'var(--blue)',
  },
  {
    icon: GitBranch,
    title: 'Automated Delivery',
    body: 'The system uses GitHub, Jenkins, Docker, and Kubernetes manifests to support repeatable build, test, and deployment workflows.',
    color: 'var(--teal)',
  },
  {
    icon: HeartPulse,
    title: 'Operational Monitoring',
    body: 'Prometheus and Grafana provide visibility into service health, platform metrics, and application behavior during the project demonstration.',
    color: 'var(--amber)',
  },
  {
    icon: ShieldCheck,
    title: 'Resilience Focus',
    body: 'Kubernetes deployments, replicas, restart behavior, and service separation help the application recover when selected services are terminated.',
    color: 'var(--green)',
  },
];

function MemberCard({member,index}:{member:(typeof teamMembers)[number];index:number}){
  const initials = member.name
    .split(' ')
    .filter(Boolean)
    .slice(0,2)
    .map(part=>part[0]?.toUpperCase())
    .join('') || `T${index + 1}`;

  return(
    <article className="card" style={{padding:18,display:'grid',gridTemplateColumns:'54px 1fr',gap:14,minHeight:170}}>
      <div style={{width:54,height:54,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(15,184,160,.12)',border:'1px solid rgba(15,184,160,.35)',color:'var(--teal)',fontFamily:'monospace',fontSize:16,fontWeight:800}}>
        {initials}
      </div>
      <div style={{minWidth:0}}>
        <h3 style={{fontSize:14,color:'var(--white)',marginBottom:5}}>{member.name}</h3>
        <p style={{fontSize:10,color:'var(--text3)',fontFamily:'monospace',marginBottom:8}}>{member.regNo}</p>
        <p style={{fontSize:10,color:'var(--teal)',fontWeight:800,textTransform:'uppercase',letterSpacing:.6,marginBottom:9}}>{member.role}</p>
        <p style={{fontSize:12,color:'var(--text2)',lineHeight:1.6}}>{member.contribution}</p>
      </div>
    </article>
  );
}

export default function AboutPage(){
  return(
    <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:16}}>
      <section className="card" style={{position:'relative',overflow:'hidden',padding:24,minHeight:210,display:'flex',alignItems:'center'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 18% 20%, rgba(15,184,160,.18), transparent 34%), radial-gradient(circle at 82% 10%, rgba(42,127,255,.16), transparent 30%)'}} />
        <div style={{position:'relative',maxWidth:850}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'5px 10px',borderRadius:4,background:'rgba(42,127,255,.12)',border:'1px solid rgba(42,127,255,.25)',color:'var(--blue)',fontSize:10,fontWeight:800,letterSpacing:.8,textTransform:'uppercase',marginBottom:14}}>
            <Users size={14}/> Software Architecture Project Team
          </div>
          <h1 style={{fontSize:34,lineHeight:1.05,color:'var(--white)',fontFamily:'monospace',letterSpacing:0,marginBottom:12}}>About BorderWatch</h1>
          <p style={{fontSize:14,lineHeight:1.75,color:'var(--text)',maxWidth:780}}>
            BorderWatch is a border logistics monitoring platform designed to track cargo trucks, detect route deviations, assess compliance violations, and support operational decisions with live telemetry, risk scoring, audit records, and infrastructure monitoring.
          </p>
        </div>
      </section>

      <section style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:12}}>
        {architectureHighlights.map(item=>{
          const Icon = item.icon;
          return(
            <article key={item.title} className="card" style={{padding:16,minHeight:178,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:item.color}} />
              <Icon size={22} color={item.color} style={{marginBottom:12}} />
              <h2 style={{fontSize:13,color:'var(--white)',marginBottom:8}}>{item.title}</h2>
              <p style={{fontSize:11,color:'var(--text2)',lineHeight:1.55}}>{item.body}</p>
            </article>
          );
        })}
      </section>

      <section className="card">
        <div className="card-header">
          <span className="card-title">Team Members</span>
          <span style={{fontSize:9,color:'var(--teal)',fontFamily:'monospace'}}>SEN3244</span>
        </div>
        <div style={{padding:16,display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:12}}>
          {teamMembers.map((member,index)=><MemberCard key={`${member.role}-${index}`} member={member} index={index}/>)}
        </div>
      </section>

      <section style={{display:'grid',gridTemplateColumns:'1.1fr .9fr',gap:16}}>
        <article className="card">
          <div className="card-header"><span className="card-title">Project Objective</span></div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:10}}>
            <p style={{fontSize:12,color:'var(--text2)',lineHeight:1.7}}>
              The project demonstrates how software architecture principles can be used to build a reliable, monitored, containerized, and deployable real-world application. It combines frontend dashboards, backend services, CI/CD automation, Kubernetes orchestration, and observability tooling.
            </p>
            <p style={{fontSize:12,color:'var(--text2)',lineHeight:1.7}}>
              Our implementation focuses on scalability, maintainability, security, performance visibility, fault recovery, and clear separation between application services and infrastructure responsibilities.
            </p>
          </div>
        </article>

        <article className="card">
          <div className="card-header"><span className="card-title">Technology Stack</span></div>
          <div className="card-body" style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {['React','Spring Boot','Docker','Kubernetes','Jenkins','Ansible','Prometheus','Grafana','VPS Deployment','GitHub'].map(item=>(
              <span key={item} style={{padding:'6px 9px',borderRadius:4,border:'1px solid var(--border2)',background:'var(--bg3)',color:'var(--text2)',fontSize:10,fontWeight:700}}>{item}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="card" style={{padding:14,display:'flex',alignItems:'center',gap:12,color:'var(--text2)',fontSize:11}}>
        <Activity size={16} color="var(--teal)" />
        <span>Note: update this page with the final team names, registration numbers, and exact contribution summaries before the presentation video and live demo.</span>
      </section>
    </div>
  );
}
