function selectTenants() {
    let tenants = document.querySelector('#allTenants')
    let btns = document.querySelectorAll('.list-select-tenants .card');
    let btnsRemove = document.querySelectorAll('.btn-remove-tenant');
    let input = document.querySelector('#tenants');

    let selected = document.querySelector('.selected-tenants');

    JSON.parse(tenants.dataset.selected).forEach(elem => {
        updateValues(elem.id, input);
    })

    btns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            updateValues(btn.dataset.id, input);
        });

        btnsRemove.forEach(btnRemove => {
            btnRemove.addEventListener('click', function (e) {
                updateValues(btnRemove.dataset.id, input);
            });
        })

    })

    function updateValues(tenantId, input) {
        let btn = document.querySelector('.list-select-tenants .card-' + tenantId)
        let oldValues = input.value;
        let values = [];

        btn.classList.add('active');

        if(oldValues !== ""){
            oldValues = oldValues.split(',')

            // add old values without this id value
            let find = false;
            oldValues.forEach(oldVal => {
                if(oldVal === tenantId){
                    find = true;
                }else{
                    values.push(oldVal);
                }
            })

            // if not find this id value, add to values
            if(!find){
                values.push(tenantId);
            }else{
                // if find, remove active this
                btn.classList.remove('active');
            }
        }else{
            values.push(tenantId);
        }

        // check if at least on tenant active
        if(values.length > 0){
            selected.classList.add('active');
        }else{
            selected.classList.remove('active');
        }

        // set data to input
        input.value = values.join();

        // set selected tenants in form
        selected.innerHTML = "";
        values.forEach(val => {
            JSON.parse(tenants.dataset.data).forEach(tenant => {
                if(parseInt(val) === parseInt(tenant.id)){
                    selected.insertAdjacentHTML('beforeend',
                        '<div class="card active">\n' +
                        '         <div class="btn-remove">\n' +
                        '             <div class="btn-icon btn-remove-tenant" data-id="'+ tenant.id +'">\n' +
                        '                 <span class="icon-cancel"></span>\n' +
                        '                 <div class="tooltip">Déselectionner ce locatire</div>\n' +
                        '             </div>\n' +
                        '         </div>\n' +
                        '         <div class="card-header">\n' +
                        '             <div class="title">\n' +
                        '                 <div class="label">\n' +
                        '                     <div class="name">'+ tenant.first_name + ' ' + tenant.last_name.toUpperCase() +'</div>\n' +
                        '                     <div class="sub">\n' +
                        '                        <span class="adr">'+ tenant.addr1 +'</span>\n' +
                        '                     </div>\n' +
                        '                     <div class="sub">\n' +
                        '                         <span class="zipcode">'+ tenant.zipcode +'</span>'+ (tenant.city && tenant.zipcode ? ',' : '') +'\n' +
                        '                         <span class="city">'+ tenant.city +'</span>\n' +
                        '                     </div>\n' +
                        '                 </div>\n' +
                        '                 <div class="ref">Ref : '+ tenant.reference +'</div>\n' +
                        '             </div>\n' +
                        '         </div>\n' +
                        '     </div>'
                    );
                }
            })
        })


        let btnsRemove = document.querySelectorAll('.btn-remove-tenant');
        btnsRemove.forEach(btnRemove => {
            btnRemove.addEventListener('click', function (e) {
                updateValues(btnRemove.dataset.id, input);
            });
        })
    }
}

module.exports = {
    selectTenants
}