const jwtSecret = 'your_jwt_secret'; //same key use in JWTStrategy 

// const { Router } = require('express');
const jwt = require('jsonwebtoken'),
    passport = require('passport');


    require('./passport'); //passport file

    let generateJWTToken = (user) => {
        return jwt.sign(user, jwtSecret, {
            subject: user.Username, // encode username in jwt
            expiresIn: '7d',
            algorithm: 'HS256' // Algorithm used to sign or encode the values of the JWT
        });
    }

    //Post Login
    module.exports = (router) => {
        router.post('/login', (req, res) => {
            passport.authenticate('local', {session: false }, (error, user, info) => {
                if (error || !user) {
                    return res.status(400).json({
                        message: 'something is not right',
                        user:user
                    });
                }
                req.login(user, { session: false }, (error) => {
                    if (error) {
                        res.send(error);
                    }
                    let token = generateJWTToken(user.toJSON());
                    return res.json({user, token});
                });
            })(req,res);
        });
    }