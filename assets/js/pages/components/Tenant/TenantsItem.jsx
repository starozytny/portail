import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

export class TenantsItem extends Component {
    render () {
        const { elem, onChangeContext, onDelete } = this.props

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
                            <ButtonIcon icon="compose" onClick={() => onChangeContext('update', elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="delete" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}