import passport from '../services/passportconfig'
import { IAppUserType, IStaffUser } from '@betaschool-reborn/beta-data-type';
import jwt from 'jsonwebtoken'

export const userApplogin = (req, res, next) => {
  req.check('emailid', ` Invalid email address`).notEmpty();
  req.check('password', 'Invalid password').isLength({ min: 5, max: 16 });
  const errors = req.validationErrors()
  if (errors) {
    res.json({
      success: false,
      message: 'Invalid inputs',
      errors: errors
    })
  } else {
    passport.authenticate('login-app', { session: false }, (err, user, info) => {
      if (err || !user) {
        res.json(info);
      }
      else {
        req.login({ _id: user.type === IAppUserType.Client ? user.people._id : user.user._id, type: user.type }, { session: false }, (err) => {
          if (err) {
            res.json({
              success: false,
              message: "Server Error"
            });
          }

          const token = jwt.sign({ _id: user.type === IAppUserType.Client ? user.people._id : user.user._id, type: user.type }, process.env.jwtSecret, { expiresIn: 5000000 });
          res.json({
            success: true,
            message: "login successful",
            user: {
              ...user.user,
              password: ''
            },
            people: {
              ...user.people,
              password: ''
            },
            type: user.type,
            token: token
          });
        });
      }
    })(req, res, next);
  }
}
