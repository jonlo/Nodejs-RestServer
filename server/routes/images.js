const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

let { verifyImgToken } = require('../middlewares/authentication');

app.get('/image/:type/:img', (req, res) => {
    let type = req.params.type;
    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let pathNoImg = path.resolve(__dirname, `../assets/no-image.jpg`);
        res.sendFile(pathNoImg);
    }

});


module.exports = app; 