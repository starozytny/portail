import React, { Component } from 'react';

import axios            from "axios";
import toastr           from "toastr";

import { Input }        from "@dashboardComponents/Tools/Fields";
import { Button }       from "@dashboardComponents/Tools/Button";
import { Alert }        from "@dashboardComponents/Tools/Alert";
import Validateur       from "@dashboardComponents/functions/validateur";
import Formulaire       from "@dashboardComponents/functions/Formulaire";

export class Reinit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            passwordConfirm: "",
            errors: [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}); }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, urlLogin } = this.props;
        const { password, passwordConfirm } = this.state;

        this.setState({ success: false})

        // validate global
        let validate = Validateur.validateur([
            {type: "password", id: 'password', value: password, idCheck: 'passwordConfirm', valueCheck: passwordConfirm}
        ])

        // check validate success
        if(!validate.code){
            this.setState({ errors: validate.errors });
        }else{
            Formulaire.loader(true);
            let self = this;
            axios({ method: "PUT", url: url, data: self.state })
                .then(function (response) {
                    self.setState({  password: "", passwordConfirm: "", success: response.data.message, errors: [] });
                    if(context === "reinit"){
                        toastr.info('La page va se rafraichir dans quelques secondes.')
                        setTimeout(function (){
                            window.location.href = urlLogin
                        }, 5000)
                    }else{
                        Formulaire.loader(false);
                    }
                })
                .catch(function (error) {
                    Formulaire.loader(false);
                    Formulaire.displayErrors(self, error);
                })
            ;
        }
    }

    render () {
        const { errors, success, password, passwordConfirm } = this.state;

        return <>
            <h1>R??initialiser son mot de passe</h1>
            <div className="form">
                <form onSubmit={this.handleSubmit}>

                    {success !== false && <Alert type="info">{success}</Alert>}

                    {success === false && <>
                        <div className="line">
                            <div className="form-group">
                                <div className="password-rules">
                                    <p>R??gles de cr??ation de mot de passe :</p>
                                    <ul>
                                        <li>Au moins 8 caract??res</li>
                                        <li>Au moins 1 minuscule</li>
                                        <li>Au moins 1 majuscule</li>
                                        <li>Au moins 1 chiffre</li>
                                        <li>Au moins 1 caract??re sp??cial</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="line">
                            <Input type="password" valeur={password} identifiant="password" errors={errors} onChange={this.handleChange}>Mot de passe</Input>
                        </div>
                        <div className="line">
                            <Input type="password" valeur={passwordConfirm} identifiant="passwordConfirm" errors={errors} onChange={this.handleChange}>Confirmer le mot de passe</Input>
                        </div>
                        <div className="line">
                            <div className="form-button">
                                <Button isSubmit={true}>Modifier le mot de passe</Button>
                            </div>
                        </div>
                    </>}
                </form>
            </div>
        </>
    }
}