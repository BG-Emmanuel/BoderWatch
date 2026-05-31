import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import {AuthProvider,useAuth} from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import MapPage from '@/pages/MapPage';
import ViolationsPage from '@/pages/ViolationsPage';
import TrucksPage from '@/pages/TrucksPage';
import TelemetryPage from '@/pages/TelemetryPage';
import RiskPage from '@/pages/RiskPage';
import BlockchainPage from '@/pages/BlockchainPage';
import StatsPage from '@/pages/StatsPage';
import UsersPage from '@/pages/UsersPage';

function Guard({children}:{children:React.ReactNode}){
  const{user,isLoading}=useAuth();
  if(isLoading)return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'var(--teal)'}}>Loading BorderWatch…</div>;
  if(!user)return <Navigate to="/login" replace/>;
  return <>{children}</>;
}
export default function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/" element={<Guard><Layout/></Guard>}>
            <Route index element={<Navigate to="/dashboard" replace/>}/>
            <Route path="dashboard"  element={<DashboardPage/>}/>
            <Route path="map"        element={<MapPage/>}/>
            <Route path="violations" element={<ViolationsPage/>}/>
            <Route path="trucks"     element={<TrucksPage/>}/>
            <Route path="telemetry"  element={<TelemetryPage/>}/>
            <Route path="risk"       element={<RiskPage/>}/>
            <Route path="blockchain" element={<BlockchainPage/>}/>
            <Route path="stats"      element={<StatsPage/>}/>
            <Route path="users"      element={<UsersPage/>}/>
            <Route path="*"          element={<Navigate to="/dashboard" replace/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
