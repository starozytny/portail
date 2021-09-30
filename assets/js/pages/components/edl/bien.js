function addBienSelected (bien) {
    let selected = document.querySelector('.selected-bien');
    let selectedAdr = document.querySelector('.selected-bien .adr');
    let selectedZip = document.querySelector('.selected-bien .zipcode');
    let selectedCit = document.querySelector('.selected-bien .city');
    let selectedRef = document.querySelector('.selected-bien .ref');

    selected.classList.add('active');
    selectedAdr.innerHTML = bien.addr1;
    selectedZip.innerHTML = bien.zipcode;
    selectedCit.innerHTML = bien.city;
    selectedRef.innerHTML = bien.reference;
}

module.exports = {
    addBienSelected
}