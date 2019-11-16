
const express = require('express');
const { verifyToken } = require('../middlewares/authentication');

let app = express();
let Product = require('../models/product');

let productPath = Product.schema.paths;

app.get('/product', verifyToken, (req, res) => {
    let from = Number(req.query.from ? req.query.from : 0);
    let limit = Number(req.query.limit ? req.query.limit : 10);
    Product.find({ available: true })
        .skip(from)
        .limit(limit)
        .populate(productPath.user.path, 'name email')
        .populate(productPath.category.path, 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            Product.count({ available: true }, (err, number) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: err
                    });
                }
                res.json({
                    ok: true,
                    products: products,
                    total: number
                })
            })
        });
});

app.get('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            res.json({
                ok: true,
                product: productDB
            });
        });
});

app.get('/product/find/:findStr', verifyToken, (req, res) => {
    let findStr = req.params.findStr;

    let regex = new RegExp(findStr, 'i')

    Product.find({ name: regex })
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            res.json({
                ok: true,
                products: products
            })

        });

});

app.post('/product', verifyToken, (req, res) => {
    let body = req.body;
    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        available: body.available,
        category: body.category,
        user: req.user
    })
    product.save((err, product) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            product: product
        });
    });
});

app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true, context: 'query' }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            product: productDB
        });
    });
});

app.delete('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let availableDelete = { available: false };
    Product.findByIdAndUpdate(id, availableDelete, { new: true, context: 'query' }, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            product: productDB
        });
    });
});

module.exports = app;