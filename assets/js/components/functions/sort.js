function compareLabel(a, b){
    return comparison(a.label, b.label);
}

function compareName(a, b){
    return comparison(a.name, b.name);
}

function compareFirstname(a, b){
    return comparison(a.firstname, b.firstname);
}

function compareLastname(a, b){
    return comparison(a.lastname, b.lastname);
}

function compareUsername(a, b){
    return comparison(a.username, b.username);
}

function compareTitle(a, b){
    return comparison(a.title, b.title);
}

function comparison (objA, objB){
    let comparison = 0;
    if (objA > objB) {
        comparison = 1;
    } else if (objA < objB) {
        comparison = -1;
    }
    return comparison;
}

module.exports = {
    comparison,
    compareUsername,
    compareLastname,
    compareFirstname,
    compareTitle,
    compareName,
    compareLabel
}