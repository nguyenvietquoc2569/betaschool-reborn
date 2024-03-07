import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import * as passport from "passport";
import { StaffModel } from '@betaschool-reborn/database-model/models/staff.model';
import { PeopleModel } from '@betaschool-reborn/database-model/models/people.model';
import { IAppUserType } from '@betaschool-reborn/beta-data-type';
import bcrypt from 'bcrypt'
import { checkAccountExist } from './center-online-sync';


passport.use('login', new LocalStrategy({
  usernameField: 'emailid',
  passwordField: 'password',
  passReqToCallback: true
}, async function (req, emailid, password, done) {
  try {
    const user = await StaffModel.findOne({
      '$or': [
        { emailid: emailid.trim().toLowerCase() },
        { username: emailid.trim().toLowerCase() }
      ],
      active: true
    })
  
    if (!user) {
      return done(null, false, {
        success: false,
        message: "Invalid emailid"
      });
    }
    else {
      bcrypt.compare(password, user.password).then(function (res) {
        if (res) {
          return done(null, user.toObject(), {
            success: true,
            message: "logged in successfully"
          });
        }
        else {
          return done(null, false, {
            success: false,
            message: "Invalid Password"
          });
        }
      });
    }
  } catch (err) {
    if (err) {
      return done(err, false, {
        success: false,
        message: "Server Error"
      });
    }
  }
}))

passport.use('login-app', new LocalStrategy({
  usernameField: 'emailid',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, emailid, password, done) {
  StaffModel.findOne({
    '$or': [
      { emailid: emailid.trim().toLowerCase() },
      { username: emailid.trim().toLowerCase() }
    ],
    active: true
  }).populate('linkPeople').then(function (user) {
    if (!user) {
      // TODO user from center online
      checkAccountExist(emailid.trim().toLowerCase(), password).then(correct => {
        console.log(correct)

        if (!correct) {
          return done(null, false, {
            success: false,
            message: "Invalid emailid"
          });
        } else {
          PeopleModel.findOne({
            username: new RegExp("^" + emailid.trim().toLowerCase() + "$", "i")
          }).populate('tags').populate('father').populate('mother').populate('students')
          .then(function (people) {
            if (!people) {
              return done(null, false, {
                success: false,
                message: "Database is not sync, please try again after 10 mins",
                code: 501
              });
            } else {
              done(null, {
                type: IAppUserType.Client,
                people: people.toObject()
              }, {
                success: true,
                message: "logged in successfully"
              });
            }
          }).catch(err => {
            if (err) {
              return done(err, false, {
                success: false,
                message: "Server Error"
              });
            }
          })
        }
      })
    }
    else {
      bcrypt.compare(password, user.password).then(function (res) {
        if (res) {
          return done(null, {
            type: IAppUserType.Staff,
            user: user.toObject()
          }, {
            success: true,
            message: "logged in successfully"
          });
        }
        else {
          return done(null, false, {
            success: false,
            message: "Invalid Password"
          });
        }
      });
    }
  }).catch(err => {
    if (err) {
      return done(err, false, {
        success: false,
        message: "Server Error"
      });
    }
  });
}))

const opts = { jwtFromRequest: '', secretOrKey: '' }
//opts.jwtFromRequest = ExtractJwt.fromHeader('authorization');
opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('Token');
opts.secretOrKey = process.env.jwtSecret

passport.use('user-token', new JwtStrategy(opts, function (jwt_payload, done) {
  StaffModel.findOne({ _id: jwt_payload._id, active: true }).populate('linkPeople').then(function (user) {
    if (user) {
      return done(null, user.toObject(), {
        success: true,
        message: "Successfull"
      });
    } else {
      return done(null, false, {
        success: false,
        message: "Authentication Failed"
      });
    }
  }).catch(err => {
    if (err) {
      return done(err, false, {
        success: false,
        message: "Server Error"
      });
    }
  });
}));

passport.use('user-token-app', new JwtStrategy(opts, function (jwt_payload, done) {
  if (jwt_payload.type === IAppUserType.Staff) {
    StaffModel.findOne({ _id: jwt_payload._id, active: true })
      .populate({
        path: 'linkPeople',
        populate: {
          path: 'father, mother, students'
        }
      })
      .then(function (user) {
      if (user) {
        return done(null, {
          type: IAppUserType.Staff,
          user: user.toObject()
        }, {
          success: true,
          message: "Successfull"
        });
      } else {
        return done(null, false, {
          success: false,
          message: "Authentication Failed"
        });
      }
    }).catch(err => {
      if (err) {
        return done(err, false, {
          success: false,
          message: "Server Error"
        });
      }
    });
  } else if (jwt_payload.type === IAppUserType.Client) {
    PeopleModel.findOne({ _id: jwt_payload._id })
      .populate('tags').populate('father').populate('mother').populate('students')
      .then(function (people) {
        if (people) {
          return done(null, {
            type: IAppUserType.Client,
            people: people.toObject()
          }, {
            success: true,
            message: "Successfull"
          });
        } else {
          return done(null, false, {
            success: false,
            message: "Authentication Failed"
          });
        }
      })
  }
}));

export default passport


