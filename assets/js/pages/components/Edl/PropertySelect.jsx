import React, { Component } from "react";

import Sort from "@dashboardComponents/functions/sort";

export class PropertySelect extends Component {
    constructor(props) {
        super();

        this.state = {
            element: null
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleSetElement = this.handleSetElement.bind(this);
    }

    handleClick = (elem) => {
        this.setState({element: elem});
        this.props.onSetProperty(elem);
        this.props.refAside.current.handleClose();
    }

    handleSetElement = (elem) => {
        this.setState({element: elem});
    }

    render () {
        const { properties } = this.props;
        const { element } = this.state;

        let items = [];
        if(properties){
            properties.sort(Sort.compareReference)
            properties.forEach(elem => {
                let active = elem === element ? " active" : ""

                items.push(<div className={"card" + active} key={elem.id} onClick={() => this.handleClick(elem)}>
                    <BienItem elem={elem} />
                </div>)
            })
        }

        return <div className="list-select">
            <div className="toolbar">
                <div className="line">
                    <div>Search</div>
                </div>
            </div>
            <div className="cards">
                {items.length > 0 ? items : <div>Il n'y a aucun bien enregistré.</div>}
            </div>
        </div>
    }
}

export function BienItem ({ elem }) {
    return <>
        <div className="card-header">
            <div className="title">
                <div className="address">
                    <div>{elem.addr1}</div>
                    <div>{elem.addr2}</div>
                    <div>{elem.addr3}</div>
                    <div className="sub">{elem.zipcode}, {elem.city}</div>
                </div>
                <div className="ref">Ref : {elem.reference}</div>
            </div>
        </div>
        <div className="card-body">
            <div>
                {elem.type && <div className="sub">Type : {elem.type}</div>}
                {elem.building && <div className="sub">Bâtiment : {elem.building}</div>}
                {elem.door && <div className="sub">Porte : {elem.door}</div>}
                {(elem.is_furnished && parseInt(elem.is_furnished) !== 0) && <div className="sub">Meublé</div>}
            </div>
            <div>
                {parseFloat(elem.surface) > 0 && <div className="sub">{elem.surface} m²</div>}
                {(parseInt(elem.rooms) !== 0 && elem.rooms !== "") && <div className="sub">{elem.rooms} {parseInt(elem.rooms) > 1 ? "pièces" : "pièce"}</div>}
                {elem.floor !== "" && parseInt(elem.floor) !== 0 && <div className="sub">
                    {elem.floor} {parseInt(elem.floor )> 1 ? "étages" : "étage"}
                </div>}
            </div>
        </div>
    </>
}