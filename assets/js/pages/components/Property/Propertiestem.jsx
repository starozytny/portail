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
                            <div className="sub">{elem.addr1}</div>
                        </div>
                        <div className="col-3">
                            <div className="sub">{elem.owner}</div>
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