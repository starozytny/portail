import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";

import { Radiobox, Input }     from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";

import Validateur              from "@dashboardComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

export function EdlFormulaire ({ type, element, oriUrl})
{
    let url = oriUrl;
    let msg = "Vous avez ajouté un nouveau état des lieux !"

    if(type === "update"){
        url = oriUrl + "/" + element.id;
        msg = "La mise à jour s'est réalisé avec succès !";
    }

    let form = <EdlForm
        context={type}
        url={url}
        reference={element ? element.reference : ""}
        messageSuccess={msg}
    />

    return <div className="form">{form}</div>
}

export class EdlForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reference: props.reference,
            errors: [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { reference } = this.state;

        this.setState({ success: false, errors: []})
        let method = context === "create" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text",   id: 'reference',   value: reference},
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            toastr.warning("Veuillez vérifier les informations transmises.");
            this.setState({ errors: validate.errors });
        }else{
            // Formulaire.loader(true);
            // let self = this;
            //
            // axios({ method: method, url: url, data: this.state})
            //     .then(function (response) {
            //         let data = response.data;
            //         location.reload();
            //     })
            //     .catch(function (error) {
            //         console.log(error)
            //         console.log(error.response)
            //         Formulaire.displayErrors(self, error);
            //     })
            //     .then(() => {
            //         Formulaire.loader(false);
            //     })
            // ;
        }
    }

    render () {
        const { context } = this.props;
        const { errors, success, reference } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Input valeur={reference} identifiant="reference" errors={errors} onChange={this.handleChange} >Référence</Input>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? "Ajouter cet état des lieux" : 'Modifier cet état des lieux'}</Button>
                    </div>
                </div>
            </form>

        </>
    }
}