const toastr = require("toastr");
const Selected = require("./selected");

let tenants = document.querySelector('#allTenants');
let selected = document.querySelector('.selected-tenants');

function updateValuesFromServer(input, tenantId) {
    let inputCreated = document.querySelector('#tenants-created');

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
            toastr.info('Locataire ajouté.')
            values.push(tenantId);
        }else{
            // if find, remove active this
            toastr.error('Locataire enlevé.')
            btn.classList.remove('active');
        }
    }else{
        toastr.info('Locataire ajouté.')
        values.push(tenantId);
    }

    // set data to input
    input.value = values.join();

    let inputCreatedValues = inputCreated.value !== "" ? inputCreated.value.split('#') : [];
    Selected.addTenantSelected(selected, values, inputCreatedValues, tenants);

    addClickEventBtnRemove(input, inputCreated);
}

function updateValuesFromCreate(input, data) {
    let inputFromServer = document.querySelector('#tenants');

    let oldValues = input.value;
    let values = [];

    if(oldValues !== ""){
        oldValues = oldValues.split('#');

        // add old values without this id value
        let find = false;
        oldValues.forEach(oldVal => {
            if(JSON.parse(oldVal).reference === data.reference){
                find = true;
            }else{
                values.push(oldVal);
            }
        })

        if(!find){
            values.push(JSON.stringify(data));
        }
    }else{
        values.push(JSON.stringify(data));
    }

    input.value = values.join("#");

    let inputValuesFromServer = inputFromServer.value !== "" ? inputFromServer.value.split(',') : [];
    Selected.addTenantSelected(selected, inputValuesFromServer, values, tenants);

    addClickEventBtnRemove(inputFromServer, input);
}

function addClickEventBtnRemove(inputServer, inputCreate) {
    let btnsRemove = document.querySelectorAll('.btn-remove-tenant');
    btnsRemove.forEach(btnRemove => {
        btnRemove.addEventListener('click', function (e) {
            if(btnRemove.dataset.from === "server"){
                updateValuesFromServer(inputServer, btnRemove.dataset.id);
            }else{
                updateValuesFromCreate(inputCreate, JSON.parse(btnRemove.dataset.data));
            }
        });
    })
}

module.exports = {
    updateValuesFromServer,
    updateValuesFromCreate
}