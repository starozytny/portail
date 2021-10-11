import '../../css/pages/property.scss';

import React from "react";
import { render } from "react-dom";
import { Properties } from "./components/Property/Properties";

let el = document.getElementById('properties');
if(el){
    render(<Properties {...el.dataset} oriUrl={"/espace-client/property"} />, el);
}