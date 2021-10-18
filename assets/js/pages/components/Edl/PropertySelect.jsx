import React, { Component } from "react";

import Sort from "@dashboardComponents/functions/sort";

import { Search } from "@dashboardComponents/Layout/Search";

function searchFunction(dataImmuable, search){
    let newData = [];
    search = search.toLowerCase();
    newData = dataImmuable.filter(function(v) {
        if(v.reference.toLowerCase().startsWith(search)
            || v.addr1.toLowerCase().startsWith(search)
            || v.zipcode.toLowerCase().startsWith(search)
            || v.city.toLowerCase().startsWith(search)
            || v.owner.toLowerCase().startsWith(search)
        ){
            return v;
        }
    })

    return newData;
}

export class PropertySelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            element: null,
            dataImmuable: props.properties,
            data: props.properties
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleSetElement = this.handleSetElement.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleClick = (elem) => {
        this.setState({element: elem});
        this.props.onSetProperty(elem);
        this.props.refAside.current.handleClose();
    }

    handleSetElement = (elem) => {
        this.setState({element: elem});
    }

    handleSearch = (search) => {
        const { dataImmuable } = this.state;

        if(search === "") {
            this.setState({ data: dataImmuable });
        }else{
            let newData = searchFunction(dataImmuable, search);
            this.setState({ data: newData });
        }
    }

    render () {
        const { element, data } = this.state;

        let items = [];
        if(data){
            data.sort(Sort.compareReference)
            data.forEach(elem => {
                let active = elem === element ? " active" : ""

                items.push(<div className={"card" + active} key={elem.id} onClick={() => this.handleClick(elem)}>
                    <BienItem elem={elem} />
                </div>)
            })
        }

        return <div className="list-select">
            <div className="toolbar">
                <div className="item filter-search">
                    <Search onSearch={this.handleSearch} placeholder="Recherche par référence, adresse, code postal, ville ou propriétaire..."/>
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