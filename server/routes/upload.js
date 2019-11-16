const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const Product = require('../models/product');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', function (req, res) {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: "No se ha seleccionado ningún archivo"
        });
    }
    let type = req.params.type;
    let id = req.params.id;

    if (!isValidType(type, res)) {
        return;
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let uploadedFile = req.files.uploadedFile;
    let splitName = uploadedFile.name.split('.');
    let extension = splitName[splitName.length - 1];

    if (!isValidExtension(extension, res)) {
        return;
    }

    moveFileToFolder(uploadedFile, id, type, extension, res);

});

isValidType = (type, res) => {
    let validTypes = ["product", "user"];
    if (!validTypes.includes(type)) {
        res.status(400).json({
            ok: false,
            err: `tipo no permitido. las extensiones permitidas son: ${validTypes}`,
            type: type
        });
        return false;
    }
    return true;
}

isValidExtension = (extension, res) => {
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    if (!validExtensions.includes(extension)) {
        res.status(400).json({
            ok: false,
            err: `tipo de archivo no permitido. las extensiones permitidas son: ${validExtensions}`,
            ext: extension
        });
        return false;
    }
    return true;
}

moveFileToFolder = (uploadedFile, id, type, extension, res) => {
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`
    // Use the mv() method to place the file somewhere on your server
    uploadedFile.mv(`uploads/${type}/${fileName}`, function (err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        switch (type) {
            case 'user':
                userImage(id, res, fileName);
                break;
            case 'product':
                productImage(id, res, fileName);
                break;
            default:
                break;
        }

    });
}

userImage = (id, res, fileName) => {
    User.findById(id, (err, userDB) => {
        if (err) {
            removeFile(fileName, "user");
            return res.status(500)({
                ok: false,
                err: err
            })
        }
        if (!userDB) {
            removeFile(fileName, "user");
            return res.status(400)({
                ok: false,
                err: {
                    message: "user not found"
                }
            })
        }

        removeFile(userDB.img, "user");
        userDB.img = fileName;
        userDB.save((err, savedUserDB) => {
            if (err) {
                removeFile(fileName, "user");
                return res.status(500)({
                    ok: false,
                    err: err
                })
            }
            res.json({
                ok: true,
                user: savedUserDB,
                img: fileName
            });
        });
    })
}

productImage = (id, res, fileName) => {
    Product.findById(id, (err, productDB) => {
        if (err) {
            removeFile(fileName, "product");
            return res.status(500)({
                ok: false,
                err: err
            })
        }
        if (!productDB) {
            removeFile(fileName, "product");
            return res.status(400)({
                ok: false,
                err: {
                    message: "product not found"
                }
            })
        }

        removeFile(productDB.img, "product");
        productDB.img = fileName;
        productDB.save((err, savedProductDB) => {
            if (err) {
                removeFile(fileName, "product");
                return res.status(500)({
                    ok: false,
                    err: err
                })
            }
            res.json({
                ok: true,
                product: savedProductDB,
                img: fileName
            });
        });
    })
}

removeFile = (file, type) => {
    let pathUrl = path.resolve(__dirname, `../../uploads/${type}/${file}`);
    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}

module.exports = app;