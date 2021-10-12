import React, {Component} from "react";

import { Button }       from "@dashboardComponents/Tools/Button";
import { Filter, FilterSelected }   from "@dashboardComponents/Layout/Filter";
import { Search }                   from "@dashboardComponents/Layout/Search";

export class ListTemplate extends Component {
    constructor(props) {
        super(props);

        this.filter = React.createRef();

        this.handleFilter = this.handleFilter.bind(this);
    }

    handleFilter = (e) => {
        this.filter.current.handleChange(e, true);
    }

    render () {
        const { data, onChangeContext, onSearch, onGetFilters, filters, onDelete, content, classToolbar, addName } = this.props;

        let itemsFiltersLabelArray = ["Libre", "Natif ou utilisé"];
        let itemsFiltersIdArray = ["f-libre", "f-natif"];

        let itemsFilter = [
            { value: 0, id: itemsFiltersIdArray[0], label: itemsFiltersLabelArray[0] },
            { value: 1, id: itemsFiltersIdArray[1], label: itemsFiltersLabelArray[1] }
        ]

        return <>
            <div className={"toolbar toolbar-" + classToolbar}>
                <div className="item create">
                    <Button onClick={() => onChangeContext("create")}>Ajouter {addName}</Button>
                </div>
                <div className="item filter-search">
                    <Filter ref={this.filter} items={itemsFilter} onGetFilters={onGetFilters} />
                    <Search onSearch={onSearch} />
                    <FilterSelected filters={filters} itemsFiltersLabel={itemsFiltersLabelArray} itemsFiltersId={itemsFiltersIdArray} onChange={this.handleFilter}/>
                </div>
            </div>

            {content}
        </>
    }
}