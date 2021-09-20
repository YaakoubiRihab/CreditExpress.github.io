class paramModal extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
        <div class="modal fade" id="${this.getAttribute("declancheur")}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Changer mon ${this.getAttribute("label")}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <form action="${this.getAttribute("form-action")}">
                    <input-text type="${this.getAttribute("type")}" name="${this.getAttribute("name")}" label="${this.getAttribute("label")}" msg="" icon="fa-user-alt" required="required"></input-text>
                    <input type="submit" class="btn-pr" value="Enregistrer"  />
                </form>
            </div>
          </div>
        </div>
      </div>
        `;
    }
}

window.customElements.define('param-modal', paramModal);