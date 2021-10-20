const axios = require("axios");
const toastr = require("toastr");

const Validateur = require("@dashboardComponents/functions/validateur");
const Formulaire = require("@dashboardComponents/functions/Formulaire");

function submitForm(self, context, url, messageSuccess, name) {
    let method = context === "create" ? "POST" : "PUT";

    self.setState({ success: false, errors: []})

    let paramsToValidate = [
        {type: "text", id: 'name', value: name},
    ];

    // validate global
    let validate = Validateur.validateur(paramsToValidate)
    if(!validate.code){
        toastr.warning("Veuillez vérifier les informations transmises.");
        self.setState({ errors: validate.errors });
    }else{
        Formulaire.loader(true);

        axios({ method: method, url: url, data: self.state })
            .then(function (response) {
                let data = response.data;
                self.props.onUpdateList(data);
                self.setState({
                    name: "",
                    success: messageSuccess,
                    errors: []
                });
            })
            .catch(function (error) {
                console.log(error)
                console.log(error.response)
                Formulaire.displayErrors(self, error);
            })
            .then(() => {
                Formulaire.loader(false);
            })
        ;
    }
}

function searchFunction(dataImmuable, search) {
    let newData = [];
    search = search.toLowerCase();
    newData = dataImmuable.filter(function(v) {
        if(v.name.toLowerCase().startsWith(search)){
            return v;
        }
    })

    return newData;
}

function filterFunction(dataImmuable, filters) {
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
    filterFunction,
    submitForm
}