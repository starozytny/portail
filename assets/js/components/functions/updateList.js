function update(context, data, element){
    let newData = [];

    switch (context){
        case "delete_group":
            //element is a group's user
            data.forEach(el => {
                if(!element.includes(el.id)){
                    newData.push(el);
                }
            })
            break;
        case "delete":
            newData = data.filter(el => el.id !== element.id);
            break;
        case "update":
            data.forEach(el => {
                if(el.id === element.id){
                    el = element;
                }
                newData.push(el);
            })
            break;
        default:
            newData = data ? data : [];
            newData.push(element);
            break;
    }

    return newData;
}

module.exports = {
    update
}