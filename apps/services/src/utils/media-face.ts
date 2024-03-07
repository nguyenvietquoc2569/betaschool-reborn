import { v4 as uuidv4 } from 'uuid'
import * as mongodb from 'mongodb'
import { getDB } from '../services/media-download';
import fetch from 'node-fetch'
import * as fs from 'fs'
import FileType from 'file-type'
const GridFSBucket = mongodb.GridFSBucket;


function get_url_extension(url) {
  return url.split(/[#?]/)[0].split('.').pop().trim();
}


// var http = require('https'),
//   Stream = require('stream').Transform,
//   fs = require('fs');
export const saveFaceToDB = async (link) => {
  return new Promise<{filename: string}>((resolve, reject) => {
    getDB().then(async (db: mongodb.Db) => {
      try {
        const bucket = new GridFSBucket(db, {
          bucketName: 'face-hanet-store'
        });
  
        const filename = `Beta-${uuidv4()}.${get_url_extension(link)}`
        
  
        await downloadFile(link, `./tmp/${filename}`)
        const readStream = fs.createReadStream(`./tmp/${filename}`);
        // const {mime} = await FileType.fileTypeFromFile(`./tmp/${filename}`)
  
        const uploadStream = bucket.openUploadStream(filename);
  
        uploadStream.on('error', (e) => {
          reject(e)
        });
  
        uploadStream.once('finish', function() {
          resolve({filename})
          fs.unlinkSync(`./tmp/${filename}`)
        });
        readStream.pipe(uploadStream);
      } catch (e) {
        reject(e)
      } 
    })
  })
}

const downloadFile = (async (url, path) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
});