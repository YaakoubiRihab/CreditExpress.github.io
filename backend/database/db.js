const mysql = require('mysql2');
const dbConnection = mysql.createPool({
    host     : 'localhost', // MYSQL HOST NAME
    user     : 'root',        // MYSQL USERNAME
    password : '',    // MYSQL PASSWORD
    database : 'creditenligne'      // MYSQL DB NAME
}).promise();



/*
dbConnection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});*/

    
module.exports = dbConnection;
/*
dbConnection.execute("INSERT INTO `client`(`nomCl`,`email`,`mot_de_passe`) VALUES(?,?,?)",
["malek","azerty", "dddd"]);
//fama 7ata chiffrement houni*/