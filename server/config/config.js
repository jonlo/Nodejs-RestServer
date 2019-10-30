
/// ==========
/// Port
///===========
process.env.PORT = process.env.PORT || 3000;

let user = "jonlo";
let pass = "pGhQCMGfLpjgo3Cv";
let dbName = "test";

/// ==========
/// Environment
///===========
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";


let urlDb = process.env.NODE_ENV === "dev" ? `Localhost mongodb://localhost/${dbName}` :`mongodb+srv://${user}:${pass}@mongodbnodejsrestserver-9yeyh.mongodb.net/${dbName}?retryWrites=true&w=majority`;

process.env.urlDB = urlDb;