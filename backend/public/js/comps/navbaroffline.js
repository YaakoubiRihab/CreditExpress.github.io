class NavBarOffline extends HTMLElement {
    constructor() {
        super();

        // which page is active
        var nom = this.getAttribute('page');
        function AccueilActive(nom) {
            if (nom == "Accueil") { return "active"; } else { return ""; }
        }
        function SimulationActive(nom) {
            if (nom == "Simulation") { return "active"; } else { return ""; }
        }
        function AssistanceActive(nom) {
            if (nom == "Assistance") { return "active"; } else { return ""; }
        }
        function ContactActive(nom) {
            if (nom == "Contact") { return "active"; } else { return ""; }
        }



        this.innerHTML = `
        <nav class="navbar navbar-expand-md navbar-light fixed-top" id="navBar">
        <div class="container">
            <a class="navbar-brand" href="index.htm"><img src="img/logo.svg"></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="${AccueilActive(nom)}" href="index.htm">Accueil</a>
                    </li>
                    <li class="nav-item">
                        <a class="${SimulationActive(nom)}" href="simulation.htm">Simulation</a>
                    </li>
                    <li class="nav-item">
                        <a class="${AssistanceActive(nom)}" href="assistance.htm">Assistance</a>
                    </li>
                    <li class="nav-item">
                        <a class="${ContactActive(nom)}" href="contact.htm">Contact</a>
                    </li>
                    <li class="nav-item">
                        <a class="btn-nav" href="connexion.htm">Connexion</a>
                    </li>
                </ul>
            </div>
        </div>
     </nav>
        `;
    }
}

window.customElements.define('navbar-off', NavBarOffline);