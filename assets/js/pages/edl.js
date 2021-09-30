import '../../css/pages/edl.scss';

import Aside            from "../components/aside";
import SelectBien       from "./components/edl/select-bien";
import SelectTenants    from "./components/edl/select-tenants";
import AddBien          from "./components/edl/add-bien";

let view = document.querySelector("#view");
console.log(JSON.parse(view.dataset.donnees))

//*****
// Ouvrir les asides
//*****
Aside.manageAside('.btn-select-bien', '.aside-select-bien');
Aside.manageAside('.btn-select-tenants', '.aside-select-tenants');
Aside.manageAside('.btn-add-bien', '.aside-add-bien');

//*****
// Selections
//*****
SelectBien.selectBien();
SelectTenants.selectTenants();
AddBien.addBien();