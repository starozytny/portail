const axios         = require("axios");
const toastr        = require("toastr");

const Validateur    = require("../../../components/validateur");
const Aside         = require("../../../components/aside");
const Tenants       = require('./tenants');

function addTenant() {
    let formClass = '.tenant-form';
    let form = document.querySelector(formClass);
    if(form){
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            Validateur.hideErrors();

            let lastname        = document.querySelector(formClass + ' .lastname').value;
            let firstname       = document.querySelector(formClass + ' .firstname').value;
            let reference       = document.querySelector(formClass + ' .reference-tenant').value;
            let phone           = document.querySelector(formClass + ' .phone').value;
            let email           = document.querySelector(formClass + ' .email').value;
            let addr1           = document.querySelector(formClass + ' .addr1-tenant').value;
            let addr2           = document.querySelector(formClass + ' .addr2-tenant').value;
            let addr3           = document.querySelector(formClass + ' .addr3-tenant').value;
            let city            = document.querySelector(formClass + ' .city-tenant').value;
            let zipcode         = document.querySelector(formClass + ' .zipcode-tenant').value;

            // validate data
            let validate = Validateur.validateur([
                {type: "text", id: 'lastname', value: lastname},
                {type: "text", id: 'firstname', value: firstname},
                {type: "text", id: 'reference-tenant', value: reference}
            ])

            if(!validate.code){
                toastr.warning("Veuillez vérifier les informations transmises.");
                Validateur.displayErrors(validate.errors);
            }else {
                //send data ajax
                // Validateur.loader(true);
                let formData = {
                    lastname: lastname,
                    firstname: firstname,
                    reference: reference,
                    phone: phone,
                    email: email,
                    addr1: addr1,
                    addr2: addr2,
                    addr3: addr3,
                    city: city,
                    zipcode: zipcode
                };
                axios({method: "POST", url: form.dataset.url, data: formData})
                    .then(function (response) {
                        let input = document.querySelector('#tenants-created');

                        form.reset();

                        Tenants.updateValuesFromCreate(input, response.data)

                        Aside.closeAside('.aside-add-tenant');
                    })
                    .catch(function (error) {
                        console.log(error)
                        Validateur.handleErrors(error)
                    })
                    .then(function () {
                        Validateur.loader(false);
                    })
                ;
            }
        })
    }
}

module.exports = {
    addTenant
}