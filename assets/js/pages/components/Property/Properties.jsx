import React, { Component } from 'react';

import { Layout }         from "@dashboardComponents/Layout/Page";
import Sort               from "@dashboardComponents/functions/sort";
import SearchFunction     from "@pages/functions/search";

import { PropertiesList }     from "./PropertiesList";
import { PropertyFormulaire } from "./PropertyForm";

const SORTER = Sort.compareAddr1;

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

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees, SORTER); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext, SORTER); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, SearchFunction.searchProperty); }

    handleDelete = (element) => {
        this.layout.current.handleDelete(this, element, this.props.oriUrl + "/" + element.id, "Supprimer ce bien ?", "", true, false);
    }

    handleContentList = (currentData, changeContext) => {
        return <PropertiesList onChangeContext={changeContext}
                               onSearch={this.handleSearch}
                               onDelete={this.handleDelete}
                               inventories={JSON.parse(this.props.inventories)}
                               rights={this.props.rights}
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