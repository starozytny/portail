import React, { Component } from "react";

import Sort             from "@dashboardComponents/functions/sort";
import SearchFunction   from "@pages/functions/search";

import { Search }       from "@dashboardComponents/Layout/Search";
import { Alert }        from "@dashboardComponents/Tools/Alert";

import { TenantInfos1, TenantInfos2 } from "@pages/components/Tenant/TenantsItem";

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
            let newData = SearchFunction.searchTenant(dataImmuable, search);
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
                    <Search onSearch={this.handleSearch} placeholder="Recherche par référence, adresse, prénom ou nom..."/>
                </div>
            </div>
            <div className="cards">
                {items.length > 0 ? items : <Alert type="reverse">Il n'y a aucun locataire enregistré.</Alert>}
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
                <TenantInfos1 elem={elem} />
            </div>
            <div>
                <TenantInfos2 elem={elem} />
            </div>
        </div>
    </>
}