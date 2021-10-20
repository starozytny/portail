function searchProperty(dataImmuable, search){
    let newData = [];
    search = search.toLowerCase();
    newData = dataImmuable.filter(function(v) {
        if(v.reference.toLowerCase().startsWith(search)
            || v.addr1.toLowerCase().startsWith(search)
            || v.zipcode.toLowerCase().startsWith(search)
            || v.city.toLowerCase().startsWith(search)
            || v.owner.toLowerCase().startsWith(search)
        ){
            return v;
        }
    })

    return newData;
}


module.exports = {
    searchProperty
}