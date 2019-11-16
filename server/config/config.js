
/// ==========
/// Port
///===========
process.env.PORT = process.env.PORT || 3000;

let dbName = process.env.dbName ? process.env.dbName : "test";

/// ==========
/// Environment
///===========
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

/// ==========
/// Data base
///===========
let urlDb = process.env.NODE_ENV === "dev" ? `Localhost mongodb://localhost/${dbName}` :`mongodb+srv://${process.env.userName}:${process.env.pass}@mongodbnodejsrestserver-9yeyh.mongodb.net/${dbName}?retryWrites=true&w=majority`;

process.env.urlDB = urlDb;

/// ==========
/// Token
///===========
process.env.TOKEN_EXPIRES =  "48h"

/// ==========
/// Auth seed
///===========

process.env.SEED = process.env.SEED ? process.env.SEED : "devSeed";

/// ==========
/// google client id
///===========

process.env.CLIENT_ID = process.env.CLIENT_ID  ? process.env.CLIENT_ID : "21903024464-7r8m8b4659h2ejcj523aqg1iog04sajc.apps.googleusercontent.com"