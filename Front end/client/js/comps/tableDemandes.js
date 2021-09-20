class tableDemandes extends HTMLElement {
    constructor() {
        super();


        //Num demandes
        var demandeNum = this.getAttribute('num-demandes');
        function demandeNumAff(demandeNum) {
            if (demandeNum == 0) {
                return "style='display:none;'";
            } else {
                return demandeNum;
            }
        }

        //enregistrement demandes
        var demandes = [];
        const demandeWrapper = this.querySelectorAll(".demande-wrapper");
        if (demandeNum != 0) {
            for (var i = 0; i < demandeNum; i++) {

                var demandeTable = {};
                demandeTable.demandeC = demandeWrapper[i].getAttribute('capital');
                demandeTable.demandeM = demandeWrapper[i].getAttribute('mensualite');
                demandeTable.demandeD = demandeWrapper[i].getAttribute('durre');
                demandeTable.demandeE = demandeWrapper[i].getAttribute('etat');
                demandes.push(demandeTable);
            }

        }


        this.innerHTML = `
        <p id="aucune-demande" style="display:none;text-align:center; margin:16px auto;">Vous n'avez aucune demandes</p>
        <table ${demandeNumAff(demandeNum)}>
            <thead>
            <tr>
                <th>Capital</th>
                <th>Mensualité</th>
                <th>Durée</th>
                <th>État</th>
            </tr>
            </thead>
            <tbody id="demande-ligne">
            

            </tbody>
        </table>
        `;

        if (demandeNum == 0) {
            $("#aucune-demande").show();
        } else {
            for (var i = 0; i < demandeNum; i++) {
                $("#demande-ligne").append(`
                                <tr>
                                <td>${demandes[i].demandeC}</td>
                                <td>${demandes[i].demandeM}</td>
                                <td>${demandes[i].demandeD}</td>
                                <td>${demandes[i].demandeE}</td>
                                </tr>
                              `);
            }


        }
    }
}

window.customElements.define('table-demande', tableDemandes);