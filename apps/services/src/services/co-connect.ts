import { getKeyForCO } from "../process/center-online"
import axios from 'axios'

const maxLength = 10000

export const getAllStaff = async (req, res, next) => {
  const {
    _token,
    xsrf_token,
    centeronline_session,
    x_csrf_token
  } = await getKeyForCO()
  axios({
    method: 'post',
    url: 'https://quantri.betaschool.edu.vn/center/staff/get_list',
    headers: {
      'authority': 'quantri.betaschool.edu.vn',
      'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
      'accept': 'application/json, text/javascript, */*; q=0.01',
      'x-csrf-token': x_csrf_token,
      'x-requested-with': 'XMLHttpRequest',
      'sec-ch-ua-mobile': '?0',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'origin': 'https://quantri.betaschool.edu.vn',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://quantri.betaschool.edu.vn/center/staff',
      'accept-language': 'en-US,en;q=0.9',
      'cookie': `__cfduid=df94f35b4dc9c2be9e5741ced4bf9eb271611784755; _ga=GA1.1.1696591928.1611786169; XSRF-TOKEN=${xsrf_token}; centeronline_session=${centeronline_session}; _ga_6LBTR78SZX=GS1.1.1611808222.2.1.1611811358.0; __cfduid=d09f943caf7e0ac234677969aabfc86c71611797021; XSRF-TOKEN=eyJpdiI6Inpva2hXR0g4MFVxZEZzRFVlREFvZmc9PSIsInZhbHVlIjoiWkM0cU5PZ0l0aldnY0s0NTEzS3gwM25iNEpPZ3VoXC9ydHNIbkRxcGcxUWdiYnl3ZHZOYlNTNUNhR29ucXArSnEiLCJtYWMiOiI2M2JjMTQwZGI5YmJjN2I3MWZiOTJhNTM5ODVkNTY3MzUwMTI0MjRmYWRkMGNmNDYwMGE1ZDIwMGEyNjdhOTc2In0%3D; centeronline_session=eyJpdiI6Im5GK2JEMCtNTkdzazNYcGhZeTV0b2c9PSIsInZhbHVlIjoiZldkYTc5ME93V0tsNkpGSUFsaUdqNlY0Znp0ZDZpcEN3THFyVytQbTJ5eUdOZ01FUWdEVGRDMzQxS0FUMXhDNCIsIm1hYyI6IjQyMTQzNzVhNTljYTE0NjI4NDhhODA0OTU3ZTRlNGQ3NDYxMmVjMzdhOTlkNDhlZjBlOTkyNjEwNjViZjBlNTEifQ%3D%3D`
    },
    data: `draw=1&columns%5B0%5D%5Bdata%5D=user_id&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=user_id&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=user_id&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=user_id&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=user_id&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=user_id&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=user_id&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=false&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&start=0&length=${maxLength}&search%5Bvalue%5D=&search%5Bregex%5D=false`
  })
    .then(function (response) {
      res.status(200).json({
        data: response.data,
        code: 200
      });
    })
    .catch(function (error) {
      res.status(200).json({
        code: 404,
        error: error.toString()
      });
    });
}

