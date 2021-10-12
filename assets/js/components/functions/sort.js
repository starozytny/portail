function compareLabel(a, b){
    return comparison(a.label.toLowerCase(), b.label.toLowerCase());
}

function compareName(a, b){
    return comparison(a.name.toLowerCase(), b.name.toLowerCase());
}

function compareFirstname(a, b){
    return comparison(a.firstname.toLowerCase(), b.firstname.toLowerCase());
}

function compareLastname(a, b){
    return comparison(a.lastname.toLowerCase(), b.lastname.toLowerCase());
}

function compareLast_name(a, b){
    return comparison(a.last_name.toLowerCase(), b.last_name.toLowerCase());
}

function compareUsername(a, b){
    return comparison(a.username.toLowerCase(), b.username.toLowerCase());
}

function compareTitle(a, b){
    return comparison(a.title.toLowerCase(), b.title.toLowerCase());
}

function compareReference(a, b){
    return comparison(a.reference.toLowerCase(), b.reference.toLowerCase());
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
    compareLast_name,
    compareFirstname,
    compareTitle,
    compareName,
    compareLabel,
    compareReference
}