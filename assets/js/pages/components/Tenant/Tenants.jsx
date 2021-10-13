import React, { Component } from 'react';

import { Layout }         from "@dashboardComponents/Layout/Page";
import Sort               from "@dashboardComponents/functions/sort";

import { TenantsList }     from "./TenantsList";
import { TenantFormulaire } from "./TenantForm";

const SORTER = Sort.compareLast_name;

function searchFunction(dataImmuable, search){
    let newData = [];
    search = search.toLowerCase();
    newData = dataImmuable.filter(function(v) {
        if(v.reference.toLowerCase().startsWith(search)
            || v.last_name.toLowerCase().startsWith(search)
            || v.first_name.toLowerCase().startsWith(search)
        ){
            return v;
        }
    })

    return newData;
}

export class Tenants extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            sessionName: "tenants.pagination"
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
        this.layout.current.handleDelete(this, element, this.props.oriUrl + "/" + element.id, "Supprimer ce locataire ?", "", true, false);
    }

    handleContentList = (currentData, changeContext) => {
        return <TenantsList onChangeContext={changeContext}
                            onSearch={this.handleSearch}
                            onDelete={this.handleDelete}
                            data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <TenantFormulaire oriUrl={this.props.oriUrl} type="create" onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <TenantFormulaire oriUrl={this.props.oriUrl} type="update" element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}