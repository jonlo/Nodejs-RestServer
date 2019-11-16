const express = require('express');
const User = require('../models/user');
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express()

app.post('/login', (req, res) => {
    let body = req.body;
    console.log(`email: ${body.email}`);
    User.findOne({
        email: body.email
    }, (err, userDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            });
        } else {
            if (!bcryp.compareSync(body.password, userDB.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Usuario o contraseña incorrectos"
                    }
                });
            }

            let token = jwt.sign({
                user: userDB,
            }, process.env.SEED, {
                expiresIn: process.env.TOKEN_EXPIRES
            });

            return res.json({
                ok: true,
                user: userDB,
                token: token
            });
        }

    });


})

//google config

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(e => {
        res.status(403).json({
            ok: false,
            err: e
        })
    })

    User.findOne({
        email: googleUser.email
    }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (userDB) {
            if (!userDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "User signed in without google"
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB,
                }, process.env.SEED, {
                    expiresIn: process.env.TOKEN_EXPIRES
                });
                console.log("sign user in system");
                return res.status(200).json({
                    ok: true,
                    user: userDB,
                    token: token
                });
            }
        } else {
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ":)";
            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                } else {
                    let token = jwt.sign({
                        user: userDB,
                    }, process.env.SEED, {
                        expiresIn: process.env.TOKEN_EXPIRES
                    });
                    console.log("sign user in system");
                    return res.status(200).json({
                        ok: true,
                        user: userDB,
                        token: token
                    });
                }
            });
        }
    })
});


module.exports = app;