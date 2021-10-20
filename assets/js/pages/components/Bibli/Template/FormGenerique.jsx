import React, {Component} from "react";

import Common       from "@pages/components/Bibli/functions/common";

import { Alert }    from "@dashboardComponents/Tools/Alert";
import { Input }    from "@dashboardComponents/Tools/Fields";
import { Button }   from "@dashboardComponents/Tools/Button";

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
        const { context, btnTextAdd, btnTextEdit } = this.props;
        const { errors, success, name } = this.state;

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange} >Intitulé</Input>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? btnTextAdd : btnTextEdit}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}