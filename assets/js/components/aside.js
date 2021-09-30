function manageAside(btnsClass, asideClasse) {
    let btns = document.querySelectorAll(btnsClass);
    if(btns.length !== 0){
        let aside = document.querySelector(asideClasse);
        let overlay = document.querySelector(asideClasse + ' .aside-overlay');

        btns.forEach(btn => {
            btn.addEventListener('click', function (e) { openCloseAside(aside) })
        })
        overlay.addEventListener('click', function (e) { openCloseAside(aside) })
    }
}

function openCloseAside(aside) {
    if(aside.classList.contains('true')){
        aside.classList.remove('true');
    }else{
        aside.classList.add('true');
    }
}

function closeAside(aside) {
    if(aside.classList.contains('true')){
        aside.classList.remove('true');
    }
}

module.exports = {
    manageAside,
    openCloseAside,
    closeAside
}