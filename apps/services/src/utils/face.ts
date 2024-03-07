import { IFaceExtractionData } from '@betaschool-reborn/beta-data-type';
import axios from 'axios'

export const getEmbedding = (link: string) => {
  return new Promise<Array<IFaceExtractionData>>((resolve, reject) => {
    const url = 'https://insightservice.betaschool.edu.vn/extract'
    axios({
      method: 'post',
      url: 'https://insightservice.betaschool.edu.vn/extract',
      headers: {
        'Content-Type': 'text/plain',
        'Cookie': '__cfduid=d31f5dea8129a8eec9bcb5befa022c5801610996743'
      },
      data: {
        "images": {
          "data": [
            "string"
          ],
          "urls": [
            link
          ]
        },
        "max_size": [
          640,
          640
        ],
        "threshold": 0.6,
        "return_face_data": true,
        "extract_embedding": true,
        "extract_ga": true,
        "api_ver": "1"
      }
    }).then(function (res) {
      if (res.status === 200) {
        resolve(res.data && res.data[0] || [])
      } else {
        reject('server error')
      }
    })
      .catch(function (error) {
        console.log(error);
        reject('server error: ' + error.toString())
      });
  })
}

export const getEmbeddingFromData = (data: string) => {
  return new Promise<Array<IFaceExtractionData>>((resolve, reject) => {
    const url = 'https://insightservice.betaschool.edu.vn/extract'
    axios({
      method: 'post',
      url: 'https://insightservice.betaschool.edu.vn/extract',
      headers: {
        'Content-Type': 'text/plain',
        'Cookie': '__cfduid=d31f5dea8129a8eec9bcb5befa022c5801610996743'
      },
      data: {
        "images": {
          "data": [
            data
          ]
        },
        "max_size": [
          640,
          640
        ],
        "threshold": 0.6,
        "return_face_data": true,
        "extract_embedding": true,
        "extract_ga": true,
        "api_ver": "1"
      }
    }).then(function (res) {
      if (res.status === 200) {
        resolve(res.data && res.data[0] || [])
      } else {
        reject('server error')
      }
    })
      .catch(function (error) {
        console.log(error);
        reject('server error: ' + error.toString())
      });
  })
}

