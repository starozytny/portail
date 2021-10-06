const List = require("./list");

function searchBien() {
    let search = document.querySelector('.searchBien');
    if(search){
        let biens = document.querySelectorAll('.list-select-bien .card');
        search.addEventListener('input', function (e) {
            let val = this.value.toLowerCase();

            biens.forEach(b => {
                if(val === ""){
                    b.style.display = "block";
                }else{
                    b.style.display = "none";

                    let bien = JSON.parse(b.dataset.bien);
                    if(bien.reference.startsWith(val)){
                        b.style.display = "block"
                    }

                    if(bien.zipcode.startsWith(val)){
                        b.style.display = "block"
                    }

                    if(bien.city.toLowerCase().startsWith(val)){
                        b.style.display = "block"
                    }

                    if(bien.owner.toLowerCase().startsWith(val)){
                        b.style.display = "block"
                    }

                    if(bien.addr1.toLowerCase().startsWith(val)){
                        b.style.display = "block"
                    }
                }
            })
        })
    }
}

function searchTenant() {
    let search = document.querySelector('.searchTenant');
    if(search){
        let tenants = document.querySelectorAll('.list-select-tenants .card');
        search.addEventListener('input', function (e) {
            let val = this.value.toLowerCase();

            tenants.forEach(b => {
                if(val === ""){
                    b.style.display = "block";
                }else{
                    b.style.display = "none";

                    let tenant = JSON.parse(b.dataset.tenant);
                    if(tenant.reference.startsWith(val)){
                        b.style.display = "block"
                    }

                    if(tenant.last_name.toLowerCase().startsWith(val)){
                        b.style.display = "block"
                    }

                    if(tenant.zipcode.startsWith(val)){
                        b.style.display = "block"
                    }

                    if(tenant.city.toLowerCase().startsWith(val)){
                        b.style.display = "block"
                    }

                    if(tenant.addr1 && tenant.addr1.toLowerCase().startsWith(val)){
                        b.style.display = "block"
                    }
                }
            })
        })
    }
}

function searchEdl() {
    let search = document.querySelector('.searchEdl');
    if(search){
        let elems = document.querySelectorAll('.list-month .inventories > .item');
        search.addEventListener('input', function (e) {
            let val = this.value.toLowerCase();
            let resultsNone = document.querySelectorAll('.result-none');

            resultsNone.forEach(r => { r.remove(); })

            elems.forEach(elem => {
                if(val === ""){
                    elem.style.display = "flex";
                }else{
                    let display = false;
                    elem.style.display = "none";

                    let data = JSON.parse(elem.dataset.data);

                    if(data.property.reference.startsWith(val)){
                        display = true;
                    }

                    if(data.property.zipcode.startsWith(val)){
                        display = true;
                    }

                    if(data.property.city.toLowerCase().startsWith(val)){
                        display = true;
                    }

                    if(data.property.owner.toLowerCase().startsWith(val)){
                        display = true;
                    }

                    if(data.property.addr1.toLowerCase().startsWith(val)){
                        display = true;
                    }

                    if(display){
                        elem.style.display = "flex";
                    }else{
                        elem.style.display = "none";
                    }
                }
            })

            let lists = document.querySelectorAll('.list-month');
            lists.forEach(list => {
                let id = list.dataset.id;

                let inventories = document.querySelector('.inventories-' + id);
                let atLeastOne = false;
                Array.from(inventories.children).forEach(item => {
                    if(item.style.display === "flex"){
                        atLeastOne = true;
                    }
                })

                if(!atLeastOne){
                    let isExiste = false
                    Array.from(inventories.children).forEach(item => {
                        if(item.classList.contains('result-none')){
                            isExiste = true;
                        }
                    })

                    if(!isExiste){
                        inventories.insertAdjacentHTML('beforeend', '' +
                            '<div class="result-none alert alert-default">' +
                            '   Pour ce mois-ci, aucun résultat pour la recherche en cours.' +
                            '</div>');
                    }
                }else{
                    let items = document.querySelector('.list-month-' + id + " .items");
                    items.classList.add('active');
                }
            })

            let listItems = document.querySelectorAll('.list-month .items');
            let paginations = document.querySelectorAll('.pagination')
            if(val === ""){
                paginations.forEach(pagination => { pagination.style.display = "flex"; });
                listItems.forEach(items => { items.classList.remove('active'); })
            }else{
                paginations.forEach(pagination => { pagination.style.display = "none"; })
            }
        })
    }
}

module.exports = {
    searchBien,
    searchTenant,
    searchEdl
}