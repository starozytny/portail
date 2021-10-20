import React, { Component } from 'react';

import { Button }     from "@dashboardComponents/Tools/Button";
import { Alert }      from "@dashboardComponents/Tools/Alert";
import { Search }     from "@dashboardComponents/Layout/Search";

import { PropertiesItem } from "./PropertiesItem";

export class PropertiesList extends Component {
    render () {
        const { data, onChangeContext, onSearch } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter un bien</Button>
                    </div>
                    <div className="item filter-search">
                        <Search onSearch={onSearch} />
                    </div>
                </div>

                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-4">
                                        <div className="col-1">Adresse</div>
                                        <div className="col-2">Référence</div>
                                        <div className="col-3">Détails</div>
                                        <div className="col-4 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <PropertiesItem {...this.props} elem={elem} key={elem.id} />
                        }) : <Alert>Aucun résultat.</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}