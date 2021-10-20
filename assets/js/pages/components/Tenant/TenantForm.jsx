import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";

import { Input }               from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@dashboardComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";
import Sanitaze                from "@dashboardComponents/functions/sanitaze";

export function TenantFormulaire ({ type, onChangeContext, onUpdateList, element, oriUrl, onSetTenant, refAside })
{
    let full = true;
    let title = "Ajouter un locataire";
    let url = oriUrl;
    let msg = "Vous avez ajouté un nouveau locataire !"

    if(type === "update"){
        title = "Modifier " + element.reference;
        url = oriUrl + "/" + element.id;
        msg = "La mise à jour s'est réalisée avec succès !";
    }

    if(type === "check"){
        full = false;
        url = oriUrl + "-check";
    }

    let form = <TenantForm
        context={type}
        url={url}
        reference={element ? element.reference : ""}
        addr1={element ? element.addr1 : ""}
        addr2={element ? element.addr2 : ""}
        addr3={element ? element.addr3 : ""}
        zipcode={element ? element.zipcode : ""}
        city={element ? element.city : ""}
        lastname={element ? element.last_name : ""}
        firstname={element ? element.first_name : ""}
        phone={element ? element.phone : ""}
        email={element ? element.email : ""}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        onSetTenant={onSetTenant}
        refAside={refAside}
        messageSuccess={msg}
    />

    return <FormLayout full={full} onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class TenantForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reference: props.reference,
            addr1: props.addr1,
            addr2: props.addr2,
            addr3: props.addr3,
            zipcode: props.zipcode,
            city: props.city,
            lastname: props.lastname,
            firstname: props.firstname,
            phone: props.phone,
            email: props.email,
            errors: [],
            success: false,
            arrayPostalCode: [],
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangePostalCodeCity = this.handleChangePostalCodeCity.bind(this);
    }

    componentDidMount = () => { if(this.state.arrayPostalCode.length === 0) Sanitaze.getPostalCodes(this); }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangePostalCodeCity = (e) => {
        const { arrayPostalCode } = this.state;

        Sanitaze.setCityFromZipcode(this, e, arrayPostalCode)
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { reference, addr1, addr2, addr3, zipcode, city, lastname, firstname, phone, email } = this.state;

        this.setState({ success: false, errors: []})
        let method = context !== "update" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text",   id: 'reference',   value: reference},
            {type: "text",   id: 'lastname',    value: lastname},
            {type: "text",   id: 'firstname',   value: firstname},
            {type: "length", id: 'reference',   value: reference,   min: 0, max: 5},
            {type: "length", id: 'addr1',       value: addr1,       min: 0, max: 80},
            {type: "length", id: 'addr2',       value: addr2,       min: 0, max: 40},
            {type: "length", id: 'addr3',       value: addr3,       min: 0, max: 40},
            {type: "length", id: 'zipcode',     value: zipcode,     min: 0, max: 5},
            {type: "length", id: 'city',        value: city,        min: 0, max: 40},
            {type: "length", id: 'door',        value: lastname,    min: 0, max: 80},
            {type: "length", id: 'floor',       value: firstname,   min: 0, max: 80},
            {type: "length", id: 'typeBien',    value: phone,       min: 0, max: 15},
            {type: "length", id: 'building',    value: email,       min: 0, max: 80},
        ];

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
                    if(context !== "check"){
                        self.props.onUpdateList(data);
                        self.setState({ success: messageSuccess, errors: [] });

                        if(context === "create"){
                            self.setState({
                                reference: "",
                                addr1: "",
                                addr2: "",
                                addr3: "",
                                zipcode: "",
                                city: "",
                                lastname: "",
                                firstname: "",
                                phone: "",
                                email: "",
                            });
                        }
                    }else{
                        self.props.onSetTenant(data);
                        self.props.refAside.current.handleClose();
                    }
                })
                .catch(function (error) {
                    Formulaire.displayErrors(self, error);
                })
                .then(() => {
                    Formulaire.loader(false);
                })
            ;
        }
    }

    render () {
        const { context } = this.props;
        const { errors, success, reference, addr1, addr2, addr3, zipcode, city, lastname, firstname, phone, email } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Input valeur={reference} identifiant="reference" errors={errors} onChange={this.handleChange} >Référence * (5 caractères max)</Input>
                </div>

                <div className="line line-2">
                    <Input valeur={lastname} identifiant="lastname" errors={errors} onChange={this.handleChange} >Nom *</Input>
                    <Input valeur={firstname} identifiant="firstname" errors={errors} onChange={this.handleChange} >Prénom *</Input>
                </div>

                <div className="line line-2">
                    <Input valeur={phone} identifiant="phone" errors={errors} onChange={this.handleChange} >Téléphone</Input>
                    <Input valeur={email} identifiant="email" errors={errors} onChange={this.handleChange} type="email">Email</Input>
                </div>

                <div className="line" />
                <div className="line" />

                <div className="line line-3">
                    <Input valeur={addr1} identifiant="addr1" errors={errors} onChange={this.handleChange} >Adresse</Input>
                    <Input valeur={addr2} identifiant="addr2" errors={errors} onChange={this.handleChange} >Adresse (suite)</Input>
                    <Input valeur={addr3} identifiant="addr3" errors={errors} onChange={this.handleChange} >Adresse (suite)</Input>
                </div>

                <div className="line line-3">
                    <Input valeur={zipcode} identifiant="zipcode" errors={errors} onChange={this.handleChangePostalCodeCity} type="number">Code postal</Input>
                    <Input valeur={city} identifiant="city" errors={errors} onChange={this.handleChange} >Ville</Input>
                    <div className="form-group"/>
                </div>

                <p className="form-infos">
                    (*) Champs obligatoires.
                </p>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context !== "update" ? "Ajouter ce locataire" : 'Modifier ce locataire'}</Button>
                    </div>
                </div>
            </form>

        </>
    }
}