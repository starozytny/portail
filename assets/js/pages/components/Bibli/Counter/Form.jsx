import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";

import { Input }               from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";

import Validateur              from "@dashboardComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

export function CounterFormulaire ({ type, onChangeContext, onUpdateList, element, oriUrl })
{
    let title = "Ajouter un compteur";
    let url = oriUrl;
    let msg = "Félicitation ! Vous avez ajouté un nouveau compteur !"

    if(type === "update"){
        title = "Modifier " + element.name;
        url = oriUrl + "/" + element.id;
        msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <CounterForm
        context={type}
        url={url}
        name={element ? element.name : ""}
        unit={element ? element.unit : ""}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class CounterForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            unit: props.unit,
            errors: [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        this.setState({[e.currentTarget.name]: e.currentTarget.value})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { name, unit } = this.state;

        let method = context === "create" ? "POST" : "PUT";
        this.setState({ success: false, errors: []})

        let paramsToValidate = [
            {type: "text", id: 'name', value: name},
            {type: "text", id: 'unit', value: unit},
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            toastr.warning("Veuillez vérifier les informations transmises.");
            this.setState({ errors: validate.errors });
        }else{
            Formulaire.loader(true);
            let self = this;

            axios({ method: method, url: url, data: this.state })
                .then(function (response) {
                    let data = response.data;
                    toastr.info(messageSuccess);
                    location.reload();
                })
                .catch(function (error) {
                    console.log(error)
                    console.log(error.response)
                    Formulaire.loader(false);
                    Formulaire.displayErrors(self, error);
                })
            ;
        }
    }

    render () {
        const { context } = this.props;
        const { errors, success, name, unit } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-2">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange} >Intitulé</Input>
                    <Input valeur={unit} identifiant="unit" errors={errors} onChange={this.handleChange} >Unité</Input>
                </div>
                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? "Ajouter ce compteur" : 'Modifier ce compteur'}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}