import axios  from "axios";
import base_url from '../base_url';

const expireToken = async (refreshToken,setAccessTokenValid)=>{
    const header = {
        'ngrok-skip-browser-warning':true
      }
    axios.post(`${base_url}/auth/api/token/refresh/`,{
        "refresh":refreshToken
    },{headers:header})
    .then((response)=>{        
        localStorage.setItem('accessToken',response.data.access)
        localStorage.setItem('refreshToken',response.data.refresh)        
        setAccessTokenValid(true)
    })
    .catch((error)=>{
        console.log(error)
    })
}
export default expireToken