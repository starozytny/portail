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

        if(parentItem.children.length === 0){
            let toDelete = parentItem.parentElement.parentElement;
            toDelete.remove();
        }
    }
}

function initPagination () {
    let id = localStorage.getItem('edlPagination');
    if(id){
        let item = document.querySelector('.item-' + id);
        if(item){
            let idPagination = item.dataset.pagination;

            let btnsPage = document.querySelectorAll('.pagination-' + idPagination + " .item-pagination");
            let btn = document.querySelector('.pagination-' + idPagination + ' .item-pagination[data-page="'+item.dataset.page+'"]')
            if(btn){
                setActivePagination(btnsPage, btn, idPagination);

                let items = document.querySelector('.list-month-' + idPagination + " .items")
                items.classList.add('active');

                localStorage.setItem('edlPagination', null)
            }
        }
    }
}

function pagination () {
    let paginations = document.querySelectorAll('.pagination');
    if(paginations.length > 0){
        paginations.forEach(pagination => {
            let id = pagination.dataset.id;

            let btnsPage = document.querySelectorAll('.pagination-' + id + " .item-pagination");

            btnsPage.forEach(btn => {

                btn.addEventListener('click', function (e) {
                    setActivePagination(btnsPage, btn, id);
                })
            })
        })
    }
}

function setActivePagination(btnsPage, btn, id) {
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
}

function comeback () {
    let btn = document.querySelector('.comeback');
    if(btn){
        btn.addEventListener("click", function (e) {
            let id = btn.dataset.id;
            localStorage.setItem('edlPagination', id);

            location.href = btn.dataset.url;
        })
    }
}

module.exports = {
    resizeMonthList,
    removeItem,
    details,
    initPagination,
    pagination,
    comeback
}