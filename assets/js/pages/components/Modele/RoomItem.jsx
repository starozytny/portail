import React, {Component} from "react";

import Swal         from "sweetalert2";
import SwalOptions  from "@dashboardComponents/functions/swalOptions";

import Sanitaze from "@dashboardComponents/functions/sanitaze";

import { ButtonIcon } from "@dashboardComponents/Tools/Button";

export class RoomItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDetails: false
        }

        this.handleShow = this.handleShow.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    handleShow = () => { this.setState({ showDetails: !this.state.showDetails }) }

    handleRemove = (uid) => {
        const self = this;
        Swal.fire(SwalOptions.options("Etes-vous sûr de vouloir supprimer cette pièce ?", ""))
            .then((result) => {
                if (result.isConfirmed) {
                    self.props.onRemoveRoom(true, uid);
                }
            })
        ;
    }

    render () {
        const { elem, library } = this.props;
        const { showDetails } = this.state;

        return <div className={"item item-room" + (showDetails ? " active" : "")}>
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1" onClick={this.handleShow}>
                            <div className="name">
                                {getStringData(library.rooms, elem.id)}
                            </div>
                        </div>
                        <div className="col-2" onClick={this.handleShow}>
                            <Elements elements={JSON.parse(elem.elements)} library={library}/>
                        </div>
                        <div className="col-3 actions">
                            <ButtonIcon icon={showDetails ? "hide" : "show"} onClick={this.handleShow}>Détails</ButtonIcon>
                            <ButtonIcon icon="compose">Modifier</ButtonIcon>
                            <ButtonIcon icon="delete" onClick={() => this.handleRemove(elem.uid)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

function Elements ({ elements, library }) {

    let items = []; let noDuplicate = [];

    elements.forEach((elem, index) => {
        let item = getStringElement(library.elements, parseInt(elem));

        let category = item[0];
        let nameCategory = getStringData(library.categories, category);
        let nameElement = item[1];

        if(!noDuplicate.includes(category)){
            noDuplicate.push(category);

            items[nameCategory] = [nameElement]
        }else{
            items[nameCategory].push(nameElement)
        }
    })

    let data = [];
    Object.entries(items).forEach((item, index) => {
        let elements = [];

        item[1].forEach((elem, index) => {
            elements.push(<div key={index}>
                - {elem}
            </div>)
        })

        data.push(<div className="room-elements" key={index}>
            <div className="category">
                <span className="icon-rec" />
                <span>{item[0]}</span>
            </div>
            <div className="elements">
                {elements}
            </div>
        </div>)
    })

    return <>{data}</>
}

function getStringElement(data, id)
{
    let item = ""; let cat = "";
    data.forEach(el => {
        if(parseInt(el.id) === id){
            cat = Sanitaze.capitalize(el.category);
            item = Sanitaze.capitalize(el.name);
        }
    })

    return [parseInt(cat), item];
}

function getStringData(data, id)
{
    let item = "";
    data.forEach(el => {
        if(parseInt(el.id) === id){
            item = Sanitaze.capitalize(el.name);
        }
    })

    return item;
}