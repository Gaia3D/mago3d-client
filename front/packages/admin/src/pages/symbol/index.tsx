import SymbolSideBar from "../../layout/sidebar/symbol/SymbolSideBar";
import {Outlet} from "react-router-dom";

export function SymbolIndex() {
    return (
        <main>
            <SymbolSideBar />
            <Outlet />
        </main>
    )
}

export * from './group/List';
export * from './list/List';
export * from './register/RegisterForm';
export * from './register/UpdateForm';


