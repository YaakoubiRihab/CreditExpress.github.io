var age = document.getElementById("age");
var salaire = document.getElementById("salaire");
var sliderCapital = document.getElementById("sliderCapital");
var sliderTime = document.getElementById("sliderTime");
var ageCheck = 0;
var salaireCheck = 0;
var submitBtn = document.getElementById("submit-btn");
const INTERET = 0.12;

//res aff

var resCapital = document.getElementById("sim-res-cap");
var resMens = document.getElementById("sim-res-men");
var resDuree = document.getElementById("sim-res-durr");
var resTaux = document.getElementById("sim-res-taux");
var resCout = document.getElementById("sim-res-cout");
var errMens = document.getElementById("error-mens");

age.onblur = function () {
    if ((age.value > 66) || (age.value < 18)) {
        document.getElementById("error-elig-age").style.display = ("block")
        document.getElementById("error-elig-age").innerHTML = "Vous n'etes pas éligible, le crédit express est disponible que pour les aduletes entre 18 et 66 ans.";
    } else if ((age.value < 66) || (age.value > 17)) {
        document.getElementById("error-elig-age").style.display = ("none")
        document.getElementById("error-elig-age").innerHTML = "";
        ageCheck = 1;
    }
    if ((ageCheck == 1) && (salaireCheck == 1)) {
        document.getElementById("error-fillig").style.display = ("none");
    }
}

salaire.onblur = function () {
    window.tauxEndettement = salaire.value * 0.4;
    console.log(tauxEndettement);
    salaireCheck = 1;
    if ((ageCheck == 1) && (salaireCheck == 1)) {
        document.getElementById("error-fillig").style.display = ("none");
    }
}




sliderCapital.onchange = function () {

    if ((ageCheck == 1) && (salaireCheck == 1)) {
        //calcul ici
        document.getElementById("error-fillig").style.display = ("none");
        var capital = sliderCapital.value;
        var durre = sliderTime.value;
        var coutCredit = capital * INTERET;
        var coutTotal = +capital + +coutCredit;
        var mens = Math.round(coutTotal / durre);
        console.log(mens);

        if (tauxEndettement >= mens) {
            errMens.style.display = "none";
            resMens.innerHTML = "Mensualité: <br> <span class='bold-res'>" + mens + " Dt</span>";
            resCapital.innerHTML = "Capital: <br> <span class='bold-res'>" + capital + " Dt</span>";
            resDuree.innerHTML = "Durée: <br><span class='bold-res'>" + durre + " mois</span>";
            resTaux.innerHTML = "Taux d'intérêt: <br> <span class='bold-res'>12%</span>";
            resCout.innerHTML = "Cout de crédit: <br> <span class='bold-res'>" + coutCredit + " Dt</span>";
            document.getElementById("mensualite").value = mens ;
            submitBtn.removeAttribute("disabled");
            submitBtn.removeAttribute("title");

        } else if (tauxEndettement < mens) {
            errMens.style.display = "block";
            resMens.innerHTML = "Mensualité: <br> <span class='bold-res'>" + mens + " Dt</span>";
            resCapital.innerHTML = "Capital: <br> <span class='bold-res'>" + capital + " Dt</span>";
            resDuree.innerHTML = "Durée: <br><span class='bold-res'>" + durre + " mois</span>";
            resTaux.innerHTML = "Taux d'intérêt: <br> <span class='bold-res'>12%</span>";
            resCout.innerHTML = "Cout de crédit: <br> <span class='bold-res'>" + coutCredit + " Dt</span>";
        }


    } else {
        document.getElementById("error-fillig").style.display = ("block");
        document.getElementById("error-fillig").innerHTML = "SVP ajouter d'abord votre age et salaire";
    }


};


sliderTime.onchange = function () {

    if ((ageCheck == 1) && (salaireCheck == 1)) {
        //calcul ici
        document.getElementById("error-fillig").style.display = ("none");
        var capital = sliderCapital.value;
        var durre = sliderTime.value;
        var coutCredit = capital * INTERET;
        var coutTotal = +capital + +coutCredit;
        var mens = Math.round(coutTotal / durre);

        if (tauxEndettement >= mens) {
            errMens.style.display = "none";
            resMens.innerHTML = "Mensualité: <br> <span class='bold-res'>" + mens + " Dt</span>";
            resCapital.innerHTML = "Capital: <br> <span class='bold-res'>" + capital + " Dt</span>";
            resDuree.innerHTML = "Durée: <br><span class='bold-res'>" + durre + " mois</span>";
            resTaux.innerHTML = "Taux d'intérêt: <br> <span class='bold-res'>12%</span>";
            resCout.innerHTML = "Cout de crédit: <br> <span class='bold-res'>" + coutCredit + " Dt</span>";
            document.getElementById("mensualite").value = mens ;
            submitBtn.removeAttribute("disabled");
            submitBtn.removeAttribute("title");

        } else if (tauxEndettement < mens) {
            errMens.style.display = "block";
            resMens.innerHTML = "Mensualité: <br> <span class='bold-res'>" + mens + " Dt</span>";
            resCapital.innerHTML = "Capital: <br> <span class='bold-res'>" + capital + " Dt</span>";
            resDuree.innerHTML = "Durée: <br><span class='bold-res'>" + durre + " mois</span>";
            resTaux.innerHTML = "Taux d'intérêt: <br> <span class='bold-res'>12%</span>";
            resCout.innerHTML = "Cout de crédit: <br> <span class='bold-res'>" + coutCredit + " Dt</span>";
        }



    } else {
        document.getElementById("error-fillig").style.display = ("block");
        document.getElementById("error-fillig").innerHTML = "SVP ajouter d'abord votre age et salaire";
    }


};

