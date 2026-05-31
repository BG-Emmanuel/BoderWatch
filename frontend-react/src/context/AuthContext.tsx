import React,{createContext,useContext,useState,useEffect,useCallback} from 'react';
import type {User,UserRole,AuthState} from '@/types';
import api from '@/services/api';
const AuthCtx=createContext<AuthState|null>(null);
export function AuthProvider({children}:{children:React.ReactNode}){
  const [user,setUser]=useState<User|null>(null);
  const [accessToken,setToken]=useState<string|null>(null);
  const [isLoading,setLoading]=useState(true);
  useEffect(()=>{
    const tok=localStorage.getItem('bw_token'),usr=localStorage.getItem('bw_user');
    if(tok&&usr){try{setToken(tok);setUser(JSON.parse(usr));api.defaults.headers.common['Authorization']=`Bearer ${tok}`;}catch{localStorage.clear();}}
    setLoading(false);
  },[]);
  const login=useCallback(async(username:string,password:string)=>{
    const res=await api.post('/api/v1/auth/login',{username,password});
    const{accessToken:tok,user:u}=res.data;
    setToken(tok);setUser(u);api.defaults.headers.common['Authorization']=`Bearer ${tok}`;
    localStorage.setItem('bw_token',tok);localStorage.setItem('bw_user',JSON.stringify(u));
  },[]);
  const logout=useCallback(()=>{
    setUser(null);setToken(null);delete api.defaults.headers.common['Authorization'];localStorage.clear();
  },[]);
  const hasRole=useCallback((...roles:UserRole[])=>!!user&&roles.includes(user.role),[user]);
  return <AuthCtx.Provider value={{user,accessToken,isLoading,login,logout,hasRole}}>{children}</AuthCtx.Provider>;
}
export function useAuth():AuthState{const c=useContext(AuthCtx);if(!c)throw new Error('useAuth outside AuthProvider');return c;}
