const bcrypt = require('bcrypt');
const dbConnection = require('../database/db');

var idcheck2;
var idIsUnique;
var userConnected;

app.post('/', ifLoggedin, [
    body('user_email').custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `client` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length == 1){
                userConnected= "client";
                return true;
                
            }
            return dbConnection.execute('SELECT `email` FROM `admin` WHERE `email`=?', [value])
            .then(([rows]) => {
                if(rows.length == 1){
                    userConnected = "admin";
                    return true;
                    
                }
                return Promise.reject('Invalide !');
        
    });
            
        });
    }),
    body('user_pass','Le mot de passe est vide!').trim().not().isEmpty(),
], (req, res) => {
    const validation_result = validationResult(req);
    const {user_pass, user_email} = req.body;
    if(validation_result.isEmpty()){
      var sql = "SELECT * FROM "+userConnected+" WHERE `email`=?";
        dbConnection.execute(sql,[user_email])
        .then(([rows]) => {
            //console.log("email= "+rows[0].email+" mot de passe de la base = "+rows[0].mot_de_passe+" mdp avant bycript = "+user_pass);
        
            bcrypt.compare(user_pass,rows[0].mot_de_passe).then(compare_result2 => {
                if(compare_result2 === true){
                    console.log("yup true");
                    req.session.isLoggedIn = true;
                    req.session.id= rows[0].id;
                   if(userConnected==="admin")
                   { 
                    req.session.adminID =  rows[0].id;
                    res.redirect('/profileAdmin'); 
                   }
                   else {
                    
                    res.redirect('/');
                   }
                }
                else{
                    console.log("compare_result2 = "+compare_result2);
                    console.log('error');
                    res.render('login_enregistrement',{
                        login_errors:['Mot de passe invalide!']
                    });
                }
            })
            .catch(err => {
                if (err) throw err;
            });


        }).catch(err => {
            if (err) throw err;
        });
    } else {
        dbConnection.execute("SELECT * FROM `client` WHERE `email`=?",[user_email])
        .then(([rows]) => {
            //console.log("email= "+rows[0].email+" mot de passe de la base = "+rows[0].mot_de_passe+" mdp avant bycript = "+user_pass);
        
            bcrypt.compare(user_pass,rows[0].mot_de_passe).then(compare_result2 => {
                if(compare_result2 === true){
                    console.log("yup true");
                    req.session.isLoggedIn = true;
                    req.session.id= rows[0].id;
                    res.redirect('/');
                }
                else{
                    console.log("compare_result2 = "+compare_result2);
                    console.log('error');
                    res.render('login_enregistrement',{
                        login_errors:['Mot de passe invalide!']
                    });
                }
            })
            .catch(err => {
                if (err) throw err;
            });


        }).catch(err => {
            if (err) throw err;
        });
    
     
   
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
        res.render('login_enregistrement',{
            login_errors:allErrors
        });
    }
});