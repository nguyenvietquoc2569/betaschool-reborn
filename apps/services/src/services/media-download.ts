import * as mongodb from 'mongodb'

const GridFSBucket = mongodb.GridFSBucket;
const MongoClient = mongodb.MongoClient;

let clientMongo: mongodb.MongoClient
let dbConnection: mongodb.Db;
let clientMongoSpeaking: mongodb.MongoClient
let dbConnectionSpeaking: mongodb.Db;

let isConnected = false
let isConnected2 = false
// getDB()
// setInterval(() => {
//   try {
//     if (clientMongo.isConnected()) {
//     } else {
//       clientMongo = null
//       dbConnection = null
//       connected = false
//       console.log('try to reconnect')
//     }
//   } catch (e) {
//     console.log(e.toString())
//   }
// }, 1000 * 10)

export function getDB () {
  return new Promise((resolve, reject) => {
    if (clientMongo && isConnected2) {
      resolve(dbConnection)
    } else {
      MongoClient.connect(process.env.mongodbMultimedia).then (database => {
          try {
            clientMongo = database
            dbConnection = database.db();
            isConnected2 = true
            resolve(dbConnection)
          } catch (e) {
            clientMongo = null
            dbConnection = null
            isConnected2 = false
            reject()
          }
      });
    }
  })
}

export function getDBSpeaking () {
  return new Promise((resolve, reject) => {
    if (clientMongoSpeaking && isConnected) {
      resolve(dbConnectionSpeaking)
    } else {
      MongoClient.connect(process.env.MultimediaSpeakingTest).then(database => {
          try {
            clientMongoSpeaking = database
            dbConnectionSpeaking = database.db();
            isConnected = true
            resolve(dbConnectionSpeaking)
          } catch (e) {
            isConnected = false
            dbConnectionSpeaking = null
            clientMongoSpeaking = null
            reject()
          }
      });
    }
  })
}

 
// create or use an existing mongodb-native db instance


export const downloadStreamFile = async (req,res,next)=>{
  getDB().then(async (db: mongodb.Db) => {
    const request = req.query.name
    const bucket = new GridFSBucket(db, {
      bucketName: req.query.bucket ? req.query.bucket : 'fs'
    });
    const metas = (await bucket.find({filename: request}).toArray())
    if (metas.length === 0) {
      res.sendStatus(404);
      return
    }
    const meta = metas[0]
    // console.log(meta)
    res.set('content-type', meta.contentType);
    res.set('accept-ranges', 'bytes');
    
    const downloadStream = bucket.openDownloadStreamByName((request));
    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });
    downloadStream.on('error', () => {
      res.sendStatus(404);
    });
    downloadStream.on('end', () => {
      res.end();
    });
  }, () => {
    res.sendStatus(500);
  })
}

export const downloadStreamFileSpeakingTest = async (req,res,next)=>{
  getDBSpeaking().then(async (db: mongodb.Db) => {
    const request = req.query.name
    const bucket = new GridFSBucket(db, {
      bucketName: req.query.bucket ? req.query.bucket : 'fs'
    });
    const metas = (await bucket.find({filename: request}).toArray())
    if (metas.length === 0) {
      res.sendStatus(404);
      return
    }
    const meta = metas[0]
    // console.log(meta)
    res.set('content-type', meta.contentType);
    res.set('accept-ranges', 'bytes');
    
    const downloadStream = bucket.openDownloadStreamByName((request));
    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });
    downloadStream.on('error', () => {
      res.sendStatus(404);
    });
    downloadStream.on('end', () => {
      res.end();
    });
  }, () => {
    res.sendStatus(500);
  })
}