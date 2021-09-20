const express = require('express');
//const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const swig = require('swig');
const dateFormat = require('dateformat');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const dbConnection = require('./database/db');
const app = express();
const exphbs = require('express-handlebars');
//const mailer = require('express-mailer');
const nodemailer = require('nodemailer');
//var server = require('http').createServer(app);
//var io = require('socket.io').listen(server);
const { body, validationResult } = require('express-validator');
const { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } = require('constants');
const { getMaxListeners } = require('./database/db');
/*const config = require('./public/js/config');
const jquery = require('./public/js/jquery-3.5.1.min');
const validate = require('./public/js/jqueryValidate');
const simmu = require('./public/js/p-simmu');
const signin = require('./public/js/signInValidation');
const simulation = require('./public/js/simmu');
*/





const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
//const ejsLint = require('ejs-lint');
/*var sendmail = require('sendmail')(/*{
    logger: {
      debug: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    },
    silent: false,
    dkim: { // Default: False
      //privateKey: fs.readFileSync('./dkim-private.pem', 'utf8'),
      keySelector: 'mydomainkey'
    },
    devPort: 3000, // Default: False
    devHost: 'localhost', // Default: localhost
    smtpPort: 2525, // Default: 25
    smtpHost: 'localhost' // Default: -1 - extra smtp host after resolveMX
  }*/
  


var idcheck2;
var idIsUnique;
var userConnected;
var now = new Date();


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'publicAdmin')));
app.use(express.static(path.join(__dirname, 'views')));

app.engine('html', swig.renderFile);
//app.engine('handlebars', exphbs());
//app.use('/makeup',express.static);
//app.set('view engine', 'handlebars');

// SET OUR VIEWS AND VIEW ENGINE
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');



// pour bootstrap et css
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
//app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));



// APPLY COOKIE SESSION MIDDLEWARE
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge:  3600 * 1000 // 1hr
}));
/*res.render('accueil', {
    title: 'title', 
    content: 'index2', 
    data:rows
});*/

/*io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
});


var http = require('http');
var fs = require('fs');
*/
const userIsAdmin = (req, res, next) => {
    if(req.session.adminID)
    {
        console.log("admin");
         return  res.redirect('/profileAdmin');
    }
    next();
}
const userIsNotAdmin = (req, res, next) => {
    if(!req.session.adminID)
    {
        
         return res.render('login_enregistrement');
    }
    next();
}

// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.render('login_enregistrement');
    }
    next();
}

const ifLoggedin = (req,res,next) => {
    if(req.session.isLoggedIn){
        return res.redirect('/profile');
    }
    next();
}
// END OF CUSTOM MIDDLEWARE

app.get('/simulation',(req,res,next) =>{
    res.render('simulation')
})
app.get('/config',  ifNotLoggedin, (req,res,next) => {
   
    dbConnection.execute("SELECT `nomCl`,`prenomCl`,`CIN`,`email`,`ville` FROM `client` WHERE `id`=?",[req.session.id])
    .then(([rows]) => {
        res.render('configuration',{
            nom:rows[0].nomCl,
            prenom:rows[0].prenomCl,
            cin:rows[0].CIN,
            email:rows[0].email,
            ville:rows[0].ville
        });
    });  });
    app.get('/config/donneesDemande', ifNotLoggedin, (req,res,next) => {
        dbConnection.execute("SELECT * FROM `demande` WHERE `id`=?",[req.session.id])
        .then(([rows]) => {
            dbConnection.execute("SELECT COUNT(*) AS total FROM `demande` WHERE `id`=?",[req.session.id])
            .then(([rows2]) => {
                dbConnection.execute("SELECT  * FROM `demande` WHERE `id`=?",[req.session.id])
            .then(result => {
            res.render('donneesDemande',{
                demandes:result,
                total:rows2[0].total,
                items:rows
    
            });
        });
    });})
    .catch(err => {
        if (err) throw err;
    });});

app.get('/assistance',(req,res,next) => {
    res.render('assistance');
    
})  
app.get('/assistanceClient',(req,res,next) => {
    res.render('assistanceClient');
    
})  

