class InpText extends HTMLElement {
    constructor() {
        super();


        var Msg = this.getAttribute('msg');
        function MsgOutput(Msg) {
            if (Msg == "") {
                return "style='display:none;'";
            } else {
                return Msg;
            }
        }

        

        this.innerHTML = `
        <div class="inp-d ${this.getAttribute("error")}">
            <input type="${this.getAttribute("type")}" class="inp" name="${this.getAttribute("name")}" ${this.getAttribute("required")}/>
            <label for="" class="inp-label" >${this.getAttribute("label")}</label>
            <br />
            <label for="" class="t-subtitle-2 inp-message" ${MsgOutput(Msg)}>${MsgOutput(Msg)}</label>
            <i class="fa ${this.getAttribute("icon")} inp-icon" aria-hidden="true"></i>
            <slot />
        </div>
        `;
    }
}

window.customElements.define('input-text', InpText);

class InpFile extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
        <div class="inp-d" id="inp-file-d">
            <label for="" class="inp-label-file-name">${this.getAttribute("label")}</label>
            <input type="file" class="inp" id="${this.getAttribute("id-for")}" name="${this.getAttribute("name")}" required accept="application/pdf" />
            <i class="fa ${this.getAttribute("icon")} inp-icon inp-icon-file"></i>
            <label for="${this.getAttribute("id-for")}" class="inp-label-file">${this.getAttribute("place-holder")}</label>
            <i class="fa fa-file-upload inp-icon inp-icon-file-right"></i>
            <p class="t-body-2 inp-file-msg">votre fichier est:</p>
        </div>
        `;
    }
    
}

window.customElements.define('input-file', InpFile);