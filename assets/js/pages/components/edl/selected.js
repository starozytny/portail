function addBienSelected (bien) {
    let selected = document.querySelector('.selected-bien');
    let selectedAdr = document.querySelector('.selected-bien .adr');
    let selectedZip = document.querySelector('.selected-bien .zipcode');
    let selectedCit = document.querySelector('.selected-bien .city');
    let selectedRef = document.querySelector('.selected-bien .ref');

    selected.classList.add('active');
    selectedAdr.innerHTML = bien.addr1;
    selectedZip.innerHTML = bien.zipcode;
    selectedCit.innerHTML = bien.city;
    selectedRef.innerHTML = bien.reference;
}

function addTenantSelected (selected, inputValues, inputCreateValues, tenants) {
    // check if at least on tenant active
    if(inputValues.length > 0 || inputCreateValues.length > 0){
        selected.classList.add('active');
    }else{
        selected.classList.remove('active');
    }

    // set selected tenants in form
    selected.innerHTML = "";
    if(inputValues.length > 0){
        inputValues.forEach(val => {
            JSON.parse(tenants.dataset.data).forEach(tenant => {
                if(parseInt(val) === parseInt(tenant.id)){
                    addTenantHtml(selected, tenant, "server");
                }
            })
        })
    }

    if(inputCreateValues.length > 0){
        inputCreateValues.forEach(tenant => {
            addTenantHtml(selected, JSON.parse(tenant), "create");
        })
    }
}

function addTenantHtml(selected, tenant, from) {
    selected.insertAdjacentHTML('beforeend',
        '<div class="card active">\n' +
        '         <div class="btn-remove">\n' +
        '             <div class="from">'+ (from === "create" ? "Création" : "") +'</div>\n' +
        '             <div class="btn-icon btn-remove-tenant" data-from="'+ from +'" data-data=\''+ JSON.stringify(tenant) +'\' data-id="'+ tenant.id +'">\n' +
        '                 <span class="icon-cancel"></span>\n' +
        '                 <div class="tooltip">Déselectionner ce locatire</div>\n' +
        '             </div>\n' +
        '         </div>\n' +
        '         <div class="card-header">\n' +
        '             <div class="title">\n' +
        '                 <div class="label">\n' +
        '                     <div class="name">'+ tenant.first_name + ' ' + tenant.last_name +'</div>\n' +
        '                     <div class="sub">\n' +
        '                        <span class="adr">'+ tenant.addr1 +'</span>\n' +
        '                     </div>\n' +
        '                     <div class="sub">\n' +
        '                         <span class="zipcode">'+ (tenant.zipcode !== "0" ? tenant.zipcode : "") +'</span>\n'+
        '                           '+ (tenant.city && tenant.zipcode ? ',' : '') +'\n' +
        '                         <span class="city">'+ tenant.city +'</span>\n' +
        '                     </div>\n' +
        '                 </div>\n' +
        '                 <div class="ref">Ref : '+ tenant.reference +'</div>\n' +
        '             </div>\n' +
        '         </div>\n' +
        '     </div>'
    );
}

module.exports = {
    addBienSelected,
    addTenantSelected
}