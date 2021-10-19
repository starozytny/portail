import '../../css/pages/tenant.scss';

import React from "react";
import { render } from "react-dom";
import { Tenants } from "./components/Tenant/Tenants";

let el = document.getElementById('tenants');
if(el){
    render(<Tenants {...el.dataset} oriUrl={"/espace-client/tenant"}/>, el);
}