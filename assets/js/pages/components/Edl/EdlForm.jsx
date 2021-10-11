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

import { BienItem, PropertySelect }  from "./PropertySelect";
import { TenantItem, TenantsSelect } from "./TenantsSelect";
import { PropertyFormulaire }        from "../Property/PropertyForm";
import { TenantFormulaire }          from "../Tenant/TenantForm";

export function EdlFormulaire ({ type, element, oriUrl, users, currentUser, models, properties, tenants, propertyUrl, tenantUrl })
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
        propertyUrl={propertyUrl}
        tenantUrl={tenantUrl}
        users={JSON.parse(users)}
        models={JSON.parse(models)}
        allProperties={JSON.parse(properties)}
        allTenants={JSON.parse(tenants)}
        url={url}
        attribution={element ? element.inventory.user_id : currentUser}
        structure={(element && parseInt(element.inventory.input) !== 0) ? (parseInt(element.inventory.input) < 0 ? 1 : 2) : 0}
        startDate={element ? new Date(parseInt(element.inventory.date) * 1000) : ""}
        type={element ? element.inventory.type : 1}
        model={(element && parseInt(element.inventory.input) !== 0) ? parseInt(element.inventory.input) : ""}
        property={element ? element.property : null}
        tenants={element ? element.tenants : []}
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
            tenants: props.tenants,
            errors: [],
            success: false,
            asideBienType: "select",
            asideTenantsType: "select"
        }

        this.asideBien = React.createRef();
        this.asideBienSelect = React.createRef();
        this.asideTenants = React.createRef();
        this.asideTenantsSelect = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeDateStartDate = this.handleChangeDateStartDate.bind(this);

        this.handleOpenAsideBien = this.handleOpenAsideBien.bind(this);
        this.handleSetProperty = this.handleSetProperty.bind(this);

        this.handleOpenAsideTenants = this.handleOpenAsideTenants.bind(this);
        this.handleSetTenant = this.handleSetTenant.bind(this);
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
        if(property === null && this.asideBienSelect.current){
            this.asideBienSelect.current.handleSetElement(null);
        }
    }

    handleOpenAsideTenants = (type) => {
        this.setState({ asideTenantsType: type })
        let title = type === "select" ? "Sélectionner un/des locataire(s)" : "Ajouter un locataire";
        this.asideTenants.current.handleOpen(title)
    }

    handleSetTenant = (elem) => {
        const { tenants } = this.state;

        let newElements = [];
        if(tenants.includes(elem)){
            newElements = tenants.filter(el => {
                return el.reference !== elem.reference
            });
        }else{
            newElements = tenants
            newElements.push(elem);
        }

        this.setState({ tenants: newElements });
        if(this.asideTenantsSelect.current){
            this.asideTenantsSelect.current.handleSetTenants(newElements);
        }

        return newElements;
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
        const { context, users, models, allProperties, propertyUrl, allTenants, tenantUrl } = this.props;
        const { errors, success, attribution, structure, startDate, type, model, asideBienType, property, asideTenantsType, tenants } = this.state;

        let radioboxItems = [
            { value: 1, label: 'Entrant', identifiant: 'entrant' },
            { value: 0, label: 'Sortant', identifiant: 'sortant' }
        ]

        let structures = [{ value: 0, label: 'EDL Vierge',    identifiant: 'edl-vierge' }]

        if(models.length > 0){
            structures = [...structures, {value: 1, label: 'Etablir structure', identifiant: 'etablir-structure'}]
        }

        if(property && property.last_inventory_uid !== ""){
            structures = [...structures, {value: 2, label: 'EDL Précédent', identifiant: 'edl-precedent'}]
        }

        let asideBienContent = null, asideTenantsContent = null;
        if(asideBienType === "select"){
            asideBienContent = <PropertySelect ref={this.asideBienSelect} refAside={this.asideBien}
                                               onSetProperty={this.handleSetProperty} properties={allProperties}/>
        }else{
            asideBienContent = <PropertyFormulaire refAside={this.asideBien} oriUrl={propertyUrl} type="check" onSetProperty={this.handleSetProperty} />
        }

        if(asideTenantsType === "select"){
            asideTenantsContent = <TenantsSelect ref={this.asideTenantsSelect} refAside={this.asideTenants} elements={tenants}
                                                 onSetTenant={this.handleSetTenant} tenants={allTenants}/>
        }else{
            asideTenantsContent = <TenantFormulaire refAside={this.asideTenants} oriUrl={tenantUrl} type="check" onSetTenant={this.handleSetTenant} />
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

                <div className="line line-select-or-add">
                    <div className="form-group input-tenants">
                        <label>Locataire(s)</label>
                        <div className="actions-tenants select-or-add">
                            <Button outline={true} type="default"
                                    onClick={() => this.handleOpenAsideTenants("select")}>Sélectionner un/des locataire(s)</Button>
                            <Button outline={true} type="default"
                                    onClick={() => this.handleOpenAsideTenants("create")}>Ajouter un/des locataire(s)</Button>
                        </div>
                        {tenants.length !== 0 && <div className="selected selected-tenants active">
                            {tenants.map((elem, index) => {
                                return <div className="card active" key={index}>
                                    <div className="btn-remove">
                                        <div className="from" />
                                        <ButtonIcon icon="cancel" onClick={() => this.handleSetTenant(elem)}>Déselectionner ce locataire</ButtonIcon>
                                    </div>
                                    <TenantItem elem={elem} />
                                </div>
                            })}
                        </div>}
                        <div className="error">
                            <span className='icon-warning'/>
                            Veuillez sélectionner ou ajouter un/des locataire(s).
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
            <Aside ref={this.asideTenants} content={asideTenantsContent}/>
        </>
    }
}