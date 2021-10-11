import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";

import { Radiobox, Select }    from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button }              from "@dashboardComponents/Tools/Button";
import { DateTimePick }        from "@dashboardComponents/Tools/DatePicker";

import Validateur              from "@dashboardComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";

export function EdlFormulaire ({ type, element, oriUrl, users, currentUser, models })
{
    let url = oriUrl;
    let msg = "Vous avez ajouté un nouveau état des lieux !"

    element = element ? JSON.parse(element) : null;

    if(type === "update"){
        url = oriUrl + "/" + element.inventory.id;
        msg = "La mise à jour s'est réalisé avec succès !";
    }

    console.log(element)

    let form = <EdlForm
        context={type}
        users={users}
        models={models}
        url={url}
        attribution={element ? element.inventory.user_id : currentUser}
        structure={(element && parseInt(element.inventory.input) !== 0) ? (parseInt(element.inventory.input) < 0 ? 1 : 2) : 0}
        startDate={element ? new Date(parseInt(element.inventory.date) * 1000) : ""}
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
            errors: [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleChangeDateStartDate = this.handleChangeDateStartDate.bind(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeDateStartDate = (e) => { this.setState({ startDate: e }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { attribution, structure } = this.state;

        this.setState({ success: false, errors: []})
        let method = context === "create" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text",   id: 'attribution',     value: attribution},
            {type: "text",   id: 'structure',       value: structure},
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
        const { context, users, models } = this.props;
        const { errors, success, attribution, structure, startDate } = this.state;


        let structures = [
            { value: 0, label: 'EDL Vierge',    identifiant: 'edl-vierge' },
            { value: 2, label: 'EDL Précédent', identifiant: 'edl-precedent' },
        ]

        if(JSON.parse(models).length > 0){
            structures = [...structures, {value: 1, label: 'Etablir structure', identifiant: 'etablir-structure'}]
        }

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line line-3">
                    <Select items={JSON.parse(users)} identifiant="attribution" valeur={attribution} errors={errors} onChange={this.handleChange}>Attribution</Select>
                    <Select items={structures} identifiant="structure" valeur={structure} errors={errors} onChange={this.handleChange}>Structure</Select>
                    <DateTimePick identifiant="startDate" valeur={startDate} errors={errors} onChange={this.handleChangeDateStartDate} minDate={new Date()}>
                        Prévu le (facultatif)
                    </DateTimePick>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true} type={context === "create" ? "primary" : "warning"}>
                            {context === "create" ? "Ajouter cet état des lieux" : 'Modifier cet état des lieux'}
                        </Button>
                    </div>
                </div>
            </form>

        </>
    }
}