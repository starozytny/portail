import '../../css/pages/edl.scss';

import Aside        from "../components/aside";

let view = document.querySelector("#view");
console.log(JSON.parse(view.dataset.donnees))

//*****
// Ouvrir l'aside select bien
//*****
Aside.manageAside('.btn-select-bien', '.aside-select-bien');