export const getAllStudent = async (req, res, next) => {
  const {
    _token,
    xsrf_token,
    centeronline_session,
    x_csrf_token
  } = await getKeyForCO()
  axios({
    method: 'post',
    url: 'https://quantri.betaschool.edu.vn/center/student/get_list',
    headers: {
      'authority': 'quantri.betaschool.edu.vn',
      'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
      'accept': 'application/json, text/javascript, */*; q=0.01',
      'x-csrf-token': x_csrf_token,
      'x-requested-with': 'XMLHttpRequest',
      'sec-ch-ua-mobile': '?0',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'origin': 'https://quantri.betaschool.edu.vn',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://quantri.betaschool.edu.vn/center/staff',
      'accept-language': 'en-US,en;q=0.9',
      'cookie': `__cfduid=df94f35b4dc9c2be9e5741ced4bf9eb271611784755; _ga=GA1.1.1696591928.1611786169; XSRF-TOKEN=${xsrf_token}; centeronline_session=${centeronline_session}; _ga_6LBTR78SZX=GS1.1.1611808222.2.1.1611811358.0; __cfduid=d09f943caf7e0ac234677969aabfc86c71611797021; XSRF-TOKEN=eyJpdiI6Inpva2hXR0g4MFVxZEZzRFVlREFvZmc9PSIsInZhbHVlIjoiWkM0cU5PZ0l0aldnY0s0NTEzS3gwM25iNEpPZ3VoXC9ydHNIbkRxcGcxUWdiYnl3ZHZOYlNTNUNhR29ucXArSnEiLCJtYWMiOiI2M2JjMTQwZGI5YmJjN2I3MWZiOTJhNTM5ODVkNTY3MzUwMTI0MjRmYWRkMGNmNDYwMGE1ZDIwMGEyNjdhOTc2In0%3D; centeronline_session=eyJpdiI6Im5GK2JEMCtNTkdzazNYcGhZeTV0b2c9PSIsInZhbHVlIjoiZldkYTc5ME93V0tsNkpGSUFsaUdqNlY0Znp0ZDZpcEN3THFyVytQbTJ5eUdOZ01FUWdEVGRDMzQxS0FUMXhDNCIsIm1hYyI6IjQyMTQzNzVhNTljYTE0NjI4NDhhODA0OTU3ZTRlNGQ3NDYxMmVjMzdhOTlkNDhlZjBlOTkyNjEwNjViZjBlNTEifQ%3D%3D`
    },
    data: `draw=1&columns%5B0%5D%5Bdata%5D=user_id&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=user_id&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=user_id&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=user_id&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=user_id&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=user_id&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=user_id&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=false&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&start=0&length=${maxLength}&search%5Bvalue%5D=&search%5Bregex%5D=false&student_in_class_status=`
  })
    .then(function (response) {
      res.status(200).json({
        data: response.data,
        code: 200
      });
    })
    .catch(function (error) {
      res.status(200).json({
        code: 404,
        error: error.toString()
      });
    });
}

export const getAllTeacher = async (req, res, next) => {
  const {
    _token,
    xsrf_token,
    centeronline_session,
    x_csrf_token
  } = await getKeyForCO()
  axios({
    method: 'post',
    url: 'https://quantri.betaschool.edu.vn/center/teacher/get_list',
    headers: {
      'authority': 'quantri.betaschool.edu.vn',
      'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
      'accept': 'application/json, text/javascript, */*; q=0.01',
      'x-csrf-token': x_csrf_token,
      'x-requested-with': 'XMLHttpRequest',
      'sec-ch-ua-mobile': '?0',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'origin': 'https://quantri.betaschool.edu.vn',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://quantri.betaschool.edu.vn/center/staff',
      'accept-language': 'en-US,en;q=0.9',
      'cookie': `__cfduid=df94f35b4dc9c2be9e5741ced4bf9eb271611784755; _ga=GA1.1.1696591928.1611786169; XSRF-TOKEN=${xsrf_token}; centeronline_session=${centeronline_session}; _ga_6LBTR78SZX=GS1.1.1611808222.2.1.1611811358.0; __cfduid=d09f943caf7e0ac234677969aabfc86c71611797021; XSRF-TOKEN=eyJpdiI6Inpva2hXR0g4MFVxZEZzRFVlREFvZmc9PSIsInZhbHVlIjoiWkM0cU5PZ0l0aldnY0s0NTEzS3gwM25iNEpPZ3VoXC9ydHNIbkRxcGcxUWdiYnl3ZHZOYlNTNUNhR29ucXArSnEiLCJtYWMiOiI2M2JjMTQwZGI5YmJjN2I3MWZiOTJhNTM5ODVkNTY3MzUwMTI0MjRmYWRkMGNmNDYwMGE1ZDIwMGEyNjdhOTc2In0%3D; centeronline_session=eyJpdiI6Im5GK2JEMCtNTkdzazNYcGhZeTV0b2c9PSIsInZhbHVlIjoiZldkYTc5ME93V0tsNkpGSUFsaUdqNlY0Znp0ZDZpcEN3THFyVytQbTJ5eUdOZ01FUWdEVGRDMzQxS0FUMXhDNCIsIm1hYyI6IjQyMTQzNzVhNTljYTE0NjI4NDhhODA0OTU3ZTRlNGQ3NDYxMmVjMzdhOTlkNDhlZjBlOTkyNjEwNjViZjBlNTEifQ%3D%3D`
    },
    data: `draw=1&columns%5B0%5D%5Bdata%5D=user_id&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=user_id&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=user_id&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=user_id&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=user_id&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=user_id&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=user_id&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=false&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&start=0&length=${maxLength}&search%5Bvalue%5D=&search%5Bregex%5D=false`
  })
    .then(function (response) {
      res.status(200).json({
        data: response.data,
        code: 200
      });
    })
    .catch(function (error) {
      res.status(200).json({
        code: 404,
        error: error.toString()
      });
    });
}