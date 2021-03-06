import React, { Component } from 'react';

import { Button }               from "@dashboardComponents/Tools/Button";
import { Alert }                from "@dashboardComponents/Tools/Alert";
import { Search }               from "@dashboardComponents/Layout/Search";

import Sanitaze                 from "@dashboardComponents/functions/sanitaze";
import Sort                     from "@dashboardComponents/functions/sort";
import ElementsFunctions        from "@pages/functions/elements";

export class SelectElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataImmuable: props.library.elements,
            data: props.library.elements,
            categoryActive: null,
            room: null,
            elements: []
        }

        this.handleInitData = this.handleInitData.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSetElements = this.handleSetElements.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleInitData = (room) => { this.setState({ room: room, elements: JSON.parse(room.elements) }) }

    handleClick = (categoryActive) => { this.setState({ categoryActive }) }

    handleSetElements = (elements) => { this.setState({ elements: JSON.parse(elements) }) }

    handleSearch = (search) => {
        const { dataImmuable } = this.state;

        if(search === "") {
            this.setState({ data: dataImmuable });
        }else{
            let newData = ElementsFunctions.searchFunction(dataImmuable, search);
            this.setState({ data: newData });
        }
    }

    render () {
        const { library, onClickElement } = this.props;
        const { data, categoryActive, room, elements } = this.state;

        let categoriesChoices = [];
        library.categories.forEach(cat => {
            let total = 0;


            elements.forEach(id => {
                let item = ElementsFunctions.getStringElement(library, id);
                // item[0] == cat id
                // item[1] == name element
                if(item[0] === parseInt(cat.id)){
                    total++;
                }
            })

            categoriesChoices.push({
                id: parseInt(cat.id),
                name: Sanitaze.capitalize(cat.name) + ' ('+ (total > 0 ? "+" : "") + total +')',
                total: total
            })
        });

        let items = [];
        data.sort(Sort.compareName)
        data.forEach(el => {

            if(categoryActive === parseInt(el.category)){

                let active = "";
                elements.forEach(id => {
                    if(id === parseInt(el.id)){
                        active = " active";
                    }
                })

                items.push(<div className={"item" + active} key={el.id} onClick={() => onClickElement(room.uid, parseInt(el.id))}>
                    <div className="selector" />

                    <div className="item-content">
                        <div className="item-body">
                            <div className="infos infos-col-2">
                                <div className="col-1">
                                    <div className="name">
                                        <span>{Sanitaze.capitalize(el.name)}</span>
                                    </div>
                                </div>
                                <div className="col-2 actions">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
            }
        })

        return <div className="select-elements">
            <div className="categories">
                {categoriesChoices.map(category => {
                    return <div key={category.id}
                                className={"category " + (category.total > 0)}>
                        <Button type={categoryActive === category.id ? "primary" : "default"} outline={categoryActive !== category.id}
                                 onClick={() => this.handleClick(category.id)}>{category.name}</Button>
                    </div>
                })}
            </div>
            {categoryActive ? <>
                <div className="toolbar">
                    <div className="item filter-search">
                        <Search onSearch={this.handleSearch} />
                    </div>
                </div>
                <div className="items-table">
                    <div className="items items-default items-rooms">
                        <div className="item item-header">
                            <div className="item-header-selector" />
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-2">
                                        <div className="col-1">Intitul??</div>
                                        <div className="col-2 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {items.length !== 0 ? items : <div className="item">Aucun ??l??ment pour cette cat??gorie.</div>}
                    </div>
                </div>
            </> : <Alert type="reverse">Veuillez cliquer sur un bouton pour afficher les ??l??ments associ??s.</Alert>}
        </div>
    }
}