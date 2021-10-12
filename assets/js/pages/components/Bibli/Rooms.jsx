import React, { Component } from "react";

import { Layout }   from "@dashboardComponents/Layout/Page";

import Sort         from "@dashboardComponents/functions/sort";

import { List }     from "./Rooms/List";

const URL_DELETE_ELEMENT = 'api_users_delete';
const MSG_DELETE_ELEMENT = 'Supprimer cette pièce ?';
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

function filterFunction(dataImmuable, filters){
    let newData = [];
    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            filters.forEach(filter => {
                if(filter === 0){
                    if(el.is_native === "0" && el.is_used === "0"){
                        newData.filter(elem => elem.id !== el.id)
                        newData.push(el);
                    }
                }else{
                    if(el.is_native === "1" || el.is_used === "1"){
                        newData.filter(elem => elem.id !== el.id)
                        newData.push(el);
                    }
                }
            })
        })
    }

    return newData;
}

export class Rooms extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 20,
            sessionName: "rooms.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(JSON.stringify(this.props.data), SORTER); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext, SORTER); }

    handleDelete = (element) => {
        this.layout.current.handleDelete(this, element, "", MSG_DELETE_ELEMENT);
    }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, filterFunction); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, searchFunction, true, filterFunction); }

    handleContentList = (currentData, changeContext, getFilters, filters) => {
        return <List data={currentData}
                     onChangeContext={this.handleChangeContext}
                     onGetFilters={this.handleGetFilters}
                     onSearch={this.handleSearch}
                     filters={filters} />
    }

    render () {
        return <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                       onContentList={this.handleContentList} />
    }
}