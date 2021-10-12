import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";

import { Radiobox, Input }     from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@dashboardComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";
import Sanitaze                from "@dashboardComponents/functions/sanitaze";

export function PropertyFormulaire ({ type, onChangeContext, onUpdateList, element, oriUrl, onSetProperty, refAside })
{
    let full = true;
    let title = "Ajouter un bien";
    let url = oriUrl;
    let msg = "Vous avez ajouté un nouveau bien !"

    if(type === "update"){
        title = "Modifier " + element.reference;
        url = oriUrl + "/" + element.id;
        msg = "La mise à jour s'est réalisée avec succès !";
    }

    if(type === "check"){
        full = false;
        url = oriUrl + "-check";
    }

    let form = <PropertyForm
        context={type}
        url={url}
        reference={element ? element.reference : ""}
        addr1={element ? element.addr1 : ""}
        addr2={element ? element.addr2 : ""}
        addr3={element ? element.addr3 : ""}
        zipcode={element ? element.zipcode : ""}
        city={element ? element.city : ""}
        typeBien={element ? element.type : ""}
        owner={element ? element.owner : ""}
        building={element ? element.building : ""}
        surface={element ? element.surface : 0}
        rooms={element ? element.rooms : 0}
        floor={element ? element.floor : 0}
        door={element ? element.door : ""}
        isFurnished={element ? parseInt(element.is_furnished) : 0}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        onSetProperty={onSetProperty}
        refAside={refAside}
        messageSuccess={msg}
    />

    return <FormLayout full={full} onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class PropertyForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reference: props.reference,
            addr1: props.addr1,
            addr2: props.addr2,
            addr3: props.addr3,
            zipcode: props.zipcode,
            city: props.city,
            typeBien: props.typeBien,
            owner: props.owner,
            building: props.building,
            surface: props.surface,
            rooms: props.rooms,
            floor: props.floor,
            door: props.door,
            isFurnished: props.isFurnished,
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
        const { reference, addr1, addr2, addr3, zipcode, city, typeBien, owner, building, floor, door, isFurnished } = this.state;

        this.setState({ success: false, errors: []})
        let method = context !== "update" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text",   id: 'reference',   value: reference},
            {type: "text",   id: 'addr1',       value: addr1},
            {type: "text",   id: 'city',        value: city},
            {type: "text",   id: 'zipcode',     value: zipcode},
            {type: "text",   id: 'isFurnished', value: isFurnished},
            {type: "length", id: 'reference',   value: reference,   min: 0, max: 10},
            {type: "length", id: 'addr1',       value: addr1,       min: 0, max: 64},
            {type: "length", id: 'addr2',       value: addr2,       min: 0, max: 64},
            {type: "length", id: 'addr3',       value: addr3,       min: 0, max: 64},
            {type: "length", id: 'zipcode',     value: zipcode,     min: 0, max: 10},
            {type: "length", id: 'city',        value: city,        min: 0, max: 64},
            {type: "length", id: 'door',        value: door,        min: 0, max: 20},
            {type: "length", id: 'floor',       value: floor,       min: 0, max: 20},
            {type: "length", id: 'typeBien',    value: typeBien,    min: 0, max: 20},
            {type: "length", id: 'building',    value: building,    min: 0, max: 40},
            {type: "length", id: 'owner',       value: owner,       min: 0, max: 32},
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
                        location.reload();
                        toastr.info(messageSuccess);
                    }else{
                        Formulaire.loader(false);
                        self.props.onSetProperty(data);
                        self.props.refAside.current.handleClose();
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
        const { context } = this.props;
        const { errors, success, reference, addr1, addr2, addr3, zipcode, city, typeBien, owner, building,
            floor, door, rooms, surface, isFurnished } = this.state;

        let radioboxItems = [
            { value: 1, label: 'Meublé', identifiant: 'meuble' },
            { value: 0, label: 'Non meublé', identifiant: 'non-meuble' }
        ]

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Input valeur={reference} identifiant="reference" errors={errors} onChange={this.handleChange} >Référence * (10 caractères max)</Input>
                </div>

                <div className="line" />
                <div className="line" />

                <div className="line line-3">
                    <Input valeur={addr1} identifiant="addr1" errors={errors} onChange={this.handleChange} >Adresse *</Input>
                    <Input valeur={addr2} identifiant="addr2" errors={errors} onChange={this.handleChange} >Adresse (suite)</Input>
                    <Input valeur={addr3} identifiant="addr3" errors={errors} onChange={this.handleChange} >Adresse (suite)</Input>
                </div>

                <div className="line line-3">
                    <Input valeur={building} identifiant="building" errors={errors} onChange={this.handleChange} >Bâtiment</Input>
                    <Input valeur={zipcode} identifiant="zipcode" errors={errors} onChange={this.handleChangePostalCodeCity} type="number">Code postal *</Input>
                    <Input valeur={city} identifiant="city" errors={errors} onChange={this.handleChange} >Ville *</Input>
                </div>

                <div className="line line-3">
                    <Input valeur={typeBien} identifiant="typeBien" errors={errors} onChange={this.handleChange} >Type de bien</Input>
                    <Input valeur={owner} identifiant="owner" errors={errors} onChange={this.handleChange} >Propriétaire</Input>
                    <div className="form-group"/>
                </div>

                <div className="line" />
                <div className="line" />

                <div className="line line-3">
                    <Input valeur={surface} identifiant="surface" errors={errors} onChange={this.handleChange} type="number">Surface m²</Input>
                    <Input valeur={rooms} identifiant="rooms" errors={errors} onChange={this.handleChange} type="number">Nombre de pièces</Input>
                    <Radiobox items={radioboxItems} identifiant="isFurnished" valeur={isFurnished} errors={errors} onChange={this.handleChange}>Le bien est ?</Radiobox>
                </div>

                <div className="line line-3">
                    <Input valeur={floor} identifiant="floor" errors={errors} onChange={this.handleChange}>Etage</Input>
                    <Input valeur={door} identifiant="door" errors={errors} onChange={this.handleChange} >Porte</Input>
                    <div className="form-group"/>
                </div>

                <p className="form-infos">
                    (*) Champs obligatoires.
                </p>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context !== "update" ? "Ajouter ce bien" : 'Modifier ce bien'}</Button>
                    </div>
                </div>
            </form>

        </>
    }
}