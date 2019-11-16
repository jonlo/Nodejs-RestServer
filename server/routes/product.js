
const express = require('express');
const { verifyToken } = require('../middlewares/authentication');

let app = express();
let Product = require('../models/product');

//Obtener todos los productos

app.get('/product', verifyToken, (req, res) => {
    let from = Number(req.query.from ? req.query.from : 0);
    let limit = Number(req.query.limit ? req.query.limit : 10);
    Product.find({ available: true })
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .populate('category', 'description')
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

//get one product by id
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


//create one product
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

//Update one product
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

//Delete one product by modifying avaliable
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