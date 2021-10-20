function update(context, data, element){
    let newData = [];

    switch (context){
        case "delete_group":
            //element is a group's user
            newData = deleteGroup(element, data, newData);
            break;
        case "delete":
            newData = data.filter(el => el.id !== element.id);
            break;
        case "update":
            newData = updateData(element, data, newData);
            break;
        default:
            newData = defaultAction(element, data, newData);
            break;
    }

    return newData;
}

function deleteGroup (element, data, newData){
    data.forEach(el => {
        if(!element.includes(el.id)){
            newData.push(el);
        }
    })
    return newData;
}

function updateData (element, data, newData) {
    data.forEach(el => {
        if(el.id === element.id){
            el = element;
        }
        newData.push(el);
    })
    return newData;
}

function defaultAction (element, data, newData) {
    newData = data ? data : [];
    newData.push(element);
    return newData;
}

module.exports = {
    update
}