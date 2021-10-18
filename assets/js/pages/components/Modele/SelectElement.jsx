import React, { Component } from 'react';

import toastr               from "toastr";

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";

import Sanitaze             from "@dashboardComponents/functions/sanitaze";

export class SelectElement extends Component {
    constructor(props) {
        super();

    }

    render () {
        const { data } = this.props;

        let categoriesChoices = [];
        data.categories.forEach(cat => {
            categoriesChoices.push({ value: cat.id, label: Sanitaze.capitalize(cat.name) + ' ('+ 0 +')', identifiant: 'cat-' + cat.id })
        });

        return <div className="select-elements">
            <div className="categories">
                {categoriesChoices.map(category => {
                    return <Button key={category.value} type="default" outline={true}>{category.label}</Button>
                })}
            </div>
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
        </div>
    }
}