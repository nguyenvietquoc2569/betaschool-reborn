import { StaffModel } from "@betaschool-reborn/database-model/models/staff.model";
import * as mongodb from 'mongodb'

const GridFSBucket = mongodb.GridFSBucket;
const MongoClient = mongodb.MongoClient;

import bcrypt from'bcrypt'
const saltRounds = 10;

let dbConnection: mongodb.Db;
let connected = false

function getDB () {
  return new Promise((resolve, reject) => {
    if (connected) {
      resolve(dbConnection)
    } else {
      MongoClient.connect(process.env.mongoHost).then()

      MongoClient.connect(process.env.mongoHost).then(database => {
          try {
            dbConnection = database.db();
            connected = true
            resolve(dbConnection)
          } catch (e) {
            dbConnection = null
            connected = false
            reject()
          }
      });
    }
  })
}

const accounts = [{
  name : 'Tieu Lam Giao',
  username: 'giaotl',
  emailid : 'giaotl@betaschool.edu.vn',
  permissions: ['GLOBAL', 'EXAM-QUESTION-EDITOR'],
  active: true
},
{
  name : 'Rachel Nguyen',
  username: 'rachel.nguyen',
  emailid : 'rachel.nguyen@betaschool.edu.vn',
  permissions: ['GLOBAL', 'EXAM-QUESTION-EDITOR'],
  active: true
}
,
{
  name : 'Quoc Nguyen',
  username: 'quocnv',
  emailid : 'quocnv@betaschool.edu.vn',
  permissions: ['GLOBAL', 'EXAM-QUESTION-EDITOR'],
  active: true
}]

//create admin
export const createadmin = ()=>{
  bcrypt.hash("betaschool2021.", saltRounds).then((hash)=>{
    for (const acc of accounts) {
      const tempdata = new StaffModel({
          ...acc,
          password : hash,
      })
      tempdata.save().then(()=>{
          console.log("user created")
      }).catch((err)=>{
          console.log("err1",err);
      })
    }
  }).catch((err)=>{
      console.log("err2",err)
  })
}



export const hashPassword = (password)=>{
    return (new Promise((resolve,reject)=>{
        bcrypt.hash(password, saltRounds).then(function(hash) {
            resolve(hash);
        }).catch((err)=>{
            reject(err);
        })
    }))
}

export const dbinit = async() => {
    getDB().then( async ( db:mongodb.Db) => {
        // console.log(await (db.collection('problems').listIndexes().toArray()))
        db.collection('problems').createIndex( { htmlMakeUp: "text", category: "text", tags: 'text'} ).catch(e => {})
        db.collection('exams').createIndex( { name: "text", des: "text", _id: 'text', approveStatus: 'text'} ).catch(e => {})
        db.collection('betatests').createIndex( { code: "text",
          'studenInfo.name': "text", 
          'studenInfo.dateOfBirth': "text",
          'studenInfo.coID': "text",
         } ).catch(e => {})
        db.collection('peoples').createIndex( { code: 1,
        } ).catch(e => {console.log(e)})
        db.collection('stoverriderooms').createIndex( { timetableMD5: 1,
        } ).catch(e => {console.log(e)})
        db.collection('tagpeoples').createIndex( { code: 1,
        } ).catch(e => {console.log(e)})
    })
}