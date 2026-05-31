import axios from 'axios';
const api=axios.create({baseURL:'',timeout:15000,headers:{'Content-Type':'application/json'}});
api.interceptors.response.use(r=>r,err=>{
  if(err.response?.status===401){localStorage.clear();if(!window.location.pathname.includes('/login'))window.location.href='/login';}
  return Promise.reject(new Error(err.response?.data?.error||err.message));
});
export default api;
