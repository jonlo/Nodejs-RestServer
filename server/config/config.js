
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
process.env.TOKEN_EXPIRES =  60 * 60 * 24 * 30

/// ==========
/// Auth seed
///===========

process.env.SEED = process.env.SEED ? process.env.SEED : "devSeed";