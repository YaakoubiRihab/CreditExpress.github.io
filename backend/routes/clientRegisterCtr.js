const bcrypt = require('bcrypt');
const dbConnection = require('../database/db');

var idcheck2;
var idIsUnique;
var userConnected;

app.post('/enregistrement', ifLoggedin, 
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
   /* body('user_name','Le nom est vide!').trim().not().isEmpty(),
    body('user_prenom','Le prenom est vide!').trim().not().isEmpty(),
    body('user_daten','Le date de naissance est vide!').trim().not().isEmpty(),
    body('user_lieu','Le lieu de naissance est vide!').trim().not().isEmpty(),
    body('user_adresse','L\'adresse est vide!').trim().not().isEmpty(),
    body('user_ville','Le ville est vide!').trim().not().isEmpty(),
    body('user_code','Le code est vide!').trim().not().isEmpty(),
    body('user_cin','Le numéro de CIN est vide!').trim().not().isEmpty(),
    body('user_mobile','Le numéro mobile est vide!').trim().not().isEmpty(),
    body('user_domicile','Le numéro domicile est vide!').trim().not().isEmpty(),
    body('user_num','Le numéro de compte se compose de 20 chiffres').trim().not().isEmpty().isLength({ min: 20, max: 20 }),
    body('user_salaire','Le salaire est vide!').trim().not().isEmpty(),
    body('user_etat','L\'etat familial est vide!').trim().not().isEmpty(),
    body('user_passe','Le mot de passe doit être d\'une longueur minimale de 6 caractères').trim().isLength({ min: 6 }),
*/],// end of post data validation
(req,res,next) => {

    const validation_result = validationResult(req);
    const {user_name, user_passe, user_email, user_prenom, user_daten, user_lieu, user_adresse, user_ville, user_code, user_cin, user_mobile, user_domicile, user_num, user_salaire, user_etat} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcrypt)

        bcrypt.hash(user_passe,12).then((hash_pass) => {
            // INSERTING USER INTO DATABASE
            //console.log("mdp hash = "+hash_pass);
        idCheck();
        
       // console.log("idcheck2 before bd = "+idcheck2);

            console.log("mdp = "+hash_pass);
            dbConnection.execute("INSERT INTO `client`(`nomCl`,`email`,`mot_de_passe`,`id`,`prenomCl`,`dateNess`,`lieuNess`,`adresse`,`ville`,`code_pst`,`CIN`,`tel_mobile`,`tel_domicile`,`numCompte`,`salaire`,`etat_familial`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[user_name,user_email, hash_pass,idcheck2,user_prenom,user_daten,user_lieu,user_adresse,user_ville,user_code,user_cin,user_mobile,user_domicile,user_num,user_salaire,user_etat])
            .then(result => {
                res.send(`votre compte a été créé avec succès, vous pouvez maintenant <a href="/">s'identifier</a>`);
            }).catch(err => {
                // THROW INSERTING USER ERROR'S
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
        res.render('login_enregistrement',{
            register_error:allErrors,
            old_data:req.body
        });
    }
});// END OF REGISTER PAGE