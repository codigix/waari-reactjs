


import axios from 'axios';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';




// const url = "https://erp.travelwithwaari.com/api/api"
const url = import.meta.env.VITE_WAARI_BASEURL
console.log(url)
const api = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
});
const key = CryptoJS.enc.Utf8.parse("1234567890123456"); // Example key
const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
const encryptData = (data) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const clientcode=localStorage.getItem("clientcode")
  const encryptedData = encryptData(clientcode);
  if (token) {
    config.headers['token'] = token;
  }
  if(encryptedData)
  {
    config.headers['clientcode']=encryptedData;
  }
  else{
    config.headers['clientcode']="";
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (Array.isArray(error.response.data.message)) {
        toast.error(error.response.data.message[0]);
      } else {
        toast.error(error.response.data.message);
      }
      // console.log(error)
      if (error.response.status === 408) {
        setTimeout(() => {
          localStorage.removeItem("token")
          localStorage.removeItem("permissions")
          localStorage.removeItem("roleId")
          localStorage.removeItem("status")
          window.location.href = '/sales/login';
        }, 1000);
      }
      // console.log(error.response.status);
      // console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    return Promise.reject(error);
  }
);

export const get = async (url, params = {}, additionalHeaders = {}) => {

  // console.log("params")
  // console.log(params)
  try {
    const response = await api.get(url, {
      params,
      headers: {
        ...additionalHeaders, // Merge the additional headers with the interceptor headers
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const post = async (url, data = {}) => {
  try {
    const response = await api.post(url, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const put = async (url, data = {}) => {
  try {
    const response = await api.put(url, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const del = async (url) => {
  try {
    const response = await api.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};
