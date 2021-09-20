class Footer extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
        <div class="container">
            <div class="top">
                <div class="row">
                    <div class="logo">
                        <img src="img/logoWhite.svg" alt="">
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-5 col-12 about">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                    <div class="col-lg-4 col-sm-6 col-12 contact">
                        <P>
                            Centre de Relations Clients :
                            <span>${this.getAttribute("num-service-client")}</span>
                            Du lundi au vendredi de 8h à 18h,
                            le samedi de 9h à 15h
                            (Coût d’un appel local)
                        </P>
                    </div>
                    <div class="col-lg-3 col-sm-6 col-12 app-download">
                        <div class="badges-container">
                            <a href="${this.getAttribute("apple")}"><img src="img/appAppleBadge.svg" alt=""></a>
                            <a href="${this.getAttribute("google")}"><img src="img/appGoogleBadge.svg" alt=""></a></div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="row">
                    <div class="line-sp"></div>
                    <p>Copyright © 2020. Tous droits reservés. </p>
                    <div class="social-media">
                        <ul>
                            <li><a href="${this.getAttribute("facebook")}" target="_blank"><i class="fab fa-facebook-square"></i></a></li>
                            <li><a href="${this.getAttribute("instagram")}" target="_blank"><i class="fab fa-instagram"></i></a></li>
                            <li><a href="${this.getAttribute("youtube")}" target="_blank"><i class="fab fa-youtube"></i></a></li>
                            <li><a href="${this.getAttribute("linkedin")}" target="_blank"><i class="fab fa-linkedin"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}

window.customElements.define('page-footer', Footer);