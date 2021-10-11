import React, { Component } from "react";

import Sort from "@dashboardComponents/functions/sort";

export class TenantsSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            elements: props.elements
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleSetTenants = this.handleSetTenants.bind(this);
    }

    handleClick = (elem) => {
        let newElements = this.props.onSetTenant(elem);
        this.setState({ elements: newElements });
    }

    handleSetTenants = (tenants) => {
        this.setState({ elements: tenants })
    }

    render () {
        const { tenants } = this.props;
        const { elements } = this.state;

        let items = [];
        if(tenants){
            tenants.sort(Sort.compareReference)
            tenants.forEach(elem => {
                let active = elements.includes(elem) ? " active" : ""

                items.push(<div className={"card" + active} key={elem.id} onClick={() => this.handleClick(elem)}>
                    <TenantItem elem={elem} />
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