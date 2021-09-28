import '../../css/pages/security.scss';

let btnSeePassword = document.querySelector('.btn-see-password');
if(btnSeePassword){
    let seePassword = false;
    let inputSeePassword = document.querySelector('#password');
    btnSeePassword.addEventListener('click', function (e){
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