const Sanitaze = require("@dashboardComponents/functions/sanitaze");

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

function getStringElement(data, id)
{
    let item = "", cat = 0, itemId = 0;
    data.elements.forEach(el => {
        if(parseInt(el.id) === id){
            cat = parseInt(el.category);
            item = Sanitaze.capitalize(el.name);
            itemId = parseInt(el.id);
        }
    })

    return [cat, item, itemId];
}

function getStringData(data, id)
{
    let item = "";
    data.forEach(el => {
        if(parseInt(el.id) === id){
            item = Sanitaze.capitalize(el.name);
        }
    })

    return item;
}

module.exports = {
    getStringElement,
    getStringData,
    searchFunction
}