jQuery.extend(jQuery.validator.messages, {
    required: "Ce champ est obligatoire.",
    email: "Svp tapez une adresse mail valide."
});

var v = $("#sign-form").validate({
    rules: {
      nom: { required: true },
      prenom: { required: true },
      dateNassance: { required: true },
      lieuNaissance: { required: true },
      adresse: { required: true },
      ville: { required: true },
      codePostal: { required: true },
      telMobil: { required: true },
      compteBancaire: { required: true },
      salaire: { required: true },
      email: { required: true },
      password: { required: true }
    }
});

$(".next-btn-1").click(function() {
    if (v.form()) {
      $(".etape").hide();
      $("#stepTwo").fadeIn(1000);
      $("#stepper-1").addClass("done");
      $("#stepper-2").addClass("active");
    }
 });

 $(".next-btn-2").click(function() {
    if (v.form()) {
      $(".etape").hide();
      $("#stepThree").fadeIn(1000);
      $("#stepper-2").addClass("done");
      $("#stepper-3").addClass("active");
    }
 });

 $(".next-btn-3").click(function() {
    if (v.form()) {
      $(".etape").hide();
      $("#stepFour").fadeIn(1000);
      $("#stepper-3").addClass("done");
      $("#stepper-4").addClass("active");
    }
 });