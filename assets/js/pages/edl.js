import '../../css/pages/edl.scss';

import Aside            from "../components/aside";
import SelectBien       from "./components/edl/select-bien";
import SelectTenants    from "./components/edl/select-tenants";
import AddBien          from "./components/edl/add-bien";
import AddTenant        from "./components/edl/add-tenant";
import Validateur       from "../components/validateur";
import toastr from "toastr";
import axios from "axios";

let view = document.querySelector("#view");
console.log(JSON.parse(view.dataset.donnees))

//*****
// Ouvrir les asides
//*****
Aside.manageAside('.btn-select-bien', '.aside-select-bien');
Aside.manageAside('.btn-select-tenants', '.aside-select-tenants');
Aside.manageAside('.btn-add-bien', '.aside-add-bien');
Aside.manageAside('.btn-add-tenant', '.aside-add-tenant');

//*****
// Selections
//*****
SelectBien.selectBien();
SelectTenants.selectTenants();
AddBien.addBien();
AddTenant.addTenant();

let structure = document.querySelector('#structure');
if(structure){
    let inputModel = document.querySelector('.input-model');

    structure.addEventListener('change', function (e) {
        if(structure.value === "1") { //etablir structure
            inputModel.classList.add('active');
        }else{
            inputModel.classList.remove('active');
        }
    })
}

//*****
// Submit form
//*****
let formClass = ".edl-form";
let form = document.querySelector(formClass);
if(form){
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let method = form.dataset.from === "create" ? "POST" : "PUT";
        let errorBien = document.querySelector('.input-bien')
        let errorTenant = document.querySelector('.input-tenants')

        let attribution     = document.querySelector(formClass + ' #attribution').value;
        let structure       = document.querySelector(formClass + ' #structure').value;
        let model           = document.querySelector(formClass + ' #model').value;
        let type            = document.querySelector(formClass + ' input[name="type"]').value;
        let startDate       = document.querySelector(formClass + ' .startDate').value;
        let bien            = document.querySelector(formClass + ' #bien').value;
        let bienCreate      = document.querySelector(formClass + ' #bien-created').value;
        let tenants         = document.querySelector(formClass + ' #tenants').value;
        let tenantsCreate   = document.querySelector(formClass + ' #tenants-created').value;

        //reset errors
        errorBien.classList.remove('form-group-error');
        errorTenant.classList.remove('form-group-error');
        Validateur.hideErrors();

        // validate data
        let error = false;
        if(bien === "" && bienCreate === ""){
            error = true;
            errorBien.classList.add('form-group-error');
        }
        if(tenants === "" && tenantsCreate === ""){
            error = true;
            errorTenant.classList.add('form-group-error');
        }

        let paramsToValidate = [
            {type: "text", id: 'structure', value: structure},
            {type: "text", id: 'attribution', value: attribution},
            {type: "text", id: 'type', value: type},
        ];
        if(structure === "1") { //établir structure = model set
            paramsToValidate = [...paramsToValidate, ...[{type: "text", id: 'model', value: model}]];
        }

        let validate = Validateur.validateur(paramsToValidate);
        if(!validate.code || error){
            toastr.warning("Veuillez vérifier les informations transmises.");
            Validateur.displayErrors(validate.errors);
        }else{
            // console.log(structure)
            // console.log(model)
            // console.log(attribution)
            // console.log(startDate)
            // console.log(type)
            // console.log(bien)
            // console.log(bienCreate)
            // console.log(tenants)
            // console.log(tenantsCreate)

            //send data ajax
            Validateur.loader(true);
            let formData = {
                structure: structure,
                model: model,
                attribution: attribution,
                startDate: startDate,
                type: type,
                bien: bien,
                bienCreate: bienCreate,
                tenants: tenants,
                tenantsCreate: tenantsCreate
            };
            axios({method: method, url: form.dataset.url, data: formData})
                .then(function (response) {
                    console.log("ok")
                    toastr.info(response.data)
                    console.log(response)
                    console.log(response.data)
                })
                .catch(function (error) {
                    // console.log(error)
                    // console.log(error.response)
                    console.log(error.response.data)
                    Validateur.handleErrors(error)
                })
                .then(function () {
                    Validateur.loader(false);
                })
            ;
        }

    })
}