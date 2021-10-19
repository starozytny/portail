const Sanitaze = require("@dashboardComponents/functions/sanitaze");

function getStringElement(data, id)
{
    let item = ""; let cat = "";
    data.forEach(el => {
        if(parseInt(el.id) === id){
            cat = Sanitaze.capitalize(el.category);
            item = Sanitaze.capitalize(el.name);
        }
    })

    return [parseInt(cat), item];
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
    getStringData
}