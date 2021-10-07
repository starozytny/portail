import React, { Component } from 'react';

import { Alert }      from "@dashboardComponents/Tools/Alert";

import { PropertiesItem } from "./Propertiestem";

export class PropertiesList extends Component {
    render () {
        const { data } = this.props;

        return <>
            <div>
                <div className="items-table">
                    <div className="items items-default items-contact">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-4">
                                        <div className="col-1">Référence</div>
                                        <div className="col-2">Adresse</div>
                                        <div className="col-3">Détails</div>
                                        <div className="col-4 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <PropertiesItem {...this.props} elem={elem} key={elem.id} />
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}