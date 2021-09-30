import '../../css/pages/edl.scss';

import Aside        from "../components/aside";
import SelectBien   from "./components/edl/select-bien";
import SelectTenants   from "./components/edl/select-tenants";

let view = document.querySelector("#view");
console.log(JSON.parse(view.dataset.donnees))

//*****
// Ouvrir l'aside select bien
//*****
Aside.manageAside('.btn-select-bien', '.aside-select-bien');
Aside.manageAside('.btn-select-tenants', '.aside-select-tenants');

//*****
// Selections
//*****
SelectBien.selectBien();
SelectTenants.selectTenants();