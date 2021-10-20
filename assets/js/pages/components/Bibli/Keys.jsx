import React, { Component } from "react";

import Sort         from "@dashboardComponents/functions/sort";

import { PageTemplate }      from "./Template/PageTemplate";
import { List }              from "./Keys/List";
import { KeyFormulaire }     from "./Keys/Form";

const MSG_DELETE_ELEMENT = 'Supprimer cette clé ?';
const SORTER = Sort.compareName;

export class Keys extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 20,
            sessionName: "keys.pagination"
        }

        this.pageTemplate = React.createRef();

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleContentCreate = (changeContext) => {
        return <KeyFormulaire type="create" oriUrl={this.props.oriUrl} onChangeContext={changeContext} onUpdateList={this.pageTemplate.current.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <KeyFormulaire type="update" oriUrl={this.props.oriUrl} element={element} onChangeContext={changeContext} onUpdateList={this.pageTemplate.current.handleUpdateList}/>
    }

    handleContentList = (currentData, changeContext, getFilters, filters) => {
        return <List data={currentData}
                     onChangeContext={changeContext}
                     onGetFilters={this.pageTemplate.current.handleGetFilters}
                     onSearch={this.pageTemplate.current.handleSearch}
                     onDelete={this.pageTemplate.current.handleDelete}
                     filters={filters} />
    }

    render () {
        return <PageTemplate ref={this.pageTemplate} {...this.state} {...this.props} sorter={SORTER} msgDeleteElement={MSG_DELETE_ELEMENT}
                             onContentList={this.handleContentList}
                             onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}
        />
    }
}