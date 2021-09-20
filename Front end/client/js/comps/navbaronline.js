class NavBarOnline extends HTMLElement {
    constructor() {
        super();

        //page active
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
        function ProfilActive(nom) {
            if (nom == "Profil") { return "active"; } else { return ""; }
        }


        //notif badge num
        var alertsNum = this.getAttribute('alerts-number');
        function NotifNumAff(alertsNum) {
            if (alertsNum == 0) {
                return "style='display:none;'";
            } else {
                return alertsNum;
            }
        }

        //enregistrement notifs
        var notifs = [];
        const notifWrapper = this.querySelectorAll(".notif-wrapper");
        if (alertsNum != 0) {
            for (var i = 0; i < alertsNum; i++) {

                var notifTable = {};
                notifTable.notifLink = notifWrapper[i].getAttribute('link');
                notifTable.notifIcon = notifWrapper[i].getAttribute('icon');
                notifTable.notifMsg = notifWrapper[i].getAttribute('msg');
                notifTable.notifTime = notifWrapper[i].getAttribute('time');
                notifs.push(notifTable);
            }

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
                        <li class="nav-item dropdown">
                            <a class="icon-btn-nav" href="#" id="navbarNotifDropdown" role="button" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false"><i class="fas fa-bell"></i><span
                                    class="alertes-text">Alertes</span><span class="badge" ${NotifNumAff(alertsNum)}>${NotifNumAff(alertsNum)}</span></a>
                            <div class="dropdown-menu drop-down-notif" aria-labelledby="navbarNotifDropdown" id="inside-notifs">
                               
                                
                                
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="btn-nav btn-nav-with-icon dropdown-toggle ${ProfilActive(nom)}" href="#" id="navbarProfilDropdown"
                                role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-user-circle"></i>Profil
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarProfilDropdown">
                                <p class="t-subtitle-1 profil-Name">${this.getAttribute("nom-utilisateur")}</p>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="profil.htm">Mes demandes</a>
                                <a class="dropdown-item" href="rendezvous.htm">Mes Rendez-vous</a>
                                <a class="dropdown-item" href="parametres.htm">Paramètres</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#">Déconnexion</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        `;

        if (alertsNum == 0) {
            $("#inside-notifs").append(`<p style="text-align:center; margin:16px auto;">Vous n'avez aucune nouvelle notification</p>`);
        } else {
            for (var i = 0; i < alertsNum; i++) {
                $("#inside-notifs").append(`
                              <div class="notif-text-time-icon">
                                  <a href="${notifs[i].notifLink}"></a>
                                  <i class="fas ${notifs[i].notifIcon} notif-icon-inside"></i>
                                  <div class="notif-text-time">
                                      <p>${notifs[i].notifMsg}</p>
                                      <p class="t-body-2">${notifs[i].notifTime}</p>
                                  </div>
                              </div>
                              <div class="dropdown-divider"></div>
                              `);
            }


        }


    }
}

window.customElements.define('navbar-on', NavBarOnline);