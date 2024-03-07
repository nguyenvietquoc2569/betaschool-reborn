import * as mongoose from 'mongoose'


//database connection
// mongoose.Promise = global.Promise;
const options = {
  autoIndex: false, 
  reconnectTries: 100,
  reconnectInterval: 500, 
  poolSize: 10, 
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useFindAndModify :  true
};

mongoose.connect(process.env.mongoHost, {}).then(()=>{
    console.log("connected to mongoDB : ", process.env.mongoHost);
    //tool.createadmin();
}).catch((err)=>{
    console.log("Error connecting to database",err);
})

export default mongoose;
