import '../../css/pages/security.scss';

import Aside from '../components/aside';

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

let btnsLost = document.querySelectorAll('.btn-lost');
if(btnsLost){
    let aside = document.querySelector('.aside-lost');

    let overlay = document.querySelector('.aside-overlay');
    btnsLost.forEach(btnLost => {
        btnLost.addEventListener('click', function (e) { Aside.openCloseAside(aside) })
    })
    overlay.addEventListener('click', function (e) { Aside.openCloseAside(aside) })
}

