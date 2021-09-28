import '../../css/pages/security.scss';

import axios from 'axios';
import toastr from 'toastr';

import Aside from '../components/aside';
import Validateur from '../components/validateur';

//*****
// Voir/Cacher le mot de passe
//*****
let btnSeePassword = document.querySelector('.btn-see-password');
if(btnSeePassword){
    let seePassword = false;
    let inputSeePassword = document.querySelector('#password');
    btnSeePassword.addEventListener('click', function (e) {
        if(seePassword){
            seePassword = false;
            inputSeePassword.type = "password";
            btnSeePassword.classList.remove("icon-show");
            btnSeePassword.classList.add("icon-hide");
        }else{
            seePassword = true;
            inputSeePassword.type = "text";
            btnSeePassword.classList.remove("icon-hide");
            btnSeePassword.classList.add("icon-show");
        }
    })
}

//*****
// Ouvrir l'aside pour retrouver son mot de passe
//*****
let btnsLost = document.querySelectorAll('.btn-lost');
if(btnsLost){
    let aside = document.querySelector('.aside-lost');

    let overlay = document.querySelector('.aside-overlay');
    btnsLost.forEach(btnLost => {
        btnLost.addEventListener('click', function (e) { Aside.openCloseAside(aside) })
    })
    overlay.addEventListener('click', function (e) { Aside.openCloseAside(aside) })
}

//*****
// Formulaire pour retrouver son mot de passe oublié
//*****
let lost = document.querySelector('.lost-form');
if(lost){
    lost.addEventListener('submit', function (e) {
        e.preventDefault();

        let username = document.getElementById('fusername').value;

        let validate = Validateur.validateur([
            {type: "text", id: 'fusername', value: username},
        ])

        Validateur.hideErrors();

        if(!validate.code){
            toastr.warning("Veuillez vérifier les informations transmises.");
            Validateur.displayErrors(validate.errors);
        }else{
            axios.post(lost.dataset.url, {username: username})
                .then(function (response) {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error)
                })
            ;
        }

    })
}