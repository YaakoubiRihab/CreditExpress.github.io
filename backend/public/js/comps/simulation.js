class Simulation extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
        <div class="paper ">
         

          <div class="landing-simulation">


            <form action="/demandepartie1/">
              <p class="t-subtitle-1 sim-label">
                Commencez par saisir votre age et salaire:
              </p>

              <div class="inp-d">
                <input type="number" class="inp" id="age" name="age" />
                <label for="" class="inp-label">Age</label>
                <label for="" class="inp-aside">Ans</label>
              </div>
              <div id="error-elig-age" class="t-subtitle-1"></div>
              <div class="inp-d">
                <input type="number" class="inp" id="salaire" name="salaire" />
                <label for="" class="inp-label">Salaire</label>
                <label for="" class="inp-aside">Dnt</label>
              </div>
              <div id="error-fillig" class="t-subtitle-1"></div>
              <p class="t-subtitle-1 sim-label">
                Choisissez le montant:
              </p>
              <div class="slider-div">
                <input type="range" min="5000" max="20000" step="1000" value="10000" id="sliderCapital"
                  name="capital" />
                <div id="selector">
                  <div class="selectBtn"></div>
                  <div id="selectValue">10000Dt</div>
                </div>
                <div id="progressBar"></div>
                <div class="min-sim">5000 Dt</div>
                <div class="max-sim">20000 Dt</div>
              </div>

              <p class="t-subtitle-1 sim-label">
                Choisissez la durrée:
              </p>
              <div class="slider-div">
                <input type="range" min="6" max="36" step="1" value="12" id="sliderTime" name="durre" />
                <div id="selectorTime">
                  <div class="selectBtn"></div>
                  <div id="selectValueTime">12 mois</div>
                </div>
                <div id="progressBarTime"></div>
                <div class="min-sim">6 mois</div>
                <div class="max-sim">36 mois</div>
              </div>


              <div class="row sim-res  text-center" id="simu-result">
                <div class="col-12">
                  <h5 id="sim-res-men">
                    Mensualité: <br> <span class="bold-res">933 Dt</span>
                  </h5>
                </div>
                <div id="error-mens" class="t-subtitle-1">La mensualité du crédit ne doit pas dépasser 40% de votre
                  salaire, essayez des autres options.</div>
                <div class="col-6 col-md-3">
                  <p id="sim-res-cap">
                    Capital: <br> <span class="bold-res">10000 Dt</span>
                  </p>
                </div>
                <div class="col-6 col-md-3">
                  <p id="sim-res-durr">
                    Durée: <br><span class="bold-res">12 mois</span>
                  </p>
                </div>
                <div class="col-6 col-md-3">
                  <p id="sim-res-taux">
                    Taux d'intérêt: <br> <span class="bold-res">12%</span>
                  </p>
                </div>
                <div class="col-6 col-md-3">
                  <p id="sim-res-cout">
                    Cout de crédit: <br> <span class="bold-res">1200 Dt</span>
                  </p>
                </div>
              </div>

              <div class="text-center">
                <input id="mensualite" name="mensualite" type="hidden" value="">
                <input type="submit" class="btn-pr" id="submit-btn" value="Validez" disabled="disabled"
                  title="SVP ajoutez votre age et salaire">
              </div>
            </form>

          </div>
        </div>
        `;
    }
}

window.customElements.define('page-simulation', Simulation);