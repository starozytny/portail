import React, { Component } from 'react';

import toastr               from "toastr";

import { ButtonIcon }       from "@dashboardComponents/Tools/Button";

import Sanitaze             from "@dashboardComponents/functions/sanitaze";

export class SelectRoom extends Component {
    constructor(props) {
        super();

        this.state = {
            values: []
        }

        this.handleSetData = this.handleSetData.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    componentDidMount = () => {
        const { content } = this.props;

        this.handleSetData(content);
    }

    handleSetData = (content) => {
        let values = [];
        content.forEach(elem => {
            values.push(elem.id);
        })

        this.setState({ values })
    }

    handleAdd = (id) => {
        const { values } = this.state;

        let newValues = values;
        newValues.push(parseInt(id));

        this.setState({ values: newValues });
        this.props.onAddRoom(parseInt(id));
    }

    handleRemove = (id, updateParent=true) => {
        const { content } = this.props;
        const { values } = this.state;

        let newValues = [];
        let find = null; let canRemove = true;
        if(updateParent){ // function no called by parent so check elements
            content.forEach(elem => {
                if(elem.id === parseInt(id)){
                    if(!find){
                        find = elem.elements;
                    }else{
                        if(find !== elem.elements){
                            canRemove = false;
                        }
                    }
                }
            })
        }

        if(!canRemove){
            toastr.danger("Impossible d'enlever cette pièce à partir de cette fenêtre car il existe dans ce modèle " +
                "le même type de pièce avec des caractéristiques différentes.")
        }else{
            let first = true;
            values.forEach(val => {
                if(val === parseInt(id)){
                    if(!first){
                        newValues.push(val)
                    }
                    first = false;
                }else{
                    newValues.push(val);
                }
            })
            this.setState({ values: newValues });
            if(updateParent){
                this.props.onRemoveRoom(false, parseInt(id));
            }
        }
    }

    render () {
        const { data } = this.props;
        const { values } = this.state;

        return <>
            <div className="items-table">
                <div className="items items-default items-rooms">
                    <div className="item item-header">
                        <div className="item-header-selector" />
                        <div className="item-content">
                            <div className="item-body">
                                <div className="infos infos-col-2">
                                    <div className="col-1">Intitulé</div>
                                    <div className="col-2 actions">Actions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {data.rooms.map(el => {

                        let active = "";
                        let total = 0;

                        values.forEach(val => {
                            if(val === parseInt(el.id)){
                                active = " active";
                                total++;
                            }
                        })

                        return (<div className={"item" + active} key={el.id}>
                            <div className="selector" onClick={() => this.handleAdd(el.id)}/>

                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-2">
                                        <div className="col-1" onClick={() => this.handleAdd(el.id)}>
                                            <div className="name">
                                                <span>{Sanitaze.capitalize(el.name)}</span>
                                            </div>
                                        </div>
                                        <div className="col-2 actions">
                                            {total > 0 && <ButtonIcon icon="minus" onClick={() => this.handleRemove(el.id)}>Moins</ButtonIcon>}
                                            <div className="number">{total}</div>
                                            <ButtonIcon icon="plus" onClick={() => this.handleAdd(el.id)}>Plus</ButtonIcon>
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