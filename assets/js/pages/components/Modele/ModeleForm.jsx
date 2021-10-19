import React, { Component } from 'react';

import axios             from "axios";
import toastr            from "toastr";
import { uid }           from "uid";

import { Input }         from "@dashboardComponents/Tools/Fields";
import { Alert }         from "@dashboardComponents/Tools/Alert";
import { Button }        from "@dashboardComponents/Tools/Button";
import { FormLayout }    from "@dashboardComponents/Layout/Elements";
import { Aside }         from "@dashboardComponents/Tools/Aside";

import Validateur        from "@dashboardComponents/functions/validateur";
import Formulaire        from "@dashboardComponents/functions/Formulaire";
import Sort              from "@dashboardComponents/functions/sort";
import ElementsFunctions from "@pages/functions/elements";

import { SelectRoom }    from "./SelectRoom";
import { RoomItem }      from "./RoomItem";
import { SelectElement } from "./SelectElement";

export function ModeleFormulaire ({ type, onChangeContext, onUpdateList, element, oriUrl, library })
{
    let full = true;
    let title = "Ajouter un modèle";
    let url = oriUrl;
    let msg = "Vous avez ajouté un nouveau modèle !"

    let content = [];

    if(type === "update"){
        title = "Modifier " + element.name;
        url = oriUrl + "/" + element.id;
        msg = "La mise à jour s'est réalisée avec succès !";

        content = [];
        JSON.parse(element.content).forEach(item => {
            content.push({
                uid: uid(),
                id: item.id,
                name: ElementsFunctions.getStringData(library.rooms, item.id),
                elements: item.elements
            })
        })
    }

    let form = <ModeleForm
        context={type}
        url={url}
        name={element ? element.name : ""}
        content={content}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        library={library}
        messageSuccess={msg}
    />

    return <FormLayout full={full} onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class ModeleForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            content: props.content,
            errors: [],
            success: false,
            errorContent: "",
            room: null
        }

        this.asideRooms = React.createRef();
        this.asideElements = React.createRef();
        this.selectRoom = React.createRef();
        this.selectElements = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAsideRooms = this.handleAsideRooms.bind(this);
        this.handleAsideElements = this.handleAsideElements.bind(this);
        this.handleAddRoom = this.handleAddRoom.bind(this);
        this.handleRemoveRoom = this.handleRemoveRoom.bind(this);
        this.handleClickElement = this.handleClickElement.bind(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleAsideRooms = () => { this.asideRooms.current.handleOpen(); }
    handleAsideElements = (room, name) => {
        this.setState({ room: room })
        this.selectElements.current.handleInitData(room);
        this.asideElements.current.handleOpen("Modifier " + name);
    }

    handleAddRoom = (room) => {
        const { library } = this.props;
        const { content } = this.state;

        let newContent = content;
        newContent.push({ uid: uid(), id: room, name: ElementsFunctions.getStringData(library.rooms, room), elements: '[3, 4, 5, 6, 7, 8, 16, 17, 18]' });
        this.setState({ content: newContent })
    }

    handleRemoveRoom = (isUid=true, identifiant) => {
        const { content } = this.state;

        let newContent = [];
        let id = identifiant; //for delete in SelectRoom
        if(isUid){
            newContent = content.filter(elem => {
                if(elem.uid === identifiant){
                    id = elem.id
                }
                return elem.uid !== identifiant;
            })
        }else{
            let first = true;
            content.forEach(elem => {
                if(elem.id === identifiant){
                    if(!first){
                        newContent.push(elem)
                    }
                    first = false;
                }else{
                    newContent.push(elem);
                }
            })
        }

        this.setState({ content: newContent });
        this.selectRoom.current.handleRemove(id, false)
    }

    handleClickElement = (uid, id) => {
        const { content } = this.state;

        let newElements = "";
        let newContent = [];
        content.forEach(elem => {
            if(elem.uid === uid){
                let elements = JSON.parse(elem.elements);

                if(elements.includes(id)){
                    elements = elements.filter(el => { return el !== id });
                }else{
                    elements.push(id);
                }

                newElements = JSON.stringify(elements);
                elem.elements = newElements;
            }

            newContent.push(elem);
        })

        this.setState({ content: newContent });
        if(this.selectElements.current){
            this.selectElements.current.handleSetElements(newElements);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { name, content } = this.state;

        this.setState({ success: false, errors: [], errorContent: "" })
        let method = context !== "update" ? "POST" : "PUT";

        let paramsToValidate = [
            {type: "text",   id: 'name',   value: name},
            {type: "array",   id: 'content',   value: content},
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            toastr.warning("Veuillez vérifier les informations transmises.");
            this.setState({ errors: validate.errors, errorContent: getErrorContent(validate.errors) });
        }else{
            Formulaire.loader(true);
            let self = this;

            axios({ method: method, url: url, data: this.state})
                .then(function (response) {
                    let data = response.data;
                    location.reload();
                    toastr.info(messageSuccess);
                })
                .catch(function (error) {
                    Formulaire.loader(false);
                    Formulaire.displayErrors(self, error);
                    if(error.response.data && Array.isArray(error.response.data)){
                        self.setState({ errorContent: getErrorContent(error.response.data) })
                    }
                })
            ;
        }
    }

    render () {
        const { context, library } = this.props;
        const { errors, errorContent, success, name, content } = this.state;

        let asideRooms = <SelectRoom ref={this.selectRoom} content={content} data={library}
                                     onAddRoom={this.handleAddRoom}
                                     onRemoveRoom={this.handleRemoveRoom} />
        let asideElements = <SelectElement ref={this.selectElements} data={library}
                                           onClickElement={this.handleClickElement} />

        if(content.length !== 0){
            content.sort(Sort.compareName);
        }

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange} >Intitulé</Input>
                </div>

                <div className="line line-select-or-add">
                    <div className={"form-group input-bien " + errorContent}>
                        <label>Pièce(s)</label>
                        <div className="actions-bien select-or-add">
                            <Button outline={true} type="default" onClick={this.handleAsideRooms}>Sélectionner une/des pièce(s)</Button>
                        </div>
                        <div className="error">
                            <span className='icon-warning'/>
                            Veuillez ajouter au moins une pièce.
                        </div>
                    </div>
                </div>

                {content.length !== 0 && <div className="line">
                    <div className="items-table">
                        <div className="items items-default">
                            <div className="item item-header">
                                <div className="item-content">
                                    <div className="item-body">
                                        <div className="infos infos-col-3">
                                            <div className="col-1">Pièce</div>
                                            <div className="col-2">Eléments</div>
                                            <div className="col-3 actions">Actions</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {content.map((elem, index) => {
                                return <RoomItem elem={elem} library={library} key={index}
                                                 onRemoveRoom={this.handleRemoveRoom}
                                                 onAside={this.handleAsideElements}
                                                 onClickElement={this.handleClickElement}
                                />
                            })}
                        </div>
                    </div>
                </div>}


                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context !== "update" ? "Ajouter ce modèle" : 'Modifier ce modèle'}</Button>
                    </div>
                </div>
            </form>
            <Aside ref={this.asideRooms} content={asideRooms} >Sélectionner une/des pièce(s)</Aside>
            <Aside ref={this.asideElements} content={asideElements} />
        </>
    }
}

function getErrorContent(errors) {
    let errorContent = "";
    errors.forEach(err => {
        if(err.name === "content"){
            errorContent = "form-group-error";
        }
    })

    return errorContent;
}