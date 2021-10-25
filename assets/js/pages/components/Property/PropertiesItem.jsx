import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

export class PropertiesItem extends Component {
    render () {
        const { rights, elem, onChangeContext, onDelete, inventories } = this.props

        let canActions = true;
        inventories.forEach(inventory => {
            if(inventory.property_uid === elem.uid || elem.is_imported !== "0" || elem.last_inventory_uid !== "0" || elem.last_inventory_uid === "" ){
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
                            <div className="owner">Propriétaire : {elem.owner ? elem.owner : "Non renseigné"}</div>
                        </div>

                        <div className="col-2">
                            <div className="name">
                                <span>{elem.reference}</span>
                            </div>
                        </div>

                        <div className="col-3">
                            <PropertyInfos1 elem={elem}/>
                            <PropertyInfos2 elem={elem}/>
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

export function PropertyInfos1({ elem: {building, door, is_furnished, type} }) {
    return <>
        {building && <div className="sub">Bâtiment : {building}</div>}
        {type && <div className="sub">Type : {type}</div>}
        {door && <div className="sub">Porte : {door}</div>}
        {(is_furnished && parseInt(is_furnished) !== 0) && <div className="sub">Meublé</div>}
    </>
}

export function PropertyInfos2({ elem: {floor, rooms, surface} }) {
    return <>
        {parseFloat(surface) > 0 && <div className="sub">{surface} m²</div>}
        {(parseInt(rooms) !== 0 && rooms !== "") && <div className="sub">{rooms} {parseInt(rooms) > 1 ? "pièces" : "pièce"}</div>}
        {floor !== "" && <div className="sub"> {floor}</div>}
    </>
}