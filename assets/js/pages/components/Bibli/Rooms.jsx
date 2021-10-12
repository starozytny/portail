import React, { Component } from "react";

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";

import Sanitaze         from "@dashboardComponents/functions/sanitaze";

export class Rooms extends Component {
    constructor(props) {
        super(props);

    }

    render () {
        const { data } = this.props;

        console.log(data)

        return <>
            <div className="item item-header">
                <div className="item-content">
                    <div className="item-body">
                        <div className="infos infos-col-2">
                            <div className="col-1">Intitulé</div>
                            <div className="col-2 actions">Actions</div>
                        </div>
                    </div>
                </div>
            </div>
            {data.map(el => {
                return (<div className="item" key={el.id}>
                    <div className="item-content">
                        <div className="item-body">
                            <div className="infos infos-col-2">
                                <div className="col-1">
                                    <div className="name">
                                        <span>{Sanitaze.capitalize(el.name)}</span>
                                    </div>
                                </div>
                                <div className="col-2 actions">
                                    {el.is_native === "1" || el.is_used === "1" ?
                                        <div className="role">Natif ou utilisé</div>
                                        : <>
                                            <ButtonIcon icon="pencil">Modifier</ButtonIcon>
                                            <ButtonIcon icon="trash">Supprimer</ButtonIcon>
                                        </>}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
            })}
        </>
    }
}