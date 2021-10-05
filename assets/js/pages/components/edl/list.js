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

function removeItem (id) {
    let item = document.querySelector('.item-' + id);
    if(item){
        let parentItem = item.parentElement;
        item.remove();
        console.log(parentItem.children)

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

module.exports = {
    resizeMonthList,
    removeItem,
    hideItem
}