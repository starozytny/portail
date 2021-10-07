import React, { Component } from 'react';

import { Layout }         from "@dashboardComponents/Layout/Page";

import { PropertiesList } from "./PropertiesList";

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

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleContentList = (currentData, changeContext) => {
        return <PropertiesList onChangeContext={changeContext}
                            data={currentData} />
    }


    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </>
    }
}