import React, { Component } from 'react';

import { Button }     from "@dashboardComponents/Tools/Button";
import { Alert }      from "@dashboardComponents/Tools/Alert";
import { Search }     from "@dashboardComponents/Layout/Search";

import { TenantsItem } from "./TenantsItem";

export class TenantsList extends Component {
    render () {
        const { data, onChangeContext, onSearch } = this.props;

        return <>
            <div>
                <div className="toolbar">
                    <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter un locataire</Button>
                    </div>
                    <div className="item filter-search">
                        <Search onSearch={onSearch} />
                    </div>
                </div>

                <div className="items-table">
                    <div className="items items-default items-contact">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-3">
                                        <div className="col-1">Locataire</div>
                                        <div className="col-2">Détails</div>
                                        <div className="col-3 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <TenantsItem {...this.props} elem={elem} key={elem.id} />
                        }) : <Alert>Aucun résultat.</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}