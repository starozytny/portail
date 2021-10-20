import '../css/app.scss';

import toastr from 'toastr';

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
    "escapeHtml": false
}

let navMobile = document.querySelector('.nav-mobile');
if(navMobile){
    navMobile.addEventListener("click", function (e) {
        let navMobileIcon = document.querySelector('.nav-mobile > span');
        let navBody = document.querySelector('.nav-body');

        if(navBody.classList.contains('true')){
            navBody.classList.remove('true');
            navMobileIcon.classList.remove('icon-cancel');
            navMobileIcon.classList.add('icon-menu');
        }else{
            navBody.classList.add('true');
            navMobileIcon.classList.add('icon-cancel');
            navMobileIcon.classList.remove('icon-menu');
        }
    })
}