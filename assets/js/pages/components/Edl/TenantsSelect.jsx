import React, { Component } from "react";

import Sort from "@dashboardComponents/functions/sort";

import { Search } from "@dashboardComponents/Layout/Search";

function searchFunction(dataImmuable, search){
    let newData = [];
    search = search.toLowerCase();
    newData = dataImmuable.filter(function(v) {
        if(v.reference.toLowerCase().startsWith(search)
            || v.addr1.toLowerCase().startsWith(search)
            || v.last_name.toLowerCase().startsWith(search)
            || v.first_name.toLowerCase().startsWith(search)
        ){
            return v;
        }
    })

    return newData;
}

export class TenantsSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            elements: props.elements,
            dataImmuable: props.tenants,
            data: props.tenants
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleSetTenants = this.handleSetTenants.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleClick = (elem) => {
        let newElements = this.props.onSetTenant(elem);
        this.setState({ elements: newElements });
    }

    handleSetTenants = (tenants) => {
        this.setState({ elements: tenants })
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
        const { elements, data } = this.state;

        let items = [];
        if(data){
            data.sort(Sort.compareReference)
            data.forEach(elem => {
                let active = elements.includes(elem) ? " active" : ""

                items.push(<div className={"card" + active} key={elem.id} onClick={() => this.handleClick(elem)}>
                    <TenantItem elem={elem} />
                </div>)
            })
        }

        return <div className="list-select">
            <div className="toolbar">
                <div className="item filter-search">
                    <Search onSearch={this.handleSearch} />
                </div>
            </div>
            <div className="cards">
                {items.length > 0 ? items : <div>Il n'y a aucun locataire enregistré.</div>}
            </div>
        </div>
    }
}

export function TenantItem ({ elem }) {
    return <>
        <div className="card-header">
            <div className="title">
                <div className="label">
                    <div>{elem.last_name.toUpperCase()} {elem.first_name}</div>
                </div>
                <div className="ref">Ref : {elem.reference}</div>
            </div>
        </div>
        <div className="card-body">
            <div>
                {(elem.addr1 || elem.addr2 || elem.addr3) && <div className="fullAdresse">
                    {elem.addr1 && <div className="sub">{elem.addr1}</div>}
                    {elem.addr2 && <div className="sub">{elem.addr2}</div>}
                    {elem.addr3 && <div className="sub">{elem.addr3}</div>}
                </div>}
                {elem.zipcode || elem.city && <div className="sub">
                    {elem.zipcode}{elem.zipcode && elem.city ? ", " : ""}{elem.city}
                </div>}
            </div>
            <div>
                {elem.phone && <div className="sub">{elem.phone}</div>}
                {elem.email && <div className="sub">{elem.email}</div>}
            </div>
        </div>
    </>
}