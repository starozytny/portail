import React, { Component } from 'react';

import { Layout }         from "@dashboardComponents/Layout/Page";

import { PropertiesList } from "./PropertiesList";

function searchFunction(dataImmuable, search){
    let newData = [];
    search = search.toLowerCase();
    newData = dataImmuable.filter(function(v) {
        if(v.reference.toLowerCase().startsWith(search)
            || v.owner.toLowerCase().startsWith(search)
            || v.addr1.toLowerCase().startsWith(search)
            || v.zipcode.toLowerCase().startsWith(search)
            || v.city.toLowerCase().startsWith(search)
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

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, searchFunction); }

    handleContentList = (currentData, changeContext) => {
        return <PropertiesList onChangeContext={changeContext}
                               onSearch={this.handleSearch}
                            data={currentData} />
    }


    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </>
    }
}