import React, { Component } from 'react';

import axios                   from "axios";
import toastr                  from "toastr";

import { Alert }               from "@dashboardComponents/Tools/Alert";
import { Button, ButtonIcon }  from "@dashboardComponents/Tools/Button";
import { FormLayout }          from "@dashboardComponents/Layout/Elements";
import { Input, Radiobox, Select, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";

import Validateur              from "@dashboardComponents/functions/validateur";
import Formulaire              from "@dashboardComponents/functions/Formulaire";
import Sanitaze                from "@dashboardComponents/functions/sanitaze";

export function ElementFormulaire ({ type, onChangeContext, onUpdateList, element, oriUrl, categories, natures, elemsNatures })
{
    let title = "Ajouter un élément";
    let url = oriUrl;
    let msg = "Félicitation ! Vous avez ajouté un nouveau élément !"
    let nats = [];

    if(type === "update"){
        title = "Modifier " + element.name;
        url = oriUrl + "/" + element.id;
        msg = "Félicitation ! La mise à jour s'est réalisée avec succès !";

        elemsNatures.forEach(elemNature => {
            if(elemNature.element_id === element.id){
                natures.forEach(nat => {
                    if(elemNature.nature_id === nat.id){
                        nats.push(nat.id)
                    }
                })
            }
        })
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
        nats={nats}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
        categories={categories}
        natures={natures}
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
            nats: props.nats,
            nature: "",
            errors: [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddVariant = this.handleAddVariant.bind(this);
        this.handleRemoveVariant = this.handleRemoveVariant.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleAddNature = this.handleAddNature.bind(this);
        this.handleRemoveNature = this.handleRemoveNature.bind(this);
    }

    handleChange = (e) => {
        this.setState({[e.currentTarget.name]: e.currentTarget.value})
    }

    handleAddVariant = () => {
        const { variants, variant } = this.state;

        if(variant !== ""){
            let newVariants = [];
            if(!variants.includes(variant)){
                newVariants = variants;
                newVariants.push(variant);

                this.setState({ variants: newVariants, variant: "" });
            }
        }
    }

    handleRemoveVariant = (variant) => {
        const { variants } = this.state;

        let newVariants = variants.filter(v => { return v !== variant });
        this.setState({ variants: newVariants });
    }

    handleChangeSelect = (e) => { this.setState({ nature: e !== undefined ? e.value : "" }) }

    handleAddNature = () => {
        const { nats, nature } = this.state;

        if(nature !== ""){
            let newNatures = [];
            if(!nats.includes(nature)){
                newNatures = nats;
                newNatures.push(nature);

                this.setState({ nats: newNatures, nature: "" });
            }
        }
    }

    handleRemoveNature = (nature) => {
        const { nats } = this.state;

        let newNatures = nats.filter(v => { return v !== nature });
        this.setState({ nats: newNatures });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url, messageSuccess } = this.props;
        const { name, gender, orthog, category, family } = this.state;

        let method = context === "create" ? "POST" : "PUT";
        this.setState({ success: false, errors: [] })

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

            axios({ method: method, url: url, data: self.state })
                .then(function (response) {
                    let data = response.data;
                    self.props.onUpdateList(data);
                    self.setState({ success: messageSuccess, errors: [] });
                    if(context === "create"){
                        self.setState({
                            name: "",
                            gender: 0,
                            orthog: 0,
                            category: 1,
                            family: 0,
                            variants: [],
                            nats: []
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error)
                    console.log(error.response)
                    Formulaire.displayErrors(self, error);
                })
                .then(() => {
                    Formulaire.loader(false);
                })
            ;
        }
    }

    render () {
        const { context, categories, natures } = this.props;
        const { errors, success, name, gender, orthog, category, family, variants, variant, nats, nature } = this.state;

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

        let naturesChoices = [];
        natures.forEach(nat => {
            naturesChoices.push({ value: nat.id, label: Sanitaze.capitalize(nat.name), identifiant: 'nat-' + nat.id })
        });

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

                <div className="line" />

                <div className="line line-3">
                    <Input valeur={variant} identifiant="variant" errors={errors} onChange={this.handleChange} >Variantes (facultatif)</Input>
                    <div className="form-group add-variant">
                        <label className="hide">Ajouter</label>
                        <Button icon="plus" outline={true} type="default" onClick={this.handleAddVariant}>Ajouter la variante</Button>
                    </div>
                    <div className="form-group">
                        {variants.length !== 0 && <>
                            <label htmlFor="listVariants">Liste des variantes ajoutées</label>
                            <div className="list-variants">
                                {variants.map((v, index) => {
                                    return <div className="item" key={index}>
                                        <div>{v}</div>
                                        <ButtonIcon icon="delete" onClick={() => this.handleRemoveVariant(v)}>Supprimer</ButtonIcon>
                                    </div>
                                })}
                            </div>
                        </>}
                    </div>
                </div>

                <div className="line line-3">
                    <SelectReactSelectize items={naturesChoices} identifiant="nature" valeur={nature} errors={errors} onChange={this.handleChangeSelect}>Natures (facultatif)</SelectReactSelectize>
                    <div className="form-group add-variant">
                        <label className="hide">Natures</label>
                        <Button icon="plus" outline={true} type="default" onClick={this.handleAddNature}>Associer des natures</Button>
                    </div>
                    <div className="form-group">
                        {nats.length !== 0 && <>
                            <label htmlFor="listVariants">Liste des natures associées</label>
                            <div className="list-variants">
                                {nats.map((n, index) => {

                                    let nString = "";
                                    natures.forEach(nat => {
                                        if(nat.id === n){
                                            nString = Sanitaze.capitalize(nat.name);
                                        }
                                    })

                                    return <div className="item" key={index}>
                                        <div>{nString}</div>
                                        <ButtonIcon icon="delete" onClick={() => this.handleRemoveNature(n)}>Supprimer</ButtonIcon>
                                    </div>
                                })}
                            </div>
                        </>}
                    </div>
                </div>

                <div className="line">
                    <div className="form-button">
                        <Button isSubmit={true}>{context === "create" ? "Ajouter cet élément" : 'Modifier cet élément'}</Button>
                    </div>
                </div>
            </form>
        </>
    }
}