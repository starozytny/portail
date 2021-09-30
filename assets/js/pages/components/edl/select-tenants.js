const Tenants = require('./tenants');

let tenants = document.querySelector('#allTenants');

function selectTenants() {
    let btns = document.querySelectorAll('.list-select-tenants .card');
    let btnsRemove = document.querySelectorAll('.btn-remove-tenant');
    let input = document.querySelector('#tenants');

    JSON.parse(tenants.dataset.selected).forEach(elem => {
        Tenants.updateValuesFromServer(input, elem.id);
    })

    btns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            Tenants.updateValuesFromServer(input, btn.dataset.id);
        });

        btnsRemove.forEach(btnRemove => {
            btnRemove.addEventListener('click', function (e) {
                Tenants.updateValuesFromServer(input, btnRemove.dataset.id);
            });
        })

    })
}

module.exports = {
    selectTenants
}