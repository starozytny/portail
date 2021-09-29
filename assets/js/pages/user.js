import '../../css/pages/user.scss';
import Validateur from "../components/validateur";
import toastr from "toastr";
import axios from "axios";

//*****
// Formulaire pour modifier un utilisateur
//*****
let forms = document.querySelectorAll('.user-form');
if(forms){
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            Validateur.hideErrors();

            let formId = form.dataset.id;
            let isMain = formId === "main";

            let firstname = document.querySelector('.user-form-'+ formId +' .firstname').value;
            let lastname = document.querySelector('.user-form-'+ formId +' .lastname').value;
            let email = document.querySelector('.user-form-'+ formId +' .email').value;
            let userTag = document.querySelector('.user-form-'+ formId +' .userTag').value;
            let validate = Validateur.validateur([
                {type: "text", id: 'firstname', value: firstname},
                {type: "text", id: 'lastname', value: lastname},
                {type: "email", id: 'email', value: email}
            ])

            if(!validate.code){
                toastr.warning("Veuillez vérifier les informations transmises.");
                Validateur.displayErrors(validate.errors);
            }else{
                Validateur.loader(true);
                axios.put(form.dataset.url, {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    userTag: userTag,
                    main: isMain
                })
                    .then(function (response) {
                        toastr.info(response.data);

                        if(isMain){
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