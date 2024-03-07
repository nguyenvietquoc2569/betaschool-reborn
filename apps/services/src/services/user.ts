import { IStaffUser } from '@betaschool-reborn/beta-data-type'
import { ObjectId } from 'mongodb';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { StaffModel } from '@betaschool-reborn/database-model/models/staff.model';
import bcrypt from 'bcrypt'

const opts = { jwtFromRequest: '', secretOrKey: '' }
//opts.jwtFromRequest = ExtractJwt.fromHeader('authorization');
opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('Token');
opts.secretOrKey = process.env.jwtSecret
// https://stackoverflow.com/questions/54951260/spread-syntax-returns-unexpected-object

const saltRounds = 10;

export const userdetails = (req, res, next) => {
    const { user } = req;
    const usersDetail: IStaffUser = {
        ...user,
        password: '',
    }
    res.json({
        success: true,
        message: 'successfull',
        user: usersDetail
    })
}

export const getAllUser = async (req, res, next) => {
    try {
        const users = await StaffModel.find({}).populate({ path: 'linkPeople'})
        res.json({
            code: 200,
            data: users.map(user => { user.password = ''; return user.toObject() })
        })
    } catch (err) {
        res.json({
            code: 404,
            error: err.toString()
        })
    }
}

export const editAUser = async (req, res, next) => {
    try {
        const { user } = req.body
        const model = await StaffModel.findOne({ _id: new ObjectId(user._id) })
        if (user.password !== '') {
            user.password = await new Promise(resolve => {
                bcrypt.hash(user.password, saltRounds).then(async (hash) => {
                    resolve(hash)
                })
            })
        } else {
            delete user.password
        }

        model.overwrite({
            ...(model.toObject()),
            ...user,
        })

        await model.save();
        res.send({
            code: 200,
            data: model.toObject()
        })
    } catch (e) {
        res.send({
            code: 404,
            error: e.toString()
        })
    }
}

export const addAUser = async (req, res, next) => {
    try {
        const { user } = req.body
        const model = new StaffModel({
            ...{
                ...user,
                username: user.username.trim().toLowerCase(),
                emailid: user.emailid.trim().toLowerCase()
            },
            createdBy : req.user._id 
        })
        
        model.password = await new Promise(resolve => {
            bcrypt.hash(user.password, saltRounds).then(async (hash) => {
                resolve(hash)
            })
        })

        await model.save()
        res.send({
            code: 200,
            data: model.toObject()
        })
    }
    catch (e) {
        res.send({
            code: 404,
            error: e.toString()
        })
    }
}

export const userChangePassword = async (req, res, next) => {
    const { currentPassword, newPassword } = req.body
    const { user } = req
    const response = await new Promise((resolve) => {
        bcrypt.compare(currentPassword, user.password).then(function (res) {
            if (res) {
                bcrypt.hash(newPassword, saltRounds).then(async (hash) => {
                    const model = await StaffModel.findOne({ _id: new ObjectId(user._id) })
                    model.overwrite({
                        ...(model.toObject()),
                        password: hash
                    })
                    await model.save();
                    resolve({
                        code: 200
                    })
                }).catch((err) => {
                    resolve({
                        code: 404,
                        error: err.toString()
                    })
                })
            }
            else {
                resolve({
                    code: 404,
                    error: 'Wrong Current Password'
                })
            }
        })
    })
    res.json(response)
}