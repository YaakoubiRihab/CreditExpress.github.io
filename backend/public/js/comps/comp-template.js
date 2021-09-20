class JsName extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `html here`;
    }
}

window.customElements.define('html-name', JsName);