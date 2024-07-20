
import axios from 'axios'

export const getBaseUrlForServiceFromFrontend = () => {
  try {
    const enviroment = (window.location.href.includes('localhost') || window.location.href.includes('192.168') || window.location.href.includes('10.0')) ? 'dev' :
      (window.location.href.includes('qa.') || window.location.href.includes('qa.')) ? 'qa' : 'prod'
    switch (enviroment) {
      case 'dev':
        return `http://${window.location.hostname}:5000`
      case 'qa':
        return 'https://service2qa.betaschool.edu.vn'
      case 'prod':
        return 'https://service2.betaschool.edu.vn'
    }
  } catch (e) {

  }
  return ''
}

export class AuthService {
  token: string | null
  base: string
  constructor() {
    this.token = null;
    console.log(this.base = getBaseUrlForServiceFromFrontend());
  }

  retriveToken = () => {
    return localStorage.getItem('Token')
  }

  storeToken = (t: string) => {
    localStorage.setItem('Token', t);
  }

  deleteToken = () => {
    localStorage.removeItem('Token');
  }

  LoginAuth = (u: string, p: string) => {
    return UnsecurePost(this.base, {
      url: `/api/v1/login/`,
      data: {
        emailid: u,
        password: p
      }
    })
  }

  FetchAuth = (t: string) => {
    return UnsecureGet(this.base, {
      url: '/api/v1/user/details',
      params: {
        Token: t
      }
    })
  }
}

const auth = new AuthService()

export const SecureGet = (base: string, p: any) => {
  return axios({
    method: 'get',
    baseURL: base,
    ...p,
    params: {
      ...p.params,
      Token: auth.retriveToken()
    }
  })
}

export const UnsecureGet = (base: string, p: any) => {
  return axios({
    method: 'get',
    baseURL: base,
    ...p,
  })
}


export const SecurePost = (base: string, p: any) => {
  return axios({
    method: 'post',
    baseURL: base,
    ...p,
    params: {
      ...p.params,
      Token: auth.retriveToken()
    }
  })
}

export const UnsecurePost = (base: string, p: any) => {
  return axios({
    baseURL: base,
    method: 'post',
    ...p,
  })
}
