import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";

import { Radiobox, Input }     from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button, ButtonIcon }  from "@dashboardComponents/Tools/Button";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@dashboardComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";
import Sanitaze                from "@dashboardComponents/functions/sanitaze";

import {Aside} from "@dashboardComponents/Tools/Aside";
import {SelectRoom} from "./SelectRoom";

export function ModeleFormulaire ({ type, onChangeContext, onUpdateList, element, oriUrl, library })
{
    let full = true;
    let title = "Ajouter un modèle";
    let url = oriUrl;
    let msg = "Vous avez ajouté un nouveau modèle !"

    if(type === "update"){
        title = "Modifier " + element.name;
        url = oriUrl + "/" + element.id;
        msg = "La mise à jour s'est réalisée avec succès !";
    }

    let form = <ModeleForm
        context={type}
        url={url}
        name={element ? element.name : ""}
        content={element ? JSON.parse(element.content) : []}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        library={library}
        messageSuccess={msg}
    />

    return <FormLayout full={full} onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class ModeleForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            content: props.content,
            errors: [],
            success: false,
            errorContent: ""
        }

        this.asideRooms = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAsideRooms = this.handleAsideRooms.bind(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleAsideRooms = () => {
        this.asideRooms.current.handleOpen();
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { name, content } = this.state;

        this.setState({ success: false, errors: []})
        let method = context !== "update" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text",   id: 'name',   value: name},
            {type: "array",   id: 'content',   value: content},
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
        const { context, library } = this.props;
        const { errors, errorContent, success, name, content } = this.state;

        let asideRooms = <SelectRoom content={content} data={library}/>

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange} >Intitulé</Input>
                </div>

                <div className="line line-select-or-add">
                    <div className={"form-group input-bien" + errorContent}>
                        <label>Pièce(s)</label>
                        <div className="actions-bien select-or-add">
                            <Button outline={true} type="default" onClick={this.handleAsideRooms}>Sélectionner une/des pièce(s)</Button>
                        </div>
                        <div className="error">
                            <span className='icon-warning'/>
                            Veuillez ajouter au moins une pièce.
                        </div>
                    </div>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context !== "update" ? "Ajouter ce modèle" : 'Modifier ce modèle'}</Button>
                    </div>
                </div>
            </form>
            <Aside ref={this.asideRooms} content={asideRooms} >Sélectionner une/des pièce(s)</Aside>
        </>
    }
}