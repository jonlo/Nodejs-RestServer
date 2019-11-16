const express = require('express');
const {verifyToken} = require ('../middlewares/authentication'); 

let app = express();
let Product = require ('../models/product');

//Obtener todos los productos

app.get('/product',verifyToken,(req,res)=>{
    let from = Number(req.query.from ? req.query.from : 0);
    let limit = Number(req.query.limit ? req.query.limit : 10);
    Product.find({avaliable: true }) 
        .skip(from)
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            Product.count({ avaliable: true  }, (err, number) => {
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
app.get('/product/:id',verifyToken,(req,res)=>{
    //populate user category
    //paginated
    
});


//create one product
app.post('/product',verifyToken,(req,res)=>{
    //save user category
    
});

//Update one product
app.put('/product/:id',verifyToken,(req,res)=>{
    //update product
    
});

//Delete one product by modifying avaliable
app.delete('/product/:id',verifyToken,(req,res)=>{

    
});