import React  from 'react';

import { FormLayout }          from "@dashboardComponents/Layout/Elements";
import { FormGenerique }       from "@pages/components/Bibli/Template/FormGenerique";

export function RoomFormulaire ({ type, onChangeContext, onUpdateList, element, oriUrl })
{
    let title = "Ajouter une pièce";
    let url = oriUrl;
    let msg = "Félicitation ! Vous avez ajouté une nouvelle pièce !"

    if(type === "update"){
        title = "Modifier " + element.name;
        url = oriUrl + "/" + element.id;
        msg = "La mise à jour s'est réalisée avec succès !";
    }

    let form = <FormGenerique
        context={type}
        url={url}
        name={element ? element.name : ""}
        onUpdateList={onUpdateList}
        onChangeContext={onChangeContext}
        messageSuccess={msg}
        btnTextAdd="Ajouter cette pièce"
        btnTextEdit="Modifier cette pièce"
    />

    return <FormLayout onChangeContext={onChangeContext} form={form}>{title}</FormLayout>
}