app.get('/config/mdp',(req,res,next) => {
    res.render('changerMotDePasse');
    
})
app.post('/config/mdp',[
    
    body('user_passe','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
    body('user_passe1','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
    body('user_passe2','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),

],(req,res,next) => {
    const validation_result = validationResult(req);
    const {user_passe,user_passe1,user_passe2} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcrypt)

        
        bcrypt.hash(user_passe2,12).then((hash_pass2) => { 
           
           
      
        dbConnection.execute("SELECT `mot_de_passe` FROM `client` WHERE `id`=?",[req.session.id]).then(old_mdp => {
        console.log("old_mdp = "+old_mdp[0][0].mot_de_passe); 
        bcrypt.compare(user_passe,old_mdp[0][0].mot_de_passe).then(compare_result => {
            if(compare_result === true){

      
         console.log("EGAL1");
         
             if(user_passe1 == user_passe2){
                 console.log("EGAL");
                 dbConnection.execute("UPDATE `client` SET `mot_de_passe` = ? WHERE id = ?",[hash_pass2,req.session.id])
                 .then(result => {
                     res.send(`votre mot de passé changé avec succée <a href="/profile">Votre profile</a>`);
                 }).catch(err => {
                     if (err) throw err;
                 });
              }
 
         }});
 
       });
      
       
        
            //console.log("mdp = "+hash_pass);

       });}})

app.get('/changeMDP', ifNotLoggedin,(req,res,next) => {
    res.render('/changeMDP');
})
app.post('/changeMDP',[
    
    body('user_passe','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
    body('user_passe1','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
    body('user_passe2','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),

],(req,res,next) => {
    const validation_result = validationResult(req);
    const {user_passe,user_passe1,user_passe2} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcrypt)

        
        bcrypt.hash(user_passe2,12).then((hash_pass2) => { 
           
           
      
        dbConnection.execute("SELECT `mot_de_passe` FROM `client` WHERE `id`=?",[req.session.id]).then(old_mdp => {
        console.log("old_mdp = "+old_mdp[0][0].mot_de_passe); 
        bcrypt.compare(user_passe,old_mdp[0][0].mot_de_passe).then(compare_result => {
            if(compare_result === true){

      
         console.log("EGAL1");
         
             if(user_passe1 == user_passe2){
                 console.log("EGAL");
                 dbConnection.execute("UPDATE `client` SET `mot_de_passe` = ? WHERE id = ?",[hash_pass2,req.session.id])
                 .then(result => {
                     res.send(`votre mot de passé changé avec succée <a href="/profile">Votre profile</a>`);
                 }).catch(err => {
                     if (err) throw err;
                 });
              }
 
         }});
 
       });
      
       
        
            //console.log("mdp = "+hash_pass);

       });}})

        
// END OF REGISTER PAGE

app.get('/admin/DCR', function(req,res){ 
    dbConnection.query("SELECT * FROM demande WHERE `etat_dossier`='Transférer'"  , function(err,result){
        res.render('dcr',{
            items : result
        });
    
    });

});


app.post('/simulation',(req,res,next) =>{
    
var age = document.getElementById("age");
var salaire = document.getElementById("salaire");
var sliderCapital = document.getElementById("sliderCapital");
var ageCheck = 0;
var salaireCheck = 0;
var submitBtn = document.getElementById("submit-btn");


const INTERET = 0.12;

document.getElementById("4").onclick = function () {
  window.location.href = 'simulation.htm';
}

document.getElementById("age").onblur = function () {
  if ((age.value > 66) || (age.value < 18)) {
    document.getElementById("error-elig").innerHTML = "Vous n'etes pas éligible, crédit express est disponible que pour les aduletes entre 18 et 66 ans.";
  } else if ((age.value < 66) || (age.value > 17)) {
    document.getElementById("error-elig").innerHTML = "";
    ageCheck = 1;
  }
}

salaire.onblur = function () {
  window.tauxEndettement = salaire.value * 0.4;
  console.log(tauxEndettement);
  salaireCheck = 1;
}



sliderCapital.onchange = function () {

  if ((ageCheck == 1) && (salaireCheck == 1)) {


    var capital = document.getElementById("sliderCapital").value;
    var coutCredit = capital * INTERET;
    var coutTotal = +capital + +coutCredit;

    var mens1 = Math.round(coutTotal / 12);
    var mens2 = Math.round(coutTotal / 24);
    var mens3 = Math.round(coutTotal / 36);


    var mensualite1 = document.getElementById("option1");
    var mensualite2 = document.getElementById("option2");
    var mensualite3 = document.getElementById("option3");

    if (tauxEndettement >= mens1) {
      console.log("yes");
      mensualite1.innerHTML = mens1 + "dt";
      mensualite1.parentElement.style.display = "block";
    } else if (tauxEndettement < mens1) {
      console.log("no");
      mensualite1.parentElement.style.display = "none";
    }

    if (tauxEndettement >= mens2) {
      console.log("yes");
      mensualite2.innerHTML = mens2 + "dt";
      mensualite2.parentElement.style.display = "block";
    } else if (tauxEndettement < mens2) {
      console.log("no");
      mensualite2.parentElement.style.display = "none";
    }

    if (tauxEndettement >= mens3) {
      console.log("yes");
      mensualite3.innerHTML = mens3 + "dt";
      mensualite3.parentElement.style.display = "block";
    } else if (tauxEndettement < mens3) {
      console.log("no");
      mensualite3.parentElement.style.display = "none";
    }


    var resCapital = document.getElementById("sim-res-cap");
    var resMens = document.getElementById("sim-res-men");
    var resDuree = document.getElementById("sim-res-durr");
    var resTaux = document.getElementById("sim-res-taux");
    var resCout = document.getElementById("sim-res-cout");

    var radioBtn = document.getElementsByClassName("sim-radio");
    var simuResult = document.getElementById("simu-result");

    for (var i = 0; i < radioBtn.length; i++)
      radioBtn[i].onclick = function () {
        simuResult.style.display = "flex";
        resCapital.innerHTML = "Montant: " + capital + " Dt";
        resMens.innerHTML =
          "Mensualité: " +
          this.nextElementSibling.firstChild.nextElementSibling.innerHTML;
        resDuree.innerHTML =
          "Durée: " +
          this.nextElementSibling.firstChild.nextElementSibling.nextElementSibling
            .innerHTML;
        resTaux.innerHTML = "Taux d'intérêt: " + INTERET * 100 + "%";
        resCout.innerHTML = "Cout de crédit: " + coutCredit + " Dt";
        submitBtn.removeAttribute("disabled");
        document.getElementById("mensualite").value = this.nextElementSibling.firstChild.nextElementSibling.innerHTML;
        document.getElementById("durre").value = this.nextElementSibling.firstChild.nextElementSibling.nextElementSibling.innerHTML;
      };

  } else {
    document.getElementById("error-elig").innerHTML = "SVP ajouter d'abord votre age et salaire";
  }

};



    res.render('simulation');
});

app.get('/contact/client',(req,res,next) =>{
    res.render('contactClient')
})
app.get('/login',(req,res,next) =>{
    res.render('login')
})

app.get('/contact',(req,res,next) =>{
    res.render('contact')
})
app.get('/',(req,res,next) =>{
    if(req.session.isLoggedIn){
        res.redirect('/profile');
    }
    else {
        res.render('accueil');
    }

})
/*
app.get('/profileAdmin', userIsNotAdmin, (req,res,next) => {
  //  sql = "SELECT COUNT(*) FROM `demande` WHERE `etat_dossier` = ? ";
   // dbConnection.execute("SELECT `nomAdmin` FROM `admin` WHERE `id`=?",[req.session.adminID])

  dbConnection.query("SELECT * FROM demande WHERE `etat_dossier`='En attente' "  , function(err,result){
        res.render('profileAdmin',{
            items : result
        });
    
    });
 
       
    });
  .then(([rows]) =>{
        if (rows[0]["etat_dossier"] == "En attente"){
        dbConnection.execute(sql, function(err,result){
            res.render('profileAdmin');
        
    });
}*/
  
// ROOT PAGE
/*
async function validateForm() {
    var name =  document.getElementById('name').value;
    if (name == "") {
        document.querySelector('.status').innerHTML = "Name cannot be empty";
        return false;
    }
    var email =  document.getElementById('email').value;
    if (email == "") {
        document.querySelector('.status').innerHTML = "Email cannot be empty";
        return false;
    } else {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(email)){
            document.querySelector('.status').innerHTML = "Email format invalid";
            return false;
        }
    }
    var subject =  document.getElementById('subject').value;
    if (subject == "") {
        document.querySelector('.status').innerHTML = "Subject cannot be empty";
 
        return false;
    }
    var message =  document.getElementById('message').value;
    if (message == "") {
        document.querySelector('.status').innerHTML = "Message cannot be empty";
        return false;
    }
 S   document.querySelector('.status').innerHTML = "Sending...";
  }
*/

app.get('/login', ifNotLoggedin,userIsAdmin , (req,res,next) => {
   
    dbConnection.execute("SELECT `nomCl` FROM `client` WHERE `id`=?",[req.session.id])
    .then(([rows]) => {
        res.render('profile',{
            nom:rows[0].nomCl,
            prenom:rows[0].prenomCl,
            cin:rows[0].CIN,
            tel_mobile:rows[0].tel_mobile,
            tel_domicile:rows[0].tel_domicile
        });
    });

});// END OF ROOT PAGE
const baseid = () => 
     new Promise((resolve) =>{ 
//console.log("****************************** + idcheck2 = "+idcheck2);
        dbConnection.execute('SELECT `id` FROM `client` WHERE `id`=?', [idcheck2]).then(([rows]) => {
        console.log("rows = "+rows.length);
        if(rows.length === 0){
            console.log("true");
            idIsUnique= true;
            resolve();
        } else{idIsUnique= false;
           resolve();
        }
         
    });});

async function idCheck() {
 
    //console.log("function called");
   
                 idIsUnique  = false;
           
                 idcheck2= Math.floor(Math.random()*((999999999999-100000000000)+1)+100000000000).toString(); 
                // console.log('idcheck2 = '+idcheck2);
             
                while(!idIsUnique)
                {
                   
                   // console.log(" idIsUnique= = "+ idIsUnique); 
                       await   baseid();       
                    
                  
            }
           
                //console.log('idcheck2 = '+idcheck2);

         
}
 app.get('/enregistrement',(req,res,next) => {
     res.render('inscription');
 })
 app.post('/enregistrement',
// post data validation(using express-validator)
[
    body('user_email','Adresse e-mail invalide!').isEmail().custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `client` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length > 0){
                return Promise.reject('Cet e-mail déjà utilisé!');
            }
            return true;
        });
    }),
    body('user_name','Le nom est vide!').trim().not().isEmpty(),
    body('user_prenom','Le prenom est vide!').trim().not().isEmpty(),
    body('user_email','Le email est vide!').trim().not().isEmpty(),
    body('user_daten','Le date de naissance est vide!').trim().not().isEmpty(),
    body('user_lieu','Le lieu de naissance est vide!').trim().not().isEmpty(),
    body('user_adresse','L\'adresse est vide!').trim().not().isEmpty(),
    body('user_ville','Le ville est vide!').trim().not().isEmpty(),
    body('user_code','Le code est vide!').trim().not().isEmpty(),
    body('user_cin','Le numéro de CIN est vide!').trim().not().isEmpty(),
    body('user_mobile','Le numéro mobile est vide!').trim().not().isEmpty(),
    body('user_domicile','Le numéro domicile est vide!').trim().not().isEmpty(),
    body('user_salaire','Le salaire est vide!').trim().not().isEmpty(),
    body('user_passe','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
    body('user_num','Le numéro de compte se compose de 20 chiffres').trim().not().isEmpty().isLength({ min: 20, max: 20 })

   // body('user_etat','L\'etat familial est vide!').trim().not().isEmpty(),
],// end of post data validation
(req,res,next) => {

    const validation_result = validationResult(req);
    const {user_name, user_prenom,user_email, user_daten, user_lieu, user_adresse, user_ville, user_code, user_cin, user_mobile, user_domicile, user_salaire,  user_passe, user_num} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcrypt)

        bcrypt.hash(user_passe,12).then((hash_pass) => {
        idCheck();
        
            console.log("mdp = "+hash_pass);
            dbConnection.execute("INSERT INTO `client`(`id`,`nomCl`,`prenomCl`,`email`,`dateNess`,`lieuNess`,`adresse`,`ville`,`code_pst`,`CIN`,`tel_mobile`,`tel_domicile`,`salaire`,`mot_de_passe`,`numCompte`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[idcheck2,user_name, user_prenom,user_email,user_daten,user_lieu,user_adresse,user_ville,user_code,user_cin,user_mobile, user_domicile, user_salaire,  user_passe, user_num])
            .then(result => {
                res.send(`votre compte a été créé avec succès, vous pouvez maintenant <a href="/">s'identifier</a>`);
            }).catch(err => {
                if (err) throw err;
            });
        })
        .catch(err => {
            // THROW HASING ERROR'S
            if (err) throw err;
        })
    }
    else{
        // COLLECT ALL THE VALIDATION ERRORS
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH VALIDATION ERRORS
        res.render('inscription',{
            register_error:allErrors,
            old_data:req.body
        });
    }
});// END OF REGISTER PAGE
 
