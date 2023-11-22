import React, { useEffect } from 'react';
import Axios from 'axios';
import { useNavigate , redirect } from 'react-router-dom';
import { useState } from 'react';
import { useContext } from 'react'
import { Store } from 'src/views/forms/validation/store';
import base_url from 'src/base_url';
import "./LoginForm.css";
import expireToken from 'src/global_function/unauthorizedToken';
import meet_illustration from './remote-meet.png'
import {
  MDBBtn,  
  MDBCard,
  MDBCardBody,
  MDBInput,  
  MDBIcon,  
}
from 'mdb-react-ui-kit';  



export default function Login(){
      

     const navigate = useNavigate();
  
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
     const { state, dispatch: ctxDispatch } = useContext(Store);
     const { refreshToken , set404 } = state;
    
  
    const submitHandler = async (e) => {

      e.preventDefault();
      const header = {
        'ngrok-skip-browser-warning':true
      }
      Axios.post(`${base_url}/auth/api/login/`,{
        "email":  email,
         "password":password        
      },{header})
      .then((response)=>{        
        ctxDispatch({ type: 'ACCESS_TOKEN', payload: response.data.access});
        ctxDispatch({ type: 'REFRESH_TOKEN', payload: response.data.refresh });
        localStorage.setItem('accessToken',response.data.access)
        localStorage.setItem('refreshToken',response.data.refresh)        
        navigate('/')
      })
      .catch((error)=>{
        console.log(error.code);
        if(error.code === "ERR_NETWORK"){
          ctxDispatch({ type: 'SET_404', payload: true });
        }
        else{
          if(error.response.status === 401){
            expireToken(refresh)            
        }
        }
        
      })

    };
    useEffect(()=>{      
      if(set404){
        navigate("/404")
        ctxDispatch({ type: 'SET_404', payload: false });
        console.log(set404);
      }
    },[set404])    

  return (
    <div className='d-flex justify-content-center align-items-center' style={{height:'100vh',flexWrap:'wrap'}}>
    <div className="illustration-auth container" style={{flex:'1', minWidth:'300px'}}>
      <img src={meet_illustration} alt="" style={{width:'100%',height:'auto'}}/>
    </div>
    <div id="login-form" style={{marginLeft:'2rem',marginRight:'2rem',flex:'1'}}>
      <h1>Login</h1>
      <form onSubmit={submitHandler}>
        <label htmlFor="username">Email:</label>
        <input type="text" id="usermail "name="email" onChange={e => setEmail(e.target.value)} placeholder="example@gmail.com"></input>
        <label htmlFor="password">Password:</label>
        <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" name="password"></input>
        <button className="form-control btn btn-outline-dark" type="submit" value="Submit">Login</button>
      </form>
    </div>    
    </div>
  );
};