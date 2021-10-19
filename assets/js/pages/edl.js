import '../../css/pages/edl.scss';

import axios            from "axios";
import toastr           from "toastr";
import Swal             from "sweetalert2";
import SwalOptions      from "../components/functions/swalOptions";

import Validateur       from "../components/functions/validateur";
import Search           from "./components/Edl/search";
import List             from "./components/Edl/list";

import React from "react";
import { render } from "react-dom";
import { EdlFormulaire } from "./components/Edl/EdlForm";

let el = document.getElementById('edl-form');
if(el){
    render(<EdlFormulaire {...el.dataset} oriUrl={"/espace-client/edl"}
                          propertyUrl={"/espace-client/property"}
                          tenantUrl={"/espace-client/tenant"}
    />, el);
}

let view = document.getElementById("view")
if(view) console.log(JSON.parse(view.dataset.donnees));

List.resizeMonthList();
List.details();
List.initPagination();
List.pagination();
List.comeback();

//*****
// Search functions
//*****
Search.searchTenant();
Search.searchEdl();

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