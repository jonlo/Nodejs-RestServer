const express = require('express');
const User = require('../models/user');
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express()

app.post('/login', function (req, res) {
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
                token
            });
        }

    });


})


module.exports = app;