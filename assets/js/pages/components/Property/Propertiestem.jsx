import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

export class PropertiesItem extends Component {
    render () {
        const { elem, onDelete } = this.props

        return <div className="item">
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <div className="col-1">
                            <div className="name">
                                <span>{elem.reference}</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="owner">{elem.owner}</div>
                            <div className="fullAddress">
                                <div>{elem.addr1}</div>
                                <div>{elem.addr2}</div>
                                <div>{elem.addr3}</div>
                            </div>
                            <div>{elem.zipcode}{elem.zipcode && elem.city && ","} {elem.city}</div>
                        </div>
                        <div className="col-3">
                            {elem.type && <div className="sub">Type : {elem.type}</div>}
                            {elem.building && <div className="sub">Bâtiment : {elem.building}</div>}
                            {elem.door && <div className="sub">Porte : {elem.door}</div>}
                            {elem.surface > 0 && <div className="sub">{elem.surface} m²</div>}
                            {elem.rooms !== 0 && <div className="sub">{elem.rooms} {elem.rooms > 1 ? "pièces" : "pièce"}</div>}
                            {elem.floor !== 0 && <div className="sub">{elem.floor} {elem.floor > 1 ? "étages" : "étage"}</div>}
                            {elem.is_furnished && <div className="sub">Meublé</div>}
                        </div>
                        <div className="col-4 actions">
                            <ButtonIcon icon="compose" onClick={() => onDelete(elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="delete" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}