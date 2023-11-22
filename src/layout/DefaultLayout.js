import React, { useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from 'src/views/forms/validation/store';
import axios from 'axios';
import base_url from 'src/base_url';
import expireToken from 'src/global_function/unauthorizedToken';
import LoadingBar from 'react-top-loading-bar';

const DefaultLayout = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken , refreshToken , profileDetails} = state
  const [_404,set404] = useState(true)
  const [accessTokenValid,setAccessTokenValid] = useState(false)
  const [progress,setProgress] = useState(0);  
  if (typeof window !== 'undefined') {
    window.setProgress = setProgress;
  }

  const checkAccessTokenAuthenticity = () => {
    const headers = {
      "Content-Type":"application/json",      
      'ngrok-skip-browser-warning':true
    }
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    headers['Authorization'] = `Bearer ${access}`;

    axios.get(`${base_url}/check_token_authenticity/`,{headers:headers})
    .then((response)=>{                
      setAccessTokenValid(true)
    })
    .catch((error)=>{             
      if(error.response.status === 401){
          expireToken(refresh,setAccessTokenValid)          
      }
    })
  }
  const navigate = useNavigate();  
  const checkServerAvaibility = ()=> {
    const header = {
      "Content-Type":"application/json",      
      'ngrok-skip-browser-warning':true
    }
    
    axios.get(`${base_url}/check_server_avaibility/`,{headers:header})
    .then((response)=>{
      set404(false) 
      console.log(response.data)
    })
    .catch((error)=>{             
      navigate("/404")
    })
  }
  
  useEffect(() => {
    if(_404){      
      checkServerAvaibility()
    }else{
      checkAccessTokenAuthenticity()
    }
  },[_404])

   useEffect(() => {
    if(!accessToken){
        navigate("/login")
    }    
  }, []);    
  useEffect(() => {
    console.log(accessTokenValid)
  },[accessTokenValid])
  if(accessToken && !_404 && accessTokenValid){
    return (    
      <div>
  <LoadingBar color={'#1f6feb'} progress={progress}
      onLoaderFinished={() => setProgress(0)} />
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <AppHeader />
          <div className="body flex-grow-1 px-3">
            <AppContent />
          </div>
          <AppFooter/>
        </div>
      </div>    
  )
  }else{
    return null
  }
}

export default DefaultLayout
