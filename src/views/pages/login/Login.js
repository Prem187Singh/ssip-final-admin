import React, { useEffect } from 'react';
import Axios from 'axios';
import { useNavigate , redirect } from 'react-router-dom';
import { useState } from 'react';
import { useContext } from 'react'
import { Store } from 'src/views/forms/validation/store';
import base_url from 'src/base_url';
import styles from "../login/Login.module.css";
import expireToken from 'src/global_function/unauthorizedToken';



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
            console.log(error.response)
            alert(error.response.data.detail)
            // expireToken(refreshToken,(error,result)=>{
            //   if(error){
            //     console.log("someting went worng");
            //   }
            //   ctxDispatch({ type: 'USER_SIGNIN', payload: result });
              
            // })
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

    <div className={styles.login}>
      <div className={styles.illustration}>
        <img
          className={styles.mobileLoginRafiki1}
          alt=""
          src="/images/mobile-loginrafiki-1.svg"
        />
      </div>
      <div className={styles.frame} />
      {/* <div className={styles.login1}>Login</div> */}

<form onSubmit={submitHandler}>

<div className={styles.frame1}>
        <div className={styles.email}>
          <div className={styles.password}>Email</div>
          <div className={styles.content}>
            <img className={styles.vectorIcon} alt="" src="/images/vector.svg" />
            <div className={styles.adornStartContainer}>
              <div className={styles.icon}>
                <img
                  className={styles.starsharpIcon}
                  alt=""
                  src="/images/starsharp.svg"
                />
              </div>
            </div>
            <div className={styles.placeholder}>Placeholder</div>
            <div className={styles.adornEndContainer}>
              <img
                className={styles.removeredeyefilledIcon}
                alt=""
                src="/images/removeredeyefilled.svg"
              />
            </div>
            <div> <input type="text" id="usermail "name="email" onChange={e => setEmail(e.target.value)} className={[styles.examplegmailcom]} placeholder="example@gmail.com"></input></div>
          </div>
          
        </div>
      </div>
   
      <div className={styles.frame2}>
        <div className={styles.input}>
          <div className={styles.password}>Password</div>
          <div className={styles.content}>
            <img
              className={styles.iconlockround}
              alt=""
              src="/images/iconlockround.svg"
            />
            <div className={styles.adornStartContainer}>
              <div className={styles.icon}>
                <img
                  className={styles.starsharpIcon}
                  alt=""
                  src="/images/starsharp.svg"
                />
              </div>
            </div>
            <div className={styles.div}><input type="password" onChange={e => setPassword(e.target.value)} className={styles.examplegmailcom} placeholder="Password" name="password"></input></div>
          </div>
        </div>
      </div>
      
      <div className={styles.frame5}>
        <div className='w-100'>
          {/* <div className={styles.base}> */}
            {/* <img className={styles.maskedIcon} alt="" src="/images/masked-icon.svg" /> */}
            <button type='submit' className='form-control btn btn-outline-primary'>Login</button>
            {/* <img className={styles.maskedIcon} alt="" src="/images/masked-icon1.svg" /> */}
          {/* </div> */}
        </div>
      </div>

</form>

    </div>
  );
};