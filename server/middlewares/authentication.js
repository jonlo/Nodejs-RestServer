const jwt = require('jsonwebtoken')

// ====================
//Verificar token
//=====================

let veryfyToken = (req, res, next) => {
    let token = req.get('token'); // recuperar datos del header
    jwt.verify(token,process.env.SEED,(err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err: err
            });
        }
        req.user = decoded.user;
        next();
    });
   

};

module.exports = {
    veryfyToken
}