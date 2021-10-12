import React, { Component } from "react";

import { Page }         from "@dashboardComponents/Layout/Page";

import Sort             from "@dashboardComponents/functions/sort";

import { List }         from "./Rooms/List";
import { LoaderElement } from "@dashboardComponents/Layout/Loader";

const SORTER = Sort.compareName;

export class Rooms extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "list",
            loadData: true,
            perPage: 20,
            sessionName: "rooms.pagination"
        }

        this.page = React.createRef();

        this.handleUpdateData = this.handleUpdateData.bind(this);
    }

    componentDidMount = () => {
        const { data } = this.props;
        const { perPage } = this.state;

        data.sort(SORTER)
        this.setState({ dataImmuable: data, data: data, currentData: data.slice(0, perPage), loadData: false });
    }

    handleUpdateData = (data) => { this.setState({ currentData: data })  }

    render () {
        const { context, data, currentData, sessionName, loadData, perPage } = this.state;

        console.log(data)

        let content, havePagination = false;
        switch (context){
            case "create":
                content = <div>Create</div>
                break;
            default:
                havePagination = true;
                content = loadData ? <LoaderElement /> : <List data={currentData} />
                break;
        }

        return <Page ref={this.page} haveLoadPageError={false} sessionName={sessionName} perPage={perPage}
                     havePagination={havePagination} taille={data && data.length} data={data} onUpdate={this.handleUpdateData}
        >
            {content}
        </Page>
    }
}