app.get('/admin/DCR', function(req,res){ 
    dbConnection.query("SELECT * FROM demande WHERE `etat_dossier`='Traiter'"  , function(err,result){
        res.render('dcr',{
            items : result
        });
    
    });

});
app.get('/profileAdmin', function(req,res){ 
    dbConnection.query("SELECT * FROM demande WHERE `etat_dossier`='En attente'"  , function(err,result){
        res.render('profileAdmin',{
            items : result
        });
    
    });

});
app.get('/admin/backOffice', function(req,res){ 
    dbConnection.query("SELECT * FROM demande WHERE `etat_signature`='Confirmé' AND `etat_dossier`='Accepté'"  , function(err,result){
        res.render('backOffice',{
            items : result
        });
    
    });
 
});
// LOGIN PAGE
app.post('/login', [
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
                    console.log("user exist");
                    req.session.isLoggedIn = true;
                    req.session.id= rows[0].id;
                   // req.session.PostAdmin= rows[0].PostAdmin;
                   if(userConnected==="admin")
                   { 
                    console.log(" admin is true");
                    console.log("poste = "+rows[0]["PostAdmin"]);
                    req.session.adminID =  rows[0].id;      
                    if (rows[0]["PostAdmin"] == "super admin"){
                        res.redirect('/admin/config');
                    }   
                     if (rows[0]["PostAdmin"] === "Commercial"){
                       
                        res.redirect('/profileAdmin');
                    } 
                    if (rows[0]["PostAdmin"] == "DCR"){
                        res.redirect('/admin/DCR');
                    } 
                    if (rows[0]["PostAdmin"] == "Back office"){
                        res.redirect('/admin/backOffice');
                    } 
                  
                   }
                  
                    else if (userConnected==="client")
                   {
 console.log("client");
                        res.redirect('/profile');}
                   
                }
                else{
                    console.log("compare_result2 = "+compare_result2);
                    console.log('error');
                    res.render('login',{
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
                  //  console.log("yup true");
                    req.session.isLoggedIn = true;
                    req.session.id= rows[0].id;
                    res.render('/login');
                }
                else{
                    console.log("compare_result2 = "+compare_result2);
                    console.log('error');
                    res.render('login',{
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
        res.render('login',{
            login_errors:allErrors
        });
    }
});

// END OF LOGIN PAGE

// super admin
 
//affichage

app.get('/admin/config', function(req,res,next){

    dbConnection.query("SELECT * FROM admin" , function(err,result){
    res.render('superAdmin',{
        items : result
    });

});
});

app.get('/admin/ajouter/', function(req,res,next){ 
    res.render('ajoutAdmin');
});

app.get('/admin/modifier', function(req,res,next){
    console.log("id = "+ req.query.id);
    /* l 8alta f superAdmin :
    enti kont ketba : <a href="/admin/modifier<%= item.id %>"
    w heya : <a href="/admin/modifier?id=<%= item.id %>" */
  dbConnection.query("SELECT * FROM `admin` WHERE `id` = ?" ,[req.query.id])
  // res.redirect('/admin/config');
  .then(result => {
      console.log("id = "+ req.query.id);
      
    res.render('modifierAdmin',{
        item : result[0]
    });
});/*,req.params.id, function (err,result){
        res.render('modifierAdmin',{
            item : result[0]
        });*/
    //});
});
app.post('/admin/modifier', function(req,res,next){
    var param = [
        req.body,
        req.query.id
    ]
    dbConnection.query("UPDATE admin SET ? WHERE id = ?", param, function (err, result){
        res.redirect('/admin/config');
    })
});
app.get('/admin/supprimer', function(req,res,next){ 
    dbConnection.query("DELETE FROM `admin` WHERE `id` =? ",[ req.query.id])
       // res.redirect('/admin/config');
       .then(result => {
        res.send(`le compte a été supprimé avec succès, vous pouvez maintenant <a href="/admin/config">Accueil</a>`);
    });


});

// ajouter admin

app.post('/admin/ajouter/',[
 
   body('nomAdmin','Le nom est vide!').trim().not().isEmpty(),
    body('prenomAdmin','Le prenom est vide!').trim().not().isEmpty(),
    body('cinAdmin','Le date de naissance est vide!').trim().not().isEmpty(),
    body('PostAdmin','Le lieu de naissance est vide!').trim().not().isEmpty(),
    body('date_embrauche','L\'adresse est vide!').trim().not().isEmpty(),
    body('ville','Le ville est vide!').trim().not().isEmpty(),
    body('tel_mobileAd','Le numéro mobile est vide!').trim().not().isEmpty().isLength({ min: 8 , max: 13}),
    body('email','L\'email est vide!').trim().not().isEmpty(),
    body('mot_de_passe','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
// end of post data validation
],
(req,res,next) => {

    const validation_result = validationResult(req);
    const {nomAdmin,prenomAdmin, cinAdmin, PostAdmin, date_embrauche, ville,tel_mobileAd, email, mot_de_passe} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcrypt)

        bcrypt.hash(mot_de_passe,12).then((hash_pass) => {
            // INSERTING USER INTO DATABASE
            //console.log("mdp hash = "+hash_pass);
        idCheck();
        
       // console.log("idcheck2 before bd = "+idcheck2);
            
            console.log("mdp = "+hash_pass);
            dbConnection.execute("INSERT INTO `admin`(`nomAdmin`,`prenomAdmin`,`cinAdmin`,`id`,`PostAdmin`,`date_embrauche`,`ville`,`tel_mobileAd`,`email`,`mot_de_passe`) VALUES(?,?,?,?,?,?,?,?,?,?)",[nomAdmin,prenomAdmin, cinAdmin,idcheck2,PostAdmin,date_embrauche,ville,tel_mobileAd,email,hash_pass])
            const output = 
            ` <h3>La banque UBCI</h3>
             <p>La respensable d'administration global de l'application CréditEnligne</p>
             <p>Vous envoyer un email pour rapport votre email et mot de passe en tantque administrateur dans l'application de crédit express en ligne.</p>
             <p><b>Le nom :</b> ${req.body.nomAdmin} </p> 
             <p><b>Le Prénom :</b> ${req.body.prenomAdmin} </p> 
             <p><b>Le numéro de CIN :</b> ${req.body.cinAdmin} </p> 
             <p><b>Réspensable en tantque :</b> ${req.body.PostAdmin} </p> 
             <p><b>Le Adresse email :</b> ${req.body.email} </p> 
             <p><b>Le mot de passe :</b> ${req.body.mot_de_passe} </p> 
             <p><b>Le numéro de télèphone :</b> ${req.body.tel_mobileAd} </p> 
             `;
             let transporter = nodemailer.createTransport({
           // mailer.extend(app,{
                
                from: req.body.email,
                host: 'smtp.gmail.com',
                secureConnection: false,
                port: 465,
                transportMethod:'SMTP',
                auth: {
                    user: 'rihab.yaakoubi13@gmail.com',
                    pass: 'bigdatabigdata'
                  }
            });
            let mailOption = {
                to: '${req.body.email}',
                subject: 'test :',
               // otherProperty: 'Other Property',
                html: output

            };
            transporter.sendMail(mailOption, function(err, data){
                if(err){
                console.log('On a une erreur ! '+err);
            }else{
                res.send(`le compte a été créé avec succès et l'email a été envoyer, vous pouvez maintenant <a href="/admin/config">Accueil</a>`);
            }

            })
           /* .catch(err => {
                // THROW INSERTING USER ERROR'S
                if (err) throw err;
            });*/
        })
        .catch(err => {
            // THROW HASING ERROR'S
            if (err) throw err;
        });
    };


});

// modifier admin




// passer une demande
app.get('/demandepartie1/', function(req,res){ 
    res.render('demandepartie1');
});

app.get('/validation/', function(req,res){ 
    res.render('validation');
});
app.get('/affiche/', function(req,res){ 
    res.render('affiche');

});
app.get('/profile',  ifNotLoggedin, (req,res,next) => {
   // const count = dbConnection.execute("SELECT COUNT(*) FROM demande WHERE `id =?",[req.session.id]);

    dbConnection.execute("SELECT `nomCl`,`prenomCl`, `ville`, `CIN`,`email` FROM `client` WHERE `id`=?",[req.session.id])
    .then(([rows]) => {
        
        dbConnection.execute("SELECT COUNT(*) AS total FROM `demande` WHERE `id`=?",[req.session.id])
        .then(([rows2]) => {
            dbConnection.execute("SELECT  * FROM `demande` WHERE `id`=?",[req.session.id])
            .then(result => {
           // console.log("number = "+result[0][0].total+"capital = "+result[0][0].capital);
      // console.log(" demandes = "+rows2[1].etat_dossier);
        res.render('profile',{
           demandes:result,
            total:rows2[0].total,
            nom:rows[0].nomCl,
            prenom:rows[0].prenomCl,
            ville:rows[0].ville,
            cin:rows[0].CIN,
            email:rows[0].email
           
           
        });       
        });
    });
        
    }).catch(err => {
        if (err) throw err;
    });
   
});
 



/*app.post('/demandepartie1/upload', function(req, res) {
    console.log("file = "+req.files.id_national); // the uploaded file object
  });
*/
app.post('/demandepartie1/',[

    body('user_rang','Le rang se compose de 20 chiffres').trim().not().isEmpty().isLength(20),
    body('demande_capital','Le capital est vide!').trim().not().isEmpty(),
    body('durée_crédit','La durée de crédit est vide!').trim().not().isEmpty(),
    body('mensualité','La mensualité est vide!').trim().not().isEmpty(),
    body('révenue','La révenue est vide!').trim().not().isEmpty(),
    body('id_national','Le carte d\'identité national est vide!').trim().not().isEmpty(),
    body('fact_steg_sonede','La facture d\'eau (SONEDE) ou de l\'électricité (STEG) est vide!').trim().not().isEmpty(),
    body('contrat_travail','Le contrat de travail est vide!').trim().not().isEmpty(),
    body('revenu_sal','Le revenu salarial est vide!').trim().not().isEmpty()


],
(req,res,next) => {
    
   var idClient = req.session.id;
   console.log("id client = "+idClient);
    const validation_result = validationResult(req);
    const {user_rang, demande_capital, durée_crédit, mensualité, révenue,id_national, fact_steg_sonede, contrat_travail, revenu_sal} = req.body;
  //  console.log("file =" +req.files.id_national);
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){

        idCheck(); 
   
            dbConnection.execute("INSERT INTO `demande`(`idCrédit`,`id`,`rangCr`,`capital`,`duréeCr`,`monsualité`,`Autres_rév`,`id_national`,`facture`,`contrat_travail`,`revenu_sal`,`etat_dossier`,`etat_signature`,`etat_crédit`) VALUES(?,?,?,?,?,?,?,?,?,?,?,'En attente','Pas confirmé','Bloqué')",[idcheck2,idClient,user_rang,demande_capital,durée_crédit,mensualité,révenue,id_national,fact_steg_sonede,contrat_travail,revenu_sal])
            .then(result => {
                res.render('affiche')})
            .catch(err => {
                
                if (err) throw err;
            });
        

        }
    else{
        res.render('affiche');
    }

   /* socket.on('envoyer_demande',data => {
        console.log(data);
    });
    */
  
});
/*app.post('/demandepartie2/',[
    
    body('fact_steg_sonede','La facture d\'eau (SONEDE) ou de l\'électricité (STEG) est vide!').trim().not().isEmpty(),
    body('contrat_travail','Le contrat de travail est vide!').trim().not().isEmpty(),
    body('revenu_sal','Le revenu salarial est vide!').trim().not().isEmpty(),


],
(req,res,next) => {
    const validation_result = validationResult(req);
    const {user_rang, nom_banque, code_agence, demande_capital, durée_crédit, mensualité, révenue, objet, travail, fact_steg_sonede, contrat_travail, revenu_sal} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){

        idCheck();
        
            dbConnection.execute("INSERT INTO `demande`(`idCrédit`,`rangCr`,`nomBnq`,`codeAg`,`capital`,`duréeCr`,`monsualité`,`Autres_rév`,`objet`,`travail`,`facture`,`contrat_travail`,`revenu_sal`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",[idcheck2,user_rang, nom_banque,code_agence,demande_capital,durée_crédit,mensualité,révenue,objet,travail,fact_steg_sonede,contrat_travail,revenu_sal])
            .catch(err => {
                // THROW INSERTING USER ERROR'S
                if (err) throw err;
            });

    }
    else{
        res.render('affiche');
    }
});
    

*/


app.get('/commercial/agenda',(req,res,next) =>{

    res.render('agenda');
});
app.get('/commercial/configuration',(req,res,next) =>{
    res.render('changerMotDePasse');
});
app.get('/commercial/contact',(req,res,next) =>{
    res.render('commercialContact');
});
app.get('/DCR/contact',(req,res,next) =>{
    res.render('dcrContact');
});
app.get('/backOffice/contact',(req,res,next) =>{
    res.render('/backOffice/contact');
});
// LOGOUT
app.get('/logout',(req,res)=>{
    //session destroy
    req.session = null;
    res.redirect('/');
});
app.get('/config/donnees',(req,res,next) => {
    console.log("id = "+ req.query.id);
    /* l 8alta f superAdmin :
    enti kont ketba : <a href="/admin/modifier<%= item.id %>"
    w heya : <a href="/admin/modifier?id=<%= item.id %>" */
  dbConnection.query("SELECT * FROM `demande` WHERE `id` = ?" ,[req.query.id])
  // res.redirect('/admin/config');
  .then(result => {
      console.log("id = "+ req.query.id);
      
    res.render('changerDonneesDemande',{
        item : result[0]
    });
});

});
app.post('/config/donnees', function(req,res,next){
    var param = [
        req.body,
        req.session.id
    ]
    dbConnection.query("UPDATE demande SET ? WHERE id = ?", param, function (err, result){
        res.redirect('/config');
    })
});

app.get('/config/donneesPersonnel', (req,res,next)=>{

 dbConnection.query("SELECT `nomCl`,`prenomCl`, `email`,`ville`, `CIN` FROM `client` WHERE `id`=?",[req.session.id])
 
  .then(result2 => {
    console.log("result2 = "+ result2);
      console.log("nom = "+ result2[0][0].nomCl);
      console.log("id = "+ req.session.id);
      
    res.render('changerDonneesClient',{
        item : result2[0][0]
    });
});
console.log(req.session.id);
});
app.get('/config/changerDonneesDemande', (req,res,next)=>{
    

    dbConnection.query("SELECT `rangCr`,`capital`,`duréeCr`,`monsualité`,`Autres_rév`,`id_national`,`facture`,`contrat_travail`,`revenu_sal` FROM demande WHERE `id`=?",[req.session.id])
    
     .then(result2 => {      
       res.render('changeDonneesDemande',{
           item : result2[0][0]
       });
   });
   console.log(req.session.id);
   });

   app.post('/config/changerDonneesDemande',[
    body('rangCr','Le rang se compose de 20 chiffres').trim().not().isEmpty().isLength(20),
    body('capital','Le capital est vide!').trim().not().isEmpty(),
    body('duréeCr','La durée de crédit est vide!').trim().not().isEmpty(),
    body('monsualité','La mensualité est vide!').trim().not().isEmpty(),
    body('Autres_rév','La révenue est vide!').trim().not().isEmpty(),
    body('id_national','Le carte d\'identité national est vide!').trim().not().isEmpty(),
    body('facture','La facture d\'eau (SONEDE) ou de l\'électricité (STEG) est vide!').trim().not().isEmpty(),
    body('contrat_travail','Le contrat de travail est vide!').trim().not().isEmpty(),
    body('revenu_sal','Le revenu salarial est vide!').trim().not().isEmpty()

], function(req,res,next){
    var idClient = req.session.id;
    const {rangCr,capital,duréeCr,monsualité,Autres_rév,id_national,facture,contrat_travail,revenu_sal} = req.body;

    dbConnection.query("UPDATE `demande` SET `rangCr` = ?, `capital` = ?, `duréeCr` = ?, `monsualité` = ?, `Autres_rév` = ?, `id_national` = ?,`facture` = ?,`contrat_travail` = ?,`revenu_sal` = ? WHERE `id` = ?", [rangCr,capital,duréeCr,monsualité,Autres_rév,id_national,facture,contrat_travail,revenu_sal,req.session.id]).then(result =>{
        res.redirect('/config/donneesDemande');
    });
});

app.post('/config/donneesPersonnel',[
    body('nomCl','Le capital est vide!').trim().not().isEmpty(),
    body('prenomCl','Le capital est vide!').trim().not().isEmpty(),
    body('email','Le capital est vide!').trim().not().isEmpty(),
    body('ville','Le capital est vide!').trim().not().isEmpty(),
    body('CIN','Le capital est vide!').trim().not().isEmpty()
], function(req,res,next){
    var idClient = req.session.id;
    const {nomCl,prenomCl,CIN,email,ville} = req.body;
    console.log("nom = "+nomCl);
    console.log("nom req = "+req.body.nomCl);
    dbConnection.query("UPDATE `client` SET `nomCl` = ?, `prenomCl` = ?,  `email` = ?, `ville` =? `CIN` = ?  WHERE `id` = ?", [nomCl,prenomCl,CIN,email,ville,req.session.id]).then(result =>{
        res.redirect('/config');
    });
});

app.get('/config/donneesDemande/supprimer', function(req,res,next){ 
    dbConnection.query("DELETE FROM `demande` WHERE `etat_dossier` = 'En attente' AND `etat_signature` = 'Pas confirmé' AND `id` =? ",[ req.session.id])
 
       .then(result => {
        res.send(`le demande a été supprimé avec succès, vous pouvez maintenant <a href="/config/donneesDemande">Vos demandes</a>`);
    });


});
//HOUNI LOL TAGMIRA :p
//espace commercial
app.get('/nouveauxDossiers', userIsNotAdmin,(req,res,next) => {  
    console.log(req.session.adminID);

   dbConnection.query("SELECT * FROM demande WHERE `etat_dossier`='En attente' "  , function(err,result){
    res.render('nouveauxDossiers',{
        items : result
    });

});
         
 });

app.get('/dossiersAcceptes', userIsNotAdmin,(req,res,next) => {  
console.log(req.session.adminID);

dbConnection.query("SELECT * FROM demande WHERE `etat_dossier`='Accepté' AND `etat_dossier`='Accepté (DCR)' " , function(err,result){
        res.render('dossiersAcceptes',{
            items : result
        });
    
    });
        
    });

app.get('/dossiersTraites', userIsNotAdmin,(req,res,next) => {  
    console.log(req.session.adminID);

    dbConnection.query("SELECT * FROM demande WHERE `etat_dossier`='Accepté (DCR)' "  , function(err,result){
    res.render('dossiersTraites',{
        items : result
    });

});
    });  
app.get('/rdvConfirme', userIsNotAdmin,(req,res,next) => {  
    console.log(req.session.adminID);

    dbConnection.query("SELECT * FROM demande WHERE `date_RDV`!= '0000-00-00' AND `etat_dossier`='Accepté'"  , function(err,result){
    res.render('rdvConfirmé',{
        items : result
    });

});
    }); 

app.get('/rdvAujourdhuit', userIsNotAdmin,(req,res,next) => {  
    console.log(req.session.adminID);
    let d = new Date();
    let dateNow = d.getFullYear()+"-"+Number(d.getMonth()+1)+"-"+d.getDate();
    
    console.log("date now = "+dateNow);
    dbConnection.query("SELECT * FROM `demande` WHERE `date_RDV`= ? AND `etat_dossier`='Accepté'",[dateNow]).then(result => {
    console.log("res= "+result[0].id);
        res.render('rdvAujourdhuit',{
        items : result[0]
    });

});
    });     

app.get('/dossiersRefuses', userIsNotAdmin,(req,res,next) => {  
    console.log(req.session.adminID);
    
    dbConnection.query("SELECT * FROM demande WHERE `etat_dossier`='Réfuser'" ,  function(err,result){
    res.render('dossierRefuses',{
        items : result
    });

});
    }); 

app.get('/confirmation', userIsNotAdmin,(req,res,next) =>{
    dbConnection.query("UPDATE demande SET `etat_signature` = 'Confirmé' AND `id` =? ",[ req.query.id])
    res.render('confirmation');
});

app.get('/configAdmin/mdp', userIsNotAdmin,(req,res,next) =>{
    res.render('changeMDP');
});

app.post('/configAdmin/mdp',[
    
    body('mot_de_passe','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
    body('mot_de_passe1','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
    body('mot_de_passe2','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),

],(req,res,next) => {
    const validation_result = validationResult(req);
    const {mot_de_passe,mot_de_passe1,mot_de_passe2} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcrypt)

        
        bcrypt.hash(mot_de_passe2,12).then((hash_pass2) => { 
           
           
      
        dbConnection.execute("SELECT `mot_de_passe` FROM `admin` WHERE `id`=?",[req.session.id]).then(old_mdp => {
        console.log("old_mdp = "+old_mdp[0][0].mot_de_passe); 
        bcrypt.compare(mot_de_passe,old_mdp[0][0].mot_de_passe).then(compare_result => {
            if(compare_result === true){

      
         console.log("EGAL1");
         
             if(mot_de_passe1 == mot_de_passe2){
                 console.log("EGAL");
                 dbConnection.execute("UPDATE `admin` SET `mot_de_passe` = ? WHERE id = ?",[hash_pass2,req.session.id])
                 .then(result => {
                     res.send(`votre mot de passé changé avec succée <a href="/profileAdmin">Votre profile</a>`);
                 }).catch(err => {
                     if (err) throw err;
                 });
              }
 
         }});
 
       });
      
       
        
            //console.log("mdp = "+hash_pass);

       });}})
app.get('/envoi',(req,res,next)=>{
    res.render('envoi');
})  ;   
app.get('/envoiDCR',(req,res,next)=>{
    res.render('envoiDCR');
})  ;   
app.get('/verifieDemande', userIsNotAdmin,(req,res,next) =>{
    dbConnection.execute("SELECT * FROM `demande` WHERE  `idCrédit` = ? ",[req.query.id]
        )
    .then(resultDemande  => {
        console.log("id = "+req.query.id);
        
        dbConnection.execute("SELECT `nomCl`,`prenomCl`,`CIN`,`tel_mobile`,`tel_domicile`,`email`,`dateNess`,`lieuNess`,`adresse`,`ville`,`salaire`,`numCompte` FROM `client` WHERE `id`=?",[resultDemande[0][0].id])
    .then(resultClient => {
        console.log("client nom = "+resultClient[0][0].nomCl);
      // console.log("client nom = "+resultClient[0]);
      console.log("demande capital h = "+resultDemande[0][0].capital);
        res.render('VérificationCommercial',{
            nom:resultClient[0][0].nomCl,
            prenom:resultClient[0][0].prenomCl,
            cin:resultClient[0][0].CIN,
            tel_mobile:resultClient[0][0].tel_mobile,
            tel_domicile:resultClient[0][0].tel_domicile,
            email:resultClient[0][0].email,
            dateNess:resultClient[0][0].dateNess,
            lieuNess:resultClient[0][0].lieuNess,
            adresse:resultClient[0][0].adresse,
            ville:resultClient[0][0].ville,
            salaire:resultClient[0][0].salaire,
            numCompte:resultClient[0][0].numCompte,
            capital:resultDemande[0][0].capital,
            rang:resultDemande[0][0].rangCr,
            durée:resultDemande[0][0].duréeCr,
            mensualité:resultDemande[0][0].monsualité,
            revenue:resultDemande[0][0].Autres_rév,
            id_national:resultDemande[0][0].id_national,
            facture:resultDemande[0][0].facture,
            contrat_travail:resultDemande[0][0].contrat_travail,
            revenu_sal:resultDemande[0][0].revenu_sal,
            id:req.query.id

   });
    });

             
});

});
app.get('/verifAccepteCommercial', userIsNotAdmin,(req,res,next) =>{
    dbConnection.query("UPDATE demande SET `etat_dossier` = 'Accepté' WHERE `idCrédit` = ? ",[ req.query.idCrédit])
  //  res.render('profileAdmin');
  .then(result => {
    res.send(`le demande été accepté,
            <a href="/envoi">Fixer rendez-vous</a>`);
});
});
app.get('/verifTranfereCommercial', userIsNotAdmin,(req,res,next) =>{
    dbConnection.query("UPDATE demande SET `etat_dossier` = 'Transférer' WHERE `idCrédit` = ? ",[ req.query.idCrédit])
  //  res.render('profileAdmin');
  .then(result => {
    res.send(`le demande été transférer à DCR <a href="/profileAdmin">Votre profile</a>`);
});
});
app.get('/verifRefuseCommercial', userIsNotAdmin,(req,res,next) =>{
    dbConnection.query("UPDATE demande SET `etat_dossier` = 'Réfuser' WHERE `idCrédit` = ? ",[ req.query.idCrédit])
  //  res.render('profileAdmin');
  .then(result => {
    res.send(`le demande été réfuser <a href="/profileAdmin">Votre profile</a>`);
});
});

app.get('/verifieDemandeDCR', userIsNotAdmin,(req,res,next) =>{
    dbConnection.execute("SELECT * FROM `demande` WHERE  `idCrédit` = ? ",[req.query.id]
        )
    .then(resultDemande  => {
        console.log("id = "+req.query.id);
        
        dbConnection.execute("SELECT `nomCl`,`prenomCl`,`CIN`,`tel_mobile`,`tel_domicile`,`email`,`dateNess`,`lieuNess`,`adresse`,`ville`,`salaire`,`numCompte` FROM `client` WHERE `id`=?",[resultDemande[0][0].id])
    .then(resultClient => {
        console.log("client nom = "+resultClient[0][0].nomCl);
      // console.log("client nom = "+resultClient[0]);
      console.log("demande capital h = "+resultDemande[0][0].capital);
        res.render('VérificationDCR',{
            nom:resultClient[0][0].nomCl,
            prenom:resultClient[0][0].prenomCl,
            cin:resultClient[0][0].CIN,
            tel_mobile:resultClient[0][0].tel_mobile,
            tel_domicile:resultClient[0][0].tel_domicile,
            email:resultClient[0][0].email,
            dateNess:resultClient[0][0].dateNess,
            lieuNess:resultClient[0][0].lieuNess,
            adresse:resultClient[0][0].adresse,
            ville:resultClient[0][0].ville,
            salaire:resultClient[0][0].salaire,
            numCompte:resultClient[0][0].numCompte,
            capital:resultDemande[0][0].capital,
            rang:resultDemande[0][0].rangCr,
            durée:resultDemande[0][0].duréeCr,
            mensualité:resultDemande[0][0].monsualité,
            revenue:resultDemande[0][0].Autres_rév,
            id_national:resultDemande[0][0].id_national,
            facture:resultDemande[0][0].facture,
            contrat_travail:resultDemande[0][0].contrat_travail,
            revenu_sal:resultDemande[0][0].revenu_sal,
            id:req.query.id

   });
    });

             
});

});

app.get('/verifAccepteDCR', userIsNotAdmin,(req,res,next) =>{
    dbConnection.query("UPDATE demande SET `etat_dossier` = 'Accepté DCR' WHERE `idCrédit` = ? ",[ req.query.idCrédit])
  //  res.render('profileAdmin');
  .then(result => {
    res.send(`le demande été accepté, <a href="/envoiDCR">Fixer un rendez-vous</a>`);
});
});

app.get('/verifRefuseDCR', userIsNotAdmin,(req,res,next) =>{
    dbConnection.query("UPDATE demande SET `etat_dossier` = 'Réfuser' WHERE `idCrédit` = ? ",[ req.query.idCrédit])
  //  res.render('profileAdmin');
  .then(result => {
    res.send(`le demande été réfuser  <a href="/admin/DCR">Votre profile</a>`);
});
});


//Espace Back office
app.get('/deblocage', userIsNotAdmin,(req,res,next) =>{
    dbConnection.query("UPDATE demande SET `etat_crédit` = 'Débloqué' WHERE `idCrédit` =? ",[ req.query.idCrédit])
    res.render('deblocage');
});
app.get('/nouveauxDossiersOffice', userIsNotAdmin,(req,res,next) => {  
    console.log(req.session.adminID);

   dbConnection.query("SELECT * FROM demande WHERE `etat_dossier`='En attente' "  , function(err,result){
    res.render('nouveauxDossiersOffice',{
        items : result
    });

});
         
 });

app.get('/dossiersDebloques', userIsNotAdmin,(req,res,next) => {  
console.log(req.session.adminID);

dbConnection.query("SELECT * FROM demande WHERE `etat_crédit`='Débloqué' "  , function(err,result){
res.render('dossiersDébloqués',{
    items : result
});

});
        
});

app.get('/configAdmin/mdp/boc', userIsNotAdmin,(req,res,next) =>{
    res.render('changeMdpBoc');
});

app.post('/configAdmin/mdp/boc',[
    
    body('mot_de_passe','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
    body('mot_de_passe1','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
    body('mot_de_passe2','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),

],(req,res,next) => {
    const validation_result = validationResult(req);
    const {mot_de_passe,mot_de_passe1,mot_de_passe2} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcrypt)

        
        bcrypt.hash(mot_de_passe2,12).then((hash_pass2) => { 
           
           
      
        dbConnection.execute("SELECT `mot_de_passe` FROM `admin` WHERE `id`=?",[req.session.id]).then(old_mdp => {
        console.log("old_mdp = "+old_mdp[0][0].mot_de_passe); 
        bcrypt.compare(mot_de_passe,old_mdp[0][0].mot_de_passe).then(compare_result => {
            if(compare_result === true){

      
         console.log("EGAL1");
         
             if(mot_de_passe1 == mot_de_passe2){
                 console.log("EGAL");
                 dbConnection.execute("UPDATE `admin` SET `mot_de_passe` = ? WHERE id = ?",[hash_pass2,req.session.id])
                 .then(result => {
                     res.send(`votre mot de passé changé avec succée <a href="/admin/backOffice">Votre profile</a>`);
                 }).catch(err => {
                     if (err) throw err;
                 });
              }
 
         }});
 
       });
      
       
        
            //console.log("mdp = "+hash_pass);

       });}})

//Espace DCR
app.get('/dossiersTranferer', function(req,res){ 
    dbConnection.query("SELECT * FROM demande WHERE `etat_dossier`='Transférer'"  , function(err,result){
        res.render('dossiersTrans',{
            items : result
        });
    
    });

});

app.get('/dossiersAcceptesDCR', userIsNotAdmin,(req,res,next) => {  
    
    dbConnection.query("SELECT * FROM demande WHERE `etat_dossier`='Accepté' OR `etat_dossier`='Accepté (DCR)' " , function(err,result){
            res.render('dossieracceptésDCR',{
                items : result
            });
        
        });
            
});

app.get('/dossiersRefusesDCR', userIsNotAdmin,(req,res,next) => {  
    
    dbConnection.query("SELECT * FROM demande WHERE `etat_dossier`='Réfuser' " , function(err,result){
            res.render('dossiersRefusés',{
                items : result
            });
        
        });
            
});

app.get('/configAdmin/mdp/dcr', userIsNotAdmin,(req,res,next) =>{
    res.render('changeMdpDCR');
});

app.post('/configAdmin/mdp/dcr',[
    
    body('mot_de_passe','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
    body('mot_de_passe1','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
    body('mot_de_passe2','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),

],(req,res,next) => {
    const validation_result = validationResult(req);
    const {mot_de_passe,mot_de_passe1,mot_de_passe2} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcrypt)

        
        bcrypt.hash(mot_de_passe2,12).then((hash_pass2) => { 
           
           
      
        dbConnection.execute("SELECT `mot_de_passe` FROM `admin` WHERE `id`=?",[req.session.id]).then(old_mdp => {
        console.log("old_mdp = "+old_mdp[0][0].mot_de_passe); 
        bcrypt.compare(mot_de_passe,old_mdp[0][0].mot_de_passe).then(compare_result => {
            if(compare_result === true){

      
         console.log("EGAL1");
         
             if(mot_de_passe1 == mot_de_passe2){
                 console.log("EGAL");
                 dbConnection.execute("UPDATE `admin` SET `mot_de_passe` = ? WHERE id = ?",[hash_pass2,req.session.id])
                 .then(result => {
                     res.send(`votre mot de passé changé avec succée <a href="/admin/DCR">Votre profile</a>`);
                 }).catch(err => {
                     if (err) throw err;
                 });
              }
 
         }});
 
       });
      
       
        
            //console.log("mdp = "+hash_pass);

       });}})
//super admin
app.get('/configAdmin/mdp/superAdmin', userIsNotAdmin,(req,res,next) =>{
    res.render('changeMdpSuperAdmin');
});

app.post('/configAdmin/mdp/superAdmin',[
    
    body('mot_de_passe','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
    body('mot_de_passe1','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
    body('mot_de_passe2','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),

],(req,res,next) => {
    const validation_result = validationResult(req);
    const {mot_de_passe,mot_de_passe1,mot_de_passe2} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcrypt)

        
        bcrypt.hash(mot_de_passe2,12).then((hash_pass2) => { 
           
           
      
        dbConnection.execute("SELECT `mot_de_passe` FROM `admin` WHERE `id`=?",[req.session.id]).then(old_mdp => {
        console.log("old_mdp = "+old_mdp[0][0].mot_de_passe); 
        bcrypt.compare(mot_de_passe,old_mdp[0][0].mot_de_passe).then(compare_result => {
            if(compare_result === true){

      
         console.log("EGAL1");
         
             if(mot_de_passe1 == mot_de_passe2){
                 console.log("EGAL");
                 dbConnection.execute("UPDATE `admin` SET `mot_de_passe` = ? WHERE id = ?",[hash_pass2,req.session.id])
                 .then(result => {
                     res.send(`votre mot de passé changé avec succée <a href="/admin/config">Votre profile</a>`);
                 }).catch(err => {
                     if (err) throw err;
                 });
              }
 
         }});
 
       });
      
       
        
            //console.log("mdp = "+hash_pass);

       });}})
app.get('/simulationClient',(req,res,next) => {
    res.render('simulationClient');
})       
    

// END OF LOGOUT 

/*app.use('/', (req,res) => {
    res.status(404).send('<h1>404 Page Not Found!</h1>');
});
*/

app.listen(3000, () => console.log("Server is Running..."));