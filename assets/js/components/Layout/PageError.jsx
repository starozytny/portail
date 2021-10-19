import React from 'react';

import { Alert } from "@dashboardComponents/Tools/Alert";

export function PageError(){
    return <div className="page-error">
        <div className="page-error-container">
            <Alert type="danger" title="Récupération des données impossible">
                Veuillez réessayer ultérieurement. Si le problème persiste, veuillez contacter le support.
            </Alert>
        </div>
    </div>
}