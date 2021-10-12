import React, { Component } from "react";

import { Button } from "@dashboardComponents/Tools/Button";
import { Alert }  from "@dashboardComponents/Tools/Alert";

import { Rooms }  from "./Rooms";

const URL = "bibliotheque/";

export class Bibli extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "rooms",
            dataImmuable: JSON.parse(props.donnees)
        }

        this.handleChangeContext = this.handleChangeContext.bind(this);
    }

    handleChangeContext = (context) => { this.setState({ context }) }

    render () {
        const { context, dataImmuable } = this.state;

        console.log(dataImmuable)

        let content;
        switch (context){
            case "rooms":
                content = <Rooms oriUrl={URL + "room"} data={dataImmuable.rooms}/>
                break;
            default:
                content = <Alert>Veuillez cliquer sur un bouton (ci-dessus) pour afficher une liste d'éléments.</Alert>
                break;
        }

        let menu = [
            {value: "rooms",    label: "Pièces"},
            {value: "keys",     label: "Clés"},
            {value: "counters", label: "Compteurs"},
            {value: "elements", label: "Elements"},
            {value: "natures",  label: "Natures"},
            {value: "aspects",  label: "Aspects"},
        ]

        return <>
            <div className="toolbar toolbar-menu">
                {menu.map((item, index) => {
                    let active = item.value === context;
                    return <div className="item" key={index}>
                        <Button outline={!active} type={active ? "color0" : "default"} onClick={() => this.handleChangeContext(item.value)}>{item.label}</Button>
                    </div>
                })}

            </div>
            <div className="items-table">
                <div className="items items-default">
                    {content}
                </div>
            </div>
        </>
    }
}