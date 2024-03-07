import passport from '../services/passportconfig'
import jwt from 'jsonwebtoken'

import { StaffModel } from '@betaschool-reborn/database-model/models/staff.model';
import { PeopleModel } from '@betaschool-reborn/database-model/models/people.model';
import { checkAccountExist } from './center-online-sync';
import { IAppUserType } from '@betaschool-reborn/beta-data-type';

export const userlogin = (req, res, next) => {
    const errors = {}
    if (!req.body.emailid) {
        errors['emailid'] = 'Not Empty'
    }
    if (!req.body.password) {
        errors['password'] = 'Not Empty'
    }
    if (Object.values(errors).length > 0) {
        res.json({
            success: false,
            message: 'Invalid inputs',
            errors: errors
        })
    } else {
        passport.authenticate('login', { session: true }, (err, user, info) => {
            if (err || !user) {
                res.json(info);
            }
            else {
                req.login({ _id: user._id }, { session: false }, (err) => {
                    if (err) {
                        res.json({
                            success: false,
                            message: "Server Error"
                        });
                    }

                    const token = jwt.sign({ _id: user._id }, process.env.jwtSecret, { expiresIn: 5000000 });
                    res.json({
                        success: true,
                        message: "login successful",
                        user: {
                            ...user,
                            password: ''
                        },
                        token: token
                    });
                });
            }
        })(req, res, next);
    }
}

export function getUserInfoFromPortal(req, res, next) {
    const errors = {}
    if (!req.body.emailid) {
        errors['emailid'] = 'Not Empty'
    }
    if (!req.body.password) {
        errors['password'] = 'Not Empty'
    }

    if (Object.values(errors).length > 0) {
        res.json({
            success: false,
            message: 'Invalid inputs',
            errors: errors
        })
    } else {
        const emailid = req.body.emailid
        const password = req.body.password

        StaffModel.findOne({
            '$or': [
                { emailid: emailid.trim().toLowerCase() },
                { username: emailid.trim().toLowerCase() }
            ],
            active: true
        }).populate('linkPeople')
          .then(function (user) {
            if (!user) {
                // TODO user from center online
                checkAccountExist(emailid.trim().toLowerCase(), password).then(correct => {
                    console.log(correct)

                    if (!correct) {
                        res.status(500).json({
                            code: 500,
                            error: 'wrong username and password'
                        })
                        return
                    } else {
                        PeopleModel.findOne({
                            username: new RegExp("^" + emailid.trim().toLowerCase() + "$", "i")
                        }).populate('tags').populate('father').populate('mother').populate('students')
                            .then(function (people) {
                                if (!people) {
                                    res.status(500).json({
                                        code: 500,
                                        error: "Database is not sync, please try again after 10 mins",
                                    })
                                    return
                                } else {
                                    const token = jwt.sign({
                                        _id: people._id.toString(),
                                        type: IAppUserType.Client
                                    },process.env.jwtSecret, { expiresIn: 500000000 });
                                    res.status(200).json({
                                        code: 200,
                                        people: people.toObject(),
                                        token
                                    })
                                    return
                                }
                            }).catch(err => {
                                if (err) {
                                    res.status(500).json({
                                        code: 404,
                                        error: 'page error'
                                    })
                                    return
                                }
                            })
                    }
                })
            }
            else {
                res.status(500).json({
                    code: 500,
                    error: 'wrong username and password'
                })
                return
            }
        }).catch(err => {
            if (err) {
                res.status(404).json({
                    code: 404,
                    error: 'page error'
                })
                return
            }
        });

    }
}
