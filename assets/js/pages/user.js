import '../../css/pages/user.scss';
import Validateur from "../components/validateur";
import toastr from "toastr";
import axios from "axios";
import Aside from "../components/aside";

//*****
// Ouvrir l'aside pour la page mon compte
//*****
Aside.manageAside('.btn-add-user', '.aside-add-user');

//*****
// Formulaire pour modifier un utilisateur
//*****
let forms = document.querySelectorAll('.user-form');
if(forms){
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            Validateur.hideErrors();

            let method = "PUT";
            let formId = form.dataset.id;
            let formClass = "." + form.dataset.id;

            let firstname = document.querySelector(formClass + '-firstname').value;
            let lastname = document.querySelector(formClass + '-lastname').value;
            let email = document.querySelector(formClass + '-email').value;
            let userTag = document.querySelector(formClass + '-userTag').value;
            let password = "";

            let paramsToValidate = [
                {type: "text", id: formId + '-firstname', value: firstname},
                {type: "text", id: formId + '-lastname', value: lastname},
                {type: "email", id: formId + '-email', value: email}
            ];

            if(formId === "create"){
                method = "POST";
                password = document.querySelector(formClass + '-password').value;
                let passwordConfirm = document.querySelector(formClass + '-passwordConfirm').value;

                paramsToValidate = [...paramsToValidate,
                    ...[{type: "password", id: formId + '-password', value: password, idCheck: formId + '-passwordConfirm', valueCheck: passwordConfirm}]
                ];
            }

            let validate = Validateur.validateur(paramsToValidate)

            if(!validate.code){
                toastr.warning("Veuillez vérifier les informations transmises.");
                Validateur.displayErrors(validate.errors);
            }else{
                Validateur.loader(true);
                axios(method, form.dataset.url, {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password,
                    userTag: userTag,
                    formFrom: formId
                })
                    .then(function (response) {
                        toastr.info(response.data);

                        if(formId === "create"){
                            location.reload();
                        }

                        if(formId === "main"){
                            let headerLogo = document.querySelector('.nav-header-logo-span');
                            headerLogo.innerHTML = firstname;

                            let cardFirstname = document.querySelector('.card-header-firstname');
                            let cardLastname = document.querySelector('.card-header-lastname');
                            cardFirstname.innerHTML = firstname;
                            cardLastname.innerHTML = lastname.toUpperCase();
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
    })
}