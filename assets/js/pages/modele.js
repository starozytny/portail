import '../../css/pages/modele.scss';

import React from "react";
import { render } from "react-dom";
import { Modeles } from "./components/Modele/Modeles";

let el = document.getElementById('modeles');
if(el){
    render(<Modeles {...el.dataset} oriUrl={"/espace-client/modeles"} />, el);
}