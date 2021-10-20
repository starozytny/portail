import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

export class PropertiesItem extends Component {
    render () {
        const { rights, elem, onChangeContext, onDelete, inventories } = this.props

        let canActions = true;
        inventories.forEach(inventory => {
            if(inventory.property_uid === elem.uid || elem.is_imported !== "0" || elem.last_inventory_uid !== "0" || elem.last_inventory_uid !== "" ){
                canActions = false;
            }
        })

        return <div className="item">
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <div className="col-1">
                            <div className="fullAddress">
                                <div className="semibold">{elem.addr1}</div>
                                <div>{elem.addr2}</div>
                                <div>{elem.addr3}</div>
                            </div>
                            <div>{elem.zipcode}{elem.zipcode && elem.city && ","} {elem.city}</div>
                            <div className="owner">{elem.owner}</div>
                        </div>

                        <div className="col-2">
                            <div className="name">
                                <span>{elem.reference}</span>
                            </div>
                        </div>

                        <div className="col-3">
                            {elem.type && <div className="sub">Type : {elem.type}</div>}
                            {elem.building && <div className="sub">Bâtiment : {elem.building}</div>}
                            {elem.door && <div className="sub">Porte : {elem.door}</div>}
                            {parseFloat(elem.surface) > 0 && <div className="sub">{elem.surface} m²</div>}
                            {parseInt(elem.rooms) !== 0 && <div className="sub">{elem.rooms} {parseInt(elem.rooms) > 1 ? "pièces" : "pièce"}</div>}
                            {elem.floor !== "" && parseInt(elem.floor) !== 0 && <div className="sub">
                                {elem.floor} {parseInt(elem.floor )> 1 ? "étages" : "étage"}
                            </div>}
                            {(elem.is_furnished && parseInt(elem.is_furnished) !== 0) && <div className="sub">Meublé</div>}
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