require('./config/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.json('Working')
})


app.get('/user', function (req, res) {
    res.json('get user')
})

app.post('/user', function (req, res) {
    let body = req.body;
    if(!body.name){
        res.status(400).json({
            ok:false,
            message: "name required"
        });
    }

    res.statusCode = 200;
    res.json(body);
})

app.put('/user/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id: id
    });
})

app.delete('/user', function (req, res) {
    res.json('delete user')
})


app.listen(process.env.PORT, () => {
    console.log(`listening in port ${process.env.PORT}`)
})