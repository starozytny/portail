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
        let elems = document.querySelectorAll('.list-month .items > .item');
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
                        List.hideItem(elem.dataset.id);
                    }
                }
            })
        })
    }
}

module.exports = {
    searchBien,
    searchTenant,
    searchEdl
}