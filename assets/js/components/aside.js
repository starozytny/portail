function openCloseAside(aside) {
    if(aside.classList.contains('true')){
        aside.classList.remove('true');
    }else{
        aside.classList.add('true');
    }
}

module.exports = {
    openCloseAside
}