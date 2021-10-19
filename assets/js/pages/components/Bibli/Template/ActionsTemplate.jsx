import React from "react";

import { ButtonIcon } from "@dashboardComponents/Tools/Button";

export function ActionsTemplate ({ el, onChangeContext, onDelete }) {
    return <>
        {el.is_native === "1" || el.is_used === "1" ?
            <div className="role">{el.is_native === "1" ? "Natif" : "Utilisé"}</div>
            : <>
                <ButtonIcon icon="compose" onClick={() => onChangeContext('update', el)}>Modifier</ButtonIcon>
                <ButtonIcon icon="delete" onClick={() => onDelete(el)}>Supprimer</ButtonIcon>
            </>}
    </>
}