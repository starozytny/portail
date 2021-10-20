import React, { Component } from "react";

import Sort         from "@dashboardComponents/functions/sort";

import { PageTemplate }   from "./Template/PageTemplate";
import { ListGenerique }  from "@pages/components/Bibli/Template/ListGenerique";
import { FormFormulaire } from "@pages/components/Bibli/Template/FormGenerique";

const MSG_DELETE_ELEMENT = 'Supprimer ce aspect ?';
const SORTER = Sort.compareName;

export class Aspects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 20,
            sessionName: "aspects.pagination"
        }

        this.pageTemplate = React.createRef();

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleContentCreate = (changeContext) => {
        return <FormFormulaire type="create" oriUrl={this.props.oriUrl}
                               addTxt="un aspect" addMsgTxt="un nouveau aspect"
                               onChangeContext={changeContext} onUpdateList={this.pageTemplate.current.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <FormFormulaire type="update" oriUrl={this.props.oriUrl} element={element}
                               onChangeContext={changeContext} onUpdateList={this.pageTemplate.current.handleUpdateList}/>
    }

    handleContentList = (currentData, changeContext, getFilters, filters) => {
        return <ListGenerique data={currentData}
                     onChangeContext={changeContext}
                     onGetFilters={this.pageTemplate.current.handleGetFilters}
                     onSearch={this.pageTemplate.current.handleSearch}
                     onDelete={this.pageTemplate.current.handleDelete}
                     classToolbar="aspects" addName="un aspect"
                     filters={filters} />
    }

    render () {
        return <PageTemplate ref={this.pageTemplate} {...this.state} {...this.props} sorter={SORTER} msgDeleteElement={MSG_DELETE_ELEMENT}
                             onContentList={this.handleContentList}
                             onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}
        />
    }
}