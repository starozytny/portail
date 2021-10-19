import React, {Component} from "react";

import Swal         from "sweetalert2";
import SwalOptions  from "@dashboardComponents/functions/swalOptions";

import { Button, ButtonIcon }   from "@dashboardComponents/Tools/Button";
import ElementsFunctions        from "@pages/functions/elements";

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
        const { elem, library, onAside } = this.props;
        const { showDetails } = this.state;

        let name = ElementsFunctions.getStringData(library.rooms, elem.id);

        return <div className={"item item-room" + (showDetails ? " active" : "")}>
            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-3">
                        <div className="col-1" onClick={this.handleShow}>
                            <div className="name">
                                {name}
                            </div>
                        </div>
                        <div className="col-2">
                            <Elements elements={JSON.parse(elem.elements)} library={library} onShow={this.handleShow}/>
                            <div className="edit-elements">
                                <Button outline={true} icon="compose" type="default" onClick={() => onAside(elem, name.toLowerCase())}>Modifier</Button>
                            </div>
                        </div>
                        <div className="col-3 actions">
                            <ButtonIcon icon={showDetails ? "hide" : "show"} onClick={this.handleShow}>Détails</ButtonIcon>
                            <ButtonIcon icon="delete" onClick={() => this.handleRemove(elem.uid)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

function Elements ({ elements, library, onShow }) {

    let items = []; let noDuplicate = [];

    //create tab by categories
    elements.forEach(elem => {
        let item = ElementsFunctions.getStringElement(library.elements, parseInt(elem));

        let category = item[0];
        let nameCategory = ElementsFunctions.getStringData(library.categories, category);
        let nameElement = item[1];

        if(!noDuplicate.includes(category)){
            noDuplicate.push(category);

            items[nameCategory] = [nameElement]
        }else{
            items[nameCategory].push(nameElement)
        }
    })

    // display elements by categories
    let data = [];
    Object.entries(items).forEach((item, index) => {
        let elements = [];

        //item[1] == nameElement
        //item[0] == (int) id categorie

        item[1].forEach((elem, index) => {
            elements.push(<div key={index}>
                - {elem}
            </div>)
        })

        data.push(<div className="room-elements" key={index} onClick={onShow}>
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