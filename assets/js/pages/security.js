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
Aside.manageAside('.btn-lost', '.aside-lost');

//*****
// Formulaire pour retrouver son mot de passe oublié
//*****
let lost = document.querySelector('.lost-form');
if(lost){
    let success = document.querySelector('.lost-form > .form-success')
    let successMsg = document.querySelector('.lost-form > .form-success > .alert p')
    lost.addEventListener('submit', function (e) {
        e.preventDefault();

        success.classList.remove('true');
        successMsg.innerHTML = "";
        Validateur.hideErrors();

        let username = document.getElementById('fusername').value;
        let validate = Validateur.validateur([
            {type: "text", id: 'fusername', value: username},
        ])

        if(!validate.code){
            toastr.warning("Veuillez vérifier les informations transmises.");
            Validateur.displayErrors(validate.errors);
        }else{
            Validateur.loader(true);
            axios.post(lost.dataset.url, {username: username})
                .then(function (response) {
                    if(response.data !== ""){
                        success.classList.add('true');
                        successMsg.innerHTML = response.data;
                    }else{
                        Validateur.displayErrors([{name: 'fusername', message: 'Ce nom d\'utilisateur est incorrect'}]);
                    }
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