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

module.exports = {
    resizeMonthList
}