const express = require('express');

let { verifyToken } = require('../middlewares/authentication');
let app = express();
let Category = require('../models/category');

app.get('/category', verifyToken, (req, res) => { //show all categories
    Category.find().exec((err, categories) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            categories: categories,
            total: categories.length
        })

    })
})

app.get('/category/:id', verifyToken, (req, res) => { //show one category by id
    let id = req.params.id;
    Category.findById(id, { context: 'query' }, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            categpry: categoryDB
        });
    });
})


app.post('/category', verifyToken, (req, res) => { //create new category
    let body = req.body;
    let category = new Category({
        description: body.description,
        user: req.user
    });
    category.save((err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            category: categoryDB,
        });
    });

})


app.put('/category/:id', verifyToken, (req, res) => { //update category
    let id = req.params.id;

    Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true, context: 'query' }, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });

})

app.delete('/category/:id', verifyToken, (req, res) => { //update category
    let id = req.params.id;

    Category.findByIdAndRemove(id,(err,categoryDB)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });
})

module.exports = app;