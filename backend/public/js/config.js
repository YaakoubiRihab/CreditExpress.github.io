//navbar 

$(window).scroll(function () {
    if ($(window).scrollTop() > 10) {
        $('#navBar').addClass('floating-nav');
    } else {
        $('#navBar').removeClass('floating-nav');
    }
});

// input 
var all = document.getElementsByClassName('inp');
for(var i=0;i<all.length;i++)
all[i].onclick=function(){
    this.parentElement.classList.add("filled");
}

// input file 
$(".inp").change(function (e) {
    var nomFile = e.target.value.split("\\").pop();

    if (nomFile) {
        $(this).parent().addClass("inp-file-d-filled");
        $(this).siblings(".inp-label-file").html("Document ajouté");
        $(this).siblings(".inp-icon-file-right").removeClass("fa-file-upload");
        $(this).siblings(".inp-icon-file-right").addClass("fa-check-circle");
        $(this).siblings(".inp-file-msg").css("display", "block");
        $(this).siblings(".inp-file-msg").html("Nom du fichier ajouté: '" + nomFile + "'");
        var check1 = $("#inp-file-cin").parent().hasClass("inp-file-d-filled");
        var check2 = $("#inp-file-contract").parent().hasClass("inp-file-d-filled");
        var check3 = $("#inp-file-releve").parent().hasClass("inp-file-d-filled");
        var check4 = $("#inp-file-facture").parent().hasClass("inp-file-d-filled");
        if (check1 && check2 && check3 && check4) {
            $(".btn-pr").removeClass("btn-pr-disabled");
            $(".btn-pr").removeAttr("disabled");
        }
    } else {
        $(this).parent().removeClass("inp-file-d-filled");
        $(this).siblings(".inp-label-file").html("Ajouter votre document");
        $(this).siblings(".inp-icon-file-right").removeClass("fa-check-circle");
        $(this).siblings(".inp-icon-file-right").addClass("fa-file-upload");
        $(this).siblings(".inp-file-msg").css("display", "block");
        $(this).siblings(".inp-file-msg").html("Aucun fichier selectionné");
        $(".btn-pr").addClass("btn-pr-disabled");
        $(".btn-pr").attr("disabled", "disabled");
    }
});


//slider style
if (document.getElementById("sliderCapital")){

document.getElementById("sliderCapital").oninput = function () {
    var slider = document.getElementById("sliderCapital");
    var selector = document.getElementById("selector");
    var selectValue = document.getElementById("selectValue");
    var progressBar = document.getElementById("progressBar");
  selectValue.innerHTML = slider.value + "Dt";
  selector.style.left = (this.value - 5000) / 150 + "%";
  selector.style.transform = "translateX(-" + (this.value - 5000) / 150 + "%)";
  progressBar.style.width = (this.value - 5000) / 150 + "%";
};

}

if(document.getElementById("sliderTime")){


document.getElementById("sliderTime").oninput = function () {
    var sliderT = document.getElementById("sliderTime");
    var selectorT = document.getElementById("selectorTime");
    var selectValueT = document.getElementById("selectValueTime");
    var progressBarT = document.getElementById("progressBarTime");
  selectValueT.innerHTML = sliderT.value + " mois";
  selectorT.style.left = (this.value - 6) * 3.33333 + "%";
  selectorT.style.transform = "translateX(-" + (this.value - 6) * 3.33333 + "%)";
  progressBarT.style.width = (this.value - 6) * 3.33333 + "%";
}
}

