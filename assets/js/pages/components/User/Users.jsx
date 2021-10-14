import React, { Component } from "react";

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";
import { Aside } from "@dashboardComponents/Tools/Aside";

import { UserFormulaire } from "./UserForm";

export class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "create",
            data: JSON.parse(props.donnees)
        }

        this.aside = React.createRef();

        this.handleOpenAside = this.handleOpenAside.bind(this);
    }

    handleOpenAside = (type, element = null) => {
        this.setState({ context: type, element: element })
        let title = type === "create" ? "Ajouter un utilisateur" : "Modifier " + element.username
        this.aside.current.handleOpen(title);
    }

    render () {
        const { currentUser } = this.props;
        const { context, data, element } = this.state;

        let user = JSON.parse(currentUser);

        let items = [];
        data.forEach(elem => {
            items.push(<div className="item" key={elem.id}>
                <div className="col-1">{elem.username}</div>
                <div className="col-2">
                    <div>{elem.first_name} {elem.last_name.toUpperCase()}</div>
                    <div className="sub">{elem.user_tag}</div>
                </div>
                <div className="col-3">
                    {elem.rights === "0" && <div className='role-blocked'>Utilisateur</div>}
                </div>
                <div className="col-4">
                    {elem.id !== user[7] && user[9] === '1' && <>
                        <ButtonIcon icon="compose" onClick={() => this.handleOpenAside('update', elem)}>Modifier</ButtonIcon>
                        <ButtonIcon icon="delete">Supprimer</ButtonIcon>
                    </>}
                </div>
            </div>)
        })

        let asideContent = context === "create" ?
            <UserFormulaire oriUrl={this.props.oriUrl} type="create" />
            : <UserFormulaire oriUrl={this.props.oriUrl} element={element} type="update" />

        return <>
            <div className="title">
                <h2>Utilisateurs</h2>
                <div className="actions">
                    <Button onClick={() => this.handleOpenAside('create')}>Ajouter un utilisateur</Button>
                </div>
            </div>
            <div className="users-list">
                <div className="list-header">
                    <div className="item">
                        <div className="col-1">Identifiant</div>
                        <div className="col-2">Utilisateur</div>
                        <div className="col-3" />
                        <div className="col-4">Actions</div>
                    </div>
                </div>
                <div className="list-items">
                    {items.length !== 0 ? items : <div className="item">Aucun utilisateur enregistré.</div>}
                </div>
            </div>
            <Aside ref={this.aside} content={asideContent} />
        </>
    }
}