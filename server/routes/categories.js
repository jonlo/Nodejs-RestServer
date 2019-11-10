const express = require('express');

let { verifyToken } = require('../middlewares/authentication');
let app = express();
let Category = require('../models/category');

app.get('/category', verifyToken, (req, res) => { //show all categories

})

app.get('/category/:id', verifyToken, (req, res) => { //show one category by id

})


app.post('/category', verifyToken, (req, res) => { //create new category
    //return category
})


app.put('/category/:id', verifyToken, (req, res) => { //update category
    //return category
})

app.delete('/category/:id', verifyToken, (req, res) => { //update category
    //deleted by admin only
})

module.exports = app;