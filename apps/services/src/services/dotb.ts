import axios from 'axios'

export const getTheCentersFromDotB = (async function(req, res) {
  axios({
    method: 'post',
    url: `https://beta.dotb.cloud/rest/v11_3/v1/get_center_list`,
    headers: { 
      'Content-Type': 'application/json', 
      'content-language': 'vi', 
      'device-type': '0'
    },
    data: {
      access_token: process.env.dotBtoken // eslint-disable-line
    }
  })
  .then(function (response) {
    res.json({
      code: 200,
      data: response.data.data
    })
  })
  .catch(function (error) {
    res.json({
      code: 404,
      error: error.toString()
    })
  }); 
})


export const getClassForTheCenterFromDotB = (async function(req, res) {
  const {startDate, endDate, centerId} = req.body
  axios({
    method: 'post',
    url: `https://beta.dotb.cloud/rest/v11_3/v1/get_class_list`,
    headers: { 
      'Content-Type': 'application/json', 
      'content-language': 'vi', 
      'device-type': '0'
    },
    data: {
      access_token: process.env.dotBtoken, // eslint-disable-line
      start: startDate,
      end: endDate,
      center_id: centerId // eslint-disable-line
    }
  })
  .then(function (response) {
    res.json({
      code: 200,
      data: response.data.data
    })
  })
  .catch(function (error) {
    console.log(error);
    res.json({
      code: 404,
      error: error.toString()
    })
  }); 
})