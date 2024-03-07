import axios from 'axios';
const fetch = require('node-fetch');
var FormData = require('form-data');
var qs = require('qs');

let _COkey = null

function getCookie(arr) {
  var result = {};
  for (let str of arr) {
    str = str.split(';')[0]
    let cur = str.split('=');
    result[cur[0]] = cur[1];
  }
  return result;
}

function getToken(data) {
  return data.split('_token" value="')[1].split('">')[0]
}

async function getCookieAndTokenStep1() {
  return new Promise<{
    _token:string,
    xsrf_token:string,
    centeronline_session:string
  }>((resolve) => {
    axios.get('https://quantri.betaschool.edu.vn/login', {
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "upgrade-insecure-requests": "1"
      },
    }).then(response => {
      let _token = getToken(response.data)
      let cookie = getCookie(response.headers['set-cookie'])
      let xsrf_token = cookie['XSRF-TOKEN']
      let centeronline_session = cookie['centeronline_session']
      resolve({
        _token,
        xsrf_token,
        centeronline_session
      })
    })
  })
}

async function triggerLoginStep2 ({ _token,xsrf_token,centeronline_session}) {
  return new Promise<{
    _token:string,
    xsrf_token:string,
    centeronline_session:string,
    x_csrf_token?:string
  }>(resolve => {
    axios({
      method: 'post',
      url: 'https://quantri.betaschool.edu.vn/login_process',
      headers: {
        'authority': 'quantri.betaschool.edu.vn',
        'cache-control': 'max-age=0',
        'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
        'sec-ch-ua-mobile': '?0',
        'upgrade-insecure-requests': '1',
        'origin': 'https://quantri.betaschool.edu.vn',
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'sec-fetch-dest': 'document',
        'referer': 'https://quantri.betaschool.edu.vn/login',
        'accept-language': 'en-US,en;q=0.9',
        'cookie': `__cfduid=df94f35b4dc9c2be9e5741ced4bf9eb271611784755; _ga=GA1.1.1696591928.1611786169; _ga_6LBTR78SZX=GS1.1.1611786168.1.1.1611786441.0; XSRF-TOKEN=${xsrf_token}; centeronline_session=${centeronline_session}`
      },
      data: qs.stringify({
        '_token': `${_token}`,
        'username': 'systembot1',
        'password': 'betaschool2021system1',
        'remember': '1'
      })
    })
      .then(function (response) {
        let _token = getToken(response.data)
        let cookie = getCookie(response.headers['set-cookie'])
        let xsrf_token = cookie['XSRF-TOKEN']
        let centeronline_session = cookie['centeronline_session']
        resolve({
          _token,
          xsrf_token,
          centeronline_session
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  })
}

async function step3GetCSRFToken ({ _token,xsrf_token,centeronline_session}) {
  return new Promise<{
    _token?:string,
    xsrf_token:string,
    centeronline_session:string,
    x_csrf_token:string
  }>(resolve => {
    axios({
      method: 'get',
      url: 'https://quantri.betaschool.edu.vn/',
      headers: { 
        'authority': 'quantri.betaschool.edu.vn', 
        'cache-control': 'max-age=0', 
        'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"', 
        'sec-ch-ua-mobile': '?0', 
        'upgrade-insecure-requests': '1', 
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36', 
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9', 
        'sec-fetch-site': 'none', 
        'sec-fetch-mode': 'navigate', 
        'sec-fetch-user': '?1', 
        'sec-fetch-dest': 'document', 
        'accept-language': 'en-US,en;q=0.9', 
        'cookie': '__cfduid=df94f35b4dc9c2be9e5741ced4bf9eb271611784755; _ga=GA1.1.1696591928.1611786169; _ga_6LBTR78SZX=GS1.1.1611808222.2.1.1611808514.0; XSRF-TOKEN=eyJpdiI6IlFFYzJsSGhsSnhxRks2dUNMYUtDM3c9PSIsInZhbHVlIjoiajBFYk5YbWxCVk9vMVFlbzRuaGVNaktLR25XNFdhZ2JhWDJTdkJHcGVVSjJIbWlPV1R5bTJ2eEpYZlFiMFpHViIsIm1hYyI6ImQ5ZGE5NWM5OTkxMDM0ZGVjNjRiZWIwMDJlNjBmZGRiN2MzY2E3OWQ4Mzc0YTQ4ZWU4MTIwODI5OTViNTczMDUifQ%3D%3D; centeronline_session=eyJpdiI6Iit4VVRTd1B4USs0WDFmNlwvbGhMNkdnPT0iLCJ2YWx1ZSI6IkQ1bU5PQkFETWdIUHlwcENuWmJ1UnBWZGlGYnJ2NVhkUUhiRktqYlFkbUFpMEF0Zk5lVFozVTJ0ajdoS1wveDBxIiwibWFjIjoiZmVjY2IzNzg2OTE0NWMwNTM4NDM4MzU3MzdhOGUzMmUzODU2YTBhYWIwMjUwZjFlMjE1MzUzNDVhMDE5ZmJmNCJ9; __cfduid=d09f943caf7e0ac234677969aabfc86c71611797021; XSRF-TOKEN=eyJpdiI6ImhJR0hDWXF5T3k0VHpOVDZtRzdOUlE9PSIsInZhbHVlIjoiczhKc0Z6a3FpOWRuOXE1dGU3OTYxVnU3WHI3QlwvYkJCRHlsSTArZ0grWWcyNnc2MDZDcmxuaTFCZnBMenhVRDYiLCJtYWMiOiIwODUxZjhlMTFlM2RmNjRiMjE5NWVhMjE3NWJjMWE0NGZhYzYxNjg5ZGIyMjJmMmNhMTI2OWE2M2I4ODY1ODcxIn0%3D; centeronline_session=eyJpdiI6IlBUSkZQMVZhVnduK3JWZ0tOVklNRkE9PSIsInZhbHVlIjoiS2JNQU5qZnpnNHcrVjFZRTB6UTNMOXBnZE9ZRDI4SkwzTTY0Q2hQYkJRT3RmZE5nelRCWmxEeDZOdmJycmhrOCIsIm1hYyI6IjRiZWJlYmJiOTNmNzk1YWZmMmVkZTAzYzQ5NWE2ZGMxZjg1YmEzMGJiZmZiN2QwM2IzNjVlZDUxZWM1Zjc1N2YifQ%3D%3D'
      }
    })
    .then(function (response) {
      let x_csrf_token = (response.data.split('<meta name="csrf-token" content="')[1].split('">')[0])
      let cookie = getCookie(response.headers['set-cookie'])
      let xsrf_token = cookie['XSRF-TOKEN']
      let centeronline_session = cookie['centeronline_session']
      resolve({
        _token,
        xsrf_token,
        centeronline_session,
        x_csrf_token
      })
      // resolve(JSON.stringify(response.data).split('<meta name=\\"csrf-token\\" content=\\"'))[1].split('">')[0]
    })
    .catch(function (error) {
      console.log(error);
    });
  })
}

const _getCOkey = (async function() {
  let step1 = await getCookieAndTokenStep1()
  step1 = await triggerLoginStep2(step1)
  let key = await step3GetCSRFToken(step1)
  _COkey = {
    ...key
  }
})

export const getKeyForCO = async (): Promise<{
  _token:string,
  xsrf_token:string,
  centeronline_session:string,
  x_csrf_token?:string
}> => {
  if (_COkey !== null) return _COkey
  await _getCOkey()
  return _COkey
}

export const resetKeyForCO = async () => {
  _COkey = null
}

