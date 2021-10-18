import React, { Component } from 'react';

import { Layout }         from "@dashboardComponents/Layout/Page";
import Sort               from "@dashboardComponents/functions/sort";

import { ModelesList }     from "./ModelesList";
import { ModeleFormulaire } from "./ModeleForm";

const SORTER = Sort.compareName;

function searchFunction(dataImmuable, search){
    let newData = [];
    search = search.toLowerCase();
    newData = dataImmuable.filter(function(v) {
        if(v.name.toLowerCase().startsWith(search)){
            return v;
        }
    })

    return newData;
}

export class Modeles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            sessionName: "modeles.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees, SORTER); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext, SORTER); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, searchFunction); }

    handleDelete = (element) => {
        this.layout.current.handleDelete(this, element, this.props.oriUrl + "/" + element.id, "Supprimer ce modèle ?", "", true, false);
    }

    handleContentList = (currentData, changeContext) => {
        return <ModelesList onChangeContext={changeContext}
                            onSearch={this.handleSearch}
                            onDelete={this.handleDelete}
                            data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <ModeleFormulaire oriUrl={this.props.oriUrl} type="create" onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <ModeleFormulaire oriUrl={this.props.oriUrl} type="update" element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}