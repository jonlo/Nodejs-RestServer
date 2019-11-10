const express = require('express');
const User = require('../models/user');
const bcryp = require('bcrypt');
const _ = require('underscore');
const app = express()

const {verifyToken} = require ('../middlewares/authentication');
const {verifyAdminRole} = require ('../middlewares/authentication');

app.get('/user',verifyToken, (req, res) => {
    let from = Number(req.query.from ? req.query.from : 0);
    let limit = Number(req.query.limit ? req.query.limit : 10);

    User.find({ state: true }, 'role name email img state google') //this string is optional
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            User.count({ state: true }, (err, number) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: err
                    });
                }
                res.json({
                    ok: true,
                    users: users,
                    total: number
                })
            })

        });

})

app.post('/user',[verifyToken,verifyAdminRole], function (req, res) {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcryp.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });

})

app.put('/user/:id',[verifyToken,verifyAdminRole], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });

});

app.delete('/user/:id',[verifyToken,verifyAdminRole], function (req, res) {
    
    let id = req.params.id;
    let stateDelete = { state: false };

    User.findByIdAndUpdate(id, stateDelete, { new: true, context: 'query' }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});

module.exports = app;