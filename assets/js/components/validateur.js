const toastr = require('toastr');

function validateDate($value) {
    if($value === "" || $value === null){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }
    return {'code': true};
}

function validateText($value) {
    if($value === ""){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }
    return {'code': true};
}

function validateEmail($value){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($value)){
        return {'code': true};
    }
    return {
        'code': false,
        'message': 'Cette adresse e-mail est invalide.'
    };
}

function validateEmailConfirm($value, $valueCheck){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($value)){

        if($value !== $valueCheck){
            return {
                'code': false,
                'isCheckError': true,
                'message': 'Les adresses e-mail ne sont pas identique.'
            };
        }

        return {'code': true};
    }
    return {
        'code': false,
        'message': 'Cette adresse e-mail est invalide.'
    };
}

function validatePassword($value, $valueCheck){
    if($value === ""){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }

    return {'code': true};

    if (/^(?=.{12,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\w).*$/.test($value)){

        if($value !== $valueCheck){
            return {
                'code': false,
                'isCheckError': true,
                'message': 'Les mots de passes ne sont pas identique.'
            };
        }

        return {'code': true};
    }else{
        return {
            'code': false,
            'message': 'Le mot de passe doit contenir 1 majuscule, 1 minuscule, 1 chiffre, 1 caratère spécial et au moins 12 caractères.'
        };
    }
}

function validateArray($value){
    if($value.length <= 0){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }
    return {'code': true};
}

function validateAtLeastOne($value, $valueCheck) {
    if($value === "" && $valueCheck === ""){
        return {
            'code': false,
            'message': 'Au moins un champ doit être renseigné.'
        };
    }
    return {'code': true};
}

function switchCase(element){
    let validate;
    switch (element.type) {
        case 'text':
            validate = validateText(element.value);
            break;
        case 'email':
            validate = validateEmail(element.value);
            break;
        case 'emailConfirm':
            validate = validateEmailConfirm(element.value, element.valueCheck);
            break;
        case 'array':
            validate = validateArray(element.value);
            break;
        case 'password':
            validate = validatePassword(element.value, element.valueCheck);
            break;
        case 'atLeastOne':
            validate = validateAtLeastOne(element.value, element.valueCheck);
            break;
        case 'date':
            validate = validateDate(element.value);
            break;
    }

    return validate;
}

function validateur(values, valuesIfExistes){
    let validate; let code = true;
    let errors = [];
    values.forEach(element => {
        validate = switchCase(element);
        if(!validate.code){
            code = false;
            errors.push({
                name: validate.isCheckError ? element.idCheck : element.id,
                message: validate.message
            })
        }
    });

    if(valuesIfExistes){
        valuesIfExistes.forEach(element => {
            if(element.value !== "" || element.value !== null){
                validate = switchCase(element);
                if(!validate.code){
                    code = false;
                    errors.push({
                        name: validate.isCheckError ? element.idCheck : element.id,
                        message: validate.message
                    })
                }
            }
        });
    }

    return {
        code: code,
        errors: errors
    };
}

function displayErrors(errors) {
    errors.forEach(error => {
        let err = document.querySelector('.input-' + error.name);
        let errMsg = document.querySelector('.input-' + error.name + ' > .error p');
        if(err){
            err.classList.add('form-group-error');
            errMsg.innerHTML = error.message;
        }
    })
}

function hideErrors() {
    let formGroups = document.querySelectorAll('.form-group');
    if(formGroups){
        formGroups.forEach(elem => {
            elem.classList.remove('form-group-error');
        })
    }
}

function handleErrors(error, message="Veuillez vérifier les informations transmises."){
    if(Array.isArray(error.response.data)){
        toastr.error(message);
        displayErrors(error.response.data);
    }else{
        if(error.response.data){
            toastr.error(error.response.data)
        }else{
            toastr.error(message);
        }
    }
}

function loader(status){
    let loader = document.querySelector('#loader');
    if(status){
        loader.style.display = "flex";
    }else{
        loader.style.display = "none";
    }
}

module.exports = {
    validateur,
    displayErrors,
    hideErrors,
    handleErrors,
    loader
}