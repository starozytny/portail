import React, { Component } from "react";

import Sort from "@dashboardComponents/functions/sort";

import { Search } from "@dashboardComponents/Layout/Search";
import { Alert }  from "@dashboardComponents/Tools/Alert";
import SearchFunction  from "@pages/functions/search";

import { PropertyInfos1, PropertyInfos2 } from "@pages/components/Property/PropertiesItem";

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
            let newData = SearchFunction.searchProperty(dataImmuable, search);
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
                {items.length > 0 ? items : <Alert type="reverse">Il n'y a aucun bien enregistré.</Alert>}
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
                <PropertyInfos1 elem={elem}/>
            </div>
            <div>
                <PropertyInfos2 elem={elem}/>
            </div>
        </div>
    </>
}