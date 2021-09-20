
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


