import '../../css/pages/edl.scss';

import Aside        from "../components/aside";

let view = document.querySelector("#view");
console.log(JSON.parse(view.dataset.donnees))

//*****
// Ouvrir l'aside select bien
//*****
Aside.manageAside('.btn-select-bien', '.aside-select-bien');

//*****
// Select bien
//*****
let btnsBien = document.querySelectorAll('.list-select-bien .card');
let btnRemoveBien = document.querySelector('.btn-remove-bien');
let actionsBien = document.querySelector('.actions-bien');
let inputBien = document.querySelector('#bien');

let selectedBien = document.querySelector('.selected-bien');
let selectedBienAdr = document.querySelector('.selected-bien .adr');
let selectedBienZip = document.querySelector('.selected-bien .zipcode');
let selectedBienCit = document.querySelector('.selected-bien .city');
let selectedBienRef = document.querySelector('.selected-bien .ref');

btnsBien.forEach(btnBien => {
    btnBien.addEventListener('click', function (e) {
        e.preventDefault();

        let currentActive = btnBien.classList.contains('active');

        removeBien();

        if(!currentActive){
            btnBien.classList.add('active');
            inputBien.value = btnBien.dataset.id;

            actionsBien.classList.remove('active');

            let bien = JSON.parse(btnBien.dataset.bien);
            selectedBien.classList.add('active');
            selectedBienAdr.innerHTML = bien.addr1;
            selectedBienZip.innerHTML = bien.zipcode;
            selectedBienCit.innerHTML = bien.city;
            selectedBienRef.innerHTML = bien.reference;
        }

        Aside.closeAside('.aside-select-bien');
    });

    btnRemoveBien.addEventListener('click', function (e) {
        removeBien();
    });
})

function removeBien() {
    btnsBien.forEach(elem => {
        elem.classList.remove('active');
        inputBien.value = "";

        actionsBien.classList.add('active');

        selectedBien.classList.remove('active');
        selectedBienAdr.innerHTML = "";
        selectedBienZip.innerHTML = "";
        selectedBienCit.innerHTML = "";
        selectedBienRef.innerHTML = "";
    })
}