import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";

import {Input, Radiobox, Select} from "@dashboardComponents/Tools/Fields";
import { Alert }               from "@dashboardComponents/Tools/Alert";
import {Button, ButtonIcon} from "@dashboardComponents/Tools/Button";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";

import Validateur              from "@dashboardComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";
import Sanitaze                from "@dashboardComponents/functions/sanitaze";

export function ElementFormulaire ({ type, onChangeContext, onUpdateList, element, oriUrl, categories, natures, elemsNatures })
{
    let title = "Ajouter un élément";
    let url = oriUrl;
    let msg = "Félicitation ! Vous avez ajouté un nouveau élément !"

    if(type === "update"){
        title = "Modifier " + element.name;
        url = oriUrl + "/" + element.id;
        msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";
    }

    let form = <ElementForm
        context={type}
        url={url}
        name={element ? element.name : ""}
        gender={(element && element.gender.substr(0,1) === "f") ? 1 : 0}
        orthog={(element && element.gender.substr(1) === "p") ? 1 : 0}
        category={element ? parseInt(element.category) : 1}
        family={element ? parseInt(element.family) : 0}
        variants={(element && element.variants !== "") ? JSON.parse(element.variants) : []}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
        categories={categories}
        natures={natures}
        elemsNatures={elemsNatures}
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}

export class ElementForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            gender: props.gender,
            orthog: props.orthog,
            category: props.category,
            family: props.family,
            variants: props.variants,
            variant: "",
            errors: [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddVariant = this.handleAddVariant.bind(this);
        this.handleRemoveVariant = this.handleRemoveVariant.bind(this);
    }

    handleChange = (e) => {
        this.setState({[e.currentTarget.name]: e.currentTarget.value})
    }

    handleAddVariant = (e) => {
        const { variants, variant } = this.state;

        if(variant !== ""){
            let newVariants = [];
            if(!variants.includes(variant)){
                newVariants = variants;
                newVariants.push(variant);
                // newVariants = variants.filter(v => { return v !== variant });

                this.setState({ variants: newVariants });
            }
        }
    }

    handleRemoveVariant = (variant) => {
        const { variants } = this.state;

        let newVariants = variants.filter(v => { return v !== variant });
        this.setState({ variants: newVariants });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { name, gender, orthog, category, family, variants } = this.state;

        let method = context === "create" ? "POST" : "PUT";
        this.setState({ success: false, errors: []})

        let paramsToValidate = [
            {type: "text", id: 'name', value: name},
            {type: "text", id: 'gender', value: gender},
            {type: "text", id: 'orthog', value: orthog},
            {type: "text", id: 'category', value: category},
            {type: "text", id: 'family', value: family},
        ];

        // validate global
        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            toastr.warning("Veuillez vérifier les informations transmises.");
            this.setState({ errors: validate.errors });
        }else{
            Formulaire.loader(true);
            let self = this;

            axios({ method: method, url: url, data: this.state })
                .then(function (response) {
                    let data = response.data;
                    console.log(response);
                    toastr.info(messageSuccess);
                    // location.reload();
                })
                .catch(function (error) {
                    console.log(error)
                    console.log(error.response)
                    Formulaire.loader(false);
                    Formulaire.displayErrors(self, error);
                })
            ;
        }
    }

    render () {
        const { context, categories } = this.props;
        const { errors, success, name, gender, orthog, category, family, variants, variant } = this.state;

        let categoriesChoices = [];
        categories.forEach(cat => {
            categoriesChoices.push({ value: cat.id, label: Sanitaze.capitalize(cat.name), identifiant: 'cat-' + cat.id })
        });

        let familiesChoices = [
            { value: 0, label: 'Classique', identifiant: 'classique' },
            { value: 1, label: 'Fonctionnel', identifiant: 'fonctionnel' },
            { value: 2, label: 'Electrique', identifiant: 'electrique' },
            { value: 3, label: 'Sanitaire', identifiant: 'sanitaire' },
        ];

        let genderItems = [
            { value: 0, label: 'Masculin', identifiant: 'masculin' },
            { value: 1, label: 'Féminin', identifiant: 'feminin' }
        ]

        let orthogItems = [
            { value: 0, label: 'Singulier', identifiant: 'singulier' },
            { value: 1, label: 'Pluriel', identifiant: 'pluriel' }
        ]

        return <>
            <form onSubmit={this.handleSubmit}>

                {success !== false && <Alert type="info">{success}</Alert>}

                <div className="line">
                    <Input valeur={name} identifiant="name" errors={errors} onChange={this.handleChange} >Intitulé</Input>
                </div>

                <div className="line line-2">
                    <Select items={categoriesChoices} identifiant="category" valeur={category} errors={errors} onChange={this.handleChange}>Catégorie</Select>
                    <Select items={familiesChoices} identifiant="family" valeur={family} errors={errors} onChange={this.handleChange}>Famille</Select>
                </div>

                <div className="line line-3">
                    <Radiobox items={genderItems} identifiant="gender" valeur={gender} errors={errors} onChange={this.handleChange}>Masculin ou féminin ?</Radiobox>
                    <Radiobox items={orthogItems} identifiant="orthog" valeur={orthog} errors={errors} onChange={this.handleChange}>Singulier ou pluriel ?</Radiobox>
                    <div className="form-group" />
                </div>

                <div className="line line-2">
                    <Input valeur={variant} identifiant="variant" errors={errors} onChange={this.handleChange} >Variantes</Input>
                    <div className="form-group add-variant">
                        <label className="hide">Ajouter</label>
                        <Button icon="plus" outline={true} type="default" onClick={this.handleAddVariant}>Ajouter la variante</Button>
                    </div>
                </div>

                {variants.length !== 0 && <div className="line">
                    <div className="form-group">
                        <label htmlFor="listVariants">Liste des variantes ajoutées</label>
                        <div className="list-variants">
                            {variants.map((v, index) => {
                                return <div className="item" key={index}>
                                    <div>{v}</div>
                                    <ButtonIcon icon="delete" onClick={() => this.handleRemoveVariant(v)}>Supprimer</ButtonIcon>
                                </div>
                            })}
                        </div>
                    </div>
                </div>}

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? "Ajouter cet élément" : 'Modifier cet élément'}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}