
    

class LandingSim extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
        
        <div class="paper">
            <h4>SIMULEZ VOTRE CRÉDIT</h4>
            <h5>(Crédit express UBCI)</h5>
            <p class="t-subtitle-1 sim-label">
                Commencez par saisir votre age et salaire:
            </p>
            <div class="form-row">
                <div class="inp-d col-md-4 offset-1">
                <input type="number" class="inp"  id="age" name="age" />
                <label for="" class="inp-label" id="inp-label">Age</label>
                <label for="" class="inp-aside">Ans</label>
                </div>
                <div class="inp-d col-md-4 offset-1">
                <input type="number" class="inp"  id="salaire" name="salaire" />
                <label for="" class="inp-label" id="inp-label">Salaire</label>
                <label for="" class="inp-aside">Dnt</label>
                </div>
            </div>
            <div id="error-elig" class="t-subtitle-1">

            </div>
            <form action="${this.getAttribute("action")}">
            <p class="t-subtitle-1 sim-label">
                Choisissez le montant:
            </p>
            <div class="slider-div">
                <input type="range" min="5000" max="20000" step="1000" value="10000" id="sliderCapital" name="capital" />
                <div id="selector">
                <div class="selectBtn"></div>
                <div id="selectValue">10000Dt</div>
                </div>
                <div id="progressBar"></div>
                <div class="min-sim">5000 Dt</div>
                <div class="max-sim">20000 Dt</div>
            </div>

            <p class="t-subtitle-1 sim-label">
                Choisissez l'option qui vous convient:
            </p>

            <div class="row">
                <div class="col-4 col-lg-3">
                <input type="radio" name="sim-res" id="rad-1" class="sim-radio" />
                <label for="rad-1" class="sim-radio-label" id="label-option-1">
                    <h6 class="mb-0" id="option1">933dt</h6>
                    <p class="t-body-2 mb-0 durre">12 mois</p>
                </label>
                </div>
                <div class="col-4 col-lg-3">
                <input type="radio" name="sim-res" id="rad-2" class="sim-radio" />
                <label for="rad-2" class="sim-radio-label" id="label-option-2">
                    <h6 class="mb-0" id="option2">467dt</h6>
                    <p class="t-body-2 mb-0 durre">24 mois</p>
                </label>
                </div>

                <div class="col-4 col-lg-3">
                <input type="radio" name="sim-res" id="rad-3" class="sim-radio" />
                <label for="rad-3" class="sim-radio-label" id="label-option-3">
                    <h6 class="mb-0" id="option3">311dt</h6>
                    <p class="t-body-2 mb-0 durre">36 mois</p>
                </label>
                </div>
                <div class="col-12 col-lg-3">
                <input type="radio" name="sim-res" id="4" class="sim-radio" />
                <label for="4" class="sim-radio-label">
                    <h5 class="mb-0">+</h5>
                    <p class="t-body-2 mb-0">Plus D'option</p>
                </label>
                </div>
            </div>
            <div class="row sim-res" id="simu-result">
                <div class="col-4">
                <p class="t-body-2" id="sim-res-cap">
                    Capital:
                </p>
                </div>
                <div class="col-4">
                <p class="t-body-2" id="sim-res-men">
                    Mensualité:
                </p>
                </div>
                <div class="col-4">
                <p class="t-body-2" id="sim-res-durr">
                    Durée:
                </p>
                </div>
                <div class="col-6">
                <p class="t-body-2" id="sim-res-taux">
                    Taux d'intérêt:
                </p>
                </div>
                <div class="col-6">
                <p class="t-body-2" id="sim-res-cout">
                    Cout de crédit:
                </p>
                </div>
            </div>
            <input id="mensualite" name="mensualite" type="hidden" value="">
            <input id="durre" name="durre" type="hidden" value="">
            <input type="submit" class="btn-pr" id="submit-btn" value="Validez" disabled="disabled">
            </form>
            </div>
        `;
    }
}

window.customElements.define('land-sim', LandingSim);