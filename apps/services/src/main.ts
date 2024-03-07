import express from 'express';
import createError from 'http-errors';
import helmet from 'helmet'
import * as path from 'path'
import logger from 'morgan'
import * as bodyParser from 'body-parser'
import '@betaschool-reborn/database-model/connection'
import expressSession from 'express-session'
import passport from './services/passportconfig'

const app = express();
app.use(helmet());
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin");
    next();
});

// app.use(ExpressValidator());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true }));

//passport
app.use(expressSession({ 
  secret: process.env.secretExpressSession,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});


//bind routes
import { router as login } from './routes/login'
app.use('/api/v1/login',login);

import { router as centerOnline } from './routes/center-online-sync'
app.use('/api/v1/centeronline',passport.authenticate('user-token', { session : false }),centerOnline);

import { router as user } from './routes/user'
app.use("/api/v1/user",passport.authenticate('user-token', { session : false }),user);

import { router as media } from './routes/media'
app.use("/api/v1/media",passport.authenticate('user-token', { session : false }),media);

import { router as mediaDownload } from './routes/media-download'
app.use("/api/v1/media-client",mediaDownload);

import { router as problem} from './routes/problem'
app.use("/api/v1/problem", passport.authenticate('user-token', { session : false }), problem)

import { router as exam} from './routes/exam'
app.use("/api/v1/exam", passport.authenticate('user-token', { session : false }), exam)

import { router as examClient} from './routes/exam-client'
app.use("/api/v1/examclient", examClient)

import { router as people} from './routes/people'
app.use("/api/v1/people",passport.authenticate('user-token', { session : false }), people)

import { router as certificate} from './routes/certificate'
app.use("/api/v1/certificate",passport.authenticate('user-token', { session : false }), certificate)
import { router as certificateCli} from './routes/certificate-client'
app.use("/api/v1/certificate-client", certificateCli)

import { router as faceService} from './routes/face-service'
app.use("/api/v1/facesvc", passport.authenticate('user-token', { session : false }),faceService)

import { router as pointClient} from './routes/point-client'
app.use("/api/v1/pointclient", passport.authenticate('user-token', { session : false }), pointClient)

import { router as faceImage} from './routes/face-image'
app.use("/api/v1/face-hanet", faceImage)

import { router as st_override_room} from './routes/STOverrideRoomModel'
app.use("/api/v1/stoverrideroom", passport.authenticate('user-token', { session : false }), st_override_room)

import { router as hanetCamera} from './routes/hanet-face'
app.use("/api/v1/hanet", hanetCamera)

import { router as classApi} from './routes/classes'
app.use("/api/v1/classes", passport.authenticate('user-token', { session : false }), classApi)

import { router as feedbackRouter} from './routes/feedback'
app.use("/api/v1/feedback", passport.authenticate('user-token', { session : false }), feedbackRouter)

import { router as dotBApi} from './routes/dotb'
app.use("/api/v1/dotB", dotBApi)

//----------- APP API

import { router as applogin } from './routes-app/login'
app.use('/api/app/v1/login',applogin);
import { router as appUser } from './routes-app/user'
app.use('/api/app/v1/user', passport.authenticate('user-token-app', { session : false }), appUser);
import { router as appClass } from './routes-app/class'
app.use('/api/app/v1/class', passport.authenticate('user-token-app', { session : false }), appClass);
import { router as appPeople } from './routes-app/people'
app.use('/api/app/v1/people', passport.authenticate('user-token-app', { session : false }), appPeople);




app.get('/health', (req,res) =>{
  res.statusCode = 200;
  res.send('success')
  res.end();
});

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.use(function(req, res, next) {
  next(createError(404,"Invalid API. Use the official documentation to get the list of valid APIS."));
});

app.use((err, req, res, next)=>{
  console.log(err);
  res.status(err.status).json({
      success : false,
      message : err.message
  });
});

const port = process.env.port || 5000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

// dbinit()
// loadCacheFromDatabase()
