import React, { Component } from "react";

import { Button } from "@dashboardComponents/Tools/Button";

export class FormLayout extends Component{
    render() {
        const { onChangeContext, children, form } = this.props;

        return <div>
            <div className="toolbar">
                <div className="item">
                    <Button outline={true} icon="arrow-left" type="default" onClick={() => onChangeContext("list")}>Retour à la liste</Button>
                </div>
            </div>

            <div className="form">
                {children && <h2>{children}</h2>}
                {form}
            </div>
        </div>
    }
}