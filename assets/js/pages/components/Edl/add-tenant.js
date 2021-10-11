const axios         = require("axios");
const toastr        = require("toastr");

const Validateur    = require("../../../components/functions/validateur");
const Aside         = require("../../../components/functions/aside");
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
                {type: "text", id: 'reference-tenant', value: reference},
                {type: "length", min: 0, max: 5,  id: 'reference',  value: reference},
                {type: "length", min: 0, max: 80, id: 'lastname',   value: lastname},
                {type: "length", min: 0, max: 80, id: 'firstname',  value: firstname},
                {type: "length", min: 0, max: 15, id: 'phone',      value: phone},
                {type: "length", min: 0, max: 80, id: 'email',      value: email},
                {type: "length", min: 0, max: 80, id: 'addr1',      value: addr1},
                {type: "length", min: 0, max: 40, id: 'addr2',      value: addr2},
                {type: "length", min: 0, max: 40, id: 'addr3',      value: addr3},
                {type: "length", min: 0, max: 40, id: 'city',       value: city},
                {type: "length", min: 0, max: 5,  id: 'zipcode',    value: zipcode},
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