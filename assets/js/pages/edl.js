import '../../css/pages/edl.scss';

import axios            from "axios";
import toastr           from "toastr";
import Swal             from "sweetalert2";
import SwalOptions      from "../components/functions/swalOptions";

import Aside            from "../components/functions/aside";
import Validateur       from "../components/functions/validateur";
import SelectBien       from "./components/Edl/select-bien";
import SelectTenants    from "./components/Edl/select-tenants";
import AddBien          from "./components/Edl/add-bien";
import AddTenant        from "./components/Edl/add-tenant";
import Search           from "./components/Edl/search";
import List             from "./components/Edl/list";

import React from "react";
import { render } from "react-dom";
import { EdlFormulaire } from "./components/Edl/EdlForm";

let el = document.getElementById('edl-create');
if(el){
    render(<EdlFormulaire {...el.dataset} type="create" oriUrl={"/espace-client/edl"}/>, el);
}

let view = document.getElementById("view")
if(view) console.log(JSON.parse(view.dataset.donnees));

List.resizeMonthList();
List.details();
List.initPagination();
List.pagination();
List.comeback();

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
// Search functions
//*****
Search.searchBien();
Search.searchTenant();
Search.searchEdl();

//*****
// Submit form
//*****
let formClass = ".edl-form";
let form = document.querySelector(formClass);
if(form){

    let structure = document.querySelector(formClass + ' #structure').value;
    let modelInput = document.querySelector('.input-model');
    if(structure === "1"){
        modelInput.classList.add('active');
    }
    if(structure === "2"){
        let optionStructure = document.querySelector('.input-structure option[value="2"]');
        if(optionStructure){
            optionStructure.style.display = "block"
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let method = form.dataset.from === "create" ? "POST" : "PUT";

        let errorForm = document.querySelector(formClass + ' .error-form');
        let errorBien = document.querySelector('.input-bien')
        let errorTenant = document.querySelector('.input-tenants')

        let attribution     = document.querySelector(formClass + ' #attribution').value;
        let structure       = document.querySelector(formClass + ' #structure').value;
        let model           = document.querySelector(formClass + ' #model').value;
        let type            = document.querySelector(formClass + ' input[name="type"]:checked').value;
        let startDate       = document.querySelector(formClass + ' .startDate').value;
        let bien            = document.querySelector(formClass + ' #bien').value;
        let bienCreate      = document.querySelector(formClass + ' #bien-created').value;
        let tenants         = document.querySelector(formClass + ' #tenants').value;
        let tenantsCreate   = document.querySelector(formClass + ' #tenants-created').value;

        // console.log("Structure : " + structure)
        // console.log("Model : " + model)
        // console.log("Attribution : " + attribution)
        // console.log("Date : " + new Date(startDate).getTime())
        // console.log("Type : " + type)
        // console.log("Bien : " + bien)
        // console.log("Bien created : " + bienCreate)
        // console.log("Tenants : " + tenants)
        // console.log("Tenants creates : " + tenantsCreate)

        //reset errors
        errorForm.classList.remove('active');
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
            //send data ajax
            Validateur.loader(true);
            startDate = startDate !== "" ? new Date(startDate).getTime() + "" : 0;
            let formData = {
                structure: structure,
                model: model,
                attribution: attribution,
                startDate: startDate !== 0 ? startDate.substring(0, startDate.length - 3) : 0,
                type: type,
                bien: bien,
                bienCreate: bienCreate,
                tenants: tenants,
                tenantsCreate: tenantsCreate
            };
            axios({method: method, url: form.dataset.url, data: formData})
                .then(function (response) {
                    toastr.info((form.dataset.from === "create" ? "Etat des lieux ajouté" : "Données mises à jour") +
                        "! La page va se rafraichir dans quelques instants.");

                    if(form.dataset.from !== "create"){
                        localStorage.setItem('edlPagination', form.dataset.id);
                    }

                    setTimeout(function () {
                        location.href = response.data;
                    }, 1000);
                })
                .catch(function (error) {
                    Validateur.loader(false);
                    Validateur.handleErrors(error, formClass);
                })
            ;
        }

    })
}

//*****
// Supprimer un edl
//*****
let btnsDelete = document.querySelectorAll('.btn-delete');
if(btnsDelete){
    btnsDelete.forEach(btnDelete => {
        btnDelete.addEventListener('click', function (e) {
            e.preventDefault();

            Swal.fire(SwalOptions.options("Supprimer cet état des lieux ?", "Cette action est irréversible."))
                .then((result) => {
                    if (result.isConfirmed) {
                        axios.delete(btnDelete.dataset.url, {})
                            .then(function (response) {
                                toastr.info(response.data);

                                List.removeItem(btnDelete.dataset.id);
                            })
                            .catch(function (error) {
                                Validateur.handleErrors(error)
                            })
                        ;
                    }
                })
            ;
        })
    })
}