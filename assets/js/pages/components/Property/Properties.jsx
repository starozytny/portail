import React, { Component } from 'react';

import { Layout }         from "@dashboardComponents/Layout/Page";

import { PropertiesList }     from "./PropertiesList";
import { PropertyFormulaire } from "./PropertyForm";

function searchFunction(dataImmuable, search){
    let newData = [];
    search = search.toLowerCase();
    newData = dataImmuable.filter(function(v) {
        if(v.reference.toLowerCase().startsWith(search)
            || v.owner.toLowerCase().startsWith(search)
            || v.addr1.toLowerCase().startsWith(search)
            || v.city.toLowerCase().startsWith(search)
            || v.zipcode.toLowerCase().startsWith(search)
        ){
            return v;
        }
    })

    return newData;
}

export class Properties extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            sessionName: "properties.pagination"
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

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, searchFunction); }

    handleDelete = (element) => {
        this.layout.current.handleDelete(this, element, this.props.oriUrl + "/" + element.id, "Supprimer ce bien ?");
    }

    handleContentList = (currentData, changeContext) => {
        return <PropertiesList onChangeContext={changeContext}
                               onSearch={this.handleSearch}
                               onDelete={this.handleDelete}
                            data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <PropertyFormulaire oriUrl={this.props.oriUrl} type="create" onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <PropertyFormulaire oriUrl={this.props.oriUrl} type="update" element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}