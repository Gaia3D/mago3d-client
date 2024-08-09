import ReactDOM from "react-dom/client";
import {RecoilEnv, RecoilRoot} from "recoil";
import App from "./App";
import "@/locales/i18nconfig";
import "./assets/scss/style.scss";

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;
ReactDOM.createRoot(document.getElementById("container") as HTMLElement).render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
