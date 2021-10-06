function resizeMonthList () {
    let titles = document.querySelectorAll('.list-month .title');
    titles.forEach(el => {
        el.addEventListener('click' , function (e) {
            let icon = el.children[1].children[0];
            let items = el.parentElement.children[1];
            if(items){
                if(items.classList.contains('active')){
                    items.classList.remove('active');
                    icon.classList.remove('icon-minus')
                    icon.classList.add('icon-plus')
                }else{
                    items.classList.add('active');
                    icon.classList.remove('icon-plus')
                    icon.classList.add('icon-minus')
                }
            }
        })
    })
}

function details () {
    let btns = document.querySelectorAll('.btn-details');
    btns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            let icon = btn.children[0];
            let details = document.querySelectorAll('.item-' + btn.dataset.id + ' .details');

            if(btn.classList.contains('active')){
                btn.classList.remove('active');
                icon.classList.remove('icon-hide');
                icon.classList.add('icon-show');
                details.forEach(d => {
                    d.classList.remove('active');
                })
            }else{
                btn.classList.add('active');
                icon.classList.remove('icon-show');
                icon.classList.add('icon-hide');
                details.forEach(d => {
                    d.classList.add('active');
                })
            }
        })
    })
}

function removeItem (id) {
    let item = document.querySelector('.item-' + id);
    if(item){
        let parentItem = item.parentElement;
        item.remove();

        if(parentItem.children.length === 2){
            let parentParentItem = parentItem.parentElement;
            parentItem.remove();

            if(parentParentItem.children.length === 0){
                parentParentItem.insertAdjacentHTML('beforeend', '' +
                    '<div class="alert alert-default">' +
                    '   Aucun état des lieux enregistré.' +
                    '</div>');
            }
        }
    }
}

function hideItem (id) {
    let item = document.querySelector('.item-' + id);
    if(item){
        let parentItem = item.parentElement;
        item.style.display = "none";

        let atLeastOne = false;
        Array.from(parentItem.children).forEach(pI => {
            if(pI.classList.contains('item')){
                if(pI.style.display === "flex"){
                    atLeastOne = true;
                }
            }
        })

        if(!atLeastOne){
            let parentParentItem = parentItem.parentElement;
            let isExiste = false
            Array.from(parentParentItem.children).forEach(ppI => {
                if(ppI.classList.contains('result-none')){
                    isExiste = true;
                }
            })

            if(!isExiste){
                parentParentItem.insertAdjacentHTML('beforeend', '' +
                    '<div class="result-none alert alert-default">' +
                    '   Pour ce mois-ci, aucun résultat pour la recherche en cours.' +
                    '</div>');
            }
        }
    }
}

function initPagination () {
    // let paginations = document.querySelectorAll('.pagination');
    // if (paginations.length > 0) {
    //     paginations.forEach(pagination => {
    //         let id = pagination.dataset.id;
    //
    //         let btnsPage = document.querySelectorAll('.pagination-' + id + " .item-pagination");
    //
    //         if(btnsPage.length > 5){
    //             let i = 0;
    //             btnsPage.forEach(btnPage => {
    //                 if(i > 5){
    //                     btnPage.style.display = "none";
    //                 }
    //                 i++;
    //             });
    //
    //
    //         }
    //     })
    // }
}

function pagination () {
    let paginations = document.querySelectorAll('.pagination');
    if(paginations.length > 0){
        paginations.forEach(pagination => {
            let id = pagination.dataset.id;

            let btnsPage = document.querySelectorAll('.pagination-' + id + " .item-pagination");

            btnsPage.forEach(btn => {

                btn.addEventListener('click', function (e) {
                    let items = document.querySelectorAll('.inventories-' + id + " .item");

                    btnsPage.forEach(b => {
                        b.classList.remove('active');
                    })
                    btn.classList.add('active');

                    items.forEach(item => {
                        if(item.dataset.page === btn.dataset.page){
                            item.style.display = "flex";
                        }else{
                            item.style.display = "none";
                        }
                    })
                })
            })


        })
    }

}

module.exports = {
    resizeMonthList,
    removeItem,
    hideItem,
    details,
    initPagination,
    pagination
}