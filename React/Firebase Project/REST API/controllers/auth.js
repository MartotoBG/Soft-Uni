const {
    userModel,
    tokenBlacklistModel,
} = require('../models');
const CarModel = require('../models/car');
const MotorbikeModel= require('../models/motorbike');
const utils = require('../utils');
const { authCookieName } = require('../app-config');

const bsonToJson = (data) => { return JSON.parse(JSON.stringify(data)) };
const removePassword = (data) => {
    const { password, __v, ...userData } = data;
    return userData
}

function register(req, res, next) {
    const { email, username, password, repeatPassword } = req.body;
    if (username.length < 6) { return res.status(401).send({ message: 'Username must be at least 6 characters!' }) }
    if (password.length < 6) { return res.status(401).send({ message: 'Password must be at least 6 characters!' }) }
    if (!password) { return res.status(401).send({ message: 'Password is required!' }); }
    if (!repeatPassword) { return res.status(401).send({ message: 'Repeat password is required!' }); }
    if (password != repeatPassword) {
        return res.status(401).send({ message: 'Passwords must be the same!' });
    }
    return userModel.create({ email, username, password })
        .then((createdUser) => {
            createdUser = bsonToJson(createdUser);
            createdUser = removePassword(createdUser);

            const token = utils.jwt.createToken({ id: createdUser._id });
            if (process.env.NODE_ENV === 'production') {
                res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true })
            } else {
                res.cookie(authCookieName, token, { httpOnly: true })
            }
            res.status(200)
                .send(createdUser);
        })
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                let field = err.message.split("index: ")[1];
                field = field.split(" dup key")[0];
                field = field.substring(0, field.lastIndexOf("_"));

                res.status(401)
                    .send({ message: `This ${field} is already registered!` });
                return;
            }
            next(err);
        });
}

function login(req, res, next) {
    const { username, password } = req.body;
    userModel.findOne({ username })
        .then(user => {
            return Promise.all([user, user ? user.matchPassword(password) : false]);
        })
        .then(([user, match]) => {
            if (!match) {
                res.status(401)
                    .send({ message: 'Wrong username or password' });
                return
            }
            user = bsonToJson(user);
            user = removePassword(user);

            const token = utils.jwt.createToken({ id: user._id });

            if (process.env.NODE_ENV === 'production') {
                res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true })
            } else {
                res.cookie(authCookieName, token, { httpOnly: true })
            }
            res.status(200)
                .send(user);
        })
        .catch(next);
}

function logout(req, res) {
    const token = req.cookies[authCookieName];

    tokenBlacklistModel.create({ token })
        .then(() => {
            res.clearCookie(authCookieName)
                .status(204)
                .send({ message: 'Logged out!' });
        })
        .catch(err => res.send(err));
}

async function getProfileInfo(req, res, next) {
    try {

        const id = req.params.id;
        const user = await userModel.findById(id);
        const cars = [];
        const motorbikes = [];
        for (const carId of user.ownCars) {
            const car = await CarModel.findById(carId);
            cars.push(car);
        }
        for (const motorbikeId of user.ownMotorbikes) {
            const motorbike = await MotorbikeModel.findById(motorbikeId);
            motorbikes.push(motorbike);
        }
        user.ownCars = cars;
        user.ownMotorbikes = motorbikes
        res.status(200).send(user);
    }
    catch (error) {
        res.status(404).send(error)
    }
};
// userModel.findOne({ username: username }, { password: 0, __v: 0 }) //finding by Id and returning without password and __v
//     .then(user => { res.status(200).json(user) })
//     .catch(next);


function editProfileInfo(req, res, next) {
    //  const { _id: userId } = req.user;
    const { username, email, imageUrl } = req.body;

    userModel.findOneAndUpdate({ username: username }, { username, email, imageUrl }, { runValidators: true, new: true })
        .then(x => { res.status(200).json(x) })
        .catch(next);
}



module.exports = {
    login,
    register,
    logout,
    getProfileInfo,
    editProfileInfo,
}