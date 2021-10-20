import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

export class TenantsItem extends Component {
    render () {
        const { rights, elem, onChangeContext, onDelete, inventories } = this.props

        let canActions = true;
        inventories.forEach(inventory => {
            if(inventory.tenants !== ""){
                JSON.parse(inventory.tenants).forEach(tenant => {
                    if(tenant === elem.reference){
                        canActions = false;
                    }
                })
                if(elem.is_imported !== "0" ){
                    canActions = false;
                }
            }
        })

        return <div className="item">
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <div className="col-1">
                            <div className="name">{elem.last_name.toUpperCase()} {elem.first_name}</div>
                            <TenantInfos2 elem={elem} />
                        </div>

                        <div className="col-2">
                            <div className="name">{elem.reference}</div>
                        </div>

                        <div className="col-3">
                            <TenantInfos1 elem={elem} />
                        </div>
                        <div className="col-4 actions">
                            {canActions ? (parseInt(rights) === 1 ? <>
                                <ButtonIcon icon="compose" onClick={() => onChangeContext('update', elem)}>Modifier</ButtonIcon>
                                <ButtonIcon icon="delete" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                            </> : <div className="role">Non autorisé</div>) : <div className="role">Utilisé</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export function TenantInfos1({ elem }) {
    return <>
        {(elem.addr1 || elem.addr2 || elem.addr3) && <div className="fullAddress">
            {elem.addr1 && <div className="sub">{elem.addr1}</div>}
            {elem.addr2 && <div className="sub">{elem.addr2}</div>}
            {elem.addr3 && <div className="sub">{elem.addr3}</div>}
        </div>}
        {(elem.zipcode || elem.city) && <div className="sub">
            {elem.zipcode}{elem.zipcode && elem.city ? "," : ""} {elem.city}
        </div>}
    </>
}

export function TenantInfos2({ elem }) {
    return <>
        <div className="sub">{elem.phone}</div>
        <div className="sub">{elem.email}</div>
    </>
}