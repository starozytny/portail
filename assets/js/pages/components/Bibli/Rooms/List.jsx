import React, {Component} from "react";

import Sanitaze from "@dashboardComponents/functions/sanitaze";

import { Button, ButtonIcon }       from "@dashboardComponents/Tools/Button";
import { Filter, FilterSelected }   from "@dashboardComponents/Layout/Filter";
import { Search }                   from "@dashboardComponents/Layout/Search";

export class List extends Component {
    constructor(props) {
        super(props);

        this.filter = React.createRef();

        this.handleFilter = this.handleFilter.bind(this);
    }

    handleFilter = (e) => {
        this.filter.current.handleChange(e, true);
    }

    render () {
        const { data, onChangeContext, onSearch, onGetFilters, filters, onDelete } = this.props;

        let itemsFiltersLabelArray = ["Libre", "Natif ou utilisé"];
        let itemsFiltersIdArray = ["f-libre", "f-natif"];

        let itemsFilter = [
            { value: 0, id: itemsFiltersIdArray[0], label: itemsFiltersLabelArray[0] },
            { value: 1, id: itemsFiltersIdArray[1], label: itemsFiltersLabelArray[1] }
        ]

        return <>
            <div className="toolbar">
                <div className="item create">
                    <Button onClick={() => onChangeContext("create")}>Ajouter une pièce</Button>
                </div>
                <div className="item filter-search">
                    <Filter ref={this.filter} items={itemsFilter} onGetFilters={onGetFilters} />
                    <Search onSearch={onSearch} />
                    <FilterSelected filters={filters} itemsFiltersLabel={itemsFiltersLabelArray} itemsFiltersId={itemsFiltersIdArray} onChange={this.handleFilter}/>
                </div>
            </div>

            <div className="items-table">
                <div className="items items-default">
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
                                                <div className="role">{el.is_native === "1" ? "Natif" : "Utilisé"}</div>
                                                : <>
                                                    <ButtonIcon icon="compose" onClick={() => onChangeContext('update', el)}>Modifier</ButtonIcon>
                                                    <ButtonIcon icon="delete" onClick={() => onDelete(el)}>Supprimer</ButtonIcon>
                                                </>}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)
                    })}
                </div>
            </div>
        </>
    }
}