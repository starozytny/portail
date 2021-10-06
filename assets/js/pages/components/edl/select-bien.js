const Aside = require("../../../components/aside");
const Selected  = require("./selected");

function selectBien() {
    let btns = document.querySelectorAll('.list-select-bien .card');
    let btnRemove = document.querySelector('.btn-remove-bien');
    let actions = document.querySelector('.actions-bien');
    let input = document.querySelector('#bien');

    let selected = document.querySelector('.selected-bien');
    let selectedAdr = document.querySelector('.selected-bien .adr');
    let selectedAd2 = document.querySelector('.selected-bien .adr2');
    let selectedAd3 = document.querySelector('.selected-bien .adr3');
    let selectedZip = document.querySelector('.selected-bien .zipcode');
    let selectedCit = document.querySelector('.selected-bien .city');
    let selectedRef = document.querySelector('.selected-bien .ref');
    let selectedTyp = document.querySelector('.selected-bien .typeBien');
    let selectedOwn = document.querySelector('.selected-bien .owner');
    let selectedSur = document.querySelector('.selected-bien .surface');
    let selectedRoo = document.querySelector('.selected-bien .room');
    let selectedFlo = document.querySelector('.selected-bien .floor');
    let selectedDoo = document.querySelector('.selected-bien .door');
    let selectedFur = document.querySelector('.selected-bien .is_furnished');

    btns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            let currentActive = btn.classList.contains('active');

            removeBien();

            if(!currentActive){
                btn.classList.add('active');
                input.value = btn.dataset.id;

                actions.classList.remove('active');

                Selected.addBienSelected(JSON.parse(btn.dataset.bien), "server")
            }

            Aside.closeAside('.aside-select-bien');
        });

        btnRemove.addEventListener('click', function (e) {
            removeBien();
        });
    })

    function removeBien() {
        btns.forEach(elem => {
            elem.classList.remove('active');
            input.value = "";

            actions.classList.add('active');

            selected.classList.remove('active');
            selectedAdr.innerHTML = "";
            selectedAd2.innerHTML = "";
            selectedAd3.innerHTML = "";
            selectedZip.innerHTML = "";
            selectedCit.innerHTML = "";
            selectedRef.innerHTML = "";
            selectedTyp.innerHTML = "";
            selectedOwn.innerHTML = "";
            selectedSur.innerHTML = "";
            selectedRoo.innerHTML = "";
            selectedFlo.innerHTML = "";
            selectedDoo.innerHTML = "";
            selectedFur.innerHTML = "";
        })
    }
}

module.exports = {
    selectBien
}