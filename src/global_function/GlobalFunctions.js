import axios from 'axios'
import base_url from 'src/base_url'

import Swal from 'sweetalert';

// Used for handling expired tokens
const APIMiddleware = async (reqInstance, endpoint, method, headers, body = null, params = null) => {
    // Get the access and refresh tokens
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    headers['Authorization'] = `Bearer ${access}`;

    let response_obj;
    window.setProgress(100)
    if (method === 'get') {
        try {
            const response = await reqInstance.get(`${base_url}${endpoint}`, { headers, params });
            response_obj = { 'error': false, 'response': response };
        } catch (error) {
            if (error.response && error.response.status === 401) {                
                const result = await expireToken(refresh);
                localStorage.setItem('accessToken', result.access);
                localStorage.setItem('refreshToken', result.refresh);                                
                response_obj = await APIMiddleware(reqInstance, endpoint, method, headers, body, params);                
            } else {
                response_obj = { 'error': true, 'error': error };
            }
        }
    } else if (method === 'post') {
        try {
            const response = await reqInstance.post(`${base_url}${endpoint}`, body, { headers });
            response_obj = { 'error': false, 'response': response };
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const result = await expireToken(refresh);
                localStorage.setItem('accessToken', result.access);
                localStorage.setItem('refreshToken', result.refresh);
                response_obj = await APIMiddleware(reqInstance, endpoint, method, headers, body, params);                
            } else {
                response_obj = { 'error': true, 'error': error };
            }
        }
    }    
    return response_obj;
};

const expireToken = async (refreshToken) => {
    const header = {
        'ngrok-skip-browser-warning': true
    };

    return axios.post(`${base_url}/auth/api/token/refresh/`, { "refresh": refreshToken }, { headers: header })
        .then((response) => response.data)
        .catch((error) => { throw error; });
};

const showAlert = (title,text) => {
    console.log("helo");
    Swal({
        title: title,
        text: text,
        icon: 'success',
        button: 'OK',
      });
  
  };

export {APIMiddleware , showAlert}