require('./config/config')

const express = require('express')
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(require ('./routes/user'));
// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.json('Working')
})



//Localhost mongodb://localhost/cafe
mongoose.connect(process.env.urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw new err;
    console.log(`Base de datos Online`)
});


app.listen(process.env.PORT, () => {
    console.log(`listening in port ${process.env.PORT}`)
})

