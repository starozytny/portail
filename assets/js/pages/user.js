import '../../css/pages/user.scss';

import axios    from "axios";
import toastr   from "toastr";
import Swal     from "sweetalert2";

import Aside        from "../components/functions/aside";
import Validateur   from "../components/functions/validateur";
import SwalOptions  from "../components/functions/swalOptions";

//*****
// Ouvrir l'aside add user
//*****
Aside.manageAside('.btn-add-user', '.aside-add-user');

//*****
// Ouvrir l'aside edit user and set data form
//*****
initAsideEdit('.btn-edit-user', '.aside-edit-user');
function initAsideEdit(btnsClass, asideClasse) {
    let btns = document.querySelectorAll(btnsClass);
    if(btns){
        let aside = document.querySelector(asideClasse);
        let overlay = document.querySelector(asideClasse + ' .aside-overlay');
        let btnClose = document.querySelector(asideClasse + ' .btn-edit-user-close');

        btns.forEach(btn => {
            btn.addEventListener('click', function (e) {

                // data user
                let user = JSON.parse(btn.dataset.user);

                // set title aside
                let asideTitle = document.querySelector(asideClasse + ' .title');
                asideTitle.innerHTML = "Modifier " + user.first_name + " " + user.last_name.toUpperCase();

                // set url form
                let asideForm = document.querySelector(asideClasse + " .user-form");
                asideForm.setAttribute('data-url', btn.dataset.url);

                // set value aside form
                document.querySelector('.edit-username').value = user.username;
                document.querySelector('.edit-firstname').value = user.first_name;
                document.querySelector('.edit-lastname').value = user.last_name;
                document.querySelector('.edit-email').value = user.email;
                document.querySelector('.edit-userTag').value = user.user_tag;

                Aside.openCloseAside(aside)
            })
        })
        overlay.addEventListener('click', function (e) { Aside.openCloseAside(aside) })
        btnClose.addEventListener('click', function (e) { Aside.openCloseAside(aside) })
    }
}


//*****
// Formulaire pour supprimer un utilisateur
//*****
let btnsDelete = document.querySelectorAll('.btn-delete');
if(btnsDelete){
    btnsDelete.forEach(btnDelete => {
        btnDelete.addEventListener('click', function (e) {
            e.preventDefault();

            Swal.fire(SwalOptions.options("Supprimer cet utilisateur ?", "Cette action est irr??versible."))
                .then((result) => {
                    if (result.isConfirmed) {
                        axios.delete(btnDelete.dataset.url, {})
                            .then(function (response) {
                                let item = document.querySelector('.item-' + btnDelete.dataset.id);
                                if(item){
                                    item.remove();
                                    toastr.info(response.data);
                                }
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

//*****
// Formulaire pour ajouter/modifier un utilisateur
//*****
let forms = document.querySelectorAll('.user-form');
if(forms){
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            Validateur.hideErrors();

            let formId = form.dataset.id;
            let formClass = "." + form.dataset.id;

            let method = formId === "create" ? "POST" : "PUT";

            // get data input
            let username = document.querySelector(formClass + '-username').value;
            let firstname = document.querySelector(formClass + '-firstname').value;
            let lastname = document.querySelector(formClass + '-lastname').value;
            let email = document.querySelector(formClass + '-email').value;
            let userTag = document.querySelector(formClass + '-userTag').value;
            let password = document.querySelector(formClass + '-password').value;
            let passwordConfirm = document.querySelector(formClass + '-passwordConfirm').value;

            // validate data
            let paramsToValidate = [
                {type: "text", id: formId + '-firstname', value: firstname},
                {type: "text", id: formId + '-lastname', value: lastname},
                {type: "email", id: formId + '-email', value: email}
            ];
            if(formId === "create" || password !== ""){
                paramsToValidate = [...paramsToValidate,
                    ...[{type: "password", id: formId + '-password', value: password, idCheck: formId + '-passwordConfirm', valueCheck: passwordConfirm}]
                ];
            }
            let validate = Validateur.validateur(paramsToValidate)

            if(!validate.code){
                toastr.warning("Veuillez v??rifier les informations transmises.");
                Validateur.displayErrors(validate.errors);
            }else{
                //send data ajax
                Validateur.loader(true);
                let formData = {
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password,
                    userTag: userTag,
                    formFrom: formId
                };
                axios({method: method, url: form.dataset.url, data: formData})
                    .then(function (response) {
                        if(formId === "create"){
                            toastr.info(response.data);
                            location.reload();
                        }

                        if(formId === "edit"){
                            toastr.info("Donn??es mises ?? jour");
                            updateEditUser(response.data)
                        }

                        if(formId === "main"){
                            toastr.info("Donn??es mises ?? jour");
                            updateMainUser(firstname, lastname)
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                        console.log(error.response)
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

//*****
// Fonction pour mettre a jour l'actuel utilisateur sans rafraichir la page
//*****
function updateMainUser(firstname, lastname) {
    let headerLogo = document.querySelector('.nav-header-logo-span');
    headerLogo.innerHTML = firstname;

    let cardFirstname = document.querySelector('.card-header-firstname');
    let cardLastname = document.querySelector('.card-header-lastname');
    cardFirstname.innerHTML = firstname;
    cardLastname.innerHTML = lastname.toUpperCase();
}

//*****
// Fonction pour mettre a jour l'item utilisateur (view) sans rafraichir la page
//*****
function updateEditUser(data) {
    let itemClass = '.item-' + data.id;
    let item = document.querySelector(itemClass);
    if(item){
        document.querySelector(itemClass + " .col-1").innerHTML = data.username;
        document.querySelector(itemClass + " .col-2 > div:first-child").innerHTML = data.first_name.replaceAll('\\', '') + " " + data.last_name.replaceAll('\\', '').toUpperCase();
        document.querySelector(itemClass + " .col-2 > div:last-child").innerHTML = data.user_tag;

        // reset data of btn
        document.querySelector(itemClass + " .btn-edit-user").setAttribute('data-user', JSON.stringify(data));
    }

    Aside.closeAside('.aside-edit-user');
}