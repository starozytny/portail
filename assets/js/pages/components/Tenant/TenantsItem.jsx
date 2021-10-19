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
                    <div className="infos infos-col-3">
                        <div className="col-1">
                            <div className="name">{elem.last_name.toUpperCase()} {elem.first_name}</div>
                            <div className="sub"><span>{elem.reference}</span></div>
                        </div>

                        <div className="col-2">
                            <div className="fullAddress">
                                <div>{elem.addr1}</div>
                                <div>{elem.addr2}</div>
                                <div>{elem.addr3}</div>
                            </div>
                            <div className="fullAddress">{elem.zipcode}{elem.zipcode && elem.city && ","} {elem.city}</div>
                            <div>{elem.phone}</div>
                            <div>{elem.email}</div>
                        </div>
                        <div className="col-3 actions">
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