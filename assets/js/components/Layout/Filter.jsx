import React, { Component } from 'react';

export class Filter extends Component {
    constructor() {
        super();

        this.state = {
            filters: []
        }

        this.handleChange = this.handleChange.bind(this);
    }

    // from fo uncheck via toolbar filter checked
    handleChange = (e, from=false) => {
        const { filters } = this.state;

        let value = parseInt(e.currentTarget.value);
        let newFilter;
        if(!from){
            newFilter = (e.currentTarget.checked) ? [...filters, ...[value]] : filters.filter(v => v !== value)
        }else{
            newFilter = filters.filter(v => v !== value)
            document.getElementById(e.currentTarget.dataset.id).click();
        }

        this.setState({filters: newFilter});

        this.props.onGetFilters(newFilter);
    }

    render () {
        const { items } = this.props;
        const { filters } = this.state;

        return <div className="filter">
            <div className="dropdown">
                <div className={`dropdown-btn ${filters.length !== 0 ? "active" : ""}`}>
                    <span>Filtre</span>
                    <span className="icon-filter" />
                </div>
                <div className="dropdown-items">
                    {items.map((el, index) => {
                        return <div className="item" key={index}>
                            <input type="checkbox" name="filters" id={el.id} value={el.value} onChange={this.handleChange}/>
                            <label htmlFor={el.id}>{el.label}</label>
                        </div>
                    })}
                </div>
            </div>
        </div>
    }
}

export class FilterSelected extends Component {
    render () {
        const { filters, itemsFiltersLabel, itemsFiltersId, onChange } = this.props;

        return <div className="filters-items-checked">
            {filters && filters.map(el => {
                return <div className="item" key={el}>
                    <div className="role">
                        <input type="checkbox" name="filters-checked" id={`fcheck-${el}`} data-id={itemsFiltersId[el]} value={el} onChange={onChange}/>
                        <label htmlFor={`fcheck-${el}`}>
                            {itemsFiltersLabel[el]}
                            <span className="icon-cancel" />
                        </label>
                    </div>
                </div>
            })}
        </div>
    }
}