import '../../css/pages/modele.scss';

import React from "react";
import { render } from "react-dom";
import { Bibli } from "./components/Bibli/Bibli";

let el = document.getElementById('bibli');
if(el){
    render(<Bibli {...el.dataset} />, el);
}