function update(context, data, element, dataImmuable, currentData){
    let newData = [];
    let newDataImmuable = [];
    let newCurrentData = [];

    switch (context){
        case "delete_group":
            //element is a group's user
            newData = deleteGroup(element, data, newData);
            newDataImmuable = deleteGroup(element, dataImmuable, newDataImmuable);
            currentData = deleteGroup(element, currentData, newCurrentData);
            break;
        case "delete":
            newData = data.filter(el => el.id !== element.id);
            newDataImmuable = dataImmuable.filter(el => el.id !== element.id);
            newCurrentData = currentData.filter(el => el.id !== element.id);
            break;
        case "update":
            newData = updateData(element, data, newData);
            newDataImmuable = updateData(element, dataImmuable, newDataImmuable);
            newCurrentData = updateData(element, currentData, newCurrentData);
            break;
        default:
            newData = defaultAction(element, data, newData);
            newDataImmuable = defaultAction(element, dataImmuable, newDataImmuable);
            newCurrentData = defaultAction(element, currentData, newCurrentData);
            break;
    }

    return [newData, newDataImmuable, newCurrentData];
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