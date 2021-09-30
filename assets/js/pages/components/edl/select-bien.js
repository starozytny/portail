const Aside = require( "../../../components/aside");

function selectBien() {
    let btns = document.querySelectorAll('.list-select-bien .card');
    let btnRemove = document.querySelector('.btn-remove-bien');
    let actions = document.querySelector('.actions-bien');
    let input = document.querySelector('#bien');

    let selected = document.querySelector('.selected-bien');
    let selectedAdr = document.querySelector('.selected-bien .adr');
    let selectedZip = document.querySelector('.selected-bien .zipcode');
    let selectedCit = document.querySelector('.selected-bien .city');
    let selectedRef = document.querySelector('.selected-bien .ref');

    btns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            let currentActive = btn.classList.contains('active');

            removeBien();

            if(!currentActive){
                btn.classList.add('active');
                input.value = btn.dataset.id;

                actions.classList.remove('active');

                let bien = JSON.parse(btn.dataset.bien);
                selected.classList.add('active');
                selectedAdr.innerHTML = bien.addr1;
                selectedZip.innerHTML = bien.zipcode;
                selectedCit.innerHTML = bien.city;
                selectedRef.innerHTML = bien.reference;
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
            selectedZip.innerHTML = "";
            selectedCit.innerHTML = "";
            selectedRef.innerHTML = "";
        })
    }
}

module.exports = {
    selectBien
}