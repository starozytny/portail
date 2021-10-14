import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";

import { Input }               from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@dashboardComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

export function UserFormulaire ({ type, onChangeContext, onUpdateList, element, oriUrl })
{
    let full = false;
    let url = oriUrl;
    let msg = "Vous avez ajouté un nouveau utilisateur !"

    if(type === "update"){
        url = oriUrl + "/" + element.id;
        msg = "La mise à jour s'est réalisée avec succès !";
    }

    let form = <UserForm
        context={type}
        url={url}
        firstname={element ? element.first_name : ""}
        lastname={element ? element.last_name : ""}
        email={element ? element.email : ""}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
    />

    return <FormLayout full={full} onChangeContext={onChangeContext} form={form} />
}

export class UserForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstname: props.firstname,
            lastname: props.lastname,
            email: props.email,
            password: "",
            passwordConfirm: "",
            errors: [],
            success: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { firstname, lastname, email, password, passwordConfirm } = this.state;

        this.setState({ success: false, errors: [] })
        let method = context !== "update" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text",   id: 'firstname',   value: firstname},
            {type: "text",   id: 'lastname',    value: lastname},
            {type: "text",   id: 'email',       value: email},
        ];

        if(context === "create" || (context === "update" && password !== "")){
            paramsToValidate = [...paramsToValidate,
                ...[{type: "password", id: 'password', value: password, idCheck: 'passwordConfirm', valueCheck: passwordConfirm}]
            ];
        }

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            toastr.warning("Veuillez vérifier les informations transmises.");
            this.setState({ errors: validate.errors });
        }else{
            Formulaire.loader(true);
            let self = this;

            axios({ method: method, url: url, data: this.state})
                .then(function (response) {
                    let data = response.data;
                    location.reload();
                    toastr.info(messageSuccess);
                })
                .catch(function (error) {
                    Formulaire.loader(false);
                    Formulaire.displayErrors(self, error);
                })
            ;
        }
    }

    render () {
        const { context } = this.props;
        const { errors, success, firstname, lastname, email } = this.state;

        return <>
            <form className="form" onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Input valeur={firstname} identifiant="firstname" errors={errors} onChange={this.handleChange} >Prénom</Input>
                </div>

                <div className="line">
                    <Input valeur={lastname} identifiant="lastname" errors={errors} onChange={this.handleChange} >Nom</Input>
                </div>

                <div className="line">
                    <Input valeur={email} identifiant="email" errors={errors} onChange={this.handleChange} type="email" >Email</Input>
                </div>

                {context !== "create" && <div className="line">
                    <div className="form-group">
                        <Alert type="reverse">Laissez le champ MOT DE PASSE vide si vous ne souhaitez pas changer de mot de passe.</Alert>
                    </div>
                </div>}

                <div className="line">
                    <div className="form-group">
                        <div className="password-rules">
                            <p>Règles de création de mot de passe :</p>
                            <ul>
                                <li>Au moins 8 caractères</li>
                                <li>Au moins 1 minuscule</li>
                                <li>Au moins 1 majuscule</li>
                                <li>Au moins 1 chiffre</li>
                                <li>Au moins 1 caractère spécial</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="line">
                    <Input valeur={email} identifiant="email" errors={errors} onChange={this.handleChange} type="email" >Mot de passe</Input>
                </div>

                <div className="line">
                    <Input valeur={email} identifiant="email" errors={errors} onChange={this.handleChange} type="email" >Confirmer le mot de passe</Input>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true} type={context !== "update" ? "primary": "warning"}>
                            {context !== "update" ? "Ajouter cet utilisateur" : 'Modifier cet utilisateur'}
                        </Button>
                    </div>
                </div>
            </form>

        </>
    }
}