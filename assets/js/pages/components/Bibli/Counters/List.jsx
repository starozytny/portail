import React, {Component} from "react";

import Sanitaze         from "@dashboardComponents/functions/sanitaze";

import { Alert }        from "@dashboardComponents/Tools/Alert";

import { ListTemplate }    from "../Template/ListTemplate";
import { ActionsTemplate } from "../Template/ActionsTemplate";

export class List extends Component {

    render () {
        const { data, onChangeContext, onDelete } = this.props;

        let items = [];
        data.forEach(el => {
            items.push(<div className="item" key={el.id}>
                <div className="item-content">
                    <div className="item-body">
                        <div className="infos infos-col-3">
                            <div className="col-1">
                                <div className="name">
                                    <span>{Sanitaze.capitalize(el.name)}</span>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="sub">{el.unit}</div>
                            </div>
                            <div className="col-3 actions">
                                <ActionsTemplate el={el} onChangeContext={onChangeContext} onDelete={onDelete}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
        })

        let content = <div className="items-table">
            <div className="items items-default">
                <div className="item item-header">
                    <div className="item-content">
                        <div className="item-body">
                            <div className="infos infos-col-3">
                                <div className="col-1">Intitulé</div>
                                <div className="col-2">Unité</div>
                                <div className="col-3 actions">Actions</div>
                            </div>
                        </div>
                    </div>
                </div>
                {items.length !== 0 ? items : <Alert>Aucun résultat.</Alert>}
            </div>
        </div>

        return <ListTemplate {...this.props} content={content} classToolbar="counters" addName="un compteur"/>
    }
}