const axios         = require("axios");
const toastr        = require("toastr");

const Validateur    = require("../../../components/validateur");
const Aside         = require("../../../components/aside");
const Selected          = require("./selected");

function addBien() {
    let formClass = '.bien-form';
    let form = document.querySelector(formClass);
    if(form){
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            Validateur.hideErrors();

            let typeBien        = document.querySelector(formClass + ' .typeBien').value;
            let reference       = document.querySelector(formClass + ' .reference').value;
            let owner           = document.querySelector(formClass + ' .owner').value;
            let building        = document.querySelector(formClass + ' .building').value;
            let addr1           = document.querySelector(formClass + ' .addr1').value;
            let addr2           = document.querySelector(formClass + ' .addr2').value;
            let addr3           = document.querySelector(formClass + ' .addr3').value;
            let surface         = document.querySelector(formClass + ' .surface').value;
            let room            = document.querySelector(formClass + ' .room').value;
            let floor           = document.querySelector(formClass + ' .floor').value;
            let door            = document.querySelector(formClass + ' .door').value;
            let city            = document.querySelector(formClass + ' .city').value;
            let zipcode         = document.querySelector(formClass + ' .zipcode').value;
            let isFurniture     = document.querySelector(formClass + ' [name="isFurniture"]:checked').value;

            // validate data
            let validate = Validateur.validateur([
                {type: "text", id: 'reference', value: reference},
                {type: "text", id: 'addr1', value: addr1},
                {type: "text", id: 'city', value: city},
                {type: "text", id: 'zipcode', value: zipcode}
            ])

            if(!validate.code){
                toastr.warning("Veuillez vérifier les informations transmises.");
                Validateur.displayErrors(validate.errors);
            }else {
                //send data ajax
                Validateur.loader(true);
                let formData = {
                    typeBien: typeBien,
                    reference: reference,
                    owner: owner,
                    building: building,
                    addr1: addr1,
                    addr2: addr2,
                    addr3: addr3,
                    surface: surface,
                    room: room,
                    floor: floor,
                    door: door,
                    city: city,
                    zipcode: zipcode,
                    isFurniture: isFurniture,
                };
                axios({method: "POST", url: form.dataset.url, data: formData})
                    .then(function (response) {
                        let input = document.querySelector('#bien-created');
                        let actions = document.querySelector('.actions-bien');

                        actions.classList.remove('active');
                        input.value = JSON.stringify(response.data);

                        Selected.addBienSelected(response.data);
                        Aside.closeAside('.aside-add-bien');
                    })
                    .catch(function (error) {
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
    addBien
}