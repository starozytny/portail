import React, { Component } from 'react';

import toastr               from "toastr";

import { ButtonIcon }       from "@dashboardComponents/Tools/Button";

import Sanitaze             from "@dashboardComponents/functions/sanitaze";

export class SelectElement extends Component {
    constructor(props) {
        super();

    }

    render () {

        return <>
            <div className="items-table">
                <div className="items items-default items-rooms">
                    <div className="item item-header">
                        <div className="item-header-selector" />
                        <div className="item-content">
                            <div className="item-body">
                                <div className="infos infos-col-2">
                                    <div className="col-1">Intitulé</div>
                                    <div className="col-2 actions">Actions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}