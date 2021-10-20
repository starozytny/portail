import React, { Component } from "react";

import { Layout }   from "@dashboardComponents/Layout/Page";

import Common       from "../functions/common";

export class PageTemplate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: props.perPage,
            sessionName: props.sessionName,
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(JSON.stringify(this.props.data), this.props.sorter); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext, this.props.sorter); }

    handleDelete = (element) => {
        this.layout.current.handleDelete(this, element, this.props.oriUrl + "/" + element.id, this.props.msgDeleteElement, false, false);
    }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, Common.filterFunction); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, Common.searchFunction, true, Common.filterFunction); }

    render () {
        const { onContentList, onContentCreate, onContentUpdate } = this.props;

        return <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                       onContentList={onContentList}
                       onContentCreate={onContentCreate} onContentUpdate={onContentUpdate} />
    }
}