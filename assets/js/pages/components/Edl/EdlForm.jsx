import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";

import { Radiobox, Select }    from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button, ButtonIcon }  from "@dashboardComponents/Tools/Button";
import { DateTimePick }        from "@dashboardComponents/Tools/DatePicker";
import { Aside }               from "@dashboardComponents/Tools/Aside";

import Validateur              from "@dashboardComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

import {BienItem, PropertySelect} from "./PropertySelect";

export function EdlFormulaire ({ type, element, oriUrl, users, currentUser, models, properties })
{
    let url = oriUrl;
    let msg = "Vous avez ajouté un nouveau état des lieux !"

    element = element ? JSON.parse(element) : null;

    if(type === "update"){
        url = oriUrl + "/" + element.inventory.id;
        msg = "La mise à jour s'est réalisé avec succès !";
    }

    let form = <EdlForm
        context={type}
        users={JSON.parse(users)}
        models={JSON.parse(models)}
        properties={JSON.parse(properties)}
        url={url}
        attribution={element ? element.inventory.user_id : currentUser}
        structure={(element && parseInt(element.inventory.input) !== 0) ? (parseInt(element.inventory.input) < 0 ? 1 : 2) : 0}
        startDate={element ? new Date(parseInt(element.inventory.date) * 1000) : ""}
        type={element ? element.inventory.type : 1}
        model={(element && parseInt(element.inventory.input) !== 0) ? parseInt(element.inventory.input) : ""}
        property={element ? element.property : null}
        messageSuccess={msg}
    />

    return <div className="form">{form}</div>
}

export class EdlForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            attribution: props.attribution,
            structure: props.structure,
            startDate: props.startDate,
            type: props.type,
            model: props.model,
            property: props.property,
            errors: [],
            success: false,
            asideBienType: "select"
        }

        this.asideBien = React.createRef();
        this.asideBienSelect = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeDateStartDate = this.handleChangeDateStartDate.bind(this);

        this.handleOpenAsideBien = this.handleOpenAsideBien.bind(this);
        this.handleSetProperty = this.handleSetProperty.bind(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeDateStartDate = (e) => { this.setState({ startDate: e }) }

    handleOpenAsideBien = (type) => {
        this.setState({ asideBienType: type })
        let title = type === "select" ? "Sélectionner un bien" : "Ajouter un bien";
        this.asideBien.current.handleOpen(title)
    }

    handleSetProperty = (property) => {
        this.setState({ property });
        if(property === null){
            this.asideBienSelect.current.handleSetElement(null);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { attribution, structure, type, model, property } = this.state;

        this.setState({ success: false, errors: []})
        let method = context === "create" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text",   id: 'attribution',     value: attribution},
            {type: "text",   id: 'structure',       value: structure},
            {type: "text",   id: 'type',            value: type},
            {type: "text",   id: 'property',        value: property},
        ];


        //if structure = ? model

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
        const { context, users, models, properties } = this.props;
        const { errors, success, attribution, structure, startDate, type, model, asideBienType, property } = this.state;

        let radioboxItems = [
            { value: 1, label: 'Entrant', identifiant: 'entrant' },
            { value: 0, label: 'Sortant', identifiant: 'sortant' }
        ]

        let structures = [
            { value: 0, label: 'EDL Vierge',    identifiant: 'edl-vierge' },
            { value: 2, label: 'EDL Précédent', identifiant: 'edl-precedent' },
        ]

        if(models.length > 0){
            structures = [...structures, {value: 1, label: 'Etablir structure', identifiant: 'etablir-structure'}]
        }


        let asideBienContent = null;
        if(asideBienType === "select"){
            asideBienContent = <PropertySelect ref={this.asideBienSelect} refAside={this.asideBien}
                                               onSetProperty={this.handleSetProperty} properties={properties}/>
        }else{
            asideBienContent = <div>Create</div>
        }

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-select-or-add">
                    <div className="form-group input-bien">
                        <label>Bien</label>
                        {property ? <div className="selected selected-bien active">
                                <div className="card active">
                                    <div className="btn-remove">
                                        <div className="from" />
                                        <ButtonIcon icon="cancel" onClick={() => this.handleSetProperty(null)}>Déselectionner ce bien</ButtonIcon>
                                    </div>
                                    <BienItem elem={property} />
                                </div>
                            </div> :
                            <div className="actions-bien select-or-add">
                                <Button outline={true} type="default"
                                        onClick={() => this.handleOpenAsideBien("select")}>Sélectionner un bien</Button>
                                <Button outline={true} type="default"
                                        onClick={() => this.handleOpenAsideBien("create")}>Ajouter un bien</Button>
                            </div>
                        }
                        <div className="error">
                            <span className='icon-warning'/>
                            Veuillez sélectionner ou ajouter un bien.
                        </div>
                    </div>
                </div>

                <div className="line line-3">
                    <Select items={users} identifiant="attribution" valeur={attribution} errors={errors} onChange={this.handleChange}>Attribution</Select>
                    <Select items={structures} identifiant="structure" valeur={structure} errors={errors} onChange={this.handleChange}>Structure</Select>
                    <DateTimePick identifiant="startDate" valeur={startDate} errors={errors} onChange={this.handleChangeDateStartDate} minDate={new Date()}>
                        Prévu le (facultatif)
                    </DateTimePick>
                </div>

                <div className="line line-3">
                    <Radiobox items={radioboxItems} identifiant="type" valeur={type} errors={errors} onChange={this.handleChange}>Type d'état des lieux</Radiobox>
                    {parseInt(structure) === 1 ?
                        <Select items={models} identifiant="model" valeur={model} errors={errors} onChange={this.handleChange}>Modèle</Select>
                        : <div className="form-group" />}
                    <div className="form-group" />
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true} type={context === "create" ? "primary" : "warning"}>
                            {context === "create" ? "Ajouter cet état des lieux" : 'Modifier cet état des lieux'}
                        </Button>
                    </div>
                </div>
            </form>
            <Aside ref={this.asideBien} content={asideBienContent}/>
        </>
    }
}