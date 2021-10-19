function searchFunction(dataImmuable, search){
    let newData = [];
    search = search.toLowerCase();
    newData = dataImmuable.filter(function(v) {
        if(v.name.toLowerCase().startsWith(search)){
            return v;
        }
    })

    return newData;
}

function filterFunction(dataImmuable, filters){
    let newData = [];
    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            filters.forEach(filter => {
                if(filter === 0){
                    if(el.is_native === "0" && el.is_used === "0"){
                        newData.filter(elem => elem.id !== el.id)
                        newData.push(el);
                    }
                }else{
                    if(el.is_native === "1" || el.is_used === "1"){
                        newData.filter(elem => elem.id !== el.id)
                        newData.push(el);
                    }
                }
            })
        })
    }

    return newData;
}

module.exports = {
    searchFunction,
    filterFunction
}