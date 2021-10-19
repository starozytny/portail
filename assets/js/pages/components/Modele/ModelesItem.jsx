import React, { Component } from 'react';

import ElementsFunctions    from "@pages/functions/elements";

import { ButtonIcon }       from "@dashboardComponents/Tools/Button";

export class ModelesItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDetails: false,
            showDetailsDeep: false
        }

        this.handleShow = this.handleShow.bind(this);
        this.handleShowDeep = this.handleShowDeep.bind(this);
    }

    handleShow = () => { this.setState({ showDetails: !this.state.showDetails }) }
    handleShowDeep = () => { this.setState({ showDetailsDeep: !this.state.showDetailsDeep }) }

    render () {
        const { library, elem, onChangeContext, onDelete } = this.props;
        const { showDetails, showDetailsDeep } = this.state;

        let content = JSON.parse(elem.content);

        let items = [];
        content.forEach((room, index) => {

            let elements = JSON.parse(room.elements);

            let categories = [], noDuplicate = [], categoriesContent = [];
            elements.forEach(el => {
                let item = ElementsFunctions.getStringElement(library, el);
                let nameCategory = ElementsFunctions.getStringData(library.categories, item[0]);

                if(!noDuplicate.includes(item[0])){
                    noDuplicate.push(item[0]);

                    categories[nameCategory] = {total: 1, elements: [item[1]]}
                }else{
                    categories[nameCategory].total++;
                    categories[nameCategory].elements.push(item[1]);

                }
            })

            Object.entries(categories).forEach((item, index) => {

                let elements = [];
                item[1].elements.forEach((el, index) => {
                    elements.push(<div key={index}>
                        - {el}
                    </div>)
                })

                categoriesContent.push(<div key={index}>
                    <span>{item[0]} ({item[1].total > 0 ? ("+" + item[1].total) : "0"})</span>
                    <div className={"elements " + showDetailsDeep}>
                        {elements}
                    </div>
                </div>)
            })


            items.push(<div key={index}>
                <div className="room">
                    <span className="icon-rec" />
                    <span>{ElementsFunctions.getStringData(library.rooms, room.id)}</span>
                </div>
                <div className="categories">
                    {categoriesContent}
                </div>
            </div>)
        })


        return <div className={"item item-model " + showDetails}>
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1" onClick={this.handleShow}>
                            <div className="name">{elem.name}</div>
                        </div>

                        <div className="col-2">
                            {content.length > 0 ? <>
                                <div onClick={this.handleShow}>{content.length} pièce{content.length > 1 ? "s" : ""}</div>
                                <div className="details" onClick={this.handleShowDeep}>
                                    {items.length !== 0 ? items : "Vide"}
                                </div>
                            </> : "Vide"}
                        </div>

                        <div className="col-3 actions">
                            <ButtonIcon icon="show" onClick={this.handleShow}>Details</ButtonIcon>
                            <ButtonIcon icon="compose" onClick={() => onChangeContext('update', elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="delete" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}