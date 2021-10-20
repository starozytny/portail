import React, {Component} from "react";

import Sanitaze         from "@dashboardComponents/functions/sanitaze";

import { Alert }        from "@dashboardComponents/Tools/Alert";

import { ListTemplate }    from "../Template/ListTemplate";
import { ActionsTemplate } from "../Template/ActionsTemplate";

export class List extends Component {

    render () {
        const { data, categories, natures, elemsNatures, onChangeContext, onDelete } = this.props;

        let items = [];
        data.forEach(el => {

            let category = "";
            categories.forEach(cat => {
                if(cat.id === el.category){
                    category = cat.name
                }
            })

            let families = ["Classique", "Fonctionnel", "Electrique", "Sanitaire"];

            let elemNatures = [];
            elemsNatures.forEach(elem => {
                if(elem.element_id === el.id){
                    natures.forEach(nat => {
                        if(elem.nature_id === nat.id){
                            elemNatures.push(nat.name)
                        }
                    })
                }
            })

            let variants = el.variants !== "" ? JSON.parse(el.variants) : [];

            items.push(<div className="item" key={el.id}>
                <div className="item-content">
                    <div className="item-body">
                        <div className="infos infos-col-5">
                            <div className="col-1">
                                <div className="name">
                                    <span>{Sanitaze.capitalize(el.name)}</span>
                                </div>
                                <div className="sub">
                                    <span className={"icon-" + ((el.gender === "f" || el.gender === "fp") ? "female" : "male")} />
                                    <span className="pluriel">{(el.gender === "fp" || el.gender === "hp") ? "Pluriel" : "Singulier"}</span>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="sub">
                                    {Sanitaze.capitalize(category)}
                                    {category !== "" ? " / " : ""}
                                    {families[el.family]}
                                </div>
                            </div>
                            <div className="col-3">
                                {variants.length !== 0 && <div className="title-col"><u>Variantes</u> :</div>}
                                {variants.map((va, index) => {
                                    return <div className="sub" key={index}>{Sanitaze.capitalize(va)}</div>
                                })}
                            </div>
                            <div className="col-4">
                                {elemNatures.length !== 0 && <div className="title-col"><u>Natures</u> :</div>}
                                {elemNatures.map((elem, index) => {
                                    return <div className="sub" key={index}>{Sanitaze.capitalize(elem)}</div>
                                })}
                            </div>
                            <div className="col-5 actions">
                                <ActionsTemplate el={el} onChangeContext={onChangeContext} onDelete={onDelete}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
        })

        let content = <div className="items-table">
            <div className="items items-default">
                <div className="item item-header">
                    <div className="item-content">
                        <div className="item-body">
                            <div className="infos infos-col-5">
                                <div className="col-1">Intitulé</div>
                                <div className="col-2">Catégorie / Famille</div>
                                <div className="col-3">Variants</div>
                                <div className="col-4">Natures</div>
                                <div className="col-5 actions">Actions</div>
                            </div>
                        </div>
                    </div>
                </div>
                {items.length !== 0 ? items : <Alert>Aucun résultat.</Alert>}
            </div>
        </div>

        return <ListTemplate {...this.props} content={content} classToolbar="elements" addName="un élément"/>
    }
}