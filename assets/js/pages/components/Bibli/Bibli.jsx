import React, { Component } from "react";

import { Button } from "@dashboardComponents/Tools/Button";
import { Alert }  from "@dashboardComponents/Tools/Alert";

import { Keys }     from "./Keys";
import { Rooms }    from "./Rooms";
import { Aspects }  from "./Aspects";
import { Natures }  from "./Natures";
import { Counters } from "./Counters";
import { Elements } from "./Elements";

const URLParent = "bibliotheque/";
const URL = "bibliotheque/elements/";

export class Bibli extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: null,
            dataImmuable: JSON.parse(props.donnees)
        }

        this.handleChangeContext = this.handleChangeContext.bind(this);
    }

    handleChangeContext = (context) => { this.setState({ context }) }

    render () {
        const { context, dataImmuable } = this.state;

        let content;
        switch (context){
            case "elements":
                content = <Elements oriUrl={URLParent + "element"} data={dataImmuable.elements}
                                    categories={dataImmuable.categories}
                                    natures={dataImmuable.natures}
                                    elemsNatures={dataImmuable.element_natures}
                            />
                break;
            case "natures":
                content = <Natures oriUrl={URL + "nature"} data={dataImmuable.natures}/>
                break;
            case "aspects":
                content = <Aspects oriUrl={URL + "aspect"} data={dataImmuable.aspects}/>
                break;
            case "keys":
                content = <Keys oriUrl={URL + "key"} data={dataImmuable.keys}/>
                break;
            case "counters":
                content = <Counters oriUrl={URLParent + "counter"} data={dataImmuable.counters}/>
                break;
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
            {value: "natures",  label: "Natures"},
            {value: "aspects",  label: "Aspects"},
            {value: "elements", label: "Eléments"},
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
            {content}
        </>
    }
}