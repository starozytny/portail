import React, {Component} from "react";

import Common         from "@pages/components/Bibli/functions/common";

import { Alert }      from "@dashboardComponents/Tools/Alert";
import { Input }      from "@dashboardComponents/Tools/Fields";
import { Button }     from "@dashboardComponents/Tools/Button";
import { FormLayout } from "@dashboardComponents/Layout/Elements";

export function FormFormulaire ({ type, onChangeContext, onUpdateList, element, oriUrl, addTxt="", addMsgTxt="" })
{
    let title = "Ajouter " + addTxt;
    let url = oriUrl;
    let msg = "Félicitation ! Vous avez ajouté "+ addMsgTxt +" !"

    if(type === "update"){
        title = "Modifier " + element.name;
        url = oriUrl + "/" + element.id;
        msg = "La mise à jour s'est réalisée avec succès !";
    }

    let form = <FormGenerique
        context={type}
        url={url}
        name={element ? element.name : ""}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
        btnText={title}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class FormGenerique extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
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
        const { name } = this.state;

        Common.submitForm(this, context, url, messageSuccess, name);
    }

    render () {
        const { btnText } = this.props;
        const { errors, success, name } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange} >Intitulé</Input>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{btnText}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}