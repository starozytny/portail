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

module.exports = {
    searchBien,
    searchTenant
}